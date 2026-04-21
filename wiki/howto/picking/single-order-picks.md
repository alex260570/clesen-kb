---
title: Single Order Picks
type: howto
tags: [picking, warehouse, single-order-picks]
created: 2026-04-21
updated: 2026-04-21
sources: [single-order-picks.md]
---

# Single Order Picks

## What This Is

Single Order Picks are for **large orders from one customer** that get their own dedicated run number. They flow through the same three-phase picking system as regular picks, but all items are for one customer, making organization easier.

**The Three Phases:**
1. **Master Picking** - Pick from warehouse bins into dedicated carts (unique run number)
2. **Cart Transfer** - Carts moved to Supermarket location
3. **Supermarket Picking** - Pick from master carts into customer carts (simplified)

## When This Happens

- **Large customer orders** that would fill multiple carts
- Orders that are **too big to mix** with other orders efficiently
- Orders where keeping items together makes handling easier
- Automatically assigned based on order size

## Understanding Single Order Run Numbers

**Each large order gets its own unique run number:**

- System checks "Max. Number of Runs" setting in ClesenSetup (e.g., 10)
- Regular master picks use **Runs 1 through Max** (mixed orders from multiple customers)
- **Single order picks use Runs Max+1 and above** (one customer per run)
- Escalations also use Runs Max+1 and above
- System automatically assigns next available run number

**Example:**
- If Max = 10
- Runs 1-10 = Regular picks (mixed customers)
- Runs 11, 12, 13, etc. = Single orders (one customer each) or escalations

## Benefits of Single Order Picks

**For Master Pickers:**
- All items you pick are for one customer
- Don't need to split quantities across multiple carts
- Can organize carts logically for that customer
- Easier to track and verify

**For Supermarket Pickers:**
- **Just grab all carts with that run number**
- No complex item-by-item picking needed
- All items are already organized
- Faster processing
- Less chance of mixing orders

**For Shipping:**
- All customer's items are together
- Easier to load onto truck
- Clearer for delivery drivers
- Less chance of missing items

## How Single Order Picks Work

### Phase 1: Master Picking

**For Master Pickers:**

1. Find Master Pick Ticket with run number above Max (e.g., Run 11)
2. Note: This entire ticket is for one customer
3. Follow regular Master Picking process:
   - Start Picking
   - Pick items from warehouse bins
   - Place in carts assigned to that run number
   - All carts will be for this one customer
   - Record quantities picked and cut
   - Finish Picking
   - Complete quality checks

**Important:** System automatically creates customer-specific carts during master pick for large orders.

### Phase 2: Cart Transfer

**For Transfer Staff:**

1. Identify carts with higher run numbers
2. All carts with same run number belong together - one customer
3. Transfer as a group if possible
4. Follow regular transfer process
5. Post shipment and receipt

### Phase 3: Supermarket Picking

**For Supermarket Pickers:**

1. Find Supermarket Pick Ticket with high run number
2. System shows "From Cart Start No." to "From Cart End No."
3. **All carts in that range are for this one customer**
4. Two options:

**Option A - Grab Whole Cart Range (Preferred):**
- If carts are already well-organized
- Simply assign all carts to the customer
- Record in system
- Complete quality checks on all carts
- Stage for shipping

**Option B - Re-pick if Needed:**
- If carts need reorganization
- Pick items from master carts into final customer carts
- Follow regular Supermarket Picking process
- Complete quality checks
- Stage for shipping

## Identifying Single Order Picks

**You'll know it's a single order pick when:**

✓ Run number is above Max (e.g., 11, 12, 13, etc.)  
✓ Ticket shows only one customer name  
✓ Multiple carts all for same customer  
✓ Larger than typical order  
✓ May have note "Single Order Pick"

## Difference from Escalations

**Both use high run numbers (Max+1 and above), but:**

| Single Order Picks | Escalations |
|-------------------|-------------|
| Planned during nightly order lock | Late orders requiring approval |
| Automatic assignment | Manual approval + trigger |
| Large order, any timing | Rush/urgent timing |
| No special approval needed | Transportation must approve |
| Normal priority | High priority |

**For pickers:** Process is the same - both get dedicated run numbers!

## Tips for Success

✓ **Watch for high run numbers** - Indicates single order or escalation  
✓ **Keep carts together** - All carts for that run belong to one customer  
✓ **Organize thoughtfully** - You're setting up entire order  
✓ **Quality check all carts** - Large order = more impact if errors  
✓ **Communicate cart count** - Let Supermarket know how many carts coming  
✓ **Stage together** - Keep customer's carts grouped for loading  
✓ **Verify completeness** - Customer getting whole order at once

## Common Situations

### "Is this a single order or escalation?"

**Both use high run numbers!**
- Check order notes/status
- Escalations usually show "Escalation" status
- Single orders show regular "Master Pull" status
- For picking purposes, process is identical

### Multiple carts for one customer

**This is expected:**
- Large orders need multiple carts
- All carts have same run number
- Keep them together through all phases
- Don't try to consolidate - system expects multiple carts

### Supermarket - should I re-pick or grab whole cart range?

**Depends on cart organization:**
- If master picker organized well → Grab whole cart range
- If items mixed or messy → Re-pick into clean customer carts
- Ask supervisor if unsure
- Quality is most important

## What Happens Next

After single order pick is complete:
1. All customer's items staged together
2. Loading team sees single customer, multiple carts
3. Loaded onto delivery truck as a group
4. Customer receives complete large order
5. Inventory updated for full order

**Benefit:** Customer gets everything in one delivery, no split shipments!

## Related Pages

- [[picking-overview]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[supermarket-picking-process]]
- [[cart-transfer]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[picking-escalations]]
- [[picking-teams-manager]]
