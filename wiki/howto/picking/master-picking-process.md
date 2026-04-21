---
title: Master Picking Process
type: howto
tags: [picking, warehouse, master-picking]
created: 2026-04-21
updated: 2026-04-21
sources: [master-picking-process.md]
---

# Master Picking Process — Phase 1

## What This Is

Master Picking is **Phase 1 of a three-phase picking system**. You pick items from warehouse bins and place them into carts organized by zone and run number. These carts will later be transferred to the Supermarket area where items are sorted by customer.

**The Three Phases:**
1. **Master Picking** (YOU ARE HERE) - Pick from warehouse bins into zone/run carts
2. **Cart Transfer** - Carts are moved to Supermarket location
3. **Supermarket Picking** - Items picked from your carts into customer-specific carts

## When You Use It

- **Daily picking for regular shipments** - Most orders go through Master Picking
- When you see a Master Pick Ticket assigned to you
- For orders shipping the next day or later

## What Happens Automatically

**Every night at 1:00 AM**, the system automatically:
- Locks tomorrow's orders so nobody can change them
- Creates picking tickets organized by location and zone
- Assigns run numbers (Run 1 to Max for mixed orders)
- Assigns items to numbered carts
- Checks if there's enough inventory for all orders

**What you'll see in the morning**: Picking tickets ready to start in your Master Pick Tickets list.

## Understanding Run Numbers

Each picking ticket has a **Run Number** that organizes the pick:

- **Runs 1 through Max** (usually 1-10) = Regular master picks with mixed orders from multiple customers
- **Runs above Max** (11, 12, 13, etc.) = Single Order Picks (large orders for one customer)
- **Escalations** also get their own run numbers above Max

## How to Do Master Picking

### Step 1: Find Your Picking Ticket

1. Open **Master Pick Tickets** from your menu
2. Look for tickets with today's picking date
3. Your ticket shows:
   - Ticket number
   - Location/Zone you'll be picking in
   - Number of carts assigned
   - Cart numbers (start to end)

### Step 2: Start Picking

1. Open your picking ticket
2. Click **Start Picking** button
3. The system marks your start time and locks the ticket
4. You'll see a list of items organized by:
   - Cart number
   - Bin location
   - Item category (so flowers are together, etc.)

### Step 3: Pick the Items

**For each line on the ticket:**

1. Go to the bin location shown
2. Pick the quantity shown
3. **Place items in the correct cart number** - Cart assignments happen automatically
4. System shows you:
   - Item name and picture
   - How many to pick
   - Which cart to put it in
   - The bin where the item is located

**Pick in order** - The list is organized to minimize walking back and forth.

**About Cart Assignments:**
- As you validate quantities picked, items are automatically assigned to carts
- System tracks which cart each item goes into
- Cart space is dynamically allocated
- System prevents overfilling carts

**Using Continuous Picking Mode:**
After clicking Start Picking, you can use **Continuous Picking** button:
- System prompts you item-by-item automatically
- You enter picked quantity for each item
- System moves to the next item
- Faster than manual line-by-line entry

**For each item, record:**
- **Quantity Picked** (what you actually picked)
- **Quantity Cut** (shortfall, if any)
- **Reason Code** if there's a cut (Out of Stock, Damaged, Quality Issue, etc.)

**Special Note - Delicate Items:**
Some items are marked as "delicate" (fragile plants, special flowers). For these:
- You'll place them directly into **customer-specific carts** (not mixed carts)
- These customer carts will go all the way through to shipping without re-picking
- System will show you which cart is for which customer

### Step 4: What if Something's Wrong?

**Item not in the bin:**
- Check nearby bins
- Ask your supervisor
- Report shortage immediately

**Not enough quantity:**
- Pick what you can
- Note the shortage
- Let your supervisor know

**Item looks damaged:**
- Don't pick it
- Report it to your supervisor

### Step 5: Finish Picking

1. When all items are picked, return to the ticket
2. Click **Finish Picking** button
3. System validates that Picked + Cut = Total for each line
4. System records your end time and total units picked
5. Ticket status changes to show picking is complete

**Important:** System checks that all lines are complete before allowing you to finish.

### Step 6: Quality Checks

Before the carts can be transferred, complete these four checks:

- **Labels Checked** ✓ - All items have correct labels
- **Quality Checked** ✓ - Items are in good condition
- **Quantity Checked** ✓ - Counts match the ticket
- **Water Checked** ✓ - Plants have been watered if needed

**Important:** 
- All four checks must be completed
- System records WHO checked each item (your user ID)
- Carts cannot be marked "Ready to Transfer" until all checks are done
- Once carts are transferred, you cannot reopen the ticket

## Tips for Success

✓ **Start early** - Begin picking as soon as tickets are available  
✓ **Follow cart numbers** - Items must go in the correct cart  
✓ **Use Continuous Picking** - Faster workflow for sequential picking  
✓ **Pick in order** - The system groups items by area to save time  
✓ **Report problems immediately** - Don't wait until the end  
✓ **Double-check quantities** - Count carefully to avoid errors  
✓ **Watch for delicate items** - These go in special customer-specific carts  
✓ **Complete all quality checks** - Required before carts can transfer

## Common Issues

### "Not all items are available for picking"

**What this means:** Some items don't have enough inventory  
**What to do:** 
- Can't start picking yet
- Supervisor will create an Escalation Ticket
- Wait for supervisor to resolve the issue

### "All carts from previous picks need to be transferred"

**What this means:** Yesterday's carts are still in the system and haven't been transferred to Supermarket yet  
**What to do:**
- Talk to your supervisor
- Previous day's carts need to be processed through transfer first
- Cannot start new picks until previous carts are transferred

### Can't find an item in the bin

**What to do:**
1. Check the bin code again - make sure you're in the right spot
2. Check nearby bins (sometimes items get moved)
3. Ask a co-worker if they've seen it recently
4. Tell your supervisor - they can check inventory
5. Record as "cut" with appropriate reason code

### Cart assignment error

**What this means:** System can't allocate items to available carts  
**What to do:**
- System may be calculating wrong cart capacity
- Supervisor can manually adjust cart assignments
- Don't try to override cart numbers yourself

## What Happens Next

After you finish master picking and quality checks:

**Phase 2 - Cart Transfer:**
1. Carts are marked "Ready to Transfer"
2. Transfer orders are created to move carts to Supermarket location
3. Carts are physically moved/shipped to Supermarket
4. Transfer orders are received, carts status becomes "Transfer Received"

**Phase 3 - Supermarket Picking:**
5. Supermarket pickers sort items from your carts into customer-specific carts
6. For delicate items, supermarket just grabs the whole cart (no re-picking needed)
7. Quality checks are performed again
8. Customer carts are staged for loading/shipping
9. Orders are marked as ready to ship

**Your role is complete after Phase 1!** The Supermarket team takes over from here.

## Related Pages

- [[picking-overview]]
- [[master-picking-manager]]
- [[supermarket-picking-process]]
- [[cart-transfer]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[picking-escalations]]
- [[picking-teams-manager]]
