# Growing Stages - IT Troubleshooting Guide

## System Architecture

### Core Components

| Object | ID | Type | Purpose |
| -------- | ---- | ------ | --------- |
| CLE Growing Stage | 60701 | Enum | Stage values: ' ', Stage 1, Stage 2, Stage 3, Overgrown (extensible for future stages) |
| CLE Stage Substitution Option | 60702 | Enum | Fallback behavior: ' ', Previous, Next, No Preference |
| CLE Growing Setup | 50078 | Table | Single-record config: calendar, journal, receipt days, auto-overgrown |
| CLE Grower Stage Wrksheet | 50080 | Table | Temporary worksheet populated at runtime from ILEs and Production Order Lines |
| CLE Stage Profile | 50088 | Table | Stage profile header (Code, Description) |
| CLE Stage Profile Line | 50089 | Table | Maps Growing Stage enum to custom display names per profile |
| CLE Growing Stage Management | 50129 | Codeunit | Core logic: date calc, stage helpers, worksheet population, reclassification posting, customer preference resolution |
| CLE Growing Stage Subscribers | 50130 | Codeunit | Event wiring into production, purchasing, and sales workflows |
| CLE Shortage Resolution | 50132 | Codeunit | Intelligent inventory shortage resolution with growing stage substitution |
| CLE Growing Setup | 50225 | Page | Card page for Growing Setup table |
| CLE Grower Stage Worksheet | 50226 | Page | Worksheet showing pending stage transitions from ILEs and Prod Order Lines with Process/Delay actions |
| CLE Shortage Sales Lines | 50337 | Page | Sales line list with Resolve Shortage action for intelligent stage substitution |

### Feature Toggle

**Master toggle:** Growing Setup (Table 50078) field 7 `"Activate Growing Stages"` (Boolean)

Checked by `CU 50129.IsGrowingStagesActive()`. Every entry point in both CU 50129 and CU 50130 calls this before proceeding. When false, all growing stage logic is bypassed.

### Stage Profile System

**Stage Profiles** allow custom display names for growing stages per crop type:

- **Stage Profile (50088)**: Header record with Code and Description
- **Stage Profile Line (50089)**: Maps each Growing Stage enum value to a custom display name (e.g., "Green Bud", "Bud & Bloom")
- **Item Card**: Field "CLE Stage Profile Code" links items to their profile
- **Display Resolution**: `CU 50129.GetStageDisplayName(ItemNo, Stage)` returns the custom name or falls back to enum caption

This allows different crops to use different terminology (e.g., "Green Bud" for flowers, "Seedling" for vegetables) while using the same Stage 1/2/3 enum internally.

### Field Extensions

**Item:**

- `"CLE Stage Profile Code"` (Code[20]) - Links to Stage Profile for custom display names

**Item Variant:**

- `"CLE Growing Stage"` (Enum 60701) - Maps variant to a growing stage
- `"CLE No. of Days"` (Integer) - Calendar days this stage lasts

**Customer:**

- `"CLE Preferred Growing Stage"` (Enum 60701)
- `"CLE Stage Substitution"` (Enum 60702)

**Sales Header:**

- `"CLE Preferred Growing Stage"` (Enum 60701) - Copied from customer on insert
- `"CLE Stage Substitution"` (Enum 60702) - Copied from customer on insert

**Sales Line:**

- `"CLE Growing Stage"` (Enum 60701) - Set when variant is applied

**Production Order Line:**

- `"CLE Growing Stage"` (Enum 60701) - Tracks stage on the line without changing variant
- `"CLE Next Stage Change Date"` (Date) - Calculated from due date working backward

**Item Ledger Entry:**

- `"CLE Next Stage Change Date"` (Date) - Stamped on production output and purchase receipt entries

## Stage Transition Algorithm

### Architectural Change: Worksheet vs Schedule Table

**Previous Architecture (Table 50079):** Persistent schedule table with Pending/Processed status tracking

**Current Architecture (Table 50080):** Temporary worksheet populated on-demand from:
- **Item Ledger Entries**: Filters by Next Stage Change Date <= Today
- **Production Order Lines**: Filters Released Prod Order Lines by Next Stage Change Date <= Today

**Key Differences:**
- No persistent status tracking (Pending/Processed)
- No schedule entry creation events
- Worksheet is populated when opened or when job queue runs
- Processing updates the source records (ILE or Prod Order Line) directly and posts reclassification journal

### Stage Date Stamping

Dates are stamped on source records by event subscribers in CU 50130:

#### 1. Production Output (CU 50130 - OnBeforeInsertItemLedgEntry)

Trigger: `OnBeforeInsertItemLedgEntry` on `Item Jnl.-Post Line` (when Entry Type = Output)

Logic:
1. Check feature toggle
2. Check item has growing stage variants
3. Calculate Next Stage Change Date from posting date + variant's No. of Days
4. Stamp on Item Ledger Entry before insert

#### 2. Production Order Line (CU 50130 - OnAfterRefreshProdOrderLine)

Trigger: When production order line is created or refreshed

Logic:
1. Check feature toggle
2. Get Production Default variant to determine initial stage
3. Calculate stage change date by working backward from Due Date
4. Set CLE Growing Stage and CLE Next Stage Change Date on line

#### 3. Purchase Receipt (CU 50130 - OnAfterPurchRcptLineInsert)

Trigger: `OnAfterPurchRcptLineInsert` on `Purch.-Post`

Logic:
1. Check feature toggle
2. Check line is item type with variant code and growing stage variants
3. Calculate Next Stage Change Date from receipt date + Purchase Receipt Stage Days from setup
4. Update all related Item Ledger Entries with the calculated date

### Worksheet Entry Fields (Populated by CU 50129)

```text
Entry No. (auto-assigned)
Source Type = ILE|Production
Source Entry No. = ILE Entry No. or 0 for prod order lines
Prod. Order No., Prod. Order Line No.
Item No., Location Code, Item Description
Current Variant Code, Current Growing Stage
Next Variant Code, Next Growing Stage (from GetNextGrowingStage)
Planned Date = Next Stage Change Date from source record
Original Planned Date = same as Planned Date
Quantity = Remaining Quantity from ILE or prod order line quantity
Delay Days (user editable)
Bin Code (from warehouse entries)
Current Stage Display Name, Next Stage Display Name (from Stage Profile)
```

Worksheet entry is NOT created if:

- Variant not found
- Growing Stage is blank
- Next stage equals current stage (Overgrown stays Overgrown)
- No Next Variant Code exists for the next stage

### Job Queue Processing (CU 50129.ProcessPendingStageChanges)

Workflow:

1. Populate temporary worksheet from ILEs and Production Order Lines where Next Stage Change Date <= Today
2. Apply Auto Transition to Overgrown filter (skip Overgrown transitions if disabled)
3. For each worksheet entry with Planned Date + Delay Days <= Today:
   - Verify Next Variant Code exists
   - Call `PostStageReclassification()` to post item journal reclassification
   - Update source ILE Next Stage Change Date for the next transition
   - For production order lines: update Growing Stage and recalculate Next Stage Change Date

### Stage Transition Chain

The chain is maintained through automatic date recalculation:

**For Inventory (ILEs):**
- After reclassification, updates the ILE's Next Stage Change Date = Today + new variant's No. of Days
- Next time worksheet loads, the updated ILE appears if date <= Today
- Chain continues until stage = Overgrown or No. of Days = 0

**For Production Order Lines:**
- Updates Growing Stage on the line
- Recalculates Next Stage Change Date from current date + variant's No. of Days
- Line appears in worksheet again when date is reached
- Actual inventory reclassification occurs at Output posting, using the line's Growing Stage

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
| 1 | OnBeforeInsertItemLedgEntry | CU Item Jnl.-Post Line | SetNextStageDateOnOutput | Stamp Next Stage Change Date on production output and purchase receipt ILEs |
| 2 | OnBeforePostPurchaseDoc | CU Purch.-Post | BlockReceiptWithoutVariant | Block purchase receipt if growing item has no variant |
| 3 | OnAfterPurchRcptLineInsert | CU Purch.-Post | StampNextStageDateOnReceipt | Calculate and stamp Next Stage Change Date on purchase receipt ILEs |
| 4 | OnAfterInsertEvent | Table Sales Header | CopyCustomerPreferencesOnInsert | Copy preferred stage + substitution from customer to sales header |
| 5 | OnAfterValidateEvent (No.) | Table Sales Line | ApplyPreferredStageOnNoValidate | Auto-apply customer preferred variant when item is entered |
| 6 | OnAfterRefreshProdOrderLine | CU Prod. Order Management | CalculateStageOnProdOrderLine | Calculate initial stage and date when prod order line is created/refreshed |

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
2. If no Growing Stage Calendar configured: return TargetDate as-is
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
2. If item has no growing stage variants: return default sales variant
3. If customer not found: return default sales variant
4. Get customer's Preferred Growing Stage and Stage Substitution
5. If preferred stage is blank: return default sales variant
6. Try: variant for preferred stage  -->  return if found
7. Apply substitution:
   - Previous: try variant for previous stage
   - Next: try variant for next stage
   - No Preference / blank: return default sales variant
8. If substitution variant found: return it
9. Final fallback: return default sales variant
```

## Intelligent Shortage Resolution

### Overview

When inventory shortages occur during inventory check, the system integrates with customer growing stage preferences to automatically propose alternative stages.

### Components

- **Page 50337 (CLE Shortage Sales Lines)**: Shows sales lines with shortages, includes "Resolve Shortage" action
- **Codeunit 50132 (CLE Shortage Resolution)**: Implements intelligent stage substitution algorithm

### Resolution Algorithm (CU 50132.GetAvailableSubstituteVariant)

```text
1. Get customer's Preferred Growing Stage and Stage Substitution option from sales header
2. Step 1: Try preferred direction first
   - If substitution = Previous: try previous stage variant
   - If substitution = Next: try next stage variant
   - Check real-time inventory availability across all locations
   - Account for existing demand from other sales lines on same shipment date
3. Step 2: Try opposite direction
   - If preferred direction unavailable, try opposite (Previous → Next or Next → Previous)
4. Step 3: Try all remaining stages
   - Loop through Stage 1, Stage 2, Stage 3 (skipping already tried)
5. Return substitute variant code and whether it matches preferred direction
```

### User Experience

- **Preferred direction available**: Confirms with user, shows "matches customer preference"
- **Non-preferred direction available**: Warns user before substituting
- **No substitute available**: Offers to zero out quantity with inventory check reason code

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
- Item variants must have growing stage and days configured
- Base calendar (optional) should be set if non-working day logic is needed

## Troubleshooting

### Job Queue Not Processing Entries

**Symptoms:** Worksheet entries accumulate, planned dates pass without processing.

**Check:**

1. Job Queue Entry status must be "Ready" or "In Process"
2. Verify last run date/time is recent
3. Check for error messages in Job Queue Log Entries
4. Verify feature toggle is enabled: Growing Setup > "Activate Growing Stages" = Yes

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

### Worksheet Entries Not Appearing

**Symptoms:** Expected stage transitions don't show in Grower Stage Worksheet.

**Check:**

1. Verify Item Ledger Entries have "CLE Next Stage Change Date" populated
2. Check date is <= Today (or <= Today + planned days shown on worksheet)
3. For production order lines: verify "CLE Next Stage Change Date" is set
4. Verify item variants have "CLE Growing Stage" and "CLE No. of Days" configured
5. Check that Next Variant Code exists for the next stage

**Diagnostic queries:**

```text
Item Ledger Entry where:
  CLE Next Stage Change Date <> 0D
  CLE Next Stage Change Date <= Today
  Open = true
  
Production Order Line where:
  Status = Released
  CLE Next Stage Change Date <> 0D
  CLE Next Stage Change Date <= Today
```

---

### Wrong Variant on Sales Lines

**Symptoms:** Sales lines show unexpected variant code for growing stage items.

**Check:**

1. **Customer card:** Verify "CLE Preferred Growing Stage" and "CLE Stage Substitution" values
2. **Sales header:** Confirm preferences were copied (check "CLE Preferred Growing Stage" on the sales header matches the customer)
3. **Item variants:** Verify a variant exists with the matching "CLE Growing Stage" value
4. **Substitution logic:** If preferred variant does not exist, the system applies the substitution option:
   - Previous/Next: looks for adjacent stage variant
   - No Preference/blank: falls back to default sales variant
5. **Stage Profile**: If using custom display names, verify Stage Profile is configured on the item

**Resolution steps:**

1. Fix customer preferences if incorrect
2. Create missing item variants if needed
3. Configure Stage Profile on item if using custom names
4. Manually correct variant on affected sales lines
5. For new orders, the fix takes effect automatically on the next line entry

**Note:** Preferences are copied to the sales header at order creation time. Changing the customer card does not retroactively update existing orders.

---

### Purchase Receipt Blocked

**Symptoms:** Error when posting purchase receipt: *"Item [No.] has growing stage variants. You must select a variant before posting the receipt."*

**Cause:** CU 50130 subscriber `BlockReceiptWithoutVariant` fires on `OnBeforePostPurchaseDoc`. It checks all purchase lines with Qty. to Receive > 0 for items that have growing stage variants. If any such line has a blank Variant Code, posting is blocked.

**Resolution:**

1. Open the purchase order
2. For each item line with growing stage variants, select the appropriate Variant Code
3. Retry posting

**If the item should NOT have growing stages:** Remove the "CLE Growing Stage" value from its variants (set to blank).

---

### Reclassification Posting Errors

**Symptoms:** Job queue fails with journal posting errors.

**Common causes and fixes:**

| Error | Cause | Fix |
| ------- | ------- | ----- |
| "Variant Transfer Journal Template and/or Batch not configured" | Growing Setup missing journal config | Open Growing Setup, set Template and Batch |
| "Item Journal Line already exists" | Leftover lines in journal batch | Open the journal batch and delete all lines |
| "Item Ledger Entry does not exist" or negative inventory | Insufficient inventory in current variant | Check inventory for the item/variant/location. The worksheet entry quantity may exceed available stock. |
| Dimension errors | Journal template has dimension requirements | Verify the template's default dimensions allow the posting |

---

### Stage Dates Not Being Stamped

**Symptoms:** Item Ledger Entries or Production Order Lines have blank "CLE Next Stage Change Date".

**Check:**

1. **Feature toggle:** Verify "Activate Growing Stages" is enabled in Growing Setup
2. **Item variants:** Check that item has variants with "CLE Growing Stage" and "CLE No. of Days" configured
3. **Production Default variant:** For production, verify item has a variant marked as Production Default with growing stage
4. **Purchase receipt config:** Verify "Purch. Receipt Stage Days" is set in Growing Setup (not zero)

**For Production:**
- Date is calculated backward from Due Date using Production Default variant
- If Quotient/Bud variant doesn't have Production Default set, stage tracking won't initialize

**For Purchase:**
- Date is calculated forward from receipt date using Purchase Receipt Stage Days
- If setup value is 0, dates won't be stamped

---

### Wrong Stage Display Names

**Symptoms:** Worksheet or forms show "Stage 1" instead of expected custom names like "Green Bud".

**Check:**

1. **Stage Profile assigned:** Verify item has "CLE Stage Profile Code" set on Item Card
2. **Profile lines exist:** Open the Stage Profile and verify Stage Profile Lines exist for Stage 1/2/3
3. **Display names configured:** Check each Stage Profile Line has a "Display Name" value

**Resolution:**

1. Create Stage Profile if missing (page 50343)
2. Add lines for each stage with custom display names (page 50344)
3. Assign profile to item on Item Card
4. Refresh worksheet or reopen forms to see updated names

## Configuration Reference

### Growing Setup (Table 50078)

| Field | Type | Purpose |
| ------- | ------ | --------- |
| Primary Key | Code[20] | Single-record key |
| Purch. Receipt Stage Days | Integer (min 0) | Default days for purchase receipt stage date calculation |
| Auto Transition to Overgrown | Boolean | Allow job queue to transition Stage 3 to Overgrown |
| Growing Stage Calendar | Code[20] | Base Calendar for non-working day detection |
| Variant Transf. Jrnl. Template | Code[10] | Item Journal Template for reclassification |
| Variant Transf. Jrnl. Batch | Code[10] | Item Journal Batch for reclassification |
| Activate Growing Stages | Boolean | Master feature toggle |

### Grower Stage Wrksheet (Table 50080)

**Table Type:** Temporary (populated at runtime)

**Keys:**

- PK: Entry No.
- PlannedDate: Planned Date, Source Type

**Source Type values:** ILE (0), Production (1)

### Stage Profile (Table 50088)

**Keys:**

- PK: Code (Clustered)

**Fields:** Code, Description

### Stage Profile Line (Table 50089)

**Keys:**

- PK: Profile Code, Stage (Clustered)

**Fields:** Profile Code, Stage (Enum), Display Name, No. of Days

**Note:** No. of Days on Stage Profile Line overrides Item Variant's No. of Days when profile is used.

### Enum Values

**CLE Growing Stage (60701):** ' ' (0), Stage 1 (1), Stage 2 (2), Stage 3 (3), Overgrown (10)

**Values 4-9 reserved for future sellable stages.**

**CLE Stage Substitution Option (60702):** ' ' (0), Previous (1), Next (2), No Preference (3)

## Related Files

### Codeunits

- `app/5 Codeunits/Inventory/50129.Codeunit.CLE.GrowingStageManagement.al`
- `app/5 Codeunits/Inventory/50130.Codeunit.CLE.GrowingStageSubscribers.al`
- `app/5 Codeunits/Picking/50132.Codeunit.CLE.ShortageResolution.al`

### Tables

- `app/1 Tables/Inventory/50078.Table.CLE.GrowingSetup.al`
- `app/1 Tables/Inventory/50080.Table.CLE.GrowerStageWrksheet.al` (Temporary)
- `app/1 Tables/Growing/50088.Table.CLE.StageProfile.al`
- `app/1 Tables/Growing/50089.Table.CLE.StageProfileLine.al`

### Pages

- `app/3 Pages/Inventory/50225.Page.CLE.GrowingSetup.al`
- `app/3 Pages/Inventory/50226.Page.CLE.GrowerStageWorksheet.al`
- `app/3 Pages/Growing/50343.Page.CLE.StageProfiles.al` (List)
- `app/3 Pages/Growing/50344.Page.CLE.StageProfileLines.al` (List Part)
- `app/3 Pages/Growing/50345.Page.CLE.StageProfileCard.al` (Card)
- `app/3 Pages/Picking/50337.Page.CLE.ShortageSalesLines.al`

### Enums

- `app/6 Enums/60701.Enum.CLE.GrowingStage.al`
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
