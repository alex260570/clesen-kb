---
title: Order Lock Process
type: howto
tags: [sales-orders, order-management, picking-workflow, manager]
created: 2026-04-21
updated: 2026-04-21
sources: [order-lock-process-manager.md]
---

# Order Lock Process

Critical first step in the picking workflow that freezes orders to prevent modifications during picking operations.

## Overview

**Purpose:** Lock orders before picking starts to ensure inventory allocations remain accurate and pickers work with stable data

**Key Feature:** Once locked, orders cannot be modified until picking is complete

## Automated Order Locking

### Job Queue Setup

| Parameter | Value | Editable |
|-----------|-------|----------|
| **Job Description** | "Lock Orders For Master Pick" | No |
| **Schedule** | Daily at 1:00 AM | Yes |
| **Codeunit** | 50101 "CLE Lock Orders For Pick" | No |
| **Status** | Active/Inactive | Yes |

### Automated Process

When the job runs, the system:

**1. Calculates Pick and Ship Dates**
- Pick Date = Today + 1 (tomorrow)
- Ship Date = Next valid shipping day after pick date
- Uses picking date calculation logic (excludes weekends/holidays)

**2. Identifies Eligible Orders**
- Document Type = Order
- Shipment Date matches calculated ship date
- Direct Location Pickup = FALSE
- Picking Status = Blank (not already locked)
- Not Completely Shipped
- Shipment Method not in exclusion list
- Contains at least one inventory item line with qty to ship

**3. Locks Qualifying Orders**
- Sets `CLE Picking Status` = "Locked For Master Pick"
- Sets `CW Run No.` = 0 (unassigned to any run yet)
- Prevents further modifications to order

**4. Performs Inventory Pre-Check**
- Calculates availability for all locked orders
- Identifies potential shortages
- Sends Teams notification if issues found

### Special Saturday Logic

**If Saturday IS a valid picking day:**
- Locks **BOTH Monday AND Tuesday orders**
- Monday orders: Assigned **Run = 1** (regular Monday pick)
- Tuesday orders: Assigned **Run = 50** (advance pick for Tuesday)
- Allows warehouse to work ahead on lower-volume Saturday
- Both sets of orders go through full three-phase process

**If Saturday is NOT a picking day:**
- Friday locks Monday orders only
- No advance picking
- Standard next-working-day logic applies

**Implementation:**
- System checks **Picking Calendar** to determine if Saturday is working day
- Checks **Shipping Calendar** to determine valid Monday/Tuesday ship dates
- Run number assignment is automatic based on target shipment day

## Order Status Progression

### Picking Status States

| Status | Meaning | Editable |
|--------|---------|----------|
| **Blank** | Not locked, can still be modified | — |
| **Locked For Master Pick** | Frozen, awaiting ticket generation | — |
| **Master Pull** | Master picking completed, awaiting supermarket pick | — |
| **In Master Pick** | Tickets generated, picking in progress | — |
| **Escalation Request** | Problem identified, needs manager approval | — |
| **Escalation Approved** | Approved for escalation picking | — |
| **Escalation in Pick** | Escalation picking in progress | — |
| **Supermarket Pick** | In supermarket picking phase | — |
| **Direct Location Pick** | Assigned to direct pickup process | — |
| **Completed** | Fully picked and ready for shipment | — |

## Calendar System

### Two Separate Calendars

The system uses **two distinct calendars** for different purposes:

**1. Picking Calendar**
- Defines valid days for warehouse picking operations
- Configured in: CLE Clesen Setup → Picking Calendar Code
- If a date is not a valid picking day, it cannot be used as a picking date
- Example: Warehouse closed Sundays, holidays

**2. Shipping Calendar**
- Defines valid days for customer shipments/deliveries
- Configured in: CLE Clesen Setup → Shipping Calendar Code
- System automatically skips non-shipping days when calculating shipment dates
- Example: No deliveries on major holidays

**Calendar Source:**
- Based on **Base Calendar Change** table
- Supports both recurring entries (every Sunday) and specific dates (July 4th, 2026)
- Can be customized per year

**Why Two Calendars:**
- Warehouse may work days when no deliveries occur (prep for next day)
- Deliveries may happen on days warehouse doesn't pick (pre-picked inventory)
- Allows flexible scheduling

### Friday-Monday Logic Examples

**Scenario 1: Saturday NOT a picking day, but Monday IS a shipping day**
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

## Manual Order Locking

### When to Manually Lock Orders

**Scenarios requiring manual intervention:**
- **Late-breaking orders** — Customer adds order after automated lock
- **Shipment date changes** — Orders shifted to different day
- **Special handling** — VIP customer needs priority
- **Testing** — Validate picking process
- **Job failure recovery** — Automated job didn't complete

### How to Manually Lock Orders

**Navigation:** Picking → Lock Orders for Pick

**Process:**
1. Click **"Lock Orders for Pick"** action
2. Dialog appears with options:
   - **Pick Date:** Tomorrow (default)
   - **Ship Date:** Next valid ship day (auto-calculated)
   - **Ready Orders Only:** TRUE/FALSE (only lock confirmed orders)
3. Click **OK** to proceed

**Authorization Required:**
- System checks if user is in authorized group
- Error message if not authorized: "You are not authorized to lock orders for picking"
- Contact administrator to add user to authorization group

### Unlocking Orders (Emergency Only)

**If orders already locked:**
- System asks: "Orders are already locked for shipment date X. Do you want to unlock them?"
- **Yes** → Unlocks orders (dangerous if picking in progress!)
- **No** → Cancels operation

**⚠️ WARNING:** Only unlock if picking has NOT started. Unlocking during active picking will cause inventory discrepancies.

## Emergency Lock Function

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

## Post-Lock Inventory Pre-Check

### Automatic Integration

After orders are locked, system automatically runs:
- **Codeunit: Inventory Pre-Check**
- Calculates availability for all locked orders
- Compares required quantities vs. available inventory
- Identifies shortages by item/order/location

### If Shortages Found

**1. Teams Notification Sent:**
- Lists short items
- Shows affected orders
- Displays shortage quantities
- Sent to warehouse management channel

**2. System Tracking:**
- Shortage records created
- Available for review in system
- Can be viewed before ticket generation

**3. Manager Action:**
- Review shortages
- Decide on expediting inventory
- Contact purchasing for emergency orders
- Update sales team on possible delays
- Adjust orders if needed (before picking starts)

## Best Practices

✅ **DO:**
- Review shortages immediately after lock
- Test calendar configuration before going live
- Configure both calendars accurately
- Monitor automated lock job for failures
- Use Teams notifications to track locking activity
- Document special calendar rules for your warehouse
- Plan for advance Saturday picking if applicable

❌ **DON'T:**
- Unlock orders once picking has started
- Modify orders after lock
- Ignore inventory pre-check notifications
- Leave job queue disabled
- Change calendars mid-season without testing
- Assume Saturday is a picking day (verify configuration)
- Manually assign Run numbers if automated assignment works

## Troubleshooting

### Issue: Orders Not Locking Automatically

**Cause:** Job queue job not running or disabled

**Check:**
1. Open **Job Queue Entries**
2. Find "Lock Orders For Master Pick"
3. Verify **Status** = Active
4. Check **Last Run Time** (should be recent)

**Solution:**
1. If disabled, click **Set Status → Active**
2. If failing, check error log
3. Run manual lock: Use emergency lock function
4. Contact administrator if job has errors

### Issue: Wrong Orders Getting Locked

**Cause:** Calendar configuration incorrect OR shipment date criteria not matching

**Solution:**
1. Verify **Picking Calendar** configuration
2. Verify **Shipping Calendar** configuration
3. Check which orders should ship on that date
4. Adjust calendar or manual parameters
5. Test with smaller date range first

### Issue: Some Orders Locked, Others Not

**Cause:** Orders missing required fields or have exclusion conditions

**Check:**
- Picking Status not blank (already locked)
- Completely Shipped = YES
- Shipment Method in exclusion list
- No inventory items on order
- Direct Location Pickup = TRUE

**Solution:** Verify order meets locking criteria; adjust as needed

## Related Pages

- [[sales-order-management]] — Creating and managing sales orders
- [[master-picking-process]] — Master picking workflow after lock
- [[picking-overview]] — Overall picking system
