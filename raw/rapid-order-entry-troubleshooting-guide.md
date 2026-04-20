# Rapid Order Entry - IT Staff Troubleshooting Guide

## System Overview

**Codeunit:** `50056 "CLE Order Entry Management"`
**Page:** `50071 "CLE Rapid Order Entry"`
**Temporary Table:** `50042 "CLE Rapid Order Entry Line"`
**Variables Codeunit:** `CLE Order Entry Variables`

## Architecture

### Flow Diagram

```
Sales Order/Blanket Order
    ↓
[Rapid Order Entry Action]
    ↓
Codeunit 50056: CreateList()
    ↓
├─→ Validate Shipment Date
├─→ AddSalesLines() [Load existing lines]
├─→ AddItems() [Load available items]
├─→ Set session variables
└─→ Open Page 50071
    ↓
[User enters quantities]
    ↓
[OK Button]
    ↓
AddItemsToOrder()
    ↓
├─→ Update existing sales lines
├─→ Create new sales lines
├─→ Recalculate freight (if enabled)
└─→ Add CC fees (if enabled)
```

### Key Components

1. **Temporary Table Pattern**
   - All data held in `CLE Rapid Order Entry Line` temporary record
   - No database writes until user clicks OK
   - Allows cancellation without side effects

2. **Session Variables**
   - `CLE Order Entry Variables` codeunit stores context
   - Holds: Sales Header, Last Line No., Shipment Date Block flag
   - Cleared after operation completes

3. **Integration Points**
   - `CLE Availability Management` - Season detection, location filters
   - `CLE Availability Calculation` - Real-time availability
   - `CLE Sales Fee Management` - Freight and CC fee handling
   - `CLE Fee Status` - Fee calculation flags

## Common Issues

### Issue: "Please enter a Shipment Date" Message

**Symptom:** User cannot open Rapid Order Entry

**Cause:** `SalesHeader."Shipment Date" = 0D`

**Resolution:**

1. Verify shipment date field on sales header
2. Check if field is editable (may be locked by workflow)
3. Verify date is not blank or 0D

**Code Location:** `CreateList()` procedure, line ~9

```al
if SalesHeader."Shipment Date" = 0D then begin
    Message('Please enter a Shipment Date.');
    exit;
end;
```

**Prevention:** Consider making shipment date required on sales header

---

### Issue: No Items Appear in Worksheet

**Symptom:** Worksheet opens but shows no items

**Diagnosis Steps:**

1. **Check Season Assignment**

   ```sql
   -- Verify items have season flags set
   SELECT "No.", "Description",
          "CLE Spring Item", "CLE Summer Item",
          "CLE Fall Item", "CLE Winter Item"
   FROM Item
   WHERE "Sales Blocked" = 0
   AND Type = 0
   ```

2. **Verify Season Calculation**
   - Season determined by: `AvailMgt.GetSeasonFromDateMultiple()`
   - Shipment date maps to season(s)
   - Multiple seasons may apply during transitions

3. **Check Item Filters**

   ```al
   Item.SetRange("Sales Blocked", false);
   Item.SetRange(Type, Item.Type::Inventory);
   ```

**Possible Causes:**

- All items sales-blocked
- No items marked for the season
- Items not set as Inventory type
- Shipment date falls outside all season ranges

**Resolution:**

1. Update item season flags
2. Check sales blocked status
3. Verify item type = Inventory
4. Review season date ranges in Availability Management

**Code Location:** `AddItems()` procedure, line ~96-152

---

### Issue: Merged Lines Warning/Behavior

**Symptom:** Shipment date becomes locked after using Rapid Order Entry

**Cause:** Multiple sales lines for same item with different shipment dates

**Behavior:**

- `AddSalesLines()` combines duplicate items into single temporary record
- Sets `"Merged Line" := true`
- Returns `HasMergedLines := true`
- `SetShipmentDateChangeBlocked()` returns true
- Stored in session via `OrderEntryVariables.SetInitialValues()`

**Resolution:**

1. Explain to user why date is locked
2. If date change is necessary:
   - User must manually split or delete merged lines
   - Then can change header shipment date
   - Then use Rapid Order Entry again

**Code Location:**

- `AddSalesLines()` procedure, line ~37-88
- `SetShipmentDateChangeBlocked()` procedure, line ~18-24

**Prevention:**

- Avoid creating duplicate item lines with different dates
- Use single line and adjust quantity instead

---

### Issue: Availability Shows Zero But Stock Exists

**Symptom:** `Qty. Available` shows 0 but inventory exists

**Diagnosis:**

1. **Check Location Filters**

   ```al
   LocationFilter := AvailMgt.CreateActiveLocationFilter();
   ```

   - Only ACTIVE locations are included
   - Verify Location."CLE Active Location" = true

2. **Verify Date Calculation**
   - Availability calculated FOR the shipment date
   - Future inbounds may not be included
   - Check `CalculateItemAvailabilityForDate()` logic

3. **Check UOM**
   - Availability calculated in Sales UOM, not Base UOM
   - Verify UOM conversions are correct

**SQL Diagnostic Query:**
```sql
-- Check item ledger for specific item
SELECT "Location Code", "Remaining Quantity", "Lot No."
FROM "Item Ledger Entry"
WHERE "Item No." = 'ITEM123'
AND "Remaining Quantity" > 0
```

**Resolution:**

1. Activate required locations
2. Verify availability calculation codeunit (50064)
3. Check date ranges and inbound orders
4. Review UOM setup

**Code Location:** `AddItems()` and `AddSalesLines()` procedures, availability calculation calls

---

### Issue: Items Added But Not Appearing on Order

**Symptom:** User adds items via Rapid Order Entry but they don't appear

**Diagnosis:**

1. **Check if OK was clicked**
   - Only `Action::LookupOK` triggers save
   - Cancel/Escape exits without saving

2. **Verify Quantity Changed Flag**

   ```al
   RapidOrderEntryLine.SetRange("Quantity Changed", true);
   ```

   - Only items with changed quantities are processed
   - Check if validation triggers flag properly

3. **Check for Errors in AddItemsToOrder**
   - Examine transaction errors
   - Check sales line validation logic

4. **Verify Line Numbers**
   - Starting line no. = LastSalesLineNo + 10000
   - Increments by 10000 per line

**Resolution:**

1. Test with debugger to see which lines process
2. Check for validation errors in Sales Line table
3. Verify "Quantity Changed" flag is set when qty. modified
4. Review event subscribers that may block line creation

**Code Location:** `AddItemsToOrder()` procedure, line ~154-212

---

### Issue: Freight/CC Fees Not Calculating

**Symptom:** Auto fees don't recalculate after using Rapid Order Entry

**Cause:** Fee calculation flags not properly managed

**Diagnosis:**

1. **Check Clesen Setup**

   ```al
   if ClesenSetup.AutoFreightCharges = true then
   if ClesenSetup.AutomaticCreditCardCharges = true then
   ```

2. **Verify Fee Status Flags**

   ```al
   FeeStatus.SetFreightChargeLineCalculationInactive(true);
   FeeStatus.SetCreditCardFeeLineCalculationInactive(true);
   ```

3. **Check Document Type**
   - Fee logic only runs for Sales Orders
   - Not for Blanket Orders or Quotes

**Resolution:**

1. Enable auto-fees in Clesen Setup
2. Verify document type = Order
3. Check Fee Status codeunit for flag persistence
4. Ensure deletion happens before recalculation:
   - `SalesFeeMgt.DeleteFreightLines()`
   - `SalesFeeMgt.DeleteCCLine()`

**Code Location:** `AddItemsToOrder()` procedure, line ~165-211

---

### Issue: Performance/Timeout on Large Item Lists

**Symptom:** Worksheet slow to load or times out

**Diagnosis:**

1. **Check Item Count**
   - Count items matching season filter
   - Large catalogs (>10,000 items) may be slow

2. **Review Field Loading**

   ```al
   Item.SetLoadFields("No.", Description, "Description 2", ...);
   ```

   - Only necessary fields loaded
   - Adding fields increases load time

3. **Check Availability Calculations**
   - Availability calculated per item
   - Multiple location queries per item
   - Can be expensive for large catalogs

**Resolution:**

1. Optimize availability calculation queries
2. Consider caching availability results
3. Add indexes on season flag fields
4. Implement pagination if catalog very large
5. Review `CalculateItemAvailabilityForDate()` performance

**SQL Optimization:**
```sql
-- Add indexes if missing
CREATE INDEX IX_Item_SeasonFlags
ON Item("CLE Spring Item", "CLE Summer Item", "CLE Fall Item", "CLE Winter Item")
WHERE "Sales Blocked" = 0 AND Type = 0;
```

---

### Issue: Merged Lines Incorrect Totals

**Symptom:** Current Qty shows wrong total when lines merged

**Diagnosis:**

1. **Check UOM Consistency**
   - All lines for same item should have same UOM
   - System adds quantities directly without conversion

2. **Verify Line Filters**

   ```al
   SalesLine.SetRange("Document Type", SalesHeader."Document Type");
   SalesLine.SetRange("Document No.", SalesHeader."No.");
   SalesLine.SetRange(Type, SalesLine.Type::Item);
   SalesLine.SetRange("No.", RapidOrderEntryLine."Item No.");
   ```

3. **Check for Non-Item Lines**
   - Only Item lines included
   - Comments, charges, etc. excluded

**Resolution:**

1. Verify all sales lines have correct item no.
2. Check UOM consistency across lines
3. Review merge logic in `AddSalesLines()`

**Code Location:** `AddSalesLines()` procedure, line ~46-60

---

## Debugging Guide

### Enable Verbose Logging

1. Add temporary variables in `CreateList()`:

   ```al
   var
       DebugMsg: Text;
   ```

2. Insert logging points:

   ```al
   DebugMsg := 'Items loaded: ' + Format(RapidOrderEntryLine.Count);
   Message(DebugMsg);
   ```

### Breakpoint Locations

Key breakpoints for debugging:

1. **Line 9** - Shipment date validation
2. **Line 37** - Start of AddSalesLines
3. **Line 96** - Start of AddItems
4. **Line 154** - Start of AddItemsToOrder
5. **Line 172** - Freight charge deletion
6. **Line 189** - Sales line update loop

### Temporary Table Inspection

During debugging, inspect temporary table:
```al
RapidOrderEntryLine.FindSet();
repeat
    // Examine each record
until RapidOrderEntryLine.Next() = 0;
```

Check:

- Record count
- Source field (Item vs. Sales Line)
- Quantity Changed flag
- Merged Line flag

### Session Variable Inspection

```al
// In OrderEntryVariables codeunit
procedure GetStoredHeader(): Record "Sales Header"
procedure GetLastLineNo(): Integer
procedure GetShipmentDateBlocked(): Boolean
```

---

## Configuration Requirements

### Table: CLE Clesen Setup

| Field | Purpose | Impact if Disabled |
| ------- | --------- | ------------------- |
| `AutoFreightCharges` | Auto-calculate freight on orders | Manual freight entry required |
| `AutomaticCreditCardCharges` | Auto-add CC fees | Manual CC fee entry required |

### Table: Location

| Field | Purpose | Impact if Disabled |
| ------- | --------- | ------------------- |
| `CLE Active Location` | Include in availability calc | Location excluded from avail. |

### Table: Item

| Field | Required | Purpose |
| ------- | ---------- | --------- |
| `Type` | = Inventory | Only inventory items shown |
| `Sales Blocked` | = false | Blocked items excluded |
| `CLE Spring/Summer/Fall/Winter Item` | At least one = true | Determines season visibility |
| `Sales Unit of Measure` | Recommended | Defaults to Base UOM if blank |

---

## Database Schema

### Temporary Table Structure: CLE Rapid Order Entry Line

```
PK: "Item No."

Fields:

- Document Type (Order/Blanket Order/Quote)
- Document No.
- Item No. [PK]
- Description (from Item.Description 2)
- Pot Size Code
- Unit of Measure Code
- Unit of Measure (description)
- Current Qty. (sum of existing lines)
- New Qty. (user entered)
- Requested Quantity
- Qty. Available (calculated)
- Shipment Date
- Sell-to Customer No.
- Source (Item | Sales Line)

- Season (Spring|Summer|Fall|Winter)

- Unit Price
- Quantity Changed (boolean)
- Merged Line (boolean)
- CLE AvailStatus (Available|Not Available|Negative)

```

### Key Relationships

```
Sales Header 1 ──→ ∞ Sales Line
                      ↓
                 (via temp table)
                      ↓
            CLE Rapid Order Entry Line (temporary)
                      ↓
                    Item
                      ↓
            CLE Availability Calculation
```

---

## Testing Scenarios

### Test Case 1: New Order with New Items

1. Create sales order
2. Set shipment date in Spring range
3. Open Rapid Order Entry
4. Verify only Spring items appear
5. Add quantities to 3 items
6. Click OK
7. Verify 3 sales lines created
8. Verify freight recalculated (if enabled)

**Expected:** 3 new lines with correct quantities and fees

---

### Test Case 2: Order with Existing Items

1. Create sales order with 2 item lines
2. Open Rapid Order Entry
3. Verify items appear with Current Qty populated
4. Change New Qty for existing items
5. Add new item
6. Click OK
7. Verify existing lines updated
8. Verify new line created

**Expected:** Existing lines updated, new line added, fees recalculated

---

### Test Case 3: Merged Lines

1. Create sales order
2. Add Item A, Qty 10
3. Add Item A again, Qty 5 (same line)
4. Open Rapid Order Entry
5. Verify Item A shows Current Qty = 15
6. Verify "Merged Line" = true
7. Change to New Qty = 20
8. Click OK
9. Verify original lines updated to total 20

**Expected:** Both original lines updated proportionally or one line updated

---

### Test Case 4: Season Transitions

1. Set shipment date to season transition (e.g., May 31)
2. Open Rapid Order Entry
3. Verify items from multiple seasons appear
4. Verify Spring and Summer items both visible

**Expected:** Items from transitioning seasons both shown

---

### Test Case 5: Blanket Order

1. Create blanket order
2. Set shipment date
3. Open Rapid Order Entry
4. Add items
5. Click OK
6. Verify no freight calculation triggered
7. Verify no CC fee calculation triggered

**Expected:** Items added, no auto-fees (even if enabled)

---

## Performance Benchmarks

### Expected Load Times

| Item Count | Expected Load Time |
| ------------ | ------------------- |
| < 1,000 | < 2 seconds |
| 1,000 - 5,000 | 2-5 seconds |
| 5,000 - 10,000 | 5-10 seconds |
| > 10,000 | Consider optimization |

### Bottlenecks

1. **Availability Calculation** - Highest impact
   - Runs per item
   - Queries inventory, purchase orders, sales orders

2. **Item Loading** - Moderate impact
   - Number of items × season flags

3. **Sales Line Updates** - Low impact
   - Only runs for changed items

---

## Event Subscribers

### Potential Subscription Points

If extending functionality, consider:

1. **OnBeforeCreateList** - Modify filters before load
2. **OnAfterAddItems** - Inject custom items
3. **OnBeforeAddItemsToOrder** - Validate before save
4. **OnAfterAddItemsToOrder** - Post-processing

### Example Event Subscriber

```al
[EventSubscriber(ObjectType::Codeunit, Codeunit::"CLE Order Entry Management", 'OnBeforeAddItemsToOrder', '', false, false)]
local procedure OnBeforeAddItemsToOrder(var SalesHeader: Record "Sales Header"; var RapidOrderEntryLine: Record "CLE Rapid Order Entry Line" temporary; var IsHandled: Boolean)
begin
    // Custom validation
    if not ValidateMinimumOrderQty(RapidOrderEntryLine) then begin
        IsHandled := true;
        Error('Minimum order quantity not met');
    end;
end;
```

---

## Maintenance Tasks

### Weekly

- Monitor performance metrics
- Review error logs for failed saves
- Check for blocked items incorrectly showing

### Monthly

- Review season date ranges for accuracy
- Audit merged line occurrences
- Optimize availability calculation if needed

### Quarterly

- Review fee calculation accuracy
- Update test cases for new seasons
- Performance benchmark testing

---

## Related Systems

- **Availability Management** (Codeunit 50053)
- **Availability Calculation** (Codeunit 50064)
- **Sales Fee Management** (Codeunit - CC/Freight)
- **Fee Status** (Codeunit - flags)
- **Season Management** (Date-based logic in Availability Mgt)

---

## Emergency Procedures

### Issue: Rapid Order Entry Broken for All Users

1. Check if recent deployments/updates
2. Verify codeunit 50056 compiles
3. Check page 50071 opens manually
4. Review recent changes to availability codeunits
5. Rollback if necessary

### Issue: Data Corruption (Lines Not Saving)

1. Check transaction log for errors
2. Verify table permissions (Sales Header, Sales Line)
3. Check for blocking triggers/subscribers
4. Review fee management codeunit for errors
5. Test in isolated environment

### Issue: Performance Degradation

1. Check concurrent users
2. Review recent item master changes (count increase)
3. Check availability calculation performance
4. Review SQL query execution plans
5. Add indexes if needed
6. Consider caching strategy

---

## Contact & Escalation

**Level 1:** Basic troubleshooting, user training
**Level 2:** Configuration, debugging, performance
**Level 3:** Code changes, architecture, database

For code modifications, consult development team.

---

*Last Updated: February 12, 2026*
*Document Version: 1.0*

---

## Related documents

- [[rapid-order-entry-user-guide]]
