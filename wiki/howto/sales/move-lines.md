---
title: Move Sales Order Lines
type: howto
tags: [sales-orders, move-lines, availability, consolidation]
created: 2026-04-21
updated: 2026-04-21
sources: [move-lines-user-guide.md]
---

# Move Sales Order Lines

Transfer sales order lines (or portions of them) from one sales order to another. Essential for consolidating orders, splitting by date, or reorganizing when customer requirements change.

Move Lines integrates with the [[availability-system]], blanket orders, and fee calculations.

## Prerequisites

Before using Move Lines, ensure:

- You have appropriate permissions to modify sales orders
- Source order has lines with Type = Item and Outstanding Quantity > 0
- You know the target order number (if moving to existing order)
- New shipment dates are valid (not in the past)

## Opening Move Lines

### From Sales Order

1. Open the sales order you want to move lines FROM
2. Navigate to **Actions → Functions → Move Lines**
3. The Move Lines worksheet opens automatically

The system will:

- Load all inventory items with outstanding quantities from the order
- Calculate current availability for each item
- Mark items that are currently unavailable (negative availability)

## Understanding the Worksheet

### Key Columns

| Column | Description | Editable |
|--------|-------------|----------|
| **No.** | Item number | No |
| **Description** | Item description | No |
| **Unit of Measure Code** | UOM for the item | No |
| **Current Quantity** | Outstanding quantity on this order | No |
| **Qty. to Move** | Quantity you want to transfer | **Yes** |
| **Current Shipment Date** | Original shipment date | No |
| **New Shipment Date** | Target shipment date for moved lines | **Yes** |
| **Qty. Available prior Change** | Current availability | No |
| **Qty. Avail. New Shipment Date** | Availability on new date (recalculates) | No |
| **Currently Unavailable** | Red indicator if currently oversold | No |
| **Unavailable on New Date** | Red indicator if new date is oversold | No |
| **Sales Line Set ID** | Groups related items (e.g., kits) | No |

### Header Fields

| Field | Description | Required |
|-------|-------------|----------|
| **ToOrderNo** | Target order number (leave blank to create new order) | No |
| **New Shipment Date** | Default shipment date for new order creation | If creating new |
| **Shipment Method Code** | Shipping method for new order | If creating new |

## Scenario 1: Move Lines to Existing Order

**Use Case:** Consolidate two orders for the same customer into one shipment.

### Steps

1. **Open Move Lines** from the source order

2. **Enter Target Order:**
   - In **ToOrderNo** field at top, enter the target order number
   - Press Enter to validate

3. **Set New Shipment Date:**
   - Enter the new shipment date for each line (or use same date for all)
   - System automatically recalculates availability for that date
   - Watch for red indicators showing unavailability

4. **Enter Qty. to Move:**
   - For each line, enter how much quantity to transfer
   - Can enter less than Current Quantity for partial moves
   - Can enter more if blanket order supports it

5. **Review Availability:**
   - Check "Qty. Avail. New Shipment Date" column
   - Red indicators warn about oversells
   - System may prevent move if oversell prevention is enabled

6. **Execute Move:**
   - Click **Move Items** action in ribbon
   - System transfers the lines and updates both orders
   - Freight and credit card fees recalculate automatically

**Result:**

- Source order: Quantity reduced by "Qty. to Move" (line deleted if moving all)
- Target order: Quantity added (merged with existing line if same item/price/blanket)
- Both orders: Fees recalculated

## Scenario 2: Move Lines to New Order

**Use Case:** Split an order because some items ship on different dates.

### Steps

1. **Open Move Lines** from the source order

2. **Leave ToOrderNo Blank** (do not enter target order number)

3. **Set Shipment Method:**
   - Enter **Shipment Method Code** at top (e.g., "PICKUP", "FEDEX")
   - This determines shipping method for new order

4. **Set New Shipment Date:**
   - Enter the shipment date for the lines being moved
   - This becomes the shipment date for the new order

5. **Enter Qty. to Move** for each line

6. **Click Move Items:**
   - System creates a new sales order
   - New order has same customer, new shipment date, chosen shipment method
   - Lines transfer to new order
   - Blanket order reference preserved

**Result:**

- New order created with moved lines
- Source order retains remaining lines
- Both orders: Separate shipments, fees calculated independently

## Scenario 3: Partial Line Moves

**Use Case:** Customer wants 100 units but only 60 are available now, 40 later.

### Example

- Current Order 12345: 100 units of Item ABC, Ship Date: Feb 15
- Available Feb 15: 60 units
- Available Feb 22: 100 units

### Steps

1. Open Move Lines from Order 12345
2. Leave **ToOrderNo** blank to create new order
3. Set **New Shipment Date** = Feb 22
4. Enter **Qty. to Move** = 40 (the portion that ships later)
5. System shows:
   - Qty. Available prior Change: 60 (negative 40 considering current demand)
   - Qty. Avail. New Shipment Date: 60 (checking Feb 22)
6. Click **Move Items**

**Result:**

- Order 12345 now has 60 units shipping Feb 15 (available now)
- New Order 12346 created with 40 units shipping Feb 22 (available then)

## Blanket Order Integration

If lines are linked to blanket orders, Move Lines handles additional quantity logic:

### Case 1: Moving MORE Than Current Quantity

**Example:** Current line has 50 units, you enter Qty. to Move = 75

**System checks:**

1. **Blanket order has sufficient remaining:**
   - Confirms: "Another 25 Items will be taken from CLE Blanket BLANKET001. Do you want to continue?"
   - If Yes: Moves 75 units (50 from current line + 25 from blanket)

2. **Blanket order insufficient (e.g., only 15 remaining):**
   - Confirms: "There is not enough quantity on CLE Blanket BLANKET001. But we can add 10 to this CLE Blanket and continue. Do you want to do that?"
   - If Yes: Adds 10 to blanket order, then moves 75 units
   - If No: Qty. to Move reverts to original value

3. **No blanket order exists:**
   - Confirms: "You are going to move more than the current quantity on this order. Is this correct?"
   - If Yes: Allows move (availability permitting)
   - If No: Qty. to Move reverts

**Important:** You cannot oversell availability. If moving 75 units but only 70 are available on new date, system shows error: "Availability is not sufficient on that date."

## Excel Import/Export

For bulk moves with many lines, use Excel:

### Export to Excel

1. In Move Lines worksheet, click **Export to Excel** action
2. Excel file downloads with all lines
3. File contains:
   - Item No., Description, UOM
   - Current Quantity
   - **Quantity To Move** (editable column)
   - Qty. Available
   - Current Shipment Date
   - Line No. (system identifier)

### Edit in Excel

1. Open exported file
2. **Only edit "Quantity To Move" column**
3. Enter quantities you want to move for each item
4. Save file

⚠️ **Warning:** Do not modify other columns or change row order. System uses Line No. for matching.

### Import from Excel

1. In Move Lines worksheet, click **Import from Excel** action
2. Select your edited Excel file
3. System imports "Quantity To Move" values
4. Values populate **Qty. required to Move** column (staging column)

### Apply Imported Quantities

1. Review imported values in **Qty. required to Move** column
2. System flags lines with issues:
   - Red attention indicator if quantity is negative
   - Red indicator if would create oversell (when prevention enabled)
   - Red indicator if exceeds current quantity without blanket support
3. Click **Apply imported Quantities** action
4. System applies valid quantities to **Qty. to Move**
5. Skips invalid lines (shows message: "X line(s) were not processed. Please enter those quantities manually.")
6. Manually fix flagged lines, then proceed

## Split Quantities Feature

**Use Case:** Divide an order into equal parts for multiple shipments.

**Example:** Order has 120 units, split into 3 shipments of 40 each.

### Steps

1. Open Move Lines
2. Select the line(s) you want to split
3. Click **Split Quantities** action
4. In dialog:
   - **Divider:** Enter 3 (number of parts)
   - **Rounding Direction:** Choose Up or Down
5. System calculates: 120 ÷ 3 = 40
6. **Qty. to Move** sets to 40 for selected lines
7. Create target order and move first 40 units
8. Repeat process twice more for remaining 80 units

**Rounding:**

- **Up:** 125 ÷ 3 = 42 (rounds up)
- **Down:** 125 ÷ 3 = 41 (rounds down)

## Availability Forecast

The system shows two availability calculations:

### Qty. Available prior Change

- Availability on **current shipment date**
- Includes all supply and demand as of today
- Red "Currently Unavailable" indicator if negative

### Qty. Avail. New Shipment Date

- Availability on **new shipment date** you entered
- Recalculates automatically when you change date
- Considers:
  - Purchase orders scheduled to arrive
  - Production orders scheduled to complete
  - Other sales orders scheduled to ship
  - Current inventory levels
- Red "Unavailable on New Date" indicator if negative

**How to Use:**

1. Enter proposed new shipment date
2. Tab away from field (triggers calculation)
3. Check "Qty. Avail. New Shipment Date" column
4. If negative and red, consider:
   - Choose later date with availability
   - Contact purchasing to expedite supply
   - Reduce Qty. to Move to available amount

## Sales Line Set ID (Grouped Items)

Some items are grouped together (kits, bundles, matched sets):

- All items in group share same **Sales Line Set ID**
- When moving grouped items, move **all items in the set** together
- System preserves set ID on target order
- If target order already has items from same set, they merge correctly

**Example:**

- Rose Bouquet Kit (Set ID = ROSE-001): Roses + Vase + Ribbon
- Move all three items together with same Qty. to Move
- Maintains kit integrity on target order

## Troubleshooting

### Error: "Availability is not sufficient on that date"

**Cause:** Trying to move more quantity than available on new shipment date.

**Solutions:**

1. Reduce **Qty. to Move** to match **Qty. Avail. New Shipment Date**
2. Choose a later **New Shipment Date** when more inventory arrives
3. Check if blanket order can be increased
4. Contact purchasing to expedite supply orders

### Problem: Line Not Moving (Silently Skipped)

**Cause:** Invalid data or missing required fields.

**Check:**

- **New Shipment Date** is filled in
- **New Shipment Date** is not in the past
- **Qty. to Move** is greater than zero
- **Qty. to Move** is not greater than available (if oversell prevention enabled)

### Problem: Excel Import Shows "Lines Failed" Message

**Cause:** Line No. mismatch or item not found in worksheet.

**Solutions:**

1. Do not modify "Line No." column in Excel
2. Do not add new rows (only edit existing ones)
3. Do not change "Item No." column
4. Manually review failed lines page
5. Enter quantities directly in worksheet for failed lines

### Problem: Multiple Lines Created on Target Order

**Cause:** Items don't match exactly for merging.

**System merges lines only if ALL these match:**

- Item No.
- Unit Price
- Blanket Order No.
- Blanket Order Line No.
- Line Discount %
- Sales Line Set ID

**Solution:** If you expected lines to merge, check pricing and blanket references. If different, lines will remain separate (this is correct behavior).

### Problem: Fees Not Recalculating

**Cause:** Fee calculation requires specific item setup.

**Check:**

1. Payment terms have credit card charge item configured
2. Freight calculation setup is active
3. Orders meet minimum thresholds for fee calculation

**Note:** Fees recalculate automatically after move completes. Refresh order page to see updated fees.

### Problem: Cannot Find Target Order

**Cause:** Order number doesn't exist or wrong type.

**Solutions:**

1. Verify target order number exists
2. Ensure target order is same customer as source
3. Target order must be Type = Order (not Quote, Invoice, etc.)
4. Target order must not be released/posted

## Best Practices

### 1. Plan Moves Carefully

- Review availability before moving
- Consider impact on shipment consolidation
- Check customer delivery preferences
- Coordinate with warehouse team

### 2. Use Excel for Large Moves

- 10+ lines: Use Excel import/export
- Reduces data entry errors
- Easier to review before applying
- Can save Excel file for documentation

### 3. Respect Blanket Orders

- Don't exceed blanket quantities without approval
- Confirm with sales manager before adding to blanket
- Document reasons for blanket increases

### 4. Verify After Move

- Check source order (should show reduced/deleted lines)
- Check target order (should show added/updated lines)
- Verify fees recalculated correctly
- Confirm shipment dates are correct
- Review availability forecast on both orders

### 5. Handle Grouped Items Together

- Always move all items in a Sales Line Set ID together
- Use same Qty. to Move for all set members
- Verify set integrity on target order

### 6. Document Complex Moves

- Save Excel export before import for audit trail
- Add order notes explaining why lines were moved
- Communicate changes to warehouse and customer service

### 7. Availability Strategy

- Move lines to dates with positive availability
- Don't create oversells (system may prevent anyway)
- If must move to unavailable date, coordinate with purchasing
- Consider customer priority and urgency

## Quick Reference

| Action | Purpose | Location |
|--------|---------|----------|
| **Move Items** | Execute the move operation | Action Bar |
| **Split Quantities** | Divide Qty. to Move by divider | Action Bar |
| **Export to Excel** | Download lines for bulk editing | Action Bar |
| **Import from Excel** | Upload edited quantities | Action Bar |
| **Apply imported Quantities** | Transfer imported values to Qty. to Move | Action Bar |
| **Refresh Page** | Reload data and recalculate | Action Bar |

## Common Scenarios Summary

### Consolidate Orders

- ToOrderNo: Enter target
- Set New Shipment Date
- Move all lines
- Result: One combined order

### Split by Date

- ToOrderNo: Leave blank (creates new)
- Set New Shipment Date (later)
- Move portion of each line
- Result: Two orders with different dates

### Move Entire Order

- ToOrderNo: Enter target or leave blank
- Set Qty. to Move = Current Quantity for all lines
- Result: Source order becomes empty (or deleted)

### Move Oversold Items to Later Date

- Identify negative availability items
- Set New Shipment Date to future date with positive availability
- Move those lines only
- Result: Current order ships available items, new order ships rest later

## Related Pages

- [[availability-system]] — Understanding availability
- [[move-lines-troubleshooting]] — IT troubleshooting for Move Lines
