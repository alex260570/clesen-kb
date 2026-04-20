---
title: Cart Transfer (Phase 2)
type: howto
tags: [picking, cart, transfer, warehouse]
created: 2026-04-20
updated: 2026-04-20
sources: [cart-transfer-process.md, cart-transfer-manager.md]
---

# Cart Transfer (Phase 2)

Move filled master carts from warehouse to the Supermarket location using BC Transfer Orders. Phase 2 of the three-phase system (see [[picking-overview]]).

## Cart Status Progression

1. **New** → cart created
2. **In Pick** → active during master picking
3. **Ready to Transfer** → master pick + quality checks done
4. **Transfer Shipped** → shipment posted at source
5. **Transfer Received** → receipt posted at Supermarket; [[supermarket-picking]] can start

## Steps (Warehouse Staff)

1. Find carts with **Ready to Transfer** status on today's Transfer Orders.
2. Physically move carts to Supermarket location (keep organized by run number).
3. Open Transfer Order and click **Post → Shipment** at source → cart status becomes **Transfer Shipped**.
4. At Supermarket, verify cart numbers and contents, then **Post → Receipt** → cart status becomes **Transfer Received**.
5. System automatically flips Supermarket tickets to **Ready to Pick** when all required carts arrive (only triggers when receiving at configured Supermarket location).

## Key Codeunits

- **50076 CLE Process Transfer Order**
- **5740 TransferOrder-Post Shipment** (BC standard)
- **5742 TransferOrder-Post Receipt** (BC standard)

## Configuration

- In-Transit Code configured
- Transfer route defined (master location → Supermarket)
- ClesenSetup: `Supermarket Location Code`

## KPIs

- Transfer time: < 1 hour Ready→Received
- Receipt posting: within 15 min of physical arrival
- Zero overnight in-transit

## Common Issues

- **"Transfer order already posted"** — check if carts already at Supermarket; don't repost
- **Carts missing at Supermarket** — verify cart numbers, check source location, may need to reverse receipt
- **"Transfer Shipped" blocking supermarket** — receipt not yet posted at Supermarket; post it immediately
- **Damage during transfer** — do NOT post receipt; document, remove damaged items, adjust quantities, then post

## See Also

[[master-picking]], [[supermarket-picking]], [[delicate-item-handling]]
