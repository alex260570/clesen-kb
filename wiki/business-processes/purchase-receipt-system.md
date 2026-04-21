---
title: Purchase Receipt System
type: business-process
tags: [purchasing, receiving, quality-control, system-overview, process-architecture, quarantine-management]
created: 2026-04-21
updated: 2026-04-21
sources: [purchase-receipt-process.md]
---

# Purchase Receipt System

Overview of the purchase receipt and vendor receiving system for processing incoming shipments and managing quality holds.

---

## System Overview

The Purchase Receipt system is a streamlined receiving workflow that allows warehouse staff to receive incoming vendor shipments into inventory. The system includes specialized functionality for quality holds and quarantine management.

### Key Features

- **Simplified receiving interface** — focused on essential fields only
- **Quality hold process** — route problematic items to quarantine automatically
- **Variant flexibility** — adjust item variants during receiving if vendor substituted
- **Partial receiving** — receive shipments in multiple batches
- **Quarantine location routing** — automatic location assignment for hold items
- **Reason code tracking** — document why items placed on hold

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

## System Architecture

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

---

## Process Flow

```
1. Vendor Delivery Arrives
   (Physical shipment at receiving dock, packing slip provided)
        ↓
2. Staff Opens Purchase Receipts List
   (Finds matching PO by vendor and date)
        ↓
3. Data Entry
   (Enter Vendor Shipment No., adjust quantities/variants)
        ↓
   ├─ All Items Good               Some Items Problem
   │  │                                   │
   │  ▼                                   ▼
   │  Standard Posting              Quality Hold Process
   │  (F9 posts all to warehouse)   (Select line, click "To Hold",
   │                                 enter quantity and reason)
   │                                   │
   └───────────────┬──────────────────┘
                   ↓
4. Posted Purchase Receipt Created
   (Good items → Warehouse, Hold items → Quarantine)
        ↓
5. Post-Receipt Processing
   (Good items available for picking, Hold items routed to quality)
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

---

### Scenario 2: Partial Shipment

**Frequency:** 10-15% of receipts
1. Open PO from list
2. Enter Vendor Shipment No.
3. Reduce quantities to actual received
4. Post (F9)
5. Remaining quantity stays on PO

**Time:** 3-5 minutes

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

---

### Scenario 4: Wrong Variant Received

**Frequency:** 2-3% of receipts
1. Open PO from list
2. Enter Vendor Shipment No.
3. Change Variant Code to actual received
4. Post (F9)

**Time:** 3-4 minutes

---

## Key Performance Indicators

### Operational KPIs

| KPI | Target | Owner |
|-----|--------|-------|
| Accuracy Rate | > 99% | Manager |
| Throughput | 8-10 receipts/hour | Manager |
| Quality Hold Rate | < 5% | Manager & Quality |

### Vendor KPIs

| KPI | Target | Owner |
|-----|--------|-------|
| On-Time Delivery | > 95% | Purchasing |
| Quality Score | A or B rating | Manager & Purchasing |
| Fill Rate | > 95% on first shipment | Purchasing |

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

## Related Documentation

- [[purchase-receipt-overview]] — Overview and process flow
- [[purchase-receipt-staff]] — Step-by-step staff procedures
- [[purchase-receipt-manager]] — Manager oversight and training guide
- [[purchase-receipt-it-troubleshooting]] — IT technical guide and troubleshooting
- [[purchase-worksheet]] — Purchase order planning tool
- [[purchase-order-management]] — Creating and managing purchase orders

---

## Support

**Receiving Questions:** Contact Warehouse Supervisor

**System Issues:** Contact IT Help Desk

**Vendor Issues:** Contact Purchasing Department

**Quality Decisions:** Contact Quality Manager
