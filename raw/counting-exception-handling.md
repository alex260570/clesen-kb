# Exception Handling - Manager Guide

## Overview

Exception Handling is **Phase 5** of the counting system - where high-deviation counts are reviewed and resolved by supervisors/managers.

**Last Updated:** February 10, 2026

## What Are Exceptions?

**Exceptions are counts that require supervisor review:**

- **Large deviations:** Counted quantity significantly different from expected
- **Failed recounts:** Second count still has high deviation
- **Data integrity issues:** Negative inventory corrections
- **High-value adjustments:** Adjustments exceeding dollar threshold
- **Manual escalations:** Staff or system requesting assistance

**Status:** "Assistance Required"  
**Interface:** Inventory Count Posting (Page 50127)

## Inventory Count Posting Page

### Accessing the Page

**Navigation:** Inventory → Inventory Count Posting

**Purpose:**
- Review high-deviation counts
- Approve or reject adjustment postings
- Request additional recounts
- Adjust acceptable limits for specific cases
- Investigate significant discrepancies

### Page Layout

**Filters:**
- Status = Assistance Required (default)
- Location
- Date range
- Item category
- Counter user ID

**Columns shown:**
- Item No and Description
- Location and Bin Code
- Expected Quantity
- Counted Quantity (first count)
- Recounted Quantity (if applicable)
- Quantity Adjustment
- Adjustment Value ($)
- Deviation Percentage
- Count Type
- Counter User ID
- Count DateTime
- Reason for Escalation

**Actions available:**
- Approve Adjustment
- Reject and Recount
- Adjust Acceptable Limits
- Add Notes/Comments
- View History
- Contact Counter

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

**A. Approve Adjustment**
**B. Reject and Request Recount**
**C. Adjust and Approve**

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

**Example approval notes:**
```
"Approved. Receiving not posted for PO 12345. 
Receipt posted 10:30 AM, count accurate. 
Reminded receiving staff to post promptly."
```

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

**Example rejection notes:**
```
"Recount requested. Expected 150, counted 25. 
Please verify item number carefully. 
Check nearby bins for similar items.
Count cases and pieces separately."
```

**Important:** Don't request infinite recounts. If second recount also has high deviation, approve or investigate further (don't keep requesting recounts).

### Option C: Adjust and Approve

**When to use:**
- Count is accurate BUT
- You want to adjust acceptable limits for this specific case
- Future counts of this item should have different thresholds

**What happens:**
1. Click "Adjust Acceptable Limits" action
2. Dialog appears with current thresholds
3. You can modify:
   - Acceptable percentage
   - Acceptable absolute quantity
   - Just for this adjustment or for future counts of this item
4. System re-evaluates with new thresholds
5. If now within acceptable range, auto-posts
6. If still outside, stays as exception (but thresholds updated)

**Use cases:**
- High-value item needs tighter threshold going forward
- Low-value item has too-tight threshold
- Seasonal item has different variance
- Item characteristics make counting variable
- Production item has known scrap rate

**Example:**
```
Expected: 1000, Counted: 950, Deviation: 5%
Current threshold: 3%
Action: Increase threshold to 7% for this item
Reason: "Production scrap rate typically 5-7%"
```

## Special Scenarios

### Negative Inventory Corrections

**Scenario:** Expected quantity is negative, counted quantity is positive

**What it means:**
- System shows we "owe" inventory (negative balance)
- Physical count finds actual inventory exists
- Data integrity issue being corrected

**What to do:**
1. Investigate how negative inventory occurred
   - Over-picking without receipts?
   - Receiving not posted?
   - Data entry error?
2. Approve adjustment (physical reality is correct)
3. Document root cause
4. Take corrective action to prevent recurrence

**Example:**
```
Expected: -50 (negative inventory)
Counted: 0 (bin actually empty)
Adjustment: +50 (corrects negative to zero)
Approve: Yes, fixes data integrity issue
```

### Zero Expected, Items Found

**Scenario:** System expected zero, but counter found items

**What it means:**
- Receiving not posted
- Items in wrong location
- Ghost inventory
- Production output not recorded

**What to do:**
1. Investigate source of items
   - Check recent receipts
   - Check production orders
   - Check transfers
   - Check other bins (moved incorrectly?)
2. If legitimate items: Approve (corrects inventory)
3. If items shouldn't be there: Investigate further
4. Document findings

### Production Order Discrepancies

**Scenario:** Count of production order items significantly differs from remaining quantity

**What it means:**
- Overproduction or underproduction
- Scrap/waste not recorded
- Output posted incorrectly
- Germination/survival rate different than expected

**What to do:**
1. Talk to production supervisor
2. Review production order status
3. Check output postings
4. Verify scrap/waste records
5. If overproduction: Approve (updates remaining qty)
6. If underproduction: Investigate quality issues
7. Update production order if needed

### High-Value Adjustments

**Scenario:** Adjustment value exceeds dollar threshold (e.g., >$1000)

**What it means:**
- Significant financial impact
- Extra scrutiny warranted
- May need additional approval

**What to do:**
1. **Extra verification required:**
   - Physical verification by supervisor
   - Two-person count
   - Manager approval
   - Documentation for audit
2. Review financial impact
3. Investigate cause thoroughly
4. Document extensively
5. Get additional approval if needed
6. Approve once verified

## Approval Workflows

### Standard Approval

**For most exceptions:**
1. Supervisor reviews on Inventory Count Posting page
2. Investigates discrepancy
3. Approves, rejects, or adjusts
4. Documents decision
5. Count processed

**Approval authority:** Warehouse Supervisor, Inventory Manager

### High-Value Approval

**For adjustments exceeding threshold:**
1. Supervisor investigates
2. Physical verification performed
3. Documentation prepared
4. Manager approval obtained
5. Supervisor approves in system
6. Count processed

**Approval authority:** Requires Manager sign-off (may be offline)

### Financial Reporting Adjustments

**For physical inventory and location counts:**
1. Standard approval process
2. Additional documentation for audit
3. Summary report to accounting
4. Reconciliation with financial statements
5. Archive for compliance

**Approval authority:** Warehouse Manager, Controller notified

## Performance Analysis

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

### Root Cause Analysis

**Monthly review:**
- Which items have most exceptions?
- Which locations have most exceptions?
- Which counters have most exceptions?
- Which count types have most exceptions?
- What are common root causes?

**Action items:**
- Staff training needs
- Location organization improvements
- Item identification improvements
- System process improvements
- Threshold adjustments

## Communication

### With Warehouse Staff

**Feedback on approvals:**
- "Good job, count was accurate"
- "Thanks for careful recount"
- "FYI, receiving wasn't posted - not your error"

**Feedback on rejections:**
- "Please recount - check item number carefully"
- "Look in nearby bins, item may have been moved"
- "Count cases first, then pieces"

**Training opportunities:**
- Patterns of errors by specific staff
- New item training
- Bin organization best practices

### With Other Departments

**Production:**
- Overproduction/underproduction patterns
- Scrap rate actual vs expected
- Output posting timing
- Quality issues

**Receiving:**
- Posting delays causing count discrepancies
- Receipt accuracy
- Bin location accuracy

**Picking:**
- Over-picking issues
- Location accuracy
- Bin organization

**Accounting:**
- High-value adjustments
- Physical inventory results
- Variance explanations
- Audit documentation

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

## Troubleshooting

### Too Many Exceptions

**Problem:** Assistance Required queue growing

**Causes:**
- Thresholds too tight
- Counting accuracy issues
- System data issues
- Seasonal volatility

**Solutions:**
1. Analyze exception patterns
2. Adjust thresholds if appropriate
3. Staff training if needed
4. Fix data issues if found
5. Process review and improvement

### Exceptions Not Appearing

**Problem:** Expected exceptions not showing on page

**Causes:**
- Filtering incorrect
- Processing job not running
- Status not set correctly
- Configuration issue

**Solutions:**
1. Clear filters on page
2. Check job queue (50111 Process Incoming Counts)
3. Review status on count lines
4. Check threshold configuration

### Can't Approve Adjustments

**Problem:** Approval action not working

**Causes:**
- Permissions insufficient
- Posting setup issue
- Item configuration issue
- System error

**Solutions:**
1. Check posting permissions
2. Review item journal setup
3. Verify item not blocked
4. Check system event log

---

## Related documents

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-release]]
- [[understanding-count-types]]
- [[count-processing]]

---

*For system overview, see counting-system-overview.md. For previous phase, see count-processing.md.*
