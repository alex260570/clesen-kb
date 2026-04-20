---
title: Delicate Item Handling
type: howto
tags: [picking, delicate, quality]
created: 2026-04-20
updated: 2026-04-20
sources: [delicate-item-handling.md]
---

# Delicate Item Handling

Delicate items (fragile plants, high-value specialties) are picked **once** into customer-specific carts during master pick, then the **entire cart** is transferred through to shipping without re-picking.

**Principle:** one-touch handling minimizes damage risk.

## Identification

- Item card has Delicate flag
- System auto-assigns to customer-specific carts (labeled with customer name)
- Codeunit **50106 CLE Handle Delicate Items** governs assignment

## Master Picker Workflow

1. When delicate items appear on a ticket, system assigns a customer-specific cart.
2. Label cart clearly with customer name + "DELICATE".
3. Pick delicate items gently into that customer's cart (not mixed zone carts).
4. Regular items for the same ticket still go into standard mixed carts.
5. Complete extra-thorough quality checks.
6. Transfer promptly — don't let sit.

## Supermarket Picker Workflow

**Do NOT re-pick delicate carts.** Instead:

1. Locate customer-labeled cart(s).
2. Visually verify contents match ticket.
3. Inspect for transit damage.
4. Complete quality checks on the cart.
5. Record items as "picked" in the system (tracking purposes).
6. Stage the whole cart for shipping.

## Why Not Re-pick?

- Items already organized for customer
- Additional handling increases damage
- Faster for supermarket team
- Better product quality reaching customer

## Issues

- **Cart with multiple customers' delicate items** — should not happen; report to supervisor
- **Transit damage** — don't touch further, photograph, escalate to supervisor

## See Also

[[master-picking]], [[supermarket-picking]], [[cart-transfer]]
