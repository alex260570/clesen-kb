---
title: Production Order Posting
type: howto
tags: [production, posting, output, scrap, safety-quantity]
created: 2026-04-21
updated: 2026-05-01
sources: [prod-order-posting-staff-guide.md, prod-order-posting-manager-guide.md]
---

# Production Order Posting

Record finished production output, manage quantities, and control safety buffers.

## What This Is

Production Order Posting is how staff record what they've produced and managers oversee output quality and quantity management. This guide covers both staff posting procedures and manager oversight.

## For Warehouse/Production Staff

### Posting Output

#### When to Use
- Completed a production phase
- Need to record finished goods
- Have scrap to report

#### Step-by-Step

1. **Open Production Order**
   - Navigate to **Released Production Orders**
   - Find your order

2. **Click Post Output (or press F9)**
   - Dialog opens showing:
     - Current production phase
     - Expected output quantity
     - Posting date

3. **Enter Information**

   **Output Quantity:** Amount of good, usable product (cannot exceed calculated)

   **Finished Checkbox:** ☑ if phase is complete
   - Converts any difference to scrap automatically

   **Scrap Quantity:** Amount of waste
   - Auto-calculated if "Finished" checked
   - Can be manually entered
   - **Required** if scrap > 0

   **Scrap Code:** Select reason (QUALITY, DAMAGE, GROWTH, etc.)
   - **Required** if scrap posted

   **Run Time:** Time spent on phase (optional, for capacity planning)

   **Variant Code:** Required at final phase if item has variants
   - System auto-fills with current blooming stage variant
   - Can override if needed

   **Release Safety:** ☑ at final phase
   - Releases safety buffer as available output

4. **Confirm and Post**
   - Click **OK**
   - System posts to inventory

#### Example: Posting Final Output

**Scenario:** Final phase, 1030 units calculated

- Output Quantity: 1000
- Finished: ☑ Checked
- Scrap: 30 (auto-calculated)
- Scrap Code: GROWTH
- Release Safety: ☑ Checked
- Result: 1000 finished goods, 30 scrapped

### Adjusting Quantity Down (Scrapping)

#### When to Use
- Reduce production order quantity
- Discover more scrap than initially planned
- Cancel part of order

#### Step-by-Step

1. **Click Adjust Quantity**
2. **Review Current Information**
   - Current quantity
   - Already posted scrap
3. **Enter New Quantity**
   - System calculates: Scrap = Current - New
4. **Select Scrap Code** (required if production started)
5. **Confirm**
   - System shows: "X Scrap with Code Y will be posted. Correct?"
   - Click **Yes**

#### Important Rules

**If Production Has Started:**
- Scrap code mandatory
- System posts actual scrap transaction
- History preserved

**If Production Hasn't Started:**
- Can adjust without scrap code
- System updates quantity directly
- No scrap transaction created

**Setting to Zero:**
- If no postings: deletes production line
- If postings exist: posts all remaining as scrap

### Adjusting Quantity Up (Recovery)

#### When to Use
- Quality assessment too pessimistic
- Previously scrapped items actually usable
- Need to increase production quantity

#### Step-by-Step

1. **Click Adjust Quantity**
2. **Enter New Higher Quantity**
3. **System Checks Posted Scrap**
   - Can only increase by available scrap amount
4. **Confirm Recovery**
   - Message: "Order will be adjusted by X. Existing scrap posting will be reduced by X. Correct?"
5. **Click Yes**

#### Limitations

**Can Increase If:**
- Production hasn't started (freely)
- Have posted scrap available

**Cannot Increase If:**
- Production started AND no scrap available
- Requested increase exceeds available scrap

**Solution:** Create new production order for additional quantity

### Common Scenarios

#### Normal Production Finish
1. Post Output
2. Verify output matches actual
3. Check "Finished"
4. Enter any scrap
5. Release safety at final phase
6. Post

#### Major Quality Issue Mid-Production
1. Adjust Quantity
2. Enter reduced quantity
3. Select scrap code
4. Confirm
5. Continue with reduced quantity

#### Quality Re-Assessment
1. Adjust Quantity
2. Increase quantity (recovers from posted scrap)
3. System recovers posted scrap
4. Continue production

#### Cancel Order Before Start
1. Adjust Quantity
2. Set New Quantity: 0
3. Confirm (deletes production line)

#### Partial Phase Completion
1. Post Output
2. Enter partial quantity
3. DO NOT check "Finished"
4. Enter scrap if any
5. Can post more output later

### Troubleshooting

#### Cannot Post More Output Than Calculated
**Error:** "Cannot post more Output than 1030"

**Solution:** Use Adjust Quantity to increase order first, then post

#### Scrap Code Required
**Error:** "Scrap Code may not be empty"

**Solution:** Always select code when scrap > 0

#### Variant Code Required
**Error:** "Variant Code may not be empty"

**Solution:** At final phase with variants, select from lookup

#### Cannot Increase Quantity
**Error:** "Cannot increase quantity. Insufficient scrap to recover"

**Solution:**
- Check Posted Scrap amount
- Can only increase up to that amount
- Create new order for additional quantity

### Best Practices

✓ Always verify production order number before posting  
✓ Count carefully before entering quantities  
✓ Select correct scrap code (accurate reporting)  
✓ Check variant code at final phase  
✓ Post immediately after completing phase  
✓ Document unusual situations  
✓ Ask supervisor if unsure  

### Quick Reference

**Post Output (F9):**
- Output Quantity (required)
- Scrap Code (if scrap > 0)
- Variant Code (if final phase with variants)
- Finished checkbox (completes phase)
- Release Safety (at final phase)

**Adjust Quantity:**
- Decrease: enter lower quantity + scrap code
- Increase: enter higher quantity (recovers scrap)

**When to Call Supervisor:**
- Cannot post/adjust (errors)
- Posted to wrong phase
- Need to increase but no scrap
- Unsure of scrap code

## For Managers

### Safety Quantity Management

#### Understanding Safety Quantity

**Safety Quantity (Overstart):** Buffer for expected production losses.

```
Requested Qty: 1000 units (customer order)
Item Overstart %: 3%
Safety Qty: 30 units (1000 × 3%)
Production Qty: 1030 units
```

#### Safety Quantity Lifecycle

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

#### Manual Safety Adjustment

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

#### Safety Best Practices

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

### Advanced Quantity Adjustments

#### Decision Matrix: Can I Increase Quantity?

```
Production Started?
├─ NO: Increase freely
└─ YES:
    └─ Posted Scrap Available?
        ├─ YES, Sufficient: Recover from scrap
        ├─ YES, Insufficient: Partial recovery + new order
        └─ NO: Create new production order
```

#### Scrap Recovery Engine

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

### Phase-Specific Posting Strategy

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

### Quality Control Integration

#### Scrap Code Management

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

#### Scrap Analysis

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

#### Quality Gates

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

### Authorization and Security

#### Safety Adjustment Authorization

**Setup:**
1. Navigate to **CLE Clesen Setup**
2. Set **Safety Adjustment Authorization Group**
3. Add authorized users to group

**Authorization Levels:**
- **Staff:** Post output, adjust quantities (standard)
- **Managers:** All staff functions + adjust safety + overrides
- **Admins:** All + system configuration

### Reporting and KPIs

#### Key Metrics

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

### Management Workflows

#### Scenario: Consistently High Scrap

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

#### Scenario: Consistently Low Scrap

**Analysis:**
1. Calculate average scrap rate
2. Compare to item overstart %
3. Consider cost of overproduction

**Actions:**
1. Reduce item overstart %
2. Adjust safety quantities
3. Monitor for 2-3 cycles
4. Standardize if successful

#### Scenario: Sudden Scrap Spike

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

### Best Practices

#### Daily Operations

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

#### Strategic Management

**Weekly:** Analyze scrap trends, adjust safety, review authorizations  
**Monthly:** Update overstart %, quality improvements, cost analysis  
**Quarterly:** Comprehensive scrap analysis, safety effectiveness, security audit  

## Related Pages

- [[prod-order-overview]]
- [[prod-order-task]]
- [[production-order-posting-it-troubleshooting]]
