# Counting Dashboard - Manager Guide

## Overview

The Counting Dashboard provides real-time monitoring, statistics, and control for the entire inventory counting system.

**Page:** 50199 CLE Counting Dashboard  
**Access:** Inventory → Counting Dashboard  
**Last Updated:** February 10, 2026

## Dashboard Layout

### Top Section: Quick Stats

**Real-time count summaries:**

**Active Counts:**
- Prepared: Lines waiting to be released
- Released: Lines available for staff to count
- Counted: Lines waiting to be processed
- Assistance Required: Lines needing supervisor review

**Today's Activity:**
- Total counts submitted today
- Auto-posted (acceptable deviation)
- Recounts requested
- Exceptions escalated
- Total adjustment value ($)

**Performance Indicators:**
- Acceptance rate (% auto-posted)
- Recount rate (% needing recount)
- Assistance rate (% needing supervisor)
- Average time to complete count

### Middle Section: Job Queue Status

**Three job queue entries:**

**1. CLE Prepare Auto Item Count**
- Status indicator (Running / Stopped / Error)
- Last run date/time
- Next run date/time (should be ≤2 hours away)
- Error message (if any)
- Manual trigger button

**2. CLE Release Count**
- Status indicator (Running / Stopped / Error)
- Last run date/time
- Next run date/time (should be ≤1 minute away)
- Error message (if any)
- Manual trigger button

**3. CLE Process Incoming Counts**
- Status indicator (Running / Stopped / Error)
- Last run date/time
- Next run date/time (should be ≤1 minute away)
- Error message (if any)
- Manual trigger button

### Bottom Section: Charts and Trends

**Chart 1: Daily Acceptance Rate (Last 30 Days)**
- Line chart showing % of first counts auto-posted
- Target line at 95%
- Trend indicator
- Identifies accuracy patterns

**Chart 2: Count Volume by Type**
- Bar chart showing count distribution
- By count type (2 Weeks Ship, Ready Count, etc.)
- Helps understand workload composition
- Identifies heavy count types

**Chart 3: Counter Performance**
- Table/chart showing accuracy by counter
- User ID, counts submitted, acceptance rate
- Identifies training needs
- Recognizes top performers

**Chart 4: Adjustment Value Trend**
- Line chart of daily total adjustment value ($)
- Positive and negative separate
- Net adjustment
- Financial impact visibility

## Quick Actions

### Manual Job Triggers

**Located in Job Queue Status section:**

**Prepare Counts Now**
- Triggers Codeunit 50108 immediately
- Creates new count lines based on current rules
- Use when: Need counts outside scheduled time

**Release Counts Now**
- Triggers Codeunit 50115 immediately
- Releases all prepared lines (if validation passes)
- Use when: Want immediate release without waiting

**Process Counts Now**
- Triggers Codeunit 50111 immediately
- Processes all counted/recounted lines
- Use when: Need immediate processing

**Restart All Jobs**
- Restarts all three job queue entries
- Use when: Jobs stopped or having errors
- Resets error states

### Navigation Shortcuts

**Buttons at top:**

**Open Count Preparation**
- Opens Page 50126 Inventory Count Preparation
- Quick access to review prepared lines

**Open Count Posting**
- Opens Page 50127 Inventory Count Posting
- Quick access to exception handling

**Open Count Setup**
- Opens Page 50202 Counting Setup
- Quick access to configuration

**Open Count Sheet**
- Opens Page 50125 Inventory Count Lines
- View what staff sees

**View All History**
- Opens Table 50069 History filtered to today
- Quick audit trail view

## Monitoring Daily Operations

### Morning Checklist

**Every morning (8:00-9:00 AM):**

1. **Check overnight automation:**
   - ✓ Preparation job ran overnight
   - ✓ New count lines created
   - ✓ Expected count volume

2. **Review Prepared lines:**
   - How many waiting for release?
   - Any stuck >1 hour?
   - Expected count types present?

3. **Check job queue health:**
   - All three jobs "Running" status
   - No error messages
   - Last run times reasonable

4. **Review yesterday's performance:**
   - Acceptance rate target met (>95%)?
   - Any unusual patterns?
   - High-value adjustments?

5. **Check exceptions queue:**
   - Any Assistance Required from yesterday?
   - Need immediate attention?

### Throughout the Day

**Quick checks (every 2-4 hours):**

1. **Count progress:**
   - Released lines being counted?
   - Counted lines being processed?
   - Lines moving through workflow?

2. **Exception buildup:**
   - Assistance Required growing?
   - Need supervisor review?

3. **Job queue monitoring:**
   - All jobs still running?
   - Any new errors?

### End of Day Review

**Every evening (4:00-5:00 PM):**

1. **Today's statistics:**
   - Total counts completed
   - Acceptance rate
   - Adjustment value
   - Compare to targets

2. **Pending work:**
   - Exceptions need review tomorrow?
   - Prepared lines for tomorrow?
   - Any alerts or issues?

3. **Performance notes:**
   - Any problems today?
   - Staff feedback needed?
   - System improvements identified?

## Performance Targets

### Key Performance Indicators (KPIs)

#### Acceptance Rate
**Target:** >95%  
**Formula:** (Auto-posted / Total first counts) × 100  
**Meaning:** Percentage of counts accurate on first attempt  

**Dashboard indicator:**
- Green (>95%): Excellent
- Yellow (90-95%): Acceptable
- Red (<90%): Needs attention

**If below target:**
- Review threshold configuration
- Check for counting accuracy issues
- Analyze patterns by counter, item, location
- Consider staff training

#### Recount Rate
**Target:** <5%  
**Formula:** (Recounts requested / Total counts) × 100  
**Meaning:** Percentage of counts requiring second attempt  

**Dashboard indicator:**
- Green (<5%): Excellent
- Yellow (5-10%): Monitor
- Red (>10%): Needs attention

**If above target:**
- Review whether thresholds too tight
- Check for systemic issues
- Analyze recount patterns
- Staff training if accuracy issue

#### Assistance Rate
**Target:** <1%  
**Formula:** (Assistance required / Total counts) × 100  
**Meaning:** Percentage requiring supervisor review  

**Dashboard indicator:**
- Green (<1%): Excellent
- Yellow (1-3%): Acceptable
- Red (>3%): Needs attention

**If above target:**
- Review high-value items
- Check for data integrity issues
- Major discrepancies needing investigation
- May indicate systemic problems

#### Average Time to Complete
**Target:** <4 hours from release to archive  
**Meaning:** How quickly counts move through system  

**Dashboard indicator:**
- Green (<4 hours): Excellent
- Yellow (4-8 hours): Acceptable
- Red (>8 hours): Slow

**If above target:**
- Staff workload too high?
- Release timing poor?
- Processing delays?
- Lines stuck at some stage?

#### Adjustment Value
**Target:** Monitor trends (no specific target)  
**Meaning:** Financial impact of inventory adjustments  

**Dashboard shows:**
- Daily total positive adjustments ($)
- Daily total negative adjustments ($)
- Net adjustment ($)
- 30-day trend

**What to watch:**
- Consistently high values (inventory accuracy issue)
- Consistently positive (under-counting/receiving issues)
- Consistently negative (over-counting/picking issues)
- Sudden spikes (investigate cause)

## Alerts and Notifications

### System-Generated Alerts

**High priority (red):**

**Job Queue Stopped**
- One or more jobs not running
- Impact: Automation stopped, manual intervention required
- Action: Restart job immediately

**High Assistance Queue**
- >20 lines requiring supervisor review
- Impact: Exception backlog
- Action: Review and clear exceptions

**Low Acceptance Rate**
- Daily acceptance rate <85%
- Impact: Counting accuracy issues
- Action: Investigate root cause

**Medium priority (yellow):**

**Lines Stuck in Prepared**
- >50 lines prepared but not released >2 hours
- Impact: Release bottleneck
- Action: Check release validation issues

**High Recount Rate**
- Daily recount rate >10%
- Impact: Efficiency concern
- Action: Review thresholds or training

**Job Queue Errors**
- Error messages on job queue entries
- Impact: Partial automation failure
- Action: Review and clear errors

**Low priority (info):**

**High Count Volume**
- >200 lines prepared today
- Impact: Heavy workload
- Action: Monitor staff capacity

**Large Adjustment**
- Single adjustment >$1000
- Impact: Financial impact
- Action: Review for accuracy

### Email Notifications *(Planned)*

**When enabled, system sends emails for:**
- Job queue failures
- High exception queue
- Large adjustments
- Physical inventory completion

**Recipients configured in:** Counting Setup

## Troubleshooting with Dashboard

### Lines Not Moving Through System

**Check dashboard indicators:**

**Many Prepared, few Released:**
- Release job issue
- Click "Release Counts Now" to test
- Check job queue status
- Review validation failures

**Many Released, few Counted:**
- Staff not counting
- Check staff schedules
- Review released lines (correct locations?)
- Talk to warehouse supervisor

**Many Counted, few Processed:**
- Processing job issue
- Click "Process Counts Now" to test
- Check job queue status
- Review processing errors

**Many Assistance Required:**
- Exceptions backing up
- Supervisors need to review
- Open Count Posting page
- Work through exception queue

### Poor Performance Indicators

**Low Acceptance Rate:**

**Dashboard analysis:**
1. View "Counter Performance" chart - specific staff issue?
2. View "Count Volume by Type" - specific count type issue?
3. Check adjustment value trend - data quality issue?
4. Review recent counts - patterns?

**Actions:**
- Drill into counts with deviations
- Analyze by counter, item, location
- Determine if threshold or accuracy issue
- Take corrective action

**High Processing Time:**

**Dashboard analysis:**
1. Check job queue frequency (should be 1 minute)
2. Review count volume (overwhelming system?)
3. Check for processing errors
4. Monitor during peak times

**Actions:**
- Ensure job queue at 1 minute frequency
- Check system performance
- Review processing logic
- Consider batch size limits

### Job Queue Issues

**Dashboard shows job stopped or error:**

**Quick fix:**
1. Click "Restart All Jobs" button
2. Monitor for 5 minutes
3. Check if jobs running again

**If restart doesn't work:**
1. Open Job Queue Entries directly
2. Review detailed error message
3. Check permissions
4. Review event log
5. May need IT/administrator assistance

## Reporting

### Daily Report

**Dashboard provides data for daily report:**
- Counts completed today
- Acceptance rate
- Recount rate
- Assistance rate
- Adjustment value
- Exceptions pending
- Job queue status

**Use for:**
- Management updates
- Tracking against targets
- Identifying issues
- Performance documentation

### Weekly Summary

**Dashboard provides data for weekly report:**
- 7-day trends for all KPIs
- Counter performance summary
- Count type distribution
- Total adjustment values
- Issues and resolutions
- System health

**Use for:**
- Team meetings
- Performance reviews
- Planning improvements
- Budget/staffing analysis

### Monthly Analysis

**Dashboard provides data for monthly analysis:**
- 30-day trends
- Seasonal patterns
- Root cause analysis
- Financial impact
- ROI of counting system
- Improvement opportunities

**Use for:**
- Management reporting
- Strategic planning
- Budget planning
- Process improvement
- Inventory accuracy certification

## Advanced Features

### Drilling Down

**Most dashboard elements are clickable:**

**Click on status counts:**
- "Prepared: 45" → Opens Preparation page filtered to Prepared
- "Released: 120" → Opens Count Sheet filtered to Released
- "Assistance Required: 3" → Opens Posting page

**Click on chart elements:**
- Count type bar → Filter to that count type
- Counter name → Filter to that counter
- Date on trend → Filter to that date

**Use for:**
- Quick investigation
- Detailed analysis
- Immediate action

### Exporting Data

**Dashboard data exportable to Excel:**

**What you can export:**
- All statistics and metrics
- Chart data
- Counter performance
- Count history
- Job queue details

**Use for:**
- Offline analysis
- Custom reporting
- Executive presentations
- Audit documentation

### Custom Views *(Configuration)*

**Dashboard can be customized:**
- Which metrics to show
- Chart types
- Date ranges
- Filters
- Refresh frequency

**Configured by:** System Administrator in page customization

## Best Practices

### Daily Operations

✓ **Check dashboard first thing** - Morning health check  
✓ **Review after lunch** - Midday progress check  
✓ **End of day review** - Daily closeout  
✓ **Act on red alerts immediately** - Don't ignore problems  
✓ **Monitor trends, not just today** - Pattern recognition  

### Performance Management

✓ **Set realistic targets** - Based on your operation  
✓ **Track consistently** - Daily data collection  
✓ **Analyze patterns** - Not just individual incidents  
✓ **Communicate results** - Share with team  
✓ **Celebrate successes** - Recognize good performance  

### System Health

✓ **Job queue is critical** - Keep it running  
✓ **Quick response to errors** - Minimize downtime  
✓ **Understand normal patterns** - Recognize abnormal  
✓ **Proactive monitoring** - Don't wait for problems  
✓ **Document issues** - Learning and improvement  

### Continuous Improvement

✓ **Monthly analysis** - Identify trends  
✓ **Root cause investigation** - Fix underlying issues  
✓ **Process refinement** - Continuous optimization  
✓ **Staff development** - Training and feedback  
✓ **Technology updates** - Leverage new features  

## Dashboard as Management Tool

### Daily Standup

**Use dashboard in daily team meeting:**
- Yesterday's performance
- Today's workload
- Issues to address
- Assignments and priorities

### Performance Reviews

**Use dashboard data for:**
- Individual counter performance
- Team performance trends
- Improvement opportunities
- Recognition and rewards

### Strategic Planning

**Use dashboard insights for:**
- Staffing decisions
- Process improvements
- Technology investments
- Threshold optimization
- Training program development

### Financial Reporting

**Use dashboard data for:**
- Inventory accuracy metrics
- Adjustment impact
- Variance analysis
- Audit support
- Compliance documentation

---

## Related documents

- [[counting-system-overview]]
- [[counting-process]]
- [[count-preparation]]
- [[count-release]]
- [[understanding-count-types]]
- [[count-processing]]
- [[counting-exception-handling]]

---

*For detailed system operation, see other manager guides: counting-system-overview.md, count-preparation.md, count-release.md, count-processing.md, exception-handling.md*
