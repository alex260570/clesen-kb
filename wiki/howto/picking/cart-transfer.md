---
title: Cart Transfer Process
type: howto
tags: [picking, warehouse, cart-transfer]
created: 2026-04-20
updated: 2026-05-01
sources: [cart-transfer-manager.md, cart-transfer-process.md]
---

# Cart Transfer Process

## What This Is

Cart Transfer is **Phase 2 of the three-phase picking system**. After Master Picking is complete, carts filled with picked items need to be physically moved from the master pick locations to the Supermarket location.

**The Three Phases:**
1. **Master Picking** - Pick from warehouse bins into zone/run carts
2. **Cart Transfer** (YOU ARE HERE) - Carts moved to Supermarket location
3. **Supermarket Picking** - Items picked from master carts into customer carts

## Process Overview

Cart Transfer manages the physical movement of carts from master pick locations to the Supermarket location using Business Central Transfer Orders. This process is critical because Supermarket Picking cannot begin until carts have "Transfer Received" status.

## When This Happens

- After Master Picking is completed and quality checks are done
- When carts are marked "Ready to Transfer"
- Before Supermarket Picking can begin
- Multiple times per day as picking is completed

## Cart Status Progression

Carts move through these statuses (tracked in Cart Content table):

| Status | Description | Action Required |
|--------|-------------|-----------------|
| **New** | Cart created, not assigned | None |
| **In Pick** | Being used during Master Picking | Picking in progress |
| **Ready to Transfer** | Master picking complete | Create/process transfer order |
| **Transfer Shipped** | Transfer order posted at source | Receive at destination |
| **Transfer Received** | Arrived at Supermarket | Ready for Supermarket picking |

**Critical:** Supermarket picking is **blocked** until status = "Transfer Received"

## How It Works

### Automated Workflow

**Trigger:** After Master Picking completes and quality checks are done

**Process Flow:**
1. Master picker completes ticket and marks all quality checks
2. Carts marked "Ready to Transfer"
3. **Transfer Order created automatically** (or manually by manager)
4. Warehouse staff physically moves carts to Supermarket location
5. **Transfer Shipment posted** at master location
   - Cart Status changes to "Transfer Shipped"
6. **Transfer Receipt posted** at Supermarket location
   - Cart Status changes to "Transfer Received"
7. Supermarket tickets become available to start

## Configuration

### Location Setup

**Prerequisites:**
- Master pick locations configured (e.g., MAIN, ZONE-A, ZONE-B)
- Supermarket location configured (e.g., SUPERMARKET, S-MARKET)
- **In-Transit Code** configured for transfer orders
- Transfer routes defined between locations

**CLE Clesen Setup:**
- `Supermarket Location Code` - Where carts are transferred to
- Default transfer configuration
- Cart capacity settings

### Transfer Order Automation

#### Option 1: Automatic Creation (Recommended)
- System creates transfer orders when master picking completes
- Groups carts by source/destination location
- Transfer order per master pick ticket or grouped
- Codeunit 50076 handles automation

#### Option 2: Manual Creation
- Manager creates transfer orders on demand
- More control but requires manual intervention
- Navigate to: Inventory → Transfer Orders → New

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

## Manual Operations

### Creating Transfer Orders Manually

**When to use:**
- Automatic creation disabled
- Transfer for specific cart group needed
- Testing or special situations

**Process:**
1. Navigate to **Inventory → Transfer Orders**
2. Click **New**
3. Fill in:
   - **Transfer-from Code:** Master pick location
   - **Transfer-to Code:** Supermarket location
   - **In-Transit Code:** Your configured in-transit location
   - **Shipment Date:** Today
4. Add lines based on cart contents
5. Post Shipment when carts leave source location
6. Post Receipt when carts arrive at destination

### Posting Transfer Shipment

**When:** Carts physically leave master pick location

**Process:**
1. Open Transfer Order
2. Verify cart numbers and contents
3. Click **Post → Shipment**
4. System updates:
   - Cart Status → "Transfer Shipped"
   - Transfer Order Status → Partially/Fully Shipped
   - Inventory temporarily in "In-Transit"

**Best Practice:** Post shipment immediately when carts physically move

### Posting Transfer Receipt

**When:** Carts arrive at Supermarket location

**Process:**
1. Physical verification:
   - Count carts received
   - Check cart numbers match transfer order
   - Inspect for damage during transit
2. Open Transfer Order
3. Click **Post → Receipt**
4. System updates:
   - Cart Status → "Transfer Received"
   - Supermarket location inventory updated
   - Transfer Order Status → Completed
   - **System automatically checks all Supermarket tickets and sets any with all carts available to "Ready to Pick"**

**Note:** The automatic ticket readiness check only runs when the receiving location is the configured Supermarket location.

## Monitoring and Management

### Transfer Order Dashboard

**Key Metrics to Monitor:**
- Pending transfer orders (not yet shipped)
- In-transit transfers (shipped but not received)
- Average transfer time (shipment to receipt)
- Carts per transfer order

### Key Codeunits

- **50076 "CLE Process Transfer Order"** - Transfer order automation
- **Codeunit 5740 "TransferOrder-Post Shipment"** - Standard BC posting (shipment)
- **Codeunit 5742 "TransferOrder-Post Receipt"** - Standard BC posting (receipt)

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

## Best Practices

✓ **Timely transfers** - Move carts promptly to prevent bottlenecks  
✓ **Accurate postings** - Post shipment/receipt at correct times  
✓ **Monitor in-transit** - Track carts between locations  
✓ **Communicate with Supermarket** - Alert when carts arriving  
✓ **Document issues** - Report damage or discrepancies  
✓ **Verify receipts** - Confirm all carts arrived before accepting  

## Related Pages

- [[picking-overview]]
- [[master-picking]]
- [[supermarket-picking-process]]
- [[picking-escalations]]
- [[picking-teams-manager]]
