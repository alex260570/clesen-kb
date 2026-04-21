---
title: Production Order Posting — Manager's Guide
type: howto
tags: [production, posting, manager, quality-control, safety]
created: 2026-04-21
updated: 2026-04-21
sources: [prod-order-posting-manager-guide.md]
---

# Production Order Posting — Manager's Guide

Oversee production output posting, manage safety quantities, and control quality.

## Safety Quantity Management

### Understanding Safety Quantity

**Safety Quantity (Overstart):** Buffer for expected production losses.

```
Requested Qty: 1000 units (customer order)
Item Overstart %: 3%
Safety Qty: 30 units (1000 × 3%)
Production Qty: 1030 units
```

### Safety Quantity Lifecycle

**1. On Creation**
- Auto-calculated from Item card "CLE Overstart %" field
- Added to production order quantities

**2. During Production**
- Reduced as scrap posted
- Safety Qty = Safety Qty - Scrap Qty
- If scrap > safety: safety becomes 0

**3. Phase Completion**
- Manager decides: Release or Keep
- **Release:** Converts buffer to actual output
- **Keep:** Maintains buffer for next phase

**4. Final Phase**
- Typically released automatically
- Remaining safety becomes finished goods

### Manual Safety Adjustment

**Authorization Required:** Must be in Safety Adjustment Authorization Group

**When to Adjust:**
- Initial overstart % was incorrect
- Unexpected quality issues emerge
- Quality improving, can reduce buffer
- Customer requirements changed

**Process:**
1. Open Released Production Order
2. Click **Adjust Safety Quantity**
3. Enter **New Safety Quantity**
4. Click **OK**

System validates new safety % doesn't exceed reasonable thresholds.

### Safety Best Practices

**When to Increase:**
- New product with uncertain yield
- Quality issues emerging
- Critical customer order
- Seasonal quality variations

**When to Decrease:**
- Established product, consistent quality
- Quality improvements implemented
- Overproduction trend observed
- Cost reduction initiative

**Monitoring:**
- Track actual scrap vs. planned safety
- Review safety utilization rates
- Adjust item overstart % based on trends
- Document reasons for adjustments

## Advanced Quantity Adjustments

### Decision Matrix: Can I Increase Quantity?

```
Production Started?
├─ NO: Increase freely
└─ YES:
    └─ Posted Scrap Available?
        ├─ YES, Sufficient: Recover from scrap
        ├─ YES, Insufficient: Partial recovery + new order
        └─ NO: Create new production order
```

### Scrap Recovery Engine

When increasing quantities after production starts, system "recovers" previously posted scrap.

**Process:**
1. Find all Capacity Ledger Entries with scrap
2. Sort by Entry No. descending (newest first)
3. For each entry: recover scrap to output
4. Cannot recover more than total posted scrap
5. Recovery is LIFO (Last In, First Out)

**Example:**
```
Capacity Ledger:
Entry 1: Output 500, Scrap 20
Entry 2: Output 0, Scrap 30 (scrap-only)

Increase qty by 40:
1. Entry 2: Recover all 30 scrap
2. Entry 1: Recover 10 scrap
Result: 40 units recovered, 10 scrap remains
```

### Scenario-Based Adjustments

**Scenario 1: Proactive Increase Before Issues**
- Quality trends indicate potential problems
- Increase before critical phase
- Check component availability

**Scenario 2: Mass Scrap Event**
- Equipment failure, environmental issue
- Assess total affected quantity
- Use Adjust Quantity to record
- Select appropriate scrap code
- Document incident

**Scenario 3: Order Consolidation**
- Customer increases order after production started

**Options:**
- Option A: Scrap Recovery (if available) — limited to scrap amount
- Option B: New Production Order — no limitations
- Option C: Split before completion

## Phase-Specific Posting Strategy

**Multi-Phase Production Example:**

```
Phase 1 (SOW): Safety = 30
  Post scrap → Safety reduces

Phase 2 (GROW): Safety still active
  Post output
  Keep safety buffer (don't release)
  Post more scrap → Safety reduces more

Phase 3 (READY): Final phase
  Release safety → Becomes available output
  Post final output (includes recovered safety)
```

## Quality Control Integration

### Scrap Code Management

Standard codes:
- **QUALITY** — General quality issues
- **DAMAGE** — Physical damage
- **GROWTH** — Growth-related issues
- **ENVIRONMENT** — Environmental factors
- **EQUIPMENT** — Equipment problems
- **CLEANUP** — Corrections/adjustments

**Manager Responsibilities:**
1. Define scrap codes in system
2. Train staff on appropriate usage
3. Review scrap code reports regularly
4. Identify trends and root causes

### Scrap Analysis

**Daily Review:**
- Check scrap postings for abnormalities
- Verify codes used appropriately
- Follow up on unusual events

**Weekly Analysis:**
- Scrap by code
- Scrap by item
- Trend analysis
- Compare to safety quantity forecasts

**Monthly Strategic Review:**
- Adjust item overstart percentages
- Identify quality improvements
- Equipment maintenance correlation
- Environmental impact analysis

### Quality Gates

**Pre-Production:**
- Verify safety quantity appropriate
- Review recent scrap trends
- Check equipment status

**Mid-Production:**
- Monitor actual vs. expected scrap
- Adjust safety if needed
- Escalate if scrap exceeds safety

**Post-Production:**
- Verify final output matches expectations
- Document deviations
- Update item overstart % if needed

## Authorization and Security

### Safety Adjustment Authorization

**Setup:**
1. Navigate to **CLE Clesen Setup**
2. Set **Safety Adjustment Authorization Group**
3. Add authorized users to group

**Authorization Levels:**
- **Staff:** Post output, adjust quantities (standard)
- **Managers:** All staff functions + adjust safety + overrides
- **Admins:** All + system configuration

## Reporting and KPIs

### Key Metrics

**Production Efficiency:**
- First Pass Yield = Output / (Output + Scrap)
- Safety Accuracy = Actual Scrap / Planned Safety
- Schedule Adherence = On-time completion rate

**Quality Metrics:**
- Scrap Rate by Product
- Scrap Rate by Phase
- Scrap Rate Trends
- Most Common Scrap Codes

**Cost Metrics:**
- Scrap Cost
- Overproduction Cost
- Recovery Rate

## Management Workflows

### Scenario: Consistently High Scrap

**Analysis:**
1. Review scrap codes for patterns
2. Check equipment maintenance
3. Evaluate environmental factors
4. Consider process changes

**Actions:**
1. Increase item overstart %
2. Implement quality improvements
3. Provide staff training
4. Document findings

### Scenario: Consistently Low Scrap

**Analysis:**
1. Calculate average scrap rate
2. Compare to item overstart %
3. Consider cost of overproduction

**Actions:**
1. Reduce item overstart %
2. Adjust safety quantities
3. Monitor for 2-3 cycles
4. Standardize if successful

### Scenario: Sudden Scrap Spike

**Analysis:**
1. Identify scrap codes used
2. Determine timing (which phase)
3. Interview staff involved
4. Check for external factors

**Actions:**
1. Document incident thoroughly
2. Determine if systemic or isolated
3. Implement corrective actions
4. Adjust current orders if needed

## Emergency Procedures

### Wrong Quantity Posted
1. Determine if correctable via Adjust Quantity
2. If scrap available: recover and re-post
3. If not: document and contact IT

### Wrong Phase Posted
1. Stop immediately
2. Document what was posted
3. Contact IT support
4. Do not attempt manual reversal

### System Error During Posting
1. Note exact error message
2. Check if transaction completed
3. If completed: proceed normally
4. If not: retry or contact IT

## Best Practices

### Daily Operations

**Morning Review:**
1. Check orders scheduled for today
2. Verify safety quantities appropriate
3. Review previous day's scrap postings
4. Address pending issues

**During Production:**
1. Monitor real-time postings
2. Respond to staff questions promptly
3. Escalate unusual situations
4. Document decisions

**End of Day:**
1. Verify all output posted
2. Review scrap for abnormalities
3. Plan for next day
4. Update status reports

### Strategic Management

**Weekly:** Analyze scrap trends, adjust safety, review authorizations  
**Monthly:** Update overstart %, quality improvements, cost analysis  
**Quarterly:** Comprehensive scrap analysis, safety effectiveness, security audit  

## Quick Reference

### Authorization Matrix
```
Function                  | Staff | Manager | Admin
Adjust Quantity (standard)|  ✓    |   ✓     |  ✓
Adjust Safety Quantity    |  ✗    |   ✓     |  ✓
Override Validations      |  ✗    |   ✓     |  ✓
System Configuration      |  ✗    |   ✗     |  ✓
```

### Key Formulas
```
Safety Qty = Requested Qty × Overstart %
Production Qty = Requested Qty + Safety Qty
Scrap Rate % = (Total Scrap / Total Output) × 100
Safety Util. = (Actual Scrap / Safety Qty) × 100
```

## Related Pages

- [[prod-order-overview]]
- [[prod-order-posting-staff]]
- [[prod-order-tasks-staff]]
