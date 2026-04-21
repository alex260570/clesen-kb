---
title: Picking Adjustments (Quantity Cuts & Corrections)
type: howto
tags: [picking, inventory, adjustments]
created: 2026-04-20
updated: 2026-04-20
sources: [picking-adjustment-guide.md]
---

# Picking Adjustments

Two methods to correct discrepancies between picked and shipped quantities.

## Method 1 — During Picking (Quantity Cut) — Preferred

Used for real-time shortages during [[master-picking]], [[supermarket-picking]], or [[direct-location-pickup]].

1. Open picking ticket, click **Start Picking**.
2. For each line: enter **Quantity Picked**; system computes **Quantity Cut** = To Pick − Picked.
3. If Cut > 0, select **Reason Code** (required). Add notes.
4. Click **Finish Picking** (validates Picked + Cut = Total).
5. Complete quality checks.

System then: reduces sales line qty, logs the change in Sales Line Change Log, may create Item Audit entries, updates availability.

## Method 2 — Post-Shipment (Item Journal)

For discrepancies found after shipment. Usually requires manager approval.

### Physical Inventory Journal
Use when physical count differs from system.

1. Open **Physical Inventory Journal**, select batch.
2. **Calculate Inventory** to populate expected quantities.
3. For each line: enter actual physical qty, reason code, document no.
4. **Post** → creates Item Ledger Entries, Warehouse Entries, Value Entries.

### Item Reclassification Journal
Use when items are in wrong bin/location.

1. Open **Item Reclassification Journal**.
2. Enter current Location/Bin and New Location/Bin, quantity, reason code.
3. Post. Does NOT physically move items — move first, then reclassify.

## Common Reason Codes

| Code | When to Use |
|------|-------------|
| OUT OF STOCK | Item missing from bin |
| DAMAGED | Physical damage |
| QUALITY ISSUE | Doesn't meet standards |
| NOT READY | Blooming stage wrong |
| WRONG LOCATION | Item in unexpected bin |
| SHORT COUNT | Physical < system |
| OVERGROWN | Past optimal stage |
| CUSTOMER REQUEST | Customer change during pick |

Some codes (OUT OF STOCK, NOT READY, DAMAGED) can trigger automatic audit entries that move inventory to a hold location.

## Viewing History

- **Sales Line History** (per sales line): Line → Sales Process History (see [[sales-process-history]])
- **Item Ledger Entries**: filter by Item, Entry Type (Positive/Negative Adjmt), Reason Code
- **Warehouse Entries**: bin-level granularity

## Accounting Impact

Negative adjustment: Debit Inventory Adjustment Expense, Credit Inventory Asset. Large/frequent adjustments trigger audit reviews.

## See Also

[[master-picking]], [[item-audit-trail]], [[counting-exceptions]]
