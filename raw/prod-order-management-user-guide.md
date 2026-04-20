# Production Order Management User Guide

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Audience:** Production Managers and Production Staff

## Table of Contents

- [Overview](#overview)
- [Production Order Types and Status](#production-order-types-and-status)
- [Creating Production Orders](#creating-production-orders)
- [Understanding the Production Order Header](#understanding-the-production-order-header)
- [Production Order Lines](#production-order-lines)
- [Production Order Status Workflow](#production-order-status-workflow)
- [Requested Quantity and Safety Quantity](#requested-quantity-and-safety-quantity)
- [Production Order Tasks Integration](#production-order-tasks-integration)
- [Splitting Production Orders](#splitting-production-orders)
- [Location and Bin Management](#location-and-bin-management)
- [Capacity Planning and Scheduling](#capacity-planning-and-scheduling)
- [Routing and Operations](#routing-and-operations)
- [Production Output Integration](#production-output-integration)
- [Blooming Stage Integration](#blooming-stage-integration)
- [Common Tasks and Workflows](#common-tasks-and-workflows)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [SOP Document](#sop-document)

---

## Overview

The Production Order Management system in Clesen Horticulture controls the entire lifecycle of plant production, from initial planning through finished goods output. This system integrates with capacity planning, material requirements, production tasks, blooming stage tracking, and quality control to ensure efficient and accurate production operations.

### What You Can Do

- Create and manage production orders across all status levels
- Plan production capacity and schedule operations
- Track production quantities including safety buffers (overstart)
- Assign and monitor production tasks
- Split production orders for different shipment dates
- Manage work center and machine center utilization
- Post production output and scrap
- Track blooming stages and quality metrics
- Monitor production progress and completion

### Prerequisites

- Active user account with production permissions
- Understanding of plant production processes and horticulture operations
- Access to Production Order pages and lists
- Knowledge of item routings and BOMs (Bill of Materials)

---

## Production Order Types and Status

### Production Order Status Levels

Production orders progress through different status levels, each serving a specific purpose in the production lifecycle:

| Status | Purpose | Key Activities | Can Edit | Can Post |
|--------|---------|----------------|----------|----------|
| **Simulated** | Testing and planning scenarios | Model production requirements, estimate costs | Yes | No |
| **Planned** | Approved for planning | Reserve capacity, calculate requirements | Yes | No |
| **Firm Planned** | Committed production | Reserve materials, finalize schedules, add safety quantity | Yes | No |
| **Released** | Active production | Post output, post scrap, complete work | Limited | Yes |
| **Finished** | Completed production | Historical reference, reporting | No | No |

### Status Progression Flow

```
Simulated → Planned → Firm Planned → Released → Finished
    ↓          ↓            ↓              ↓          ↓
Planning   Approval    Commitment    Production  Complete
```

> **Note:** You can skip intermediate statuses when changing status (e.g., go directly from Planned to Released), but most production processes follow the standard progression.

---

## Creating Production Orders

### Method 1: Manual Creation

#### From Production Order List

1. Navigate to **Manufacturing → Production Orders → Planned Production Orders**
   - Or **Firm Planned**, **Released** depending on initial status needed
2. Click **+ New** to create a new production order
3. Fill in required header information:

   **Essential Fields:**
   - **No.** - Auto-generated or enter manually (if number series allows)
   - **Source Type** - Select **Item** (standard for production)
   - **Source No.** - Select the item to produce (type to search)
   - **Quantity** - Total production quantity (see [Requested Quantity](#requested-quantity-and-safety-quantity))
   - **Location Code** - Production facility location
   - **Due Date** - When production must be complete

4. Click **OK** to save

The system will:
- Create production order header and line
- Calculate component requirements from BOM
- Create routing lines from item routing
- Calculate operation dates based on capacity

### Method 2: Planning Worksheet

Use the Planning Worksheet to generate production orders from sales demand:

1. Navigate to **Manufacturing → Planning → Planning Worksheet**
2. Click **Actions → Calculate Regenerative Plan**
3. Set date filters and options
4. Click **OK** to generate planning lines

The system will:
- Analyze sales orders and forecast demand
- Calculate net requirements considering inventory
- Suggest production orders and purchase orders
- Propose optimal order quantities and dates

5. Review planning lines
6. Click **Actions → Carry Out Action Message** to create production orders

### Method 3: Sales Order Integration

Create production orders directly from sales orders:

1. Open a **Sales Order**
2. On the sales line, click **Line → Functions → Create Prod. Order**
3. Select production order status (Planned, Firm Planned, or Released)
4. Click **OK**

The system will:
- Create a production order for the sales line quantity
- Link production order to sales order
- Set due date based on sales shipment date
- Reserve production output for the sales order

---

## Understanding the Production Order Header

The production order header contains critical information that controls the entire production process.

### General Tab

**Production Order Information:**

| Field | Description | Editable |
|-------|-------------|----------|
| **No.** | Production order number (unique identifier) | No (after creation) |
| **Status** | Current production status | Via status change action only |
| **Description** | Item description (auto-filled from item) | Yes |
| **Source Type** | Always "Item" for standard production | No |
| **Source No.** | Item number being produced | No (after creation) |
| **Quantity** | Total production quantity (includes safety) | Yes (limited by status) |
| **Due Date** | Production completion target date | Yes |
| **Starting Date** | Production start date (calculated from routing) | No (calculated) |
| **Starting Time** | Production start time | No (calculated) |
| **Ending Date** | Production end date (calculated from routing) | No (calculated) |
| **Ending Time** | Production end time | No (calculated) |
| **Location Code** | Facility/warehouse location | Yes (with restrictions) |
| **Bin Code** | Specific bin location for output | Yes |

**Scheduling & Planning:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Low-Level Code** | Item level in BOM structure (0 = finished good) | No |
| **Finished Date** | Actual completion date (after posting) | No |
| **Creation Date** | When order was created | No |
| **Last Date Modified** | Most recent change date | No |

### Clesen Extended Fields

**Quantity Management:**

| Field | Description | Editable |
|-------|-------------|----------|
| **CLE Requested Quantity** | Customer order quantity (without safety buffer) | Yes (manager only) |
| **Quantity** | Total production quantity (Requested + Safety) | Yes (calculated from Requested) |

> **Note:** When you enter **CLE Requested Quantity**, the system automatically calculates and sets **Quantity** by adding the safety buffer based on the item's **CLE Overstart %** setting.

**Order Relationships:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Source Prod. Order No.** | Original order if this was split from another production order | No |

**Routing Status Tracking:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Current Routing Status** | Current production phase/operation routing link | No (calculated) |
| **Current Routing Ending Date** | When current phase should complete | No (calculated) |
| **Next Action Date** | Date when next action is required | No (system-managed) |

**Task Management:**

| Field | Description | Editable |
|-------|-------------|----------|
| **CLE Prod. Order Task List** | Selected task template for this order | Yes |

> **Important:** Changing the task list will delete existing tasks if no completed tasks exist. Once tasks are completed, the task list cannot be changed.

**Quality Control:**

| Field | Description | Editable |
|-------|-------------|----------|
| **CLE Last Date Counted** | Last inventory count date for this order | No |

---

## Production Order Lines

Production order lines contain the detailed information about what is being produced. Typically, a production order has one line per finished item, but can have multiple lines for co-products or by-products.

### Key Line Fields

**Item Information:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Status** | Line status (matches header) | No |
| **Prod. Order No.** | Parent production order number | No |
| **Line No.** | Line number (usually 10000 for first line) | No |
| **Item No.** | Item being produced | No (after creation) |
| **Description** | Item description | Yes |
| **Quantity** | Production quantity (matches header) | Yes (limited) |
| **Unit of Measure Code** | Production UOM | Yes |
| **Location Code** | Production location | Yes |
| **Bin Code** | Output bin location | Yes |
| **Due Date** | Line completion date | Yes |

**Production Status:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Remaining Quantity** | Not yet posted as output | No (calculated) |
| **Finished Quantity** | Total output posted | No (calculated) |
| **Scrap %** | Expected scrap percentage | Yes |

### Clesen Extended Line Fields

**Safety Quantity Management:**

| Field | Description | Editable |
|-------|-------------|----------|
| **CLE Safety Qty.** | Safety buffer quantity (overstart) | Yes (manager authorization required) |
| **CLE Safety Qty. (Base)** | Safety quantity in base UOM | No (calculated) |

> **Note:** Safety quantity is automatically calculated when the production order transitions to Firm Planned status based on the item's **CLE Overstart %** setting.

**Rollup and Grouping:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Roll-up Item No.** | Parent rollup item for reporting/grouping | No (auto-filled from item setup) |

**Blooming Stage Tracking:**

| Field | Description | Editable |
|-------|-------------|----------|
| **CLE Blooming Stage** | Current plant blooming stage for this line | No (auto-assigned on output posting) |
| **CLE Next Stage Change Date** | Projected date for next blooming stage transition | Yes |

> **Note:** Blooming stages are automatically assigned when output is posted based on the item's blooming stage configuration and production phase.

---

## Production Order Status Workflow

Understanding the status workflow is critical to managing production orders effectively.

### 1. Simulated Status

**Purpose:** Test scenarios and model production requirements without committing resources.

**Typical Use Cases:**
- Cost estimation for quotes
- Capacity planning "what-if" analysis
- Training and system testing

**What You Can Do:**
- View calculated component requirements
- See routing operations and capacity needs
- Estimate production costs
- Modify all fields freely

**What You Cannot Do:**
- Reserve materials or capacity
- Post output or consumption
- Create tasks or quality records

**How to Create:**
1. Click **+ New** in **Simulated Production Orders**
2. Enter item, quantity, and dates
3. Review BOM explosion and routing

### 2. Planned Status

**Purpose:** Approved production plan with soft capacity reservation.

**Typical Use Cases:**
- MRP-generated production orders
- Initial production planning before final commitment
- Long-term capacity planning

**What Happens When Status Changes to Planned:**
- Production order appears in capacity planning
- Requirements appear in planning worksheet
- No material reservations yet created

**What You Can Do:**
- Edit quantities and dates
- Review component and capacity requirements
- Plan production schedules
- Convert to Firm Planned when ready

**What You Cannot Do:**
- Post production output
- Reserve specific materials
- Assign production tasks

**How to Change Status:**
1. Open the **Planned Production Order**
2. Click **Actions → Functions → Change Status**
3. Select **Firm Planned** or **Released**
4. Click **OK**

### 3. Firm Planned Status

**Purpose:** Committed production with material reservations and finalized schedules.

**What Happens When Status Changes to Firm Planned:**
- **Safety quantity is calculated and added** to the production quantity
- Components are reserved from inventory
- Capacity is committed on work centers
- Production appears in material planning as firm demand

**Safety Quantity Calculation Example:**
```
Original Requested Quantity: 1000 units
Item "CLE Overstart %": 3%
Safety Quantity: 1000 × 3% = 30 units
Final Production Quantity: 1000 + 30 = 1030 units
```

**What You Can Do:**
- Finalize production schedules
- Assign production task templates
- Make final quantity adjustments
- Release for production when ready

**What You Cannot Do:**
- Post output or scrap yet
- Complete production tasks

**When to Use:**
- After planning approval but before production starts
- When you need to reserve materials but aren't ready to start
- For production scheduled 1-2 weeks out

**How to Change Status:**
1. Open the **Firm Planned Prod. Order**
2. Click **Actions → Functions → Change Status**
3. Select **Released**
4. Click **OK**

### 4. Released Status

**Purpose:** Active production with posting capability.

**What Happens When Status Changes to Released:**
- Production tasks are created and released (if task template assigned)
- Order appears on production floor worksheets
- Output posting is enabled
- Scrap and quantity adjustments are allowed

**What You Can Do:**
- **Post output** - Record finished production (see [Production Output Integration](#production-output-integration))
- **Adjust quantities** - Post scrap, adjust remaining quantity
- **Complete production tasks** - Check off task list items
- **Split orders** - Divide order for different shipment dates
- **Adjust safety quantity** - Increase or decrease overstart buffer (manager authorization required)

**What You Cannot Do:**
- Change source item number
- Delete the order (if output has been posted)
- Modify certain locked fields

**When to Use:**
- Production is actively underway
- Staff are working on the order
- Output is being posted regularly

**How to Change Status:**
1. Open the **Released Production Order**
2. Ensure all output is posted
3. Click **Actions → Functions → Change Status**
4. Select **Finished**
5. Click **OK**

### 5. Finished Status

**Purpose:** Permanently closed production order for historical record and reporting.

**What Happens When Status Changes to Finished:**
- Order is locked and no longer editable
- Appears in finished production order list
- Available for reporting and analysis
- Capacity and material reservations are released

**What You Can Do:**
- View production history
- Review posted output and consumption
- Analyze costs and variances
- Generate production reports

**What You Cannot Do:**
- Post additional output
- Modify any fields
- Reopen the order (must create new order)

**When to Use:**
- All production is complete
- All output has been posted
- Final quality checks are done
- Order is ready for archival

> **Warning:** Changing status to Finished is permanent. You cannot reopen a finished production order.

---

## Requested Quantity and Safety Quantity

One of the key features in the Clesen Horticulture extension is the management of requested quantity versus total production quantity.

### Understanding the Difference

**Requested Quantity:**
- The actual customer order quantity
- What you need to deliver to fulfill orders
- Stored in field **CLE Requested Quantity**

**Safety Quantity (Overstart):**
- Buffer quantity for expected production losses
- Accounts for scrap, quality rejects, and edge effects
- Calculated from item's **CLE Overstart %** field
- Stored in Prod. Order Line field **CLE Safety Qty.**

**Total Production Quantity:**
- Requested Quantity + Safety Quantity
- What you actually produce
- Stored in **Quantity** field on header and line

### How Safety Quantity Is Calculated

#### Automatic Calculation (Standard Process)

1. Create production order in **Planned** status
2. Enter **CLE Requested Quantity** = 1000
3. Change status to **Firm Planned**
4. System reads item's **CLE Overstart %** = 3%
5. System calculates: Safety Qty = 1000 × 3% = 30
6. System sets: **Quantity** = 1000 + 30 = 1030
7. Prod. Order Line **CLE Safety Qty.** = 30

#### Item Overstart Configuration

The **CLE Overstart %** is configured on the **Item Card**:

1. Open **Item Card** for the production item
2. Navigate to **Clesen** FastTab
3. Set **CLE Overstart %** (e.g., 3.0 for 3%)
4. This percentage applies to all production orders for this item

**Common Overstart Percentages:**
- **Young plants, cuttings:** 5-10% (higher risk)
- **Established plants:** 2-3% (moderate risk)
- **Mature/hardy varieties:** 1-2% (lower risk)
- **Special orders, fragile:** 10-15% (high risk)

### Manual Safety Quantity Adjustment

**Authorization Required:** User must be in the Safety Adjustment Authorization Group.

#### When to Adjust Safety Manually

- Initial overstart percentage was incorrect for specific order
- Higher than expected quality issues during production
- Customer changed order quantity mid-production
- Production quality improving, can reduce buffer

#### How to Adjust Safety Quantity

1. Open the **Released Production Order**
2. Click **Actions → Adjust Safety Quantity**
3. System opens adjustment dialog showing:
   - Current Requested Quantity
   - Current Safety Quantity
   - Current Total Quantity
4. Enter **New Safety Quantity**
5. Click **OK**

The system will:
- Validate authorization
- Update Prod. Order Line **CLE Safety Qty.**
- Recalculate total **Quantity** = Requested + New Safety
- Update component requirements if needed

> **Warning:** Increasing safety quantity after output has been posted may create component shortages. Always check component availability before increasing.

### Safety Quantity During Production

As production progresses, safety quantity is consumed when scrap is posted:

**Example Flow:**
```
Initial State:
  Requested Quantity: 1000
  Safety Quantity: 30
  Total Quantity: 1030
  Remaining: 1030

After Scrap Posted (20 units):
  Requested Quantity: 1000
  Safety Quantity: 10 (30 - 20)
  Total Quantity: 1010 (1000 + 10)
  Remaining: 1010

After More Scrap (15 units):
  Requested Quantity: 1000
  Safety Quantity: 0 (10 - 15 = 0, cannot go negative)
  Total Quantity: 995 (1000 + 0 - 5 shortage)
  Remaining: 995
```

> **Important:** If scrap exceeds safety quantity, your remaining quantity will fall below the requested quantity, creating a potential shortage.

### Releasing Safety Quantity

At production completion, you decide whether to release remaining safety quantity as finished goods or keep it as buffer:

**Option 1: Release Safety** (Standard)
- Converts remaining safety to finished output
- Customer receives full requested quantity plus any remaining safety
- Increases billable quantity

**Option 2: Keep Safety**
- Safety remains as buffer
- Customer receives only requested quantity
- Safety is scrapped or held for quality assurance

This decision is made during output posting (see [Production Output Integration](#production-output-integration)).

---

## Production Order Tasks Integration

The Clesen Horticulture system includes a comprehensive task management system for production orders, ensuring quality and consistency through standardized checklists.

### Task Templates

**What Are Task Templates?**
- Predefined checklists for production processes
- Organized into phases (Headlines) and specific tasks
- Include due date formulas and routing link assignments
- Created and maintained by production managers

### Assigning Tasks to a Production Order

#### Method 1: During Creation

1. Create a **Firm Planned** or **Released** production order
2. On the header, set **CLE Prod. Order Task List** field
3. Select the appropriate task template
4. Click **OK**

When status changes to **Released**, tasks are automatically created.

#### Method 2: On Existing Order

1. Open a **Firm Planned** or **Released** production order
2. In **CLE Prod. Order Task List** field, lookup and select template
3. Confirm replacement if existing tasks exist (with no completions)
4. System creates task lines immediately if status is Released

> **Note:** You cannot change the task list if any tasks have been marked as completed.

### Viewing Production Order Tasks

#### From the Production Order

1. Open the **Released Production Order**
2. Look at the **Tasks** FactBox on the right side
   - Shows summary of total tasks
   - Shows completed count
   - Shows overdue count
3. Click **Related → Tasks** for full task list

#### From Task Worksheet

View tasks across all production orders:

1. Search for **Production Order Task Worksheet**
2. Filter by:
   - **Location Code** - Your facility
   - **Prod. Order No.** - Specific order
   - **Due Date** - Date range
   - **Completed** - Show only incomplete

### Task Types

**Headlines:**
- Section headers organizing tasks into phases
- Shown in bold
- Automatically marked as released
- Examples: "Preparation Phase", "Quality Checks", "Completion"

**Tasks:**
- Actual work items to complete
- Require manual completion by staff
- Have due dates
- May be linked to specific routing operations
- Examples: "Inspect raw materials", "Clean work area"

**Information:**
- Reference notes and instructions
- No completion required
- Provide guidance and documentation references

### Task Approval and Release

**Task Approval Workflow:**

1. Tasks are initially created in **Unreleased** state
2. Manager reviews tasks in **Production Order Tasks to Approve** page
3. Manager marks **Released** checkbox on each task to approve
4. Only released tasks appear in staff task worksheets
5. Staff can complete released tasks

**Auto-Approve:**
- Some tasks have **Auto Approve** flag set in template
- These are automatically released without manager review
- Used for standard, routine tasks

### Completing Tasks

Staff complete tasks in the task worksheet or from the production order:

1. Open task list
2. Verify work is complete
3. Mark **Completed** checkbox
4. System automatically fills **Completion Date**

See [Production Order Tasks - Staff Guide](../production-order-tasks/prod-order-task-staff-guide.md) for detailed task completion procedures.

### Task Due Dates

Task due dates are automatically calculated based on:

- **Production order due date**
- **Routing operation dates** (if task is linked to routing)
- **Time formula** defined in task template (e.g., -2D for 2 days before)

**Due Date Calculation Field Options:**
- **Order Due Date** - Based on production order due date
- **Order Starting Date** - Based on production start date
- **Routing Operation Start** - Based on routing line starting date
- **Routing Operation End** - Based on routing line ending date

**Example:**
```
Task: "Prepare workstation"
Due Date Calculation: Order Starting Date - 1D
Production Order Start: March 20
Task Due Date: March 19
```

---

## Splitting Production Orders

Production orders can be split to accommodate different shipment dates or to separate partial completions.

### When to Split Production Orders

- **Multiple Shipment Dates:** Customer needs partial shipments on different dates
- **Capacity Constraints:** Cannot complete full order in one production run
- **Quality Holds:** Part of production needs to be held for additional inspection
- **Different Locations:** Split production across multiple facilities

### How to Split a Production Order

> **Important:** User must have authorization to split production orders.

1. Open the **Released Production Order** to split
2. Click **Actions → Split Production Order**
3. System opens **Split Production Order** dialog
4. Enter split information:

   **Required Fields:**
   - **Split Quantity** - How much to split off to new order
   - **New Shipment Date** - Due date for the split order

5. Click **OK**

### What Happens During Split

The system performs the following:

**Original Production Order:**
- **Quantity** reduced by split quantity
- **CLE Requested Quantity** reduced proportionally
- **CLE Safety Qty.** recalculated for remaining quantity
- Components adjusted for new quantity
- Routing operations adjusted
- Tasks remain (not duplicated)

**New Production Order:**
- Created with **Released** status
- **Source Prod. Order No.** = Original order number
- **Quantity** = Split quantity
- **Due Date** = New shipment date specified
- New **CLE Requested Quantity** and **CLE Safety Qty.** calculated
- Components copied and calculated for split quantity
- Routing operations copied with new dates
- Tasks copied from original (if template assigned)

**Component Reservations:**
- Reservations are adjusted proportionally
- Original order reservations reduced
- New order reservations created if inventory available

### Split Order Tracking

You can track split relationships:

**On the Original Order:**
- Search for production orders where **Source Prod. Order No.** = This order number
- View all child orders created from splits

**On the Split Order:**
- View **Source Prod. Order No.** field to see parent order

### Best Practices for Splitting

- **Split early in production** - Easier before output is posted
- **Check component availability** - Ensure materials for both orders
- **Update sales order links** - Manually link split orders to sales lines if needed
- **Document split reason** - Add notes to both orders explaining the split
- **Avoid multiple splits** - Too many splits create complexity; consider replanning instead

---

## Location and Bin Management

Production orders are tied to specific warehouse locations and bins for material consumption and output posting.

### Location Code

**Purpose:** Identifies which warehouse/facility will produce the item.

**Set On:**
- Production order header (**Location Code** field)
- Production order line (inherited from header)
- Component lines (where materials are consumed)
- Routing lines (where operations are performed)

**Changing Location Code:**

1. Open the production order (must be Planned or Firm Planned status)
2. Modify **Location Code** on the header
3. System automatically updates:
   - Prod. Order Line location
   - Component locations
   - Routing line locations
   - Task template location filters

> **Warning:** Do not change location code on Released orders where output has been posted. This can cause inventory discrepancies.

### Bin Code

**Purpose:** Specific bin location within the warehouse for output.

**Bin Management Options:**
- **Mandatory Bin:** Location requires bin codes for all transactions
- **Optional Bin:** Location allows but doesn't require bins
- **No Bin Management:** Location doesn't use bins

**Setting Bin Code:**

1. Open the production order header
2. Set **Bin Code** field (lookup bins in the location)
3. System updates prod. order line bin code
4. Output will post to this bin

**Bin Suggestions:**
- System may suggest bin based on item default bin
- Work center may have assigned output bin
- Location may have production bin configured

### Production Bin vs. Consumption Bin

**Production Bin (Output Bin):**
- Where finished goods are placed after production
- Set on production order header/line
- Used when posting output

**Consumption Bin (Component Bin):**
- Where components are picked from
- Set on component lines
- Used when flushing or posting consumption

These are typically different bins to separate raw materials from finished goods.

### Multi-Location Production

For production spanning multiple locations:

1. **Main production order** - Primary location
2. **Component sourcing** - Components may come from different locations
3. **Transfer orders** - Use to move components to production location before releasing
4. **Output location** - Finished goods go to production order location

---

## Capacity Planning and Scheduling

Production orders consume capacity on work centers and machine centers based on routing operations.

### Work Centers and Machine Centers

**Work Center:**
- Group of machines or production areas
- Example: "Potting Area", "Greenhouse Section 1"
- Has capacity measured in time or units
- Can have multiple machine centers

**Machine Center:**
- Specific machine or workstation
- Belongs to a work center
- Example: "Potting Machine 1", "Seeder A"
- More granular capacity tracking

### Capacity Types

**Capacity Units:**
- **Time-based:** Hours, minutes (e.g., machine run time)
- **Quantity-based:** Units per hour (e.g., plants potted per hour)

**Capacity Availability:**
- **Standard Capacity:** Normal operating hours/output
- **Efficiency %:** Actual vs. standard performance
- **Calendar:** Working days, shifts, maintenance windows

### Routing and Operations

Routings define the sequence of operations (steps) to produce an item:

**Routing Header:**
- Defines operation sequence for the item
- Assigned to item on item card
- Examples: "Standard Potting", "Container Production"

**Routing Lines (Operations):**
- Individual production steps
- Assigned to work center or machine center
- Include setup time, run time, move time, wait time
- Define capacity requirements

**Example Routing:**
```
Operation 10: Potting       - Potting Work Center - 0.5 hrs/100 units
Operation 20: Labeling      - Labeling Machine    - 0.2 hrs/100 units
Operation 30: QC Inspection - QC Station          - 0.3 hrs/100 units
Operation 40: Staging       - Staging Area        - 0.1 hrs/100 units
```

### Production Order Routing Lines

When you create a production order, the system:

1. Copies routing operations from the item's routing
2. Creates **Prod. Order Routing Lines**
3. Calculates operation dates based on:
   - Production order due date (works backward)
   - Operation run times
   - Setup times
   - Work center calendars
4. Allocates capacity on work centers

**Prod. Order Routing Line Fields:**

| Field | Description | Purpose |
|-------|-------------|---------|
| **Operation No.** | Sequence number (10, 20, 30) | Execution order |
| **Type** | Work Center or Machine Center | Resource type |
| **No.** | Work/Machine center code | Specific resource |
| **Description** | Operation description | What work is performed |
| **Setup Time** | Time to prepare for operation | One-time setup |
| **Run Time** | Time per unit/lot | Variable by quantity |
| **Starting Date/Time** | When operation starts | Scheduling |
| **Ending Date/Time** | When operation ends | Scheduling |
| **Routing Status** | Planned, In Progress, Finished | Operation progress |
| **Routing Link Code** | Links to production phases | Task assignments |

### Routing Link Codes

**Purpose:** Group operations into production phases for task management and output posting.

**Common Routing Link Codes:**
- **PREP** - Preparation phase
- **POT** - Potting phase
- **GROW** - Growing phase
- **QC** - Quality control phase
- **FIN** - Finishing phase

**How They're Used:**
- Link production tasks to specific routing operations
- Track which phase production is currently in (**Current Routing Status** field)
- Control which components are consumed at each phase (flushing)
- Determine when blooming stages are assigned

**Current Routing Status Field:**

Shows which routing link (phase) is currently active:
- Calculated from routing lines marked as "In Progress" or not yet finished
- Updates automatically as operations complete
- Visible on production order header
- Used by output posting to assign blooming stages

---

## Production Output Integration

Production orders integrate tightly with output posting to record finished production and scrap adjustments.

### Output Posting Overview

Output posting records:
- Finished production quantity
- Time spent on operations (capacity posting)
- Scrap and waste quantities
- Safety quantity releases or adjustments

### Posting Output from Production Order

**Method 1: Post Output Action (Quick Post)**

1. Open the **Released Production Order**
2. Click **Actions → Post Output** (or press **F9**)
3. System opens **Post Output** dialog showing:
   - Current routing operation and phase
   - Remaining quantity to post
   - Suggested output quantity
4. Review and adjust:
   - **Output Quantity** - Amount of finished production
   - **Operation No.** - Which operation completed
   - **Posting Date** - When output occurred
5. Click **Post**

**Method 2: Output Journal**

1. Navigate to **Manufacturing → Production → Output Journal**
2. Click **Actions → Suggest Lines**
3. Select production orders to include
4. System creates journal lines showing:
   - Production order and operation info
   - Suggested quantities
   - Capacity information
5. Adjust quantities and dates as needed
6. Click **Actions → Post** to post the journal

### What Happens When Output Is Posted

The system performs several actions automatically:

**Inventory Impact:**
- Increases finished goods inventory
- Posts to the production order's location and bin
- Creates item ledger entries

**Production Order Updates:**
- **Finished Quantity** increases by output amount
- **Remaining Quantity** decreases by output amount
- **Routing Status** may update to "Finished" for completed operations

**Blooming Stage Assignment:**
- If item has blooming stage configuration
- If current routing phase is linked to blooming stage
- System automatically assigns blooming stage to output
- Updates **CLE Blooming Stage** field on prod. order line

**Capacity Ledger:**
- Records time spent on work center/machine center
- Consumes capacity allocation
- Creates capacity ledgger entries for costing

**Component Flushing:**
- If components are set to auto-flush
- System posts consumption of components
- Reduces component inventory
- Links consumption to output

See [Production Order Posting - Staff Guide](prod-order-posting-staff-guide.md) for detailed output posting procedures.

### Posting Scrap and Adjustments

**Method: Adjust Quantity Action**

1. Open the **Released Production Order**
2. Click **Actions → Adjust Quantity**
3. System opens **Adjust Quantity** dialog showing:
   - Current quantity status
   - Safety quantity status
   - Scrap and adjustment options
4. Enter **Scrap Quantity** (positive number)
5. Select scrap reason if required
6. Click **Post**

**What Happens:**
- Production order **Quantity** reduced by scrap amount
- **Safety Quantity** reduced first, then requested quantity
- No inventory posted (scrap is loss, not output)
- Remaining quantity adjusted for remaining production

**Example:**
```
Before Scrap Post:
  Requested Qty: 1000
  Safety Qty: 30
  Total Qty: 1030
  Finished Qty: 500
  Remaining: 530

Post Scrap: 20 units

After Scrap Post:
  Requested Qty: 1000
  Safety Qty: 10 (30 - 20)
  Total Qty: 1010 (1000 + 10)
  Finished Qty: 500
  Remaining: 510 (530 - 20)
```

### Finishing Production

When all output is posted and production is complete:

1. Verify **Remaining Quantity** = 0 (or acceptable variance)
2. Complete any final production tasks
3. Perform quality checks
4. Click **Actions → Functions → Change Status**
5. Select **Finished**
6. Click **OK**

The production order is now closed and moved to Finished Production Orders.

---

## Blooming Stage Integration

The Clesen Horticulture system includes specialized blooming stage tracking for plants and flowers.

### What Are Blooming Stages?

Blooming stages represent the visual appearance and maturity level of flowering plants:

| Stage | Description | Typical Use |
|-------|-------------|-------------|
| **Tight Bud** | Buds present but no color | Early stage, maximum shelf life |
| **Showing Color** | Buds showing color but not open | Mid stage, stable for transport |
| **Open Flower** | Flowers fully open and blooming | Peak appearance, limited lifespan |
| **Past Peak** | Flowers fading or wilting | Reduced quality, potential discount |

### Blooming Stage Assignment

Blooming stages are **automatically assigned during output posting** based on:

1. **Routing phase** - Current routing link code (GROW, QC, etc.)
2. **Item configuration** - Item has blooming stage setup
3. **Output posting** - Scanned or manually posted output

**Automatic Assignment Process:**

1. Staff posts output for a production order
2. System checks item's blooming stage configuration
3. System reads **Current Routing Status** from production order
4. System determines appropriate blooming stage for that phase
5. System assigns blooming stage to the item ledger entry
6. System updates **CLE Blooming Stage** field on prod. order line

**Example:**
```
Production Order: PO-12345
Item: Rose - Red Naomi
Current Routing Status: GROW (Growing phase)
Output Posted: 500 units

System assigns: Tight Bud stage
Prod. Order Line "CLE Blooming Stage": Tight Bud
Item Ledger Entry blooming stage: Tight Bud
```

### Viewing Blooming Stages

**On Production Order Line:**
1. Open the **Released Production Order**
2. Navigate to **Lines** FastTab
3. View **CLE Blooming Stage** field

**On Item Ledger Entries:**
1. From production order, click **Navigate → Entries → Item Ledger Entries**
2. View blooming stage assigned to posted output

**On Inventory:**
1. Navigate to **Inventory → Items**
2. Select an item
3. Click **Item → Entries** to see ledger entries with blooming stages

### Blooming Stage Transitions

Plants naturally mature and change blooming stages over time:

**Automated Transitions:**
- System can be configured to automatically advance blooming stages based on time
- **CLE Next Stage Change Date** field projects when next stage will occur
- Inventory reports show current stage distribution

**Manual Adjustments:**
- Managers can manually adjust blooming stages if needed
- Used for quality reclassification or stage corrections

### Impact on Sales Orders

Sales orders can specify requested blooming stages:
- Customers select preferred blooming stage when ordering
- System checks availability by item AND blooming stage
- Production scheduling considers blooming stage requirements
- Picking prioritizes correct blooming stages for orders

See [Blooming Stage - User Guide](../growing/blooming-stage-user-guide.md) for comprehensive blooming stage management.

---

## Common Tasks and Workflows

Here are step-by-step procedures for common production order management tasks.

### Task 1: Create a Standard Production Order

**Scenario:** Create a production order for 1000 units of item "ROSE-001" due March 25.

1. Navigate to **Manufacturing → Production Orders → Planned Production Orders**
2. Click **+ New**
3. Fill in fields:
   - **Source Type:** Item
   - **Source No.:** ROSE-001 (lookup or type)
   - **CLE Requested Quantity:** 1000
   - **Location Code:** MAIN
   - **Due Date:** 03/25/2026
4. Click **OK** to save
5. Review BOM and routing lines created automatically
6. Click **Actions → Functions → Change Status**
7. Select **Firm Planned**
8. Click **OK**
   - System adds safety quantity (based on item overstart %)
9. Review updated quantity (e.g., 1030 if 3% overstart)
10. Assign task template:
    - Set **CLE Prod. Order Task List:** STANDARD-ROSE
11. Click **Actions → Functions → Change Status**
12. Select **Released**
13. Click **OK**
    - System creates and releases task lines

**Result:** Production order is ready for production with tasks assigned.

---

### Task 2: Split a Production Order for Multiple Shipments

**Scenario:** Production order PO-12345 has 2000 units due March 30. Customer requests 800 units shipped early on March 25.

1. Navigate to **Released Production Orders**
2. Open production order **PO-12345**
3. Verify current quantity: 2000 units
4. Click **Actions → Split Production Order**
5. In split dialog, enter:
   - **Split Quantity:** 800
   - **New Shipment Date:** 03/25/2026
6. Click **OK**
7. System creates new production order (e.g., PO-12346):
   - Quantity: 800
   - Due Date: 03/25/2026
   - Source Prod. Order No.: PO-12345
8. Original order PO-12345 updated:
   - Quantity reduced to 1200
   - Due Date remains 03/30/2026
9. Review both orders:
   - Check component availability for both
   - Verify routing dates make sense
   - Update sales order links if needed

**Result:** Two production orders ready for different shipment dates.

---

### Task 3: Adjust Safety Quantity Mid-Production

**Scenario:** Production order has posted 600 units output, 400 remaining. Initial safety was 30, but quality issues require increasing to 50.

1. Open the **Released Production Order**
2. Review current status:
   - Requested Quantity: 1000
   - Safety Qty: 30
   - Total Quantity: 1030
   - Finished Quantity: 600
   - Remaining: 430
3. Click **Actions → Adjust Safety Quantity**
4. System opens adjustment dialog showing current quantities
5. Enter **New Safety Quantity:** 50
6. Click **OK**
7. System updates:
   - CLE Safety Qty.: 50
   - Total Quantity: 1050 (1000 + 50)
   - Remaining: 450 (1050 - 600)
8. **Important:** Check component availability
   - Additional 20 units requires more components
   - Run planning or manual component check

**Result:** Safety buffer increased to account for quality issues.

---

### Task 4: Complete Production and Finish Order

**Scenario:** All output posted, all tasks complete, ready to close production order.

1. Open the **Released Production Order**
2. Verify final status:
   - **Remaining Quantity:** 0 (or acceptable small variance)
   - **Finished Quantity:** Matches or exceeds requested quantity
   - Review **Tasks FactBox:** All tasks completed
3. Perform final checks:
   - All quality inspections passed
   - All output posted to inventory
   - All scrap and waste recorded
   - Components consumed correctly
4. Click **Actions → Functions → Change Status**
5. Select **Finished**
6. System validates:
   - Remaining quantity acceptable
   - No open tasks blocking finish
7. Click **OK** to confirm
8. System closes order:
   - Status changed to Finished
   - Order removed from active production lists
   - Capacity released
   - Order available for reporting

**Result:** Production order permanently closed and archived.

---

### Task 5: Assign Task Template to Existing Order

**Scenario:** Production order PO-12350 was created without tasks. Need to add standard task checklist.

1. Open **Released Production Order** PO-12350
2. Locate **CLE Prod. Order Task List** field (currently blank)
3. Click lookup button
4. Select appropriate template: **STANDARD-POTTING**
5. Click **OK**
6. System prompts: "This will create task lines for this production order. Continue?"
7. Click **Yes**
8. System performs:
   - Creates task lines from template
   - Calculates due dates based on routing and order dates
   - Sets tasks to Released status (or Unreleased if approval required)
9. View tasks: Click **Related → Tasks**
10. Review task list and due dates

**Result:** Production order now has task checklist assigned.

> **Note:** If changing an existing task template, system will warn that existing tasks will be deleted. This is only allowed if no tasks have been completed yet.

---

### Task 6: Post Output with Blooming Stage

**Scenario:** Post 500 units of output for a rose production order in the growing phase.

1. Open the **Released Production Order**
2. Verify **Current Routing Status:** GROW
3. Click **Actions → Post Output** (or press F9)
4. System opens **Post Output** dialog
5. Review pre-filled values:
   - **Output Quantity:** 500 (suggested from remaining)
   - **Operation No.:** Current operation
   - **Posting Date:** Today
6. Confirm values are correct
7. Click **Post**
8. System performs:
   - Posts 500 units to inventory
   - Records capacity usage on routing line
   - **Automatically assigns blooming stage** based on GROW phase
   - Updates **CLE Blooming Stage** to "Tight Bud" (or configured stage)
   - Updates Finished Quantity: +500
   - Updates Remaining Quantity: -500
9. Verify posting:
   - Check **Finished Quantity** increased
   - Check **CLE Blooming Stage** field populated
   - Navigate → Entries → Item Ledger - see blooming stage on entries

**Result:** Output posted with automatic blooming stage assignment.

---

## Troubleshooting

### Issue 1: Cannot Change Production Order Status

**Symptom:** Error when trying to change status, such as "Cannot change status because..."

**Common Causes:**

1. **Missing required fields**
   - Solution: Fill in all required fields (Item No., Quantity, Due Date, Location)

2. **Inventory not available for components**
   - Solution: Check component availability, create purchase orders or transfers

3. **Capacity not available**
   - Solution: Review capacity calendar, adjust operation dates, or increase capacity

4. **Order already has posted output (trying to go backward)**
   - Solution: Cannot revert status after output posted; create new order if needed

5. **User does not have permission**
   - Solution: Contact administrator for permission assignment

---

### Issue 2: Safety Quantity Not Calculated

**Symptom:** Changed status to Firm Planned but safety quantity is still 0.

**Common Causes:**

1. **Item does not have Overstart % configured**
   - Solution: Open Item Card, set **CLE Overstart %** field (e.g., 3.0)

2. **CLE Requested Quantity not entered**
   - Solution: Enter value in **CLE Requested Quantity** field before changing status

3. **Changed status to Released directly (skipped Firm Planned)**
   - Solution: Safety is only calculated when changing TO Firm Planned status
   - Workaround: Change back to Planned, then to Firm Planned, then to Released

4. **Manual quantity entry instead of using Requested Quantity field**
   - Solution: Use **CLE Requested Quantity** field; system calculates total quantity automatically

---

### Issue 3: Cannot Assign Task Template

**Symptom:** Error "Cannot change or delete the task list because completed tasks exist."

**Cause:** Production order has tasks that have been marked as completed.

**Solution:**
- You cannot change task template after tasks are completed
- Complete production with existing template
- Or, if absolutely necessary, have manager manually delete completed tasks (not recommended)

---

### Issue 4: Split Production Order Action Not Available

**Symptom:** Split Production Order button is grayed out or doesn't appear.

**Common Causes:**

1. **User does not have split authorization**
   - Solution: Contact administrator to add user to split authorization group

2. **Production order is not Released status**
   - Solution: Only Released orders can be split; change status first

3. **Order is blocked**
   - Solution: Unblock the order before attempting split

4. **All output already posted**
   - Solution: Cannot split after production is complete

---

### Issue 5: Blooming Stage Not Assigned After Output Posting

**Symptom:** Posted output but **CLE Blooming Stage** field is still blank.

**Common Causes:**

1. **Item does not have blooming stage configuration**
   - Solution: Not all items have blooming stages (only flowering plants)
   - Check if item should have blooming stage setup

2. **Current routing phase not linked to blooming stage**
   - Solution: Blooming stages only assign at specific routing phases (e.g., GROW, QC)
   - Check **Current Routing Status** - may need to post output at different operation

3. **Manual blooming stage assignment disabled**
   - Solution: Contact administrator to verify blooming stage setup

---

### Issue 6: Components Not Available for Production

**Symptom:** Status change fails with "Component availability" error or warning.

**Common Causes:**

1. **Insufficient inventory of component items**
   - Solution: Check component item inventory
   - Create purchase orders for components
   - Or create transfer orders from other locations

2. **Components reserved for other orders**
   - Solution: Review component reservations
   - Prioritize production orders
   - Or order additional components

3. **Wrong location code**
   - Solution: Verify production order location matches component inventory location
   - Or use transfer orders to move components

**How to Check Component Availability:**

1. Open the production order
2. Click **Lines → Components**
3. Review component lines
4. For each component:
   - Note **Expected Quantity**
   - Click **Line → Item Availability by Location**
   - Check available inventory at production location
5. Address shortages before releasing order

---

### Issue 7: Cannot Post Output - Remaining Quantity Zero

**Symptom:** Error when posting output: "Remaining quantity is zero."

**Common Causes:**

1. **All production already posted**
   - Solution: Verify **Finished Quantity** vs. **Quantity**
   - If production is complete, change status to Finished instead

2. **Scrap posted reduced quantity to zero**
   - Solution: Review scrap postings
   - May need to manually increase production quantity if under-produced

3. **Quantity reduction or adjustment**
   - Solution: Check quantity history
   - May need to manually increase quantity if more output is needed

---

### Issue 8: Routing Dates Don't Make Sense

**Symptom:** Routing operation dates are in the past, or operations end after due date.

**Common Causes:**

1. **Due date set in the past**
   - Solution: Update **Due Date** to realistic future date
   - Click **Actions → Refresh** to recalculate routing dates

2. **Insufficient capacity available**
   - Solution: Operations scheduled further out due to calendar constraints
   - Review work center calendars
   - Or adjust capacity/efficiency settings

3. **Routing not refreshed after date changes**
   - Solution: Click **Actions → Refresh Production Order**
   - System recalculates all routing dates

**How to Refresh Routing:**

1. Open the production order (Planned or Firm Planned status)
2. Change **Due Date** if needed
3. Click **Actions → Refresh Production Order**
4. Select options: Calculate lines (Yes), Calculate routings (Yes)
5. Click **OK**
6. System recalculates operation dates backward from due date

---

## Best Practices

### Production Order Creation

1. **Use Planning Worksheet for regular production**
   - More efficient than manual creation
   - Considers all demand sources
   - Optimizes quantities and timing

2. **Always enter Requested Quantity first**
   - Let system calculate total quantity with safety
   - Don't manually enter total quantity directly

3. **Assign task templates early**
   - Add template when creating Firm Planned order
   - Tasks are ready when order is released

4. **Set realistic due dates**
   - Account for routing time requirements
   - Include buffer for quality checks
   - Consider component lead times

5. **Choose correct location**
   - Verify location has capacity and materials
   - Avoid changing location after releasing

---

### Status Management

1. **Follow standard status progression**
   - Simulated → Planned → Firm Planned → Released → Finished
   - Don't skip Firm Planned (safety quantity is added there)

2. **Release only when ready to start production**
   - Released creates tasks and capacity commitments
   - Don't release too far in advance

3. **Don't finish orders prematurely**
   - Verify all output posted
   - Complete all tasks
   - Perform final quality checks

4. **Use Simulated for quotes and estimates**
   - Test production scenarios without commitment
   - Delete simulated orders when no longer needed

---

### Safety Quantity Management

1. **Configure appropriate overstart percentages**
   - Review historical scrap rates by item
   - Adjust overstart % on item card based on actual losses
   - Higher risk items need higher overstart

2. **Monitor safety consumption during production**
   - Track scrap postings
   - If exceeding safety, investigate quality issues
   - May need to manually increase safety mid-production

3. **Release safety quantity on final phase**
   - Standard practice is to release remaining safety to customer
   - Only keep safety if specific quality concerns

4. **Don't adjust safety lightly**
   - Increasing safety requires more components
   - Check availability before increasing
   - Document reason for adjustments

---

### Task Management

1. **Use templates consistently**
   - Standardize task lists for similar production types
   - Train staff on standard task completion procedures

2. **Complete tasks on time**
   - Enforce due date compliance
   - Overdue tasks indicate production delays

3. **Don't change task template after starting**
   - Tasks cannot be changed once completed
   - Plan task needs before releasing order

4. **Use routing links to phase tasks**
   - Tie tasks to routing operations
   - Tasks appear at appropriate production phases

---

### Splitting and Adjustments

1. **Split early rather than late**
   - Easier before output posting begins
   - Component allocations are cleaner

2. **Document split reasons**
   - Add notes to both production orders
   - Explain why split occurred for future reference

3. **Update sales order links after splitting**
   - Manually link split orders to sales lines
   - Ensure correct order ships to customer

4. **Avoid excessive splitting**
   - Too many small orders create overhead
   - Consider replanning production instead

---

### Output Posting

1. **Post output regularly during production**
   - Don't wait until end to post everything
   - Enables better WIP tracking and costing

2. **Verify blooming stages assigned correctly**
   - Check stage after posting
   - Ensures inventory available with correct stages for orders

3. **Post scrap when it occurs**
   - Don't hide scrap until end
   - Accurate scrap tracking improves planning

4. **Review capacity postings**
   - Ensure hours recorded match actual production time
   - Accurate capacity data improves future scheduling

---

### Inventory and Components

1. **Verify component availability before releasing**
   - Check inventory for all components
   - Order or transfer components in advance

2. **Use auto-flushing for standard components**
   - Reduces manual consumption posting
   - Improves efficiency

3. **Reconcile inventory regularly**
   - Physical inventory counts on production orders
   - Compare system vs. actual components used

4. **Plan for safety quantity component needs**
   - Remember: Safety Qty increases component requirements
   - Order extra components for overstart buffer

---

### Reporting and Analysis

1. **Review finished production orders regularly**
   - Analyze scrap rates by item
   - Identify quality issues
   - Adjust overstart percentages based on actual losses

2. **Track task completion rates**
   - Identify bottleneck tasks
   - Improve task templates based on actual workflows

3. **Monitor capacity utilization**
   - Identify overloaded work centers
   - Balance production across facilities

4. **Analyze production variances**
   - Actual vs. standard costs
   - Quantity variances (over/under production)
   - Time variances (capacity used vs. planned)

---

## Best Practices Summary Table

| Area | Do This | Avoid This |
|------|---------|------------|
| **Creation** | Use Planning Worksheet, enter Requested Quantity | Manual quantity entry, skip firm planned status |
| **Status** | Follow standard progression | Skip Firm Planned (misses safety calc) |
| **Safety** | Set appropriate overstart %, monitor consumption | Ignore scrap, adjust without checking components |
| **Tasks** | Assign early, complete on time | Change template after completion |
| **Splitting** | Split early, document reasons | Excessive splits, ignore sales links |
| **Output** | Post regularly, verify blooming stages | Wait until end, ignore capacity posting |
| **Components** | Check availability first, use auto-flush | Release without materials |
| **Reporting** | Analyze variances, adjust standards | Ignore historical data |

---

## SOP Document

The full SOP for production order management is available on SharePoint:  
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/prod-order-management-user-guide.pdf)

---

**Document Version:** 1.0  
**Last Updated:** March 17, 2026  
**System Version:** Clesen Horticulture Extension 26.4.x  
**Related Guides:**
- [Production Order Posting - Staff Guide](prod-order-posting-staff-guide.md)
- [Production Order Posting - Manager Guide](prod-order-posting-manager-guide.md)
- [Production Order Tasks - Staff Guide](../production-order-tasks/prod-order-task-staff-guide.md)
- [Production Order Tasks - Manager Guide](../production-order-tasks/prod-order-task-manager-guide.md)
- [Blooming Stage - User Guide](../growing/blooming-stage-user-guide.md)
