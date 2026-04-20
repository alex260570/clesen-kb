---
title: Master Picking (Phase 1)
type: howto
tags: [picking, warehouse, master-pick]
created: 2026-04-20
updated: 2026-04-20
sources: [master-picking-process.md]
---

# Master Picking (Phase 1)

Pick items from warehouse bins into zone/run carts. Phase 1 of the three-phase picking system (see [[picking-overview]]).

## What Happens Automatically (Nightly ~1 AM)

- System locks tomorrow's orders (see [[order-lock]])
- Creates picking tickets by location/zone
- Assigns run numbers and carts
- Runs inventory pre-check

## Steps

1. Open **Master Pick Tickets** from menu. Find tickets with today's picking date.
2. Open your ticket and click **Start Picking** (locks the ticket, records start time).
3. For each line:
   - Go to the bin location shown
   - Pick the quantity required
   - Place items in the assigned cart number
   - Enter **Quantity Picked**, **Quantity Cut** (if short), and **Reason Code** (see [[picking-adjustment]])
4. Optionally use **Continuous Picking** for sequential item-by-item prompts.
5. For delicate items, place into customer-specific carts (see [[delicate-item-handling]]).
6. Click **Finish Picking**. System validates Picked + Cut = Total.
7. Complete all four quality checks: Labels, Quality, Quantity, Water.

## Run Numbers

- Runs 1 through Max (default 10) = regular mixed picks
- Runs above Max = [[single-order-picks]] or [[picking-escalations]]

## Common Issues

- **"Not all items are available"** — inventory shortfall, supervisor creates escalation
- **"All carts from previous picks need to be transferred"** — yesterday's carts still open, complete [[cart-transfer]] first
- **Item not in bin** — check nearby bins, record as cut with reason code

## Where

Menu: Picking → Master Pick Tickets. See [[master-picking-manager]] for configuration and job queue setup.
