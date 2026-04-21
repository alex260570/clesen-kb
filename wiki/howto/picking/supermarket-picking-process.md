---
title: Supermarket Picking Process
type: howto
tags: [picking, warehouse, supermarket-picking]
created: 2026-04-21
updated: 2026-04-21
sources: [supermarket-picking-process.md]
---

# Supermarket Picking Process — Phase 3

## What This Is

Supermarket Picking is **Phase 3 of the three-phase picking system**. You **physically pick items FROM the master pick carts** that were filled in Phase 1 and transferred in Phase 2. You then place these items **into customer-specific carts** for shipping.

**The Three Phases:**

1. **Master Picking** - Pick from warehouse bins into zone/run carts
2. **Cart Transfer** - Carts moved to Supermarket location
3. **Supermarket Picking** (YOU ARE HERE) - Pick from master carts into customer carts

**Important:** This is a PHYSICAL PICKING process, not just sorting. You are picking items item-by-item from the master carts.

## When You Use It

- After master pick carts have been transferred to Supermarket location
- When you see a Supermarket Pick Ticket assigned to you
- For orders that came through Master Picking with status "Master Pull"
- Orders must have cart status "Transfer Received" before you can start

## What Happens Before You Start

**After Cart Transfer completes:**

- System creates Supermarket tickets for orders with "Master Pull" status
- Orders are grouped by shipping destination (customer + address)
- When a transfer receipt is posted (or a same-location reclassification completes), the system automatically checks all tickets and sets any with all required carts to **"Ready to Pick"**
- Each ticket shows `From Cart Start No.` and `From Cart End No.`

**What you'll see**: Supermarket Pick Tickets with status **"Ready to Pick"**, showing which carts to pick from.

## How to Do Supermarket Picking

### Step 1: Find Your Ticket

1. Open **Supermarket Pick Tickets** from your menu
2. Look for tickets assigned to you
3. Your ticket shows:

   - Customer name
   - Order number(s)
   - **From Cart Start No.** - First master cart to pick from
   - **From Cart End No.** - Last master cart to pick from
   - Number of customer carts needed
   - Picking date

**Important:** The cart numbers tell you which MASTER PICK CARTS contain the items you need to pick.

### Step 2: Locate the Master Pick Carts

1. Go to Supermarket cart staging area
2. Find the carts listed on your ticket (Cart Start No. to Cart End No.)
3. These carts were filled during Master Picking and transferred here
4. Verify cart numbers match your ticket
5. Have customer-specific carts ready to receive items

### Step 3: Start Picking

1. Open the picking ticket
2. Click **Start Picking** button
3. System records your start time
4. System validates carts are available (status "Transfer Received")
5. If carts aren't ready, you'll get a message - wait for transfer to complete

### Step 4: Pick Items from Master Carts into Customer Carts

**This is a PHYSICAL PICKING process:**

1. **Look at each line** on the ticket - it shows:

   - Item description
   - Quantity needed
   - Which master cart(s) contain this item

2. **Go to the indicated master cart**
3. **Physically pick the items** from the master cart
4. **Place items into the customer-specific cart** for this order
5. **Record the quantity** you picked

**For each item:**

- Enter **Quantity Picked** (what you actually picked from master carts)
- Enter **Quantity Cut** (if the master cart didn't have enough)
- If there's a cut, enter **Reason Code** (Short in Master Cart, Damaged in Transit, Quality Issue, etc.)

**Using Continuous Picking Mode:**

1. After clicking Start Picking, use **Continuous Picking** button
2. System prompts you item-by-item
3. You pick from master carts and enter picked quantity
4. System automatically moves to the next item
5. Faster workflow for sequential picking

### Step 5: Handle Shortages

**If the master cart doesn't have enough of an item:**

1. Pick what's available in the master cart
2. Check other master carts in your range (Start to End No.)
3. Enter the shortage in "Quantity Cut"
4. Select a reason code:

   - **SHORT IN MASTER CART** - Master pick was short
   - **DAMAGED IN TRANSIT** - Item damaged during cart transfer
   - **QUALITY ISSUE** - Quality not acceptable
   - **MISSING FROM CART** - Item should be in cart but isn't
   - **OTHER** - Other reasons

5. Report significant shortages to supervisor
6. Continue with the rest of the order

**Note:** Shortages at this stage often mean Master Pick was short or items were damaged/lost during transfer.

### Special Case: Delicate Items

**For orders with delicate items:**

1. Look for carts marked for specific customers (customer name on cart)
2. These carts were filled during Master Pick with customer-specific items
3. **Don't pick item-by-item** from these carts
4. **Grab the ENTIRE CART** and assign it to the customer
5. Still record items in the system, but physical handling is minimal
6. Proceed to quality checks

**Benefit:** Delicate items (fragile plants, special flowers) are only handled once, reducing damage.

### Step 6: Finish Picking

1. After all items are picked from master carts into customer carts, click **Finish Picking**
2. System validates that Picked + Cut = Total for each line
3. System automatically adjusts sales order quantities based on what was picked
4. Records your end time and total units picked
5. Customer cart(s) are now ready for quality checks

**Important:** Sales orders are automatically updated with actual quantities picked at this stage.

### Step 7: Quality Checks

Perform these four checks on the CUSTOMER CARTS:

- **Labels Checked** ✓ - All items have correct customer labels
- **Quality Checked** ✓ - Items survived the two-pick process in good condition
- **Quantity Checked** ✓ - Counts match what you recorded
- **Water Checked** ✓ - Plants have been watered if needed

**Important:**

- Quality checks happen at BOTH Master Pick and Supermarket Pick stages
- This is the second quality check - items were checked after Master Pick too
- System records WHO checked each item (your user ID)
- All checks must be completed before customer cart can ship

## Tips for Success

✓ **Verify cart numbers** - Make sure you're picking from the correct master carts  
✓ **Use Continuous Picking** - Faster workflow for sequential picking  
✓ **Be accurate with cuts** - Report exactly what was missing from master carts  
✓ **Choose correct reason codes** - Helps identify if problem was in Master Pick or Transfer  
✓ **One customer at a time** - Focus on completing each order  
✓ **Watch for delicate item carts** - Grab the whole cart, don't re-pick  
✓ **Organize customer carts neatly** - Items are going straight to shipping  
✓ **Report significant shortages** - Supervisor may need to contact customer  
✓ **Complete all quality checks** - This is the final check before shipping

## Common Issues

### "Not all items are available for picking. Process cannot be started."

**What this means:** Master pick carts haven't been transferred yet, or cart status isn't "Transfer Received"  
**What to do:**

- Check cart transfer status
- Carts may still be in transit
- Wait for Phase 2 (Cart Transfer) to complete
- Check with transfer team if taking too long

### "You must start picking before you can use continuous picking"

**What this means:** Forgot to click Start Picking first  
**What to do:**

- Click **Start Picking** button
- Then use **Continuous Picking**

### "X Lines are having issues. Please double-check."

**What this means:** Some items don't match expected quantities  
**What to do:**

- Review each line
- Make sure Picked + Cut = Total Quantity
- Fix any discrepancies
- Try Finish Picking again

### Item not in the master cart

**What to do:**

1. Double-check cart number - are you looking in the right master cart?
2. Check other carts in your range (Start to End cart numbers)
3. Item may have been short in Master Pick
4. Check cart content assignment records if available
5. Enter what you found, mark rest as cut
6. Select reason code: "Missing from Cart" or "Short in Master Cart"
7. Report to supervisor

### Item quantity doesn't match cart contents

**What to do:**

1. Recount items in the master cart carefully
2. Items may have been damaged or lost during transfer
3. Enter actual picked quantity from master cart
4. Enter cut quantity with reason code
5. Report discrepancy to supervisor

## What Happens Next

After you finish Supermarket Picking:

**Immediate:**

1. Customer-specific carts are staged in shipping area
2. System marks orders as "Ready to Ship"
3. Sales orders are updated with actual quantities
4. Inventory counts are adjusted

**Loading/Shipping:**

1. Loading team assigns orders to delivery routes
2. Customer carts are loaded onto trucks
3. Delivery drivers get manifests
4. Orders ship to customers

**If Issues:**

- If there were cuts, supervisor contacts customer
- Short items may be substituted or back-ordered
- Quality issues are documented for improvement

**Your role in the three-phase process is complete!**

## Related Pages

- [[picking-overview]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[cart-transfer]]
- [[single-order-picks]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[picking-escalations]]
- [[picking-teams-manager]]
