---
title: Blooming Stages — IT Troubleshooting
type: howto
tags: [items, blooming-stages, it-support, system-architecture, troubleshooting]
created: 2026-04-21
updated: 2026-04-21
sources: [blooming-stage-it-troubleshooting-guide.md]
---

# Blooming Stages — IT Troubleshooting

Technical architecture and troubleshooting for the blooming stage system.

## System Architecture

### Core Components

| Object | ID | Type | Purpose |
|--------|-----|------|---------|
| CLE Blooming Stage | 60701 | Enum | Stage values: Green Bud, Bud & Bloom, Full Bloom, Overgrown |
| CLE Stage Substitution Option | 60702 | Enum | Fallback behavior: Previous, Next, No Preference |
| CLE Growing Setup | 50078 | Table | Configuration: calendar, journal template/batch, auto-overgrown |
| CLE Stage Change Schedule | 50079 | Table | Persistent schedule entries with Pending/Processed status |
| CLE Blooming Stage Management | 50129 | Codeunit | Core logic: stage calc, helpers, posting, preference resolution |
| CLE Blooming Stage Subscribers | 50130 | Codeunit | Event wiring into production, purchase, and sales |
| CLE Growing Setup | 50223 | Page | Card page for configuration |
| CLE Grower Stage Worksheet | 50224 | Page | Worksheet showing pending entries with actions |
| CLE Item Substitution | 50038 | Page | Sub tool for bulk variant changes |

### Feature Toggle

**Master Toggle:** Growing Setup (Table 50078) field "Activate Blooming Stages" (Boolean)

All entry points in Codeunit 50129 and 50130 call `IsBloomingStagesActive()` before proceeding. When disabled, all blooming stage logic is bypassed.

### Field Extensions

**Item Variant:**
- `CLE Blooming Stage` (Enum 60701) — Maps variant to a stage
- `CLE No. of Days` (Integer) — Days before auto-advancing to next stage

**Customer:**
- `CLE Preferred Blooming Stage` (Enum 60701)
- `CLE Stage Substitution` (Enum 60702)

**Sales Header & Line:**
- `CLE Preferred Blooming Stage` (on header; copied from customer)
- `CLE Stage Substitution` (on header; copied from customer)
- `CLE Blooming Stage` (on line; set from variant)

**Item Ledger Entry:**
- `CLE Next Stage Change Date` (Date) — Stamped on production output and purchase receipt

## Stage Transition Algorithm

### Schedule Entry Creation

Schedule entries created by two event subscribers in CU 50130:

#### Production — First Consumption

**Trigger:** `OnAfterInsertConsumpEntry` on `Item Jnl.-Post Line`

**Logic:**
1. Check feature toggle
2. Check item has blooming stage variants
3. Prevent duplicates: no existing entry for this prod order + item
4. Call `CreateScheduleEntry()` with Source Type = Production

#### Purchase — Receipt Posting

**Trigger:** `OnAfterPurchRcptLineInsert` on `Purch.-Post`

**Logic:**
1. Check feature toggle
2. Check line is item type with variant code
3. Check item has blooming stage variants
4. Call `CreateScheduleEntry()` with Source Type = Purchase

### Schedule Entry Fields

```
Item No., Location Code, Item Description
Current Variant Code → Next Variant Code
Current Blooming Stage → Next Blooming Stage
Planned Date = StartDate + No. of Days (adjusted for non-working days)
Original Planned Date = Planned Date at creation
Status = Pending
Source Type = Production|Purchase
Source No. = Production/Purchase Order No.
Quantity, Created Date = Today
```

**Exit early (no entry created) if:**
- Variant not found
- Blooming Stage blank
- No. of Days = 0
- Next stage equals current stage (Overgrown stays Overgrown)

### Job Queue Processing (CU 50129.ProcessPendingStageChanges)

**Filter:** `Planned Date <= Today`, Status in {Pending, Delayed}

**For each matching entry:**

1. If next stage is Overgrown and Auto Transition disabled: **skip**
2. If Next Variant Code blank: **skip**
3. Call `PostStageReclassification()`
4. Call `CreateNextScheduleEntry()` — creates following transition
5. Set Status = Processed

### Chain Creation (CU 50129.CreateNextScheduleEntry)

After processing an entry, system creates the next transition:

- Uses processed entry's Next Variant Code as new Current Variant Code
- Calls `CreateScheduleEntry()` with StartDate = Today
- If next stage is Overgrown and Auto Transition disabled: **skip**
- If Next Variant Code blank: **skip**

**Result:** Continuous chain of transitions until Overgrown or no more stages.

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
- Template and Batch from Growing Setup fields
- Batch cleared before posting (deletes existing lines)
- Posts via Item Jnl.-Post codeunit
- Binds CLE Item Variant Management subscription

**Error if:** Template or Batch not configured in Growing Setup.

## Event Subscriptions (CU 50130)

| # | Event | Source | Procedure | Purpose |
|---|----------|--------|-----------|---------|
| 1 | OnAfterInsertConsumpEntry | Item Jnl.-Post Line | CreateScheduleOnConsumption | Create schedule on first consumption |
| 2 | OnBeforeInsertItemLedgEntry | Item Jnl.-Post Line | SetNextStageDateOnOutput | Stamp Next Stage Change Date on output |
| 3 | OnBeforePostPurchaseDoc | Purch.-Post | BlockReceiptWithoutVariant | Block receipt if no variant |
| 4 | OnAfterPurchRcptLineInsert | Purch.-Post | CreateScheduleOnReceipt | Create schedule on receipt |
| 5 | OnAfterInsertEvent | Sales Header | CopyCustomerPreferencesOnInsert | Copy preferences from customer |
| 6 | OnAfterValidateEvent (No.) | Sales Line | ApplyPreferredStageOnNoValidate | Auto-apply preferred variant |

All use `EventSubscriberInstance = StaticAutomatic`.

## Date Calculation Algorithm

### CU 50129.CalculateNextStageDate(StartDate, NoOfDays)

```
1. TargetDate = StartDate + NoOfDays (calendar days)
2. Call AdjustForNonWorkingDay(TargetDate)
```

### CU 50129.AdjustForNonWorkingDay(TargetDate)

```
1. Get Growing Setup
2. If no calendar configured: return TargetDate as-is
3. Set CustomCalendarChange filter: Company level
4. While TargetDate is non-working day:
     TargetDate = TargetDate - 1  (move backward)
5. Return TargetDate
```

**Key behavior:** Dates move **backward** to nearest working day, never forward. Ensures reclassification before or on target date, not after.

## Customer Preference Resolution

### CU 50129.GetCustomerPreferredVariant(CustomerNo, ItemNo)

```
1. If feature inactive: return default sales variant
2. If item has no blooming stage variants: return default
3. If customer not found: return default
4. Get customer's Preferred Blooming Stage and Stage Substitution
5. If preferred stage blank: return default
6. Try: variant for preferred stage → return if found
7. Apply substitution:
   - Previous: try variant for previous stage
   - Next: try variant for next stage
   - No Preference/blank: return default
8. If substitution variant found: return it
9. Final fallback: return default sales variant
```

## Job Queue Configuration

**Object Type:** Codeunit **50129**
**Procedure:** `ProcessPendingStageChanges`

**Recommended schedule:** Every 2-4 hours during business hours, or daily

**Prerequisites:**
- Feature toggle enabled in Growing Setup
- Growing Setup has Variant Transfer Journal Template and Batch configured
- Item variants have blooming stage and days configured
- Base calendar (optional) configured if using non-working day logic

## Troubleshooting

### Job Queue Not Processing Entries

**Symptoms:** Pending entries accumulate, planned dates pass without processing

**Check:**
1. Job Queue Entry status must be "Ready" or "In Process"
2. Verify last run date/time is recent
3. Check Job Queue Log Entries for errors
4. Verify feature toggle enabled: Growing Setup > "Activate Blooming Stages" = Yes

**Common causes:**
- Job queue stopped or in error state
- Feature toggle disabled
- Growing Setup missing journal config (error on first entry)
- Journal batch contains leftover lines from failed run

**Fix leftover journal lines:**
1. Open item journal with template/batch from Growing Setup
2. Delete all lines
3. Restart job queue entry

### Stuck Entries (Status Remains Pending)

**Symptoms:** Entries have past planned dates but still pending

**Check:**
1. If "Next Blooming Stage" = Overgrown and "Auto Transition to Overgrown" = No: **expected**, job queue intentionally skips
2. If "Next Variant Code" blank: no target variant exists. Create missing variant on item.
3. Verify job queue entry is running

**Diagnostic:**
```sql
CLE Stage Change Schedule where:
  Status = Pending or Delayed
  Planned Date <= Today
```

Check Next Variant Code and Next Blooming Stage exist.

### Wrong Variant on Sales Lines

**Symptoms:** Sales lines show unexpected variant

**Check:**
1. **Customer card:** Verify "CLE Preferred Blooming Stage" and "CLE Stage Substitution"
2. **Sales header:** Confirm preferences copied from customer
3. **Item variants:** Verify variant exists matching customer's preference
4. **Substitution logic:** If preferred doesn't exist, check substitution option

**Resolution:**
1. Fix customer preferences if incorrect
2. Create missing item variants
3. Manually correct variant on affected lines
4. New orders will use corrected preferences

### Purchase Receipt Blocked

**Error:** "Item [No.] has blooming stage variants. You must select a variant before posting."

**Cause:** CU 50130 subscriber `BlockReceiptWithoutVariant` fires on `OnBeforePostPurchaseDoc`

**Resolution:**
1. Open purchase order
2. For each blooming item line, select Variant Code
3. Retry posting

**If item shouldn't have blooming stages:** Remove "CLE Blooming Stage" from variants (set blank).

### Reclassification Posting Errors

**Symptoms:** Job queue fails with journal errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Variant Transfer Journal not configured" | Growing Setup missing config | Set Template and Batch in Growing Setup |
| "Item Journal Line already exists" | Leftover lines in journal batch | Delete all lines from batch |
| "Item Ledger Entry doesn't exist" or negative inv. | Insufficient inventory | Check inventory; schedule qty may exceed stock |
| Dimension errors | Template requires dimensions | Verify template default dimensions |

### Schedule Entries Created with Wrong Dates

**Symptoms:** Planned dates off by days or land on weekends

**Check:**
1. **Variant No. of Days:** Open item variant, verify "CLE No. of Days"
2. **Base Calendar:** Open Growing Setup, verify calendar code
3. **Calendar changes:** Check company-level customizations (non-working days)
4. **Backward adjustment:** Remember dates move backward, never forward

### Duplicate Schedule Entries

**Symptoms:** Multiple pending entries for same item/variant/production order

**Cause:** Duplicate check only applies to production source. Purchase entries have no prevention.

**Resolution:**
1. Cancel duplicate entries via Grower Stage Worksheet
2. If recurs on production, check if consumption posted multiple times

## Configuration Reference

### Growing Setup (Table 50078)

| Field | Type | Purpose |
|-------|------|---------|
| Primary Key | Code[20] | Single-record key |
| Purch. Receipt Stage Days | Integer | Default days for purchase receipt entries |
| Auto Transition to Overgrown | Boolean | Allow job to transition Full Bloom → Overgrown |
| Blooming Stage Calendar | Code[20] | Base Calendar for non-working days |
| Variant Transf. Jrnl. Template | Code[10] | Item Journal Template for reclassification |
| Variant Transf. Jrnl. Batch | Code[10] | Item Journal Batch for reclassification |

### Stage Change Schedule (Table 50079)

**Keys:**
- PK: Entry No. (AutoIncrement, Clustered)
- PlannedDate: Planned Date, Status
- ItemLocation: Item No., Location Code, Status

**Status values:** Pending (0), Processed (1), Delayed (2), Cancelled (3)
**Source Type:** Production (0), Purchase (1)

### Enum Values

**CLE Blooming Stage (60701):** ' ' (0), Green Bud (1), Bud & Bloom (2), Full Bloom (3), Overgrown (4)

**CLE Stage Substitution Option (60702):** ' ' (0), Previous (1), Next (2), No Preference (3)

## Related System

- [[blooming-stages]] — User guide for blooming stage operations
- [[growing-stages-it-troubleshooting]] — Growing stage system (alternative architecture)
