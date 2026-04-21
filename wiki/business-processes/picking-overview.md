---
title: Picking Overview
type: overview
tags: [picking, warehouse]
created: 2026-04-20
updated: 2026-04-20
sources: [Picking-Process.md, master-picking-process.md, supermarket-picking-process.md, cart-transfer-process.md]
---

# Picking Overview

Clesen uses a **three-phase picking system** that separates bulk warehouse picking from customer-specific sorting. Most daily orders flow through all three phases.

## The Three Phases

1. **[[master-picking]]** — Pick from warehouse bins into zone/run carts. Nightly job creates tickets.
2. **[[cart-transfer]]** — Physically move filled carts from warehouse to Supermarket location via BC Transfer Orders.
3. **[[supermarket-picking]]** — Physically pick items FROM master carts INTO customer-specific carts for shipping.

## Ticket Types

| Ticket | When | Guide |
|--------|------|-------|
| Master Pick | Daily, multi-customer mixed runs | [[master-picking]] |
| Supermarket Pick | After transfer, sort to customers | [[supermarket-picking]] |
| Direct Location Pickup | Will-call / customer pickup orders | [[direct-location-pickup]] |
| Escalation | Late/rush orders requiring approval | [[picking-escalations]] |
| Single Order Pick | Large orders, dedicated run | [[single-order-picks]] |

## Run Numbers

- **Runs 1 — Max** (default 10) = regular mixed master picks
- **Runs Max+1 and above** = [[single-order-picks]] and [[picking-escalations]]
- Configured in ClesenSetup → Max. Number of Runs

## Quality Checks

Every ticket requires four checks before carts can advance: Labels, Quality, Quantity, Water. System records the checker's user ID.

## Related

- [[delicate-item-handling]] — one-touch handling for fragile items
- [[picking-adjustment]] — quantity cuts and corrections
- [[picking-teams-manager]] — team/device assignment
- [[order-lock]] — nightly order locking
