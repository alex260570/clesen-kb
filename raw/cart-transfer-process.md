# Cart Transfer Process - Phase 2

## What This Is

Cart Transfer is **Phase 2 of the three-phase picking system**. After Master Picking is complete, carts filled with picked items need to be physically moved from the master pick locations to the Supermarket location. This is done using Transfer Orders in the system.

**The Three Phases:**

1. **Master Picking** - Pick from warehouse bins into zone/run carts
2. **Cart Transfer** (YOU ARE HERE) - Carts moved to Supermarket location
3. **Supermarket Picking** - Items picked from master carts into customer carts

## When This Happens

- After Master Picking is completed and quality checks are done
- When carts are marked "Ready to Transfer"
- Before Supermarket Picking can begin
- Multiple times per day as picking is completed

## What Happens Automatically

**After Master Picking completes:**

- System creates Transfer Orders for carts
- Transfer Orders group carts by destination location
- Cart status changes to "Ready to Transfer"
- Supermarket location is notified carts are coming

## Cart Status Progression

Carts move through these statuses:

1. **New** - Cart created, not yet assigned
2. **In Pick** - Being used during Master Picking
3. **Ready to Transfer** - Master picking complete, ready to move
4. **Transfer Shipped** - Transfer order posted, carts in transit
5. **Transfer Received** - Arrived at Supermarket, ready for Phase 3

**Supermarket Picking cannot start until cart status is "Transfer Received"!**

## How to Transfer Carts

### For Warehouse Staff

#### Step 1: Identify Carts Ready for Transfer

1. Look for carts with "Ready to Transfer" status
2. Check Transfer Order list for today
3. System shows:
   - Which carts to move
   - Destination location (usually Supermarket)
   - Cart numbers
   - Run numbers

#### Step 2: Physically Move the Carts

1. **Gather the carts** listed on the transfer order
2. **Verify cart numbers** match the transfer order
3. **Move carts** to Supermarket location
   - Use cart mover/forklift if available
   - Keep carts organized by run number
   - Don't mix items between carts
4. **Stage carts** in Supermarket receiving area

#### Step 3: Process the Transfer Order

1. Open the Transfer Order in the system
2. Click **Post Shipment** at the master location
   - Cart status changes to "Transfer Shipped"
3. At Supermarket location, click **Post Receipt**
   - Cart status changes to "Transfer Received"
4. System records time and user for both actions

### For Supermarket Staff

#### Receiving Carts

1. **Verify cart numbers** match the incoming transfer order
2. **Check cart contents** - make sure nothing fell out during move
3. **Post Receipt** in the system
4. **Organize carts** by run number in Supermarket staging area
5. System automatically checks all Supermarket tickets and sets any that have all carts available to **"Ready to Pick"**

## Important Notes

**Timing:**

- Transfers happen multiple times per day
- Don't wait to batch - transfer as master picks complete
- Supermarket needs carts to start their picking

**Cart Tracking:**

- Each cart has a unique entry number
- System tracks cart contents throughout transfer
- Cart Content Assignment records show what's in each cart

**If Issues During Transfer:**

- Report damaged items immediately
- Don't try to reorganize cart contents
- System tracks exactly what should be in each cart
- Discrepancies must be reported and documented

## Common Issues

### "Cart not found at Supermarket location"

**What this means:** Cart was marked as transferred but physically missing  
**What to do:**

- Check if cart is still at master location
- Look in receiving area at Supermarket
- Verify cart number (may have been misread)
- Report to supervisor - may need to reverse transfer

### "Transfer order already posted"

**What this means:** Someone already processed this transfer  
**What to do:**

- Check if carts are already at Supermarket
- Don't try to post again
- If carts are missing, report to supervisor

### Carts arrived but system shows "Transfer Shipped"

**What this means:** Receipt wasn't posted  
**What to do:**

- Find the Transfer Order
- Post the Receipt at Supermarket location
- This updates cart status to "Transfer Received"
- Supermarket picking can now start

### Items fell out or got damaged during transfer

**What to do:**

1. Don't put them back in the cart
2. Take photo of damage
3. Report to supervisor immediately
4. Cart Content record needs to be adjusted
5. May affect customer orders

## Where to Find This

**Menu:** Inventory → Transfer Orders  
**Pages:** Transfer Orders, Transfer Shipments, Transfer Receipts  
**Used by:** Warehouse Staff, Supermarket Staff, Supervisors  
**Also See:** Cart Management pages

## Tips for Success

✓ **Transfer promptly** - Don't let carts sit waiting  
✓ **Verify cart numbers** - Easy to grab wrong cart  
✓ **Keep carts organized** - Group by run number  
✓ **Handle carefully** - Items already went through one pick  
✓ **Post receipts quickly** - Supermarket is waiting  
✓ **Report damage immediately** - Don't hide problems  
✓ **Don't reorganize carts** - System expects specific contents

## What Happens Next

After carts are transferred and received:

**Phase 3 - Supermarket Picking:**

1. System automatically sets Supermarket tickets to "Ready to Pick" when all required carts have arrived
2. Supermarket pickers physically pick items from master carts
3. Items are placed into customer-specific carts
4. Quality checks performed again
5. Customer carts staged for loading/shipping

---

*Need help? Ask your supervisor or check the Manager's Guide for transfer order troubleshooting.*

---

## Related documents

- [[Picking-Process]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[cart-transfer-manager]]
- [[supermarket-picking-process]]
- [[single-order-picks]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[handling-escalations]]
- [[order-lock-process-manager]]
- [[picking-teams-manager-guide]]
