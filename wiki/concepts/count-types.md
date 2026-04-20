---
title: Count Types (9 Types)
type: concept
tags: [counting, concepts]
created: 2026-04-20
updated: 2026-04-20
sources: [understanding-count-types.md]
---

# Count Types

Nine count types drive the automated counting system (see [[counting-overview]]). Each has distinct business logic and priority.

## Automatic Count Types

### 1. Two Weeks Ship (HIGH priority)
Items on sales orders shipping within 14 days. Prevents stockout surprises. Runs every 2h.

### 2. Ready Count (HIGH)
Production orders 50%+ complete with due date ≤14 days. Catches over/underproduction and scrap. Source: **Production Order** (not bin). Count ALL items (finished + unfinished) for the PO.

### 3. Sowing Check (MEDIUM)
Runs 3 days after sowing date. Checks germination rate. Count only viable seedlings.

### 4. Transplant Check (MEDIUM)
Runs 7 days after transplant. Checks survival. Count only viable plants.

### 5. Negative Availability (CRITICAL)
Items with negative inventory or availability. Data integrity issue — physical reality is the truth, zero is often correct.

### 6. High Demand (HIGH, optional)
Configurable — items with unusually high recent sales.

## Manual Count Types

### 7. Physical Inventory (CRITICAL)
Comprehensive count of all inventory. Quarterly/yearly for financial compliance. May require warehouse freeze.

### 8. Location Count (MEDIUM-HIGH)
All items in a specific location/zone. Used for audits or post-reorganization.

### 9. Single Item (VARIES)
One specific item across locations or in a specific bin. Investigative.

## Priority Tiers

1. **CRITICAL** — Negative Availability, Physical Inventory
2. **HIGH** — 2 Weeks Ship, Ready Count, High Demand
3. **MEDIUM** — Sowing Check, Transplant Check, Location Count
4. **VARIES** — Single Item

System sorts count sheet by priority automatically. Always count in priority order.

## Why Same Item May Appear Twice

- Recount request (first count had high deviation)
- Different source (Inventory + Production Order count same item)
- Manual count added
- Multiple count types include same item

## See Also

[[counting-overview]], [[counting-process]]
