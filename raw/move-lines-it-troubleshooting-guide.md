# Move Lines - IT Troubleshooting Guide

## System Architecture

### Component Overview

```text
┌─────────────────────────────────────────────────────────────────────┐
│                         MOVE LINES SYSTEM                           │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐         ┌──────────────────────────────┐   │
│  │  Sales Order     │         │  Page 50040                  │   │
│  │  (Source)        │────────▶│  CLE Move Sales Lines        │   │
│  │                  │         │  (Worksheet)                 │   │
│  └──────────────────┘         └──────────────┬───────────────┘   │
│                                               │                    │
│                                               ▼                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Codeunit 50009: CLE Sales Management                      │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  • CreateListOfSalesLinesToMove()                          │  │
│  │  • MoveSalesLines()                                         │  │
│  │  • MoveSalesLinesToExistingOrder()                         │  │
│  │  • CreateNewSalesOrder()                                    │  │
│  │  • AdjustBlanketQuantity()                                  │  │
│  │  • CheckBlanketQtyAndCreateMessage()                       │  │
│  │  • CalculateAvailNewShipDate()                             │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                           │
│                       ▼                                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Temporary Table: CLE Copy Sales Line Buffer               │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  • Document Type, No., Line No.                            │  │
│  │  • Item No., Description, UOM                              │  │
│  │  • Current Quantity, Qty. to Move                          │  │
│  │  • Current Shipment Date, New Shipment Date                │  │
│  │  • Move to Document Type, Move to Document No.             │  │
│  │  • Qty. Available prior Change                             │  │
│  │  • Qty. Avail. New Shipment Date                           │  │
│  │  • Currently Unavailable, Unavailable on New Date          │  │
│  │  • Qty. to add to Blanket Order                            │  │
│  │  • Sales Line Set ID                                       │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                           │
│                       ▼                                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Integration Points                                         │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  • CLE Availability Calculation (availability forecast)     │ │
│  │  • CLE Availability Management (location filters)           │ │
│  │  • CLE ExpAvailOnParameterChange (date change calculation) │ │
│  │  • Sales Header/Line (standard BC tables)                  │ │
│  │  • Blanket Order management                                │ │
│  │  • Fee calculation (freight, credit card)                  │ │
│  │  • Excel Buffer (import/export)                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Initialization Flow

```text
User Opens Move Lines from Sales Order
            ↓
CreateListOfSalesLinesToMove(SalesHeader)
            ↓
Query: Sales Line WHERE

  - Document Type = Order
  - Document No. = Source Order
  - Type = Item
  - Outstanding Quantity <> 0

            ↓
For Each Sales Line:
  ├─ Get Item (Type = Inventory only)
  ├─ Copy to CLE Copy Sales Line Buffer (temporary)
  ├─ Calculate Current Availability:
  │    └─ AvailCalc.CalculateItemAvailabilityForDate()
  ├─ Set "Currently Unavailable" flag if < 0
  └─ Insert into Buffer
            ↓
Page.RunModal(Page::"CLE Move Sales Lines", Buffer)
```

### 2. Availability Recalculation Flow (Date Change)

```text
User Changes "New Shipment Date" on Line
            ↓
Trigger: OnValidate("New Shipment Date")
            ↓
CalculateNewAvailDateChange()
            ↓
CalculateAvailNewShipDate(CopySalesLineBuffer)
            ↓
Get Original Sales Line
            ↓
AvailCalcParam.CalculateExpectedAvailabilityDemandDateChange(
    SalesLine,
    UOM,
    New Date,
    false
)
            ↓
Set "Qty. Avail. New Shipment Date"
            ↓
Set "Unavailable on New Date" flag if <= 0
            ↓
Modify Buffer Record
```

### 3. Move Execution Flow

```text
User Clicks "Move Items"
            ↓
MoveLinesAction()
            ↓
Validate: ToOrderNo specified OR New Shipment Date + Shipment Method
            ↓
Filter Buffer: "Qty. to Move" > 0
            ↓
For Each Line with Qty. to Move > 0:
  ├─ Validate New Shipment Date exists
  ├─ Check availability if oversell prevention enabled
  └─ Call MoveSalesLines(Buffer, ShipmentMethodCode)
            ↓
MoveSalesLines(Buffer, ShipmentMethodCode)
  ├─ IF ToOrderNo <> '':
  │   └─ MoveSalesLinesToExistingOrder(Buffer)
  └─ ELSE:
      ├─ CreateNewSalesOrder(Buffer, ShipmentMethodCode)
      └─ MoveSalesLinesToExistingOrder(Buffer)
            ↓
AdjustBlanketQuantity(Buffer)
            ↓
Fire Event: OnAfterRunMoveLineToExistingOrder(SourceNo, TargetNo)
            ↓
Recalculate Fees on Both Orders (freight, CC charges)
```

### 4. Line Transfer Logic (MoveSalesLinesToExistingOrder)

```text
Get Source Sales Line
            ↓
Set "CW Avail. Calc. Inactive" = true (disable availability calc)
            ↓
Calculate New Source Quantity = Current - Qty. to Move
            ↓
Validate Source Line Quantity = New Source Quantity
  (If 0, line will be deleted)
            ↓
Set "CW Avail. Calc. Inactive" = false
            ↓
Modify Source Line
            ↓
Search Target Order for Matching Line:
  WHERE:

    - Document Type = Target Type
    - Document No. = Target No.
    - Type = Item
    - No. = Same Item
    - Unit Price = Same Price
    - Blanket Order No. = Same Blanket
    - Blanket Order Line No. = Same Blanket Line
    - Line Discount % = Same Discount
    - Sales Line Set ID = Same Set

            ↓
IF Match Found:
  ├─ Set "CW Avail. Calc. Inactive" = true
  ├─ Validate Quantity = Existing Qty + Qty. to Move
  ├─ Set "CW Avail. Calc. Inactive" = false
  └─ Modify Target Line
ELSE:
  ├─ Get Next Line No. (Last Line No. + 10000)
  ├─ Init New Target Line
  ├─ Validate Item No. (triggers default logic)
  ├─ Set Sales Line Set ID
  ├─ Insert Target Line
  ├─ Set Blanket Order references
  ├─ Set "CW Avail. Calc. Inactive" = true
  ├─ Validate Quantity = Qty. to Move
  ├─ Set "CW Avail. Calc. Inactive" = false
  ├─ Validate Customer Price Group
  ├─ Validate Unit Price
  └─ Modify Target Line
            ↓
Fire Event: OnAfterMoveLineToExistingOrder(SourceLine, TargetLine)
```

---

## Key Tables and Fields

### CLE Copy Sales Line Buffer (Temporary)

- **Purpose**: Worksheet buffer for UI and calculations
- **Lifetime**: Exists only during page session
- **Key Fields**:
  - `"Document Type"`, `"Document No."`, `"Line No."` - Source line reference
  - `"Move to Document Type"`, `"Move to Document No."` - Target order
  - `"Current Quantity"` - Outstanding qty on source
  - `"Qty. to Move"` - User-entered transfer amount
  - `"Qty. required to Move"` - Staging for Excel import
  - `"New Shipment Date"` - Target shipment date
  - `"Qty. Available prior Change"` - Availability on current date
  - `"Qty. Avail. New Shipment Date"` - Availability on new date
  - `"Currently Unavailable"` - Boolean flag
  - `"Unavailable on New Date"` - Boolean flag
  - `"Qty. to add to Blanket Order"` - Blanket adjustment amount
  - `"Sales Line Set ID"` - Grouped items identifier
  - `"Attention"` - Excel import validation flag

### Sales Line (Standard BC)

- **Modified Fields**:
  - `"CW Avail. Calc. Inactive"` - Boolean flag to disable availability recalculation during quantity changes
  - `"CW Sales Line Set ID"` - Groups related lines (kits, bundles)
  - `"Blanket Order No."`, `"Blanket Order Line No."` - Blanket order references

### Blanket Sales Line

- **Key Fields**:
  - `"CLE Blanket Qty.Remaining"` - Available quantity not yet used
  - `"CLE Blanket Qty.Used"` - Quantity allocated to orders
  - `"CLE Blanket Qty.Remain (Base)"` - Base UOM remaining
  - `"CLE Blanket Qty.Used (Base)"` - Base UOM used

---

## Common Issues and Solutions

### Issue 1: Lines Not Appearing in Worksheet

**Symptoms**: Move Lines opens but shows no lines or fewer lines than expected.

**Diagnostic Steps**:

1. Check sales line filters in code:

   ```al
   SalesLine.SetRange("Document Type", SalesHeader."Document Type");
   SalesLine.SetRange("Document No.", SalesHeader."No.");
   SalesLine.SetRange(Type, SalesLine.Type::Item);
   SalesLine.SetFilter("Outstanding Quantity", '<>0');
   ```

2. Verify SQL:

   ```sql
   SELECT [Document Type], [Document No_], [Line No_], [Type], [No_],
          [Outstanding Quantity], [Quantity], [Quantity Shipped]
   FROM [Sales Line]
   WHERE [Document Type] = 1  -- Order
     AND [Document No_] = 'SO-12345'
     AND [Type] = 2  -- Item
     AND [Outstanding Quantity] <> 0
   ```

3. Check Item Type:

   ```al
   if (item.Get(SalesLine."No.")) and (Item.Type = Item.Type::Inventory)
   ```

   Only **Inventory** items appear (not Service, Non-Inventory)

**Common Causes**:

- Line Type is not Item (could be G/L Account, Resource, etc.)
- Item Type is Service or Non-Inventory
- Outstanding Quantity = 0 (fully shipped/invoiced)
- Line has been deleted or archived

**Solution**: Verify sales lines meet all filter criteria. Review item card to ensure Type = Inventory.

---

### Issue 2: Availability Not Recalculating

**Symptoms**: "Qty. Avail. New Shipment Date" stays blank or doesn't update when date changes.

**Diagnostic Steps**:

1. Check trigger execution:
   - Set breakpoint in `CalculateNewAvailDateChange()`
   - Verify OnValidate("New Shipment Date") fires

2. Check availability calculation:

   ```al
   AvailCalcParam.CalculateExpectedAvailabilityDemandDateChange(
       SalesLine,
       SalesLine."Unit of Measure Code",
       CopySalesLineBuffer."New Shipment Date",
       false
   )
   ```

3. Verify availability codeunit is not returning error:

   ```al
   // Enable debugger in CLE ExpAvailOnParameterChange
   // Check for exceptions
   ```

4. Run manual availability query:

   ```sql
   -- Check Item Ledger Entries
   SELECT SUM([Remaining Quantity])
   FROM [Item Ledger Entry]
   WHERE [Item No_] = 'ITEM-001'
     AND [Location Code] IN ('...active locations...')

   -- Check Sales Lines (demand)
   SELECT SUM([Outstanding Qty_ (Base)])
   FROM [Sales Line]
   WHERE [Type] = 2
     AND [No_] = 'ITEM-001'
     AND [Shipment Date] <= '2026-02-28'
     AND [Outstanding Qty_ (Base)] > 0

   -- Check Purchase Lines (supply)
   SELECT SUM([Outstanding Qty_ (Base)])
   FROM [Purchase Line]
   WHERE [Type] = 2
     AND [No_] = 'ITEM-001'
     AND [Expected Receipt Date] <= '2026-02-28'
     AND [Outstanding Qty_ (Base)] > 0
   ```

**Common Causes**:

- Availability calculation codeunit error
- Location filter not including active locations
- Date format issue (regional settings)
- Performance timeout on complex calculations

**Solution**:

- Review event log for errors
- Verify CLE Availability Calculation codeunit is functioning
- Check location setup (ensure locations are active)
- Increase timeout for complex items with many transactions

---

### Issue 3: "Availability is not sufficient" Error When It Should Be

**Symptoms**: User gets error but availability shows positive.

**Diagnostic Steps**:

1. Check blanket order logic:

   ```al
   if CopySalesLineBuffer."Qty. to Move" <= CopySalesLineBuffer."Current Quantity" then
       exit;  // No blanket check needed

   QtyToTakeFromBlanket := CopySalesLineBuffer."Qty. to Move" -
                           CopySalesLineBuffer."Current Quantity";

   if QtyToTakeFromBlanket > CopySalesLineBuffer."Qty. Avail. New Shipment Date" then
       Error(AvailErrorMsg);
   ```

2. Verify calculation:
   - Qty. to Move = 75
   - Current Quantity = 50
   - Qty. to Take from Blanket = 75 - 50 = 25
   - Qty. Avail. New Shipment Date must be >= 25 (not 75)

3. Check if oversell prevention is enabled:

   ```sql
   SELECT [CW Prevent Oversells]
   FROM [CLE Clesen Setup]
   ```

**Common Causes**:

- Misunderstanding: Available qty must cover the **additional** amount, not total
- Availability changed between date validation and move execution
- Concurrent users modified demand/supply
- Blanket order remaining qty insufficient

**Solution**:

- Explain to user: availability must cover qty beyond current order
- Refresh page to recalculate latest availability
- Check blanket order remaining quantity
- Consider increasing blanket order if approved

---

### Issue 4: Lines Not Merging on Target Order

**Symptoms**: Expected lines to combine but created separate lines instead.

**Diagnostic Steps**:

1. Check merge criteria (ALL must match):

   ```al
   TargetSalesLine.SetRange("No.", CopySalesLineBuffer."No.");
   TargetSalesLine.SetRange("Unit Price", SourceSalesLine."Unit Price");
   TargetSalesLine.SetRange("Blanket Order No.", SourceSalesLine."Blanket Order No.");
   TargetSalesLine.SetRange("Blanket Order Line No.", SourceSalesLine."Blanket Order Line No.");
   TargetSalesLine.SetRange("Line Discount %", SourceSalesLine."Line Discount %");
   TargetSalesLine.SetRange("CW Sales Line Set ID", SourceSalesLine."CW Sales Line Set ID");
   ```

2. Compare source and target lines:

   ```sql
   -- Source Line
   SELECT [No_], [Unit Price], [Line Discount _], [Blanket Order No_],
          [Blanket Order Line No_], [CW Sales Line Set ID]
   FROM [Sales Line]
   WHERE [Document No_] = 'SOURCE-ORDER'
     AND [Line No_] = 10000

   -- Target Line
   SELECT [No_], [Unit Price], [Line Discount _], [Blanket Order No_],
          [Blanket Order Line No_], [CW Sales Line Set ID]
   FROM [Sales Line]
   WHERE [Document No_] = 'TARGET-ORDER'
     AND [No_] = 'ITEM-001'
   ```

3. Check for rounding differences:
   - Unit Price: 9.99 vs 9.990
   - Line Discount: 10.00 vs 10.0

**Common Causes**:

- Different unit prices (pricing changed between orders)
- Different line discounts
- Different blanket order references
- Different Sales Line Set IDs
- Decimal precision differences

**Solution**:

- This is correct behavior if criteria don't match
- If should merge, investigate why pricing differs
- Consider manually combining lines after move
- Review price list/customer price group setup

---

### Issue 5: Blanket Order Quantities Not Adjusting

**Symptoms**: After move, blanket order remaining qty incorrect.

**Diagnostic Steps**:

1. Check AdjustBlanketQuantity execution:

   ```al
   procedure AdjustBlanketQuantity(var CopySalesLineBuffer: Record "CLE Copy Sales Line Buffer" temporary)
   var
       SalesLine: Record "Sales Line";
       BlanketSalesLine: Record "Sales Line";
   begin
       SalesLine.Get(CopySalesLineBuffer."Document Type",
                     CopySalesLineBuffer."Document No.",
                     CopySalesLineBuffer."Line No.");

       if BlanketSalesLine.get(BlanketSalesLine."Document Type"::"Blanket Order",
                               SalesLine."Blanket Order No.",
                               SalesLine."Blanket Order Line No.") then begin
           if CopySalesLineBuffer."Qty. to add to Blanket Order" <> 0 then begin
               BlanketSalesLine.Validate(Quantity,
                   BlanketSalesLine.Quantity + CopySalesLineBuffer."Qty. to add to Blanket Order");
               BlanketSalesLine."CLE Blanket Qty.Remaining" :=
                   CheckAvailableQtyInBlanketOrderLine(BlanketSalesLine);
               BlanketSalesLine."CLE Blanket Qty.Used" :=
                   BlanketSalesLine.Quantity - BlanketSalesLine."CLE Blanket Qty.Remaining";
               BlanketSalesLine.Modify(true);
           end;
       end;
   end;
   ```

2. Verify blanket order references:

   ```sql
   -- Check Sales Line blanket references
   SELECT [Document No_], [Line No_], [Blanket Order No_], [Blanket Order Line No_]
   FROM [Sales Line]
   WHERE [Document No_] = 'SO-12345'
     AND [Line No_] = 10000

   -- Check Blanket Order Line
   SELECT [Document No_], [Line No_], [Quantity],
          [CLE Blanket Qty_Remaining], [CLE Blanket Qty_Used]
   FROM [Sales Line]
   WHERE [Document Type] = 4  -- Blanket Order
     AND [Document No_] = 'BLANKET-001'
     AND [Line No_] = 10000
   ```

3. Check CheckAvailableQtyInBlanketOrderLine function

**Common Causes**:

- Blanket order reference is blank
- Blanket order line doesn't exist (deleted)
- CheckAvailableQtyInBlanketOrderLine returns incorrect value
- Qty. to add to Blanket Order = 0 (no adjustment needed)

**Solution**:

- Verify blanket order line exists and is accessible
- Review CheckAvailableQtyInBlanketOrderLine logic
- Manually adjust blanket order if needed
- Ensure blanket order permissions are correct

---

### Issue 6: Excel Import Fails Silently

**Symptoms**: Import completes but no quantities populate.

**Diagnostic Steps**:

1. Check Excel file structure:
   - Column 1: No. (Item No.)
   - Column 2: Description
   - Column 3: Unit of Measure Code
   - Column 4: Current Quantity
   - Column 5: **Quantity To Move** (must be column 5)
   - Column 6: Qty. Available
   - Column 7: Shipment Date
   - Column 8: Line No.

2. Check import logic:

   ```al
   for Row := 3 to LastRow do begin  // Starts at row 3 (skip header)
       if ExcelBuffer.Get(Row, 8) then
           Evaluate(TempCopySalesLine."Line No.", ExcelBuffer."Cell Value as Text")

       if ExcelBuffer.Get(Row, 5) then begin  // Column 5 = Qty to Move
           Evaluate(TempCopySalesLine."Qty. to Move", ExcelBuffer."Cell Value as Text");
           TempCopySalesLine.Insert();
       end;
   end;
   ```

3. Check matching logic:

   ```al
   Rec.SetRange("No.", TempCopySalesLine."No.");
   Rec.SetRange("Line No.", TempCopySalesLine."Line No.");
   if Rec.FindFirst() then begin
       Rec."Qty. required to Move" := TempCopySalesLine."Qty. to Move";
       Rec.Modify();
   end;
   ```

4. Check for data type mismatches:
   - Line No. must be integer
   - Qty. to Move must be decimal
   - Excel cells must not contain formulas (values only)

**Common Causes**:

- Wrong Excel sheet name (must be "Sales Lines")
- Column order changed
- Line No. doesn't match (row deleted/added in Excel)
- Qty. to Move column has text instead of numbers
- Excel file saved in wrong format (.xlsx required)

**Solution**:

- Re-export to get correct template
- Only edit "Quantity To Move" column
- Don't add/delete rows
- Ensure numeric values in qty column
- Save as .xlsx format

---

### Issue 7: Fees Not Recalculating After Move

**Symptoms**: Freight or credit card fees unchanged after moving lines.

**Diagnostic Steps**:

1. Check event subscription:

   ```al
   [EventSubscriber(ObjectType::Codeunit, Codeunit::"CLE Sales Management",
                    'OnAfterRunMoveLineToExistingOrder', '', false, false)]
   local procedure OnAfterRunMoveLineToExistingOrder(SourceNo: Code[20]; TargetNo: Code[20])
   var
       SalesHeader: Record "Sales Header";
   begin
       if SalesHeader.Get(SalesHeader."Document Type"::Order, SourceNo) then
           RecalculateFees(SalesHeader);

       if SalesHeader.Get(SalesHeader."Document Type"::Order, TargetNo) then
           RecalculateFees(SalesHeader);
   end;
   ```

2. Verify fee calculation codeunit:
   - Check freight calculation active
   - Check credit card charge item configured
   - Check payment terms setup

3. Check order totals:

   ```sql
   -- Order totals before/after move
   SELECT [No_], SUM([Amount]) as [Total Amount]
   FROM [Sales Line]
   WHERE [Document Type] = 1
     AND [Document No_] IN ('SOURCE-ORDER', 'TARGET-ORDER')
   GROUP BY [No_]
   ```

**Common Causes**:

- Event subscriber not registered
- Fee calculation codeunit disabled or erroring
- Payment terms missing fee item configuration
- Order below minimum threshold for fees
- Fee items don't exist in system

**Solution**:

- Verify event subscriber is active
- Check fee calculation setup in General Ledger Setup
- Review payment terms configuration
- Manually trigger fee recalculation
- Check error log for fee calculation errors

---

### Issue 8: "CW Avail. Calc. Inactive" Causing Availability Issues

**Symptoms**: Availability calculations incorrect or not updating.

**Purpose of Flag**: Prevents recursive availability recalculation during quantity changes in move process.

**Diagnostic Steps**:

1. Check flag usage:

   ```al
   SourceSalesLine."CW Avail. Calc. Inactive" := true;
   SourceSalesLine.Validate(Quantity, NewSourceLineQty);  // Won't trigger avail calc
   SourceSalesLine."CW Avail. Calc. Inactive" := false;
   SourceSalesLine.Modify(true);  // Now avail calc will run
   ```

2. Verify flag is reset:

   ```sql
   -- Should be false after move completes
   SELECT [Document No_], [Line No_], [CW Avail_ Calc_ Inactive]
   FROM [Sales Line]
   WHERE [CW Avail_ Calc_ Inactive] = 1
   ```

3. Check for error during move that left flag = true

**Common Causes**:

- Error during move process left flag = true
- Concurrent user modified line during move
- Code path didn't reset flag (missing try-finally)

**Solution**:

```sql
-- Reset flags manually if stuck
UPDATE [Sales Line]
SET [CW Avail_ Calc_ Inactive] = 0
WHERE [CW Avail_ Calc_ Inactive] = 1
  AND [Document No_] IN ('affected orders')
```

---

## Performance Optimization

### Large Orders (100+ Lines)

**Issue**: Move Lines slow to open or move operations timeout.

**Optimization Strategies**:

1. **Use SetLoadFields** to reduce data retrieval:

   ```al
   SalesLine.SetLoadFields("Document Type", "Document No.", "Line No.", "No.",
                           "Description", "Sell-to Customer No.", "Unit of Measure Code",
                           "Outstanding Quantity", "Shipment Date", "Location Code",
                           "CW Sales Line Set ID");
   ```

2. **Batch availability calculations**:

   ```al
   // Instead of per-line calculation in loop:
   // Calculate all items at once, cache results
   ```

3. **Index optimization**:

   ```sql
   -- Ensure indexes exist on:
   CREATE NONCLUSTERED INDEX [IX_SalesLine_TypeNo_Outstanding]
   ON [Sales Line] ([Type], [No_], [Outstanding Quantity])
   INCLUDE ([Document Type], [Document No_], [Line No_])
   ```

4. **Excel import for bulk moves**: Recommended for 50+ lines

---

### Availability Calculation Performance

**Issue**: "Qty. Avail. New Shipment Date" calculation slow.

**Optimization**:

1. **Limit date range** in availability calculation:

   ```al
   // Only look forward, not all history
   ItemLedgerEntry.SetRange("Posting Date", StartDate, EndDate);
   ```

2. **Filter locations** to active only:

   ```al
   // Use CreateActiveLocationFilter() - excludes blocked locations
   ```

3. **Cache item ledger sums**:

   ```al
   // Store current inventory in temp table
   // Only calculate changes for date range
   ```

4. **Consider SIFT indexes**:

   ```sql
   -- Ensure SIFT indexes on Item Ledger Entry
   -- Remaining Quantity by Item, Location, Date
   ```

---

## Event Subscribers

### Extension Points

#### OnAfterMoveLineToExistingOrder

```al
[BusinessEvent(false)]
local procedure OnAfterMoveLineToExistingOrder(SourceLine: Record "Sales Line";
                                               TargetLine: Record "Sales Line")
begin
end;
```

**Use Cases**:

- Custom field transfers
- External system notifications
- Audit logging
- Custom validations

#### OnAfterRunMoveLineToExistingOrder

```al
[BusinessEvent(false)]
local procedure OnAfterRunMoveLineToExistingOrder(SourceNo: Code[20]; TargetNo: Code[20])
begin
end;
```

**Use Cases**:

- Fee recalculation
- Warehouse notification
- Customer notification
- Order status updates

### Example Subscriber

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"CLE Sales Management",
                 'OnAfterMoveLineToExistingOrder', '', false, false)]
local procedure LogMoveOperation(SourceLine: Record "Sales Line";
                                TargetLine: Record "Sales Line")
var
    AuditLog: Record "CLE Audit Log";
begin
    AuditLog.Init();
    AuditLog."Entry No." := GetNextEntryNo();
    AuditLog."Operation Type" := AuditLog."Operation Type"::"Move Line";
    AuditLog."Source Document No." := SourceLine."Document No.";
    AuditLog."Target Document No." := TargetLine."Document No.";
    AuditLog."Item No." := SourceLine."No.";
    AuditLog."Quantity" := TargetLine.Quantity;
    AuditLog."User ID" := UserId;
    AuditLog."Date Time" := CurrentDateTime;
    AuditLog.Insert();
end;
```

---

## Database Queries for Diagnostics

### Find Orders with Recently Moved Lines

```sql
-- Find source orders that have had lines moved (reduced quantities)
SELECT SH.[No_], SH.[Sell-to Customer No_], SH.[Sell-to Customer Name],
       SL.[No_] as [Item], SL.[Quantity], SL.[Quantity Shipped]
FROM [Sales Header] SH
INNER JOIN [Sales Line] SL ON SH.[Document Type] = SL.[Document Type]
                           AND SH.[No_] = SL.[Document No_]
WHERE SH.[Document Type] = 1  -- Order
  AND SL.[Quantity] < SL.[Quantity Shipped]  -- Unusual: shipped more than current qty
  AND SL.[Quantity] > 0
```

### Audit Trail for Moved Lines

```sql
-- Find modifications to sales lines (potential moves)
SELECT [User ID], [Date Time], [Table No_], [Document No_], [Line No_],
       [Field No_], [Old Value], [New Value]
FROM [Change Log Entry]
WHERE [Table No_] = 37  -- Sales Line
  AND [Field No_] = 15  -- Quantity
  AND [Date Time] >= DATEADD(day, -7, GETDATE())
  AND CAST([Old Value] AS DECIMAL) > CAST([New Value] AS DECIMAL)  -- Quantity reduced
ORDER BY [Date Time] DESC
```

### Check Blanket Order Integrity

```sql
-- Verify blanket order remaining quantities match usage
SELECT BSL.[Document No_], BSL.[Line No_],
       BSL.[Quantity] as [Blanket Qty],
       BSL.[CLE Blanket Qty_Remaining] as [Remaining],
       BSL.[CLE Blanket Qty_Used] as [Used],
       SUM(SL.[Quantity]) as [Actual Order Qty]
FROM [Sales Line] BSL
LEFT JOIN [Sales Line] SL ON SL.[Document Type] = 1  -- Order
                          AND SL.[Blanket Order No_] = BSL.[Document No_]
                          AND SL.[Blanket Order Line No_] = BSL.[Line No_]
WHERE BSL.[Document Type] = 4  -- Blanket Order
GROUP BY BSL.[Document No_], BSL.[Line No_], BSL.[Quantity],
         BSL.[CLE Blanket Qty_Remaining], BSL.[CLE Blanket Qty_Used]
HAVING BSL.[CLE Blanket Qty_Used] <> SUM(SL.[Quantity])  -- Mismatch
```

### Find Lines with Availability Issues

```sql
-- Items currently oversold
SELECT SL.[Document No_], SL.[No_], SL.[Description],
       SL.[Outstanding Qty_ (Base)] as [Demand],
       ISNULL(ILE.Available, 0) as [Available],
       ISNULL(ILE.Available, 0) - SL.[Outstanding Qty_ (Base)] as [Shortage]
FROM [Sales Line] SL
LEFT JOIN (
    SELECT [Item No_], [Location Code], SUM([Remaining Quantity]) as Available
    FROM [Item Ledger Entry]
    GROUP BY [Item No_], [Location Code]
) ILE ON ILE.[Item No_] = SL.[No_] AND ILE.[Location Code] = SL.[Location Code]
WHERE SL.[Document Type] = 1
  AND SL.[Type] = 2  -- Item
  AND SL.[Outstanding Qty_ (Base)] > 0
  AND (ISNULL(ILE.Available, 0) - SL.[Outstanding Qty_ (Base)]) < 0
ORDER BY [Shortage]
```

---

## Configuration Requirements

### CLE Clesen Setup Table

```al
field("CW Prevent Oversells"; Boolean)
{
    Caption = 'Prevent Oversells';
    Description = 'Prevent moving lines that would create negative availability';
}
```

**Effect on Move Lines**:

- If TRUE: System prevents moves that create oversells
- If FALSE: System allows moves even if creating negative availability (shows warning)

### Payment Terms Setup

```al
field("Credit Card Charge Item"; Code[20])
{
    TableRelation = Item;
    Caption = 'Credit Card Charge Item';
}
```

**Effect**: Determines CC fee item for automatic fee recalculation after moves.

### Location Setup

```al
field("CW Active"; Boolean)
{
    Caption = 'Active for Availability';
    Description = 'Include in availability calculations';
}
```

**Effect**: Only active locations included in availability forecasts.

---

## Testing Procedures

### Unit Test: Basic Move to Existing Order

```al
[Test]
procedure TestMoveLinesToExistingOrder()
var
    SourceSalesHeader: Record "Sales Header";
    TargetSalesHeader: Record "Sales Header";
    SalesLine: Record "Sales Line";
    Item: Record Item;
    CLESalesMgt: Codeunit "CLE Sales Management";
begin
    // [GIVEN] Source order with 100 units of Item A
    LibrarySales.CreateSalesHeader(SourceSalesHeader, SourceSalesHeader."Document Type"::Order,
                                   LibrarySales.CreateCustomerNo());
    LibraryInventory.CreateItem(Item);
    LibrarySales.CreateSalesLine(SalesLine, SourceSalesHeader, SalesLine.Type::Item,
                                Item."No.", 100);

    // [GIVEN] Target order for same customer
    LibrarySales.CreateSalesHeader(TargetSalesHeader, TargetSalesHeader."Document Type"::Order,
                                   SourceSalesHeader."Sell-to Customer No.");

    // [WHEN] Move 40 units to target order
    MoveSalesLine(SourceSalesHeader, TargetSalesHeader, Item."No.", 40);

    // [THEN] Source order has 60 units
    SalesLine.Get(SourceSalesHeader."Document Type", SourceSalesHeader."No.", SalesLine."Line No.");
    Assert.AreEqual(60, SalesLine.Quantity, 'Source line quantity incorrect');

    // [THEN] Target order has 40 units
    SalesLine.SetRange("Document No.", TargetSalesHeader."No.");
    SalesLine.SetRange("No.", Item."No.");
    SalesLine.FindFirst();
    Assert.AreEqual(40, SalesLine.Quantity, 'Target line quantity incorrect');
end;
```

### Unit Test: Move with Availability Check

```al
[Test]
procedure TestMoveWithInsufficientAvailability()
var
    SalesHeader: Record "Sales Header";
    SalesLine: Record "Sales Line";
    Item: Record Item;
    Location: Record Location;
begin
    // [GIVEN] Item with 50 units available
    LibraryInventory.CreateItem(Item);
    LibraryWarehouse.CreateLocation(Location);
    CreateItemInventory(Item."No.", Location.Code, 50);

    // [GIVEN] Order with 40 units
    LibrarySales.CreateSalesHeader(SalesHeader, SalesHeader."Document Type"::Order,
                                   LibrarySales.CreateCustomerNo());
    LibrarySales.CreateSalesLine(SalesLine, SalesHeader, SalesLine.Type::Item,
                                Item."No.", 40);

    // [WHEN] Attempt to move 80 units (more than available)
    // [THEN] Error: "Availability is not sufficient on that date"
    asserterror MoveSalesLineThatExceedsAvailability(SalesHeader, Item."No.", 80);
    Assert.ExpectedError('Availability is not sufficient');
end;
```

---

## Emergency Procedures

### Rollback a Move Operation

**Scenario**: Move completed but was incorrect, need to reverse.

**Steps**:

1. **Identify moved lines**:

   ```sql
   SELECT * FROM [Change Log Entry]
   WHERE [Table No_] = 37 AND [Field No_] = 15
     AND [Date Time] >= '2026-02-12 14:30:00'
     AND [User ID] = 'affected-user'
   ORDER BY [Date Time] DESC
   ```

2. **Manual reversal**:
   - Open target order, reduce quantities by moved amounts (or delete lines)
   - Open source order, increase quantities back to original
   - Adjust blanket orders if modified
   - Recalculate fees on both orders

3. **Database rollback** (use caution):

   ```sql
   BEGIN TRANSACTION

   -- Restore source line quantities
   UPDATE [Sales Line]
   SET [Quantity] = [original qty],
       [Outstanding Quantity] = [original outstanding]
   WHERE [Document No_] = 'SOURCE-ORDER'
     AND [Line No_] = 10000

   -- Remove or reduce target line quantities
   UPDATE [Sales Line]
   SET [Quantity] = [original qty],
       [Outstanding Quantity] = [original outstanding]
   WHERE [Document No_] = 'TARGET-ORDER'
     AND [Line No_] = 20000

   -- Restore blanket order quantities
   UPDATE [Sales Line]
   SET [CLE Blanket Qty_Remaining] = [original remaining],
       [CLE Blanket Qty_Used] = [original used]
   WHERE [Document Type] = 4
     AND [Document No_] = 'BLANKET-001'
     AND [Line No_] = 10000

   -- If rollback successful:
   COMMIT
   -- If any errors:
   ROLLBACK
   ```

4. **Verify integrity**:
   - Check availability calculations
   - Verify fee lines correct
   - Confirm blanket order remaining quantities match

---

## Debug Mode

### Enable Detailed Logging

Create event subscriber:

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"CLE Sales Management",
                 'OnAfterMoveLineToExistingOrder', '', false, false)]
local procedure LogMoveDetails(SourceLine: Record "Sales Line"; TargetLine: Record "Sales Line")
begin
    LogMessage(StrSubstNo('Move: Source %1 Line %2, Target %3 Line %4, Item %5, Qty %6',
                         SourceLine."Document No.", SourceLine."Line No.",
                         TargetLine."Document No.", TargetLine."Line No.",
                         TargetLine."No.", TargetLine.Quantity));
end;
```

### Performance Profiling

Monitor slow operations:

```sql
-- Find long-running move operations
SELECT session_id, start_time, command,
       DATEDIFF(SECOND, start_time, GETDATE()) as duration_seconds,
       text
FROM sys.dm_exec_requests
CROSS APPLY sys.dm_exec_sql_text(sql_handle)
WHERE text LIKE '%CLE Move Sales Lines%'
  AND DATEDIFF(SECOND, start_time, GETDATE()) > 30
```

---

## Version History

| Version | Date | Changes |
| --------- | ------ | --------- |
| 1.0 | Feb 2026 | Initial documentation |

---

## Contact

For technical issues not resolved by this guide:

- **AL Code Issues**: Development team
- **Database Issues**: Database administrator
- **Performance Issues**: System administrator
- **Business Logic Questions**: Business analyst / Product owner

---

Last Updated: February 2026

---

## Related documents

- [[move-lines-user-guide]]
