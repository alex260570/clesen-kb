# Purchase Receipt Process - Manager Guide

**Version:** 1.0  
**Last Updated:** February 13, 2026  
**Audience:** Warehouse managers, receiving supervisors, operations managers

---

## Table of Contents

1. [Overview](#overview)
2. [Process Oversight](#process-oversight)
3. [Quality Hold Management](#quality-hold-management)
4. [Exception Handling](#exception-handling)
5. [Vendor Performance Tracking](#vendor-performance-tracking)
6. [Training and Best Practices](#training-and-best-practices)
7. [Reporting and Analytics](#reporting-and-analytics)
8. [System Configuration](#system-configuration)

---

## Overview

### Manager Responsibilities

As a receiving manager, you are responsible for:

**Operational Excellence:**
- Ensure accurate and timely receipt of vendor shipments
- Maintain inventory accuracy standards (target: 99%+)
- Manage quality hold process and quarantine items
- Handle receiving exceptions and escalations

**Staff Management:**
- Train receiving staff on procedures
- Monitor staff performance and accuracy
- Provide guidance on complex scenarios
- Address system access and permissions

**Vendor Relations:**
- Track vendor performance metrics
- Handle shipment discrepancies
- Coordinate returns and credits
- Escalate chronic issues to purchasing

**System Oversight:**
- Configure reason codes and locations
- Monitor posting errors and issues
- Ensure data integrity
- Coordinate with IT on system problems

---

## Process Oversight

### Daily Management Tasks

#### Morning Activities

**Review Incoming Receipts:**
```
1. Open "Purchase Receipts" list
2. Check Expected Receipt Date column
3. Identify today's expected deliveries
4. Assign staff to handle each shipment
5. Note any special handling requirements
```

**Check Hold Location Status:**
```
1. Navigate to Quarantine Location (e.g., "HOLD-01")
2. Review items currently in hold
3. Prioritize quality inspections
4. Clear resolved items back to warehouse
5. Coordinate vendor returns if needed
```

**Staffing Planning:**
```
1. Review "CLE Cart Quantity" on incoming orders
2. Estimate labor hours needed
3. Assign staff based on volume and complexity
4. Plan for special shipments (hazmat, oversized, etc.)
```

#### Throughout the Day

**Monitor Progress:**
- Check which orders are being worked on
- Ensure staff entering data correctly
- Watch for posting errors or system issues
- Be available for questions and escalations

**Handle Exceptions:**
- Over-shipments requiring PO adjustments
- Variant mismatches not in system
- Significant quality issues
- Missing documentation

**Quality Checks:**
- Spot-check receiving accuracy (random line verification)
- Review hold decisions - appropriate reason codes?
- Verify bin assignments make sense
- Ensure vendor shipment numbers being captured

#### End of Day

**Completion Review:**
```
1. Check "Purchase Receipts" list for unprocessed orders
2. Review "Posted Purchase Receipts" for today's postings
3. Verify all expected deliveries were received or documented
4. Note any carryover items for tomorrow
5. Update daily receiving log/dashboard
```

**Hold Location Review:**
```
1. List all items added to hold today
2. Review reason codes - any patterns?
3. Schedule quality inspections for tomorrow
4. Alert purchasing of significant issues
5. Document actions taken
```

---

## Quality Hold Management

### Hold Strategy

**When to Hold Items:**

**Always Hold:**
- Visible physical damage
- Temperature concerns (cold-chain breaks)
- Wrong items/variants not in system
- Suspected contamination
- Safety issues

**Consider Holding:**
- Quality variations within specs but concerning
- Packaging issues (minor damage, torn labels)
- Count discrepancies > 5%
- Documentation mismatches
- Items for special testing/sampling

**Don't Hold (Receive Normally):**
- Minor cosmetic issues within tolerance
- Expected seasonal variations
- Labeling issues that can be fixed in-house
- Vendor-approved substitutions

### Quarantine Location Setup

**Location Configuration:**

Your warehouse should have:
1. **Primary Locations** - Normal warehouse (MAIN, WEST, etc.)
2. **Quarantine Locations** - Hold areas (HOLD-01, QC, QUARANTINE)

**Field:** Location Card → CLE Location Type = "Quarantine"

**Each Primary Location Links to Quarantine:**
- MAIN → HOLD-01
- WEST → HOLD-02
- GREENHOUSE → HOLD-GH

**Physical Layout:**
- Quarantine area physically separate from regular warehouse
- Clear signage: "Quality Hold - Do Not Pick"
- Organized by reason code if space allows
- Access controlled (only authorized personnel)

### Managing Hold Items

#### Daily Hold Review Process

**Step 1: Generate Hold Report**

Query to see all items in quarantine:
```sql
-- Run this in Business Central or SQL
SELECT 
    i."No." as ItemNo,
    i.Description,
    i.Inventory,
    il."Location Code",
    pr."Document No_" as OriginalPO,
    pr."Posting Date",
    pl."Return Reason Code" as ReasonCode
FROM "Item Ledger Entry" il
JOIN Item i ON il."Item No_" = i."No_"
LEFT JOIN "Purch_ Rcpt_ Line" pr ON il."Document No_" = pr."Document No_"
LEFT JOIN "Purchase Line" pl ON pr."Order No_" = pl."Document No_"
WHERE il."Location Code" IN ('HOLD-01', 'HOLD-02', 'HOLD-GH')
    AND il."Remaining Quantity" > 0
ORDER BY il."Posting Date", ReasonCode;
```

**Step 2: Categorize by Action Needed**

| Reason Code | Typical Action | Timeline |
|-------------|----------------|----------|
| DAMAGE | Inspect → Scrap or salvage | Same day |
| QUALITY | QC inspection → Release or return | 1-2 days |
| WRONG-ITEM | Verify with PO → Return to vendor | 2-3 days |
| SHORTAGE | Recount → Adjust or vendor claim | Same day |
| TEMP | Check viability → Sell discounted or scrap | Same day |
| LABEL | Re-label → Release | Same day |

**Step 3: Disposition Decision Matrix**

```
┌─────────────────────────────────────────────────────────────┐
│ Decision: Release to Warehouse                              │
│ When: Items pass inspection, issue resolved                 │
│ Action: Transfer from HOLD-XX to MAIN/WEST                  │
│ Documentation: Update hold log, note resolution             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Decision: Return to Vendor                                  │
│ When: Items fail quality standards, wrong items             │
│ Action: Create Purchase Return Order                        │
│ Documentation: Photos, inspection notes, vendor contact     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Decision: Scrap/Dispose                                     │
│ When: Items unsalvageable, below recovery value             │
│ Action: Post negative adjustment, document disposal         │
│ Documentation: Loss report, photos, approval signature      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Decision: Discounted Sale                                   │
│ When: Quality issues but still marketable                   │
│ Action: Transfer to clearance location, mark down price     │
│ Documentation: Price adjustment, quality notes              │
└─────────────────────────────────────────────────────────────┘
```

#### Releasing Items from Hold

**Manual Transfer Process:**

```
1. Verify item passed inspection/issue resolved
2. Open Item Reclassification Journal
3. Enter:
   - Item No.
   - Variant Code
   - From Location: HOLD-01
   - To Location: MAIN (or appropriate warehouse)
   - Quantity
   - Reason: "QC Passed" or resolution note
4. Post journal
5. Update hold tracking log
```

**Automated Workflow (if configured):**
- Quality inspector updates hold record
- System generates transfer order automatically
- Manager reviews and approves release
- Inventory moves on approval

---

## Exception Handling

### Over-Shipment Scenarios

**Scenario:** Vendor ships more than ordered

**Decision Tree:**

```
Is over-shipment < 10% of order?
├─ YES → Can we use the extra quantity?
│  ├─ YES → Contact purchasing to approve PO increase
│  │        Proceed with receipt after approval
│  └─ NO  → Return excess to vendor
│           Receive only ordered quantity
└─ NO  → Significant over-shipment
         STOP - Contact purchasing immediately
         Do not receive until resolved
         Options: Return all, partial acceptance, price negotiation
```

**PO Increase Procedure:**
1. Document actual quantity received
2. Get purchasing approval (email or system)
3. Purchasing adjusts PO line quantity
4. Refresh receipt page (close/reopen)
5. Proceed with receipt of full quantity

### Under-Shipment Scenarios

**Scenario:** Vendor ships less than ordered

**Actions:**

**Minor Shortage (< 10%):**
```
1. Receive actual quantity
2. Outstanding balance remains on PO
3. Note shortage on receiving log
4. Purchasing follows up with vendor on timing
```

**Significant Shortage (> 10%):**
```
1. Receive actual quantity
2. Document shortage with photos
3. Notify purchasing immediately
4. Purchasing contacts vendor:
   - When will balance ship?
   - Is this a partial shipment or short-ship?
   - Credit expected?
5. Update PO notes with vendor response
```

### Wrong Item/Variant Received

**Scenario:** Vendor sends different item than ordered

**Decision Matrix:**

| Situation | Action |
|-----------|--------|
| **Acceptable substitute** (pre-approved) | Change variant code, receive normally |
| **Better item** (higher value) | Contact purchasing for approval, may accept |
| **Wrong item** (not usable) | Full hold, return to vendor |
| **Variant not in system** | Request variant creation, hold until created |

**Variant Creation Process:**
1. Verify with vendor this is the actual item
2. Get item specs (size, color, UPC, etc.)
3. Contact inventory coordinator to create variant
4. Provide all details: Item No., new variant code, description
5. Once created, proceed with receipt

### Missing or Incorrect Documentation

**Common Issues:**

**Missing Packing Slip:**
```
Solution: 
- Take photo of shipment labels/boxes
- Use PO number as temporary Vendor Shipment No.
- Add note: "No packing slip - Photo on file"
- Contact vendor for documentation
- Update record when received
```

**Packing Slip Doesn't Match PO:**
```
Solution:
- Prioritize physical count over paperwork
- Document discrepancy in notes
- Receive actual physical quantity
- Purchasing investigates with vendor
- May result in adjustment or credit
```

**Missing COAs (Certificate of Analysis):**
```
Solution:
- For non-regulatory items: Receive, request COA
- For regulatory items: Hold until COA received
- Expedite COA request through vendor
- Track COA receipt separately
```

### System Errors During Posting

**Error:** "Vendor Shipment No. must have a value"
- **Cause:** Staff forgot required field
- **Fix:** Enter any value (PO number if no packing slip)

**Error:** "Quantity must be less than Outstanding Quantity"
- **Cause:** Over-shipment or data entry error
- **Fix:** Verify actual count, adjust PO if needed

**Error:** "Item Variant does not exist"
- **Cause:** Variant code not in system
- **Fix:** Have variant created or change to valid variant

**Error:** "Bin Code not valid for Location"
- **Cause:** Wrong bin or location combination
- **Fix:** Clear bin code or select valid bin

**Error:** "Nothing to post"
- **Cause:** All "Qty. to Receive" fields are zero
- **Fix:** Enter actual quantities to receive

---

## Vendor Performance Tracking

### Key Metrics to Monitor

#### On-Time Delivery Rate

**Formula:**
```
On-Time % = (Orders received on/before expected date / Total orders) × 100
```

**Target:** > 95%

**Tracking:**
```sql
-- Query to calculate vendor on-time performance
SELECT 
    ph."Buy-from Vendor No_",
    v.Name,
    COUNT(*) as TotalReceipts,
    SUM(CASE WHEN pr."Posting Date" <= ph."Expected Receipt Date" 
        THEN 1 ELSE 0 END) as OnTimeReceipts,
    CAST(SUM(CASE WHEN pr."Posting Date" <= ph."Expected Receipt Date" 
        THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) as OnTimePercentage
FROM "Purch_ Rcpt_ Header" pr
JOIN "Purchase Header" ph ON pr."Order No_" = ph."No_"
JOIN Vendor v ON ph."Buy-from Vendor No_" = v."No_"
WHERE pr."Posting Date" >= '2026-01-01'
GROUP BY ph."Buy-from Vendor No_", v.Name
ORDER BY OnTimePercentage ASC;
```

#### Quality Issues Rate

**Formula:**
```
Quality Issue % = (Receipts with holds / Total receipts) × 100
```

**Target:** < 5%

**By Reason Code:**
```sql
SELECT 
    pl."Return Reason Code",
    COUNT(DISTINCT pr."Document No_") as AffectedReceipts,
    SUM(pl.Quantity) as TotalQtyHeld,
    AVG(pl.Quantity) as AvgQtyPerIssue
FROM "Purch_ Rcpt_ Line" pr
JOIN "Purchase Line" pl ON pr."Order No_" = pl."Document No_"
WHERE pl."Return Reason Code" <> ''
    AND pr."Posting Date" >= '2026-01-01'
GROUP BY pl."Return Reason Code"
ORDER BY TotalQtyHeld DESC;
```

#### Accuracy Rate

**Formula:**
```
Accuracy % = (Lines received exactly as ordered / Total lines) × 100
```

**Tracks:** Quantity and item accuracy

**Target:** > 98%

#### Fill Rate

**Formula:**
```
Fill Rate % = (Quantity received / Quantity ordered) × 100
```

**Target:** > 95% on first shipment

### Monthly Vendor Scorecard

**Template:**

| Vendor | On-Time % | Quality % | Accuracy % | Fill Rate % | Overall Score |
|--------|-----------|-----------|------------|-------------|---------------|
| Vendor A | 98% | 2% issues | 99% | 97% | **A** |
| Vendor B | 85% | 8% issues | 95% | 92% | **C** |
| Vendor C | 92% | 3% issues | 98% | 96% | **B** |

**Scoring System:**
- A: 95%+ across all metrics - Excellent
- B: 90-94% average - Good
- C: 85-89% average - Needs improvement
- D: < 85% average - Escalate to purchasing for review

**Actions Based on Score:**
- **A-rated vendors:** Preferred status, increase order volume
- **B-rated vendors:** Monitor, provide feedback
- **C-rated vendors:** Formal corrective action, reduce orders
- **D-rated vendors:** Escalate, consider alternative sources

---

## Training and Best Practices

### Staff Training Program

#### Initial Training (New Hires)

**Week 1: Shadow Experienced Staff**
- Observe 10+ receipts
- Learn physical layout and locations
- Understand quality standards
- Practice counting techniques

**Week 2: Supervised Practice**
- Process simple receipts under supervision
- Manager reviews each posting before approval
- Practice quality hold decisions
- Learn common scenarios

**Week 3: Independent Work**
- Process receipts independently
- Manager spot-checks accuracy
- Handle first exceptions
- Demonstrate proficiency

**Certification:**
- Pass written test (80%+)
- Complete 20 receipts with 98%+ accuracy
- Demonstrate hold process
- Handle 3 exception scenarios correctly

#### Ongoing Training

**Monthly:**
- Review new reason codes or procedures
- Discuss challenging scenarios from past month
- Refresh on quality standards
- Share vendor feedback

**Quarterly:**
- System updates and new features
- Accuracy review and improvement plans
- Customer impact of receiving accuracy
- Best practices from top performers

**Annually:**
- Full process review
- Inventory valuation impact
- Safety and ergonomics
- Career development

### Quality Assurance Program

#### Manager Spot Checks

**Daily Random Verification:**
```
1. Select 3-5 receipts at random
2. Physically verify:
   - Count matches posted quantity (±1 unit tolerance)
   - Items in correct locations/bins
   - Variant codes match physical items
   - Hold decisions appropriate
3. Accuracy target: 98%+
4. Document results in QA log
5. Provide feedback to staff (positive and corrective)
```

**Red Flags to Watch:**
- Same staff member has repeated errors
- Specific vendor shipments consistently problematic
- Certain item types have higher error rates
- Time of day correlation (end of shift issues?)

#### Corrective Actions

**Minor Errors (1-2% variance):**
- Verbal coaching
- Retrain on specific area
- Increase spot-check frequency for that person

**Moderate Errors (3-5% variance):**
- Written corrective action plan
- Mandatory retraining
- Daily supervisor review for 2 weeks
- Follow-up assessment

**Major Errors (> 5% variance or critical):**
- Immediate removal from receiving duties
- Full retraining program
- Performance improvement plan
- Consider reassignment if no improvement

---

## Reporting and Analytics

### Daily Reports

#### Receiving Activity Summary

**Metrics:**
- Orders processed
- Total lines received
- Total quantity received
- Items on hold (count and reason breakdown)
- Posting errors encountered
- Staff productivity (receipts per hour)

**Sample Dashboard:**
```
Date: February 13, 2026
─────────────────────────────────────
Receipts Processed:     42 orders
Lines Received:         387 lines
Total Quantity:         45,823 units
Items on Hold:          12 lines (3.1%)
  - DAMAGE:            5 lines
  - QUALITY:           4 lines
  - SHORTAGE:          3 lines
Posting Errors:         2 (resolved)
Avg Time per Receipt:   8.3 minutes
Staff Productivity:     Good ✓
```

### Weekly Reports

#### Vendor Performance Summary

**For Each Vendor:**
- Receipts this week
- On-time performance
- Quality issues
- Outstanding holds
- Action items

#### Hold Status Report

**Items in Quarantine:**
- Item number and description
- Quantity
- Days in hold
- Reason code
- Next action and owner

**Aging Analysis:**
```
0-1 days:    45 lines (Normal)
2-3 days:    12 lines (Review)
4-7 days:    3 lines  (Priority - aging)
> 7 days:    1 line   (CRITICAL - resolve immediately)
```

### Monthly Reports

#### Receiving KPIs

**Accuracy Metrics:**
- Overall receiving accuracy %
- By staff member
- By vendor
- By product category
- Error trending

**Efficiency Metrics:**
- Average time per receipt
- Lines processed per labor hour
- Peak vs. off-peak performance
- Overtime utilization

**Quality Metrics:**
- Hold rate by reason code
- Vendor quality scores
- Resolution time for holds
- Cost impact of quality issues

**Sample Monthly Report:**
```
RECEIVING DEPARTMENT - JANUARY 2026
═══════════════════════════════════════════════════════════

VOLUME
  Orders Received:             876 orders (+12% vs Dec)
  Lines Processed:            8,342 lines
  Total Units:              1,234,567 units

ACCURACY
  Overall Accuracy:            99.2% (Target: 99%+) ✓
  Staff A:                     99.8% (Excellent)
  Staff B:                     99.4% (Good)
  Staff C:                     97.9% (Below target - retrain)

QUALITY HOLDS
  Total Hold Rate:              2.8% (Target: < 5%) ✓
    DAMAGE:                     1.2%
    QUALITY:                    0.9%
    WRONG-ITEM:                 0.4%
    Other:                      0.3%
  Avg Resolution Time:         1.8 days (Target: < 3) ✓

VENDOR PERFORMANCE
  Top Performers (A-rated):    18 vendors
  Needs Improvement (C/D):     3 vendors
  Escalations:                 1 vendor (chronic late delivery)

EFFICIENCY
  Avg Time per Receipt:        7.4 minutes
  Peak Day:                   68 receipts (Feb 5)
  Overtime:                    12 hours (1.2% of total)

ACTION ITEMS
  1. Retrain Staff C on accuracy
  2. Follow up with 3 underperforming vendors
  3. Escalate Vendor XYZ late delivery issue
  4. Implement new reason code for "TEMP" issues
```

---

## System Configuration

### Reason Codes Setup

**Navigation:** Search → "Return Reasons"

**Standard Reason Codes:**

| Code | Description | Use Case |
|------|-------------|----------|
| DAMAGE | Physical Damage | Broken pots, crushed boxes, bent stems |
| QUALITY | Quality Issues | Wrong color, size out of spec, poor appearance |
| SHORTAGE | Count Discrepancy | Suspected shortage needing verification |
| WRONG-ITEM | Wrong Item Sent | Vendor sent wrong item or variant |
| TEMP | Temperature Issue | Cold chain break, heat damage |
| LABEL | Labeling Problem | Missing labels, wrong tags, barcode issues |
| PEST | Pest Concerns | Insects, disease visible |
| ROOT | Root Issues | Root-bound, damaged roots, dry root ball |

**Adding New Reason Codes:**
```
1. Open "Return Reasons" page
2. Click New
3. Enter:
   - Code: Up to 10 characters (e.g., "FROST")
   - Description: Clear explanation (e.g., "Frost Damage")
4. Save
5. Train staff on when to use new code
6. Update documentation
```

### Location Configuration

**Quarantine Location Setup:**

```
1. Open "Locations" page
2. Create or edit quarantine location
3. Key fields:
   - Code: e.g., "HOLD-01"
   - Name: "Quality Hold - Main Warehouse"
   - Use As In-Transit: NO (important!)
   - CLE Location Type: "Quarantine"
4. For each regular location:
   - Open location card (e.g., "MAIN")
   - Set field "CLE Quarantine Location" = "HOLD-01"
5. Save all
```

**Best Practices:**
- One quarantine location per physical warehouse
- Clear naming: HOLD-01, HOLD-02, not just "QC"
- Set up bin management in hold locations if needed
- Configure restricted access (only authorized users)

### User Permissions

**Receiving Staff:**
- Read: Purchase Orders, Item Master, Vendors
- Write: Purchase Receipt posting
- No access to: Price changes, PO creation, vendor setup

**Supervisors/Managers:**
- All receiving staff permissions, plus:
- Write: Item Reclassification (to release from hold)
- Write: Purchase Returns
- Read: Vendor performance reports

**Setup/Admin:**
- All permissions
- Write: Location setup, Reason codes, User setup

**Permission Set Example:**
```
Permission Set: RECV-STAFF
─────────────────────────────────────
Table           Permissions
Purchase Header Read, Insert, Modify
Purchase Line   Read, Insert, Modify
Item            Read
Location        Read
Bin Content     Read, Modify
Page            Access
50023           Execute (CLE Purchase Receipt)
50035           Execute (Purchase Receipt Subform)
50036           Execute (CLE Purchase Receipts)
```

---

## Troubleshooting - Manager Level

### Staff Reports: "System is Slow"

**Diagnosis:**
1. How many lines on the order? (>100 lines can be slow)
2. Is it everyone or one person? (PC issue vs. server issue)
3. What time of day? (peak system load?)

**Solutions:**
- Large orders: Process in batches (split receipts)
- One person: Check PC performance, network connection
- Peak times: Schedule heavy receipts during off-peak hours
- Persistent: Contact IT for server performance review

### Recurring Errors from Same Staff Member

**Pattern Analysis:**
```
Questions to ask:
1. What types of items? (Complex variants? Specific vendor?)
2. Time of day? (End of shift fatigue?)
3. Specific process step? (Counting? Data entry?)
4. Training gap or attention issue?
```

**Resolution:**
- Retrain on problem area
- Assign simpler receipts temporarily
- Pair with experienced staff
- Adjust schedule if fatigue-related
- Consider role fit if persistent

### Vendor Disputes Receipt Quantities

**Investigation Process:**
```
1. Pull Posted Purchase Receipt
2. Check:
   - Who posted? (staff member)
   - When? (date/time)
   - Vendor Shipment No. (packing slip reference)
3. Review any notes or photos
4. Check for hold transactions (some may be in quarantine)
5. Interview staff member who received
6. Compile evidence:
   - Physical count notes
   - System records
   - Photos if available
   - Packing slip copy
7. Provide to purchasing for vendor negotiation
```

**Documentation Best Practices:**
- Require photos for all disputed shipments
- Keep receiving logs with staff signatures
- Maintain vendor shipment documentation
- Record count discrepancies immediately

---

## Best Practices Summary

### For Managers

**Daily:**
✅ Review expected receipts and assign staff  
✅ Monitor hold location and prioritize inspections  
✅ Be available for staff questions and exceptions  
✅ Spot-check accuracy on 3-5 receipts  
✅ Clear aged items from hold  

**Weekly:**
✅ Review vendor performance metrics  
✅ Analyze quality hold trends  
✅ Provide staff feedback (positive and corrective)  
✅ Update procedures based on issues encountered  
✅ Meet with purchasing on chronic vendor issues  

**Monthly:**
✅ Generate and review KPI reports  
✅ Conduct staff training/refresher  
✅ Review reason code usage  
✅ Audit system configuration  
✅ Plan improvements based on data  

---

## Escalation Guidelines

### When to Escalate to Operations Manager

- Receiving accuracy below 98% for 2+ weeks
- Staff performance issues not resolving with coaching
- System problems affecting multiple users
- Vendor issues requiring contract review
- Need for additional headcount or equipment

### When to Escalate to IT

- Posting errors with unclear causes
- System slowness affecting productivity
- Need new reason codes or location configuration
- Permission issues
- Data integrity concerns

### When to Escalate to Purchasing

- Vendor quality scores below C for 2+ months
- Chronic late deliveries
- Significant over/under shipments
- Need for vendor corrective action
- Contract compliance issues

---

**Document Version:** 1.0  
**Created:** February 13, 2026  
**Last Review:** February 13, 2026  
**Next Review:** August 13, 2026  
**Owner:** Operations Management

---

## Related documents

- [[purchase-receipt-process]]
- [[purchase-receipt-staff-guide]]
- [[purchase-receipt-it-troubleshooting-guide]]
