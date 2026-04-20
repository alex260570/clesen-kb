# Blooming Stages - IT Troubleshooting Guide

## System Architecture

### Core Components

| Object | ID | Type | Purpose |
| -------- | ---- | ------ | --------- |
| CLE Blooming Stage | 60701 | Enum | Stage values: ' ', Green Bud, Bud & Bloom, Full Bloom, Overgrown |
| CLE Stage Substitution Option | 60702 | Enum | Fallback behavior: ' ', Previous, Next, No Preference |
| CLE Growing Setup | 50078 | Table | Single-record config: calendar, journal, receipt days, auto-overgrown |
| CLE Stage Change Schedule | 50079 | Table | Pending/processed stage transitions with dates and quantities |
| CLE Blooming Stage Management | 50129 | Codeunit | Core logic: date calc, stage helpers, schedule CRUD, reclassification posting, customer preference resolution |
| CLE Blooming Stage Subscribers | 50130 | Codeunit | Event wiring into production, purchasing, and sales workflows |
| CLE Growing Setup | 50223 | Page | Card page for Growing Setup table |
| CLE Grower Stage Worksheet | 50224 | Page | List page showing pending schedule entries with Delay/Process/Cancel actions |
| CLE Item Substitution | 50038 | Page | Sub Tool with "Change Stage" action for bulk sales line variant updates |

### Feature Toggle

**Master toggle:** Growing Setup (Table 50078) field 7 `"Activate Blooming Stages"` (Boolean)

Checked by `CU 50129.IsBloomingStagesActive()`. Every entry point in both CU 50129 and CU 50130 calls this before proceeding. When false, all blooming stage logic is bypassed.

### Field Extensions

**Item Variant:**

- `"CLE Blooming Stage"` (Enum 60701) - Maps variant to a blooming stage
- `"CLE No. of Days"` (Integer) - Calendar days this stage lasts

**Customer:**

- `"CLE Preferred Blooming Stage"` (Enum 60701)
- `"CLE Stage Substitution"` (Enum 60702)

**Sales Header:**

- `"CLE Preferred Blooming Stage"` (Enum 60701) - Copied from customer on insert
- `"CLE Stage Substitution"` (Enum 60702) - Copied from customer on insert

**Sales Line:**

- `"CLE Blooming Stage"` (Enum 60701) - Set when variant is applied

**Item Ledger Entry:**

- `"CLE Next Stage Change Date"` (Date) - Stamped on production output entries

## Stage Transition Algorithm

### Schedule Entry Creation

Schedule entries are created by two event subscribers in CU 50130:

#### 1. Production - First Consumption (CU 50130, line 10-42)

Trigger: `OnAfterInsertConsumpEntry` on `Item Jnl.-Post Line`

Logic:

1. Check feature toggle
2. Check item has blooming stage variants
3. Check no existing schedule entry for this prod order + item (prevents duplicates)
4. Get production order line for variant and quantity
5. Call `CreateScheduleEntry()` with Source Type = Production

#### 2. Purchase - Receipt Posting (CU 50130, line 91-118)

Trigger: `OnAfterPurchRcptLineInsert` on `Purch.-Post`

Logic:

1. Check feature toggle
2. Check line is item type with variant code
3. Check item has blooming stage variants
4. Call `CreateScheduleEntry()` with Source Type = Purchase, quantity = Qty. to Receive

### Schedule Entry Fields (Created by CU 50129.CreateScheduleEntry)

```text
Item No., Location Code, Item Description
Current Variant Code  -->  Next Variant Code
Current Blooming Stage  -->  Next Blooming Stage (from GetNextBloomingStage)
Planned Date = StartDate + No. of Days, adjusted for non-working days
Original Planned Date = same as Planned Date at creation
Status = Pending
Source Type = Production|Purchase
Source No. = Prod. Order No. or Purchase Order No.
Quantity, Created Date = Today
```

Exits early (no entry created) if:

- Variant not found
- Blooming Stage is blank
- No. of Days is 0
- Next stage equals current stage (Overgrown stays Overgrown)

### Job Queue Processing (CU 50129.ProcessPendingStageChanges)

Filter: `"Planned Date" <= Today`, Status in `{Pending, Delayed}`

For each matching entry:

1. If next stage is Overgrown and Auto Transition to Overgrown is disabled: **skip** (entry stays pending)
2. If Next Variant Code is blank: **skip** (no reclassification target)
3. Call `PostStageReclassification()`
4. Call `CreateNextScheduleEntry()` - creates the following transition
5. Set Status = Processed, Processed Date = Today

### Chain Creation (CU 50129.CreateNextScheduleEntry)

After processing an entry, the system creates the next transition in the chain:

- Uses the processed entry's Next Variant Code as the new Current Variant Code
- Calls `CreateScheduleEntry()` with StartDate = Today
- If next stage would be Overgrown and Auto Transition to Overgrown is disabled: **no entry created**
- If Next Variant Code is blank: **no entry created**

## Reclassification Posting Pattern

### CU 50129.PostStageReclassification

Uses item journal to post a paired negative/positive adjustment:

```text
Line 1: Negative Adjmt.
  Item No. = schedule entry item
  Location = schedule entry location
  Variant = Current Variant Code
  Quantity = schedule entry quantity
  Document No. = 'Stage Reclass'

Line 2: Positive Adjmt.
  Item No. = schedule entry item
  Location = schedule entry location
  Variant = Next Variant Code
  Quantity = schedule entry quantity
  Document No. = 'Stage Reclass'
```

**Journal configuration:**

- Template and Batch come from Growing Setup fields `"Variant Transf. Jrnl. Template"` and `"Variant Transf. Jrnl. Batch"`
- Batch is cleared before each posting (all existing lines deleted)
- Posts via `Item Jnl.-Post` codeunit
- Binds `CLE Item Variant Management` subscription to suppress posting dialog

**Error if:** Template or Batch not configured in Growing Setup.

## Event Subscriptions (CU 50130)

| # | Event | Source Object | Procedure | Purpose |
| --- | ------- | -------------- | --------- | --------- |
| 1 | OnAfterInsertConsumpEntry | CU Item Jnl.-Post Line | CreateScheduleOnConsumption | Create schedule on first production consumption |
| 2 | OnBeforeInsertItemLedgEntry | CU Item Jnl.-Post Line | SetNextStageDateOnOutput | Stamp Next Stage Change Date on production output ILEs |
| 3 | OnBeforePostPurchaseDoc | CU Purch.-Post | BlockReceiptWithoutVariant | Block purchase receipt if blooming item has no variant |
| 4 | OnAfterPurchRcptLineInsert | CU Purch.-Post | CreateScheduleOnReceipt | Create schedule on purchase receipt |
| 5 | OnAfterInsertEvent | Table Sales Header | CopyCustomerPreferencesOnInsert | Copy preferred stage + substitution from customer to sales header |
| 6 | OnAfterValidateEvent (No.) | Table Sales Line | ApplyPreferredStageOnNoValidate | Auto-apply customer preferred variant when item is entered |

All subscribers use `EventSubscriberInstance = StaticAutomatic`.

## Date Calculation Algorithm

### CU 50129.CalculateNextStageDate(StartDate, NoOfDays)

```text
1. TargetDate = StartDate + NoOfDays (calendar days)
2. Call AdjustForNonWorkingDay(TargetDate)
```

### CU 50129.AdjustForNonWorkingDay(TargetDate)

```text
1. Get Growing Setup
2. If no Blooming Stage Calendar configured: return TargetDate as-is
3. Set CustomCalendarChange filter: Source Type = Company, Base Calendar Code = setup calendar
4. While TargetDate is a non-working day per CalendarMgmt.IsNonworkingDay():
     TargetDate = TargetDate - 1  (move backward)
5. Return TargetDate
```

Key behavior: dates always move **backward** to the nearest working day, never forward. This ensures plants are reclassified before or on the target date, not after.

## Customer Preference Resolution

### CU 50129.GetCustomerPreferredVariant(CustomerNo, ItemNo)

```text
1. If feature inactive: return default sales variant
2. If item has no blooming stage variants: return default sales variant
3. If customer not found: return default sales variant
4. Get customer's Preferred Blooming Stage and Stage Substitution
5. If preferred stage is blank: return default sales variant
6. Try: variant for preferred stage  -->  return if found
7. Apply substitution:
   - Previous: try variant for previous stage
   - Next: try variant for next stage
   - No Preference / blank: return default sales variant
8. If substitution variant found: return it
9. Final fallback: return default sales variant
```

## Job Queue Configuration

### Setup

**Object Type:** Codeunit
**Object ID:** 50129
**Procedure:** ProcessPendingStageChanges

**Recommended schedule:** Every 2-4 hours during business hours, or once daily if plants transition slowly.

**Configuration steps:**

1. Open Job Queue Entries
2. Create new entry
3. Set Object Type to Codeunit = 50129
4. Set recurrence (e.g., daily at 06:00 or every 4 hours)
5. Set status to Ready

### Prerequisites

Before the job queue can run successfully:

- Feature toggle must be enabled in Growing Setup
- Growing Setup must have Variant Transfer Journal Template and Batch configured
- Item variants must have blooming stage and days configured
- Base calendar (optional) should be set if non-working day logic is needed

## Troubleshooting

### Job Queue Not Processing Entries

**Symptoms:** Pending entries accumulate, planned dates pass without processing.

**Check:**

1. Job Queue Entry status must be "Ready" or "In Process"
2. Verify last run date/time is recent
3. Check for error messages in Job Queue Log Entries
4. Verify feature toggle is enabled: Growing Setup > "Activate Blooming Stages" = Yes

**Common causes:**

- Job queue stopped or in error state
- Feature toggle disabled
- Growing Setup missing journal template/batch configuration (causes error on first entry)
- Journal batch contains leftover lines from a failed prior run

**Fix for leftover journal lines:**

1. Open the item journal with the template/batch from Growing Setup
2. Delete all lines
3. Restart the job queue entry

---

### Stuck Entries (Status Remains Pending)

**Symptoms:** Entries have planned dates in the past but status is still Pending.

**Check:**

1. If "Next Blooming Stage" = Overgrown and "Auto Transition to Overgrown" = No: this is expected behavior. The job queue intentionally skips these.
2. If "Next Variant Code" is blank: no target variant exists for the next stage. Create the missing variant on the item.
3. Verify the job queue entry is running (see above).

**Diagnostic query:**

```text
CLE Stage Change Schedule where:
  Status = Pending or Delayed
  Planned Date <= Today
```

If entries exist, check Next Variant Code and Next Blooming Stage against Growing Setup.

---

### Wrong Variant on Sales Lines

**Symptoms:** Sales lines show unexpected variant code for blooming stage items.

**Check:**

1. **Customer card:** Verify "CLE Preferred Blooming Stage" and "CLE Stage Substitution" values
2. **Sales header:** Confirm preferences were copied (check "CLE Preferred Blooming Stage" on the sales header matches the customer)
3. **Item variants:** Verify a variant exists with the matching "CLE Blooming Stage" value
4. **Substitution logic:** If preferred variant does not exist, the system applies the substitution option:
   - Previous/Next: looks for adjacent stage variant
   - No Preference/blank: falls back to default sales variant

**Resolution steps:**

1. Fix customer preferences if incorrect
2. Create missing item variants if needed
3. Manually correct variant on affected sales lines
4. For new orders, the fix takes effect automatically on the next line entry

**Note:** Preferences are copied to the sales header at order creation time. Changing the customer card does not retroactively update existing orders.

---

### Purchase Receipt Blocked

**Symptoms:** Error when posting purchase receipt: *"Item [No.] has blooming stage variants. You must select a variant before posting the receipt."*

**Cause:** CU 50130 subscriber `BlockReceiptWithoutVariant` fires on `OnBeforePostPurchaseDoc`. It checks all purchase lines with Qty. to Receive > 0 for items that have blooming stage variants. If any such line has a blank Variant Code, posting is blocked.

**Resolution:**

1. Open the purchase order
2. For each item line with blooming stage variants, select the appropriate Variant Code
3. Retry posting

**If the item should NOT have blooming stages:** Remove the "CLE Blooming Stage" value from its variants (set to blank).

---

### Reclassification Posting Errors

**Symptoms:** Job queue fails with journal posting errors.

**Common causes and fixes:**

| Error | Cause | Fix |
| ------- | ------- | ----- |
| "Variant Transfer Journal Template and/or Batch not configured" | Growing Setup missing journal config | Open Growing Setup, set Template and Batch |
| "Item Journal Line already exists" | Leftover lines in journal batch | Open the journal batch and delete all lines |
| "Item Ledger Entry does not exist" or negative inventory | Insufficient inventory in current variant | Check inventory for the item/variant/location. The schedule entry quantity may exceed available stock. |
| Dimension errors | Journal template has dimension requirements | Verify the template's default dimensions allow the posting |

---

### Schedule Entries Created with Wrong Dates

**Symptoms:** Planned dates are off by days or land on weekends.

**Check:**

1. **Variant No. of Days:** Open the item variant, verify "CLE No. of Days" is correct
2. **Base Calendar:** Open Growing Setup, verify "Blooming Stage Calendar" points to a valid base calendar
3. **Calendar customizations:** Check the base calendar's customized changes (non-working days). The system uses Company-level customizations.
4. **Backward adjustment:** Remember dates move backward to the nearest working day, never forward. A Friday target stays Friday; a Saturday target becomes Friday.

---

### Duplicate Schedule Entries

**Symptoms:** Multiple pending entries for the same item/variant/production order.

**Cause:** The duplicate check in CU 50130 `CreateScheduleOnConsumption` only applies to production source entries and checks by Source No. + Item No. Purchase receipt entries have no duplicate prevention (each receipt creates a new entry).

**Resolution:**

1. Cancel duplicate entries via the Grower Stage Worksheet
2. If the issue recurs on production, check if consumption is being posted multiple times for the same production order

## Configuration Reference

### Growing Setup (Table 50078)

| Field | Type | Purpose |
| ------- | ------ | --------- |
| Primary Key | Code[20] | Single-record key |
| Purch. Receipt Stage Days | Integer (min 0) | Default days for purchase receipt schedule entries |
| Auto Transition to Overgrown | Boolean | Allow job queue to transition Full Bloom to Overgrown |
| Blooming Stage Calendar | Code[20] | Base Calendar for non-working day detection |
| Variant Transf. Jrnl. Template | Code[10] | Item Journal Template for reclassification |
| Variant Transf. Jrnl. Batch | Code[10] | Item Journal Batch for reclassification |

### Stage Change Schedule (Table 50079)

**Keys:**

- PK: Entry No. (AutoIncrement, Clustered)
- PlannedDate: Planned Date, Status
- ItemLocation: Item No., Location Code, Status

**Status values:** Pending (0), Processed (1), Delayed (2), Cancelled (3)

**Source Type values:** Production (0), Purchase (1)

### Enum Values

**CLE Blooming Stage (60701):** ' ' (0), Green Bud (1), Bud & Bloom (2), Full Bloom (3), Overgrown (4)

**CLE Stage Substitution Option (60702):** ' ' (0), Previous (1), Next (2), No Preference (3)

## Related Files

### Codeunits

- `app/5 Codeunits/Inventory/50129.Codeunit.CLE.BloomingStageManagement.al`
- `app/5 Codeunits/Inventory/50130.Codeunit.CLE.BloomingStageSubscribers.al`

### Tables

- `app/1 Tables/Inventory/50078.Table.CLE.GrowingSetup.al`
- `app/1 Tables/Inventory/50079.Table.CLE.StageChangeSchedule.al`

### Pages

- `app/3 Pages/Inventory/50223.Page.CLE.GrowingSetup.al`
- `app/3 Pages/Inventory/50224.Page.CLE.GrowerStageWorksheet.al`
- `app/3 Pages/Inventory/50038.Page.CLE.ItemSubstitution.al` (Change Stage action)

### Enums

- `app/6 Enums/60701.Enum.CLE.BloomingStage.al`
- `app/6 Enums/60702.Enum.CLE.StageSubstitutionOption.al`

## Escalation

If troubleshooting does not resolve the issue:

1. **Collect diagnostics:**
   - Item No. and variant codes involved
   - Schedule entry details (Entry No., Status, Planned Date, Next Variant Code)
   - Growing Setup configuration screenshot
   - Job Queue Log Entries for CU 50129
   - Item journal batch contents if posting failed

2. **Check recent changes:**
   - Git history of CU 50129 and CU 50130
   - Recent deployments or configuration changes
   - Changes to base calendar or item variants

3. **Contact development team** with full diagnostics
