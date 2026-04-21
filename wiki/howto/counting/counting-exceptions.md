---
title: Counting Exceptions — Manager Guide
type: howto
tags: [counting, manager, exceptions, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [counting-exception-handling.md]
---

# Exception Handling — Manager's Guide

## Overview

Exception Handling is **Phase 5** of the counting system - where high-deviation counts are reviewed and resolved by supervisors/managers.

## What Are Exceptions?

**Exceptions are counts that require supervisor review:**

- **Large deviations:** Counted quantity significantly different from expected
- **Failed recounts:** Second count still has high deviation
- **Data integrity issues:** Negative inventory corrections
- **High-value adjustments:** Adjustments exceeding dollar threshold
- **Manual escalations:** Staff or system requesting assistance

**Status:** "Assistance Required"  
**Interface:** Inventory Count Posting (Page 50127)

## Reviewing Exceptions

### Step-by-Step Review Process

#### 1. Understand the Discrepancy

**Review the numbers:**
- Expected Quantity: What system thought was there
- Counted Quantity: What counter physically found
- Adjustment needed: Difference
- Deviation %: Size of discrepancy
- $ Value: Financial impact

**Check recount status:**
- First count only? (may be simple error)
- Already recounted? (more serious - two counts differ significantly)
- Recount quantities different? (counter unsure)
- Recount quantities same? (counter confident)

**Review count details:**
- Count Type: Why was this count done?
- Line Source: Inventory, Production Order, or Physical Inventory?
- Location/Bin: Where is the item?
- Last Count Date: When was it last counted?

#### 2. Check History

**Click "Show History" action:**
- When was line created?
- When was it released?
- When was it counted?
- Any recount requests?
- Who counted it (user ID)?
- Any previous notes?

**Look for patterns:**
- Same counter having issues?
- Same location frequently wrong?
- Same item repeatedly miscounted?
- Timing issues (during picking, receiving, etc.)?

#### 3. Investigate Root Cause

**Ask questions:**

**Was count accurate?**
- Counter confident in count?
- Item easy or difficult to count?
- Bin accessible and organized?
- Clear item identification?

**Was expected quantity wrong?**
- Recent movements not posted?
- Picking occurred during count?
- Receiving not posted?
- Production output not posted?
- Item moved to different bin?

**Was it a system issue?**
- Data entry error in past
- Posting error previously
- Bin content not maintained
- Integration issue

**Verification steps:**
- Contact counter - ask about count
- Check bin content history
- Review recent transactions
- Check item ledger entries
- Verify production order status
- Look at picking history
- Check receiving records

#### 4. Make a Decision

**Three options:**
- A. Approve Adjustment
- B. Reject and Request Recount
- C. Adjust and Approve

## Decision Actions

### Option A: Approve Adjustment

**When to approve:**
- Investigation confirms count is accurate
- Expected quantity was wrong (transactions not posted)
- Discrepancy is real and legitimate
- Even if large, you're confident in the count

**What happens:**
1. Click "Approve Adjustment" action
2. System posts adjustment immediately
3. Inventory updated
4. Count line archived
5. History entry created with your approval

**Add notes before approving:**
- Document investigation findings
- Note root cause if identified
- Any corrective actions taken
- Future prevention steps

### Option B: Reject and Request Recount

**When to reject:**
- Counter may have made error
- Physical verification needed
- You're not confident in count
- Want second opinion
- First recount, worth trying again

**What happens:**
1. Click "Reject and Recount" action
2. Status changes to "Recount Request"
3. Goes back to Prepared status
4. Releases to staff again
5. Counter will count again (third time if already recounted)

**Add notes before rejecting:**
- Why requesting recount
- What to look for
- Special instructions for counter
- Any verification needed

**Important:** Don't request infinite recounts. If second recount also has high deviation, approve or investigate further.

### Option C: Adjust and Approve

**When to use:**
- Count is accurate BUT
- You want to adjust acceptable limits for this specific case
- Future counts of this item should have different thresholds

**What happens:**
1. Click "Adjust Acceptable Limits" action
2. Dialog appears with current thresholds
3. You can modify acceptable percentage or quantity
4. System re-evaluates with new thresholds
5. If now within acceptable range, auto-posts
6. If still outside, stays as exception

**Use cases:**
- High-value item needs tighter threshold going forward
- Low-value item has too-tight threshold
- Seasonal item has different variance
- Item characteristics make counting variable
- Production item has known scrap rate

## Special Scenarios

### Negative Inventory Corrections

**Scenario:** Expected quantity is negative, counted quantity is positive

**What it means:**
- System shows we "owe" inventory (negative balance)
- Physical count finds actual inventory exists
- Data integrity issue being corrected

**What to do:**
1. Investigate how negative inventory occurred
2. Approve adjustment (physical reality is correct)
3. Document root cause
4. Take corrective action to prevent recurrence

### Zero Expected, Items Found

**Scenario:** System expected zero, but counter found items

**What it means:**
- Receiving not posted
- Items in wrong location
- Ghost inventory
- Production output not recorded

**What to do:**
1. Investigate source of items
2. If legitimate items: Approve (corrects inventory)
3. If items shouldn't be there: Investigate further
4. Document findings

### Production Order Discrepancies

**Scenario:** Count of production order items significantly differs from remaining quantity

**What it means:**
- Overproduction or underproduction
- Scrap/waste not recorded
- Output posted incorrectly

**What to do:**
1. Talk to production supervisor
2. Review production order status
3. Check output postings
4. Verify scrap/waste records
5. Approve or investigate further

### High-Value Adjustments

**Scenario:** Adjustment value exceeds dollar threshold (e.g., >$1000)

**What it means:**
- Significant financial impact
- Extra scrutiny warranted
- May need additional approval

**What to do:**
1. Extra verification required
2. Physical verification by supervisor
3. Two-person count
4. Manager approval
5. Documentation for audit
6. Approve once verified

## Performance Metrics

### Metrics to Track

**Exception Rate:**
- Assistance Required / Total Counts
- Target: <1%
- Indicates: Overall count quality

**Approval Rate:**
- Approved / Total Exceptions
- Target: >80%
- Indicates: Count accuracy even for exceptions

**Recount Request Rate:**
- Rejected / Total Exceptions
- Target: <20%
- Indicates: Need for additional counting

**Average Resolution Time:**
- Time from Assistance Required to Resolution
- Target: <24 hours
- Indicates: Supervisor responsiveness

**Adjustment Value:**
- Total $ value of exception adjustments
- Monitor trends
- Indicates: Financial impact of discrepancies

## Best Practices

### Daily Operations

✓ **Review exceptions daily** - Don't let queue build up  
✓ **Respond within 24 hours** - Keep counting workflow moving  
✓ **Investigate thoroughly** - Don't just approve blindly  
✓ **Document decisions** - Audit trail and learning  
✓ **Provide feedback** - Help staff improve  

### Quality Management

✓ **Track patterns** - Identify systemic issues  
✓ **Root cause analysis** - Fix underlying problems  
✓ **Staff training** - Invest in counter development  
✓ **Process improvement** - Continuously refine  
✓ **Threshold optimization** - Right balance of automation vs review  

### Communication

✓ **Be timely** - Counters waiting for resolution  
✓ **Be clear** - Explain reasons for decisions  
✓ **Be constructive** - Focus on improvement  
✓ **Be thorough** - Document for audit and learning  

### Financial Controls

✓ **High-value verification** - Extra scrutiny for big $ adjustments  
✓ **Documentation** - Support for financial reporting  
✓ **Approval hierarchy** - Appropriate authority levels  
✓ **Audit trail** - Full history maintained  

## Related Pages

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-release]]
- [[count-processing]]
- [[understanding-count-types]]

## Three Decision Actions

### Approve Adjustment
Count is accurate — post it. Document root cause in notes.

### Reject and Recount
Possible counter error — resets status back through release. Add instructions. Don't loop infinitely.

### Adjust Acceptable Limits
Count is accurate but thresholds are wrong for this item/category. Modify threshold for this case or future counts, then re-evaluate.

## Special Scenarios

- **Negative inventory correction** — approve; investigate root cause (over-picking without receipts, unposted data)
- **Zero expected, items found** — check for unposted receipts or misplaced items
- **Production order discrepancy** — talk to production supervisor; may reflect overproduction or unrecorded scrap
- **High-value (> $ threshold)** — require physical verification, two-person count, manager sign-off

## KPIs

- Exception rate <1%
- Approval rate >80% (accuracy even for exceptions)
- Average resolution time <24h

## See Also

[[counting-overview]], [[counting-process]], [[counting-dashboard]]
