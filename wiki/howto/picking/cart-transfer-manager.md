---
title: Cart Transfer Manager's Guide
type: howto
tags: [picking, manager, cart-transfer]
created: 2026-04-21
updated: 2026-04-21
sources: [cart-transfer-manager.md]
---

# Cart Transfer Process — Manager's Guide

## Process Overview

Cart Transfer is Phase 2 of the three-phase picking system. It manages the physical movement of carts from master pick locations to the Supermarket location using Business Central Transfer Orders. This process is critical because Supermarket Picking cannot begin until carts have "Transfer Received" status.

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

### Cart Status Progression

Carts move through these statuses (tracked in Cart Content table):

| Status | Description | Action Required |
|--------|-------------|-----------------|
| **New** | Cart created, not assigned | None |
| **In Pick** | Being used during Master Picking | Picking in progress |
| **Ready to Transfer** | Master picking complete | Create/process transfer order |
| **Transfer Shipped** | Transfer order posted at source | Receive at destination |
| **Transfer Received** | Arrived at Supermarket | Ready for Supermarket picking |

**Critical:** Supermarket picking is **blocked** until status = "Transfer Received"

### Key Codeunits

- **50076 "CLE Process Transfer Order"** - Transfer order automation
- **Codeunit 5740 "TransferOrder-Post Shipment"** - Standard BC posting (shipment)
- **Codeunit 5742 "TransferOrder-Post Receipt"** - Standard BC posting (receipt)

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

## Best Practices

✓ **Timely transfers** - Move carts promptly to prevent bottlenecks  
✓ **Accurate postings** - Post shipment/receipt at correct times  
✓ **Monitor in-transit** - Track carts between locations  
✓ **Communicate with Supermarket** - Alert when carts arriving  
✓ **Document issues** - Report damage or discrepancies  
✓ **Verify receipts** - Confirm all carts arrived before accepting  

## Related Pages

- [[picking-overview]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[supermarket-picking-process]]
- [[cart-transfer]]
