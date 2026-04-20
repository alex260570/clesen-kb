# Order Lock Process - Manager's Guide

## Process Overview

Order Locking is the critical first step in the picking workflow that freezes orders to prevent modifications during picking operations. This ensures inventory allocations remain accurate and pickers work with stable data.

## How It Works

### Automated Locking

**Job Queue Entry:** "Lock Orders For Master Pick"  
**Schedule:** Daily at 1:00 AM (configurable)  
**Codeunit:** 50101 "CLE Lock Orders For Pick"

**What the automated job does:**

1. **Calculates Pick and Ship Dates**
   - Pick Date = Today + 1 (tomorrow)
   - Ship Date = Next valid shipping day after pick date
   - Uses picking date calculation logic (excludes weekends/holidays)

2. **Identifies Eligible Orders**
   - Document Type = Order
   - Shipment Date matches calculated ship date
   - Direct Location Pickup = FALSE
   - Picking Status = Blank (not already locked)
   - Not Completely Shipped
   - Shipment Method not in exclusion list
   - Contains at least one inventory item line with qty to ship

3. **Locks Qualifying Orders**
   - Sets `CLE Picking Status` = "Locked For Master Pick"
   - Sets `CW Run No.` = 0 (unassigned to any run yet)
   - Prevents further modifications to order

4. **Performs Inventory Pre-Check**
   - Calculates availability for all locked orders
   - Identifies potential shortages
   - Sends Teams notification if issues found

5. **Special Saturday Logic**
   - **If Saturday IS a valid picking day:**
     - Locks BOTH Monday AND Tuesday orders
     - Monday orders: Assigned **Run = 1** (regular Monday pick)
     - Tuesday orders: Assigned **Run = 50** (advance pick for Tuesday)
     - Allows warehouse to work ahead on lower-volume Saturday
     - Both sets of orders go through full three-phase process (Master → Transfer → Supermarket)
   
   - **If Saturday is NOT a picking day:**
     - Friday locks Monday orders only
     - No advance picking
     - Standard next-working-day logic applies
   
   - **Implementation Details:**
     - System checks **Picking Calendar** to determine if Saturday is working day
     - Checks **Shipping Calendar** to determine valid Monday/Tuesday ship dates
     - Run number assignment is automatic based on target shipment day
     - Pickers see two separate sets of tickets on Saturday (Run 1 for Monday, Run 50 for Tuesday)

### Status Tracking

Orders progress through these picking statuses:
- **Blank** - Not locked, can still be modified
- **Locked For Master Pick** - Frozen, awaiting ticket generation
- **Master Pull** - Master picking completed, awaiting supermarket pick
- **In Master Pick** - Tickets generated, picking in progress
- **Escalation Request** - Problem identified, needs manager approval
- **Escalation Approved** - Approved for escalation picking
- **Escalation in Pick** - Escalation picking in progress
- **Supermarket Pick** - In supermarket picking phase
- **Direct Location Pick** - Assigned to direct pickup process
- **Completed** - Fully picked and ready for shipment

## Calendar System

### Two Separate Calendars

The system uses **two distinct calendars** for different purposes:

**1. Picking Calendar**
- Defines valid days for warehouse picking operations
- Configured in: CLE Clesen Setup → Picking Calendar Code
- If a date is not a valid picking day, it cannot be used as a picking date
- Examples: Warehouse closed Sundays, holidays

**2. Shipping Calendar**
- Defines valid days for customer shipments/deliveries
- Configured in: CLE Clesen Setup → Shipping Calendar Code
- System automatically skips non-shipping days when calculating shipment dates
- Examples: No deliveries on major holidays

**Calendar Sources:**
- Based on **Base Calendar Change** table
- Supports both recurring entries (every Sunday) and specific date entries (July 4th, 2026)
- Can be customized per year

**Why Two Calendars:**
- Warehouse may work days when no deliveries occur (prep for next day)
- Deliveries may happen on days warehouse doesn't pick (pre-picked inventory)
- Allows flexible scheduling

### Friday-Monday Logic

**Scenario 1: Saturday is NOT a picking day, but Monday IS a shipping day**
- Friday does NOT lock Monday orders (would sit too long)
- Monday morning locks and picks for Monday delivery (same-day)
- Requires efficient Monday morning execution

**Scenario 2: Saturday IS a picking day**
- Friday locks Monday orders for Saturday pick
- Saturday also locks Tuesday orders (advance pick with Run=50)
- Standard advance-day picking workflow

**Configuration Impact:**
- Carefully configure both calendars to match business needs
- Test date calculations before going live
- Document any special scheduling rules

## Manual Operations

### When to Manually Lock Orders

**Scenarios requiring manual intervention:**
- **Late-breaking orders** - Customer adds order after automated lock
- **Shipment date changes** - Orders shifted to different day
- **Special handling** - VIP customer needs priority
- **Testing** - Validate picking process
- **Job failure recovery** - Automated job didn't complete

### How to Manually Lock Orders

**Navigation:** Picking → Lock Orders for Pick

**Process:**
1. Click "Lock Orders for Pick" action
2. Dialog appears:
   - Pick Date: Tomorrow (default)
   - Ship Date: Next valid ship day (auto-calculated)
   - Ready Orders Only: TRUE/FALSE
3. Click OK to proceed

**Authorization Required:**
- System checks if user is in authorized group
- Error message if not authorized: "You are not authorized to lock orders for picking"
- Contact administrator to add user to authorization group

**If orders already locked:**
- System asks: "Orders are already locked for shipment date X. Do you want to unlock them?"
- **Yes** → Unlocks orders (dangerous if picking in progress!)
- **No** → Cancels operation

### Emergency Lock Function

**Function:** `LockNextDayOrdersIfNotLocked()`  
**Purpose:** Manually trigger lock for next day if automated job failed or hasn't run

**When to use:**
- Automated lock job failed overnight
- Same-day picking needed (Monday morning for Monday delivery)
- Testing or troubleshooting
- Job queue disabled/paused

**How it works:**
1. Checks if tomorrow's orders are already locked
2. If not locked, performs lock process
3. Sends **Teams notification** to warehouse managers
4. Returns confirmation of orders locked

**Access:**
- Usually available as action on Sales Order list or Picking Dashboard
- Requires authorization
- Can be run multiple times safely (checks existing lock first)

**Teams Integration:**
- Notification sent to configured channel
- Includes order count, ship date
- Alerts team that emergency lock occurred
- Helps track non-standard operations

### Post-Lock Inventory Pre-Check

**Automatic Integration:**

After orders are locked, system automatically runs:
- **Codeunit: Inventory Pre-Check**
- Calculates availability for all locked orders
- Compares required quantities vs. available inventory
- Identifies shortages by item/order/location

**If Shortages Found:**
1. **Teams Notification Sent:**
   - Lists short items
   - Shows affected orders
   - Displays shortage quantities
   - Sent to warehouse management channel

2. **System Tracking:**
   - Shortage records created
   - Available for review in system
   - Can be viewed before ticket generation

3. **Manager Action Required:**
   - Review shortage list
   - Decide on resolution:
     - Wait for incoming inventory
     - Create escalation
     - Contact customer
     - Substitute items
   - Ticket generation may proceed (system will show cuts)

**Benefits:**
- Early warning of fulfillment issues
- Time to resolve before picking starts
- Reduces mid-pick surprises
- Improves customer communication

**Configuration:**
- Teams webhook URL in ClesenSetup
- Notification template customizable
- Can be disabled if not using Teams

### When to Unlock Orders

**Valid reasons to unlock:**
- **Before picking starts** - Need to modify orders
- **Critical customer change** - Must accommodate urgent request
- **Wrong date locked** - System error or misconfiguration

**DANGER - Do not unlock if:**
- Picking tickets already generated
- Pickers have started work
- Carts have been assigned

**Unlocking mid-process causes:**
- Inventory allocation mismatches
- Picker confusion (orders disappear from tickets)
- Cart assignment errors
- Potential duplicate picks

## Business Rules and Logic

### Shipment Method Filtering

**Excluded Shipment Methods:**
- Configure in Shipment Method master: `CLE Ignore for Master Pick` = TRUE
- Common exclusions:
  - "PICKUP" - Customer pickup orders
  - "TEMPORARY" - Hold orders
  - "DIRECT SHIP" - Vendor direct shipments

**Why exclude:**
- These orders don't go through normal picking process
- Handled separately via Direct Location or other means
- Including them causes confusion and wasted picking effort

### Direct Location Pickup Flag

Orders marked `CLE Direct Loc. Pickup` = TRUE are automatically excluded:
- Customer pickup orders
- Will-call orders
- Special location-specific picks
- Handled via separate Direct Location process

### Ready Orders Only Option

**When enabled (TRUE):**
- Only locks orders that are fully ready
- Excludes orders with:
  - Pending approvals
  - Incomplete item information
  - Credit holds
  - Other blocking issues

**When disabled (FALSE):**
- Locks all orders meeting date/status criteria
- Used by automated job
- May lock orders that later need escalation

**Best practice:** Use TRUE for manual locks, FALSE for automated.

### Weekend and Holiday Handling

**Friday Pick for Monday Ship:**
- Standard: Friday picks for Monday
- If Saturday is NOT a valid picking day: Friday lock includes Monday orders

**Saturday Pick for Monday + Tuesday Ship:**
- Saturday IS a picking day: Locks both Monday and Tuesday orders
- Monday orders: Run 0 (normal)
- Tuesday orders: Run 50 (advance pick)
- Warehouse works ahead on lower-volume days

**Holiday Handling:**
- System checks Date table for working/non-working days
- Skips non-working days when calculating ship dates
- Locks orders for next valid working day

## Troubleshooting

### "Orders must be locked first"

**Problem:** Trying to generate picking tickets without locking  
**Resolution:**
1. Check if lock job ran successfully (Job Queue Log)
2. If failed, run manually: Lock Orders for Pick
3. Verify orders show "Locked For Master Pick" status
4. Then proceed with ticket generation

**Prevention:**
- Monitor job queue daily
- Set up job failure notifications
- Run manual lock if automated job fails

### No Orders Locked

**Problem:** Lock job runs but no orders are locked  
**Possible Causes:**
1. **No orders for tomorrow** - Check sales order list
2. **Orders already locked** - Check picking status on orders
3. **All orders excluded** - Review shipment method filters
4. **All Direct Location** - Orders flagged for direct pickup
5. **Date calculation issue** - Verify next ship day logic

**Diagnostic Steps:**
1. Navigate to Sales Orders
2. Filter: Shipment Date = tomorrow, Status = Open/Released
3. Check `CLE Picking Status` - should be blank if not yet locked
4. Check `CLE Direct Loc. Pickup` - should be FALSE
5. Check Shipment Method - should not be excluded
6. Verify orders have inventory item lines with qty to ship

### Locked Wrong Date

**Problem:** Orders locked for wrong shipment date  
**Root Cause:**
- Manual entry error
- Date calculation misconfigured
- Holiday calendar not updated

**Resolution:**
1. Unlock the incorrectly locked orders
2. Verify correct dates in picking date calculator
3. Re-lock with correct dates
4. Check Date table for holiday configuration

**Prevention:**
- Validate date calculator logic monthly
- Update holiday calendar in advance
- Review locked orders each morning before tickets generate

### Authorization Issues

**Problem:** User cannot lock/unlock orders  
**Resolution:**
1. Navigate to Authorization Groups
2. Find group for picking operations (typically "PICKING" or "WAREHOUSE")
3. Add user as member of group
4. User must log out and back in for permissions to take effect

**Security Note:** Restrict lock/unlock to supervisors and managers only. Regular staff should not have this permission.

### Inventory Pre-Check Failures

**Problem:** Lock completes but pre-check shows shortages  
**What happens:**
- Orders are locked
- Teams notification sent to warehouse managers
- Shortages listed by item/order
- Ticket generation may still proceed

**Manager Action Required:**
1. Review pre-check report (Teams or in system)
2. Options:
   - **Wait** - If shipment arriving soon
   - **Escalate** - Create escalation tickets
   - **Modify** - Contact customer to change order
   - **Substitute** - Use alternate items if acceptable
3. Decision must be made before picking starts

### Late Order Additions

**Problem:** Customer adds order after lock completed  
**Options:**

**Option 1: Wait for Next Day**
- Safest approach
- Order picked tomorrow for next-day ship
- Communicate new ship date to customer

**Option 2: Manual Lock + Escalation**
- Manually lock the new order
- Create escalation ticket for that order
- Picks separately from master picks
- Higher cost, but accommodates customer

**Option 3: Unlock, Add, Relock (HIGH RISK)**
- Only if tickets NOT YET generated
- Unlock all orders
- Add new order
- Relock all
- Regenerate tickets
- **Do not do if picking started!**

## Performance and Monitoring

### Key Metrics

**Lock Job Performance:**
- Execution time: Should be < 5 minutes for normal volume
- Orders locked: Track daily volume
- Failure rate: Should be < 1%

**Order Lock Timing:**
- Lock completion time: Target before 1:30 AM
- Orders locked per minute: ~50-100 orders/minute typical
- Error rate: Track authorization failures, data issues

### Monitoring Dashboard

**Daily Morning Checklist:**
1. ✓ Verify lock job completed successfully
2. ✓ Review count of locked orders (matches expectations?)
3. ✓ Check inventory pre-check report for shortages
4. ✓ Confirm locked orders are for correct shipment date
5. ✓ Review any Teams notifications from overnight processing

**Navigation:** Picking → Picking Dashboard or Job Queue Log

### Teams Notifications

**Automatic notifications sent when:**
- Lock job fails completely
- Inventory pre-check identifies shortages
- Critical errors during order evaluation

**Message includes:**
- Shipment date affected
- Number of orders impacted
- Summary of issues (if shortages)
- Recommendation for action

**Channel:** Configure in Teams Integration Setup

## Integration Points

**Upstream Dependencies:**
- Sales Order Entry (orders must exist and be released)
- Date Table (working days and holidays)
- Shipment Method setup (exclusion flags)
- Item Master (inventory items)

**Downstream Dependencies:**
- Master Pick Ticket Generation (requires locked orders)
- Supermarket Ticket Generation (uses lock status)
- Inventory Availability Calculation (uses locked order data)

**Concurrent Processes:**
- Inventory Pre-Check (runs immediately after lock)
- Authorization validation (runs during lock)

## Configuration Reference

### CLE Clesen Setup

**Relevant Fields:**
- `Activate Electronic Picking Tickets` - Must be TRUE
- Lock job won't run if electronic picking disabled

### Authorization Groups

**Setup Path:** Search → Authorization Groups  
**Group Setup:**
- Group Code: e.g., "PICKING"
- Description: "Picking Operations Authorization"
- Members: Add user IDs with lock/unlock permission

### Date Table

**Setup Path:** Search → Date  
**Key Fields:**
- `Period Type` = Date
- `Period Name` = Actual date
- `Closed` = Non-working day flag

**Impact:** System skips closed dates when calculating ship dates

### Job Queue Setup

**Job Entry Configuration:**
```
Object Type to Run: Codeunit
Object ID to Run: 50101
Parameter String: [blank]
Job Queue Category: PICKING
Run in User Session: No
Earliest Start Time: 01:00:00
No. of Minutes between Runs: 1440 (daily)
Maximum No. of Attempts to Run: 3
Rerun Delay (sec.): 1800 (30 min)
```

## Best Practices

✓ **Run lock early** - 1-2 AM gives time for issue resolution before shift start  
✓ **Monitor daily** - Check lock job status every morning  
✓ **Authorize carefully** - Limit unlock permission to supervisors  
✓ **Update holidays** - Maintain accurate Date table  
✓ **Review pre-checks** - Address shortages before picking starts  
✓ **Document exceptions** - Track all manual locks/unlocks  
✓ **Test changes** - Validate date calculator logic before go-live

---

**Technical Details:**
- Primary Codeunit: 50101 "CLE Lock Orders For Pick"
- Related Tables: "Sales Header", "CLE Picking Statistics", "CLE Authorization Group Member"
- Key Fields: "CLE Picking Status", "CW Run No.", "Shipment Date"
- Job Queue Category: PICKING

**Last Updated:** February 2026

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
- [[handling-escalations]]
- [[picking-teams-manager-guide]]
