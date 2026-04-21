---
title: Counting Dashboard — Manager Guide
type: howto
tags: [counting, inventory-counting, manager, monitoring, real-time-analytics]
created: 2026-04-21
updated: 2026-04-21
sources: [counting-dashboard.md]
---

# Counting Dashboard — Manager Guide

Real-time monitoring and control center for the entire inventory counting system.

## Overview

The Counting Dashboard provides real-time statistics, job queue monitoring, and performance analytics for inventory counting operations.

**Access:** Inventory → Counting Dashboard  
**Page:** 50199 CLE Counting Dashboard

---

## Dashboard Sections

### Quick Stats (Top Section)

**Active Counts:**
- **Prepared:** Lines waiting to be released
- **Released:** Lines available for staff to count
- **Counted:** Lines waiting to be processed
- **Assistance Required:** Lines needing supervisor review

**Today's Activity:**
- Total counts submitted today
- Auto-posted (acceptable deviation)
- Recounts requested
- Exceptions escalated
- Total adjustment value ($)

**Performance Indicators:**
- Acceptance rate (% auto-posted) — target 95%
- Recount rate (% needing recount)
- Assistance rate (% needing supervisor)
- Average time to complete count

---

### Job Queue Status (Middle Section)

Three critical automated jobs are monitored:

**1. CLE Prepare Auto Item Count**
- Runs every 2 hours
- Creates count lines based on business rules
- Displays: Status, Last run, Next run, Errors
- Manual trigger button available

**2. CLE Release Count**
- Runs every 1 minute
- Validates and releases prepared count lines
- Displays: Status, Last run, Next run, Errors
- Manual trigger button available

**3. CLE Process Incoming Counts**
- Runs every 1 minute
- Evaluates deviations and posts adjustments
- Displays: Status, Last run, Next run, Errors
- Manual trigger button available

**Expected Job Timing:**
- Prepare job: Next run ≤2 hours away
- Release job: Next run ≤1 minute away
- Process job: Next run ≤1 minute away

If any job is delayed or in error, investigate immediately.

---

### Charts and Trends (Bottom Section)

**Chart 1: Daily Acceptance Rate (Last 30 Days)**
- Shows % of first counts auto-posted
- Includes 95% target line
- Identifies accuracy trends
- Drop indicates quality issues

**Chart 2: Count Volume by Type**
- Bar chart of count distribution
- Shows which count types are running
- Helps understand workload composition
- Identifies spikes in volume

**Chart 3: Counter Performance**
- User ID, counts submitted, acceptance rate
- Identifies training needs
- Recognizes top performers
- Benchmarks counter accuracy

**Chart 4: Adjustment Value Trend**
- Daily total adjustment value ($)
- Positive and negative shown separately
- Shows financial impact
- Identifies patterns in variance

---

## Quick Actions

### Manual Job Triggers

Located in the Job Queue Status section:

**Prepare Counts Now**
- Triggers prepare job immediately
- Creates count lines outside normal schedule
- Use when: Need counts for urgent shipment or investigation

**Release Counts Now**
- Triggers release job immediately
- Releases all prepared lines (if validation passes)
- Use when: Need to make counts available to staff immediately

**Process Counts Now**
- Triggers processing job immediately
- Evaluates deviations and posts adjustments
- Use when: Need results faster than 1-minute schedule

---

## Reading the Dashboard

### Health Indicators

**Green Dashboard = Healthy:**
- All jobs running on schedule
- Acceptance rate > 90%
- No assistance required counts
- Recount rate < 10%

**Yellow Dashboard = Attention Needed:**
- A job missed a scheduled run
- Acceptance rate 80-90%
- Some assistance required counts
- Recount rate 10-20%

**Red Dashboard = Critical:**
- A job is in error status
- Acceptance rate < 80%
- Multiple assistance required counts
- Recount rate > 20%

### Key Metrics to Monitor

**Daily:**
- Current count status distribution
- Today's acceptance rate
- Job queue status
- Any error messages

**Weekly:**
- 30-day acceptance rate trend
- Counter performance comparison
- Count volume patterns
- Adjustment value total

**Monthly:**
- Overall system performance
- Counter training effectiveness
- Count type efficiency
- Process improvement opportunities

---

## Troubleshooting

### Issue: Job Not Running

**Symptoms:**
- Job status shows "Stopped"
- Last run was hours ago

**Resolution:**
1. Check Job Queue status page
2. Verify job entry exists and is enabled
3. Review error message if present
4. Click manual trigger to test
5. If still not running, contact IT

### Issue: High Assistance Required Rate

**Symptoms:**
- Multiple counts needing supervisor approval
- Indicates deviation threshold issues

**Investigation:**
1. Review which items have high assistance counts
2. Check for system errors in those areas
3. Consider adjusting deviation thresholds
4. Review counter training needs

### Issue: Low Acceptance Rate

**Symptoms:**
- Many first counts requiring recount
- Indicates accuracy or process issues

**Investigation:**
1. Check Counter Performance chart
2. Identify which counters need training
3. Review recounted items for patterns
4. Check system setup (scales, equipment calibration)

---

## Best Practices

✅ **DO:**
- Review dashboard every morning
- Monitor job queue status daily
- Check performance charts weekly
- Investigate any red indicators immediately
- Use manual triggers sparingly and purposefully

❌ **DON'T:**
- Ignore red/yellow status indicators
- Let jobs run in error state without investigating
- Adjust deviation thresholds without understanding impact
- Assume all assistance required counts are data quality issues

---

## Performance Targets

| Metric | Target | Action If Below |
|--------|--------|-----------------|
| Acceptance Rate | > 95% | Review counter training |
| Recount Rate | < 10% | Investigate items |
| Assistance Rate | < 5% | Check deviation thresholds |
| Job Timeliness | On schedule | Verify job queue |
| Average Count Time | < 10 min | Review process efficiency |

---

## Related Pages

- [[counting-process]] — Staff guide for physical counting
- [[count-preparation]] — Manager guide for count preparation
- [[count-processing]] — Manager guide for count processing
- [[counting-exceptions]] — Manager guide for exception handling
