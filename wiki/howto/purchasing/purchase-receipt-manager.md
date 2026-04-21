---
title: Purchase Receipt — Manager's Guide
type: howto
tags: [purchasing, receiving, manager, quality-control, vendor-performance]
created: 2026-04-21
updated: 2026-04-21
sources: [purchase-receipt-manager-guide.md]
---

# Purchase Receipt — Manager's Guide

Oversee receiving operations, manage quality holds, track vendor performance, and handle exceptions.

## Manager Responsibilities

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

## Daily Management Tasks

### Morning Activities

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

### Throughout the Day

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
- Review hold decisions — appropriate reason codes?
- Verify bin assignments make sense
- Ensure vendor shipment numbers being captured

### End of Day

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
2. Review reason codes — any patterns?
3. Schedule quality inspections for tomorrow
4. Alert purchasing of significant issues
5. Document actions taken
```

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

### Managing Hold Items

**Daily Hold Review Process:**

1. **Generate Hold Report** — See all items in quarantine
2. **Categorize by Action Needed** — Map to typical timelines
3. **Disposition Decision Matrix**:
   - **Release to Warehouse** — Items pass inspection, issue resolved
   - **Return to Vendor** — Items fail quality standards, wrong items
   - **Scrap/Dispose** — Items unsalvageable, below recovery value
   - **Discounted Sale** — Quality issues but still marketable

**Releasing Items from Hold:**

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

## Vendor Performance Tracking

### Key Metrics to Monitor

#### On-Time Delivery Rate

**Formula:**
```
On-Time % = (Orders received on/before expected date / Total orders) × 100
```

**Target:** > 95%

#### Quality Issues Rate

**Formula:**
```
Quality Issue % = (Receipts with holds / Total receipts) × 100
```

**Target:** < 5%

**By Reason Code:**
- Track which codes appear most frequently
- Identify patterns (vendor-specific or item-specific)

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
- A: 95%+ across all metrics — Excellent
- B: 90-94% average — Good
- C: 85-89% average — Needs improvement
- D: < 85% average — Escalate to purchasing for review

**Actions Based on Score:**
- **A-rated vendors:** Preferred status, increase order volume
- **B-rated vendors:** Monitor, provide feedback
- **C-rated vendors:** Formal corrective action, reduce orders
- **D-rated vendors:** Escalate, consider alternative sources

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

## Best Practices Summary

### Daily

✅ Review expected receipts and assign staff  
✅ Monitor hold location and prioritize inspections  
✅ Be available for staff questions and exceptions  
✅ Spot-check accuracy on 3-5 receipts  
✅ Clear aged items from hold  

### Weekly

✅ Review vendor performance metrics  
✅ Analyze quality hold trends  
✅ Provide staff feedback (positive and corrective)  
✅ Update procedures based on issues encountered  
✅ Meet with purchasing on chronic vendor issues  

### Monthly

✅ Generate and review KPI reports  
✅ Conduct staff training/refresher  
✅ Review reason code usage  
✅ Audit system configuration  
✅ Plan improvements based on data  

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

## Related Pages

- [[purchase-receipt-overview]]
- [[purchase-receipt-staff]]
- [[purchase-receipt-it-troubleshooting]]
