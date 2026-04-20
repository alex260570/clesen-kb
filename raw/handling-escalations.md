# Handling Escalation Orders

## What This Is

Escalation orders are **late orders that need urgent picking**. They go through a special approval process, then flow through the same three-phase picking system (Master → Transfer → Supermarket) but with their own dedicated run numbers.

**The Three Phases for Escalations:**
1. **Master Picking** - Pick from warehouse bins into dedicated carts (unique run number)
2. **Cart Transfer** - Carts moved to Supermarket location
3. **Supermarket Picking** - Pick from master carts into customer carts

## When This Happens

- **Late orders** that arrive after nightly order lock
- **Rush orders** that need same-day or next-day shipping
- Orders that require **Transportation approval** for capacity
- Orders marked as "Escalation Request" that get approved

## The Escalation Workflow

Escalations follow a specific approval process BEFORE picking:

### Step 1: Salesperson Creates Request
1. Salesperson enters late order in system
2. Salesperson creates **Escalation Request** on the order
3. Order status shows "Escalation Request"
4. Request goes to Transportation for review

### Step 2: Transportation Approval
1. Transportation reviews capacity and delivery schedule
2. Can **Deny** if no capacity → Order waits for next regular pick
3. Can **Approve** if capacity available → Order proceeds to picking
4. If approved, status changes to "Escalation Approved"

### Step 3: Manager Creates Tickets
1. **Manager manually triggers** the escalation ticket creation function
2. System creates Master Pick Lines for each approved escalation
3. System creates Master Pick Headers
4. System assigns unique run numbers (above Max run number)
5. System creates Supermarket Tickets
6. Tickets appear in your picking lists

## How to Handle Escalation Orders

### For Master Pickers:

**Escalations appear as regular Master Pick tickets with high run numbers:**

1. Find Master Pick Ticket with run number above Max (e.g., Run 11, 12, 13)
2. Note: This is a single order, not mixed orders
3. Follow regular Master Picking process:
   - Start Picking
   - Pick items from warehouse bins
   - Place in carts assigned to that run number
   - Record quantities picked and cut
   - Finish Picking
   - Complete quality checks
4. Carts are marked "Ready to Transfer"
5. **Priority handling** - Transfer these carts quickly

**Important:** To you, this looks like a regular master pick. The system handles the run number assignment automatically.

### For Cart Transfer Staff:

**Escalation carts get priority:**

1. Look for carts with high run numbers (above Max)
2. **Transfer these first** before regular run carts
3. Follow regular transfer process
4. Post shipment and receipt promptly
5. Alert Supermarket team that escalation carts arrived

### For Supermarket Pickers:

**Escalation tickets show as Supermarket Pick tickets:**

1. Find Supermarket Pick Ticket with high run number
2. Ticket shows which master carts contain items (all from same run)
3. Follow regular Supermarket Picking process:
   - Start Picking
   - Pick items from master carts
   - Place into customer-specific carts
   - Record quantities
   - Finish Picking
   - Complete quality checks
4. **Priority handling** - Stage for immediate shipping

## What Makes Escalations Different

| Regular Picks | Escalation Orders |
|----------------|-------------------|
| Planned nightly | Late arrival, needs approval |
| Mixed orders (Runs 1-Max) | Single order (Run Max+1+) |
| Normal priority | High priority/urgent |
| Automatic scheduling | Manager manually triggers |
| Batch processing | Individual focus |
| Standard timeline | Rush handling throughout |

**Key Differences:**
- **Approval required** before picking
- **Manual trigger** by manager to create tickets
- **Dedicated run number** per order
- **Priority handling** at all three phases
- **Goes through full three-phase process** like any other pick

## Tips for Success

✓ **Speed matters** - But don't sacrifice accuracy  
✓ **Watch for high run numbers** - These are escalations (or single orders)  
✓ **Prioritize at every phase** - Master pick, transfer, and supermarket  
✓ **Communicate more** - Keep supervisor updated on progress  
✓ **Double-check everything** - Customer is likely waiting  
✓ **Complete quality checks thoroughly** - No time to fix mistakes later  
✓ **Report shortages immediately** - May need to contact customer ASAP

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
- Escalations can be short too - approval doesn't guarantee inventory
- System reallocates available inventory
- Pick what's available, cut the rest
- Record accurate quantities and reason codes
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
- "Must be perfect quality - photo order"
- "VIP customer"

**What to do:**
- Read all notes carefully on both Master and Supermarket tickets
- Ask supervisor if unclear
- Take extra time for quality
- Get supervisor to verify before completing

## Where to Find This

**For Master Pickers:** Picking → Master Pick Tickets (look for high run numbers)  
**For Supermarket Pickers:** Picking → Supermarket Pick Tickets (look for high run numbers)  
**Page Names:** Master Pick Ticket, Supermarket Pick Ticket  
**Used by:** All Warehouse Staff, Supervisors, Managers  
**Priority:** HIGH - Rush handling required

## What Happens Next

After escalation is complete:
1. Order goes to **front of shipping queue**
2. Customer is often contacted about status/ETA
3. Special handling for loading and delivery
4. May ship on special delivery vs. regular route
5. Tracked closely by supervisors

---

*Need help? Escalations are urgent - get supervisor immediately if any issues!*
4. Manager reviews why it was escalated (to prevent future issues)

---

*Escalations are important! These customers are already having problems - let's fix it for them.*

*Need help? Get your supervisor immediately - don't wait.*

---

## Related documents

- [[Picking-Process]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[cart-transfer-process]]
- [[cart-transfer-manager]]
- [[supermarket-picking-process]]
- [[single-order-picks]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[order-lock-process-manager]]
- [[picking-teams-manager-guide]]
