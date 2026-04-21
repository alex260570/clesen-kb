---
title: Picking Teams — Manager Setup
type: howto
tags: [picking, teams, devices, manager]
created: 2026-04-20
updated: 2026-04-20
sources: [picking-teams-manager-guide.md]
---

# Picking Teams — Manager Setup

Organize supermarket pickers into teams sharing a tablet (device). Pickers see only tickets assigned to their team.

## Resolution Logic

1. Picker logs in on tablet
2. System finds the **Picking Device** with that User ID
3. System finds the **Picking Team** with that Device Code
4. Ticket list is filtered to team's tickets

Pickers not linked to a device see ALL tickets (same as feature disabled).

## Enable

Clesen Setup → Picking → **Activate Picking Teams** = on.

Disabling hides UI but preserves assignments.

## Setup Devices

Picking Dashboard → Setup → **Picking Devices**:
- `Code` (e.g., TABLET-01)
- `User ID` — current picker on this tablet

Create all device records once; update User ID per shift.

## Setup Teams

Picking Dashboard → Setup → **Picking Teams**:
- `Code` (e.g., TEAM-A)
- `Members` — informational text
- `Device Code` — tablet assigned to this team

Read-only columns:
- `Current Status` — Picking / Idle
- `Unfinished Ticket Count` — today's unfinished tickets (use for load balancing)

## Assign Tickets

Supermarket Pick Tickets → select tickets → **Assign to Team** → pick team.

Toggle **Show All Tickets** / **Show My Team** on the ticket list.

## Daily Workflow

- Shift start: update User IDs on devices, update team Members/Device, assign tickets
- During day: reassign via Assign to Team using Unfinished Ticket Count to balance load
- Mid-day switch: update User ID on both devices, Device Code on teams

## Troubleshooting

- **Picker sees all tickets** — device not linked to team, or picker not on device
- **Team UI missing** — Activate Picking Teams is off
- **Unfinished count 0 but tickets exist** — check Picking Team Code column, verify today's picking date

## See Also

[[supermarket-picking]], [[picking-overview]]
