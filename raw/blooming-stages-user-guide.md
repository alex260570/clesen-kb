# Blooming stages

> **Version:** 1.0
> **Last Updated:** 2026-03-16
> **Author:** Alexander Thiel
> **Audience:** Growers, Operations Staff

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to use the Grower Stage Worksheet](#how-to-use-the-grower-stage-worksheet)
- [How stage transitions work automatically](#how-stage-transitions-work-automatically)
- [How to advance stages from scouting reports](#how-to-advance-stages-from-scouting-reports)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

The **Blooming Stages** system tracks where plants are in their blooming cycle — from Green Bud through Bud & Bloom, Full Bloom, and Overgrown. Each stage is represented as a separate item variant in Business Central.

The system:

1. Tracks which blooming stage each batch of inventory is in
2. Calculates when each batch should advance to the next stage
3. Automatically reclassifies inventory from one stage variant to the next on schedule
4. Provides a worksheet for growers to review, delay, or immediately process upcoming transitions

**Blooming stages:**

| Stage        | Description                                  |
|--------------|----------------------------------------------|
| Green Bud    | Early stage, buds forming                    |
| Bud & Bloom  | Buds opening, partial bloom                  |
| Full Bloom   | Fully open, ready for sale                   |
| Overgrown    | Past peak, quality declining                 |

---

## When to use it

Use the **Grower Stage Worksheet** when:

- You need to review which batches are due for a stage transition today
- You want to advance a batch immediately (ahead of the scheduled date)
- You need to delay a transition because plants are not yet ready
- You want to see what transitions are coming up in the next few days

> **Note:** Most stage transitions happen automatically via a nightly job queue. The worksheet is for reviewing, overriding, and handling exceptions.

---

## What you need before you start

- The **Activate Blooming Stages** toggle must be enabled in Growing Setup
- Items must have blooming stage variants configured (each variant has a `CLE Blooming Stage` value)
- The **Variant Transfer Journal Template** and **Variant Transfer Journal Batch** must be set up in Growing Setup
- A **Blooming Stage Calendar** must be configured (defines working days for stage scheduling)

> **Note:** These are one-time setup items. If they are not configured, contact your system administrator.

---

## How to use the Grower Stage Worksheet

### Step 1: Open the worksheet

1. Search for **Grower Stage Worksheet** in the Business Central search bar.
2. The page opens and automatically loads all entries due for a stage transition today.

Each row represents a batch of inventory or a production order line that is scheduled to advance to its next blooming stage.

### Step 2: Review the entries

For each row, check:

- `Item No.` and `Item Description` — which plant
- `Current Blooming Stage` — where it is now (e.g., Green Bud)
- `Next Blooming Stage` — where it will go (e.g., Bud & Bloom)
- `Planned Date` — when the transition is scheduled
- `Quantity` — how many units
- `Source Type` — whether this is inventory (Item Ledger Entry) or in-production (Production)

### Step 3: Process, delay, or preview

You have four actions available in the toolbar:

**Process Now** — Immediately post the stage transition for selected lines.

1. Select one or more lines.
2. Click **Process Now**.
3. The system posts the reclassification (negative adjustment on old variant, positive on new variant) or advances the production order line's blooming stage.
4. The worksheet refreshes to show updated entries.

**Delay** — Push back a transition that is not ready yet.

1. Enter the number of days to delay in the `Delay Days` column on each line you want to postpone.
2. Select the lines.
3. Click **Delay**.
4. The system updates the `CLE Next Stage Change Date` on the source record.

> **Note:** If you click **Delay** on a line with `Delay Days` = 0, the system shows an error. Enter a value first.

**Show Next 3 Days** — Preview upcoming transitions.

1. Click **Show Next 3 Days**.
2. The worksheet reloads with all entries due within the next 3 days (not just today).
3. Use this to plan ahead and identify batches that may need early processing or delay.

**Refresh** — Reload the worksheet from current data.

1. Click **Refresh**.
2. The worksheet reloads from current Item Ledger Entries and Production Orders, showing only entries due today.

---

## How stage transitions work automatically

A job queue entry runs `ProcessPendingStageChanges` on a schedule (typically nightly). It:

1. Finds all Item Ledger Entries where `CLE Next Stage Change Date` is on or before today
2. Posts reclassification journal entries to move inventory from the current variant to the next-stage variant
3. Finds all Released Production Order Lines where the stage change date is due
4. Advances the `CLE Blooming Stage` field on those lines

> **Note:** If **Auto Transition to Overgrown** is turned off in Growing Setup, the system does not automatically advance items from Full Bloom to Overgrown. Those items stay at Full Bloom until manually processed.

---

## How to advance stages from scouting reports

When reviewing plants during scouting, you can advance individual entries immediately:

1. Open the **Scouting Report Lines** page.
2. Find the line for the batch you want to advance.
3. Click **Post Next Stage**.
4. The system processes the transition:
   - For **Bin Content** lines: posts a reclassification journal (negative on current variant, positive on next variant)
   - For **Production Order** lines: advances the `CLE Blooming Stage` field on the production order line

---

## Field reference

These are the fields on the **Grower Stage Worksheet**:

| Field                    | What it means                                                                           | Can you edit it? |
|--------------------------|-----------------------------------------------------------------------------------------|------------------|
| `Source Type`            | Where this entry comes from: Item Ledger Entry (inventory) or Production (in-process)   | No               |
| `Item No.`              | The item number                                                                         | No               |
| `Item Description`      | Description of the item                                                                 | No               |
| `Location Code`         | The warehouse location holding this inventory                                           | No               |
| `Bin Code`              | The specific bin within the location                                                    | No               |
| `Current Blooming Stage` | The stage the batch is in now                                                          | No               |
| `Next Blooming Stage`   | The stage the batch will advance to                                                     | No               |
| `Planned Date`          | When the transition is scheduled                                                        | No               |
| `Original Planned Date` | The original scheduled date before any delays                                           | No               |
| `Delay Days`            | Number of days to delay this transition — enter a value before clicking **Delay**       | Yes              |
| `Quantity`              | Number of units in this batch                                                           | No               |

---

## Troubleshooting

### Error: "Line X has no delay days specified"

**Cause:** You clicked **Delay** on a line where the `Delay Days` field is 0.

**Solution:** Enter the number of days you want to delay in the `Delay Days` column, then click **Delay** again.

---

### The worksheet is empty when I open it

**Cause:** No entries are due for a stage transition today, or the Blooming Stages feature is not active.

**Solution:**

- Click **Show Next 3 Days** to see if transitions are coming up soon.
- If still empty, verify that items have blooming stage variants with `CLE No. of Days` configured.
- Check with your administrator that **Activate Blooming Stages** is enabled in Growing Setup.

---

### Error: "Variant Transfer Journal Template and/or Variant Transfer Journal Batch not set up"

**Cause:** The journal configuration required to post reclassification entries is missing.

**Solution:** Contact your system administrator to configure the **Variant Transf. Jrnl. Template** and **Variant Transf. Jrnl. Batch** fields in Growing Setup.

---

### Items stuck at Full Bloom and not advancing to Overgrown

**Cause:** The **Auto Transition to Overgrown** setting is turned off in Growing Setup. This is intentional — many operations prefer to keep items at Full Bloom until manually reviewed.

**Solution:** If you want to advance to Overgrown, use the worksheet's **Process Now** action on those lines. If you want automatic advancement, ask your administrator to enable **Auto Transition to Overgrown**.

---

## FAQ

**What is the difference between the worksheet and the automatic job queue?**

The job queue runs on a schedule (typically nightly) and processes all due transitions automatically. The worksheet lets you review what is due, process entries immediately, or delay entries that are not ready. Both use the same underlying logic.

**Can I advance a batch by more than one stage at a time?**

No. Each transition advances by exactly one stage. To move from Green Bud to Full Bloom, the batch must first go through Bud & Bloom.

**What does "Source Type: Production" mean?**

It means the entry comes from a Released Production Order Line. The plants are still in production and have not been posted to inventory yet. Advancing the stage updates the `CLE Blooming Stage` field on the production order line.

**What does "Source Type: Item Ledger Entry" mean?**

It means the entry comes from inventory that has already been received or produced. Advancing the stage posts a reclassification journal to move the quantity from one variant to the next.

**How does the non-working day adjustment work?**

The system uses the Blooming Stage Calendar to adjust planned dates. If a transition falls on a non-working day (e.g., Saturday), it appears on the worksheet on the last working day before that (e.g., Friday). This ensures growers see and process transitions before the weekend.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/blooming-stages-user-guide.pdf)
