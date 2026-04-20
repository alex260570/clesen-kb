# Production Order Posting Documentation

This folder contains comprehensive documentation for the Production Order posting and adjustment system.

## Overview

The production order posting system provides customized functionality for:
- Posting output and scrap during production
- Adjusting production order quantities (increase/decrease)
- Managing safety stock (overstart quantities)
- Recovering from posted scrap when increasing quantities

## Documentation Files

### [Staff Guide](prod-order-posting-staff-guide.md)
**Audience:** Production floor staff, operators

**Contents:**
- Daily posting procedures (Post Output)
- Adjusting quantities up and down
- Common scenarios and troubleshooting
- Step-by-step instructions with examples

**Use this when:** You need to post production output, record scrap, or adjust order quantities.

---

### [Manager Guide](prod-order-posting-manager-guide.md)
**Audience:** Production managers, supervisors, authorized personnel

**Contents:**
- Safety quantity (overstart) management
- Advanced quantity adjustment strategies
- Production order lifecycle oversight
- Quality control integration
- Authorization and security
- Reporting and analytics

**Use this when:** You need to adjust safety quantities, analyze scrap trends, manage authorizations, or handle complex adjustment scenarios.

---

### [IT Troubleshooting Guide](prod-order-posting-it-troubleshooting-guide.md)
**Audience:** IT support staff, system administrators

**Contents:**
- System architecture and data flow
- Common issues and solutions
- Data integrity checks
- Error message reference
- Manual correction procedures
- Database schema
- Debugging procedures

**Use this when:** You need to troubleshoot system errors, perform data corrections, investigate issues, or understand the technical implementation.

---

## Key Concepts

### Safety Quantity (Overstart)
A buffer quantity added to production orders to account for expected losses:
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

## Quick Reference

### For Staff

**Post Output (F9):**
1. Open production order
2. Click Post Output
3. Enter output quantity
4. Enter scrap if any (with scrap code)
5. Check "Finished" if phase complete
6. Post

**Adjust Quantity:**
1. Open production order
2. Click Adjust Quantity
3. Enter new quantity
4. Select scrap code if decreasing with postings
5. Confirm

### For Managers

**Adjust Safety Quantity:**
1. Open production order
2. Click Adjust Safety Quantity
3. Enter new safety amount
4. Save

**Authorization Required:** Must be in Safety Adjustment Authorization Group (configured in CLE Clesen Setup).

### For IT

**Check Production Order Health:**
```sql
-- Verify header/line consistency
SELECT h.[No_], h.[Quantity] as [Header], l.[Quantity] as [Line]
FROM [Production Order] h
LEFT JOIN [Prod_ Order Line] l ON h.[Status] = l.[Status] 
    AND h.[No_] = l.[Prod_ Order No_]
WHERE h.[Status] = 2 AND ABS(h.[Quantity] - l.[Quantity]) > 0.01;
```

---

## Technical Components

**Pages:**
- 50100 - CLE Pst Outp. from Prod. Order (Post Output)
- 50099 - CLE Pst Scrap from Prod. Order (Adjust Quantity)
- 50120 - CLE Adjust Safety in ProdOrder

**Codeunits:**
- 50007 - CLE Production Management (main business logic)
- 50119 - CLE Post Scrap Capacity Entry

**Table Extensions:**
- 50047 - CLE Production Order (adds Requested Quantity, Source Prod. Order No.)
- 50034 - CLE Prod. Order Line (adds Safety Qty., Roll-up Item No.)

**Test Coverage:**
- 50204 - CLE Production Posting Tests (automated test codeunit)

---

## Process Flow

```
┌─────────────────────────────────────────────────────────┐
│ User Action (Post Output / Adjust Quantity)            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Page Validation (50100/50099/50120)                    │
│ - Verify input                                          │
│ - Calculate scrap                                       │
│ - Check authorization                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ CLE Production Management (Codeunit 50007)             │
│ - AdjustQuantityOnProdOrder()                          │
│ - AdjustScrapOnCapLedgerEntries()                      │
│ - AdjustSafetyQuantityOnProdOrderLine()                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Post Scrap Capacity Entry (Codeunit 50119)            │
│ - PostScrapCapacityEntry()                             │
│ - Creates Item Journal Line                            │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ Standard BC Posting (Item Jnl.-Post Line)              │
│ - Capacity Ledger Entry                                │
│ - Item Ledger Entry                                    │
└─────────────────────────────────────────────────────────┘
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

## Change Log

**Version 1.0** - February 13, 2026
- Initial documentation created
- Covers production order posting system as of Q1 2026
- Includes fixes from January 2026 (scrap recovery logic improvements)

---

## Support Contacts

**Production Questions:** Contact your production supervisor  
**System Issues:** Contact IT Support  
**Configuration Changes:** Contact System Administrator

---

## Related documents

- [[prod-order-posting-staff-guide]]
- [[prod-order-posting-manager-guide]]
- [[prod-order-posting-it-troubleshooting-guide]]
- [[prod-order-task-staff-guide]]
- [[prod-order-task-manager-guide]]
- [[prod-order-task-it-troubleshooting-guide]]

---

**Maintained By:** IT Development Team
**Last Updated:** February 13, 2026
