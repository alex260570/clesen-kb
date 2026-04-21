---
title: Bin Management — Reclassification
type: howto
tags: [warehouse, inventory-management, bin-operations]
created: 2026-04-21
updated: 2026-04-21
sources: [bin-reclassification-user-guide.md]
---

# Bin Management — Reclassification

Moving inventory between bins within the same location or to different locations.

## Overview

**Purpose:** Move inventory for a specific item from one bin to another — either within the same location or to a different location entirely

**When to Use:**
- Plants have been physically moved to a different bin and inventory needs to match
- Product needs to be consolidated from multiple bins into one
- Inventory needs to move from a greenhouse location to a staging or shipping area bin

**Note:** Bin reclassification moves inventory to a different *physical location or bin*. If you need to advance an item's blooming stage variant (e.g., from Green Bud to Full Bloom), use **Item Variant Reclass** instead — that is a separate function also available on the item card.

## Prerequisites

- The item must have inventory in at least one bin
- A destination bin must exist at the target location
- Production order bins and the current source bin are excluded as destinations
- **Bin Transfer Journal Template** and **Bin Transfer Journal Batch** must be configured in Clesen Setup

## How to Move Inventory Between Bins

### Step 1: Open the Bin Reclass Worksheet

1. Open the **Item Card** for the item you want to move
2. In the action bar, navigate to **Reclassification** → **Item Bin Reclass**

The **CLE Bin Content Reclass** worksheet opens, showing all bins that currently hold inventory for this item:

| Column | Description |
|--------|-------------|
| **Location Code** | The location where the inventory sits |
| **Zone Code** | The zone within the location |
| **Bin Code** | The specific bin holding the inventory |
| **Quantity (Base)** | Current quantity in the bin (base unit of measure) |
| **Unit of Measure** | Unit of measure code |

### Step 2: Select the Bin to Move From

Click on the row for the bin whose inventory you want to move.

### Step 3: Start the Reclassification

With the row selected, click **Reclass** in the action bar.

A dialog box opens with the following fields:

| Field | Description |
|-------|-------------|
| **Location Code** | The source location (pre-filled, read-only) |
| **To Location Code** | The destination location — defaults to source, but can be changed |
| **To Bin Code** | The destination bin — select from bins at the target location |
| **Quantity** | The quantity to move — defaults to the full bin quantity |

### Step 4: Choose the Destination and Quantity

1. If moving to a **different location**, change `To Location Code` first, then select `To Bin Code`
2. If staying at the **same location**, leave `To Location Code` as-is and select a different `To Bin Code`
3. Adjust the `Quantity` if you only want to move part of the bin's inventory
4. Click **OK**

The system immediately posts a transfer journal entry. No further confirmation step is needed.

The worksheet refreshes to show the updated bin quantities.

**⚠️ WARNING:** The move is posted immediately when you click **OK**. There is no undo — if you move inventory to the wrong bin, you must run the reclass again to move it back.

## Common Operations

### Consolidating Multiple Bins into One

**Scenario:** Item 10400 has inventory scattered across 3 bins; you want to consolidate into one.

**Process:**
1. Open Item Card for 10400
2. Click **Reclassification → Item Bin Reclass**
3. Worksheet shows 3 bins with inventory
4. Select first bin, click **Reclass**
5. Set destination to your consolidation bin, click **OK**
6. Repeat for remaining 2 bins
7. Result: All quantity now in single bin

### Moving Between Locations

**Scenario:** Inventory needs to move from Greenhouse location to Staging location.

**Process:**
1. Open Item Card
2. Click **Reclassification → Item Bin Reclass**
3. Select bin in Greenhouse location
4. Click **Reclass**
5. Change **To Location Code** from GREENHOUSE to STAGING
6. Select destination bin in STAGING
7. Click **OK**
8. System transfers quantity from Greenhouse bin to Staging bin

### Partial Bin Move

**Scenario:** Bin has 1000 units but you only need to move 400 to another location.

**Process:**
1. Open Item Card
2. Click **Reclassification → Item Bin Reclass**
3. Select the bin
4. Click **Reclass**
5. In dialog, change **Quantity** from 1000 to 400
6. Click **OK**
7. Result: 400 units move, 600 units remain in source bin

## Troubleshooting

### Issue: No Rows Appear in the Worksheet

**Cause:** The item has no inventory in any bin, or all bin quantities are zero or negative

**Solution:** Verify the item has positive inventory by checking the **Item Availability** or **Item Ledger Entries** page

### Issue: A Bin I Expect Does Not Appear in the Destination Lookup

**Cause:** 
- The bin is flagged as a Production Order bin (`CLE Production Order Bin = Yes`), which is excluded from reclassification destinations
- Or the bin does not exist at the selected `To Location Code`

**Solution:** Select a different destination bin. If the bin should be available, contact IT to review the bin's configuration

### Issue: The Reclass Action Produces an Error About Journal Setup

**Cause:** The **Bin Transfer Journal Template** or **Bin Transfer Journal Batch** is not configured in Clesen Setup

**Solution:** Contact IT or a system administrator to set up the bin transfer journal configuration in Clesen Setup

## FAQ

**Can I move inventory to a bin at a different location?**

Yes. Change the `To Location Code` in the dialog to the target location, then select a bin at that location.

**Can I move only part of the quantity in a bin?**

Yes. The `Quantity` field in the dialog defaults to the full bin quantity but can be reduced to move only a portion. The remaining quantity stays in the source bin.

**What journal entry does this create?**

The system posts a single **Transfer** item journal line. This creates a negative item ledger entry at the source bin and a positive entry at the destination bin.

**Does this affect inventory counts or valuations?**

No. A transfer between bins at the same location does not change the total inventory quantity or value — it only changes which bin holds it. Moving between locations also does not change valuation; it is still recorded as a transfer.

**What is the difference between bin reclass and variant reclass?**

Bin reclass moves inventory to a different physical location or bin — no change to item or variant. Variant reclass moves inventory from one blooming stage variant to the next (e.g., advancing from Green Bud to Full Bloom) — no change to bin. Both are available under **Reclassification** on the item card.

## Best Practices

✅ **DO:**
- Verify physical inventory location matches system before reclassifying
- Move inventory immediately after physical movement to keep system accurate
- Use consolidation to simplify bin management
- Document large or frequent moves
- Check Item Availability before moving to ensure you have correct quantity

❌ **DON'T:**
- Move inventory without physically verifying it
- Leave bins partially empty if consolidation is possible
- Forget to change location code when moving between locations
- Attempt to move to production order bins (system won't allow)
- Perform large moves without backup or verification

## Related Pages

- [[cart-exchange]] — Tracking reusable containers
- [[service-zone-configuration]] — Geographic delivery zones
- [[shipping-worksheet-overview]] — Shipping route planning
