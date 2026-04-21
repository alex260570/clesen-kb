---
title: Picking Escalations
type: howto
tags: [picking, escalation, rush]
created: 2026-04-20
updated: 2026-04-20
sources: [handling-escalations.md]
---

# Picking Escalations

Late/rush orders requiring urgent picking. Go through the same three phases as regular picks but use dedicated run numbers (above Max) and require approval.

## Approval Workflow

1. **Salesperson** enters late order and creates Escalation Request → status "Escalation Request"
2. **Transportation** reviews capacity:
   - Deny → order waits for next regular pick
   - Approve → status becomes "Escalation Approved"
3. **Manager manually triggers** escalation ticket creation (Codeunit **50107 CLE Create Escalation Tickets**)
4. System creates Master + Supermarket tickets with run number > Max
5. Pickers handle as high priority through all three phases

## For Pickers

Escalations look like regular tickets with run numbers above Max.

- **[[master-picking]]:** Pick, quality check, mark Ready to Transfer — prioritize
- **[[cart-transfer]]:** Transfer escalation carts FIRST, before regular runs
- **[[supermarket-picking]]:** Stage immediately for shipping

## Escalation vs. [[single-order-picks]]

Both use high run numbers, but escalations require approval and are rush-prioritized; single orders are planned and normal priority.

## Common Situations

- **"Approved but no ticket"** — manager hasn't triggered creation yet
- **Still short inventory** — approval doesn't guarantee stock; pick what's available, record cuts, supervisor contacts customer
- **Denied** — no delivery capacity; order waits for next regular pick

## See Also

[[master-picking]], [[picking-overview]], [[single-order-picks]]
