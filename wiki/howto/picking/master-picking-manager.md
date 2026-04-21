---
title: Master Picking — Manager Configuration
type: howto
tags: [picking, manager, configuration]
created: 2026-04-20
updated: 2026-04-20
sources: [master-picking-manager.md]
---

# Master Picking — Manager Configuration

Manager reference for configuring and monitoring [[master-picking]].

## Key Codeunits

- **50074 CLE Create Master Pick** — orchestration
- **50069 CLE Create Master Pick Lines**
- **50072 CLE Create Master Pick Header**
- **50070 CLE Assign Carts To MasterPick**
- **50075 CLE Process Master Pick** — picker workflow
- **50106 CLE Handle Delicate Items**
- **50101 CLE Lock Orders For Pick**

## Recommended Job Schedule

| Job | Time | Dependencies |
|-----|------|--------------|
| Lock Orders | 1:00 AM | None |
| Inventory Pre-Check | 1:30 AM | Lock Orders |
| Create Master Pick | 2:00 AM | Lock + Pre-Check |
| Create Supermarket | 2:30 AM | Master Pick |

## ClesenSetup Prerequisites

- `Activate Electronic Picking Tickets` = TRUE
- `Picking Ticket No. Series` configured
- `Cart Capacity` defined
- `Delicate Item Category` specified
- `Max. Number of Runs` (controls single-order/escalation cutoff)
- `CLE Activate Pick Priority` (optional; sorts bins by priority)

## Shipment Method Filters

Mark `CLE Ignore for Master Pick` on shipment methods to exclude (e.g., Will Call, Pickup Temporary).

## Saturday Advance Pick

If Saturday is a valid picking day, system locks BOTH Monday orders (Run 1) and Tuesday orders (Run 50). Configured via Picking/Shipping Calendars in ClesenSetup.

## Manual Operations

- **Lock/Unlock Orders:** Picking → Lock Orders for Pick
- **Create Master Pick:** Picking → Create Master Pick Tickets (select Pick Date, Ship Date, Run No)
- **Multi-run split:** Use separate Run No filters to parallelize zones

## KPIs

- Master Pick units/hour: 150-250
- Accuracy: >98%
- On-time completion: >95% by 11 AM
- Shortage rate: <2%

## See Also

[[master-picking]], [[picking-overview]], [[order-lock]], [[picking-escalations]], [[picking-teams-manager]]
