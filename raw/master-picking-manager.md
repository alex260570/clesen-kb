# Master Picking Process - Manager's Guide

## Process Overview

Master Picking is the core warehouse operation that consolidates orders from multiple customers into efficient picking runs. The system automates ticket generation, cart assignment, and inventory allocation to optimize picker productivity and warehouse throughput.

## How It Works

### Automated Workflow

The Master Picking process runs automatically via **job queue entries** scheduled for daily execution:

**1. Order Locking (Nightly - before ticket generation)**
- **Job:** Lock Orders for Master Pick
- **Schedule:** Runs once per day (typically 1-2 AM)
- **Function:** `CLELockOrdersForPick.OnRun()`
- **What it does:**
  - Identifies all orders for next day's shipment
  - Filters out Direct Location Pickup and excluded shipment methods
  - Locks orders to prevent modifications
  - Updates `CLE Picking Status` to "Locked For Master Pick"
  - Performs inventory pre-check
  - Sends Teams notifications if shortages exist

**2. Master Pick Ticket Generation (Nightly - after order locking)**
- **Job:** Create Master Pick Tickets
- **Schedule:** Runs after order locking completes
- **Function:** `CLECreateMasterPick.OnRun()`
- **What it does:**
  - Creates picking lines for all locked orders
  - Groups items by Location/Zone/Bin
  - Calculates cart requirements
  - Assigns items to numbered carts
  - Creates picking headers organized by zone
  - Handles delicate items requiring special carts
  - Generates supermarket tickets for remaining orders

### Business Logic Flow

```
Orders Created → Order Lock (Night) → Ticket Generation (Night) → 
Pick (Day) → Quality Check (Day) → Load & Ship (Day)
```

**Key Business Rules:**

1. **Order Eligibility**
   - Must have shipment date = tomorrow (or configured pick-ship offset)
   - Status = Open or Released
   - Not marked for Direct Location Pickup
   - Not using excluded shipment methods (e.g., "Pickup Temporary")
   - Contains inventory items with quantity to ship

2. **Cart Assignment Logic**
   - Calculated based on item volume and cart capacity
   - Delicate items get priority/special carts
   - Items grouped by category to minimize cross-contamination
   - Cart numbers assigned sequentially per zone

3. **Run Number System**
   - **Runs 1 through Max** (configurable in ClesenSetup, typically 10): Regular multi-customer master picks
   - **Runs Max+1 and above**: Single-order picks (large orders) and Escalations
   - Each run represents a separate picking workflow
   - Multiple runs can process on same pick date for different zones or purposes
   - Example: If Max=10, then Runs 1-10 are regular picks, Runs 11+ are single orders/escalations

4. **Location/Zone Organization**
   - Separate tickets per Location + Warehouse Zone combination
   - Optimizes picker travel within each zone
   - Lines sorted by Bin Code and Item Category

5. **Delicate Item Handling**
   - Items flagged as "delicate" on Item Card
   - Handled by **Codeunit 50106 "CLE Handle Delicate Items"**
   - During master pick line creation, delicate items are identified
   - Assigned to **customer-specific carts** (not mixed zone carts)
   - Cart labeled with customer name
   - At Supermarket, entire cart is transferred (no item-by-item re-picking)
   - **Benefit:** Items handled only once, reducing damage to fragile plants/flowers

6. **Picking Priority System**
   - If `CLE Activate Pick Priority` = TRUE in setup
   - Bins sorted by Priority field (highest first)
   - Optimizes warehouse travel and pick efficiency
   - Configure priority on Bin Content records

## Three-Phase Process

**Phase 1: Master Picking**
- Pick items from warehouse bins into zone/run carts
- Quality checks performed
- Carts marked "Ready to Transfer"

**Phase 2: Cart Transfer**
- Transfer orders created automatically
- Carts physically moved to Supermarket location
- Cart status progresses: Ready to Transfer → Transfer Shipped → Transfer Received

**Phase 3: Supermarket Picking**
- Supermarket tickets created for orders with "Master Pull" status
- Pickers physically pick FROM master carts INTO customer carts
- For delicate items, entire cart is grabbed (no re-picking)
- Quality checks performed again
- Customer carts staged for shipping

## Configuration and Setup

### Key Codeunits

**Master Picking System:**
- **50074 "CLE Create Master Pick"** - Main orchestration codeunit
- **50069 "CLE Create Master Pick Lines"** - Creates picking lines from locked orders
- **50072 "CLE Create Master Pick Header"** - Groups lines into tickets by zone
- **50070 "CLE Assign Carts To MasterPick"** - Calculates and assigns cart requirements
- **50075 "CLE Process Master Pick"** - Picker workflow (start, continuous, finish)
- **50106 "CLE Handle Delicate Items"** - Special handling for fragile items
- **50076 "CLE Process Transfer Order"** - Cart transfer automation

**Supermarket/Escalation:**
- **50078 "CLE Create Supermarket Ticket"** - Generates supermarket tickets
- **50080 "CLE Create Supermarket Lines"** - Creates supermarket picking lines
- **50081 "CLE Assign Carts To Supermrkt"** - Assigns master carts to supermarket tickets
- **50082 "CLE Process S-Market Pick"** - Supermarket picker workflow
- **50107 "CLE Create Escalation Tickets"** - Escalation processing

**Order Lock:**
- **50101 "CLE Lock Orders For Pick"** - Order locking automation
- **50009 "CLE Sales Management"** - Contains order lock functions

### Prerequisites

**CLE Clesen Setup Requirements:**
- `Activate Electronic Picking Tickets` = TRUE (enables the feature)
- `Picking Ticket No. Series` configured
- `Cart Capacity` defined (default cart volume)
- `Delicate Item Category` specified
- Valid Location and Zone codes in use

### Shipment Method Filters

Configure which shipment methods to **exclude** from Master Picking:
- Navigate to Shipment Methods
- Mark `CLE Ignore for Master Pick` for methods that should bypass (e.g., Customer Pickup)
- Common exclusions: Will Call, Temporary Pickup, Special Delivery

### Authorization

Locking/unlocking orders requires authorization:
- Navigate to Authorization Groups
- Add users to appropriate groups
- Only authorized users can manually lock/unlock orders

### Saturday Special Logic

**If Saturday IS a valid picking day:**
- System locks BOTH Monday and Tuesday orders on Saturday
- **Monday orders:** Assigned Run = 1 (or next regular run)
- **Tuesday orders:** Assigned Run = 50 (advance pick identifier)
- **Benefit:** Warehouse can work ahead on slower Saturday
- **Implementation:** Automatic in order lock process

**If Saturday is NOT a picking day:**
- Friday picks for Monday delivery as normal
- No advance picking occurs
- Uses standard next-day logic

**Configuration:**
- Picking Calendar in ClesenSetup defines valid picking days
- Shipping Calendar defines valid shipment days
- Saturday logic triggers automatically based on calendar setup

## Manual Operations

### Manual Lock/Unlock Orders

**When to use:** Override automatic locking for special situations

**Process:**
1. Navigate to Picking → Lock Orders for Pick
2. Select Pick Date and Ship Date
3. System checks for existing lock:
   - If already locked: Option to unlock
   - If not locked: Proceeds with lock
4. Verifies authorization before proceeding

**Business Impact:**
- Locked orders cannot be modified by sales staff
- Prevents mid-pick order changes that cause fulfillment issues
- Unlocking mid-process will cause inventory and cart allocation problems

### Manual Create Master Pick

**When to use:** 
- Rerun ticket generation after corrections
- Create additional run for late orders
- Test picking process

**Process:**
1. Navigate to Picking → Create Master Pick Tickets
2. Select Pick Date, Ship Date, Run No
3. Option: Ready Orders Only (exclude orders not fully confirmed)
4. System validates:
   - Orders must be locked first
   - Inventory availability checked
   - All previous carts must be transferred/cleared

**Important:** Creating tickets doesn't automatically assign to job queue - this is a manual override.

### Monitoring Active Picks

**Master Pick Ticket List** provides real-time oversight:
- Filter by Picking Date, Shipment Date, Run No
- Status tracking: Open, In Pick, Picked, Completed
- Picker assignment and timing
- Quality check completion status
- Performance metrics (units/hour, accuracy)

## Troubleshooting and Problem Resolution

### Common Issues

#### "All carts from previous picks need to be transferred"

**Problem:** Previous day's carts still in system  
**Root Cause:** Transfer process not completed from prior picks  
**Resolution:**
1. Navigate to Cart Management
2. Find carts with status "Transfer Shipped" or "Transfer Received"
3. Complete transfer posting
4. Verify all carts cleared before rerunning master pick

**Prevention:** Ensure end-of-day process includes cart transfer completion

#### "Not all required items are available in inventory"

**Problem:** Inventory shortfall detected during ticket generation  
**Root Cause:** 
- Inventory discrepancy between system and physical
- Late order modifications after availability check
- Production/purchase delays

**Resolution:**
1. Review inventory pre-check report (generated automatically)
2. Check Teams notifications for shortage details
3. Options:
   - Wait for incoming shipments/production
   - Create escalation tickets for affected orders
   - Contact customers to modify orders
4. Rerun inventory pre-check: Picking → Inventory Pre-Check

**Prevention:** 
- Daily cycle counts in high-volume bins
- Review purchasing/production schedules
- Lock orders earlier to prevent late changes

#### "Orders must be locked first"

**Problem:** Attempting to generate tickets without locking orders  
**Resolution:**
1. Run Lock Orders for Pick first
2. Verify orders appear with "Locked For Master Pick" status
3. Then generate tickets
4. Check job queue - lock job may have failed

#### Picker Reports Item Not in Bin

**Problem:** Physical inventory doesn't match system  
**Real-time Resolution:**
1. Check Item Availability by Location/Bin
2. Look for recent movements (transfers, adjustments)
3. Check if item in nearby bins (mis-putaway)
4. If found: Correct bin assignment, update pick line
5. If not found: 
   - Create escalation for that order line
   - Investigate inventory discrepancy
   - Perform bin recount

**Root Cause Analysis:**
- Review recent warehouse entries for that item
- Check for unposted documents
- Identify if systematic issue (training, process)

#### Ticket Generation Runs Too Long

**Problem:** Job takes excessive time (>30 minutes)  
**Root Cause:**
- Large volume of orders
- Complex bin structures
- Database performance

**Resolution:**
- Split into multiple runs (use Run No. 1, 2, 3, etc.)
- Process different zones separately
- Review database indices on picking tables
- Consider breaking very large shipment days across multiple pick dates

**Optimization:**
- Configure `Use Optimized Avail. Calc.` in Clesen Setup
- Index on Sales Line: Document No., Shipment Date, Item No., Location
- Index on Bin Content: Location, Zone, Bin, Item No.

## Performance Metrics and KPIs

### System-Tracked Metrics

**Per Ticket:**
- Picking Start/End Time
- Total Units Picked
- Picker ID
- Units per Hour (calculated)

**Per Picker:**
- Daily units picked
- Average pick time
- Accuracy rate
- Quality check compliance

### Reports Available

1. **Picking Statistics** - Overall performance by date
2. **Picker Activities** - Individual picker performance
3. **Master Picking Dashboard** - Real-time overview
4. **Inventory Shortage Report** - Pre-pick availability issues

### Performance Targets

**Recommended KPIs:**
- Master Pick units/hour: 150-250 (varies by operation)
- Accuracy rate: >98%
- On-time completion: >95% of tickets finished by 11 AM
- Quality check completion: 100%
- Shortage rate: <2% of lines

## Advanced Configuration

### Multi-Run Processing

For high-volume operations, split picking across multiple runs:
- Run 1: Zone A
- Run 2: Zone B  
- Run 3: Zone C
- Etc.

Configure in job queue or manual dialog:
1. Create separate job entries per run
2. Use Run No. filter
3. Stagger start times to prevent database contention

### Pick-Ship Offset Days

Configure how many days before shipment to pick:
- Standard: Pick Day = Ship Day - 1 (pick Tuesday for Wednesday ship)
- Same-day: Pick Day = Ship Day (Saturday picks for Saturday ship)
- Long-lead: Pick Day = Ship Day - 2 (pick Monday for Wednesday ship)

Configured per warehouse zone if needed via calendar settings.

### Delicate Item Handling

Items requiring special handling:
1. Mark Item Category as "Delicate"
2. System automatically:
   - Assigns to special carts
   - Routes to experienced pickers
   - Flags for quality review
3. Returns list of delicate items requiring supervisor oversight

### Integration Points

**Upstream Dependencies:**
- Sales Order Management (order creation and release)
- Inventory Management (availability calculations)
- Item Master (categories, UOMs, bin assignments)

**Downstream Dependencies:**
- Cart Management (cart creation and tracking)
- Shipping/Loading (cart to truck assignment)
- Transfer Orders (cross-location fulfillment)
- Inventory Posting (pick transactions)

## Job Queue Configuration

### Recommended Schedule

| Job | Frequency | Time | Dependencies |
|-----|-----------|------|--------------|
| Lock Orders | Daily | 1:00 AM | None |
| Inventory Pre-Check | Daily | 1:30 AM | Lock Orders complete |
| Create Master Pick | Daily | 2:00 AM | Lock Orders, Pre-Check complete |
| Create Supermarket | Daily | 2:30 AM | Master Pick complete |

### Job Parameters

**Lock Orders Job:**
```
Codeunit: 50101 "CLE Lock Orders For Pick"
Job Queue Category: PICKING
No GUI: TRUE
Maximum Attempts: 3
Rerun Delay: 30 minutes
```

**Create Master Pick Job:**
```
Codeunit: 50074 "CLE Create Master Pick"  
Job Queue Category: PICKING
No GUI: TRUE
Run after: Lock Orders
Maximum Attempts: 2
```

### Error Handling

**Failed Job Resolution:**
1. Review Job Queue Log Entry
2. Check error message
3. Common errors:
   - Database lock timeout → Rerun
   - Carts not transferred → Manual cart cleanup
   - Inventory shortage → Review and create escalations
4. Fix underlying issue
5. Rerun manually or wait for next scheduled run

## Related Processes

- **Supermarket Picking:** See [Supermarket Picking - Manager's Guide](supermarket-picking-manager.md)
- **Escalation Handling:** See [Escalation Process - Manager's Guide](escalation-process-manager.md)
- **Cart Management:** See [Cart Management - Manager's Guide](cart-management-manager.md)
- **Order Locking:** See [Order Lock Process - Manager's Guide](order-lock-process-manager.md)

## Best Practices

✓ **Lock orders early** - Prevents last-minute changes  
✓ **Monitor pre-check reports** - Catch inventory issues before picking starts  
✓ **Review picker performance** - Daily feedback improves accuracy  
✓ **Complete carts promptly** - Don't let them accumulate  
✓ **Validate job queue daily** - Ensure automated processes ran successfully  
✓ **Investigate all shortages** - Root cause analysis prevents recurring issues

---

**Technical Details:**
- Primary Codeunit: 50074 "CLE Create Master Pick"
- Supporting Codeunits: 50069-50073, 50075
- Primary Table: "CLE Master Picking Header", "CLE Master Picking Line"
- Pages: 50158 (Ticket), 50162 (List), 50191 (Dashboard)

**Last Updated:** February 2026

---

## Related documents

- [[Picking-Process]]
- [[master-picking-process]]
- [[cart-transfer-process]]
- [[cart-transfer-manager]]
- [[supermarket-picking-process]]
- [[single-order-picks]]
- [[delicate-item-handling]]
- [[direct-location-pickup]]
- [[handling-escalations]]
- [[order-lock-process-manager]]
- [[picking-teams-manager-guide]]
