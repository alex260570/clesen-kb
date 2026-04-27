---
title: Growing Stages - IT Troubleshooting
type: howto
tags: [it, growing-stages, troubleshooting, system-architecture, technical]
created: 2026-04-27
updated: 2026-04-27
sources: [growing-stage-it-troubleshooting-guide.md]
---

# Growing Stages - IT Troubleshooting

Technical architecture and troubleshooting guide for the Growing Stages system for non-blooming plant lifecycle management.

---

## System Architecture

### Core Components

| Object | ID | Type | Purpose |
|--------|----|----|---------|
| **CLE Growing Stage** | 60701 | Enum | Stage values: blank, Stage 1, Stage 2, Stage 3, Overgrown |
| **CLE Stage Substitution Option** | 60702 | Enum | Fallback behavior: blank, Previous, Next, No Preference |
| **CLE Growing Setup** | 50078 | Table | Configuration: calendar, journal, receipt days, auto-overgrown |
| **CLE Grower Stage Worksheet** | 50080 | Table | Temporary worksheet (populated at runtime from ILEs) |
| **CLE Stage Profile** | 50088 | Table | Stage profile header: Code, Description |
| **CLE Stage Profile Line** | 50089 | Table | Maps Growing Stage enum to custom display names per profile |
| **CLE Growing Stage Management** | 50129 | Codeunit | Core logic: date calculation, stage helpers, worksheet population, posting |
| **CLE Growing Stage Subscribers** | 50130 | Codeunit | Event wiring into production, purchasing, sales workflows |
| **CLE Shortage Resolution** | 50132 | Codeunit | Intelligent inventory shortage resolution with stage substitution |
| **CLE Growing Setup Page** | 50225 | Page | Card page for Growing Setup table |
| **CLE Grower Stage Worksheet Page** | 50226 | Page | Worksheet showing pending transitions with Process/Delay actions |
| **CLE Shortage Sales Lines Page** | 50337 | Page | Sales line list with Resolve Shortage action |

---

## Feature Configuration

### Master Toggle

**Growing Setup (Table 50078) Field 7:** `"Activate Growing Stages"` (Boolean)

- **When checked:** Growing stage logic active across all workflows
- **When unchecked:** All growing stage logic bypassed
- Every entry point in Codeunits 50129 and 50130 checks this before proceeding
- To disable: Navigate to **Setup** > **Growing Setup** and uncheck toggle

### Growing Stage Calendar

Defines working days for stage scheduling:

1. Navigate to **Setup** > **Growing Setup** > **Growing Stage Calendar**
2. Configure:
   - **Working Days**: Mon-Fri (typical) or custom days
   - **Exclude Holidays**: List dates/ranges to skip
3. System uses this calendar for:
   - Calculating "Days in Stage" duration
   - Determining "Next Stage Change Date"
   - Scheduling automatic transitions

---

## Stage Profile System

### How Display Names Work

**Stage Profiles** allow custom terminology per crop type:

- **Stage Profile (50088)**: Header record with Code and Description
- **Stage Profile Line (50089)**: Maps each Growing Stage enum to a display name

Example BLOOMING profile:
```
Stage 1 → "Green Bud"
Stage 2 → "Bud & Bloom"
Stage 3 → "Full Bloom"
Overgrown → "Overgrown"
```

Example HERB profile:
```
Stage 1 → "Small"
Stage 2 → "Medium"
Stage 3 → "Large"
Overgrown → "Woody"
```

### Display Name Resolution

Function: `CU 50129.GetStageDisplayName(ItemNo, Stage)` returns:
1. Check if item has Stage Profile Code assigned
2. If yes, look up display name in Stage Profile Lines
3. If no, fall back to enum caption ("Stage 1", etc.)
4. Return result to UI

### Item Card Field

- **Field:** `"CLE Stage Profile Code"` (Code[20])
- **Location:** Item Card > Growing Stages section
- **Links item to profile** for friendly display names

---

## Field Extensions

### Item Fields

- `CLE Stage Profile Code` (Code[20]) — Links to Stage Profile

### Item Variant Fields

- `CLE Growing Stage` (Enum 60701) — Stage 1, 2, 3, or Overgrown
- `CLE No. of Days` (Integer) — Calendar days this variant stays in current stage

### Customer Fields

- `CLE Preferred Growing Stage` (Enum 60701) — Customer's preferred stage for fulfillment
- `CLE Stage Substitution` (Enum 60702) — Fallback behavior if preferred stage unavailable

### Sales Header Fields

- `CLE Preferred Growing Stage` (Enum 60701) — Copied from customer on insert
- `CLE Stage Substitution` (Enum 60702) — Copied from customer on insert

### Sales Line Fields

- `CLE Growing Stage` (Enum 60701) — Set when variant is applied

### Production Order Line Fields

- `CLE Growing Stage` (Enum 60701) — Tracks stage without changing variant
- `CLE Next Stage Change Date` (Date) — Calculated from due date

### Item Ledger Entry Fields

- `CLE Next Stage Change Date` (Date) — Stamped on production output and purchase receipt entries

---

## Stage Transition Algorithm

### Architecture: Worksheet vs Schedule Table

**Previous Design:** Persistent table (50079) with Pending/Processed status tracking
**Current Design:** Temporary worksheet (50080) populated on-demand from Item Ledger Entries

### Transition Logic

1. **Identify eligible entries** — Filter Item Ledger Entries where:
   - `CLE Next Stage Change Date <= Today`
   - Remaining quantity > 0
   - Stage < Overgrown

2. **Load into worksheet** — For each eligible entry:
   - Create worksheet line (temporary)
   - Display item, current stage, quantity, due date
   - Show next stage (from variant lookup)

3. **Process/Delay actions** — User can:
   - **Process**: Transfer quantity to next stage variant, post journal
   - **Delay**: Recalculate next stage change date, repopulate worksheet
   - **Preview**: Show what transfer will look like before posting

4. **Automatic overnight processing** — Job queue runs nightly:
   - Processes all overdue worksheets automatically
   - Creates variant transfer journal entries
   - Posts transfers to inventory ledger

---

## Troubleshooting

### Issue: Growing Stages toggle is hidden or grayed out

**Diagnosis:**
- Check user permissions (might need admin)
- Check if Growing Setup table exists (verify via SQL if needed)

**Solution:**
1. Verify user has admin or system designer role
2. Navigate to **Growing Setup** directly (not through menu)
3. If toggle still missing, verify Table 50078 is installed (check Extensions > Growing Stages)

### Issue: Worksheet shows no entries

**Diagnosis:**
- Check Growing Stage Calendar (might not be configured)
- Check item variants (might not have stages assigned)
- Check CLE Next Stage Change Date on Item Ledger Entries (past dates?)

**Solutions:**
1. Verify Growing Stage Calendar has working days configured
2. Verify items have CLE Growing Stage set on variants
3. Verify items have Stage Profile Code assigned
4. Check Item Ledger Entries for proper CLE Next Stage Change Date values
5. Click "Show All" in worksheet to see upcoming (not just due today)

### Issue: Automatic transitions not processing

**Diagnosis:**
- Job queue not running
- Growing Setup toggle is unchecked
- Job queue entries not configured

**Solutions:**
1. Check Growing Setup > "Activate Growing Stages" is checked
2. Navigate to **Job Queue Entries**
3. Verify "Growing Stage Automatic Transitions" job exists and is active
4. Check job's next run time
5. If missing, contact admin to set up job queue entry
6. Run job manually: **Job Queue Entries** > select entry > **Run Now**

### Issue: Display names showing as "Stage 1" instead of profile names

**Diagnosis:**
- Stage Profile not assigned to item
- Stage Profile Lines not configured
- Display name resolution not being called

**Solutions:**
1. Open **Item Card** and verify `CLE Stage Profile Code` is filled
2. Open the Stage Profile and verify Stage Profile Lines exist
3. Refresh the Grower Stage Worksheet page (F5)
4. Check browser cache (Ctrl+Shift+Del)
5. If still broken, verify Codeunit 50129 function `GetStageDisplayName` is deployed

### Issue: Item Ledger Entries missing CLE Next Stage Change Date

**Diagnosis:**
- Entries created before stage system was enabled
- Production output not triggering event
- Purchase receipt not stamping date

**Solutions:**
1. Manual fix: Run **Variant Transfer Journal** to create entries with proper dates
2. Check event subscribers are wired (verify Codeunit 50130)
3. Verify Growing Setup calendar is configured
4. Reload/restart Business Central service
5. Check event log for errors during entry creation

### Issue: Shortage resolution not substituting stages

**Diagnosis:**
- Shortage Resolution feature not enabled in sales line
- Customer stage substitution preference not set
- Inventory not available in other stages

**Solutions:**
1. Verify customer has `CLE Stage Substitution` set to "Previous" or "Next" (not blank)
2. On Sales Line, click **Actions** > **Resolve Shortage** (or similar button)
3. System shows available alternatives in other stages
4. Select desired stage alternative
5. If no alternatives shown, check other stage variants exist with inventory

---

## Configuration Checklist

Before using Growing Stages in production:

- [ ] Growing Stages extension installed
- [ ] Growing Setup table created (Table 50078)
- [ ] Master toggle enabled: **Setup** > **Growing Setup** > "Activate Growing Stages"
- [ ] Growing Stage Calendar configured with working days
- [ ] Stage Profiles created (at least "BLOOMING" or your default)
- [ ] Stage Profile Lines populated for each stage
- [ ] Items configured:
  - [ ] Item variants created for each stage (Stage 1, 2, 3, Overgrown)
  - [ ] Variants have `CLE Growing Stage` enum values set
  - [ ] Variants have `CLE No. of Days` duration set
  - [ ] Item Card has `CLE Stage Profile Code` assigned
- [ ] Variant Transfer Journal Template and Batch set up in Growing Setup
- [ ] Job Queue Entry created for automatic transitions (nightly)
- [ ] User permissions: Allow access to Grower Stage Worksheet page (50226)
- [ ] Testing: Run worksheet, process one transition, verify inventory updates

---

## Related Pages

- [[growing-stages]] — User guide for Grower Stage Worksheet
- [[blooming-stages-it-troubleshooting]] — IT architecture for blooming stages (similar system)
- [[item-attributes]] — Item configuration and setup
- [[variant-templates]] — Creating and managing item variants
