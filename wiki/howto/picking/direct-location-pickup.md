---
title: Direct Location Pickup
type: howto
tags: [picking, will-call, pickup]
created: 2026-04-20
updated: 2026-04-20
sources: [direct-location-pickup.md]
---

# Direct Location Pickup

Simplified picking for orders where items come from a single location (usually customer pickup / will-call). Skips the three-phase warehouse picking system.

## When to Use

- Customer pickup / will-call
- Orders from a single location, no sorting needed
- Orders flagged "Direct Location Pickup"

These orders are excluded from [[master-picking]] via shipment method filters (`CLE Ignore for Master Pick`).

## Steps

1. Open **Direct Location Pickup Tickets**. Find today's ticket.
2. Review customer, location, and items.
3. For each item:
   - Go to the location
   - Pick the items
   - Enter **Quantity Picked** / **Quantity Cut** / **Reason Code** (see [[picking-adjustment]])
4. Enter **Total Carts Processed** (if applicable).
5. Stage items in pickup area or hand directly to customer.
6. On customer arrival: verify ID, review with customer, get signature if required, mark complete.

## Common Issues

- **Item not at location** — double-check location code, ask supervisor, don't make customer wait
- **Customer wants more than ordered** — requires supervisor approval
- **Customer no-show** — stage securely, inform supervisor, await instructions

## Where

Menu: Picking → Direct Location Pickup Tickets
