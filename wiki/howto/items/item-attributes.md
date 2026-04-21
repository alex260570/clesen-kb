---
title: Item Attributes
type: howto
tags: [items, attributes, bulk-operations, configuration]
created: 2026-04-21
updated: 2026-04-21
sources: [item-attribute-assign-user-guide.md]
---

# Item Attributes

Bulk assignment of attributes and values to multiple items in a single operation.

## What Are Item Attributes?

**Item Attributes** are metadata properties assigned to items in bulk. Examples:

- **Season** (Spring, Summer, Fall, Winter)
- **Color** (Red, Pink, White, Yellow)
- **Variety** (Standard, Premium, Exotic)
- **Height** (Dwarf, Medium, Tall)
- **Fragrance** (Fragrant, Lightly Scented, Unscented)

Instead of editing items one-by-one, you select multiple items and assign attributes to all of them at once.

## The Bulk Attribute Assignment Process

### Step 1: Open Item List

1. Use the search function (Alt+Q) and type **"Items"**
2. Click **Items** to open the Item List page
3. The list shows all items with columns for item no., description, type, etc.

### Step 2: Select Multiple Items

On the Item List:

1. **Check the checkboxes** next to the items you want to modify
   - Click the checkbox in the header row to select all
   - Or click individual checkboxes to select specific items
   - Selected items are highlighted
2. Verify you have the right items selected before proceeding

**Example:** You want to mark 50 new rose varieties as "Summer" season
- Filter or search for those items
- Check 50 items
- Proceed to assignment

### Step 3: Open Bulk Assignment Dialog

1. With items selected, look for the **Attribute Assignment** action (usually in the action ribbon)
   - Or right-click on selection → **Assign Attributes**
   - Or navigate via menu
2. The **Bulk Attribute Assignment** dialog opens
3. Dialog shows two fields:
   - **Attribute ID** — Which attribute to assign (lookup dropdown)
   - **Value ID** — What value for that attribute (lookup dropdown)

### Step 4: Enter Attribute and Value

1. Click the **Attribute ID** lookup
   - Choose from existing attributes (Season, Color, Variety, etc.)
   - Or create new attribute if needed (may require admin)
2. Click the **Value ID** lookup
   - System auto-populates values for the selected attribute
   - Choose which value (e.g., "Summer" for Season attribute)
3. Both fields show user-readable names plus system codes

**Example:**
- Attribute ID: Season (01)
- Value ID: Summer (SUM)

### Step 5: Confirm and Apply

1. Click **OK** to apply
2. System assigns the attribute + value pair to **all selected items simultaneously**
3. Confirmation message shows how many items were updated

**Result:** All 50 selected rose varieties now have the Season attribute set to "Summer"

## Important Behavior

### ⚠️ Overwrites Existing Values

When you assign an attribute to items that **already have that attribute**:

- The new value **replaces** the old value
- There is **no undo** after applying
- Old value is gone

**Best practice:** Verify current attribute values before bulk reassigning.

### ✓ Applies to All Selected Items

The attribute assignment:

- Applies to **every selected item**, no exceptions
- All items get the same value
- If items need different values, select different batches

**Example:** Can't assign "Red" to some items and "White" to others in one operation. You must:
1. Select red items → assign "Red"
2. Select white items separately → assign "White"

### ✓ Multiple Attributes Per Item

Items can have multiple attributes assigned:

1. Select items again
2. Assign a different attribute (e.g., Color = Red)
3. Item now has both Season=Summer AND Color=Red

No conflict — each attribute holds one value.

## Workflow Examples

### Example 1: Seasonal Attribute Assignment

**Goal:** Mark 75 new tulips as "Spring" season items

**Process:**
1. Open Item List
2. Search or filter for tulips purchased this month
3. Select all 75 items (use header checkbox)
4. Click **Assign Attributes**
5. Attribute ID: Season
6. Value ID: Spring
7. Click **OK**

**Result:** All 75 tulips now have Season=Spring

**Next step:** Assign Color attribute to same items
- Reselect the 75 items
- Assign Attributes
- Attribute: Color
- Values: Red, Pink, White (need 3 separate batches)
  - Select red tulips → Color=Red
  - Select pink tulips → Color=Pink
  - Select white tulips → Color=White

### Example 2: Variety Classification

**Goal:** Mark premium new arrivals as "Premium" variety

**Process:**
1. Item List
2. Filter for items with price > $50 AND created in last 30 days
3. Select matching items
4. Assign Attributes
5. Attribute: Variety
6. Value: Premium
7. Click **OK**

**Result:** All premium-priced new items marked as Premium variety

### Example 3: Height Classification for Retail

**Goal:** Assign height to 200 plants in receiving

**Process:**
1. Item List
2. Search/filter for items received this week (status=New or Pending)
3. Batch 1: Select 100 dwarf plants → Assign Attribute → Height=Dwarf
4. Batch 2: Select 75 medium plants → Assign Attribute → Height=Medium
5. Batch 3: Select 25 tall plants → Assign Attribute → Height=Tall

**Result:** All 200 items classified by height for retail display

## Best Practices

✅ **DO:**
- Review current attribute values before bulk reassigning (to avoid mistakes)
- Assign attributes in batches by value (all red roses together, then all pink)
- Use descriptive attribute names that users understand
- Assign attributes during item creation/receipt process
- Verify count of selected items matches expected count before confirming
- Document attribute meanings somewhere (e.g., wiki or internal guide)
- Use attributes to filter/sort items in reports

❌ **DON'T:**
- Reassign attributes without checking current values (loses data)
- Try to assign multiple different values in one operation (must do separate batches)
- Assign attributes to wrong item set (verify selection)
- Forget to assign attributes to related items (inconsistent data)
- Use attributes for core item data (that's what item card fields are for)
- Create undefined attributes (keep list standardized)

## Automatic Season Attributes

Some workflows automatically assign **Season attributes** based on context:

- **Purchase receipts** — May auto-assign season based on receipt date or vendor
- **Production orders** — May auto-assign based on production schedule
- **Transfer orders** — May auto-assign based on transfer origin

Check your configuration to see which attributes auto-populate.

## Troubleshooting

### Issue: Item Not Selected in List

**Cause:** Checkbox not checked, or item filtered out

**Solution:**
1. Verify item is visible in current list view
2. Check the checkbox (header or individual)
3. Confirm checkbox shows as checked
4. Then click Assign Attributes

### Issue: Value ID Lookup Is Empty

**Cause:** No values defined for that attribute, or attribute doesn't exist

**Solution:**
1. Verify attribute is correct
2. Check attribute definition for defined values
3. May need to create values in Attribute Master
4. Contact admin if attribute needs setup

### Issue: "Cannot Assign — Item Is Locked"

**Cause:** Item being edited by another user, or item in non-editable state

**Solution:**
1. Wait a few seconds for lock to clear
2. Retry assignment
3. Or contact other user if they're actively editing item

### Issue: Assigned Value Not Appearing on Items

**Cause:** Item card not refreshed, or assignment failed silently

**Solution:**
1. Close and reopen item card
2. Verify attribute value is present
3. If still missing, retry assignment
4. Check user permissions for attribute assignment

## Related Pages

- [[variant-templates]] — Variant template creation and application
- [[gtin-upc-management]] — GTIN/UPC barcode assignment
- [[blooming-stages]] — Blooming stage system and automatic advancement
