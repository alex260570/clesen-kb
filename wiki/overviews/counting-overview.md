---
title: Inventory Counting Overview
type: overview
tags: [counting, inventory]
created: 2026-04-20
updated: 2026-04-20
sources: [counting-system-overview.md]
---

# Inventory Counting Overview

Clesen runs a five-phase, mostly-automated cycle counting system driven by business rules.

## Five Phases

1. **Preparation** (auto, every 2h) — Codeunit **50108 CLE Prepare Auto Item Count** evaluates 9 count type rules and creates lines
2. **Release** (auto, every 1min) — Codeunit **50115 CLE Release Count** validates and releases
3. **Counting** (manual) — staff count via page 50125; see [[counting-process]]
4. **Processing** (auto, every 1min) — Codeunit **50111 CLE Process Incoming Counts** evaluates deviation; auto-posts or escalates
5. **Exception Handling** (manual) — supervisors resolve via page 50127; see [[counting-exceptions]]

## Status Lifecycle

Prepared → Released → Counted → Archived. Branches: Recount Request (moderate deviation) or Assistance Required (large deviation).

## Three Deviation Tiers

- **Acceptable** — auto-posts, archives
- **Recount** — resets to Prepared, staff counts again
- **Assistance Required** — supervisor reviews

Thresholds configured in **Counting Setup (page 50202)** by count type and item category.

## Count Types (9)

See [[count-types]] for detail. High-level groups:

| Type | Trigger | Why |
|------|---------|-----|
| 2 Weeks Ship | Orders shipping in 14 days | Prevent stockouts |
| Ready Count | PO 50%+ complete | Catch over/underproduction |
| Sowing Check | 3 days after sow | Germination rate |
| Transplant Check | 7 days after transplant | Survival rate |
| Negative Availability | Negative inventory | Data integrity |
| High Demand | High sales volume | Popular items |
| Physical Inventory | Manual | Full audit |
| Location Count | Manual | Zone audit |
| Single Item | Manual | Investigation |

## Line Sources

- **Inventory (Bin Content)** → Item Journal adjustment
- **Production Order** → Consumption Journal adjustment
- **Physical Inventory Journal** → Physical Inventory adjustment

## Related

- [[counting-process]] — staff counting workflow
- [[count-types]] — concepts for each count type
- [[counting-dashboard]] — manager monitoring
- [[counting-exceptions]] — supervisor review
