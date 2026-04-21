---
title: Growing Stages — IT Troubleshooting
type: howto
tags: [items, growing-stages, blooming-stages, it-support, system-architecture]
created: 2026-04-21
updated: 2026-04-21
sources: [growing-stage-it-troubleshooting-guide.md]
---

# Growing Stages — IT Troubleshooting

Technical architecture and troubleshooting for the growing stage system with custom stage profiles.

## System Architecture

### Core Components

| Object | ID | Type | Purpose |
|--------|-----|------|---------|
| CLE Growing Stage | 60701 | Enum | Stages: Stage 1, Stage 2, Stage 3, Overgrown (extensible) |
| CLE Stage Substitution Option | 60702 | Enum | Fallback: Previous, Next, No Preference |
| CLE Growing Setup | 50078 | Table | Config: calendar, journal, receipt days, auto-overgrown |
| CLE Grower Stage Wrksheet | 50080 | Table | **Temporary** worksheet populated at runtime |
| CLE Stage Profile | 50088 | Table | Header: Code, Description for custom stage names |
| CLE Stage Profile Line | 50089 | Table | Maps stage enum to custom display names |
| CLE Growing Stage Management | 50129 | Codeunit | Core logic: date calc, worksheet population, posting |
| CLE Growing Stage Subscribers | 50130 | Codeunit | Event wiring to production, purchase, sales |
| CLE Shortage Resolution | 50132 | Codeunit | Intelligent shortage resolution with substitution |
| CLE Growing Setup | 50225 | Page | Card page for configuration |
| CLE Grower Stage Worksheet | 50226 | Page | Worksheet with Process/Delay actions |
| CLE Shortage Sales Lines | 50337 | Page | Sales lines with "Resolve Shortage" action |
| CLE Stage Profiles | 50343 | Page | List of stage profiles |
| CLE Stage Profile Card | 50345 | Page | Card for individual profile |

### Feature Toggle

**Master Toggle:** Growing Setup (Table 50078) field "Activate Growing Stages" (Boolean)

All entry points in CU 50129 and 50130 call `IsGrowingStagesActive()` before proceeding.

### Stage Profile System

**Stage Profiles** allow custom display names for growing stages per crop type.

| Table | Purpose |
|-------|---------|
| **CLE Stage Profile (50088)** | Header: Code and Description |
| **CLE Stage Profile Line (50089)** | Maps each Growing Stage enum to custom display name |

**Item Connection:** Item Card field "CLE Stage Profile Code" links items to their profile

**Display Resolution:** `CU 50129.GetStageDisplayName(ItemNo, Stage)` returns custom name or falls back to enum caption

**Example:** Different crops use different terminology (e.g., "Green Bud" for flowers, "Seedling" for vegetables) while using same Stage 1/2/3 enum internally.

### Field Extensions

**Item:**
- `CLE Stage Profile Code` (Code[20]) — Links to Stage Profile for custom display names

**Item Variant:**
- `CLE Growing Stage` (Enum 60701) — Maps variant to a stage
- `CLE No. of Days` (Integer) — Days before auto-advancing

**Customer:**
- `CLE Preferred Growing Stage` (Enum 60701)
- `CLE Stage Substitution` (Enum 60702)

**Sales Header & Line:**
- `CLE Preferred Growing Stage` (header; copied from customer)
- `CLE Stage Substitution` (header; copied from customer)
- `CLE Growing Stage` (line; set from variant)

**Production Order Line:**
- `CLE Growing Stage` (Enum) — Tracks stage without changing variant
- `CLE Next Stage Change Date` (Date) — Calculated from due date backward

**Item Ledger Entry:**
- `CLE Next Stage Change Date` (Date) — Stamped on production output and purchase receipt

## Architectural Difference from Blooming Stages

| Aspect | Blooming Stages (50079) | Growing Stages (50080) |
|--------|-------|--------|
| **Schedule Storage** | Persistent table (Schedule entries) | Temporary worksheet (populated on-demand) |
| **Status Tracking** | Pending/Processed/Delayed/Cancelled | None (read-only; updated via source records) |
| **Entry Creation** | Events create entries | Worksheet populated from ILEs and Prod Order Lines |
| **Processing** | Job queue reads schedule table | Job queue populates worksheet, processes in-memory |
| **Source Updates** | Updates worksheet entry status | Updates Item Ledger Entry / Prod Order Line directly |
| **Custom Names** | Enum values only | Stage Profiles for custom display names |
| **Shortage Resolution** | Not integrated | Integrated via CU 50132 |

**Key difference:** Growing Stages use a **temporary worksheet** that recalculates on every open, eliminating persistent state management while allowing custom stage display names.

## Stage Transition Algorithm

### Architectural Change: Worksheet vs Schedule Table

**Previous:** Persistent schedule table with Pending/Processed tracking (like Blooming Stages)

**Current:** Temporary worksheet populated from:
- **Item Ledger Entries** — Filters by Next Stage Change Date <= Today
- **Production Order Lines** — Filters Released prod order lines by date

**Benefits:**
- No persistent status tracking complexity
- Worksheet always current (re-queries on open)
- Supports custom stage names via profiles

### Stage Date Stamping

Dates stamped on source records by event subscribers in CU 50130:

#### Production Output

**Trigger:** `OnBeforeInsertItemLedgEntry` on `Item Jnl.-Post Line` (Entry Type = Output)

**Logic:**
1. Check feature toggle
2. Check item has growing stage variants
3. Calculate Next Stage Change Date from posting date + variant's No. of Days
4. Stamp on Item Ledger Entry before insert

#### Production Order Line

**Trigger:** `OnAfterRefreshProdOrderLine` on production order line creation/refresh

**Logic:**
1. Check feature toggle
2. Get Production Default variant to determine initial stage
3. Calculate stage change date **backward from Due Date**
4. Set CLE Growing Stage and CLE Next Stage Change Date

#### Purchase Receipt

**Trigger:** `OnAfterPurchRcptLineInsert` on `Purch.-Post`

**Logic:**
1. Check feature toggle and item has variants
2. Calculate Next Stage Change Date from receipt date + Purchase Receipt Stage Days
3. Update all related Item Ledger Entries with calculated date

### Worksheet Population (CU 50129)

Temporary worksheet populated from:

```
Entry No. (auto-assigned)
Source Type = ILE|Production
Source Entry No. = ILE Entry No. or 0 for prod order lines
Prod. Order No., Prod. Order Line No.
Item No., Location Code, Item Description
Current Variant Code, Current Growing Stage
Next Variant Code, Next Growing Stage
Planned Date = Next Stage Change Date from source
Original Planned Date = Planned Date
Quantity = Remaining Qty from ILE or prod line
Delay Days (user editable)
Bin Code (from warehouse entries)
Current Stage Display Name, Next Stage Display Name (from Profile)
```

**NOT created if:**
- Variant not found
- Growing Stage blank
- Next stage equals current (Overgrown → Overgrown)
- No Next Variant Code for next stage

### Job Queue Processing (CU 50129.ProcessPendingStageChanges)

**Workflow:**

1. Populate temporary worksheet from ILEs and Prod Order Lines (Next Stage Change Date <= Today)
2. Apply Auto Transition to Overgrown filter (skip if disabled)
3. For each worksheet entry with Planned Date + Delay Days <= Today:
   - Verify Next Variant Code exists
   - Call `PostStageReclassification()` to post journal
   - Update source ILE Next Stage Change Date for next transition
   - For prod order lines: update Growing Stage, recalculate Next Stage Change Date

### Stage Transition Chain

Chain maintained through automatic date recalculation:

**For Inventory (ILEs):**
- After reclassification, updates ILE's Next Stage Change Date = Today + new variant's No. of Days
- Next time worksheet loads, updated ILE appears if date <= Today
- Chain continues until stage = Overgrown or No. of Days = 0

**For Production Order Lines:**
- Updates Growing Stage on line
- Recalculates Next Stage Change Date from current date + variant's No. of Days
- Line appears in worksheet again when date reached
- Actual reclassification occurs at Output posting using line's Growing Stage

## Reclassification Posting Pattern

### CU 50129.PostStageReclassification

Uses item journal with paired negative/positive adjustment:

```
Line 1: Negative Adjmt.
  Item = schedule item
  Location = schedule location
  Variant = Current Variant Code
  Qty = schedule entry quantity
  Doc No. = 'Stage Reclass'

Line 2: Positive Adjmt.
  Item = schedule item
  Location = schedule location
  Variant = Next Variant Code
  Qty = schedule entry quantity
  Doc No. = 'Stage Reclass'
```

**Journal Configuration:**
- Template and Batch from Growing Setup
- Batch cleared before posting
- Posts via Item Jnl.-Post codeunit

**Error if:** Template or Batch not configured.

## Event Subscriptions (CU 50130)

| # | Event | Source | Procedure | Purpose |
|---|----------|--------|-----------|---------|
| 1 | OnBeforeInsertItemLedgEntry | Item Jnl.-Post Line | SetNextStageDateOnOutput | Stamp Next Stage Change Date |
| 2 | OnBeforePostPurchaseDoc | Purch.-Post | BlockReceiptWithoutVariant | Block receipt if no variant |
| 3 | OnAfterPurchRcptLineInsert | Purch.-Post | StampNextStageDateOnReceipt | Calculate and stamp date |
| 4 | OnAfterInsertEvent | Sales Header | CopyCustomerPreferencesOnInsert | Copy preferences from customer |
| 5 | OnAfterValidateEvent (No.) | Sales Line | ApplyPreferredStageOnNoValidate | Auto-apply preferred variant |
| 6 | OnAfterRefreshProdOrderLine | Prod. Order Mgmt | CalculateStageOnProdOrderLine | Calculate initial stage/date |

## Intelligent Shortage Resolution

### Overview

When inventory shortages occur, system proposes alternative stages based on customer preference.

### Components

- **Page 50337 (CLE Shortage Sales Lines):** Shows short sales lines with "Resolve Shortage" action
- **Codeunit 50132 (CLE Shortage Resolution):** Implements intelligent substitution

### Resolution Algorithm (CU 50132.GetAvailableSubstituteVariant)

```
1. Get customer's Preferred Growing Stage and Stage Substitution from sales header
2. Step 1: Try preferred direction first
   - If Previous: try previous stage variant
   - If Next: try next stage variant
   - Check real-time inventory across all locations
   - Account for other pending picks on same shipment date
3. Step 2: Try opposite direction
   - If preferred unavailable, try opposite
4. Step 3: Try all remaining stages
   - Loop through Stage 1, 2, 3 (skip already tried)
5. Return substitute variant code and preferred-match flag
```

### User Experience

- **Preferred direction available:** Confirms, shows "matches customer preference"
- **Non-preferred direction available:** Warns before substituting
- **No substitute available:** Offers to zero quantity with reason code

## Date Calculation Algorithm

### CU 50129.CalculateNextStageDate(StartDate, NoOfDays)

```
1. TargetDate = StartDate + NoOfDays
2. Call AdjustForNonWorkingDay(TargetDate)
```

### CU 50129.AdjustForNonWorkingDay(TargetDate)

```
1. Get Growing Setup
2. If no calendar: return TargetDate
3. Set CustomCalendarChange filter: Company level
4. While TargetDate is non-working day:
     TargetDate = TargetDate - 1
5. Return TargetDate
```

**Key behavior:** Dates move **backward** to nearest working day, never forward.

## Job Queue Configuration

**Object Type:** Codeunit **50129**
**Procedure:** `ProcessPendingStageChanges`

**Recommended schedule:** Every 2-4 hours business hours, or daily

**Prerequisites:**
- Feature toggle enabled
- Growing Setup has journal config
- Item variants configured with stages and days
- Base calendar (optional) if using non-working day logic

## Troubleshooting

### Job Queue Not Processing

**Symptoms:** Worksheet entries don't advance on time

**Check:**
1. Job Queue status must be "Ready" or "In Process"
2. Verify last run time recent
3. Check Job Queue Log Entries
4. Verify Growing Setup > "Activate Growing Stages" = Yes

**Common causes:**
- Job queue stopped
- Feature disabled
- Missing journal config
- Leftover journal lines

**Fix:**
1. Open item journal (template/batch from Growing Setup)
2. Delete all lines
3. Restart job queue

### Worksheet Entries Not Appearing

**Symptoms:** Expected stage transitions don't show in Grower Stage Worksheet

**Check:**
1. Item Ledger Entries have "CLE Next Stage Change Date" populated
2. Date <= Today (or within planned range)
3. For prod orders: verify "CLE Next Stage Change Date" set
4. Item variants have "CLE Growing Stage" and "CLE No. of Days"
5. Next Variant Code exists for next stage

### Wrong Variant on Sales Lines

**Symptoms:** Sales lines show unexpected variant

**Check:**
1. Customer card: verify "CLE Preferred Growing Stage" and "CLE Stage Substitution"
2. Sales header: confirm preferences copied
3. Item variants: verify variant exists for preferred stage
4. Substitution logic applied correctly
5. Stage Profile configured if using custom names

**Resolution:**
1. Fix customer preferences
2. Create missing variants
3. Verify Stage Profile assigned to item
4. Manually correct affected lines

### Purchase Receipt Blocked

**Error:** "Item [No.] has growing stage variants. You must select a variant."

**Cause:** CU 50130 subscriber `BlockReceiptWithoutVariant` fires on `OnBeforePostPurchaseDoc`

**Resolution:**
1. Open purchase order
2. Select Variant Code for each growing item line
3. Retry posting

### Stage Dates Not Being Stamped

**Symptoms:** Item Ledger Entries or Prod Order Lines have blank "CLE Next Stage Change Date"

**Check:**
1. **Feature toggle:** Verify "Activate Growing Stages" enabled
2. **Item variants:** Verify variants with "CLE Growing Stage" and "CLE No. of Days"
3. **Production Default:** Verify item has variant marked Production Default with stage
4. **Purchase config:** Verify "Purch. Receipt Stage Days" not zero in Growing Setup

### Wrong Stage Display Names

**Symptoms:** Worksheet shows "Stage 1" instead of "Green Bud"

**Check:**
1. **Stage Profile assigned:** Verify item has "CLE Stage Profile Code" set
2. **Profile lines exist:** Open Stage Profile, verify lines for Stage 1/2/3
3. **Display names configured:** Check each line has Display Name value

**Resolution:**
1. Create Stage Profile (page 50343)
2. Add lines for each stage with custom names (page 50345)
3. Assign profile to item on Item Card
4. Refresh worksheet

### Reclassification Posting Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Template and/or Batch not configured" | Growing Setup missing config | Set Template/Batch |
| "Item Journal Line already exists" | Leftover lines | Delete batch lines |
| "Insufficient inventory" | Qty exceeds available | Check inventory |
| Dimension errors | Template requirements | Verify dimensions |

## Configuration Reference

### Growing Setup (Table 50078)

| Field | Type | Purpose |
|-------|------|---------|
| Primary Key | Code[20] | Single-record key |
| Purch. Receipt Stage Days | Integer | Days for purchase receipt calculation |
| Auto Transition to Overgrown | Boolean | Allow Stage 3 → Overgrown |
| Growing Stage Calendar | Code[20] | Base Calendar for non-working days |
| Variant Transf. Jrnl. Template | Code[10] | Item Journal Template |
| Variant Transf. Jrnl. Batch | Code[10] | Item Journal Batch |
| Activate Growing Stages | Boolean | Master feature toggle |

### Grower Stage Worksheet (Table 50080)

**Type:** Temporary (populated at runtime)

**Keys:**
- PK: Entry No.
- PlannedDate: Planned Date, Source Type

**Source Type:** ILE (0), Production (1)

### Stage Profile (Table 50088)

**Keys:** PK: Code (Clustered)
**Fields:** Code, Description

### Stage Profile Line (Table 50089)

**Keys:** PK: Profile Code, Stage (Clustered)
**Fields:** Profile Code, Stage (Enum), Display Name, No. of Days

**Note:** No. of Days on profile line overrides Item Variant's No. of Days.

### Enum Values

**CLE Growing Stage (60701):** ' ' (0), Stage 1 (1), Stage 2 (2), Stage 3 (3), Overgrown (10)
Values 4-9 reserved for future stages.

**CLE Stage Substitution Option (60702):** ' ' (0), Previous (1), Next (2), No Preference (3)

## Related Systems

- [[blooming-stages-it-troubleshooting]] — Blooming stage system (persistent schedule approach)
- [[blooming-stages]] — User guide for operations
