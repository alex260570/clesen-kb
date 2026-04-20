# Bin reclassification

> **Version:** 1.0
> **Last Updated:** 2026-03-10
> **Author:** Alexander Thiel
> **Audience:** Operations Staff

## Table of contents

- [Overview](#overview)
- [When to use this process](#when-to-use-this-process)
- [Prerequisites](#prerequisites)
- [How to move inventory between bins](#how-to-move-inventory-between-bins)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## Overview

The **Item Bin Reclass** function lets you move inventory for a specific item from one bin to another — either within the same location or to a different location entirely. It does this by posting a single transfer journal entry in the background, with no manual journal setup required.

This is a physical-move tool: use it when product has been physically moved to a different bin and the system needs to reflect that change.

> **Note:** Bin reclassification moves inventory between bins. If you need to advance an item's blooming stage variant (e.g., from Green Bud to Full Bloom), use **Item Variant Reclass** instead — that is a separate function also available on the item card.

---

## When to use this process

- Plants have been physically moved to a different bin and inventory needs to match
- Product needs to be consolidated from multiple bins into one
- Inventory needs to move from a greenhouse location to a staging or shipping area bin

---

## Prerequisites

- The item must have inventory in at least one bin
- A destination bin must exist at the target location
- Production order bins and the current source bin are excluded as destinations — a valid non-production bin must be available at the target location
- The **Bin Transfer Journal Template** and **Bin Transfer Journal Batch** must be configured in Clesen Setup

---

## How to move inventory between bins

### Step 1: Open the Bin Reclass worksheet

1. Open the **Item Card** for the item you want to move.
2. In the action bar, navigate to **Reclassification** > **Item Bin Reclass**.

The **CLE Bin Content Reclass** worksheet opens, showing all bins that currently hold inventory for this item:

| Column              | Description                                          |
|---------------------|------------------------------------------------------|
| `Location Code`     | The location where the inventory sits                |
| `Zone Code`         | The zone within the location                         |
| `Bin Code`          | The specific bin holding the inventory               |
| `Quantity (Base)`   | Current quantity in the bin (base unit of measure)   |
| `Unit of Measure`   | Unit of measure code                                 |

### Step 2: Select the bin to move from

Click on the row for the bin whose inventory you want to move.

### Step 3: Start the reclassification

With the row selected, click **Reclass** in the action bar.

A dialog box opens with the following fields:

| Field               | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| `Location Code`     | The source location (pre-filled, read-only)                        |
| `To Location Code`  | The destination location — defaults to source, but can be changed  |
| `To Bin Code`       | The destination bin — select from bins at the target location       |
| `Quantity`          | The quantity to move — defaults to the full bin quantity            |

### Step 4: Choose the destination and quantity

1. If moving to a **different location**, change `To Location Code` first, then select `To Bin Code`.
2. If staying at the **same location**, leave `To Location Code` as-is and select a different `To Bin Code`.
3. Adjust the `Quantity` if you only want to move part of the bin's inventory.
4. Click **OK**.

The system immediately posts a transfer journal entry. No further confirmation step is needed.

The worksheet refreshes to show the updated bin quantities.

> **Warning:** The move is posted immediately when you click **OK**. There is no undo — if you move inventory to the wrong bin, you must run the reclass again to move it back.

---

## Troubleshooting

### No rows appear in the worksheet

**Cause:** The item has no inventory in any bin, or all bin quantities are zero or negative.

**Solution:** Verify the item has positive inventory by checking the **Item Availability** or **Item Ledger Entries** page.

---

### A bin I expect does not appear in the destination lookup

**Cause:** The bin is flagged as a Production Order bin (`CLE Production Order Bin = Yes`), which is excluded from reclassification destinations. Or the bin does not exist at the selected `To Location Code`.

**Solution:** Select a different destination bin. If the bin should be available, contact IT to review the bin's configuration.

---

### The Reclass action produces an error about journal setup

**Cause:** The **Bin Transfer Journal Template** or **Bin Transfer Journal Batch** is not configured in Clesen Setup.

**Solution:** Contact IT or a system administrator to set up the bin transfer journal configuration in Clesen Setup.

---

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

---

## Related documents

- [[variant-reclassification-user-guide]]
- [[item-substitution-user-guide]]
- [[gtin-upc-management-user-guide]]

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/bin-reclassification-user-guide.pdf)
