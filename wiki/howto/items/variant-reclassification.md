---
title: Variant Reclassification
type: howto
tags: [items, variants, blooming-stages, inventory, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [variant-reclassification-user-guide.md]
---

# Variant Reclassification

Moving inventory between blooming stage variants, advancing items to their next lifecycle stage.

## What Is Variant Reclassification?

**Variant Reclassification** moves physical inventory from the current blooming stage variant to the **next stage only**. It's how you advance plants from Green Bud → Bud & Bloom → Full Bloom.

**Key concept:** Reclassification is a one-step operation. You cannot skip stages or move backward — only forward by exactly one stage.

## Process Overview

```
Item in Current Stage (e.g., Green Bud)
          ↓
Open Item Variant Reclass Worksheet
          ↓
Select Location and Quantity to Advance
          ↓
System Identifies Available Bins
          ↓
Confirm & Post
          ↓
Item Now in Next Stage (e.g., Bud & Bloom)
```

## How Reclassification Works

### Step 1: Access the Worksheet

1. Open an **Item Card** for an item with blooming stage variants
2. Click **Navigate → Item Variant Reclass**
3. The **Item Variant Reclass Worksheet** opens
4. Worksheet shows:
   - **Location** — Where inventory is stored
   - **Current Variant** — The stage it's currently in (e.g., GB)
   - **Inventory Qty.** — Total inventory at this location
   - **New Variant** — The next stage it advances to (auto-populated, read-only)
   - **Quantity to Reclass** — How much you want to advance (enter here)

### Step 2: Review Inventory and Bins

The worksheet displays all locations where this item exists in its current stage.

**For each location:**

1. Check **Inventory Qty.** to see total on hand
2. Decide how much to advance in the **Quantity to Reclass** field
3. When you enter a quantity and confirm, a **bin selection dialog** appears
   - Shows all bins at that location containing the item
   - Shows bin quantities
   - Select which bins to draw from
   - If quantity spans multiple bins, pick bins to total the desired quantity

**Example:**
- Location: Greenhouse A
- Current Variant: GB (Green Bud)
- Inventory: 500 units
- Bins: Bin 1 (200), Bin 2 (150), Bin 3 (150)
- You want to reclass 350 units
- Pick: Bin 1 (200) + Bin 2 (150) = 350

### Step 3: Post the Reclassification

Once you've selected bins and quantities:

1. Click **Post** to execute the reclassification
2. System creates two adjustment journal entries:
   - **Negative adjustment** on current variant (reduces Green Bud)
   - **Positive adjustment** on next variant (increases Bud & Bloom)
3. Inventory immediately updates
4. Posting is **immediate and cannot be undone** — verify before confirming

**Result:** Inventory moved from current stage to next stage. Variant codes on items automatically updated.

## Important Constraints

### ⚠️ One-Step Advancement Only

Reclassification **always moves forward by exactly one stage**. You cannot:
- Skip stages (GB → FB directly)
- Move backward (FB → BB)
- Reclassify to arbitrary stages

**The system automatically determines the next stage** based on the variant template configuration. If your item has stages 10, 20, 30, 40:
- From stage 10 (GB) → advances to stage 20 (BB)
- From stage 20 (BB) → advances to stage 30 (FB)
- From stage 30 (FB) → advances to stage 40 (OG)

### ⚠️ Cannot Reclassify Final Stage

If an item is in the final stage (Overgrown), there is no "next stage" — reclassification is blocked.

**Solution:** Move to a different location or hold until item leaves inventory.

### ⚠️ Bin Selection Required

When you enter a quantity to reclassify:

1. System gathers available bins at that location
2. Opens bin selection dialog
3. You must select bins (auto-populated if only one bin)
4. Selected bins must total >= the quantity you're reclassifying

**If bins don't have enough inventory**, reduce the quantity to reclass.

## Workflow Example

### Scenario: Advance 200 Roses from Green Bud to Bud & Bloom

**Step 1: Open Worksheet**
- Item: Rose-Red-12
- Current Stage: GB (Green Bud) = 500 units in Greenhouse A
- Next Stage: BB (Bud & Bloom) = 0 units currently

**Step 2: Enter Quantity**
- In "Quantity to Reclass" field, enter `200`
- Bin dialog appears:
  - Bin GB-1: 100 units
  - Bin GB-2: 400 units
- Select: Bin GB-1 (100) + Bin GB-2 (100) = 200 total

**Step 3: Post**
- Click **Post**
- Journal entries created:
  - Rose-Red-12 / GB: -200
  - Rose-Red-12 / BB: +200
- Result: 300 left in GB, 200 now in BB

**Step 4: Verify**
- After posting, worksheet refreshes
- Inventory Qty. for GB now shows 300
- Item can be staged again to move remaining 300 to BB

## Multiple Locations

If an item exists in the same stage across multiple warehouse locations:

1. Worksheet shows one line **per location**
2. You can reclassify from each location independently
3. Each location's bins are shown separately in the bin dialog
4. Post separately for each location

**Example:**
| Location | Current Variant | Inventory Qty. | Quantity to Reclass |
|---|---|---|---|
| Greenhouse A | GB | 500 | 200 |
| Greenhouse B | GB | 300 | 150 |
| Cold Storage | GB | 200 | 100 |

Each line can be reclassified independently, or all at once if you fill in quantities for each.

## Best Practices

✅ **DO:**
- Verify inventory quantities before entering reclass quantity
- Confirm bins match the items you want to advance (right plants)
- Post reclassifications regularly to keep blooming stages current
- Perform reclassifications by lifecycle stage (all GBs → BBs before moving BBs → FBs)
- Coordinate with growers on stage readiness before reclassifying
- Document reason for reclassification (if using adjustment journal notes)
- Verify inventory matches physical counts before large reclassifications

❌ **DON'T:**
- Enter quantities larger than actual inventory (bins selection will fail)
- Attempt to skip stages (system won't allow it)
- Reclassify items you didn't physically advance (creates inventory discrepancies)
- Leave partial reclassifications in progress (complete or discard)
- Attempt to move backward in blooming stages
- Reclassify final-stage items without plan to move them out

## Common Issues

### Issue: Bin Dialog Shows No Bins

**Cause:** Inventory record exists but item not physically placed in bins

**Solution:**
1. Verify item exists at location in Item Ledger Entries
2. Create bin for inventory using Item Reclassification Journal
3. Then retry variant reclassification

### Issue: "Cannot Reclassify — No Next Stage"

**Cause:** Item is already in final stage (Overgrown or equivalent)

**Solution:**
1. Item cannot advance further
2. Adjust final-stage inventory manually as needed
3. Plan for item disposal/sale at this stage

### Issue: Quantity Too Large, Bins Don't Have Enough

**Cause:** Entered quantity larger than available bins total

**Solution:**
1. Reduce "Quantity to Reclass" to available amount
2. Or select additional bins in the dialog
3. Verify bin quantities reflect physical inventory

### Issue: Posted Reclassification Is Wrong

**Cause:** Posting is immediate and non-reversible

**Solution:**
1. Create manual adjustment journal entries to correct:
   - Reduce the "new stage" by the incorrect amount
   - Add back to "current stage"
2. Document the correction reason
3. Verify inventory before future reclassifications

## Related Pages

- [[variant-templates]] — Variant template creation and application
- [[blooming-stages]] — Blooming stage system and automatic advancement
- [[bin-management]] — Moving inventory between bins and locations
