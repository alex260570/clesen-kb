# Production Order Posting - Manager Guide

**For Production Managers & Supervisors**  
**Last Updated:** February 13, 2026

---

## Table of Contents
1. [Overview](#overview)
2. [Safety Quantity Management](#safety-quantity-management)
3. [Advanced Quantity Adjustments](#advanced-quantity-adjustments)
4. [Production Order Lifecycle](#production-order-lifecycle)
5. [Quality Control Integration](#quality-control-integration)
6. [Reporting and Analytics](#reporting-and-analytics)
7. [Authorization and Security](#authorization-and-security)
8. [Best Practices](#best-practices)

---

## Overview

This guide covers manager-level operations for production order posting, with emphasis on:
- Safety quantity (overstart) management
- Production order lifecycle oversight
- Quality control integration
- Authorization management
- Performance optimization

**Audience:** Production managers, supervisors, and authorized personnel with advanced production control responsibilities.

---

## Safety Quantity Management

### Understanding Safety Quantity

**Definition:** Safety quantity (also called "overstart") is a buffer quantity added to the requested quantity to account for expected losses during production.

**Formula:**
```
Requested Quantity = Customer order quantity
Safety Quantity = Requested Qty × Overstart % (from Item card)
Production Order Quantity = Requested Qty + Safety Qty
```

**Example:**
- Customer Order: 1000 units
- Item "Overstart %": 3%
- **Requested Quantity:** 1000
- **Safety Quantity:** 30 (1000 × 3%)
- **Production Order Quantity:** 1030

### Safety Quantity Lifecycle

#### 1. On Production Order Creation
- Automatically calculated from Item card "CLE Overstart %" field
- Added to production order header and line quantities
- Stored in Prod. Order Line "CLE Safety Qty." field

#### 2. During Production
- Reduced as scrap is posted
- Calculation: Safety Qty = Safety Qty - Scrap Qty
- If scrap exceeds safety, safety becomes 0

#### 3. On Phase Completion
- Manager decides: Release or Keep
- **Release Safety:** Converts safety buffer to actual output
- **Keep Safety:** Maintains buffer for subsequent phases

#### 4. Final Phase
- Typically released automatically
- "Release Safety" checkbox auto-checked
- Converts remaining safety to finished goods

### Manual Safety Adjustment

**Authorization Required:** Users must be in Safety Adjustment Authorization Group.

#### When to Adjust Safety
- Initial overstart percentage was incorrect
- Unexpected quality issues require higher buffer
- Quality improving, can reduce buffer
- Customer requirements changed

#### How to Adjust Safety Quantity

**Access:**
1. Open Released Production Order
2. Click **Adjust Safety Quantity** action
3. Safety adjustment dialog opens

**Dialog Fields:**
- **Current Safety Quantity:** Read-only, shows current buffer
- **New Safety Quantity:** Enter desired safety amount
- Validation: Cannot exceed Remaining Quantity

**Example Adjustment:**
```
Current Safety: 30
Remaining Qty: 950
New Safety: 50

Result: Safety buffer increased to 50 units
```

#### Safety Quantity Validation

**System Checks:**
1. Compare safety % to item default overstart %
2. If new safety % > default %, system prompts:
   - "With this adjustment the new Safety Quantity is higher (5%) than the usual Overstart (3%). Do you want to lower the Safety Quantity to 3%?"
3. Manager can accept or keep higher safety

**Calculation:**
```
Safety % = (Safety Qty / Requested Qty) × 100
```

### Safety Best Practices

**When to Increase Safety:**
- New product with uncertain yield
- Quality issues emerging
- Critical customer order
- Seasonal quality variations

**When to Decrease Safety:**
- Established product with consistent quality
- Quality improvements implemented
- Overproduction trend observed
- Cost reduction initiative

**Monitoring:**
- Track actual scrap vs. safety quantity
- Review safety utilization rates
- Adjust item default overstart % based on trends
- Document reasons for manual adjustments

---

## Advanced Quantity Adjustments

### Strategic Adjustment Scenarios

#### Scenario 1: Proactive Increase Before Issues
**Situation:** Quality trends indicate potential issues ahead

**Strategy:**
1. Increase quantity before production reaches critical phase
2. If no postings yet: direct header adjustment
3. If postings exist: cannot increase without scrap recovery
4. **Alternative:** Create supplemental production order

**Decision Matrix:**
| Production Stage | Scrap Available | Action |
|-----------------|-----------------|---------|
| Not started | N/A | Increase freely |
| Started | Yes, sufficient | Recover from scrap |
| Started | Yes, insufficient | Partial recovery + new order |
| Started | No scrap | Create new production order |

#### Scenario 2: Mass Scrap Event
**Situation:** Equipment failure, environmental issue, etc.

**Steps:**
1. Assess total affected quantity
2. Use Adjust Quantity to record
3. Select appropriate scrap code (EQUIPMENT, ENVIRONMENT)
4. Document incident in notes
5. Evaluate if should continue or cancel order

**Setting to Zero:**
```
If no output posted yet:
  → System deletes production line
  → Header remains for audit trail
  → Components and routing cascade deleted

If output already posted:
  → System posts remaining as scrap
  → Full transaction history preserved
  → All components and materials accounted for
```

#### Scenario 3: Order Consolidation
**Situation:** Customer increases order after production started

**Options:**

**Option A: Scrap Recovery (If Available)**
- Use posted scrap to increase current order
- Limited to available scrap amount
- Maintains single order number
- Best for small increases

**Option B: New Production Order**
- Create separate order for additional quantity
- No limitations on quantity
- Better tracking for expedited portions
- Recommended for large increases

**Option C: Production Order Split**
- Split existing order before completion
- Useful for partial early shipment
- Requires "Enable Prod. Order Splitting" in setup

### Understanding Scrap Recovery

**Scrap Recovery Engine:**
When increasing quantities after production starts, system "recovers" previously posted scrap.

**Process:**
1. System finds all Capacity Ledger Entries with scrap
2. Sorts by Entry No. descending (newest first)
3. For each entry:
   - Recovers scrap back to output
   - Clears scrap quantity and scrap code
   - Updates both output and scrap fields

**Important Rules:**
- Only scrap-only entries can be fully recovered
- Entries with both output and scrap: scrap moves to output
- Cannot recover more than total posted scrap
- Recovery is LIFO (Last In, First Out)

**Example:**
```
Capacity Ledger Entries:
Entry 1: Output 500, Scrap 20
Entry 2: Output 0, Scrap 30 (scrap-only)

Increase quantity by 40:
1. Entry 2: Recovers all 30 scrap → Entry 2 deleted
2. Entry 1: Recovers 10 scrap → Output 510, Scrap 10

Result: 40 units recovered, 10 scrap remains
```

### Phase-Specific Posting Strategy

**Multi-Phase Production:**

**Phase 1 (SOW):**
- Safety quantity active
- Post output for completed seeding
- Scrap from germination issues

**Phase 2 (GROW):**
- Safety still active
- Post growing phase output
- Scrap from growth/quality issues
- Consider keeping safety buffer

**Phase 3 (READY):**
- Final phase
- Release safety quantity
- Post final output
- Record final quality assessment

**Safety Management Across Phases:**
```
Phase 1: Safety = 30
  Post 20 scrap → Safety reduces to 10
  
Phase 2: Safety = 10
  Keep safety buffer (don't release)
  Post 5 more scrap → Safety reduces to 5
  
Phase 3: Safety = 5
  Release safety → Becomes available output
  Final output includes recovered safety
```

---

## Production Order Lifecycle

### Status Progression

#### Planned Status
- Initial creation stage
- Requested quantity set
- No posting allowed
- Planning and scheduling

#### Firm Planned Status
- Approved for production
- Safety quantity calculated and added
- Components reserved
- No posting yet

#### Released Status
- Active production
- Can post output and scrap
- Can adjust quantities
- All functions available

#### Finished Status
- All postings complete
- Order closed
- Historical reference
- Cannot modify

### Critical Fields

**Production Order Header:**
- **No.**: Production order number
- **Quantity**: Current total quantity (includes safety)
- **CLE Requested Quantity**: Original customer quantity
- **Status**: Current lifecycle status
- **Source Prod. Order No.**: If split from another order

**Prod. Order Line:**
- **Quantity**: Matches header quantity
- **Remaining Quantity**: Not yet posted as output
- **Finished Quantity**: Total posted output
- **CLE Safety Qty.**: Current safety buffer amount

### Monitoring Production Progress

**Key Metrics to Track:**
```
Progress % = (Finished Quantity / Quantity) × 100
Scrap Rate % = (Total Scrap / Finished Quantity) × 100
Safety Utilization % = (Scrap / Original Safety Qty) × 100
```

**Dashboard Views:**
1. Filter Released Production Orders by status
2. Show fields: Quantity, Remaining Qty, Safety Qty
3. Calculate current phase completion
4. Track scrap trends

---

## Quality Control Integration

### Scrap Code Management

**Purpose:** Categorize reasons for scrap to identify patterns and improvement opportunities.

**Standard Scrap Codes:**
- **QUALITY**: General quality issues
- **DAMAGE**: Physical damage
- **GROWTH**: Growth-related issues
- **ENVIRONMENT**: Environmental factors
- **EQUIPMENT**: Equipment-related problems
- **CLEANUP**: Corrections and adjustments

**Manager Responsibilities:**
1. Define scrap codes in Scrap table
2. Train staff on appropriate usage
3. Review scrap code reports regularly
4. Identify trends and root causes

### Scrap Analysis

**Daily Review:**
- Check scrap postings for abnormalities
- Verify scrap codes used appropriately
- Follow up on unusual scrap events

**Weekly Analysis:**
- Scrap by code report
- Scrap by item report
- Scrap trends over time
- Compare to safety quantity forecasts

**Monthly Strategic Review:**
- Adjust item overstart percentages
- Identify quality improvement opportunities
- Equipment maintenance correlation
- Environmental factors impact

### Quality Gates

**Pre-Production:**
- Verify safety quantity appropriate
- Review recent scrap trends for item
- Check equipment status

**Mid-Production:**
- Monitor actual vs. expected scrap
- Adjust safety if needed (authorization required)
- Escalate if scrap exceeds safety

**Post-Production:**
- Verify final output matches expectations
- Document deviations
- Update item overstart % if needed

---

## Reporting and Analytics

### Standard Reports

**Production Posting Summary:**
- Total output posted
- Total scrap posted
- Scrap by code breakdown
- Safety quantity utilization

**Capacity Ledger Analysis:**
- Output by operation
- Scrap by phase
- Run time analysis
- Efficiency metrics

**Scrap Trend Report:**
```sql
-- Example query concept
SELECT 
  Item,
  Month,
  SUM(Scrap) as TotalScrap,
  SUM(Output) as TotalOutput,
  (SUM(Scrap) / SUM(Output)) * 100 as ScrapRate
GROUP BY Item, Month
ORDER BY ScrapRate DESC
```

### KPIs for Managers

**Production Efficiency:**
- First Pass Yield: Output / (Output + Scrap)
- Safety Accuracy: Actual Scrap / Planned Safety
- Schedule Adherence: On-time completion rate

**Quality Metrics:**
- Scrap Rate by Product
- Scrap Rate by Phase
- Scrap Rate Trends
- Most Common Scrap Codes

**Cost Metrics:**
- Scrap Cost (Scrap Qty × Item Cost)
- Overproduction Cost (Safety Released - Scrap)
- Recovery Rate (Scrap Recovered / Total Scrap)

---

## Authorization and Security

### Safety Adjustment Authorization

**Setup:**
1. Navigate to **CLE Clesen Setup**
2. Field: **Safety Adjustment Authorization Group**
3. Specify authorization group code

**Authorization Group Management:**
1. Create Authorization Group (if needed)
2. Add authorized users to group
3. Users can now adjust safety quantities

**Security Model:**
```
Regular Staff:
  ✓ Post Output
  ✓ Adjust Quantity (standard operations)
  ✗ Adjust Safety Quantity

Managers/Supervisors:
  ✓ All staff functions
  ✓ Adjust Safety Quantity
  ✓ Override safety validations
  ✓ Access to all production orders

Administrators:
  ✓ All manager functions
  ✓ Setup configuration
  ✓ Authorization group management
  ✓ Direct database modifications (emergency only)
```

### Audit Trail

**What's Logged:**
- All output postings → Capacity Ledger Entries
- All scrap postings → Capacity Ledger Entries
- Quantity adjustments → Production Order change log
- Safety adjustments → Production Order Line history

**Review Capabilities:**
1. Open Capacity Ledger Entries for order
2. Filter by Entry Type (Output, Scrap)
3. Review posting dates, quantities, user IDs
4. Trace adjustments and corrections

---

## Best Practices

### Daily Operations

**Morning Review:**
1. Check production orders scheduled for today
2. Verify safety quantities appropriate
3. Review previous day's scrap postings
4. Address any pending issues

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

**Weekly:**
- Analyze scrap trends
- Adjust safety quantities proactively
- Review authorization group membership
- Staff training needs assessment

**Monthly:**
- Update item overstart percentages
- Quality improvement initiatives
- Cost analysis
- Process optimization

**Quarterly:**
- Comprehensive scrap analysis
- Safety quantity effectiveness review
- Authorization and security audit
- System optimization recommendations

### Common Management Scenarios

**Scenario 1: Consistently High Scrap**
```
Symptom: Scrap exceeds safety quantity regularly
Analysis:
  1. Review scrap codes for patterns
  2. Check equipment maintenance
  3. Evaluate environmental factors
  4. Consider process changes

Actions:
  1. Increase item overstart %
  2. Implement quality improvements
  3. Provide additional staff training
  4. Document findings
```

**Scenario 2: Consistently Low Scrap**
```
Symptom: Safety quantity rarely used
Analysis:
  1. Calculate average scrap rate
  2. Compare to item overstart %
  3. Consider cost of overproduction

Actions:
  1. Reduce item overstart %
  2. Adjust safety quantities manually
  3. Monitor for 2-3 cycles
  4. Standardize if successful
```

**Scenario 3: Sudden Scrap Spike**
```
Symptom: Single order with unexpected high scrap
Analysis:
  1. Identify scrap codes used
  2. Determine timing (which phase)
  3. Interview staff involved
  4. Check for external factors

Actions:
  1. Document incident thoroughly
  2. Determine if systemic or isolated
  3. Implement corrective actions
  4. Adjust current orders if needed
```

### Training and Development

**Staff Training Topics:**
- Proper output posting procedures
- Scrap code selection
- When to escalate to manager
- Quality standards

**Manager Training Topics:**
- Safety quantity strategy
- Scrap analysis techniques
- Authorization management
- System configuration

**Continuous Improvement:**
- Regular refresher training
- Share best practices across shifts
- Document lessons learned
- Update procedures based on feedback

---

## Emergency Procedures

### Production Order Corrections

**Wrong Quantity Posted:**
1. Determine if can use Adjust Quantity to correct
2. If scrap available: recover and re-post correctly
3. If not correctable: document and contact IT
4. Do not post additional transactions until resolved

**Wrong Phase Posted:**
1. Stop immediately
2. Document what was posted
3. Contact IT support
4. Do not attempt to reverse manually

**System Error During Posting:**
1. Note exact error message
2. Check if transaction completed (review ledger)
3. If completed: proceed normally
4. If not completed: retry or contact IT
5. Document for IT if recurring

### Escalation Path

**Level 1: Supervisor/Manager**
- Standard operational issues
- Staff questions
- Quality concerns
- Minor corrections

**Level 2: Production Manager**
- Complex quantity adjustments
- Strategic decisions
- Cross-functional issues
- Policy exceptions

**Level 3: IT Support**
- System errors
- Data corrections
- Complex reversals
- Configuration changes

---

## Quick Reference for Managers

### Authorization Matrix
```
Function                    | Staff | Manager | Admin
----------------------------|-------|---------|-------
Post Output                 |   ✓   |    ✓    |   ✓
Adjust Quantity (standard)  |   ✓   |    ✓    |   ✓
Adjust Safety Quantity      |   ✗   |    ✓    |   ✓
Override Validations        |   ✗   |    ✓    |   ✓
System Configuration        |   ✗   |    ✗    |   ✓
```

### Key Formulas
```
Safety Quantity = Requested Qty × Overstart %
Production Qty = Requested Qty + Safety Qty
Scrap Rate % = (Total Scrap / Total Output) × 100
Safety Utilization = (Actual Scrap / Safety Qty) × 100
```

### Decision Tree: Can I Increase Quantity?
```
Production Started?
├─ NO: Increase freely via Adjust Quantity
└─ YES: 
    └─ Posted Scrap Available?
        ├─ YES, Sufficient: Recover from scrap
        ├─ YES, Insufficient: Partial recovery + new order
        └─ NO: Create new production order
```

---

## Related documents

- [[prod-order-Posting-Documentation]]
- [[prod-order-posting-staff-guide]]
- [[prod-order-posting-it-troubleshooting-guide]]
- [[prod-order-task-staff-guide]]
- [[prod-order-task-manager-guide]]
- [[prod-order-task-it-troubleshooting-guide]]

---

**Questions or Issues?** Contact IT Support or Production Management Team.
