# Growing stages

> **Version:** 2.4
> **Last Updated:** 2026-03-17
> **Author:** Alexander Thiel
> **Audience:** Growers, Operations Staff

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to use the Grower Stage Worksheet](#how-to-use-the-grower-stage-worksheet)
- [Automatic stage progression](#automatic-stage-progression)
- [Grower Stage Worksheet - Advanced Usage](#grower-stage-worksheet---advanced-usage)
- [How to advance stages from scouting reports](#how-to-advance-stages-from-scouting-reports)
- [Growing Setup - Configuration Reference](#growing-setup---configuration-reference)
- [Field reference](#field-reference)
- [Stage profiles for non-blooming items](#stage-profiles-for-non-blooming-items)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

The **Growing Stages** system tracks where plants are in their growth cycle through up to four stages, plus an Overgrown end stage. Each stage is represented as a separate item variant in Business Central. Stage display names are customizable via Stage Profiles — for flowering plants the default names are Green Bud, Bud & Bloom, Full Bloom, and Overgrown.

The system:

1. Tracks which growing stage each batch of inventory is in
2. Calculates when each batch should advance to the next stage
3. Automatically reclassifies inventory from one stage variant to the next on schedule
4. Provides a worksheet for growers to review, delay, or immediately process upcoming transitions

**Growing stages:**

| Stage     | Default Display Name | Description                                  |
|-----------|---------------------|----------------------------------------------|
| Stage 1   | Green Bud           | Early stage, buds forming                    |
| Stage 2   | Bud & Bloom         | Buds opening, partial bloom                  |
| Stage 3   | Full Bloom          | Fully open, ready for sale                   |
| Overgrown | Overgrown           | Past peak, quality declining                 |

*Display names shown here are from the default BLOOMING profile. Items with different Stage Profiles will show different names (see [Stage Profiles](#stage-profiles-for-non-blooming-items)).*

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

- The **Activate Growing Stages** toggle must be enabled in Growing Setup
- Items must have growing stage variants configured (each variant has a `CLE Growing Stage` value set to Stage 1, Stage 2, Stage 3, or Overgrown)
- Items should have a **Stage Profile** assigned (e.g., BLOOMING) to display friendly stage names instead of generic values
- The **Variant Transfer Journal Template** and **Variant Transfer Journal Batch** must be set up in Growing Setup
- A **Growing Stage Calendar** must be configured (defines working days for stage scheduling)

> **Note:** These are one-time setup items. If they are not configured, contact your system administrator.

---

## How to use the Grower Stage Worksheet

### Step 1: Open the worksheet

1. Search for **Grower Stage Worksheet** in the Business Central search bar.
2. The page opens and automatically loads all entries due for a stage transition today.

Each row represents a batch of inventory or a production order line that is scheduled to advance to its next growing stage.

### Step 2: Review the entries

For each row, check:

- `Item No.` and `Item Description` — which plant
- `Current Stage` — where it is now (e.g., Green Bud (Stage 1))
- `Next Stage` — where it will go (e.g., Bud & Bloom (Stage 2))
- `Planned Date` — when the transition is scheduled
- `Quantity` — how many units
- `Source Type` — whether this is inventory (Item Ledger Entry) or in-production (Production)

### Step 3: Process, delay, or preview

You have four actions available in the toolbar:

**Process Now** — Immediately post the stage transition for selected lines.

1. Select one or more lines.
2. Click **Process Now**.
3. The system posts the reclassification (negative adjustment on old variant, positive on new variant) or advances the production order line's growing stage.
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

## Automatic stage progression

The Growing Stages system can automatically advance inventory through each growth stage based on scheduled transitions. This section explains how the automation works, how to configure it, and how to monitor it.

### Overview of automatic progression

A **job queue entry** runs the automatic stage change processor on a schedule (typically nightly). When it runs, it:

1. Finds all **Item Ledger Entries** (inventory in bins) where `CLE Next Stage Change Date` is on or before today
2. Posts an **Item Reclassification Journal** to move inventory from the current variant to the next-stage variant (e.g., Green Bud (Stage 1) → Bud & Bloom (Stage 2))
3. Finds all **Released Production Order Lines** where the stage change date is due
4. Advances the `CLE Growing Stage` field on those production lines to the next stage

The system processes each batch independently. If one batch encounters an error, the other batches continue processing normally.

> **Important:** The automated job queue processes transitions **without user intervention**. The Grower Stage Worksheet is provided so growers can review upcoming transitions, delay items that are not ready, or manually process items ahead of schedule.

---

### How stage duration is configured

Each **Item Variant** has two growing stage settings:

| Field              | What it controls                                                                 |
|--------------------|----------------------------------------------------------------------------------|
| `Growing Stage`   | The growth stage this variant represents — select from generic values (Stage 1, Stage 2, Stage 3, Overgrown). The `Stage Description` column shows the display name from the item's Stage Profile. |
| `Stage Description`| Read-only — shows the display name from the item's Stage Profile (e.g., "Green Bud" for Stage 1 under the BLOOMING profile, or "Small" under a FOLIAGE profile) |
| `No. of Days`      | How many days inventory stays in this stage before advancing to the next         |
| `Stage` (integer)  | Auto-populated when a Growing Stage is selected — hidden from the UI, used internally for stage ordering |

**Example configuration** for a Rose:

| Variant Code | Growing Stage | Stage Description | No. of Days |
|--------------|----------------|-------------------|-------------|
| GB           | Stage 1        | Green Bud         | 5           |
| BB           | Stage 2        | Bud & Bloom       | 3           |
| FB           | Stage 3        | Full Bloom        | 2           |
| OG           | Overgrown      | Overgrown         | 0           |

With this configuration:
- When inventory is received as variant **GB**, the `Next Stage Change Date` is automatically set to **5 days from receipt date**.
- When the job queue runs 5 days later, it reclassifies the inventory from **GB** to **BB** and sets a new `Next Stage Change Date` **3 days forward**.
- The process repeats until the item reaches **Full Bloom**.

> **Note:** The `No. of Days` field tells the system how long inventory **stays in the current stage**, not how long until it reaches the next stage. This is calculated forward from the posting date.

---

### Setting the next stage change date

The system stamps the `CLE Next Stage Change Date` field automatically when:

1. **Purchase receipts** — When you receive inventory on a purchase order with a growing stage variant, the system calculates the first stage change date based on the receipt date + the variant's `No. of Days`.
2. **Production output** — When you post output for a production order, the next stage change date is calculated from the output posting date.
3. **Production order creation** — When a production order line is created with a variant, the system calculates the stage dates backward from the production order's **Due Date** to ensure the item reaches the correct stage on time.
4. **Manual reclassification or stage advancement** — When you use the Grower Stage Worksheet's **Process Now** action or advance a stage from a scouting report, the new stage change date is calculated forward from today.

You can manually edit the `CLE Next Stage Change Date` field on Item Ledger Entries and Production Order Lines if you need to override the calculated date.

---

### Non-working day adjustment (calendar setup)

The **Growing Stage Calendar** setting in Growing Setup tells the system which days are non-working days (weekends, holidays, or other days when the greenhouse is not staffed).

**How it works:**

- The system always calculates the raw `CLE Next Stage Change Date` based on calendar days (e.g., 5 days from today = March 22).
- The **job queue processes transitions on the exact calendar date** — it does not skip weekends or holidays.
- However, the **Grower Stage Worksheet adjusts the display date backward** to the last working day before the transition date.

**Example scenario:**

| Event                                     | Date        | Day       | What happens                                               |
|-------------------------------------------|-------------|-----------|------------------------------------------------------------|
| Inventory received                        | March 14    | Monday    | `Next Stage Change Date` set to March 19                   |
| Next stage change date                    | March 19    | Saturday  | A Saturday — defined as non-working in the calendar        |
| Last working day before Saturday          | March 17    | Friday    | Grower Stage Worksheet shows this entry on **Friday**      |
| Job queue processes transition            | March 19    | Saturday  | Transition is processed automatically (job queue runs 24/7)|
| Growers open worksheet on Monday          | March 21    | Monday    | The entry no longer appears — already processed            |

**Why this matters:**

- Growers see **upcoming weekend transitions on Friday** so they can review and delay anything that's not ready.
- The automated processing still happens on the correct calendar date — plants don't wait for Monday just because the greenhouse is closed.

**To configure the calendar:**

1. Search for **Base Calendar** in Business Central.
2. Create or open the calendar you want to use for growing stages.
3. Mark non-working days (Saturdays, Sundays, holidays).
4. Open **Growing Setup** and select this calendar in the **Growing Stage Calendar** field.

> **Tip:** If you don't configure a calendar, the system assumes every day is a working day, and the worksheet will only show entries due today or earlier.

---

### Job queue configuration and scheduling

The automatic stage processor runs through a **Job Queue Entry**. This entry must be configured by your system administrator.

**Typical configuration:**

| Setting                  | Value                                         |
|--------------------------|-----------------------------------------------|
| **Object Type to Run**   | Codeunit                                      |
| **Object ID to Run**     | 50129 (CLE Growing Stage Management)         |
| **Method to Run**        | ProcessPendingStageChanges                    |
| **Recurring**            | Yes                                           |
| **Run Frequency**        | Daily (typically runs at 1:00 AM)             |
| **Status**               | Ready                                         |

**How it works:**

- The job queue entry is scheduled to run at a specific time each day (typically overnight when no users are in the system).
- When it runs, it calls the `ProcessPendingStageChanges` method, which scans all open Item Ledger Entries and Production Order Lines for due transitions.
- The job posts reclassification journals and updates production lines automatically.
- Any errors are logged to the **Job Queue Log Entries** page.

**To view the job queue configuration:**

1. Search for **Job Queue Entries** in Business Central.
2. Find the entry for **Growing Stage Processing** (or similar name).
3. Open the entry to view the schedule and run history.

> **Note:** Only administrators with Job Queue Entry permissions can modify the schedule. Contact your administrator if you need to change when the automation runs.

---

### Monitoring automated transitions

You can monitor what the automation has done by reviewing:

1. **Item Ledger Entries** — Look for entries with `Document No.` = "Stage Reclass" and `Entry Type` = Positive/Negative Adjustment. These are the reclassifications posted by the automation.
2. **Production Order Lines** — Review the `CLE Growing Stage` and `CLE Next Stage Change Date` fields to see which stage each line is currently in.
3. **Job Queue Log Entries** — Search for this page to see when the job queue last ran and whether it completed successfully or encountered errors.

**Quick check: "Did the automation run last night?"**

1. Search for **Job Queue Log Entries**.
2. Find the entry for **Growing Stage Processing**.
3. Check the **End Date/Time** field — this shows when it last completed.
4. Check the **Status** field — should show **Success**. If it shows **Error**, click the entry to view the error message.

---

### Error handling and notifications

If the automated processor encounters an error, it logs the error to the Job Queue Log but **continues processing other batches**. One failed transition does not stop the entire automation.

**Common errors:**

| Error Message                                                     | Cause                                                                  | Solution                                                                 |
|-------------------------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------------------|
| "Variant Transfer Journal Template and/or Batch not configured"  | The Growing Setup is missing journal configuration                     | Contact your administrator to configure the journal template and batch   |
| "No variant found for the next growing stage"                    | The item is missing a variant for the next stage in the sequence       | Add the missing variant or mark the current variant as the final stage   |
| "Item X is blocked for posting"                                   | The item is marked as blocked in the Item card                         | Unblock the item or contact your administrator                           |

**Setting up notifications:**

Business Central does not automatically send email notifications when the job queue encounters errors. Your administrator can configure email notifications using the **Job Queue Entry** card's **Notify on Error** functionality or by setting up a custom alert.

> **Tip:** Check the Job Queue Log weekly to ensure the automation is running cleanly. Errors that go unnoticed for days can result in inventory sitting in the wrong stage.

---

### Auto Transition to Overgrown setting

The **Auto Transition to Overgrown** toggle in Growing Setup controls whether the automation advances items from **Stage 3** (e.g., Full Bloom) to **Overgrown** automatically.

| Setting       | What happens                                                                                 |
|---------------|----------------------------------------------------------------------------------------------|
| **Enabled**   | The automation processes all stage changes, including Full Bloom → Overgrown                 |
| **Disabled**  | The automation stops at Full Bloom. Items stay at Full Bloom until manually advanced.        |

**Why disable it?**

Many operations prefer to keep items at Full Bloom until manually reviewed because:
- Full Bloom items are still sellable, but Overgrown items may need to be discarded or marked down.
- Growers want to visually inspect each batch before marking it as Overgrown.
- The transition from Full Bloom to Overgrown has financial implications (potential write-offs or discounts).

**If Auto Transition to Overgrown is disabled:**

- Items will appear on the **Grower Stage Worksheet** when their Full Bloom period ends.
- Growers must use the **Process Now** action to manually advance them to Overgrown.
- The automation skips these entries and does not advance them automatically.

---

## How to advance stages from scouting reports

When reviewing plants during scouting, you can advance individual entries immediately:

1. Open the **Scouting Report Lines** page.
2. Find the line for the batch you want to advance.
3. Click **Post Next Stage**.
4. The system processes the transition:
   - For **Bin Content** lines: posts a reclassification journal (negative on current variant, positive on next variant)
   - For **Production Order** lines: advances the `CLE Growing Stage` field on the production order line

---

## Grower Stage Worksheet - Advanced Usage

This section provides detailed guidance on using the Grower Stage Worksheet for day-to-day oversight of growing stage transitions.

### Dashboard overview and layout

The **Grower Stage Worksheet** is a task-oriented page that loads dynamically each time you open it. It shows:

- All **inventory entries** (Item Ledger Entries) due for a stage change today (or within the next X days if you use **Show Next 3 Days**)
- All **production order lines** (Released Production Orders) due for a stage change today (or within the next X days)

The worksheet is **read-only** except for the `Delay Days` column, which you can edit before clicking **Delay**.

**Key indicators on the worksheet:**

| Column                   | What it tells you                                               |
|--------------------------|-----------------------------------------------------------------|
| `Source Type`            | Whether this is inventory (already in a bin) or in-production   |
| `Planned Date`           | The date this transition is scheduled to occur                  |
| `Original Planned Date`  | The original date before any delays (blank if never delayed)    |
| `Current Stage`          | Where the batch is now (display name from Stage Profile)        |
| `Next Stage`             | Where it will advance when processed (display name from Stage Profile) |
| `Quantity`               | How many units are in this batch                                |

**Refreshing the worksheet:**

The worksheet loads data when you open it, but it does not auto-refresh. If you process entries, delay entries, or if the automated job queue runs while you have the worksheet open, click **Refresh** to reload the current data.

---

### Reading the worksheet: upcoming transitions

When you open the worksheet, it automatically loads all entries due for a transition **today**. The date shown in the `Planned Date` column is adjusted for non-working days (see [Non-working day adjustment](#non-working-day-adjustment-calendar-setup)).

**Example:**

| Item No. | Current Stage | Next Stage  | Planned Date | Quantity | Source Type |
|----------|---------------|-------------|--------------|----------|-------------|
| ROSE-001 | Green Bud     | Bud & Bloom | 2026-03-17   | 150      | Inventory   |
| LILY-002 | Bud & Bloom   | Full Bloom  | 2026-03-17   | 200      | Production  |

**What this means:**

- There are **150 units of ROSE-001** in inventory (in a bin somewhere) currently at the Green Bud stage, scheduled to advance to Bud & Bloom today.
- There is a **production order for 200 units of LILY-002** currently at Bud & Bloom, scheduled to advance to Full Bloom today.

If you do nothing, the **automated job queue** will process these transitions tonight (or whenever it is scheduled to run).

---

### Approving transitions (confirming automated suggestions)

The worksheet does not require explicit "approval" — if an entry appears on the worksheet and you take no action, it will be processed automatically by the job queue.

However, if you want to **process an entry immediately** (instead of waiting for the job queue), you can:

1. Select the line(s) you want to process.
2. Click **Process Now**.
3. The system immediately posts the reclassification or advances the production line.
4. The worksheet refreshes, and the processed entries disappear.

**When to use Process Now:**

- You're reviewing batches during the day and confirm they are ready — no need to wait for tonight's job queue run.
- You want to expedite a transition because a customer needs inventory at a specific stage immediately.
- You're processing weekend entries on Friday and want them moved before you leave for the day.

**What happens when you click Process Now:**

- **For Inventory (Item Ledger Entry):** The system creates an Item Journal with one negative adjustment line (old variant) and one positive adjustment line (new variant), then posts the journal. The `CLE Next Stage Change Date` is cleared so the job queue doesn't process it again.
- **For Production:** The system updates the `CLE Growing Stage` field on the production order line to the next stage and recalculates the `CLE Next Stage Change Date` based on the new stage's `No. of Days`.

> **Important:** Processing an entry with **Process Now** is immediate and cannot be undone. If you need to reverse a stage advancement, you must post a manual reclassification journal to move the inventory back to the previous variant.

---

### Delay capability: postponing stage changes

If you review a batch and determine it is not yet ready to advance (e.g., the buds are smaller than expected, or you want to hold it at Full Bloom for a few more days), you can delay the transition.

**How to delay:**

1. In the `Delay Days` column, enter the number of days you want to postpone the transition.
2. Select the line(s) you want to delay.
3. Click **Delay**.
4. The system recalculates the `Planned Date` forward by the number of days you specified.
5. The `Original Planned Date` column is populated with the original date (if it was blank before).
6. The `Delay Days` field is reset to 0.

**Example:**

| Before Delay                          | Action       | After Delay                               |
|---------------------------------------|--------------|-------------------------------------------|
| Planned Date: 2026-03-17              | Delay 3 days | Planned Date: 2026-03-20                  |
| Original Planned Date: (blank)        |              | Original Planned Date: 2026-03-17         |

**What happens when you delay:**

- The system updates the `CLE Next Stage Change Date` field on the source record (Item Ledger Entry or Production Order Line).
- The entry disappears from the worksheet (because it is no longer due today).
- The job queue will process it on the new date unless you delay it again.

**Validation rules:**

- You must enter a value in the `Delay Days` column before clicking **Delay**. If you click **Delay** on a line with `Delay Days` = 0, you will see an error: *"Line X has no delay days specified."*
- The new planned date cannot be before today's work date. If you try to delay by a negative number of days (or if the calculation results in a past date), you will see an error.

**Can you delay multiple times?**

Yes. Each time you delay, the `Planned Date` is recalculated forward from the current `Planned Date`, and the `Original Planned Date` is preserved so you can see how far off schedule the batch has become.

---

### Bulk operations: processing multiple items at once

You can select multiple lines in the worksheet and perform actions on all of them simultaneously.

**How to select multiple lines:**

- Click the checkbox next to each line you want to include.
- OR: Use **Ctrl+Click** to select individual lines.
- OR: Use **Shift+Click** to select a range of lines.

**Available bulk operations:**

| Action        | What it does                                                                 |
|---------------|------------------------------------------------------------------------------|
| **Process Now** | Posts reclassification journals or advances production lines for all selected entries |
| **Delay**       | Delays all selected entries by the number of days specified in the `Delay Days` column for each line |

**Example: Processing all entries at once**

1. Open the worksheet (shows 10 entries due today).
2. Review each line visually or based on a scouting report.
3. Select all lines (or use **Ctrl+A** to select all).
4. Click **Process Now**.
5. All 10 transitions are processed immediately.

**Example: Delaying a subset of entries**

1. Open the worksheet (shows 10 entries due today).
2. Entry 1-7 look ready — leave them alone (job queue will process tonight).
3. Entry 8-10 need 2 more days — enter `2` in the `Delay Days` column for each.
4. Select lines 8-10.
5. Click **Delay**.
6. Lines 8-10 are rescheduled to 2026-03-19 and disappear from the worksheet.

---

### Exception handling: items not ready to advance

Sometimes a batch of plants is not developing as expected. Common scenarios:

| Scenario                                  | What to do                                    |
|-------------------------------------------|-----------------------------------------------|
| Batch is slow to develop                  | Use **Delay** to push back the transition date by a few days |
| Batch needs to stay at Full Bloom longer  | Delay by 7, 14, or more days as needed        |
| Batch should skip a stage                 | Not supported — contact your administrator to manually reclassify the inventory |
| Batch is damaged and should not advance   | Do not delay — remove the inventory via adjustment or scrap posting |

**What if I need to skip a stage entirely?**

The system does not support skipping stages. If you need to move a batch from Stage 1 (e.g., Green Bud) directly to Stage 3 (e.g., Full Bloom), skipping Stage 2, you must:

1. Post a manual Item Reclassification Journal to move the inventory from the Stage 1 variant to the Stage 3 variant.
2. Manually update the `CLE Next Stage Change Date` field on the Item Ledger Entry to the correct date for the Full Bloom stage.

**What if I need to move a batch backward to an earlier stage?**

The system does not support automatic stage reversal. If you need to move inventory from Stage 2 (e.g., Bud & Bloom) back to Stage 1 (e.g., Green Bud), you must:

1. Post a manual Item Reclassification Journal (negative adjustment on the Stage 2 variant, positive adjustment on the Stage 1 variant).
2. The system will calculate a new `CLE Next Stage Change Date` based on the Stage 1 variant's `No. of Days`.

---

### Viewing upcoming transitions (next 3 days)

The worksheet loads entries due **today** by default. To see what's coming up in the next few days:

1. Click **Show Next 3 Days**.
2. The worksheet reloads and includes all entries due within the next 3 days.
3. Review the `Planned Date` column to see which entries are due when.

**Use cases:**

- **Monday morning planning:** Open the worksheet with Show Next 3 Days to see what's coming up this week.
- **Friday afternoon preparation:** Check what's due over the weekend so you can delay or expedite as needed before leaving for the weekend.
- **Capacity planning:** Identify if multiple large batches are due on the same day so you can stagger them by delaying some.

> **Tip:** The "Show Next 3 Days" action is not limited to exactly 3 days — it shows entries due today through 3 days from today. If you want to see further ahead, click **Show Next 3 Days** again, or ask your administrator to add a custom action for "Show Next 7 Days" or "Show Next 14 Days."

---

### Viewing transition history

The worksheet does not maintain historical records — it only shows upcoming and due transitions. To review what has already been processed:

1. Search for **Item Ledger Entries** in Business Central.
2. Filter on `Document No.` = "Stage Reclass" to see all automated stage transitions.
3. Filter on `Entry Type` = Positive Adjmt. and Negative Adjmt. to see the paired journal lines for each transition.
4. Review the `Posting Date`, `Item No.`, `Variant Code`, and `Quantity` fields to see what was moved and when.

**For production order stage history:**

1. Open the **Released Production Order** for the item.
2. Open the production order lines.
3. Review the `CLE Growing Stage` and `CLE Next Stage Change Date` fields to see the current stage.
4. There is no built-in audit trail for production line stage changes — consider using the Change Log feature if you need to track stage advancement history.

---

### Performance monitoring: how fast are batches moving through stages?

The worksheet does not provide built-in reports for stage performance, but you can measure this manually:

**To calculate average days per stage:**

1. Open **Item Ledger Entries** and filter on a specific item and variant (e.g., ROSE-001, variant GB).
2. Filter on `Entry Type` = Positive Adjmt. and `Document No.` = "Stage Reclass".
3. Export the entries to Excel.
4. Calculate the difference between each posting date and the previous posting date to see how long each batch stayed in each stage.

**To identify slow-moving batches:**

1. Open the **Grower Stage Worksheet** and click **Show Next 3 Days**.
2. Review the `Original Planned Date` column — if an entry has an original date that is weeks in the past, the batch has been delayed multiple times and may need attention.

**To measure on-time vs. delayed transitions:**

1. At the end of each week, export the Item Ledger Entries with `Document No.` = "Stage Reclass" from the past week.
2. Compare the `Posting Date` to the `Original Planned Date` (if tracked separately in a custom field) to see if transitions are happening on schedule.

> **Tip:** If performance monitoring is important to your operation, ask your administrator to create a custom report that tracks stage transition times and identifies batches that are not advancing as expected.

---

## Growing Setup - Configuration Reference

This section documents all configuration settings for the Growing Stages system. These settings are accessed from the **Growing Setup** page.

> **Note:** Most settings on this page require administrator permissions. Contact your system administrator if you need to change these configurations.

---

### Complete configuration reference

The **Growing Setup** page contains all system-wide settings for growing stage management.

**To open Growing Setup:**

1. Search for **Growing Setup** in Business Central.
2. The page opens as a card (there is only one setup record).

---

### General settings

| Field                           | What it controls                                                                 | Default | Required? |
|---------------------------------|----------------------------------------------------------------------------------|---------|-----------|
| **Activate Growing Stages**    | Master toggle — if disabled, all growing stage automation is turned off         | No      | Yes       |
| **Purch. Receipt Stage Days**   | Default number of days before the first stage change on purchase receipt         | 0       | No        |
| **Auto Transition to Overgrown**| Whether the job queue automatically advances Full Bloom items to Overgrown       | No      | Yes       |
| **Growing Stage Calendar**     | Base calendar used to detect non-working days (weekends, holidays)               | (blank) | Recommended |

**Field details:**

**Activate Growing Stages** — This is the master on/off switch for the entire growing stages feature. If disabled:
- Stage change dates are not calculated on receipts or production orders.
- The automated job queue does not process any transitions.
- The Grower Stage Worksheet still opens, but it will be empty.
- Subscribers that stamp stage dates on Item Ledger Entries exit early and do not run.

> **Important:** Disabling this setting does not delete existing `CLE Next Stage Change Date` values on Item Ledger Entries or Production Order Lines. If you re-enable it later, those dates will be processed by the job queue.

**Purch. Receipt Stage Days** — This setting is **deprecated** and is no longer used by the system. Stage dates are calculated from the variant's `No. of Days` field instead. You can leave this field at 0.

**Auto Transition to Overgrown** — See [Auto Transition to Overgrown setting](#auto-transition-to-overgrown-setting) for full details. When disabled:
- The job queue skips Full Bloom → Overgrown transitions.
- Items stay at Full Bloom until manually advanced via the Grower Stage Worksheet or a scouting report.

**Growing Stage Calendar** — See [Non-working day adjustment](#non-working-day-adjustment-calendar-setup) for full details. If left blank:
- The system assumes every day is a working day.
- The Grower Stage Worksheet will not adjust planned dates backward for weekends or holidays.

---

### Journal configuration

| Field                              | What it controls                                                        | Default | Required? |
|------------------------------------|-------------------------------------------------------------------------|---------|-----------|
| **Variant Transf. Jrnl. Template** | Item journal template used for posting growing stage reclassifications | (blank) | Yes       |
| **Variant Transf. Jrnl. Batch**    | Item journal batch used for posting growing stage reclassifications    | (blank) | Yes       |

**Field details:**

The automated stage processor posts **Item Reclassification Journals** to move inventory from one variant to another. These two fields tell the system which journal template and batch to use for those postings.

**Typical values:**

- **Template:** ITEM or RECLASS (whichever item journal template your organization uses for adjustments)
- **Batch:** BLMSTAGE or AUTO-STAGE (a dedicated batch for automated stage transitions)

**Why use a dedicated batch?**

- You can review the journal lines before they are posted if you configure the batch to require manual posting (though this is not typical — most implementations use automatic posting).
- You can filter the Item Ledger Entries on `Document No.` = "Stage Reclass" and `Journal Batch Name` = your dedicated batch to see all automated transitions.

**Configuration checklist:**

1. Search for **Item Journal Templates** and verify the template you want to use exists.
2. Search for **Item Journal Batches** and verify the batch exists under the selected template. If it doesn't, create it.
3. Open **Growing Setup** and select the template and batch.
4. Test the configuration by opening the **Grower Stage Worksheet**, selecting an entry, and clicking **Process Now**. If you see an error about the journal template or batch not being configured, double-check your selections.

> **Important:** The batch you select should **not** be used for any other purpose. If users or other automation processes post to the same batch, the growing stage processor may encounter conflicts or post unexpected entries.

---

### Calendar management (working days, holidays, non-working days)

The **Growing Stage Calendar** setting controls which days are considered working days vs. non-working days for the purpose of displaying entries on the Grower Stage Worksheet.

**To configure the calendar:**

1. Search for **Base Calendar** in Business Central.
2. Create a new calendar or open an existing calendar (e.g., "GREENHOUSE" or "PRODUCTION").
3. Define which days of the week are working days:
   - Typically, Monday through Friday are working days.
   - Saturday and Sunday are non-working days.
4. Add customized calendar changes for holidays:
   - Search for **Customized Calendar Change** or open the **Calendar Entries** page from the Base Calendar card.
   - Add entries for company holidays, inventory count days, or other non-working days.
5. Return to **Growing Setup** and select this calendar in the **Growing Stage Calendar** field.

**Example calendar setup:**

| Day of Week | Working? | Notes                                    |
|-------------|----------|------------------------------------------|
| Monday      | Yes      |                                          |
| Tuesday     | Yes      |                                          |
| Wednesday   | Yes      |                                          |
| Thursday    | Yes      |                                          |
| Friday      | Yes      |                                          |
| Saturday    | No       | Greenhouse closed                        |
| Sunday      | No       | Greenhouse closed                        |

**Example holiday entries:**

| Date       | Description          | Nonworking? |
|------------|----------------------|-------------|
| 2026-12-25 | Christmas Day        | Yes         |
| 2026-01-01 | New Year's Day       | Yes         |
| 2026-07-04 | Independence Day     | Yes         |

**How the calendar affects stage transitions:**

- The **job queue** processes transitions on the exact calendar date, regardless of working days.
- The **Grower Stage Worksheet** adjusts the display date backward to the last working day before the transition date so growers see weekend entries on Friday.

**What if we operate 7 days a week?**

If your greenhouse operates every day (or if you want the worksheet to show entries on their exact transition date without adjustment), leave the **Growing Stage Calendar** field blank. The system will assume every day is a working day.

---

### Stage duration defaults by variety/season

There are no system-level defaults for stage durations — each **Item Variant** has its own `No. of Days` setting. This allows you to configure different durations for different varieties or even different seasons.

**Example: Seasonal variation for Roses**

| Variant Code | Growing Stage | Stage Description | No. of Days | Notes                          |
|--------------|----------------|-------------------|-------------|--------------------------------|
| GB-WINTER    | Stage 1        | Green Bud         | 7           | Slower growth in winter        |
| GB-SUMMER    | Stage 1        | Green Bud         | 4           | Faster growth in summer        |

Most implementations use a single set of variants per item, but you can create multiple sets if your stage durations vary significantly by season.

**To configure stage durations:**

1. Search for **Items** and open the item you want to configure.
2. Click **Variants** to open the Item Variants page.
3. For each variant, set the `Growing Stage` field to the generic stage it represents (Stage 1, Stage 2, Stage 3, or Overgrown). The `Stage Description` column will show the display name from the item's Stage Profile.
4. Set the `No. of Days` field to how long inventory stays in that stage before advancing. The `Stage` (integer) field is auto-populated and does not need to be set manually.

**Recommendations:**

- Start with conservative estimates (longer durations) and adjust based on actual growth rates.
- Review stage durations quarterly and adjust if you notice batches are consistently being delayed or advanced early.
- Use the [Performance monitoring](#performance-monitoring-how-fast-are-batches-moving-through-stages) techniques to measure actual vs. expected stage times.

---

### Automation settings and thresholds

The system does not have configurable thresholds for automation (e.g., "only process batches larger than X units" or "skip batches older than X days"). All entries with a `CLE Next Stage Change Date` on or before today are processed by the job queue.

**If you need conditional automation:**

Contact your administrator to customize the `ProcessPendingStageChanges` procedure in Codeunit 50129. You can add filters or conditional logic to skip certain entries based on custom criteria.

**Example customizations (require AL code changes):**

- Skip batches smaller than 50 units (to avoid processing small test batches).
- Skip batches where the item is blocked.
- Skip batches where the location is closed for inventory count.

---

### Job queue entry configuration

The job queue entry that runs the automatic stage processor must be configured manually by an administrator. This is not a setting in Growing Setup — it is a separate Job Queue Entry record.

**To configure the job queue entry:**

1. Search for **Job Queue Entries** in Business Central.
2. Click **New** to create a new entry.
3. Fill in the following fields:

| Field                  | Value                                         |
|------------------------|-----------------------------------------------|
| **Object Type to Run** | Codeunit                                      |
| **Object ID to Run**   | 50129                                         |
| **Method Name**        | ProcessPendingStageChanges                    |
| **Status**             | Ready                                         |
| **Recurring Job**      | Yes                                           |
| **Run on Mondays**     | Yes                                           |
| **Run on Tuesdays**    | Yes                                           |
| **Run on Wednesdays**  | Yes                                           |
| **Run on Thursdays**   | Yes                                           |
| **Run on Fridays**     | Yes                                           |
| **Run on Saturdays**   | Yes (optional, if you want weekend processing)|
| **Run on Sundays**     | Yes (optional, if you want weekend processing)|
| **Starting Time**      | 01:00:00 (1:00 AM, or adjust as needed)       |
| **No. of Minutes between Runs** | 1440 (daily)                      |

4. Click **Set Status to Ready** to activate the job queue entry.

**Testing the job queue entry:**

1. Find the entry in the Job Queue Entries page.
2. Click **Run** (or **Run Once**) to execute it immediately (instead of waiting for the scheduled time).
3. Check the **Job Queue Log Entries** page to see if it completed successfully.
4. Open the **Item Ledger Entries** page and filter on `Document No.` = "Stage Reclass" to see if any reclassifications were posted.

**What if the job queue entry doesn't run?**

Common issues:

- **Status is not "Ready"** — Change the status to Ready.
- **No job queue server is running** — Contact your administrator to ensure the job queue service is running in the Business Central environment.
- **The codeunit or method name is incorrect** — Verify the Object ID is 50129 and the Method Name is ProcessPendingStageChanges (case-sensitive).
- **Permissions issue** — The job queue runs under a service account — ensure that account has permissions to post Item Journals and modify Item Ledger Entries.

---

### System administrator tasks

The following tasks require administrator permissions and should be performed during initial setup or when making significant changes to the growing stages system:

**Initial setup checklist:**

- [ ] Enable the **Activate Growing Stages** toggle in Growing Setup.
- [ ] Create or configure a **Base Calendar** with working days and holidays.
- [ ] Select the calendar in the **Growing Stage Calendar** field in Growing Setup.
- [ ] Create or identify an **Item Journal Template** and **Batch** for stage reclassifications.
- [ ] Select the template and batch in Growing Setup.
- [ ] Configure **Item Variants** for each growing stage item with `Growing Stage` and `No. of Days` values.
- [ ] Create a **Job Queue Entry** to run the automated stage processor on a schedule.
- [ ] Test the automation by manually running the job queue entry and verifying it processes due entries.

**Ongoing maintenance tasks:**

- Review the **Job Queue Log Entries** weekly to ensure the automation is running cleanly.
- Adjust **stage durations** (variant `No. of Days` fields) if growers report batches are consistently being delayed or advanced early.
- Update the **Base Calendar** annually to reflect new holiday schedules.
- Monitor the **Variant Transfer Journal Batch** to ensure it is not filling up with unposted lines (it should be empty after each job queue run).

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
| `Current Stage`          | The stage the batch is in now (shows display name from Stage Profile)                  | No               |
| `Next Stage`            | The stage the batch will advance to (shows display name from Stage Profile)              | No               |
| `Planned Date`          | When the transition is scheduled                                                        | No               |
| `Original Planned Date` | The original scheduled date before any delays                                           | No               |
| `Delay Days`            | Number of days to delay this transition — enter a value before clicking **Delay**       | Yes              |
| `Quantity`              | Number of units in this batch                                                           | No               |

---

## Stage profiles for non-blooming items

The growing stages system uses **generic enum values** internally: Stage 1, Stage 2, Stage 3, and Overgrown. When you set up item variants, you select these generic stages from a dropdown. **Stage Profiles** give these generic names their friendly display names — so users see "Green Bud" instead of "Stage 1" on pages, worksheets, and reports.

By default, blooming items show Green Bud, Bud & Bloom, Full Bloom, and Overgrown. These names make sense for flowering plants, but not for items like foliage, succulents, or other non-blooming crops. Stage Profiles let you define custom display names for any category of items. The underlying logic (progression, substitution, customer preferences) stays exactly the same — only the display labels change.

### How Stage Profiles work

Stage Profiles use a **Card page with a Lines subpage** (header/line structure):

- **Header** — Contains the profile **Code** (e.g., `FOLIAGE`) and **Description** (e.g., "Foliage stage profile")
- **Lines** — Each line maps a **Stage** (enum dropdown: Stage 1, Stage 2, Stage 3, Overgrown) to a **Display Name** (the friendly label users will see)

### Default BLOOMING profile

The first time you open the **Stage Profiles** page, the system automatically creates a default **BLOOMING** profile with these lines:

| Stage     | Display Name |
|-----------|-------------|
| Stage 1   | Green Bud   |
| Stage 2   | Bud & Bloom |
| Stage 3   | Full Bloom  |
| Overgrown | Overgrown   |

This ensures that the standard growing stage names are available out of the box without any manual setup.

### Creating a Stage Profile

1. Search for **Stage Profiles** in Business Central, or use the Tell Me search bar
2. On the Stage Profiles list, click **New** to create a new profile (or click on an existing one to edit it)
3. On the Stage Profile Card:
   - Fill in the **Code** (e.g., `FOLIAGE`) and **Description** (e.g., "Foliage stage profile")
   - In the **Lines** section, add a line for each stage you want to name:
     - **Stage** — Select the generic stage from the dropdown (Stage 1, Stage 2, Stage 3, or Overgrown)
     - **Display Name** — Enter the friendly label for that stage (e.g., "Small", "Medium", "Large")

**Examples:**

| Profile   | Stage     | Display Name |
|-----------|-----------|-------------|
| BLOOMING  | Stage 1   | Green Bud   |
| BLOOMING  | Stage 2   | Bud & Bloom |
| BLOOMING  | Stage 3   | Full Bloom  |
| BLOOMING  | Overgrown | Overgrown   |
| FOLIAGE   | Stage 1   | Small       |
| FOLIAGE   | Stage 2   | Medium      |
| FOLIAGE   | Stage 3   | Large       |
| FOLIAGE   | Overgrown | Overgrown   |
| SUCCULENT | Stage 1   | Starter     |
| SUCCULENT | Stage 2   | Growing     |
| SUCCULENT | Stage 3   | Mature      |
| SUCCULENT | Overgrown | Overgrown   |

### Assigning a Stage Profile to an item

1. Open the **Item Card** for the item
2. Find the **Stage Profile** field (visible when the Growing Stages feature is active)
3. Select the profile you created

Once assigned, all pages and messages for that item will show the custom display names instead of the generic stage names.

### Assigning a Stage Profile to a Variant Template

1. Open the **Variant Template Card**
2. Set the **Stage Profile** field to the desired profile
3. When you apply the template to an item, the Stage Profile is automatically copied to the item — as long as the item does not already have a profile assigned

This is useful when you have many items that share the same stage naming convention. Set it once on the template, and every item that uses the template gets the profile automatically.

### Backward compatibility

If no Stage Profile is assigned to an item, the system shows the raw enum captions (Stage 1, Stage 2, Stage 3, Overgrown) — it does **not** fall back to the BLOOMING profile automatically. To see friendly display names like Green Bud, Bud & Bloom, and Full Bloom, you must assign the BLOOMING profile (or another profile) to the item. Existing items that previously used growing stages should have the BLOOMING profile assigned to preserve the familiar display names.

---

## Troubleshooting

### Error: "Line X has no delay days specified"

**Cause:** You clicked **Delay** on a line where the `Delay Days` field is 0.

**Solution:** Enter the number of days you want to delay in the `Delay Days` column, then click **Delay** again.

---

### The worksheet is empty when I open it

**Cause:** No entries are due for a stage transition today, or the Growing Stages feature is not active.

**Solution:**

- Click **Show Next 3 Days** to see if transitions are coming up soon.
- If still empty, verify that items have growing stage variants with `CLE No. of Days` configured.
- Check with your administrator that **Activate Growing Stages** is enabled in Growing Setup.

---

### Error: "Variant Transfer Journal Template and/or Variant Transfer Journal Batch not set up"

**Cause:** The journal configuration required to post reclassification entries is missing.

**Solution:** Contact your system administrator to configure the **Variant Transf. Jrnl. Template** and **Variant Transf. Jrnl. Batch** fields in Growing Setup.

---

### Items stuck at Full Bloom (Stage 3) and not advancing to Overgrown

**Cause:** The **Auto Transition to Overgrown** setting is turned off in Growing Setup. This is intentional — many operations prefer to keep items at Full Bloom until manually reviewed.

**Solution:** If you want to advance to Overgrown, use the worksheet's **Process Now** action on those lines. If you want automatic advancement, ask your administrator to enable **Auto Transition to Overgrown**.

---

### The job queue ran, but no transitions were processed

**Cause:** One of the following:

1. No entries had a `CLE Next Stage Change Date` on or before today.
2. All due entries were for Full Bloom → Overgrown, but **Auto Transition to Overgrown** is disabled.
3. The job queue encountered an error and stopped processing.

**Solution:**

- Open the **Grower Stage Worksheet** and click **Show Next 3 Days** to see if there are upcoming transitions.
- Check the **Job Queue Log Entries** page to see if the job completed successfully or encountered an error.
- Review the **Growing Setup** to confirm **Auto Transition to Overgrown** is enabled if you expect Full Bloom items to advance.

---

### Transitions are processing on the wrong date

**Cause:** The `CLE Next Stage Change Date` field on the Item Ledger Entry or Production Order Line is incorrect.

**Solution:**

1. Open the **Item Ledger Entries** page and filter on the item/variant in question.
2. Find the entry with the incorrect `CLE Next Stage Change Date`.
3. Edit the date directly (requires permissions) or contact your administrator to correct it.
4. For production orders, open the production order line and edit the `CLE Next Stage Change Date` field.

---

### A batch was advanced automatically, but it wasn't ready

**Cause:** The `CLE Next Stage Change Date` was set to today (or earlier), so the job queue processed it automatically. The batch should have been delayed using the Grower Stage Worksheet before the job queue ran.

**Solution:**

1. Post a manual **Item Reclassification Journal** to move the inventory back to the previous variant.
2. Manually set the `CLE Next Stage Change Date` field on the new Item Ledger Entry to the correct date.
3. Recommend to growers: Review the worksheet each day (especially Friday afternoons) and delay any batches that are not ready.

---

### Error: "No variant found for the next growing stage"

**Cause:** The item has a variant for the current stage (e.g., Stage 1), but no variant is configured for the next stage (e.g., Stage 2).

**Solution:**

1. Open the **Item Card** for the item.
2. Click **Variants** to open the Item Variants page.
3. Verify that variants exist for all stages in the sequence (Stage 1, Stage 2, Stage 3, Overgrown).
4. If a variant is missing, create it and set the `CLE Growing Stage` and `CLE No. of Days` fields.

---

### The worksheet shows entries due yesterday, but they weren't processed

**Cause:** One of the following:

1. The job queue is not running or is not scheduled correctly.
2. The job queue encountered an error and logged it to the Job Queue Log.
3. The entries were delayed manually, so the `CLE Next Stage Change Date` was pushed forward.

**Solution:**

- Check the **Job Queue Entries** page to confirm the Growing Stage job is active and has **Status** = Ready.
- Check the **Job Queue Log Entries** page to see if the job ran last night and whether it encountered errors.
- If the job is not running, contact your administrator to activate it or restart the job queue service.

---

### A production order line is not showing the correct growing stage

**Cause:** The production order line's `CLE Growing Stage` field is calculated from the variant code on the line. If the variant code is blank or incorrect, the growing stage will not be set.

**Solution:**

1. Open the production order line.
2. Verify the **Variant Code** field is filled in and matches a variant with a `CLE Growing Stage` value.
3. If the variant is blank, select the correct variant. The system will automatically populate the `CLE Growing Stage` field.

---

### The worksheet shows the same entry multiple times

**Cause:** The item has inventory in multiple bins or multiple Item Ledger Entries with the same `CLE Next Stage Change Date`.

**Solution:**

- This is expected behavior. Each bin or ledger entry is shown as a separate line because the reclassification journal must process each bin individually.
- When you click **Process Now**, all selected lines are processed together.

---

### I delayed an entry, but it's still showing on the worksheet

**Cause:** You entered a value in the `Delay Days` column but did not click the **Delay** action.

**Solution:**

- Make sure to click the **Delay** action after entering the number of days.
- The worksheet does not auto-save changes — you must explicitly click **Delay** to update the source record.

---

### Inventory was reclassified, but the bin is empty

**Cause:** The reclassification posted successfully, but the inventory was moved to a different bin or consumed by a sales order or production order before you checked.

**Solution:**

1. Search for **Item Ledger Entries** and filter on the new variant code.
2. Review the `Location Code` and `Bin Code` fields to see where the inventory was posted.
3. If the inventory is missing, check for sales shipments, production consumption, or transfers that may have consumed it after the reclass.

---

### Error: "Item X is blocked for posting"

**Cause:** The item is marked as **Blocked** on the Item Card, preventing any inventory transactions.

**Solution:**

1. Open the **Item Card** for the item.
2. Clear the **Blocked** toggle.
3. Run the job queue again or manually process the entry from the Grower Stage Worksheet.

---

## FAQ

**What is the difference between the worksheet and the automatic job queue?**

The job queue runs on a schedule (typically nightly) and processes all due transitions automatically. The worksheet lets you review what is due, process entries immediately, or delay entries that are not ready. Both use the same underlying logic.

---

**Can I advance a batch by more than one stage at a time?**

No. Each transition advances by exactly one stage. To move from Stage 1 (e.g., Green Bud) to Stage 3 (e.g., Full Bloom), the batch must first go through Stage 2 (e.g., Bud & Bloom).

---

**What does "Source Type: Production" mean?**

It means the entry comes from a Released Production Order Line. The plants are still in production and have not been posted to inventory yet. Advancing the stage updates the `CLE Growing Stage` field on the production order line.

---

**What does "Source Type: Item Ledger Entry" mean?**

It means the entry comes from inventory that has already been received or produced. Advancing the stage posts a reclassification journal to move the quantity from one variant to the next.

---

**How does the non-working day adjustment work?**

The system uses the Growing Stage Calendar to adjust planned dates. If a transition falls on a non-working day (e.g., Saturday), it appears on the worksheet on the last working day before that (e.g., Friday). This ensures growers see and process transitions before the weekend.

---

**Can I turn off the automation and only use the worksheet?**

Yes. Disable the **Job Queue Entry** for growing stage processing (set Status to "On Hold"), and all transitions will need to be processed manually using the **Process Now** action on the Grower Stage Worksheet. The system will still calculate the `CLE Next Stage Change Date` on receipts and production orders, but the automation will not run.

---

**How do I change the schedule for the automated job queue?**

Only administrators can change the job queue schedule. Search for **Job Queue Entries**, find the Growing Stage entry, and modify the **Starting Time** and **Run Frequency** fields. For example, to run twice per day (morning and evening), set **No. of Minutes between Runs** to 720 (12 hours).

---

**What happens if I delete a variant that is currently in use?**

Business Central will not allow you to delete a variant that has inventory or open transactions. If you need to retire a growing stage, first reclassify all inventory to a different variant, then delete the unused variant.

---

**How do I know if the job queue is running?**

Search for **Job Queue Log Entries** and find the entry for Growing Stage Processing. The **End Date/Time** field shows when it last completed. The **Status** field shows whether it succeeded or encountered an error. If the **End Date/Time** is more than 24 hours old (and the job is scheduled to run daily), the job queue service may not be running — contact your administrator.

---

**Why does the worksheet show entries due on Saturday when we're closed on weekends?**

The `CLE Next Stage Change Date` is always the exact calendar date when the transition should occur. The **job queue processes transitions on the exact date**, even on weekends. The worksheet **adjusts the display date backward** to the last working day (Friday) so growers can review and delay entries before the weekend. This ensures plants don't wait until Monday just because the greenhouse is closed on Saturday.

---

**Can I set different stage durations for summer vs. winter?**

Yes, but you must create separate variants for each season (e.g., GB-SUMMER and GB-WINTER). Most implementations use a single set of variants year-round and adjust the `No. of Days` field seasonally. Alternatively, manually delay entries during slower-growing periods.

---

**What happens if two batches of the same item/variant need to advance on the same day?**

The job queue processes each Item Ledger Entry independently. If you have two separate ledger entries (e.g., one receipt from March 1 and another from March 2, both due on March 10), both will be processed by the job queue on March 10. Each will appear as a separate line on the Grower Stage Worksheet.

---

**Do I need to approve transitions on the worksheet?**

No. The worksheet is for **review and override only**. If you take no action, the job queue will process due entries automatically. You only need to interact with the worksheet if you want to delay an entry (because it's not ready) or process an entry immediately (instead of waiting for the job queue).

---

**Can I undo a stage transition after it's been processed?**

Yes, but it requires manual intervention. Post an **Item Reclassification Journal** to move the inventory back to the previous variant. There is no "undo" button — you must explicitly post the reversal. Contact your administrator if you're not sure how to do this.

---

**What if a batch skips a stage in real life? (e.g., goes from Green Bud straight to Full Bloom)**

The system does not support skipping stages automatically. You must manually reclassify the inventory from the Stage 1 variant (e.g., Green Bud) directly to the Stage 3 variant (e.g., Full Bloom) using an **Item Reclassification Journal**. The `CLE Next Stage Change Date` will be recalculated based on the Stage 3 variant's `No. of Days`.

---

**Can I see a report of all stage changes that happened last month?**

Search for **Item Ledger Entries**, filter on `Document No.` = "Stage Reclass" and `Posting Date` = last month. Export the entries to Excel. Each pair of lines (one negative adjustment, one positive adjustment) represents a single stage transition.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/blooming-stages-user-guide.pdf)
