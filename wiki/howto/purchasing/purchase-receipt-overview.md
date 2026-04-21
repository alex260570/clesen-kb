---
title: Purchase Receipt — Process Overview
type: howto
tags: [purchasing, receiving, quality-control, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [purchase-receipt-process.md]
---

# Purchase Receipt — Process Overview

The Purchase Receipt system manages incoming vendor shipments with streamlined receiving and quality hold capabilities.

## Key Features

- **Simplified receiving interface** — Focused on essential fields only
- **Quality hold process** — Route problematic items to quarantine automatically
- **Variant flexibility** — Adjust item variants during receiving if vendor substituted
- **Partial receiving** — Receive shipments in multiple batches
- **Quarantine location routing** — Automatic location assignment for hold items
- **Reason code tracking** — Document why items placed on hold

## Quick Start

### For Staff

**Day 1:**
1. Read [[purchase-receipt-staff]] sections 1-3
2. Shadow experienced staff on 5+ receipts
3. Understand physical warehouse layout
4. Learn quality standards

**Week 1:**
1. Complete Staff Guide sections 4-6
2. Practice simple receipts under supervision
3. Learn common scenarios
4. Get familiar with system navigation

### For Managers

**New to Role:**
1. Review [[purchase-receipt-manager]] completely
2. Understand staff training requirements
3. Set up vendor scorecards
4. Configure reason codes and locations

### For IT Support

**New System:**
1. Read [[purchase-receipt-it-troubleshooting]] sections 1-2
2. Understand technical architecture
3. Review custom components
4. Set up monitoring

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
┌────────────────────────────────┐    ┌──────────────────────────┐
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

## Key Concepts

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

### Standard Reason Codes

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

## Key Performance Indicators

### Operational KPIs

| KPI | Target | Measured |
|-----|--------|----------|
| **Accuracy Rate** | > 99% | Spot checks, audits |
| **Throughput** | 8-10 receipts/hour | Time tracking |
| **Quality Hold Rate** | < 5% | System data |

### Vendor KPIs

| KPI | Target | Measured |
|-----|--------|----------|
| **On-Time Delivery** | > 95% | Expected vs. actual receipt date |
| **Quality Score** | A or B rating | Monthly scorecard |
| **Fill Rate** | > 95% | Ordered vs. received quantity |

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

## Related Pages

- [[purchase-receipt-staff]]
- [[purchase-receipt-manager]]
- [[purchase-worksheet]]
- [[purchase-receipt-it-troubleshooting]]
