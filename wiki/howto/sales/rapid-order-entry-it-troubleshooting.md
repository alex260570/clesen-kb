---
title: Rapid Order Entry — IT Troubleshooting
type: howto
tags: [sales-orders, rapid-order-entry, it-support, troubleshooting, system-architecture]
created: 2026-04-21
updated: 2026-04-21
sources: [rapid-order-entry-troubleshooting-guide.md]
---

# Rapid Order Entry — IT Troubleshooting

Technical guide for IT staff supporting the Rapid Order Entry system.

## System Overview

| Component | Details |
|-----------|---------|
| **Codeunit** | `50056 "CLE Order Entry Management"` |
| **Page** | `50071 "CLE Rapid Order Entry"` |
| **Temporary Table** | `50042 "CLE Rapid Order Entry Line"` |
| **Variables Codeunit** | `CLE Order Entry Variables` |

## Architecture

### Flow Diagram

```
Sales Order/Blanket Order/Quote
    ↓
[Rapid Order Entry Action]
    ↓
Codeunit 50056: CreateList()
    ├─→ Validate Shipment Date (error if blank)
    ├─→ AddSalesLines() [Load existing lines]
    ├─→ AddItems() [Load available items for season]
    ├─→ Set session variables (header, line no., flags)
    └─→ Open Page 50071 (Rapid Order Entry worksheet)
    ↓
[User enters quantities in worksheet]
    ↓
[OK Button clicked]
    ↓
AddItemsToOrder()
    ├─→ Update existing sales lines
    ├─→ Create new sales lines
    ├─→ Delete existing freight lines (if enabled)
    ├─→ Recalculate freight charges (if enabled)
    ├─→ Delete existing CC fee lines (if enabled)
    └─→ Add CC fees (if enabled)
    ↓
Order updated with new items and fees
```

### Key Components

**Temporary Table Pattern**
- All worksheet data held in `CLE Rapid Order Entry Line` temporary record
- No database writes until user clicks OK
- Allows safe cancellation without side effects
- Temp table cleared after operation completes

**Session Variables**
- `CLE Order Entry Variables` codeunit stores context
- Holds: Sales Header, Last Line No., Shipment Date Block flag
- Provides context across page interactions
- Cleared automatically after operation

**Integration Points**
- `CLE Availability Management` — Season detection, location filters
- `CLE Availability Calculation` — Real-time availability per item
- `CLE Sales Fee Management` — Freight and CC fee handling
- `CLE Fee Status` — Fee calculation flags and state management

## Common Issues & Resolution

### Issue: "Please enter a Shipment Date" Message

**Symptom:** User cannot open Rapid Order Entry

**Root Cause:** `SalesHeader."Shipment Date" = 0D` (blank field)

**Diagnosis:**
1. Check shipment date field on sales header
2. Verify field is editable (may be locked by workflow)
3. Confirm date is not blank or null

**Resolution:**
1. User must enter a valid shipment date on sales header before opening Rapid Order Entry
2. If field is locked by workflow, check workflow rules or user permissions
3. Consider making shipment date required field in table setup

**Code Location:** `CreateList()` procedure, initial validation

---

### Issue: No Items Appear in Worksheet

**Symptom:** Worksheet opens but shows zero items

**Diagnosis Steps:**

1. **Check Season Assignment:**
   - Verify items have season flags set on Item table
   - Seasons: Spring Item, Summer Item, Fall Item, Winter Item fields
   - At least one season flag must be true

2. **Verify Season Calculation:**
   - Season determined by shipment date via `AvailMgt.GetSeasonFromDateMultiple()`
   - Shipment date must map to at least one season
   - Transition dates may show multiple seasons

3. **Check Item Filters:**
   - Only items with `Sales Blocked = false` are shown
   - Only items with `Type = Inventory` are shown
   - Blocked items are excluded regardless of other settings

4. **Verify Active Locations:**
   - Availability calculated only for locations with `CLE Active Location = true`
   - If no active locations exist, no availability can be calculated
   - Check Location table for active status

**Common Causes:**
- All items in season are sales-blocked
- No items marked for the season
- Items not set as Inventory type (may be Service, Comment, etc.)
- Shipment date falls outside all configured season ranges
- No active inventory locations defined

**Resolution:**
1. Update item season flags for current season
2. Check sales blocked status on Item table
3. Verify item type = Inventory
4. Review season date ranges in Availability Management setup
5. Verify at least one Location is marked as active

---

### Issue: Merged Lines — Shipment Date Locked

**Symptom:** "Cannot change shipment date" error after using Rapid Order Entry

**Root Cause:** Multiple sales lines for same item with different shipment dates on order

**What Happens:**
- `AddSalesLines()` detects duplicate item numbers
- Combines duplicate lines into single temporary record
- Sets `"Merged Line" := true`
- Returns `HasMergedLines := true` to caller
- Sets shipment date change block in session variables
- Blocks shipment date changes on sales header after save

**Why This Occurs:**
- User created order with Item A on 2026-03-15
- Later added same Item A with different shipment date (2026-04-15)
- Opening Rapid Order Entry detects conflict
- System locks date to prevent inconsistency

**Resolution:**
1. Explain merged line scenario to user
2. If date change necessary, user must manually split or delete merged lines
3. After resolving duplicates, shipment date becomes editable again
4. Can then use Rapid Order Entry again

**Prevention:**
- Avoid creating duplicate item lines with different dates
- Use single line and adjust quantity instead
- Use move lines feature to transfer quantity between orders if needed

---

### Issue: Availability Shows Zero But Stock Exists

**Symptom:** `Qty. Available` column shows 0 but inventory exists in warehouse

**Diagnosis:**

1. **Check Location Filters:**
   - Availability calculation uses only ACTIVE locations
   - Verify Location."CLE Active Location" = true for storage locations
   - Inactive locations are excluded from calculation

2. **Verify Shipment Date Calculation:**
   - Availability calculated FOR the shipment date, not today
   - Future inbounds may not be included in date calculation
   - Check item ledger and purchase order inbound dates
   - Review availability calculation for date range logic

3. **Check Unit of Measure:**
   - Availability calculated in Sales UOM, not Base UOM
   - Verify UOM conversions are correct
   - Missing or incorrect conversion factors cause zero quantity

4. **Verify Item Ledger:**
   ```sql
   SELECT "Item No.", "Location Code", "Remaining Quantity"
   FROM "Item Ledger Entry"
   WHERE "Item No." = 'ITEM123'
   AND "Remaining Quantity" > 0
   ```

**Resolution:**
1. Activate required locations (set `CLE Active Location = true`)
2. Verify availability calculation codeunit (50064) logic
3. Check date ranges and future inbound purchase orders
4. Review UOM setup and conversion factors
5. Run manual availability calculation diagnostic

---

### Issue: Items Added But Not Appearing on Order

**Symptom:** User adds items in Rapid Order Entry but they don't appear on sales order after clicking OK

**Diagnosis:**

1. **Check if OK was clicked:**
   - Only `Action::LookupOK` triggers save operation
   - Escape, Cancel button, or closing worksheet exits without saving
   - No changes persist if OK not clicked

2. **Verify Quantity Changed Flag:**
   - System only processes items with `"Quantity Changed" = true`
   - If user enters 0 in New Qty field, no change occurs
   - Only items with modified quantities are added/updated

3. **Check for Validation Errors:**
   - Review Transaction Log in Dynamics for errors
   - Check Sales Line table validation rules
   - Event subscribers may block line creation

4. **Verify Line Numbers:**
   - New lines use: `LastSalesLineNo + 10000` as starting number
   - Increments by 10000 per new line
   - Gaps in line numbers may indicate processing stops

**Resolution:**
1. Have user click OK (not Cancel or Escape)
2. Verify quantity was entered in "New Qty." column before OK
3. Check for validation errors in application log
4. Review event subscribers that validate sales lines
5. Test with debugger to trace which lines process

---

### Issue: Freight/CC Fees Not Calculating

**Symptom:** Auto-fees don't recalculate after using Rapid Order Entry

**Root Cause:** Fee calculation flags not properly managed or disabled

**Diagnosis:**

1. **Check Clesen Setup:**
   ```al
   if ClesenSetup."AutoFreightCharges" = true then
   if ClesenSetup."AutomaticCreditCardCharges" = true then
   ```
   - Verify auto-fee flags are enabled in Clesen Setup
   - Check if recently disabled

2. **Verify Fee Status Flags:**
   - `FeeStatus.SetFreightChargeLineCalculationInactive(true/false)`
   - `FeeStatus.SetCreditCardFeeLineCalculationInactive(true/false)`
   - Flags control whether fees recalculate

3. **Check Document Type:**
   - Fee logic only runs for **Sales Orders**
   - NOT for Blanket Orders or Quotes
   - Check if order type is actually Order

4. **Verify Sales Fee Setup:**
   - Check if Sales Fee Setup rules exist
   - Verify rule codes match order's shipment/payment method
   - Missing setup = no fees calculated

**Resolution:**
1. Enable auto-fees in Clesen Setup
2. Verify document type = Sales Order (not Blanket Order)
3. Check Fee Status codeunit flag persistence
4. Ensure fee deletion happens before recalculation:
   - `SalesFeeMgt.DeleteFreightLines()`
   - `SalesFeeMgt.DeleteCCLine()`
5. Verify Sales Fee Setup has rules for applicable methods

---

### Issue: Performance/Timeout on Large Item Lists

**Symptom:** Rapid Order Entry worksheet slow to load or times out

**Root Cause:** Availability calculation expensive for large catalogs

**Diagnosis:**

1. **Check Item Count:**
   - Count items matching season filter
   - Large catalogs (>10,000 items) can be slow
   - Multiple location checks per item compound delay

2. **Review Field Loading:**
   - Check which Item fields are loaded into temporary table
   - Each field adds I/O overhead
   - Only necessary fields should be loaded

3. **Analyze Availability Calculation:**
   - Availability calculated per item
   - Multiple location queries per item
   - Purchase order lookups for future inbounds
   - Can be expensive for large catalogs

**Performance Benchmarks:**

| Item Count | Expected Load Time |
|-----------|------------------|
| < 1,000 | < 2 seconds |
| 1,000 - 5,000 | 2-5 seconds |
| 5,000 - 10,000 | 5-10 seconds |
| > 10,000 | Consider optimization |

**Resolution:**
1. Optimize availability calculation queries
2. Add indexes on season flag fields if missing:
   ```sql
   CREATE INDEX IX_Item_SeasonFlags
   ON Item("CLE Spring Item", "CLE Summer Item", "CLE Fall Item", "CLE Winter Item")
   WHERE "Sales Blocked" = 0 AND Type = 0;
   ```
3. Consider caching availability results per session
4. Review `CalculateItemAvailabilityForDate()` performance
5. Implement pagination for very large catalogs
6. Monitor query execution plans for bottlenecks

---

### Issue: Merged Lines Show Incorrect Current Qty

**Symptom:** Current Qty total is wrong when multiple lines merged

**Root Cause:** UOM inconsistency or non-Item lines included

**Diagnosis:**

1. **Check UOM Consistency:**
   - All lines for same item should have same Unit of Measure
   - System adds quantities directly without conversion
   - Mixed UOMs on same item will sum incorrectly

2. **Verify Line Filters:**
   - Only Type::Item lines are included
   - Comments, charges, and other line types excluded
   - Check Sales Line filters in `AddSalesLines()`

3. **Check for Discrepancies:**
   - Manual inspection: sum all matching item lines manually
   - Compare to Current Qty shown in worksheet
   - May indicate UOM or filter issue

**Resolution:**
1. Verify all sales lines for item have correct item number
2. Check UOM consistency across all lines for same item
3. Review merge logic in `AddSalesLines()` procedure
4. Ensure no non-Item lines included in calculation

---

## Database Schema

### Temporary Table: CLE Rapid Order Entry Line (Table 50042)

```
Primary Key: Item No.

Key Fields:
- Document Type (Order | Blanket Order | Quote)
- Document No.
- Item No. [PK]

Display Fields:
- Description (from Item.Description 2)
- Pot Size Code
- Unit of Measure Code
- Unit of Measure (description)
- Current Qty. (sum of existing lines)
- New Qty. (user entered)
- Qty. Available (real-time calculation)
- Availability Status (color: Green=Available, Red=Not Available)
- Unit Price

Metadata Fields:
- Source (Item | Sales Line) — where record originated
- Season (Spring | Summer | Fall | Winter)
- Quantity Changed (boolean) — flag if user modified qty
- Merged Line (boolean) — flag if multiple lines combined
- CLE AvailStatus (Available | Not Available | Negative)
- Shipment Date
- Sell-to Customer No.
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
                      ↓
              Item Ledger Entry
```

## Testing Scenarios

### Test Case 1: New Order with New Items

1. Create sales order
2. Set shipment date in Spring range (March 1 - May 31)
3. Open Rapid Order Entry
4. Verify only Spring items appear
5. Add quantities to 3 items
6. Click OK
7. Verify 3 sales lines created with correct qty and unit price
8. Verify freight recalculated (if enabled)

**Expected Result:** 3 new lines added, fees updated

### Test Case 2: Update Existing Items

1. Create sales order with 2 item lines
2. Open Rapid Order Entry
3. Verify items appear with Current Qty populated
4. Change New Qty for existing items
5. Add new item
6. Click OK
7. Verify existing lines updated
8. Verify new line created

**Expected Result:** Existing lines updated, new line added, fees recalculated

### Test Case 3: Merged Lines Scenario

1. Create sales order
2. Add Item A, Qty 10
3. Add Item A again, Qty 5 (duplicate line)
4. Open Rapid Order Entry
5. Verify Item A shows Current Qty = 15
6. Verify "Merged Line" flag = true
7. Change to New Qty = 20
8. Click OK
9. Verify original lines updated or consolidated

**Expected Result:** Merged lines handled correctly, total qty updated

### Test Case 4: Season Transitions

1. Set shipment date to season transition (e.g., May 31)
2. Open Rapid Order Entry
3. Verify items from multiple seasons appear (Spring AND Summer)

**Expected Result:** Transition items from both seasons visible

### Test Case 5: Blanket Order (No Fees)

1. Create blanket order
2. Set shipment date
3. Open Rapid Order Entry
4. Add items
5. Click OK
6. Verify no freight calculation triggered
7. Verify no CC fee calculation triggered

**Expected Result:** Items added, no auto-fees (even if enabled)

## Debugging Guide

### Enable Verbose Logging

Add temporary variables in `CreateList()`:
```al
var
    DebugMsg: Text;
begin
    DebugMsg := 'Items loaded: ' + Format(RapidOrderEntryLine.Count);
    Message(DebugMsg);
end;
```

### Key Breakpoints

1. **Line 9** - Shipment date validation
2. **Line 37** - Start of AddSalesLines
3. **Line 96** - Start of AddItems
4. **Line 154** - Start of AddItemsToOrder
5. **Line 172** - Freight charge deletion
6. **Line 189** - Sales line update loop

### Temporary Table Inspection

During debugging:
```al
RapidOrderEntryLine.FindSet();
repeat
    // Examine each record
    Message('Item: ' + RapidOrderEntryLine."Item No." + 
            ', Qty Changed: ' + Format(RapidOrderEntryLine."Quantity Changed") +
            ', Merged: ' + Format(RapidOrderEntryLine."Merged Line"));
until RapidOrderEntryLine.Next() = 0;
```

Check:
- Record count
- Source field (Item vs. Sales Line)
- Quantity Changed flag status
- Merged Line flag status

### Session Variable Inspection

```al
// In OrderEntryVariables codeunit
procedure GetStoredHeader(): Record "Sales Header"
procedure GetLastLineNo(): Integer
procedure GetShipmentDateBlocked(): Boolean
```

## Emergency Procedures

### Rapid Order Entry Broken for All Users

1. Check if recent deployments/updates
2. Verify Codeunit 50056 compiles without errors
3. Verify Page 50071 opens manually
4. Review recent changes to availability codeunits
5. Check if Clesen Setup fields changed
6. Rollback if necessary

### Data Corruption (Lines Not Saving)

1. Check Transaction Log for errors
2. Verify table permissions (Sales Header, Sales Line)
3. Check for blocking triggers/subscribers
4. Review fee management codeunit for errors
5. Test in isolated environment with simple order

### Performance Degradation

1. Check concurrent users (possible lock contention)
2. Review recent item master changes (count increase)
3. Check availability calculation performance
4. Review SQL query execution plans
5. Add indexes if missing
6. Consider caching strategy for availability data

## Related Pages

- [[rapid-order-entry]] — User guide for Rapid Order Entry
- [[sales-fees]] — Sales fee management and configuration
- [[sales-order-management]] — Sales order field reference
