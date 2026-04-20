---
title: Supermarket Picking (Phase 3)
type: howto
tags: [picking, warehouse, supermarket]
created: 2026-04-20
updated: 2026-04-20
sources: [supermarket-picking-process.md]
---

# Supermarket Picking (Phase 3)

Physically pick items FROM master carts INTO customer-specific carts. Phase 3 of the three-phase system (see [[picking-overview]]).

## Prerequisites

- Carts must have status **Transfer Received** (see [[cart-transfer]])
- When receipt is posted at the Supermarket location, system automatically sets tickets with all required carts to **Ready to Pick**

## Steps

1. Open **Supermarket Pick Tickets**. Ticket shows `From Cart Start No.` and `From Cart End No.` — these are the master carts to pick from.
2. Locate the master carts in the Supermarket staging area. Have customer-specific carts ready.
3. Click **Start Picking**.
4. For each line:
   - Go to the indicated master cart
   - Pick items into the customer-specific cart
   - Enter **Quantity Picked** and **Quantity Cut** with reason code if short
5. For **delicate item carts** (labeled with customer name): grab the entire cart; do NOT re-pick (see [[delicate-item-handling]]).
6. Click **Finish Picking**. System validates totals and automatically adjusts sales order quantities.
7. Complete four quality checks on customer carts: Labels, Quality, Quantity, Water.

## Shortage Reason Codes

- SHORT IN MASTER CART
- DAMAGED IN TRANSIT
- QUALITY ISSUE
- MISSING FROM CART
- OTHER

Shortages at this stage usually indicate a master pick shortfall or transfer damage.

## Common Issues

- **"Not all items are available for picking"** — carts not yet Transfer Received; wait for [[cart-transfer]] to complete
- **"X Lines are having issues"** — Picked + Cut ≠ Total; fix discrepancies before finishing

## See Also

[[master-picking]], [[cart-transfer]], [[picking-teams-manager]], [[picking-adjustment]]
