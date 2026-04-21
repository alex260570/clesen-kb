---
title: Cart Transfer Process
type: howto
tags: [picking, warehouse, cart-transfer]
created: 2026-04-21
updated: 2026-04-21
sources: [cart-transfer-process.md]
---

# Cart Transfer Process — Phase 2

## What This Is

Cart Transfer is **Phase 2 of the three-phase picking system**. After Master Picking is complete, carts filled with picked items need to be physically moved from the master pick locations to the Supermarket location.

**The Three Phases:**
1. **Master Picking** - Pick from warehouse bins into zone/run carts
2. **Cart Transfer** (YOU ARE HERE) - Carts moved to Supermarket location
3. **Supermarket Picking** - Items picked from master carts into customer carts

## When This Happens

- After Master Picking is completed and quality checks are done
- When carts are marked "Ready to Transfer"
- Before Supermarket Picking can begin
- Multiple times per day as picking is completed

## Cart Status Progression

1. **New** - Cart created, not yet assigned
2. **In Pick** - Being used during Master Picking
3. **Ready to Transfer** - Master picking complete, ready to move
4. **Transfer Shipped** - Transfer order posted, carts in transit
5. **Transfer Received** - Arrived at Supermarket, ready for Phase 3

**Supermarket Picking cannot start until cart status is "Transfer Received"!**

## How to Transfer Carts

### Step 1: Identify Carts Ready for Transfer
1. Look for carts with "Ready to Transfer" status
2. Check Transfer Order list for today
3. System shows cart numbers, destination, and run numbers

### Step 2: Physically Move the Carts
1. Gather the carts listed on the transfer order
2. Verify cart numbers match the transfer order
3. Move carts to Supermarket location
4. Stage carts in Supermarket receiving area

### Step 3: Process the Transfer Order
1. Open the Transfer Order in the system
2. Click **Post Shipment** at the master location
   - Cart status changes to "Transfer Shipped"
3. At Supermarket location, click **Post Receipt**
   - Cart status changes to "Transfer Received"

## Important Notes

**Timing:**
- Transfers happen multiple times per day
- Don't wait to batch - transfer as master picks complete
- Supermarket needs carts to start their picking

**If Issues During Transfer:**
- Report damaged items immediately
- Don't try to reorganize cart contents
- System tracks exactly what should be in each cart
- Discrepancies must be reported and documented

## Common Issues

### "Cart not found at Supermarket location"
- Check if cart is still at master location
- Look in receiving area at Supermarket
- Verify cart number
- Report to supervisor if missing

### "Transfer order already posted"
- Check if carts are already at Supermarket
- Don't try to post again
- If carts are missing, report to supervisor

### Carts arrived but system shows "Transfer Shipped"
- Find the Transfer Order
- Post the Receipt at Supermarket location
- This updates cart status to "Transfer Received"

### Items fell out or got damaged during transfer
1. Don't put them back in the cart
2. Take photo of damage
3. Report to supervisor immediately
4. Cart Content record needs to be adjusted

## Related Pages

- [[picking-overview]]
- [[master-picking-process]]
- [[supermarket-picking-process]]
- [[cart-transfer-manager]]
