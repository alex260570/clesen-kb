---
title: Blooming Stages
type: howto
tags: [items, variants, blooming-stages, production, grower-operations]
created: 2026-04-21
updated: 2026-04-21
sources: [blooming-stage-user-guide.md]
---

# Blooming Stages

Tracking plant lifecycle stages and managing automatic advancement through the blooming timeline.

## What Are Blooming Stages?

**Blooming Stages** represent the maturity level of a plant throughout its lifecycle:

| Stage | Code | Description | Days to Next |
|-------|------|-------------|------|
| **Green Bud** | GB | Tightly closed, green sepals, no color visible | 5 |
| **Bud & Bloom** | BB | Petals opening, some color visible, beginning to bloom | 7 |
| **Full Bloom** | FB | Fully opened flowers at peak beauty and color | 14 |
| **Overgrown** | OG | Petals fading/wilting, past peak, declining quality | 999 |

**Key concept:** Plants automatically advance from one stage to the next based on a configured timeline. A Green Bud planted on Day 1 becomes Bud & Bloom on Day 6, Full Bloom on Day 13, and Overgrown on Day 27.

**Why track stages?**
- ✅ Know when product is **sale-ready** (Full Bloom)
- ✅ Prevent **selling too early** (Green Bud) or **too late** (Overgrown)
- ✅ Optimize **inventory turnover** (move product at peak)
- ✅ Support **grower planning** (know when to advance)

## How Automatic Advancement Works

### The Blooming Timeline

When a plant is first created or received in the system:

```
Day 1 (Created)          Day 6 (Auto-advance)      Day 13 (Auto-advance)     Day 27 (Auto-advance)
GB (Green Bud)      →    BB (Bud & Bloom)     →    FB (Full Bloom)      →    OG (Overgrown)
Next Stage: Day 6        Next Stage: Day 13        Next Stage: Day 27        Next Stage: Never
```

### Automatic Nightly Job

Every night at a scheduled time (e.g., 2:00 AM):

1. System runs job: **Process Pending Stage Changes** (Codeunit scheduled)
2. Job examines all items tracking stages
3. For each item, checks: **Is today's date >= Next Stage Change Date?**
4. **If YES:** Automatically advances to next stage
   - Updates variant code (GB → BB → FB → OG)
   - Updates the Next Stage Change Date (adds day count for new stage)
   - Creates audit trail record
5. **If NO:** Leaves in current stage, re-checks tomorrow

**Result:** No manual intervention needed—plants mature automatically.

### Configuring Stage Timelines

Stage timelines are defined in **Variant Templates** (see [[variant-templates]]).

**Example STANDARD template:**

| Stage | CLE No. of Days | Meaning |
|-------|---|---|
| GB | 5 | Spend 5 days as Green Bud |
| BB | 7 | Spend 7 days as Bud & Bloom |
| FB | 14 | Spend 14 days as Full Bloom |
| OG | 999 | Stay in Overgrown (never advance) |

**To change timeline:**
1. Edit the variant template
2. Modify "CLE No. of Days" for each stage
3. Resync template to items (may affect items already in progress)

## Grower Stage Worksheet

The **Grower Stage Worksheet** allows growers to manually override automatic advancement or check upcoming stages.

### Accessing the Worksheet

1. Use the search function (Alt+Q) and type **"Grower Stage Worksheet"**
2. Click to open the worksheet
3. Worksheet displays items currently advancing to next stage

### Worksheet Columns

| Column | Description | Example |
|--------|---|---|
| **Source Type** | Where item originated | Location, Purchase Order, etc. |
| **Item No.** | Item identifier | Rose-Red-12 |
| **Location** | Where item is stored | Greenhouse A |
| **Bin Code** | Physical bin/shelf | GB-1 |
| **Current Stage** | Current blooming stage | GB (Green Bud) |
| **Next Stage** | Stage it will advance to | BB (Bud & Bloom) |
| **Planned Date** | When auto-advance will occur | 2026-04-26 |
| **Quantity** | How many items | 500 |

### Manual Advancement Actions

#### Action 1: Process Now

Advance the item to next stage **immediately** (don't wait for scheduled date).

1. Select the worksheet line
2. Click **Process Now**
3. System immediately advances stage:
   - Updates variant (GB → BB)
   - Updates Next Stage Change Date
   - Triggers same logic as nightly job
4. Item moves to next stage on the spot

**Use when:** Plant is ready early, or need to stage manually

#### Action 2: Delay

Postpone advancement by pushing the Next Stage Change Date forward.

1. Select the line
2. Click **Delay**
3. Enter number of days to delay (e.g., 3)
4. System recalculates Next Stage Change Date
   - Current date: 2026-04-24
   - Planned date: 2026-04-26 (2 days away)
   - Add 3 days delay
   - New planned date: 2026-04-29

**Use when:** Plant needs more time to mature, or external delay (weather, equipment)

#### Action 3: Show Next 3 Days

Preview which items will automatically advance in the **next 3 calendar days**.

1. Click **Show Next 3 Days** button
2. Worksheet filters to show only items with Planned Date within next 3 days
3. Useful for **planning ahead** on what's advancing soon

**Use for:** Daily grower coordination, planning space/labor

#### Action 4: Refresh

Reload the worksheet with current data (clears filters, shows all pending items).

1. Click **Refresh**
2. Worksheet re-queries database
3. Useful after manually advancing items in other screens

## Scouting Reports and Stage Integration

**Scouting Reports** are grower observations about plant condition (pest damage, disease, growth issues).

### Recording Scouting Reports

When a grower creates a scouting report for an item:

1. System logs the report (date, issue, severity, location)
2. If report indicates item is ready:
   - Grower can select **Post Next Stage**
   - This triggers advancement to next stage
   - Same as "Process Now" in worksheet

**Use when:** Grower assesses plant and determines it's ready (bypasses timeline)

### Scouting + Timeline Coordination

**Timeline says:** Item advances in 3 days
**Grower observes:** Item is actually ready today

**Options:**
1. Use Grower Stage Worksheet → **Process Now** (advance immediately)
2. Create Scouting Report → Post Next Stage (same effect)
3. Or trust timeline and let nightly job handle it

Both paths produce same result — item advances when grower determines it's ready.

## Workflow Examples

### Example 1: Standard Blooming Timeline

**Scenario:** Rose arrives at warehouse, configured with STANDARD template (5-7-14-999)

**Timeline:**
- **Day 1 (April 21):** Item received as GB, Next Stage Change Date = April 26
- **Night of April 26:** Nightly job runs, advances to BB, Next Stage Change Date = May 3
- **Night of May 3:** Nightly job runs, advances to FB, Next Stage Change Date = May 17
- **Night of May 17:** Nightly job runs, advances to OG, Next Stage Change Date = infinity

**No manual action needed.** System handles all advancement automatically.

### Example 2: Grower Accelerates Growth

**Scenario:** Greenhouse is warm, plants growing faster than standard timeline

**Timeline says:** GB → BB on April 26
**Grower observes:** Ready to advance on April 24 (early)

**Action:**
1. Open Grower Stage Worksheet
2. Filter for Rose-Red items showing planned advance on April 26
3. Select the items
4. Click **Process Now**
5. Items immediately advance to BB stage

**Result:** Product ready for sale 2 days earlier, faster turnover

### Example 3: Delaying for External Reason

**Scenario:** Equipment failure delays staging operation for 3 days

**Timeline says:** Items advancing April 25-26
**Situation:** Can't physically stage until April 28

**Action:**
1. Open Grower Stage Worksheet
2. Select affected items
3. Click **Delay**
4. Enter 3 days
5. Planned dates shift forward 3 days

**Result:** Auto-advancement deferred until facility is ready

### Example 4: Preview Upcoming Workload

**Scenario:** Daily planning meeting, grower wants to know what's advancing soon

**Action:**
1. Open Grower Stage Worksheet
2. Click **Show Next 3 Days**
3. Worksheet shows only items advancing April 21-23
4. Plan labor/space for those items

**Result:** Growers prepared for incoming workload

## Best Practices

✅ **DO:**
- Configure blooming templates with realistic day counts (match actual plant growth)
- Test templates with pilot group before applying to entire operation
- Let automatic nightly job handle most advancement (minimal manual override)
- Use Grower Stage Worksheet for exceptions (early advance, delays)
- Check "Show Next 3 Days" daily for upcoming workload planning
- Create scouting reports to document why manual advancement occurred
- Review stage timelines quarterly based on seasonal variations
- Monitor items in Overgrown stage (consider sale, donation, or disposal)
- Coordinate blooming timeline with sales planning (when is product sale-ready?)

❌ **DON'T:**
- Leave items in Overgrown stage indefinitely (quality declines)
- Create unrealistic timelines (too fast or too slow growth expectations)
- Manually advance items without documented reason (audit trail)
- Use both variant reclassification AND automatic advancement simultaneously (confusing)
- Delay items excessively (defeats purpose of knowing sale-ready date)
- Ignore scouting reports suggesting early advancement (misses opportunity)
- Process Next Stage without verifying plant is actually ready (quality issue)

## Common Issues

### Issue: Items Not Advancing on Schedule

**Cause:** Nightly job not running, or item's Next Stage Change Date not set

**Solution:**
1. Check if scheduled job is enabled in **Job Queue**
2. Verify item has variant template applied (determines timelines)
3. Check Next Stage Change Date on item (may need manual correction)
4. Run nightly job manually if testing

### Issue: Item Stuck in Overgrown Stage

**Cause:** Overgrown is intended as final stage (no further advancement)

**Solution:**
1. If item should stay in Overgrown, leave as-is
2. Dispose or sale Overgrown items per business process
3. If item stuck incorrectly, manual adjustment via Item Variant Reclass or journal

### Issue: Scouting Report Not Advancing Item

**Cause:** "Post Next Stage" action may not be available, or item already in final stage

**Solution:**
1. Use Grower Stage Worksheet → **Process Now** as alternative
2. Verify item is not in final stage (Overgrown)
3. Check permissions for scouting report operations

### Issue: Delays Pushing Item Too Far Into Future

**Cause:** Multiple delays accumulated, pushing Planned Date too late

**Solution:**
1. Clear delays and start fresh with **Process Now** when ready
2. Or adjust Next Stage Change Date manually via Item Card
3. Document reason for manual adjustment

## Related Pages

- [[variant-templates]] — Variant template creation and configuration
- [[variant-reclassification]] — Manual movement between blooming stage variants
- [[item-attributes]] — Bulk attribute assignment
