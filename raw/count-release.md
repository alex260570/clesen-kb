# Count Release - Manager Guide

## Overview

Count Release is **Phase 2** of the counting system - where prepared count lines are validated and made visible to warehouse staff for counting.

**Last Updated:** February 10, 2026

## Automated Release

### How It Works

**Codeunit:** 50115 CLE Release Count  
**Job Queue:** Every 1 minute  
**Purpose:** Validate and release prepared count lines

The system runs every minute, finds all "Prepared" count lines, validates them, and changes status to "Released" if validation passes.

### Release Validation Checks

Before releasing a count line, system validates:

#### 1. Bin Code Exists

**Check:** Bin code must exist in Bin table  
**Why:** Can't count non-existent bin  
**If fails:** Line stays Prepared, error logged

#### 2. No Duplicate Active Counts

**Check:** Same item + location + bin can't have another active count  
**Active = Status:** Prepared, Released, or Counted  
**Why:** Prevents counting same item twice simultaneously  
**If fails:** Line stays Prepared until other count completes

#### 3. Supermarket Exclusion

**Check:** Location code must NOT be supermarket location  
**Why:** Supermarket has separate handling (master picks)  
**If fails:** Line deleted (shouldn't have been prepared)

#### 4. No Recent Picking Activity

**Check:** Zone must NOT have been picked in last 4 hours  
**Why:** Prevents counting while inventory moving  
**If fails:** Line stays Prepared, will retry after delay passes  
**Integration:** Codeunit 50116 resets Released lines when picking starts

#### 5. No Expected Purchase Receipts

**Check:** No purchase receipts expected for this item/location soon  
**Why:** Wait for receipts to post before counting  
**If fails:** Line stays Prepared, will release after receipt posts  
**Configuration:** "Soon" = within system-configured timeframe

### What Happens on Release

**Status change:** Prepared → Released

**System actions:**

1. Updates Status field to "Released"
2. Sets Release DateTime stamp
3. Sets Released By user ID
4. Calculates final priority
5. Makes visible on staff count sheets
6. Creates history entry

**Staff sees:**
- Line appears on Inventory Count Lines page (50125)
- Sorted by Priority, Location, Bin
- Ready for physical counting

## Release Timing

### Normal Flow

**Typical timing:**
1. Prepared at 08:00 (automated job)
2. Released at 08:01 (next minute after preparation)
3. Staff counts during 08:00-12:00 shift
4. Processed at count submission

**Fast release:**
- Usually 1 minute after preparation
- If validations pass immediately
- No delays or blocks

### Delayed Release

**Common delay reasons:**

#### Recent Picking (4-hour delay)
**Scenario:** Zone picked at 07:30, count prepared at 08:00  
**Result:** Won't release until 11:30 (4 hours after pick)  
**Why:** Let picking activity complete and settle  
**Monitor:** Check last pick date on location/zone

#### Expected Receipts (until receipt posts)
**Scenario:** Purchase receipt expected today for item  
**Result:** Won't release until receipt posted  
**Why:** Count should include received items  
**Monitor:** Check expected receipts in purchasing

#### Duplicate Count Active
**Scenario:** Same item already being counted  
**Result:** Won't release until first count completes  
**Why:** Can't count same thing twice  
**Monitor:** Check for existing Released/Counted lines

#### Bin Validation Failure
**Scenario:** Bin code doesn't exist in system  
**Result:** Never releases (needs correction)  
**Why:** Can't count non-existent location  
**Fix:** Correct bin code or create bin

## Picking Integration

### How Picking Affects Counting

**Codeunit 50116:** CLE Count Line Reset

**Triggered by:** Master picking codeunits when picking starts

**What it does:**
1. When zone starts picking, finds all Released count lines for that zone
2. Changes status from Released back to Prepared
3. Sets "Last Pick DateTime" on location/zone record
4. Lines will re-release 4 hours after picking completes

**Why this matters:**
- Prevents counting while inventory moving
- Ensures count accuracy
- Avoids conflicting transactions

**Example scenario:**
```
08:00 - Count line released for Zone A, Bin 101
08:15 - Picking starts in Zone A
08:15 - Count line reset to Prepared (Codeunit 50116)
09:30 - Picking completes
13:30 - Count line re-released (4 hours after pick)
```

### Coordinating with Picking

**Best practices:**

✓ **Check picking schedule** - Know when zones are picked  
✓ **Release between picking runs** - Morning pick = afternoon count  
✓ **Physical inventory requires freeze** - No picking during full count  
✓ **Communicate with picking manager** - Coordinate location counts  

**Dashboard view:**
- Check "Last Pick Date/Time" on location records
- See which zones are safe to count
- Identify 4-hour delay windows

## Purchase Receipt Integration

### How Receipts Affect Counting

**Release delayed if:**
- Purchase order exists for item
- Expected receipt date is today or tomorrow
- PO not yet received and invoiced

**Why delay:**
- Receipt will change inventory quantity
- Better to count AFTER receipt included
- Prevents immediate recount need

**Example scenario:**
```
08:00 - Count line prepared for Item X
08:01 - System checks: PO receipt expected today for Item X
08:01 - Count line stays Prepared (not released)
10:30 - PO receipt posted
10:31 - Next release job finds line, receipt complete
10:31 - Count line released
```

### Overriding Receipt Delay

**When to override:**
- Receipt significantly delayed
- Urgent need to count
- Receipt is minor quantity

**How to override:**
1. Check purchase order status
2. If receipt won't post soon, contact purchasing
3. Have them close/cancel expected receipt
4. Count line will release next minute

## Manual Release Control

### When to Manually Control Release

**Scenarios:**
- Physical inventory coordination
- Specific timing needed
- Troubleshooting release issues
- Training new counters

### Preventing Release

**If you need to hold lines:**
1. Keep status as Prepared
2. Don't let automated job release them
3. Option: Temporarily disable release job queue

**Use cases:**
- Physical inventory scheduled for specific time
- Waiting for warehouse reorganization
- Staff not available yet
- Coordination with other departments

### Forcing Early Release

**If validation blocking but you need to release:**

**Option 1: Fix validation issue**
- Correct bin code
- Complete expected receipt
- Wait for picking delay
- Remove duplicate count

**Option 2: Manual status change** (use carefully)
- Change Status field to Released manually
- Bypasses validation checks
- Only if you're certain validation is false positive
- Document reason in notes

**Caution:** Manual status change bypasses safety checks - use only when necessary

## Monitoring Release

### Daily Monitoring

**Key questions:**

1. **How many lines waiting to release?**
   - Check count of Prepared lines
   - Should be small number
   - Large number = potential bottleneck

2. **Any lines stuck in Prepared?**
   - Lines older than 1 hour in Prepared status
   - Check validation failures
   - Review error logs

3. **Job queue running?**
   - CLE Release Count entry
   - Last run within 1 minute
   - No errors

4. **Picking delays affecting release?**
   - Check locations with recent picks
   - Expected 4-hour delays
   - Normal or excessive?

### Dashboard View

**Page 50199:** CLE Counting Dashboard

**Metrics to watch:**
- Prepared Lines: Should be low (<50 typically)
- Released Lines: Indicates counting workload
- Release Rate: Lines released per hour
- Average Time to Release: Minutes from Prepared to Released

**Alerts:**
- High count of Prepared lines (bottleneck)
- No releases in last hour (job queue issue)
- Lines prepared days ago (validation failures)

### Job Queue Health

**Job Queue Entry:** CLE Release Count

**Check:**
1. Status = Ready (must be active)
2. Last Run Date/Time (within 1 minute)
3. Next Run Date/Time (should be ~1 minute away)
4. Error Message (should be blank)
5. No. of Minutes between Runs = 1

**If job not running:**
1. Check status - set to Ready if not
2. Restart job queue service if needed
3. Review error log
4. Test manual run

**Manual run test:**
1. Open Job Queue Entry
2. Click "Run Once"
3. Check results
4. Review any errors

## Troubleshooting

### Lines Not Releasing

**Step 1: Check job queue**
- Is CLE Release Count running?
- Status = Ready?
- Last run recent?
- Any errors?

**Step 2: Check validation failures**

**Bin code issue:**
```
Open Inventory Count Preparation
Filter: Status = Prepared
For each line:
  Check if Bin Code exists in Bin table
  If not: Correct bin code or create bin
```

**Picking delay:**
```
Check Last Pick Date/Time on location
If within 4 hours: Expected delay
If older: Possible integration issue
```

**Expected receipt:**
```
Check Purchase Orders for item
Filter: Expected Receipt Date = today or tomorrow
If exists: Normal delay, wait for receipt
If no PO: Configuration issue
```

**Duplicate count:**
```
Open Inventory Count Preparation
Filter: Item No + Location + Bin
Check for multiple lines with Status = Released or Counted
If found: Duplicate, resolve by completing or deleting one
```

**Step 3: Review line details**
- Open specific line
- Check Status, Error Message fields
- Review history (shows validation attempts)
- Check integration fields

---

### Release Job Queue Not Running

**Problem:** CLE Release Count job queue entry stopped

**Check:**
1. Job Queue Entry status
2. Error message field
3. System event log
4. Job queue service status (IT/admin)

**Solutions:**
- Set Status to Ready
- Clear error message
- Restart job queue service
- Review permissions
- Check for system errors

---

### Too Many Lines in Prepared

**Problem:** Large backlog of Prepared lines

**Causes:**
- Release validations failing
- Job queue not running frequently enough
- Preparation rate exceeds release rate
- Widespread validation issues (e.g., many bad bin codes)

**Solutions:**
1. Check job queue running every 1 minute (not longer)
2. Review validation failures (common issue?)
3. Fix root cause (bin codes, picking timing, etc.)
4. Temporarily pause preparation if needed

---

### Lines Released During Picking

**Problem:** Counts released even though picking active

**Causes:**
- Picking integration not working
- Codeunit 50116 not being called
- Last Pick DateTime not updating
- 4-hour delay already passed

**Solutions:**
1. Verify Codeunit 50116 called from picking codeunits
2. Check Last Pick DateTime on location/zone records
3. Review picking manager settings
4. Test integration with sample pick
5. May need developer assistance

---

### Wrong Items Being Released

**Problem:** Unexpected count lines appearing

**Causes:**
- Preparation logic creating wrong lines
- Count type configuration incorrect
- Manual counts triggered unintentionally
- Duplicate prevention not working

**Solutions:**
1. Review prepared lines before they release
2. Check count type configuration
3. Review preparation logic
4. Delete incorrect prepared lines before release

## Performance Optimization

### Job Queue Frequency

**Current:** Every 1 minute

**Tradeoffs:**
- **More frequent (30 seconds):** Faster release, more system load
- **Less frequent (5 minutes):** Less system load, slower release

**Recommendation:** Keep at 1 minute unless performance issues

### Release Batch Size

**Current:** All eligible lines processed each run

**If performance issues:**
- Limit batch size to process (e.g., 100 lines per run)
- Prevents timeout on very large release jobs
- Lines process over multiple runs

**Configuration:** In Codeunit 50115

### Peak Time Coordination

**Busy periods:**
- After overnight preparation (08:00-09:00)
- After production order updates
- Before/after picking times

**Optimization:**
- Ensure job queue responsive during peaks
- Monitor release performance
- Adjust preparation timing if needed

## Best Practices

### Configuration

✓ **Keep job queue at 1 minute frequency** - Responsive release  
✓ **Monitor validation rules** - Ensure appropriate, not too strict  
✓ **Configure picking integration properly** - Avoid counting during picks  
✓ **Set realistic receipt delay windows** - Balance timeliness vs accuracy  

### Operations

✓ **Review Prepared lines daily** - Catch validation issues early  
✓ **Monitor release dashboard** - Identify bottlenecks  
✓ **Coordinate with picking schedule** - Plan count timing  
✓ **Fix validation failures promptly** - Don't let issues accumulate  

### Troubleshooting

✓ **Check job queue first** - Most common issue  
✓ **Review validation logic** - Understand why lines not releasing  
✓ **Use dashboard metrics** - Data-driven problem solving  
✓ **Document recurring issues** - Pattern identification  

## Integration Summary

**Picking System:**
- Codeunit 50116 resets Released lines when picking starts
- 4-hour delay after picking completes
- Prevents inventory movement during counting

**Purchasing:**
- Expected receipts delay release
- Wait for receipts to post
- Ensures count includes received items

**Production:**
- Production order counts released separately
- Source is production order, not bin
- Updates remaining quantity to produce

**Warehouse Management:**
- Bin validation before release
- Location-specific assignments
- Zone filtering for count sheets

---

## Related documents

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[understanding-count-types]]
- [[count-processing]]
- [[counting-exception-handling]]

---

*For previous phase (preparation), see count-preparation.md. For next phase (processing), see count-processing.md.*
