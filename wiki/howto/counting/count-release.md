---
title: Count Release — Manager Guide
type: howto
tags: [counting, manager, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [count-release.md]
---

# Count Release — Manager's Guide

## Overview

Count Release is **Phase 2** of the counting system - where prepared count lines are validated and made visible to warehouse staff for counting.

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

## Release Timing

### Normal Flow

**Typical timing:**
1. Prepared at 08:00 (automated job)
2. Released at 08:01 (next minute after preparation)
3. Staff counts during 08:00-12:00 shift
4. Processed at count submission

**Fast release:** Usually 1 minute after preparation if validations pass immediately

### Delayed Release

**Common delay reasons:**

**Recent Picking (4-hour delay):**
- Won't release until 4 hours after zone picking

**Expected Receipts:**
- Won't release until receipt posted

**Duplicate Count Active:**
- Won't release until first count completes

**Bin Validation Failure:**
- Never releases (needs correction)

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

### Coordinating with Picking

**Best practices:**
✓ **Check picking schedule** - Know when zones are picked  
✓ **Release between picking runs** - Morning pick = afternoon count  
✓ **Physical inventory requires freeze** - No picking during full count  
✓ **Communicate with picking manager** - Coordinate location counts  

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

## Monitoring Release

### Daily Monitoring

**Key questions:**
1. How many lines waiting to release?
2. Any lines stuck in Prepared?
3. Is job queue running?
4. Are picking delays affecting release?

### Dashboard View

**Page 50199:** CLE Counting Dashboard

**Metrics to watch:**
- Prepared Lines: Should be low (<50 typically)
- Released Lines: Indicates counting workload
- Release Rate: Lines released per hour
- Average Time to Release: Minutes from Prepared to Released

## Troubleshooting

### Lines Not Releasing

**Step 1: Check job queue**
- Is CLE Release Count running?
- Status = Ready?
- Last run recent?

**Step 2: Check validation failures**
- Bin code exists?
- Duplicate active count?
- Picking delay active?
- Expected receipt pending?

**Step 3: Review line details**
- Check Status, Error Message fields
- Review history (shows validation attempts)

## Performance Optimization

### Job Queue Frequency
**Current:** Every 1 minute
**Recommendation:** Keep at 1 minute unless performance issues

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

✓ **Keep job queue at 1 minute frequency** - Responsive release  
✓ **Monitor validation rules** - Ensure appropriate, not too strict  
✓ **Configure picking integration properly** - Avoid counting during picks  
✓ **Set realistic receipt delay windows** - Balance timeliness vs accuracy  
✓ **Review Prepared lines daily** - Catch validation issues early  
✓ **Monitor release dashboard** - Identify bottlenecks  
✓ **Coordinate with picking schedule** - Plan count timing  

## Related Pages

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-processing]]
- [[counting-exceptions]]
- [[understanding-count-types]]
