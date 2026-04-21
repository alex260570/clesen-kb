---
title: Handling Escalation Orders
type: howto
tags: [picking, escalations, urgent, rush-orders]
created: 2026-04-20
updated: 2026-04-21
sources: [handling-escalations.md]
---

# Handling Escalation Orders

Escalation orders are **late orders that need urgent picking**. They go through the same three-phase picking system but with special approval and priority handling.

## When Escalations Happen

- **Late orders** that arrive after nightly order lock
- **Rush orders** that need same-day or next-day shipping
- Orders requiring **Transportation approval** for capacity
- Orders marked "Escalation Request" that get approved

## The Escalation Workflow

### Step 1: Salesperson Creates Request
1. Salesperson enters late order in system
2. Salesperson creates **Escalation Request** on the order
3. Order status shows "Escalation Request"
4. Request goes to Transportation for review

### Step 2: Transportation Approval
1. Transportation reviews capacity and delivery schedule
2. Can **Deny** if no capacity → Order waits for next regular pick
3. Can **Approve** if capacity available → Proceeds to picking
4. If approved, status changes to "Escalation Approved"

### Step 3: Manager Creates Tickets
1. Manager manually triggers escalation ticket creation function
2. System creates Master Pick Lines for each approved escalation
3. System assigns unique run numbers (above Max run number)
4. System creates Supermarket Tickets
5. Tickets appear in picking lists

## For Master Pickers

**Escalations appear as regular Master Pick tickets with high run numbers:**

1. Find Master Pick Ticket with run number above Max (e.g., Run 11, 12, 13)
2. Note: This is a single order, not mixed orders
3. Follow regular [[master-picking]] process:
   - Start Picking
   - Pick items from warehouse bins
   - Place in carts assigned to that run number
   - Record quantities picked and cut
   - Finish Picking
   - Complete quality checks
4. Carts marked "Ready to Transfer"
5. **Priority handling** — Transfer these carts quickly

To you, this looks like a regular master pick. The system handles the run number assignment automatically.

## For Cart Transfer Staff

**Escalation carts get priority:**

1. Look for carts with high run numbers (above Max)
2. **Transfer these first** before regular run carts
3. Follow regular [[cart-transfer-process]]
4. Post shipment and receipt promptly
5. Alert Supermarket team that escalation carts arrived

## For Supermarket Pickers

**Escalation tickets show as Supermarket Pick tickets:**

1. Find Supermarket Pick Ticket with high run number
2. Ticket shows which master carts contain items (all from same run)
3. Follow regular [[supermarket-picking-process]]:
   - Start Picking
   - Pick items from master carts
   - Place into customer-specific carts
   - Record quantities
   - Finish Picking
   - Complete quality checks
4. **Priority handling** — Stage for immediate shipping

## Key Differences from Regular Picks

| Regular Picks | Escalation Orders |
|---|---|
| Planned nightly | Late arrival, needs approval |
| Mixed orders (Runs 1-Max) | Single order (Run Max+1+) |
| Normal priority | High priority/urgent |
| Automatic scheduling | Manager manually triggers |
| Batch processing | Individual focus |
| Standard timeline | Rush handling throughout |

**Critical differences:**
- **Approval required** before picking
- **Manual trigger** by manager to create tickets
- **Dedicated run number** per order
- **Priority handling** at all three phases
- **Full three-phase process** like any other pick

## Tips for Success

✓ **Speed matters** — But don't sacrifice accuracy  
✓ **Watch for high run numbers** — These are escalations  
✓ **Prioritize at every phase** — Master pick, transfer, and supermarket  
✓ **Communicate more** — Keep supervisor updated on progress  
✓ **Double-check everything** — Customer is likely waiting  
✓ **Complete quality checks thoroughly** — No time to fix mistakes later  
✓ **Report shortages immediately** — May need to contact customer ASAP

## Common Situations

### "Transportation denied the escalation"

**What this means:** No delivery capacity available  
**What to do:**
- Order will wait for next regular picking
- No ticket will be created for you
- Salesperson will contact customer about delay

### "Escalation approved but no ticket yet"

**What this means:** Manager hasn't manually triggered ticket creation  
**What to do:**
- Approval doesn't automatically create tickets
- Manager must run the escalation creation function
- Check with supervisor on timing

### Still short inventory after escalation

**What to do:**
- Escalations can be short too — approval doesn't guarantee inventory
- System reallocates available inventory
- Pick what's available, cut the rest
- Record accurate quantities and [[picking-adjustment|reason codes]]
- Supervisor will contact customer about shortage

### Customer called and is waiting

**What to do:**
- Mark as HIGH PRIORITY at all phases
- Communicate with transfer team for quick cart movement
- Keep supervisor updated on ETA
- May need to expedite through all three phases

### Escalation has special requirements

**Examples:**
- "Customer needs by 2 PM today"
- "Must be perfect quality — photo order"
- "VIP customer"

**What to do:**
- Read all notes carefully on both Master and Supermarket tickets
- Ask supervisor if unclear
- Take extra time for quality
- Get supervisor to verify before completing

## Related Pages

- [[picking-overview]]
- [[master-picking-process]]
- [[cart-transfer-process]]
- [[supermarket-picking-process]]
- [[picking-teams-manager]]
- [[single-order-picks]]
