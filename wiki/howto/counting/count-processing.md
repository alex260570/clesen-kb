---
title: Count Processing — Manager Guide
type: howto
tags: [counting, manager, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [count-processing.md]
---

# Count Processing — Manager's Guide

## Overview

Count Processing is **Phase 4** of the counting system - where submitted counts are automatically evaluated and either posted as adjustments or escalated for review.

## Automated Processing

### How It Works

**Codeunit:** 50111 CLE Process Incoming Counts  
**Job Queue:** Every 1 minute  
**Purpose:** Process counts submitted by warehouse staff

The system runs every minute, finds all "Counted" or "Recounted" lines, evaluates deviation from expected quantity, and takes appropriate action.

### Processing Logic Flow

```
Staff submits count → Status changes to "Counted"
                            ↓
            Process job runs (every 1 minute)
                            ↓
            Calculate deviation from expected
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   Small Deviation    Medium Deviation    Large Deviation
        ↓                   ↓                   ↓
   Auto-Post           Request Recount    Assistance Required
   Adjustment                ↓                  ↓
        ↓              Staff Recounts      Supervisor Reviews
                             ↓                   ↓
                        Auto-Post          Approve/Reject
                        Archive          or Additional Recount
```

## Deviation Thresholds

### Three Threshold Levels

System evaluates counted quantity vs expected quantity using percentage deviation and absolute quantity deviation.

#### Level 1: Acceptable Range (Auto-Post)

**Criteria:**
- Deviation within configured acceptable percentage (e.g., ≤5%)
- AND deviation within configured acceptable absolute quantity (e.g., ≤10 units)

**System action:**
1. Calculates adjustment needed
2. Posts adjustment automatically
3. Updates inventory records
4. Archives count line
5. Creates history entry

**No human intervention needed**

#### Level 2: Recount Range (First Recount)

**Criteria:**
- Deviation exceeds acceptable range (e.g., >5% and ≤15%)
- AND this is first count (not already a recount)

**System action:**
1. Changes status from "Counted" to "Recount Request"
2. Resets to "Prepared" status
3. Goes through release cycle again
4. Appears on staff count sheet again
5. Marked as recount (staff knows to count carefully)

#### Level 3: Assistance Range (Supervisor Required)

**Criteria:**
- Deviation exceeds recount range (e.g., >15%)
- OR this is already a recount with high deviation

**System action:**
1. Changes status to "Assistance Required"
2. Appears on Inventory Count Posting page (50127)
3. Waits for supervisor review
4. No automatic posting
5. Creates notification/alert

### Configuring Thresholds

**Where:** Counting Setup (Page 50202)

**Configuration levels:**
- Default thresholds (apply to all)
- Count type specific thresholds
- Item category specific thresholds

**Best practices:**
- Tighter thresholds for high-value items
- Looser thresholds for low-value items
- Seasonal adjustments (busy season = more variance)
- Review monthly and adjust based on recount rates

## Calculating Adjustments

**Formula:**
```
Quantity Adjustment = Counted Quantity - Expected Quantity
```

**Positive adjustment:** Found more than expected  
**Negative adjustment:** Found less than expected  
**Zero adjustment:** Count matched expected (perfect)

### Special Case: Expected Zero

**Scenario:** Expected quantity = 0, but counted quantity > 0

**Evaluation:**
- Absolute deviation = counted quantity
- Percentage deviation = 100% (or configured value)
- Usually triggers recount or assistance
- Finding inventory where none expected is significant

**Why it matters:**
- May indicate receiving not posted
- Items in wrong location
- Ghost inventory
- Data integrity issue

## Recount Process

### First Recount

**Triggered when:**
- First count deviation in recount range
- System automatically requests recount

**Process:**
1. Status: Counted → Recount Request → Prepared
2. Release validation runs again
3. Released to staff (shows as "Recount")
4. Staff counts again (more carefully)
5. Submits second count
6. Processing evaluates recount

**Staff experience:**
- Same line appears again
- Marked as "Recount" so they know it's second attempt
- May show first counted quantity for reference
- Expected quantity still shown

### Processing Recounts

**Evaluation criteria:**

**Small deviation on recount:** → Auto-post, Archive line, Completed

**Medium deviation on recount:** → Assistance Required, Escalate to supervisor

**Large deviation on recount:** → Assistance Required, Supervisor must review

### Recount Limits

**Maximum recounts:** Configurable (typically 1 or 2)

**After limit reached:**
- Automatically escalates to Assistance Required
- No more automatic recounts
- Supervisor must intervene
- Prevents infinite recount loops

## History Tracking

### Activity Log

**Table 50069:** CLE Count Line History

**Records every action:**
- Line created (Prepared)
- Line released (Released)
- Count submitted (Counted)
- Recount requested (Recount Request)
- Adjustment posted (Archived)
- Assistance requested
- Supervisor actions

**Each entry includes:**
- User ID (who performed action)
- DateTime (when action occurred)
- Old Status → New Status
- Quantity values (expected, counted, adjustment)
- Notes/comments

**Use cases:**
- Audit trail for financial reporting
- Performance analysis (counter accuracy)
- Troubleshooting discrepancies
- Training feedback

## Performance Metrics

### Key Metrics

**1. First Count Acceptance Rate**
- Formula: (Auto-posted counts / Total first counts) × 100
- Target: >95%
- Indicates: Overall counting accuracy

**2. Recount Rate**
- Formula: (Recounts requested / Total counts) × 100
- Target: <5%
- Indicates: Frequency of moderate deviations

**3. Assistance Rate**
- Formula: (Assistance required / Total counts) × 100
- Target: <1%
- Indicates: Frequency of major discrepancies

**4. Average Processing Time**
- Formula: Average minutes from Counted to Archived
- Target: <5 minutes
- Indicates: System processing efficiency

**5. Adjustment Value by Type**
- Tracking: Total $ value of adjustments
- Review: Weekly/monthly
- Indicates: Financial impact of inventory discrepancies

### Dashboard Reports

**Page 50199:** CLE Counting Dashboard

**Real-time metrics:**
- Counts processed today
- Acceptance rate (%)
- Recount rate (%)
- Assistance rate (%)
- Average processing time
- Total adjustment value
- Lines by status

## Troubleshooting

### Counts Not Processing

**Problem:** Lines stuck in "Counted" status

**Check:**
1. Is job queue running? (CLE Process Incoming Counts)
2. Are lines actually counted? (Quantity Counted field populated)
3. Any processing errors? (Check system event log)

**Solutions:**
- Restart job queue if stopped
- Clear error and retry
- Review posting setup
- Check permissions for posting

### High Recount Rate

**Problem:** Too many counts requiring recounts

**Possible causes:**
- Thresholds too tight
- Counting accuracy issues
- System data issues

**Solutions:**
1. Analyze recount patterns
2. Adjust thresholds if appropriate
3. Provide counter training if needed
4. Review bin content accuracy
5. Coordinate count timing with activity

### Adjustments Not Posting

**Problem:** Acceptable counts not posting adjustments

**Check:**
1. Item journal setup correct?
2. Permissions sufficient?
3. Item setup correct?

**Solutions:**
- Configure item journal template/batch
- Grant necessary permissions
- Fix item setup issues

## Best Practices

### Configuration

✓ **Set realistic thresholds** - Based on item value and turnover  
✓ **Use three-tier approach** - Acceptable, Recount, Assistance  
✓ **Configure by item category** - High-value tighter, low-value looser  
✓ **Review thresholds quarterly** - Adjust based on performance  

### Monitoring

✓ **Check dashboard daily** - Quick health check  
✓ **Review metrics weekly** - Identify trends  
✓ **Analyze recount patterns** - Root cause analysis  
✓ **Track adjustment values** - Financial impact awareness  

### Optimization

✓ **Keep job queue at 1 minute** - Responsive processing  
✓ **Archive old counts periodically** - Maintain performance  
✓ **Limit recount cycles** - Prevent infinite loops  
✓ **Document threshold rationale** - Future reference  

### Quality

✓ **Investigate assistance requests promptly** - Don't let queue build  
✓ **Provide feedback to counters** - Performance improvement  
✓ **Review high-value adjustments** - Even if auto-posted  
✓ **Maintain audit trail** - Compliance and analysis  

## Related Pages

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-release]]
- [[counting-exceptions]]
- [[understanding-count-types]]
