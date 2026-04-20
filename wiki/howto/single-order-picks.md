---
title: Single Order Picks
type: howto
tags: [picking, large-orders]
created: 2026-04-20
updated: 2026-04-20
sources: [single-order-picks.md]
---

# Single Order Picks

Large orders from a single customer get a **dedicated run number** (above Max). They flow through the same three phases as regular picks.

## Identification

- Run number > Max (e.g., 11, 12, 13…)
- Ticket shows only one customer
- Multiple carts all for same customer

## Why

- Avoids mixing large orders with others
- Easier to keep customer's items together through shipping
- Supermarket can often grab the whole cart range instead of re-picking

## Phase Flow

1. **[[master-picking]]** — pick into dedicated run carts (system auto-creates customer-specific carts for large orders)
2. **[[cart-transfer]]** — transfer as a group when possible
3. **[[supermarket-picking]]** — preferred: grab entire cart range; re-pick only if poorly organized

## Single Order vs. [[picking-escalations]]

| Aspect | Single Order | Escalation |
|--------|--------------|------------|
| Trigger | Planned at nightly lock | Late, needs approval |
| Priority | Normal | High/Rush |
| Approval | Automatic | Transportation must approve |
| Ticket creation | Automatic | Manager manually triggers |

## Configuration

ClesenSetup → `Max. Number of Runs` (default 10) defines the cutoff between regular and single-order/escalation runs.
