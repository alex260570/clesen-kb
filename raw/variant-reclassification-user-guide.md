# Variant reclassification

> **Version:** 1.0
> **Last Updated:** 2026-03-10
> **Author:** Alexander Thiel
> **Audience:** Operations Staff

## Table of contents

- [Overview](#overview)
- [When to use this process](#when-to-use-this-process)
- [Prerequisites](#prerequisites)
- [How to reclassify inventory to the next blooming stage](#how-to-reclassify-inventory-to-the-next-blooming-stage)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## Overview

The **Item Variant Reclass** function moves inventory from one blooming stage variant to the next — for example, advancing plants from *Green Bud* to *Bud & Bloom*, or from *Bud & Bloom* to *Full Bloom*.

Each blooming stage is represented as a separate item variant. Reclassifying posts a pair of item journal entries in the background: a negative adjustment on the previous stage variant and a positive adjustment on the next stage variant, at the same bin(s). The physical inventory does not move — only the variant code recorded in the system changes.

This process is used for **manual, on-demand** stage advancement. Automatic stage advancement runs on a nightly job queue and does not require any user action.

> **Note:** Variant reclass changes the blooming stage recorded in inventory. If you need to move inventory to a different bin or location, use **Item Bin Reclass** instead — both functions are available under **Reclassification** on the item card.

---

## When to use this process

- Plants have reached the next blooming stage ahead of the scheduled job queue run and need to be advanced immediately
- A batch was manually inspected and confirmed ready for the next stage
- A correction is needed because a previous reclassification was entered with the wrong quantity

---

## Prerequisites

- The item must have blooming stage variants configured (each variant has a `CLE Stage` number)
- The item must have inventory in the stage you are advancing **from**
- You can only advance **forward** by one stage per reclass — the function always moves from the previous stage into the current row's stage
- You cannot reclass the first (lowest) stage — there is no earlier stage to draw inventory from. Use the Item Journal directly for initial inventory adjustments
- The **Variant Transfer Journal Template** and **Variant Transfer Journal Batch** must be configured in Clesen Setup

---

## How to reclassify inventory to the next blooming stage

### Step 1: Open the Variant Reclass worksheet

1. Open the **Item Card** for the item.
2. In the action bar, navigate to **Reclassification** > **Item Variant Reclass**.

The **Item Variant Reclass** worksheet opens. It shows one row per variant per location, sorted by stage number (lowest stage first). Only locations that have inventory for this item are shown.

| Column        | Description                                                                    |
|---------------|--------------------------------------------------------------------------------|
| `Location Code` | The location holding inventory of this variant                               |
| `Variant Code` | The blooming stage variant code                                               |
| `Description`  | Item description                                                              |
| `Inventory`    | Current quantity in this variant at this location (base unit of measure)      |
| `New Quantity` | The quantity to advance into this stage from the previous stage — you enter this |
| `Bins`         | The bin(s) the reclassification will post from — filled automatically         |

### Step 2: Enter the quantity to advance

In the `New Quantity` field on the row you want to advance **into**, enter the quantity to move forward from the previous stage.

For example: if you want to advance 50 plants from *Green Bud* into *Bud & Bloom*, find the *Bud & Bloom* row and enter `50` in `New Quantity`.

When you tab out of the field, the system:

1. Validates that `New Quantity` does not exceed the inventory currently in the **previous** stage
2. Looks up which bins hold that quantity in the previous stage variant

**If the quantity is fully contained in a single bin, or all bins together exactly equal the quantity**, the `Bins` field is filled in automatically.

**If the previous stage inventory is spread across multiple bins and the total exceeds `New Quantity`**, the **Bin Content Lookup** dialog opens. This dialog lists each bin holding the previous stage variant along with its quantity. Enter how much to take from each bin in the `Quantity to Reclass` column, then click **OK**.

> **Note:** The total `Quantity to Reclass` you enter across all bins should equal your `New Quantity`. The system does not enforce this total — make sure the quantities match.

### Step 3: Review the Bins field

After entering the quantity (and selecting bins if prompted), the `Bins` field shows the source bins and quantities in the format:

```text
"BinCode1" (qty1); "BinCode2" (qty2)
```

This is what will be posted. If the bin assignment looks wrong, clear the `New Quantity` field and re-enter it to re-trigger the bin lookup.

### Step 4: Post the reclassification

Click **Reclass** in the action bar.

The system posts negative and positive adjustment journal entries for every row where `New Quantity` is greater than zero. All rows are processed in one batch.

After posting, the worksheet refreshes automatically to show the updated inventory quantities. Rows with zero inventory in a stage are no longer shown.

> **Warning:** The reclassification posts immediately when you click **Reclass**. There is no confirm step. If you entered the wrong quantity, you must run the reclass again in the opposite direction — enter the quantity on the row of the stage you want to move back **into** (the previous stage's row).

---

## Field reference

| Field          | Editable | Description                                                                                      |
|----------------|----------|--------------------------------------------------------------------------------------------------|
| `Location Code`  | No     | Location where this variant's inventory sits                                                     |
| `Variant Code`   | No     | The blooming stage variant code                                                                  |
| `Description`    | No     | Item description                                                                                 |
| `Inventory`      | No     | Current quantity in this variant at this location (base unit of measure)                        |
| `New Quantity`   | Yes    | Quantity to advance **into** this stage from the previous stage                                  |
| `Bins`           | No     | Auto-populated source bins and quantities; shown as `"BinCode" (qty)` pairs separated by `;`    |

---

## Troubleshooting

### Error: "New Quantity cannot be greater than Inventory of previous stage"

**Cause:** The value entered in `New Quantity` exceeds the inventory currently in the preceding blooming stage.

**Solution:** Reduce `New Quantity` to be equal to or less than the `Inventory` shown on the previous stage's row.

---

### Error: "No previous stage found. To adjust inventory for this variant, please use the Item Journal."

**Cause:** You entered a `New Quantity` on the row for the first (lowest) blooming stage. There is no earlier stage to draw from.

**Solution:** The first stage cannot be advanced into via variant reclass — it has no predecessor. If you need to add inventory to the first stage, use the **Item Journal** directly with a positive adjustment for that variant.

---

### Error: "Variant Transfer Journal Template and/or Variant Transfer Journal Batch not set up in Clesen Setup."

**Cause:** The journal configuration required to post reclassification entries is missing.

**Solution:** Contact IT or a system administrator to configure the **Variant Transf. Jrnl. Template** and **Variant Transf. Jrnl. Batch** fields in Clesen Setup.

---

### The Bins field is blank after entering a New Quantity

**Cause:** No bin content was found for the previous stage variant at this location, or the Bin Content Lookup dialog was cancelled.

**Solution:** Verify that the previous stage variant has inventory recorded in a bin at this location. If bins are not in use at this location, contact IT — the reclassification function requires bin-level inventory tracking.

---

### The Bin Content Lookup dialog opened but I closed it without selecting bins

**Cause:** When the previous stage inventory is split across multiple bins and the total exceeds `New Quantity`, you must manually assign quantities per bin. Closing the dialog without confirming clears the `New Quantity` back to zero.

**Solution:** Re-enter the `New Quantity` to reopen the dialog, and this time fill in `Quantity to Reclass` on each bin before clicking **OK**.

---

## FAQ

**Can I reclass more than one stage at a time — for example, jump from stage 1 directly to stage 3?**

No. Each row advances inventory from the immediately preceding stage only. To move inventory two stages forward, run the reclass twice: once into stage 2, then again into stage 3.

**Can I reclass backward — move inventory from a later stage to an earlier one?**

Not directly. The worksheet only supports advancing forward (from a lower stage number into the row's stage). To reverse a reclassification, you would need to enter the correcting quantity on the earlier stage row — which will draw from the stage above it. Contact IT if this situation arises, as it may require a direct Item Journal entry.

**What happens to the physical plants when I reclass?**

Nothing — this is a system update only. The plants do not move physically. Variant reclass records that inventory has advanced to the next blooming stage in Business Central's inventory records.

**How is this different from the automatic nightly stage advancement?**

The nightly job queue runs `ProcessPendingStageChanges`, which automatically advances stages based on the scheduled `CLE Next Stage Change Date` on each item ledger entry. Variant Reclass is a manual override for when you need to advance a batch immediately — ahead of schedule or on demand.

**Why does the worksheet only show some locations?**

Only locations of type **Standard** that have inventory for this item are shown. Transit locations and locations with zero inventory are excluded.

**What journal entries does this create?**

For each bin in the `Bins` field, two item journal lines are posted: a **Negative Adjmt.** on the previous stage variant and a **Positive Adjmt.** on the current stage variant — both at the same bin and quantity. The document number on the entries is `Variant Reclass`.

---

## Related documents

- [[bin-reclassification-user-guide]]
- [[item-substitution-user-guide]]
- [[gtin-upc-management-user-guide]]

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/variant-reclassification-user-guide.pdf)
