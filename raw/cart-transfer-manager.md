# Cart Transfer Process - Manager's Guide

## Process Overview

Cart Transfer is Phase 2 of the three-phase picking system. It manages the physical movement of carts from master pick locations to the Supermarket location using Business Central Transfer Orders. This process is critical because Supermarket Picking cannot begin until carts have "Transfer Received" status.

**Last Updated:** February 9, 2026

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

| Status                | Description                      | Action Required               |
| --------------------- | -------------------------------- | ----------------------------- |
| **New**               | Cart created, not assigned       | None                          |
| **In Pick**           | Being used during Master Picking | Picking in progress           |
| **Ready to Transfer** | Master picking complete          | Create/process transfer order |
| **Transfer Shipped**  | Transfer order posted at source  | Receive at destination        |
| **Transfer Received** | Arrived at Supermarket           | Ready for Supermarket picking |

**Critical:** Supermarket picking is **blocked** until status = "Transfer Received"

### Key Codeunits

- **50076 \"CLE Process Transfer Order\"** - Transfer order automation
- **Codeunit 5740 \"TransferOrder-Post Shipment\"** - Standard BC posting (shipment)
- **Codeunit 5742 \"TransferOrder-Post Receipt\"** - Standard BC posting (receipt)

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
   - **Transfer-from Code:** Master pick location (e.g., MAIN)
   - **Transfer-to Code:** Supermarket location (e.g., SUPERMARKET)
   - **In-Transit Code:** Your configured in-transit location
   - **Shipment Date:** Today
4. Add lines:
   - **Item No.:** If tracking specific items (optional)
   - **Quantity:** Based on cart contents
   - **Or:** Reference cart numbers in description
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

**Note:** The automatic ticket readiness check only runs when the receiving location is the configured Supermarket location. A manual "Check Tickets" button is still available on the Supermarket Pick Tickets page if needed.

## Monitoring and Management

### Transfer Order Dashboard

**Key Metrics to Monitor:**

- Pending transfer orders (not yet shipped)
- In-transit transfers (shipped but not received)
- Average transfer time (shipment to receipt)
- Carts per transfer order
- Daily transfer volume

**Red Flags:**

- Transfer orders open > 4 hours
- In-transit status > 2 hours
- Increasing backlog of Ready to Transfer carts
- Supermarket complaints about cart availability

### Cart Tracking

**Cart Content Table** (`CLE Cart Content`) tracks:

- Cart Entry No.
- Item and quantity in cart
- Cart Status
- Shipment Date
- Run Number
- Location
- Transfer history

**Reports Available:**

1. **Cart Status Report** - Current status of all carts
2. **Transfer Order List** - Open/pending transfers
3. **Cart Movement History** - Audit trail
4. **Supermarket Waiting List** - Tickets blocked by cart status

### Performance Targets

**Recommended KPIs:**

- **Transfer Time:** < 1 hour from Ready to Transfer → Transfer Received
- **Receipt Posting:** Within 15 minutes of physical arrival
- **Zero Overnight In-Transit:** All transfers received by end of day
- **Error Rate:** < 1% (missing carts, mismatched quantities)

## Troubleshooting

### "Transfer order already posted"

**Problem:** Trying to post shipment/receipt again  
**Cause:** Transfer order already processed  
**Resolution:**

1. Check Transfer Order status - may show "Completed"
2. If carts are missing, create new transfer order
3. Don't try to reverse and repost
4. Investigate why first posting wasn't recognized

### Carts missing at Supermarket

**Problem:** Transfer order shows received but physical carts missing  
**Diagnostic Steps:**

1. Check cart numbers on transfer order
2. Verify cart location in system (may still show master location)
3. Check if carts still at source location (posting error)
4. Look in receiving area at Supermarket (may be staged incorrectly)
5. Review who posted receipt and when

**Resolution:**

- If found at source: Reverse receipt, re-receive correctly
- If truly missing: Investigate cart movement
- Create discrepancy report
- May need to re-pick items

**Prevention:**

- Physical verification before posting
- Cart number labels clearly visible
- Receiving area organization
- Sign-off process for transfers

### Supermarket can't start - carts show "Transfer Shipped"

**Problem:** Carts in-transit, not yet received  
**Cause:** Receipt not posted at Supermarket  
**Resolution:**

1. Find the Transfer Order (filter: Status = Partially Shipped)
2. Verify carts physically at Supermarket
3. Post Receipt immediately
4. Cart status updates to "Transfer Received"
5. Notify Supermarket pickers to begin

**Prevention:**

- Post receipt immediately upon physical arrival
- Don't wait to batch multiple receipts
- Supermarket team is waiting!

### Items damaged during transfer

**Problem:** Physical damage to items in carts  
**Immediate Actions:**

1. Don't post receipt yet
2. Document damage (photos)
3. Identify which items/quantities affected
4. Remove damaged items from carts
5. Adjust transfer order quantities if necessary
6. Post receipt for good items only
7. Create discrepancy report

**System Updates:**

1. Adjust Cart Content records to match reality
2. Update Supermarket ticket quantities (will show as cut)
3. May need to re-pick replacement items
4. Customer notification may be needed

**Root Cause Analysis:**

- How were items damaged? (handling, cart design, route)
- Delicate items in wrong carts?
- Training issue?
- Process improvement needed?

### Transfer order not created automatically

**Problem:** Master picking complete but no transfer order  
**Cause:**

- Automation disabled
- Job queue not running
- Configuration error
- Transfer route not defined

**Resolution:**

1. Check ClesenSetup: Auto-create transfer orders enabled?
2. Check Job Queue: Transfer creation job running?
3. Verify transfer route exists: Master Location → Supermarket Location
4. If all OK, create transfer order manually
5. Log issue for IT investigation

### Too many small transfer orders

**Problem:** Separate transfer order for each master pick ticket  
**Impact:**

- Administrative overhead
- Inefficient receiving
- Harder to track

**Resolution Options:**

1. **Batch transfers:** Group multiple tickets into single transfer order
2. **Schedule-based transfers:** Create transfer orders at specific times (e.g., every 2 hours)
3. **Threshold-based:** Create transfer when X carts ready
4. Requires customization of automated process

**Best Practice:** Balance between transfer frequency and batch size

## Integration Points

### With Master Picking

**Trigger:** Master picking completion triggers transfer readiness

- All quality checks must be complete
- Cannot create transfer if checks pending
- Master pick ticket status must be appropriate

### With Supermarket Picking

**Blocker:** Supermarket cannot start until carts received

- System validation checks cart status
- Error message if trying to start too early
- **Automatic readiness:** When a transfer receipt is posted at the Supermarket location (or a same-location reclassification completes), the system automatically checks all "New" Supermarket tickets for today and sets them to "Ready to Pick" if all required carts have arrived

**Dependencies:**

- Supermarket ticket creation happens AFTER master pick
- But tickets can't be worked until carts transferred
- Ticket readiness is now checked automatically on receipt — no manual "Check Tickets" step required

### With Inventory Management

**Inventory Movement:**

- Items temporarily in "In-Transit" location
- Reduces source location inventory on shipment
- Increases destination inventory on receipt
- Standard BC inventory tracking applies

**Reconciliation:**

- Cart contents must match transfer order
- Discrepancies create inventory variances
- Requires investigation and adjustment

## Best Practices

### Process Excellence

✓ **Transfer immediately** - Don't let carts sit "Ready to Transfer"  
✓ **Physical verification** - Count and verify before posting  
✓ **Post receipts promptly** - Supermarket is waiting  
✓ **Batch intelligently** - Balance efficiency vs. responsiveness  
✓ **Track metrics** - Monitor transfer times and error rates  
✓ **Clear communication** - Alert Supermarket when carts arriving  
✓ **Handle carefully** - Minimize damage during movement  
✓ **Document exceptions** - Track and investigate all discrepancies

### Operational Tips

**For High-Volume Days:**

- Schedule more frequent transfers
- Dedicate staff to transfer process
- Pre-stage carts for efficient loading
- Prioritize high-run or escalation carts

**For Delicate Item Carts:**

- Transfer these first or separately
- Extra care during movement
- Alert receiving team
- May need special handling equipment

**For Saturday Advance Picks:**

- Tuesday orders (Run 50) may transfer Saturday
- Or hold for Monday transfer
- Coordinate with Supermarket capacity

## Advanced Configuration

### Custom Transfer Automation

**Triggering Rules (Customizable):**

- Time-based: Every X hours
- Volume-based: Every Y carts
- Event-based: When master pick complete
- Priority-based: Escalations transfer immediately

**Grouping Logic (Customizable):**

- By run number
- By shipment date
- By zone/location
- By cart type (regular vs. delicate)

### Teams Integration

**Notifications Sent:**

- Transfer order created
- Transfer shipment posted
- Transfer receipt delayed (>threshold)
- Discrepancies found

**Configuration:**

- Webhook URL in ClesenSetup
- Message templates
- Alert thresholds
- Channel assignments

---

*For technical implementation details, contact IT. For operational questions, refer to Cart Transfer Process (Staff Guide).*

---

## Related documents

- [[Picking-Process]]
- [[master-picking-process]]
- [[master-picking-manager]]
- [[cart-transfer-process]]
- [[supermarket-picking-process]]
- [[single-order-picks]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[handling-escalations]]
- [[order-lock-process-manager]]
- [[picking-teams-manager-guide]]
