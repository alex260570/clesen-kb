---
title: Production Order Posting System
type: business-process
tags: [production, posting, system-overview, process-architecture, safety-quantity, scrap-recovery]
created: 2026-04-21
updated: 2026-04-21
sources: [prod-order-Posting-Documentation.md]
---

# Production Order Posting System

Overview of the production order posting and adjustment system for recording output, managing scrap, and adjusting quantities.

---

## System Overview

The production order posting system provides customized functionality for managing the complete lifecycle of production from output recording to quantity adjustments. It handles:

- **Posting output and scrap** during production
- **Adjusting production order quantities** (increase/decrease)
- **Managing safety stock** (overstart quantities)
- **Recovering from posted scrap** when increasing quantities

---

## Key Concepts

### Safety Quantity (Overstart)

A buffer quantity added to production orders to account for expected losses during production:

```
Requested Quantity = Customer order quantity
Safety Quantity = Requested Qty × Overstart % (from Item card)
Production Order Quantity = Requested Qty + Safety Qty
```

**Example:** Order for 1000 units with 3% overstart
- Requested: 1000
- Safety: 30
- Production Order: 1030

### Scrap Recovery

When increasing production order quantities after production has started, the system can "recover" previously posted scrap instead of requiring a new production order. This allows flexibility when quality assessment improves.

**Limitations:**
- Can only increase up to the amount of posted scrap available
- If production started but no scrap available → must create new production order
- Recovery uses LIFO (newest scrap recovered first)

### Quantity Adjustment Scenarios

**Decrease (NewQty < CurrentQty):**
- No postings yet → Adjust header, refresh production order
- Has postings → Post scrap transaction

**Increase (NewQty > CurrentQty):**
- No postings yet → Adjust header, refresh production order
- Has postings + scrap available → Recover from scrap
- Has postings + no scrap → ERROR, must create new production order

---

## Process Architecture

### User Actions

Staff can initiate two main operations:

1. **Post Output** — Record production output and scrap
2. **Adjust Quantity** — Increase or decrease production order quantity

Managers can additionally:

3. **Adjust Safety Quantity** — Modify the overstart buffer

### Validation and Processing

All user actions trigger:
1. **Page Validation** — Verify input, calculate scrap, check authorization
2. **Production Management Logic** — Codeunit 50007 handles all business rules
3. **Scrap Capacity Entry** — Codeunit 50119 posts scrap transactions
4. **Standard BC Posting** — Item Journal posting creates ledger entries

### Data Integrity

The system maintains consistency between:
- Production Order Header (overall quantity)
- Production Order Lines (per-line quantities)
- Item Ledger Entries (posted inventory movements)
- Capacity Ledger Entries (production metrics)

---

## Quick Reference

### For Staff

**Post Output:**
1. Open production order
2. Click **Post Output**
3. Enter output quantity
4. Enter scrap if any (with scrap code)
5. Check "Finished" if phase complete
6. Post

**Adjust Quantity:**
1. Open production order
2. Click **Adjust Quantity**
3. Enter new quantity
4. Select scrap code if decreasing with postings
5. Confirm

### For Managers

**Adjust Safety Quantity:**
1. Open production order
2. Click **Adjust Safety Quantity**
3. Enter new safety amount
4. Save

**Authorization:** Must be in Safety Adjustment Authorization Group (configured in CLE Clesen Setup)

### For IT

**Check Production Order Health:**
Verify header/line consistency by checking that all production orders have matching quantities between header and line level with no unexplained discrepancies.

---

## System Components

### Pages

| Page ID | Name | Purpose |
|---------|------|---------|
| 50100 | CLE Pst Outp. from Prod. Order | Post Output interface |
| 50099 | CLE Pst Scrap from Prod. Order | Adjust Quantity interface |
| 50120 | CLE Adjust Safety in ProdOrder | Safety Quantity adjustment |

### Codeunits

| Codeunit | Name | Purpose |
|----------|------|---------|
| 50007 | CLE Production Management | Main business logic for all operations |
| 50119 | CLE Post Scrap Capacity Entry | Scrap transaction posting |

### Table Extensions

| ID | Table | Purpose |
|-----|-------|---------|
| 50047 | CLE Production Order | Adds Requested Quantity, Source Prod. Order No. |
| 50034 | CLE Prod. Order Line | Adds Safety Qty., Roll-up Item No. |

### Testing

| Test Codeunit | Purpose |
|---------------|---------|
| 50204 | CLE Production Posting Tests (automated test suite) |

---

## Process Flow

```
User Action
(Post Output / Adjust Quantity)
        ↓
Page Validation
(Input verification, scrap calculation, authorization)
        ↓
CLE Production Management (Codeunit 50007)
(Business logic execution)
        ↓
Scrap Capacity Entry (Codeunit 50119)
(Item Journal creation if needed)
        ↓
Standard BC Posting
(Capacity Ledger, Item Ledger, Inventory)
```

---

## Best Practices

### For All Users

1. Always verify production order number before posting
2. Count carefully before entering quantities
3. Select appropriate scrap codes for accurate reporting
4. Post immediately after completing work (don't delay)
5. Document unusual situations

### For Managers

1. Review scrap trends regularly (daily/weekly)
2. Adjust item overstart percentages based on data
3. Provide clear scrap code guidance to staff
4. Monitor safety quantity utilization
5. Update authorization groups as roles change

### For IT

1. Always backup before manual corrections
2. Use system functions when possible (avoid direct SQL)
3. Test corrections in sandbox first
4. Document all interventions thoroughly
5. Monitor data integrity with automated checks

---

## Related Documentation

- [[prod-order-overview]] — Production order lifecycle and status progression
- [[prod-order-posting-staff]] — Step-by-step staff guide for posting output and adjustments
- [[prod-order-posting-manager]] — Manager guide for safety and quality oversight
- [[prod-order-posting-it-troubleshooting]] — IT technical guide for system architecture and issues
- [[prod-order-task-staff]] — Staff guide for production order task checklists
- [[prod-order-task-manager]] — Manager guide for task template creation and management
- [[prod-order-task-it-troubleshooting]] — IT technical guide for task system

---

## Support

**Production Questions:** Contact your production supervisor

**System Issues:** Contact IT Support

**Configuration Changes:** Contact System Administrator
