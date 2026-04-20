# Purchase Receipt Process Documentation

This folder contains comprehensive documentation for the Purchase Receipt and vendor receiving system.

---

## Overview

The Purchase Receipt system is a streamlined receiving workflow that allows warehouse staff to receive incoming vendor shipments into inventory. The system includes specialized functionality for quality holds and quarantine management.

### Key Features

- **Simplified receiving interface** - focused on essential fields only
- **Quality hold process** - route problematic items to quarantine automatically
- **Variant flexibility** - adjust item variants during receiving if vendor substituted
- **Partial receiving** - receive shipments in multiple batches
- **Quarantine location routing** - automatic location assignment for hold items
- **Reason code tracking** - document why items placed on hold

---

## Documentation Files

### [Staff Guide](purchase-receipt-staff-guide.md)
**Audience:** Warehouse receiving staff, operations personnel

**Contents:**
- Step-by-step receiving procedures
- Quality hold process instructions
- Common scenarios and examples
- Troubleshooting tips
- Quick reference card

**Use this when:** You need to receive a vendor shipment, handle damaged items, or look up how to process specific scenarios.

**Key Topics:**
- Standard receipt process
- Quality hold ("To Hold Location")
- Entering vendor shipment numbers
- Adjusting quantities and variants
- Posting receipts

---

### [Manager Guide](purchase-receipt-manager-guide.md)
**Audience:** Warehouse managers, receiving supervisors, operations managers

**Contents:**
- Process oversight and daily management
- Quality hold management strategies
- Exception handling procedures
- Vendor performance tracking
- Training programs and best practices
- Reporting and analytics

**Use this when:** You need to manage receiving operations, handle exceptions, track vendor performance, train staff, or analyze receiving data.

**Key Topics:**
- Daily management tasks
- Hold location review and disposition
- Exception handling (over/under shipments, wrong items)
- Staff training and certification
- KPI tracking and scorecards
- System configuration

---

### [IT Troubleshooting Guide](purchase-receipt-it-troubleshooting-guide.md)
**Audience:** IT support staff, system administrators, developers

**Contents:**
- System architecture and data flow
- Technical component details
- Common issues and solutions
- Data integrity checks
- Error message reference
- Manual correction procedures
- Performance optimization
- Debugging procedures

**Use this when:** You need to troubleshoot system errors, optimize performance, understand technical implementation, or perform manual data corrections.

**Key Topics:**
- Custom pages and codeunits
- Hold splitting logic
- Database structure
- Permission configuration
- SQL diagnostic queries
- AL debugging procedures

---

## Key Concepts

### Purchase Receipt Process

The receiving workflow:
1. Staff opens **Purchase Receipts** list page (sorted by expected date)
2. Selects purchase order matching vendor packing slip
3. Enters **Vendor Shipment No.** (REQUIRED field)
4. Adjusts quantities and variants as needed
5. Uses **"To Hold Location"** for problem items (optional)
6. Presses **F9** to post receipt
7. Inventory updated, receipt document created

### Quality Hold System

**Purpose:** Route items needing inspection or having issues to quarantine location instead of regular warehouse.

**How It Works:**
- Each warehouse location (MAIN, WEST, etc.) has an assigned **Quarantine Location** (HOLD-01, HOLD-02, etc.)
- Staff clicks "To Hold Location" on problem line
- Enters quantity and selects **Reason Code** (DAMAGE, QUALITY, SHORTAGE, etc.)
- System automatically:
  - Creates new line (partial hold) OR modifies existing line (full hold)
  - Routes to quarantine location
  - Applies reason code for tracking

**Business Value:**
- Prevents problematic items from being picked for orders
- Tracks quality issues by vendor and reason
- Enables inspection workflow
- Simplifies returns and credits

### Reason Codes

Standard codes for documenting hold decisions:

| Code | Purpose |
|------|---------|
| **DAMAGE** | Physical damage (broken, crushed, bent) |
| **QUALITY** | Quality/specification issues |
| **SHORTAGE** | Count discrepancies needing verification |
| **WRONG-ITEM** | Vendor sent incorrect item/variant |
| **TEMP** | Temperature concerns (cold chain break) |
| **LABEL** | Labeling or documentation problems |

### Quarantine Locations

**Configuration:**
- **Location Type** field distinguishes quarantine from regular locations
- Each regular location linked to one quarantine location
- Quarantine locations have "Use As In-Transit" = NO
- Physical areas clearly marked as quality hold zones

**Typical Setup:**
```
MAIN (Primary Warehouse) → HOLD-01 (Main Quality Hold)
WEST (West Warehouse) → HOLD-02 (West Quality Hold)
GREENHOUSE → HOLD-GH (Greenhouse Hold)
```

---

## Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Vendor Delivery Arrives                                  │
│    - Physical shipment at receiving dock                     │
│    - Packing slip/BOL provided                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Staff Opens Purchase Receipts List                       │
│    - Finds matching PO by vendor and date                   │
│    - Opens purchase receipt card                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Data Entry                                               │
│    - Enter Vendor Shipment No. (REQUIRED)                   │
│    - Count items and enter quantities                       │
│    - Adjust variants if substitutions                       │
│    - Update bin codes if needed                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├──────────────────────────┐
                     │                          │
          All Items Good                  Some Items Problem
                     │                          │
                     ▼                          ▼
┌────────────────────────────┐    ┌──────────────────────────┐
│ 4a. Standard Posting      │    │ 4b. Quality Hold Process │
│     - Press F9             │    │     - Select problem line│
│     - All to warehouse     │    │     - Click "To Hold"    │
│     - Done!                │    │     - Enter quantity     │
└────────────────────────────┘    │     - Select reason code │
                                   │     - Line splits/moves  │
                                   │     - Press F9 to post   │
                                   └────────┬─────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────┐
                     │ 5. Posted Purchase Receipt Created       │
                     │    - Good items → Warehouse (MAIN, etc.) │
                     │    - Hold items → Quarantine (HOLD-01)   │
                     │    - Inventory updated in both locations │
                     └──────────────────┬───────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Post-Receipt Processing                                  │
│    - Good items: Available for picking immediately          │
│    - Hold items: Routed to quality team for inspection      │
│    - Manager reviews hold items and decides disposition     │
│    - Options: Release to warehouse, return to vendor, scrap │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start Guide

### For New Staff

**Day 1:**
1. Read [Staff Guide](purchase-receipt-staff-guide.md) sections 1-3
2. Shadow experienced staff on 5+ receipts
3. Understand physical warehouse layout
4. Learn quality standards

**Week 1:**
1. Complete Staff Guide sections 4-6
2. Practice simple receipts under supervision
3. Learn common scenarios
4. Get familiar with system navigation

**Week 2:**
1. Process receipts independently
2. Handle first quality hold
3. Practice exception scenarios
4. Take proficiency assessment

### For Managers

**New to Role:**
1. Review [Manager Guide](purchase-receipt-manager-guide.md) completely
2. Understand staff training requirements
3. Set up vendor scorecards
4. Configure reason codes and locations

**Monthly Tasks:**
1. Review vendor performance metrics
2. Analyze quality hold trends
3. Conduct staff training refresher
4. Update procedures based on issues

### For IT Support

**New System:**
1. Read [IT Guide](purchase-receipt-it-troubleshooting-guide.md) sections 1-2
2. Understand technical architecture
3. Review custom components
4. Set up monitoring

**Support Calls:**
1. Check Common Issues section first
2. Run data integrity checks
3. Review error message reference
4. Use debugging procedures if needed

---

## System Components

### Custom Pages

| Page ID | Name | Purpose |
|---------|------|---------|
| 50023 | CLE Purchase Receipt | Receipt card interface |
| 50035 | CLE Purchase Receipt Subform | Line entry |
| 50036 | CLE Purchase Receipts | Open orders list |
| 50052 | CLE Pick Quantity to Send | Hold quantity dialog |

### Custom Codeunits

| Codeunit ID | Name | Purpose |
|-------------|------|---------|
| 50011 | CLE Purch. Receipt Management | Hold splitting logic |

### Table Extensions

| Extension ID | Base Table | Purpose |
|--------------|------------|---------|
| 50032 | Purchase Header | Adds Cart Quantity field |
| 50042 | Purchase Line | Adds cart and pot size fields |
| 50028 | Location | Adds quarantine location link |

### Source Code Locations

```
app/
  3 Pages/
    Operations/
      50023.Page.CLE.PurchaseReceipt.al
      50035.Page.CLE.PurchaseReceiptSubform.al
      50036.Page.CLE.PurchaseReceipts.al
      Pag50052.CLEPickQuantitytoSend.al
  5 Codeunits/
    Operations/
      50011.Codeunit.CLE.PurchReceiptManagement.al
  2 Table Extensions/
    Sales/
      50032.TableExtension.CLE.PurchHeader.al
    Purchasing/
      50042.Tab-Ext.CLE.PurchaseLine.al
    Inventory/
      50028.Tab-Ext.CLE.CLELocation.al
```

---

## Common Scenarios

### Scenario 1: Normal Receipt (No Issues)
**Frequency:** 85-90% of receipts

1. Open PO from list
2. Enter Vendor Shipment No.
3. Verify quantities
4. Post (F9)

**Time:** 2-3 minutes  
**Guide:** Staff Guide Section 3

---

### Scenario 2: Partial Shipment
**Frequency:** 10-15% of receipts

1. Open PO from list
2. Enter Vendor Shipment No.
3. Reduce quantities to actual received
4. Post (F9)
5. Remaining quantity stays on PO

**Time:** 3-5 minutes  
**Guide:** Staff Guide Section 5 - Scenario 2

---

### Scenario 3: Damaged Items (Partial Hold)
**Frequency:** 3-5% of receipts

1. Open PO from list
2. Enter Vendor Shipment No.
3. Count good and damaged separately
4. Select line with damage
5. Click "To Hold Location"
6. Enter damaged quantity
7. Select reason: DAMAGE
8. Post (F9)
9. Good items → warehouse, damaged → quarantine

**Time:** 5-8 minutes  
**Guide:** Staff Guide Section 4, Manager Guide Section 3

---

### Scenario 4: Wrong Variant Received
**Frequency:** 2-3% of receipts

1. Open PO from list
2. Enter Vendor Shipment No.
3. Change Variant Code to actual received
4. Post (F9)

**Time:** 3-4 minutes  
**Guide:** Staff Guide Section 5 - Scenario 4

---

## Key Performance Indicators

### Operational KPIs

**Accuracy Rate:** % of receipts with no errors
- **Target:** > 99%
- **Measured:** Spot checks, audits
- **Owner:** Manager

**Throughput:** Receipts processed per labor hour
- **Target:** 8-10 receipts/hour (varies by complexity)
- **Measured:** Time tracking
- **Owner:** Manager

**Quality Hold Rate:** % of receipts with items on hold
- **Target:** < 5%
- **Measured:** System data
- **Owner:** Manager & Quality

### Vendor KPIs

**On-Time Delivery:** % received on/before expected date
- **Target:** > 95%
- **Measured:** Expected vs. actual receipt date
- **Owner:** Purchasing

**Quality Score:** Composite of damage, accuracy, fill rate
- **Target:** A or B rating
- **Measured:** Monthly scorecard
- **Owner:** Manager & Purchasing

**Fill Rate:** % of ordered quantity actually received
- **Target:** > 95% on first shipment
- **Measured:** Ordered vs. received quantity
- **Owner:** Purchasing

---

## Training Resources

### Staff Training

**Initial Training:**
- Staff Guide complete
- 3 weeks supervised practice
- Written and practical assessments
- Manager certification required

**Ongoing Training:**
- Monthly scenario reviews
- Quarterly system updates
- Annual full refresher
- New feature training as released

### Manager Training

**Initial Training:**
- All staff training plus Manager Guide
- Vendor scorecard setup
- Exception handling practice
- System configuration training

**Ongoing:**
- Monthly KPI review
- Quarterly best practices sharing
- Annual process optimization review

### IT Training

**Initial Training:**
- IT Guide complete
- Sandbox testing environment
- Debugging practice
- Data integrity check procedures

**Ongoing:**
- New version release notes
- Performance optimization techniques
- Integration point updates

---

## Best Practices

### For All Users

✅ **DO:**
- Count carefully and verify against packing slip
- Enter vendor shipment numbers completely
- Use quality hold for any questionable items
- Select appropriate reason codes
- Ask questions when unsure
- Document unusual situations

❌ **DON'T:**
- Guess quantities or variant codes
- Skip mandatory fields
- Ignore quality issues
- Post without verification
- Create variants without approval
- Modify posted transactions directly

### For Managers

✅ **DO:**
- Review hold location daily
- Track vendor performance metrics
- Provide regular staff feedback
- Update procedures based on learnings
- Coordinate with quality and purchasing teams
- Maintain clear documentation

❌ **DON'T:**
- Let items age in quarantine indefinitely
- Ignore recurring vendor issues
- Skip staff spot checks
- Allow accuracy to drop below standards
- Make configuration changes without IT review

### For IT Support

✅ **DO:**
- Run data integrity checks weekly
- Monitor posting performance
- Keep debug logs for errors
- Test fixes in sandbox first
- Document all manual corrections
- Escalate complex issues promptly

❌ **DON'T:**
- Modify production data without backup
- Skip testing of configuration changes
- Attempt fixes outside expertise
- Ignore performance degradation
- Disable validations without understanding impact

---

## Troubleshooting Quick Reference

| Issue | First Check | Guide Reference |
|-------|-------------|-----------------|
| Can't post receipt | Vendor Shipment No. filled? | Staff Guide p. Troubleshooting |
| Hold button not working | Quarantine location configured? | IT Guide - Issue 3 |
| Wrong items in location | Check posted receipt location | IT Guide - Manual Corrections |
| Posting very slow | Number of lines > 100? | IT Guide - Performance |
| Permission error | User in correct permission set? | IT Guide - Issue 6 |
| Vendor disputes quantity | Pull receipt and count records | Manager Guide - Vendor Disputes |

---

## Related Documentation

- **Purchase Order Creation** - Purchasing team process (not covered here)
- **Vendor Invoice Matching** - Accounting reconciliation process
- **Quality Inspection Process** - Quality team hold disposition
- **Inventory Put-Away** - Warehouse movement from receiving to storage
- **Vendor Returns** - Process for returning items to vendors

---

## Support Contacts

### Business Hours (8 AM - 5 PM)

**Receiving Questions:**
- Contact: Warehouse Supervisor
- Extension: 2100

**System Issues:**
- Contact: IT Help Desk
- Extension: 1234
- Email: ithelpdesk@clesen.com

**Vendor Issues:**
- Contact: Purchasing Department
- Extension: 3456
- Email: purchasing@clesen.com

**Quality Decisions:**
- Contact: Quality Manager
- Extension: 4567

### After Hours

**Critical Issues Only:**
- On-call Manager (see posted contact list)

**Non-Critical:**
- Email issue description
- Include: Receipt number, items affected, error message
- Response next business day

---

## Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | February 13, 2026 | Initial documentation created | IT Development Team |
| | | - Staff Guide (100+ pages) | |
| | | - Manager Guide (80+ pages) | |
| | | - IT Guide (120+ pages) | |
| | | - This README | |

---

## Feedback and Improvements

**Have suggestions?** Contact the documentation team:
- Email: documentation@clesen.com
- Teams: IT Documentation Channel

**Found an error?** Report it:
- Include: Document name, section, description of error
- Expected turnaround: 1 week for corrections

**Need additional scenarios?** Request them:
- Describe the scenario in detail
- Indicate frequency/importance
- Reviewed quarterly for inclusion

---

## Document Maintenance

**Review Schedule:**
- **Monthly:** Check for broken links, outdated screenshots
- **Quarterly:** Review scenarios and KPIs for relevance
- **Semi-Annually:** Full content review and update
- **Annually:** Comprehensive rewrite if needed

**Maintenance Owner:** IT Development Team

**Version Control:** All documentation in Git repository
```
docs/purchasing/
  README.md (this file)
  purchase-receipt-staff-guide.md
  purchase-receipt-manager-guide.md
  purchase-receipt-it-troubleshooting-guide.md
```

---

**Maintained By:** IT Development Team
**Last Updated:** February 13, 2026
**Next Review:** May 13, 2026

---

## Related documents

- [[purchase-receipt-staff-guide]]
- [[purchase-receipt-manager-guide]]
- [[purchase-receipt-it-troubleshooting-guide]]
