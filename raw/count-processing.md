# Count Processing - Manager Guide

## Overview

Count Processing is **Phase 4** of the counting system - where submitted counts are automatically evaluated and either posted as adjustments or escalated for review.

**Last Updated:** February 10, 2026

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
   Archive Line             ↓                   ↓
                    Process Recount       Approve/Reject
                            ↓                   ↓
                       Auto-Post          Manual Post
                       Archive          or Additional Recount
```

## Deviation Thresholds

### Three Threshold Levels

System evaluates counted quantity vs expected quantity using percentage deviation and absolute quantity deviation.

#### Level 1: Acceptable Range (Auto-Post)

**Criteria:**
- Deviation within configured acceptable percentage
- AND deviation within configured acceptable absolute quantity

**Example thresholds:**
- Percentage: ≤5%
- Absolute: ≤10 units

**System action:**
1. Calculates adjustment needed
2. Posts adjustment automatically
3. Updates inventory records
4. Archives count line
5. Creates history entry

**No human intervention needed**

---

#### Level 2: Recount Range (First Recount)

**Criteria:**
- Deviation exceeds acceptable range
- BUT within recount range
- AND this is first count (not already a recount)

**Example thresholds:**
- Percentage: >5% and ≤15%
- Absolute: >10 and ≤50 units

**System action:**
1. Changes status from "Counted" to "Recount Request"
2. Resets to "Prepared" status
3. Goes through release cycle again
4. Appears on staff count sheet again
5. Marked as recount (staff knows to count carefully)

**Staff recounts item**

---

#### Level 3: Assistance Range (Supervisor Required)

**Criteria:**
- Deviation exceeds recount range
- OR this is already a recount with high deviation

**Example thresholds:**
- Percentage: >15%
- Absolute: >50 units
- OR second count still has >5% deviation

**System action:**
1. Changes status to "Assistance Required"
2. Appears on Inventory Count Posting page (50127)
3. Waits for supervisor review
4. No automatic posting
5. Creates notification/alert

**Supervisor reviews and approves/rejects**

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

## Processing Details

### Calculating Adjustment

**Formula:**
```
Quantity Adjustment = Counted Quantity - Expected Quantity
```

**Positive adjustment:** Found more than expected  
**Negative adjustment:** Found less than expected  
**Zero adjustment:** Count matched expected (perfect)

**Absolute Deviation:**
```
ABS(Quantity Adjustment)
```

**Percentage Deviation:**
```
IF Expected Quantity = 0:
  Percentage = 100% (if counted > 0)
ELSE:
  Percentage = (ABS(Quantity Adjustment) / Expected Quantity) × 100
```

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

### Posting Adjustments

**For acceptable deviations (auto-post):**

**Source: Inventory (Bin Content)**
1. Creates Item Journal entry
2. Adjustment type
3. Posts to increase or decrease inventory
4. Updates bin content records
5. Creates item ledger entry

**Source: Production Order**
1. Creates Consumption Journal entry
2. Adjusts remaining quantity to produce
3. Posts to production order
4. Updates production order status
5. May adjust material consumption

**Source: Physical Inventory Journal**
1. Posts to Physical Inventory Journal
2. Creates physical inventory ledger entry
3. Full audit trail
4. Used for compliance reporting

### Archiving Completed Counts

**After successful posting:**

1. Status changes to "Archived"
2. Archive DateTime recorded
3. Final history entry created
4. Line removed from active views
5. Retained for reporting/audit

**Archive retention:**
- Kept indefinitely for audit
- Can be purged after configured period
- History table maintains full activity log

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

**Small deviation on recount:**
- If within acceptable range → Auto-post
- Archive line
- Completed

**Medium deviation on recount:**
- If still moderate deviation → Assistance Required
- Escalate to supervisor
- Two counts with different results = needs review

**Large deviation on recount:**
- Assistance Required
- Supervisor must review
- Significant discrepancy needs investigation

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

### Viewing History

**From count line:**
1. Open Inventory Count Preparation or Posting page
2. Select count line
3. Click "History" or "Show History" action
4. View all activities for this line

**From history table:**
1. Open CLE Count Line History
2. Filter by Item No, Location, User ID, Date Range
3. See all historical activities

## Performance Monitoring

### Key Metrics

#### 1. First Count Acceptance Rate
**Formula:** (Auto-posted counts / Total first counts) × 100  
**Target:** >95%  
**Indicates:** Overall counting accuracy

**What it means:**
- High rate (>95%): Good accuracy, staff well-trained
- Medium rate (85-95%): Acceptable, some training needed
- Low rate (<85%): Issues with accuracy or thresholds

#### 2. Recount Rate
**Formula:** (Recounts requested / Total counts) × 100  
**Target:** <5%  
**Indicates:** Frequency of moderate deviations

**What it means:**
- Low rate (<5%): Thresholds appropriate, good accuracy
- Medium rate (5-10%): Review thresholds or training
- High rate (>10%): Thresholds too tight or accuracy issues

#### 3. Assistance Rate
**Formula:** (Assistance required / Total counts) × 100  
**Target:** <1%  
**Indicates:** Frequency of major discrepancies

**What it means:**
- Low rate (<1%): Excellent, rare major issues
- Medium rate (1-3%): Review significant problems
- High rate (>3%): Major accuracy or system issues

#### 4. Average Processing Time
**Formula:** Average minutes from Counted to Archived  
**Target:** <5 minutes  
**Indicates:** System processing efficiency

**What it means:**
- Fast (<5 min): System responsive, automation working
- Medium (5-15 min): Acceptable, monitor for trends
- Slow (>15 min): Processing bottleneck, investigate

#### 5. Adjustment Value by Type
**Tracking:** Total $ value of adjustments (positive and negative)  
**Review:** Weekly/monthly  
**Indicates:** Financial impact of inventory discrepancies

**What it means:**
- Low total: Good inventory accuracy
- Consistent positive: Under-counting or receiving issues
- Consistent negative: Over-counting or picking issues
- High volatility: Investigate root causes

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

**Trend charts:**
- Daily acceptance rate
- Weekly recount rate
- Monthly adjustment value
- Counter performance

## Troubleshooting

### Counts Not Processing

**Problem:** Lines stuck in "Counted" status

**Check:**
1. **Job queue running?**
   - Open Job Queue Entries
   - Find "CLE Process Incoming Counts"
   - Status = Ready?
   - Last run recent (<1 minute)?
   - Error message?

2. **Lines actually counted?**
   - Check Quantity Counted field populated
   - Check Status = "Counted"
   - Check Count DateTime exists

3. **Processing errors?**
   - Review system event log
   - Check for posting errors
   - Review item ledger entries

**Solutions:**
- Restart job queue if stopped
- Clear error and retry
- Review posting setup (item journal template, etc.)
- Check permissions for posting

---

### High Recount Rate

**Problem:** Too many counts requiring recounts

**Possible causes:**

**Thresholds too tight:**
- Review acceptable percentage
- Review acceptable absolute quantity
- Compare to industry standards
- Seasonal factors

**Counting accuracy issues:**
- Staff training needed
- Bin organization poor
- Insufficient time for counting
- Difficult items (small, similar appearance)

**System data issues:**
- Bin content not updated
- Recent movements not posted
- Timing of counts vs activity

**Solutions:**
1. Analyze recount patterns (which items, which staff, which locations)
2. Adjust thresholds if appropriate
3. Provide counter training if needed
4. Review bin content accuracy
5. Coordinate count timing with activity

---

### Adjustments Not Posting

**Problem:** Acceptable counts not posting adjustments

**Check:**
1. **Item journal setup:**
   - Template exists
   - Batch exists
   - Posting setup correct

2. **Permissions:**
   - Process job has posting permissions
   - Item ledger entry permissions
   - Bin content modification permissions

3. **Item setup:**
   - Item not blocked
   - Inventory posting group assigned
   - Costing method set

**Solutions:**
- Configure item journal template/batch
- Grant necessary permissions
- Fix item setup issues
- Review posting errors in event log

---

### Processing Too Slow

**Problem:** Takes long time to process counts

**Causes:**
- Large batch of counts
- Complex posting logic
- System performance issues
- Job queue frequency too low

**Solutions:**
1. Check job queue frequency (should be 1 minute)
2. Review processing batch size (limit if needed)
3. Monitor system performance during processing
4. Consider processing during off-peak hours for large batches
5. Optimize posting procedures if custom logic added

---

### Wrong Threshold Applied

**Problem:** Count evaluated with wrong deviation threshold

**Causes:**
- Count type configuration incorrect
- Item category not matching expected
- Default threshold not appropriate
- Configuration hierarchy wrong

**Solutions:**
1. Review threshold configuration hierarchy:
   - Item category specific
   - Count type specific
   - Default
2. Verify item assigned to correct category
3. Check count type on line
4. Adjust threshold configuration

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

## Integration Points

### Item Ledger
- Adjustment entries created
- Full audit trail maintained
- Costing impact recorded

### Bin Content
- Quantities updated
- Location tracking maintained
- Warehouse management sync

### Production Orders
- Remaining quantity adjusted
- Consumption recorded
- Scrap/waste tracked

### Financial Reporting
- Inventory valuation updated
- COGS impact (if needed)
- Variance analysis data

---

## Related documents

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-release]]
- [[understanding-count-types]]
- [[counting-exception-handling]]

---

*For exception handling (assistance required), see exception-handling.md. For previous phase, see count-release.md.*
