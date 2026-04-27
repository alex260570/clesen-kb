---
title: Growing Stages
type: howto
tags: [items, growing-stages, production, inventory, stage-profiles, lifecycle]
created: 2026-04-27
updated: 2026-04-27
sources: [growing-stage-user-guide.md]
---

# Growing Stages

Plant lifecycle tracking system for non-blooming items through up to four customizable growth stages with automatic progression and grower worksheets.

---

## What This Is

The **Growing Stages** system tracks where plants are in their growth cycle using customizable stage names. Key features:

1. **Multiple stage variants** — Each growth stage is a separate item variant
2. **Customizable names** — Different crops use different terminology (Blooming uses "Green Bud → Full Bloom"; vegetables might use "Seedling → Mature")
3. **Automatic progression** — System automatically advances inventory to next stage on schedule
4. **Grower worksheet** — Review, delay, or immediately process upcoming transitions
5. **Stage profiles** — Define stage names per crop type

**Growing stages:**

| Stage | Duration | Purpose |
|-------|----------|---------|
| **Stage 1** | Days defined in profile | Early development, preparation |
| **Stage 2** | Days defined in profile | Mid-development, active growth |
| **Stage 3** | Days defined in profile | Mature, ready for use or sale |
| **Overgrown** | Open-ended | Past peak, declining quality |

*Display names are customizable per Stage Profile. Blooming plants use "Green Bud", "Bud & Bloom", "Full Bloom", "Overgrown" by default.*

---

## When to Use It

Use the **Grower Stage Worksheet** when you need to:

- **Review upcoming transitions** — See which batches are due for stage advancement today
- **Advance early** — Move a batch to next stage ahead of schedule
- **Delay transitions** — Hold plants in current stage because they're not ready
- **Check upcoming changes** — See what transitions are scheduled for next few days

> **Note:** Most stage transitions happen automatically via nightly job queue. The worksheet is for reviewing, overriding, and handling exceptions.

---

## Prerequisites

- **Growing Stages** toggle must be enabled in Growing Setup
- **Items must have stage variants** — Each variant has a `CLE Growing Stage` value (Stage 1, 2, 3, or Overgrown)
- **Stage Profile assigned** — Tells system the friendly display names for each stage (e.g., "Green Bud" for Stage 1)
- **Variant Transfer Journal** — Must be set up in Growing Setup
- **Growing Stage Calendar** — Defines working days for stage scheduling

---

## How to Use the Grower Stage Worksheet

### Step 1: Open the worksheet

1. Search for **Grower Stage Worksheet** in Business Central search bar
2. Worksheet loads automatically showing entries due for transition today
3. Displays:
   - Item description and variant name
   - Current stage
   - Quantity in this stage
   - When stage is due to advance
   - Next stage name

### Step 2: Review pending transitions

The worksheet shows two categories:

**Due Today (or Overdue)**
- Batches scheduled to advance today or earlier
- Recommended: Process these to stay on schedule

**Coming Up (Next Few Days)**
- Batches scheduled to advance in near future
- Review for any that should advance early or be delayed

### Step 3: Process transitions

For each batch you want to advance:

1. **Click the batch line** to select it
2. **Click "Process"** to advance to next stage
3. System creates variant transfer journal entry
4. Inventory updates immediately from current stage to next stage
5. Batch moved to completed section

### Step 4: Delay transitions

If a batch isn't ready to advance:

1. **Click the batch line** to select it
2. **Click "Delay"** to postpone advancement
3. Enter new advancement date
4. System recalculates schedule
5. Batch removed from "due today" section

### Step 5: Advance immediately (ahead of schedule)

If a batch is ready early:

1. **Click the batch line** to select it
2. **Click "Process Now"** or similar button
3. System advances immediately (doesn't wait for scheduled date)
4. Inventory updates to next stage

---

## Automatic Stage Progression

### How automatic progression works

The system automatically advances inventory based on:

1. **Growing Stage Calendar** — Defines working days (excludes weekends/holidays)
2. **Days in Stage** — How many days each batch stays in current stage
3. **Production date or receipt date** — When batch entered inventory
4. **Next Stage Change Date** — Auto-calculated date for next transition

**Example:** Batch enters greenhouse on Monday as Stage 1 "Green Bud". If stage duration is 14 days:
- Next Stage Change Date = Monday + 14 working days = 3 weeks later
- On that date, system queues transition to Stage 2 "Bud & Bloom"

### Automatic job queue processing

A nightly job (or scheduled batch) processes all due transitions:

1. System identifies all batches due for transition today
2. Creates variant transfer journal entries
3. Transfers inventory from current stage to next stage
4. Updates item ledger entries
5. Clears the "Next Stage Change Date"

> **Note:** Grower worksheet is used to review, override, or handle exceptions to this automatic process.

---

## Stage Profiles for Non-Blooming Items

### What are stage profiles?

Stage profiles define the **display names** for each growth stage. Different crops use different terminology:

| Crop Type | Stage 1 | Stage 2 | Stage 3 | Overgrown |
|-----------|---------|---------|---------|-----------|
| **Blooming** (default) | Green Bud | Bud & Bloom | Full Bloom | Overgrown |
| **Vegetables** | Seedling | Vegetative | Mature | Over-mature |
| **Herbs** | Small | Medium | Large | Woody |
| **Foliage** | Starter | Growing | Finished | Declining |

### Creating a stage profile

1. Navigate to **Items** > **Growing Setup** or **Setup** > **Growing Stages** > **Stage Profiles**
2. Click **New** to create a profile
3. Enter:
   - `Code`: Short identifier (e.g., "BLOOMING", "HERB", "VEG")
   - `Description`: Full name ("Blooming Plants", "Herbs", "Vegetables")
4. In the **Lines** section, enter stage names:
   - `Growing Stage`: Select Stage 1, Stage 2, Stage 3, Overgrown
   - `Display Name`: Enter friendly name (e.g., "Green Bud", "Seedling")
5. Click **Save**

### Assigning profile to items

1. Open an **Item Card** (item to set up)
2. Find field: `CLE Stage Profile Code`
3. Select the profile (e.g., "BLOOMING")
4. Save the item
5. All stage variants for this item now use the profile's display names

---

## Field Reference

### Item setup fields

- `CLE Stage Profile Code` — Links item to its Stage Profile for display names

### Item Variant fields

- `CLE Growing Stage` — Maps variant to a stage (Stage 1, 2, 3, or Overgrown)
- `CLE No. of Days` — How many calendar days this stage lasts

### Production and Inventory tracking

- `CLE Next Stage Change Date` — When this batch should advance to next stage
- Auto-calculated from production/receipt date + stage duration

### Worksheet display

The Grower Stage Worksheet shows:
- Item number and description
- Current stage (with friendly name from profile)
- Quantity in this stage
- Due date for next transition
- Action buttons (Process, Delay, etc.)

---

## Troubleshooting

### "Growing Stages not active" error

**Problem:** Growing Stages toggle is disabled.

**Solutions:**
1. Contact your system administrator
2. They must enable the toggle in Growing Setup
3. Once enabled, feature becomes available

### Worksheet shows no entries

**Problem:** No transitions scheduled for today.

**Solutions:**
1. This is normal if all batches are on schedule
2. Click **"Show All"** to see upcoming transitions
3. Check tomorrow's schedule
4. Review Stage Profile to ensure durations are set correctly

### Item variants not showing stage names

**Problem:** Display names show internal codes instead of friendly names.

**Solutions:**
1. Check if Stage Profile is assigned to item
2. Verify Stage Profile contains display names for all stages
3. Refresh the page
4. Contact IT if problem persists

### Automatic transitions not happening

**Problem:** Batches aren't advancing on schedule.

**Solutions:**
1. Check Growing Stage Calendar (working days configured correctly?)
2. Check Growing Setup (job queue enabled?)
3. Check batch's CLE Next Stage Change Date (is it correct?)
4. Use worksheet to manually process transitions temporarily
5. Contact IT to investigate job queue

---

## FAQ

**Q: What's the difference between Growing Stages and Blooming Stages?**
A: Both track plant lifecycle. Blooming Stages specifically for flowering plants; Growing Stages are customizable for any crop type with any stage names.

**Q: Can I have items with both Growing Stages and Blooming Stages?**
A: Depends on your system configuration. Typically, you use one system or the other for your items.

**Q: How are customers' stage preferences handled?**
A: When placing sales orders, customers can specify preferred stage (e.g., "Full Bloom only"). System automatically fulfills with matching stage variant.

**Q: What happens if I don't process a transition?**
A: Inventory stays in current stage. Use worksheet "Delay" to formally postpone, or "Process" when ready.

**Q: Can I manually edit the CLE Next Stage Change Date?**
A: Generally not recommended. Let system manage dates. Use worksheet to override through Process/Delay actions.

**Q: How do I know which stage customers prefer?**
A: Check your sales orders or use Scouting Reports to see demand by stage.

---

## Related Pages

- [[blooming-stages]] — Plant lifecycle system for flowering plants (alternative)
- [[blooming-stage-worksheet]] — Worksheet for blooming stage transitions
- [[stage-profiles]] — Creating and managing stage display names
- [[scouting-reports]] — Inventory visibility and stage demand
- [[customer-preferred-stages]] — Setting customer stage preferences
