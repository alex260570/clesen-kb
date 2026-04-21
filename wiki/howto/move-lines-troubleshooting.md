---
title: Move Lines - IT Troubleshooting
type: howto
tags: [move-lines, troubleshooting, IT, sales-orders]
created: 2026-04-21
updated: 2026-04-21
sources: [move-lines-it-troubleshooting-guide.md]
---

# Move Lines - IT Troubleshooting

Technical reference for diagnosing and fixing Move Lines issues.

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────┐
│           MOVE LINES SYSTEM                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────────┐    ┌──────────────────┐   │
│  │  Sales Order     │───→│ Page 50040        │   │
│  │  (Source)        │    │ CLE Move Lines    │   │
│  └──────────────────┘    └────────┬─────────┘   │
│                                   │              │
│                                   ▼              │
│  ┌────────────────────────────────────────────┐ │
│  │ Codeunit 50009: CLE Sales Management      │ │
│  ├────────────────────────────────────────────┤ │
│  │ • CreateListOfSalesLinesToMove()          │ │
│  │ • MoveSalesLines()                        │ │
│  │ • MoveSalesLinesToExistingOrder()         │ │
│  │ • CreateNewSalesOrder()                   │ │
│  │ • AdjustBlanketQuantity()                 │ │
│  │ • CalculateAvailNewShipDate()             │ │
│  └────────────────┬──────────────────────────┘ │
│                   │                             │
│                   ▼                             │
│  ┌────────────────────────────────────────────┐ │
│  │ Integration Points:                        │ │
│  │ • CLE Availability Calculation            │ │
│  │ • CLE Availability Management             │ │
│  │ • Sales Header/Line (BC tables)           │ │
│  │ • Blanket Order management                │ │
│  │ • Fee calculation                         │ │
│  │ • Excel Buffer (import/export)            │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Common Issues and Solutions

### Issue 1: Lines Not Appearing in Worksheet

**Symptoms:** Move Lines opens but shows no lines or fewer lines than expected.

#### Diagnostic Steps

1. Check sales line filters:
   ```
   SalesLine.SetRange("Document Type", SalesHeader."Document Type");
   SalesLine.SetRange("Document No.", SalesHeader."No.");
   SalesLine.SetRange(Type, SalesLine.Type::Item);
   SalesLine.SetFilter("Outstanding Quantity", '<>0');
   ```

2. Verify SQL query returns expected records:
   ```
   SELECT [Document Type], [Document No_], [Line No_], [Type], [No_],
          [Outstanding Quantity]
   FROM [Sales Line]
   WHERE [Document Type] = 1  -- Order
     AND [Document No_] = 'SO-12345'
     AND [Type] = 2  -- Item
     AND [Outstanding Quantity] <> 0
   ```

3. Check Item Type:
   ```
   Only Inventory items appear (not Service, Non-Inventory)
   ```

#### Common Causes

- Line Type is not Item (could be G/L Account, Resource, etc.)
- Item Type is Service or Non-Inventory
- Outstanding Quantity = 0 (fully shipped/invoiced)
- Line has been deleted or archived

#### Solution

Verify sales lines meet all filter criteria. Review item card to ensure Type = Inventory.

---

### Issue 2: Availability Not Recalculating

**Symptoms:** "Qty. Avail. New Shipment Date" stays blank or doesn't update when date changes.

#### Diagnostic Steps

1. Check trigger execution:
   - Set breakpoint in `CalculateNewAvailDateChange()`
   - Verify OnValidate("New Shipment Date") fires

2. Check availability calculation:
   ```
   AvailCalcParam.CalculateExpectedAvailabilityDemandDateChange(
       SalesLine,
       SalesLine."Unit of Measure Code",
       CopySalesLineBuffer."New Shipment Date",
       false
   )
   ```

3. Verify availability codeunit is not returning error:
   - Enable debugger in CLE ExpAvailOnParameterChange
   - Check for exceptions

4. Run manual availability query to verify source data exists

#### Common Causes

- Availability calculation codeunit error
- Location filter not including active locations
- Date format issue (regional settings)
- Performance timeout on complex calculations

#### Solution

- Review event log for errors
- Verify CLE Availability Calculation codeunit is functioning
- Check location setup (ensure locations are active)
- Increase timeout for complex items with many transactions

---

### Issue 3: "Availability is not sufficient" Error When It Should Be

**Symptoms:** User gets error but availability shows positive.

#### Diagnostic Steps

1. Check blanket order logic:
   ```
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

3. Check if oversell prevention is enabled

#### Common Causes

- Misunderstanding: Available qty must cover the **additional** amount, not total
- Availability changed between date validation and move execution
- Concurrent users modified demand/supply
- Blanket order remaining qty insufficient

#### Solution

- Explain to user: availability must cover qty beyond current order
- Refresh page to recalculate latest availability
- Check blanket order remaining quantity
- Consider increasing blanket order if approved

---

### Issue 4: Lines Not Merging on Target Order

**Symptoms:** Expected lines to combine but created separate lines instead.

#### Diagnostic Steps

Check that ALL of these match (merge criteria):

```
TargetSalesLine.SetRange("No.", CopySalesLineBuffer."No.");
TargetSalesLine.SetRange("Unit Price", SourceSalesLine."Unit Price");
TargetSalesLine.SetRange("Blanket Order No.", SourceSalesLine."Blanket Order No.");
TargetSalesLine.SetRange("Blanket Order Line No.", SourceSalesLine."Blanket Order Line No.");
TargetSalesLine.SetRange("Line Discount %", SourceSalesLine."Line Discount %");
TargetSalesLine.SetRange("CW Sales Line Set ID", SourceSalesLine."CW Sales Line Set ID");
```

Compare source and target line fields in SQL to spot differences in:
- Unit Price (pricing changed between orders)
- Line Discount
- Blanket order references
- Sales Line Set ID
- Decimal precision

#### Common Causes

- Different unit prices (pricing changed between orders)
- Different line discounts
- Different blanket order references
- Different Sales Line Set IDs
- Decimal precision differences

#### Solution

- This is correct behavior if criteria don't match
- If should merge, investigate why pricing differs
- Consider manually combining lines after move
- Review price list/customer price group setup

---

### Issue 5: Blanket Order Quantities Not Adjusting

**Symptoms:** After move, blanket order remaining qty incorrect.

#### Diagnostic Steps

1. Check AdjustBlanketQuantity execution:
   - Verify procedure is called after move completes
   - Check that blanket order references are not blank

2. Verify blanket order references exist:
   ```sql
   SELECT [Document No_], [Line No_], [Blanket Order No_], [Blanket Order Line No_]
   FROM [Sales Line]
   WHERE [Document No_] = 'SO-12345'
   ```

3. Check CheckAvailableQtyInBlanketOrderLine function return values

#### Common Causes

- Blanket order reference is blank
- Blanket order line doesn't exist (deleted)
- CheckAvailableQtyInBlanketOrderLine returns incorrect value
- Qty. to add to Blanket Order = 0 (no adjustment needed)

#### Solution

- Verify blanket order line exists and is accessible
- Review CheckAvailableQtyInBlanketOrderLine logic
- Manually adjust blanket order if needed
- Ensure blanket order permissions are correct

---

### Issue 6: Excel Import Fails Silently

**Symptoms:** Import completes but no quantities populate.

#### Diagnostic Steps

1. Check Excel file structure (must have these columns in order):
   - Column 1: No. (Item No.)
   - Column 2: Description
   - Column 3: Unit of Measure Code
   - Column 4: Current Quantity
   - Column 5: **Quantity To Move** (must be column 5)
   - Column 6: Qty. Available
   - Column 7: Shipment Date
   - Column 8: Line No.

2. Check import matching logic:
   ```
   SalesLine matched by: No. + Line No.
   ```

3. Check for data type mismatches:
   - Line No. must be integer
   - Qty. to Move must be decimal
   - Excel cells must contain values (not formulas)

#### Common Causes

- Wrong Excel sheet name (must be "Sales Lines")
- Column order changed
- Line No. doesn't match (row deleted/added in Excel)
- Qty. to Move column has text instead of numbers
- Excel file saved in wrong format (.xlsx required)

#### Solution

- Re-export to get correct template
- Only edit "Quantity To Move" column
- Don't add/delete rows
- Ensure numeric values in qty column
- Save as .xlsx format

---

### Issue 7: Fees Not Recalculating After Move

**Symptoms:** Freight or credit card fees unchanged after moving lines.

#### Diagnostic Steps

1. Check event subscription is registered:
   ```
   OnAfterRunMoveLineToExistingOrder event fires with SourceNo and TargetNo
   ```

2. Verify fee calculation codeunit:
   - Check freight calculation active
   - Check credit card charge item configured
   - Check payment terms setup

3. Check order totals before/after move (should change)

#### Common Causes

- Event subscriber not registered
- Fee calculation codeunit disabled or erroring
- Payment terms missing fee item configuration
- Order below minimum threshold for fees
- Fee items don't exist in system

#### Solution

- Verify event subscriber is active
- Check fee calculation setup in General Ledger Setup
- Review payment terms configuration
- Manually trigger fee recalculation
- Check error log for fee calculation errors

---

### Issue 8: "CW Avail. Calc. Inactive" Causing Availability Issues

**Symptoms:** Availability calculations incorrect or not updating.

#### Purpose of Flag

Prevents recursive availability recalculation during quantity changes in move process.

#### Diagnostic Steps

1. Check flag usage:
   ```
   SourceSalesLine."CW Avail. Calc. Inactive" := true;
   SourceSalesLine.Validate(Quantity, NewSourceLineQty);  // Won't trigger avail calc
   SourceSalesLine."CW Avail. Calc. Inactive" := false;
   SourceSalesLine.Modify(true);  // Now avail calc will run
   ```

2. Verify flag is reset after move:
   ```sql
   -- Should be false after move completes
   SELECT [Document No_], [Line No_], [CW Avail_ Calc_ Inactive]
   FROM [Sales Line]
   WHERE [CW Avail_ Calc_ Inactive] = 1
   ```

3. Check for error during move that left flag = true

#### Common Causes

- Error during move process left flag = true
- Concurrent user modified line during move
- Code path didn't reset flag (missing try-finally)

#### Solution

Reset flags manually if stuck:
```sql
UPDATE [Sales Line]
SET [CW Avail_ Calc_ Inactive] = 0
WHERE [CW Avail_ Calc_ Inactive] = 1
  AND [Document No_] IN ('affected orders')
```

---

## Performance Optimization

### Large Orders (100+ Lines)

**Issue:** Move Lines slow to open or move operations timeout.

#### Optimization Strategies

1. **Use SetLoadFields** to reduce data retrieval:
   ```
   Load only essential fields needed for display and calculation
   ```

2. **Batch availability calculations:**
   ```
   Calculate all items at once, cache results
   Don't calculate per-line in loop
   ```

3. **Index optimization:**
   ```sql
   -- Ensure indexes exist on:
   CREATE NONCLUSTERED INDEX [IX_SalesLine_TypeNo_Outstanding]
   ON [Sales Line] ([Type], [No_], [Outstanding Quantity])
   ```

4. **Excel import for bulk moves:** Recommended for 50+ lines

### Availability Calculation Performance

**Issue:** "Qty. Avail. New Shipment Date" calculation slow.

#### Optimization

1. Limit date range in availability calculation (only look forward, not history)
2. Filter locations to active only
3. Cache item ledger sums
4. Ensure SIFT indexes on Item Ledger Entry

---

## Configuration Requirements

### CLE Clesen Setup Table

```
field("CW Prevent Oversells"; Boolean)
{
    Caption = 'Prevent Oversells';
    Description = 'Prevent moving lines that would create negative availability';
}
```

**Effect on Move Lines:**

- If TRUE: System prevents moves that create oversells
- If FALSE: System allows moves even if creating negative availability

### Payment Terms Setup

```
field("Credit Card Charge Item"; Code[20])
{
    TableRelation = Item;
}
```

**Effect:** Determines CC fee item for automatic fee recalculation.

### Location Setup

```
field("CW Active"; Boolean)
{
    Caption = 'Active for Availability';
}
```

**Effect:** Only active locations included in availability calculations.

---

## Database Queries for Diagnostics

### Find Orders with Recently Moved Lines

```sql
SELECT SH.[No_], SH.[Sell-to Customer No_],
       SL.[No_] as [Item], SL.[Quantity], SL.[Quantity Shipped]
FROM [Sales Header] SH
INNER JOIN [Sales Line] SL ON SH.[Document Type] = SL.[Document Type]
                          AND SH.[No_] = SL.[Document No_]
WHERE SH.[Document Type] = 1
  AND SL.[Quantity] < SL.[Quantity Shipped]
  AND SL.[Quantity] > 0
```

### Audit Trail for Moved Lines

```sql
SELECT [User ID], [Date Time], [Table No_], [Document No_], [Line No_],
       [Field No_], [Old Value], [New Value]
FROM [Change Log Entry]
WHERE [Table No_] = 37  -- Sales Line
  AND [Field No_] = 15  -- Quantity
  AND [Date Time] >= DATEADD(day, -7, GETDATE())
ORDER BY [Date Time] DESC
```

### Check Blanket Order Integrity

```sql
SELECT BSL.[Document No_], BSL.[Line No_],
       BSL.[Quantity] as [Blanket Qty],
       BSL.[CLE Blanket Qty_Remaining] as [Remaining],
       SUM(SL.[Quantity]) as [Actual Order Qty]
FROM [Sales Line] BSL
LEFT JOIN [Sales Line] SL ON SL.[Document Type] = 1
                         AND SL.[Blanket Order No_] = BSL.[Document No_]
WHERE BSL.[Document Type] = 4  -- Blanket Order
GROUP BY BSL.[Document No_], BSL.[Line No_], BSL.[Quantity],
         BSL.[CLE Blanket Qty_Remaining]
HAVING BSL.[CLE Blanket Qty_Used] <> SUM(SL.[Quantity])
```

---

## Emergency Procedures

### Rollback a Move Operation

**Scenario:** Move completed but was incorrect, need to reverse.

#### Steps

1. **Identify moved lines** using Change Log Entry
2. **Manual reversal:**
   - Open target order, reduce/delete moved lines
   - Open source order, increase quantities back
   - Adjust blanket orders if modified
   - Recalculate fees on both orders

3. **Database rollback** (use caution):
   - Update source/target line quantities
   - Restore blanket order quantities
   - COMMIT or ROLLBACK based on success

4. **Verify integrity:**
   - Check availability calculations
   - Verify fee lines correct
   - Confirm blanket order remaining quantities match

---

## Related Pages

- [[move-lines]] — User guide for Move Lines
- [[availability-system]] — System overview
- [[availability-troubleshooting]] — Availability IT troubleshooting
