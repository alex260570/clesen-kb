---
title: Counting Process (Staff + Manager)
type: howto
tags: [counting, warehouse]
created: 2026-04-20
updated: 2026-04-20
sources: [counting-process.md, count-preparation.md, count-release.md, count-processing.md]
---

# Counting Process

End-to-end counting workflow. For system overview see [[counting-overview]].

## Staff: How to Count

1. Open **Inventory Count Sheet** (page 50125). Auto-filtered to your location/zone, sorted by priority.
2. Go to the bin shown. Find the item.
3. Count physically — all units in that bin. Don't estimate.
4. Enter **Quantity Counted** (or cases + Qty Base to Add for multi-UOM items).
5. Click **Finish & Submit**. If count differs significantly from expected, a warning appears — confirm only if confident.
6. Status changes to **Counted**; processing job posts adjustment or requests recount.

**Zero is a valid count.** If truly empty, enter 0 and notify supervisor.

## Manager: Preparation (Phase 1)

**Automatic** every 2 hours via Codeunit **50108** — evaluates enabled count type rules.

**Manual** via page 50126 Inventory Count Preparation:
- **Prepare Physical Inventory** — full count, optional location/category filters
- **Prepare Location Count** — specific zone/location (required)
- **Prepare Single Item Count** — one item (required)

Duplicate prevention: won't create another active line for same item+location+bin.

## Manager: Release (Phase 2)

Codeunit **50115** runs every minute. Validations before releasing:

- Bin code exists
- No duplicate active count
- Location is not the Supermarket
- Zone not picked in last 4 hours (Codeunit **50116 CLE Count Line Reset** resets lines when picking starts)
- No expected purchase receipts pending

Manual override possible but bypasses safety checks.

## Manager: Processing (Phase 4)

Codeunit **50111** runs every minute.

Adjustment = Counted − Expected.

- **Acceptable** → auto-post. Source determines journal (Item / Consumption / Physical Inventory)
- **Recount range** → status goes back to Prepared (max recount limit configurable)
- **Assistance Required** → supervisor review on page 50127 (see [[counting-exceptions]])

## KPIs

- Acceptance rate >95%
- Recount rate <5%
- Assistance rate <1%
- Average Counted→Archived <5 min

Monitor via [[counting-dashboard]] (page 50199).

## Common Staff Situations

- **Can't find item** — check nearby bins; enter 0 if truly gone; notify supervisor
- **Item in multiple bins** — each bin has its own line; count only that bin
- **Expected 0 but items present** — count actual, enter it; this is what counting is for
- **Production order: some finished, some not** — count ALL (finished + unfinished)

## See Also

[[count-types]], [[counting-exceptions]], [[counting-dashboard]], [[picking-adjustment]]
