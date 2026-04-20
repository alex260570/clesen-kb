# Purchase Worksheet - User Guide

**Version:** 1.0  
**Last Updated:** March 17, 2026  
**Audience:** Purchasers, Buying Agents, Procurement Staff  

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Understanding the Workspace](#understanding-the-workspace)
4. [Creating Your Worksheet](#creating-your-worksheet)
5. [Working with Worksheet Lines](#working-with-worksheet-lines)
6. [Making Changes](#making-changes)
7. [Applying Changes to Purchase Orders](#applying-changes-to-purchase-orders)
8. [Advanced Features](#advanced-features)
9. [Common Workflows](#common-workflows)
10. [Change Tracking and Collaboration](#change-tracking-and-collaboration)
11. [Troubleshooting](#troubleshooting)
12. [Best Practices](#best-practices)
13. [Quick Reference](#quick-reference)

---

## Overview

### What is the Purchase Worksheet?

The Purchase Worksheet (also known as the Broker Workspace) is a powerful planning tool that provides a comprehensive view of your purchasing needs. It allows you to:

- **Plan purchases collaboratively** in a temporary workspace before committing changes
- **See demand from sales orders** alongside existing purchase orders
- **Calculate projected inventory levels** for each item on each date
- **Model "what-if" scenarios** without affecting actual purchase orders
- **Make bulk adjustments** to quantities, dates, and vendors
- **Apply all changes at once** to convert planning to actual purchase orders
- **Track all modifications** with a complete audit trail

**Think of it as:** An intelligent spreadsheet that pulls real-time data from sales orders and purchase orders, lets you plan your purchases, and then pushes your decisions back to create or update actual purchase orders.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Demand-Driven** | See exactly what customers need and when they need it |
| **Availability Forecasting** | Know your projected inventory before committing to changes |
| **Safe Planning** | Test changes in the worksheet without affecting real purchase orders |
| **Bulk Operations** | Adjust multiple orders efficiently in one session |
| **Transportation Planning** | See cart quantities to coordinate shipments |
| **Change Logging** | Complete audit trail for collaborative purchasing teams |
| **Vendor Management** | Easily switch vendors or consolidate orders |
| **Date Management** | Batch update receipt dates across multiple lines |

### When to Use the Purchase Worksheet

- **Daily/weekly purchase planning** - Review demand and adjust orders
- **Responding to demand changes** - Customers add or change orders
- **Adjusting delivery schedules** - Vendor delays or early shipments
- **Seasonal planning** - Bulk ordering for spring, summer, fall campaigns
- **Forecast comparison** - Compare actual orders against production forecasts
- **Vendor coordination** - Consolidate orders or switch suppliers
- **Shortage management** - Identify and resolve inventory shortfalls

---

## Getting Started

### Accessing the Purchase Worksheet

**Navigation:**

1. Open Business Central
2. In the search box, type **"Broker Workspace"** or **"Purchase Worksheet"**
3. Click to open page 50086 "CLE Purchase Worksheet"

**Alternative Access:**
- From the **Purchasing Role Center**, look for the "Tasks" section
- Bookmark the page for quick access

### User-Specific Workspaces

> **Important:** Each user has their own private worksheet. Your worksheet is isolated from other users' worksheets until you apply changes to actual purchase orders.

**Your worksheet persists between sessions:**
- When you close the page, you can choose to keep or delete your worksheet
- If kept, your filters and data remain when you reopen
- If deleted, you start fresh next time

### Prerequisites

**Your user profile must have:**

- **Purchaser Code** assigned in User Setup
- **Permission** to create and edit purchase orders
- **Access** to view items, vendors, sales orders, and inventory
- **Understanding** of your company's purchasing processes

### First-Time Setup

**No special setup required.** The worksheet is ready to use as soon as you have:

1. Items in inventory with vendors assigned
2. Purchase orders in the system
3. Sales orders creating demand
4. Your user ID linked to specific vendors (optional, for filtering)

---

## Understanding the Workspace

### Page Layout Overview

The Purchase Worksheet page has three main sections:

1. **Header Section** (top) - Filters and parameters
2. **Lines Section** (grid) - Worksheet data rows
3. **FactBox Section** (right) - Additional line details

### Header Section Fields

#### Date Range

| Field | Purpose | Example |
|-------|---------|---------|
| **Start Date** | Beginning of planning window | 03/17/2026 |
| **End Date** | End of planning window (typical: 4-6 weeks) | 04/30/2026 |

The worksheet only loads purchase orders and demand within this date range.

#### Item and Vendor Filters

| Field | Purpose | Filter Options |
|-------|---------|----------------|
| **Item No. Filter** | Limit to specific items | `%my`, `%Spring`, `ITEM001\|ITEM002`, or blank for all |
| **Vendor No. Filter** | Limit to specific vendors | `%my`, `V001\|V002`, or blank for all |

**Special Filters:**
- `%my` = Items or vendors assigned to your user ID
- `%Spring` = All items with "Spring" in their season code
- `%Summer` = All items with "Summer" in their season code
- Use **Assist Edit** (F6 or ... button) to select multiple items/vendors from a list

#### Options

| Field | Purpose |
|-------|---------|
| **Brokered Items only** | ☑ = Only show purchase replenishment items<br>☐ = Show all inventory items |
| **User ID** | Your user ID (read-only, for reference) |
| **Current Filter** | Quick filter mode: Blank, Supply Only, or Unavailable Items |

#### Forecast Section

| Field | Purpose |
|-------|---------|
| **Forecast** | Production forecast to compare against planned purchases |
| **Include Purchases from** | Start date for forecast balance calculation |
| **Include Purchases to** | End date for forecast balance calculation |

These fields are optional and used when your company compares actual orders against production forecasts.

### Lines Section (Grid)

Each row in the grid represents either:

| Line Type | Description | Identifier |
|-----------|-------------|------------|
| **Supply Line** | Existing purchase order line | Has Purchase Order No. |
| **Demand Line** | Sales order demand without purchase order | Blank Purchase Order No., has Demand Qty. |

### Column Descriptions

#### Identification Columns

| Column | Description | Editable |
|--------|-------------|----------|
| **Purchase Order No.** | Linked purchase order (blank if demand-only) | No |
| **Vendor No.** | Vendor code | No |
| **Vendor Name** | Vendor name | No |
| **Item No.** | Item code | No |
| **Item Description** | Item name | No |
| **Item Description 2** | Item extended description | No |

#### Date Columns

| Column | Description | Editable |
|--------|-------------|----------|
| **Requested Receipt Date** | Date you request delivery from vendor | **Yes** |
| **Inbound Warehouse Time** | Processing days (auto-filled from location) | No |
| **Exp. Receipt Date** | Calculated date: Requested Date - Inbound Time | No |

#### Quantity Columns

| Column | Description | Editable |
|--------|-------------|----------|
| **Purch. Line Quantity** | Current quantity on purchase order | No |
| **Purch. Line Quantity New** | Your planned new quantity | **Yes** |
| **Purch. Line Quantity Adj.** | Difference: New - Current | No |
| **Demand Qty.** | Total sales order demand for this date | No |

**Color Coding:**
- **Red text** on Demand Qty. or Qty. Available indicates a shortage or negative value

#### Availability Columns

| Column | Description |
|--------|-------------|
| **Qty. Available** | Projected inventory on this date (renamed "Projected Inventory") |
| **Cum. Availability** | Cumulative running total (inventory + receipts - demand) |
| **Cum. Avail. (simulated)** | Cumulative availability WITH your planned changes |

**Calculation Logic:**

```
Qty. Available = Current Inventory + Prior Receipts - Sales Demand + This Line Quantity
```

The simulated availability recalculates automatically as you change quantities, showing the impact before you apply changes.

#### Transportation Columns

| Column | Description |
|--------|-------------|
| **Cart Quantity Line** | Number of carts for this line |
| **Cart Total Purch. Order** | Total carts for entire purchase order |

**Cart Warnings:**
- Cart totals over **40 carts** may appear in red
- Use this to plan shipment logistics and split large orders

#### Other Columns

| Column | Description |
|--------|-------------|
| **Global Dimension 2 Code** | Department, location, or cost center |
| **Season Forecast Qty.** | Forecasted quantity for this item (if forecast selected) |
| **Season Forcast Balance** | Difference: Forecast - Actual Orders |
| **Warning** | System-generated warnings (e.g., "Purchase line changed") |

### FactBox Section

The FactBox on the right shows additional details for the selected line:

- Original purchase order information
- Blanket order references
- Quantity breakdowns
- Log entry count

---

## Creating Your Worksheet

### Step 1: Clear Previous Session (if needed)

If you have old data from a previous session:

1. Click the **"Clear Page"** button
2. Confirm **"Yes"** to delete all lines
3. All previous filters and changes are removed

> **Warning:** Clearing the page deletes all uncommitted changes. Make sure you've applied any important changes first.

### Step 2: Set Your Planning Parameters

#### Set Date Range

**Typical planning horizons:**

| Scenario | Start Date | End Date |
|----------|-----------|----------|
| **Daily Planning** | Today | +2 weeks |
| **Weekly Planning** | Today | +4 weeks |
| **Seasonal Planning** | Season Start | Season End |
| **Full Quarter** | Today | +12 weeks |

**Tips:**
- Larger date ranges take longer to load
- Focus on actionable timeframes (2-6 weeks)
- Extend date range for seasonal bulk planning

#### Set Item Filter

**Common filtering patterns:**

| Filter Syntax | Result |
|---------------|--------|
| *(blank)* | All items (subject to vendor filter) |
| `%my` | All items assigned to your purchaser code |
| `%Spring` | All spring season items |
| `ITEM001` | Single item |
| `ITEM001\|ITEM002\|ITEM003` | Multiple specific items |

**Using Assist Edit:**

1. Click the **...** button next to "Item No. Filter"
2. Browse/search items in the list
3. Select multiple items (Ctrl+Click)
4. Click **OK** - system builds filter automatically

**Tips:**
- Use seasonal filters for bulk seasonal planning
- Use `%my` for your daily assigned items
- Use specific items when troubleshooting shortages

#### Set Vendor Filter

**Common filtering patterns:**

| Filter Syntax | Result |
|---------------|--------|
| *(blank)* | All vendors |
| `%my` | Vendors assigned to your purchaser code |
| `V001` | Single vendor |
| `V001\|V002` | Multiple vendors |

**Using Assist Edit:**

1. Click the **...** button next to "Vendor No. Filter"
2. Browse/search vendors
3. Select multiple vendors (Ctrl+Click)
4. Click **OK**

#### Set Additional Options

**Brokered Items Only:**
- Check this box to show only items that are normally purchased (not grown in-house)
- Uncheck to see all inventory items

**Forecast (Optional):**
- Select a production forecast from the dropdown
- Set "Include Purchases from/to" dates
- System calculates forecast balance for comparison

### Step 3: Get Data

1. Verify all filters are set correctly
2. Click the **"Get Data"** button
3. Wait for the system to calculate (may take 30-90 seconds)

**What happens during "Get Data":**

The system:
1. Scans all purchase orders in the date range
2. Retrieves sales order demand for each item/date
3. Calculates current inventory
4. Projects availability for each date
5. Populates worksheet lines
6. Calculates cart quantities
7. Loads forecast data (if selected)

**Progress Indicator:**
- A progress window shows item calculation status
- Larger date ranges and item counts take longer

> **Note:** If you get an error, verify your date range isn't too large. Try reducing to 4-6 weeks.

### Step 4: Review Loaded Data

Once data loads, you'll see:

- **Supply lines** (existing purchase orders) with PO numbers
- **Demand lines** (sales demand without orders) with blank PO numbers
- **Availability calculations** showing projected inventory
- **Cart totals** for transportation planning

**Initial View:** All lines are shown by default. Use filters to focus your review.

---

## Working with Worksheet Lines

### Understanding Line Types

#### Supply Lines

**Characteristics:**
- Have a **Purchase Order No.** populated
- Show current **Purch. Line Quantity**
- Linked to actual purchase order in the system
- Can be modified (quantity, date) and changes applied back to PO

**Typical Actions:**
- Adjust quantities up or down
- Change requested receipt dates
- Move to different vendor/PO
- Copy to create template orders

#### Demand Lines

**Characteristics:**
- **Purchase Order No.** is blank
- Show **Demand Qty.** from sales orders
- No purchase exists yet to fulfill this demand
- Represent unfulfilled customer needs

**Typical Actions:**
- Create new purchase line to cover demand
- Review demand details (drill down on Demand Qty.)
- May indicate shortage or need to order

### Using Filters Effectively

#### Current Filter Dropdown

The **Current Filter** field provides three quick views:

| Filter Mode | Shows | When to Use |
|-------------|-------|-------------|
| **Blank (Show All)** | All lines (supply + demand) | Initial review, full picture |
| **Supply Only** | Only lines with PO No. or qty changes | Focus on what you're actually purchasing |
| **Unavailable Items** | Only lines with negative Qty. Available | Find shortages and problems |

**Workflow:**
1. Start with "Show All" to see complete picture
2. Switch to "Unavailable Items" to identify shortages
3. Switch to "Supply Only" to review orders you're placing
4. Return to "Show All" when done

#### Sorting

**Default Sort:** By User ID, Item No., and Expected Receipt Date

**To change sort:**
- Click any column header to sort by that column
- Click again to reverse sort order
- Use "Reset Filter & Sorting" action to return to default

**Useful Sorts:**
- Sort by **Item Description** - Group by item name
- Sort by **Vendor Name** - Group by vendor
- Sort by **Exp. Receipt Date** - Chronological order
- Sort by **Qty. Available** - Find negative availability first

### Drilling Down on Data

#### Demand Qty. Drill-Down

To see **which sales orders** create demand:

1. Click on the value in **Demand Qty.** column
2. System opens a page showing all sales order lines for that item/date
3. Review customer names, quantities, ship-to locations
4. Close the page to return to worksheet

**Use this to:**
- Verify demand is real (not test orders)
- Check customer priority
- Identify blanket order releases
- Confirm ship-to locations

#### Purchase Order Drill-Down

To open the **actual purchase order**:

1. Click on the **Purchase Order No.** value
2. System opens the purchase order card
3. Review full order details, vendor info, terms
4. Make changes if needed (though worksheet is recommended)
5. Close to return to worksheet

---

## Making Changes

### Changing Quantities

**To adjust order quantities:**

1. Locate the line to change
2. Click in the **Purch. Line Quantity New** cell
3. Type the new quantity
4. Press **Enter**

**What happens immediately:**

- **Purch. Line Quantity Adj.** updates to show the change (+/- difference)
- **Line Modified** flag sets to `true` (marks line for applying)
- **Cart Quantity Line** recalculates
- **Cart Total Purch. Order** updates for entire PO
- **Cum. Avail. (simulated)** recalculates for this date and all future dates
- **Change log entry** is created automatically
- Line background may turn orange/yellow (pending changes)

**Business Rules:**

- Cannot set negative quantity
- For demand-only lines (no PO yet): Must create new purchase line first
- Setting quantity to **0** on existing line: Line will be deleted when applied
- Quantity must respect unit of measure rules

**Example:**

| Current Qty | New Qty | Adjustment | Result When Applied |
|-------------|---------|------------|---------------------|
| 100 | 150 | +50 | Purchase line updated to 150 |
| 100 | 75 | -25 | Purchase line reduced to 75 |
| 100 | 0 | -100 | Purchase line deleted (if nothing received) |
| 0 | 50 | +50 | New purchase line created (if new line process used) |

**Tips:**
- Make all quantity changes before applying
- Watch **Cum. Avail. (simulated)** to verify your plan
- Check **Cart Total Purch. Order** to avoid over-capacity shipments
- Use forecasts to guide order quantities

### Changing Dates

**To move an order to a different delivery date:**

1. Locate the line to change
2. Click in the **Requested Receipt Date** cell
3. Select new date from calendar picker
4. Press **Enter**

**What happens immediately:**

- **Exp. Receipt Date** auto-calculates (Requested Date - Inbound Time)
- System checks if purchase order line has already changed
- If other lines exist on same PO, system may ask: *"Adjust other lines too?"*
- **Line Modified** flag sets to `true`
- **Demand and availability recalculate** for new date
- If demand exists on new date, lines may merge
- **Change log entry** is created

**Auto-Merging Logic:**

When you change a date, the system:
1. Checks if demand-only line exists on new date
2. If yes, merges supply with demand
3. Removes duplicate demand line
4. Updates availability calculations

**Example Scenario:**

**Before date change:**
- Date 03/20: Demand = 50, PO Qty = 0
- Date 03/25: Demand = 0, PO Qty = 100

**After changing PO date from 03/25 to 03/20:**
- Date 03/20: Demand = 50, PO Qty = 100 (merged)
- Date 03/25: *line removed*

**Tips:**
- Verify vendor can accommodate new date before changing
- Watch for negative availability after date shifts
- Group related date changes together
- Consider lead times when moving dates earlier

### Creating New Purchase Lines

**When you have demand but no supply:**

Demand lines (blank Purchase Order No.) represent sales orders without corresponding purchase orders. You need to create a new purchase line to fulfill this demand.

**Steps:**

1. Select the demand line (click on the row)
2. Click **"New Purchase Line"** button (or right-click > New Purchase Line)
3. Dialog opens with pre-filled information

**Dialog Fields:**

| Field | Pre-Filled | Editable | Notes |
|-------|-----------|----------|-------|
| **Item** | Yes | No | From selected demand line |
| **Vendor No.** | Yes (item's default) | **Yes** | Choose vendor from dropdown |
| **Vendor Name** | Yes | No | Auto-fills when vendor selected |
| **Quantity** | No | **Yes** | Enter quantity to order |
| **Unit of Measure Code** | Yes | No | Item's purchase UOM |
| **Requested Receipt Date** | Yes (from demand) | **Yes** | When you need delivery |
| **Inbound Time** | Yes (from location) | **Yes** | Warehouse processing days |
| **Expected Receipt Date** | Calculated | **Yes** | Auto-calculated, can override |
| **Global Dimension 2 Code** | Yes | **Yes** | Department/location code |

4. Review all fields, adjust as needed
5. Click **OK**

**What happens:**

- New worksheet line is created
- Line is marked as modified (no PO exists yet)
- **When applied:** Creates new purchase order (or adds to existing if same vendor/date/dimension)
- Original demand line merges if quantities match

**Tips:**
- Order enough to cover demand **plus** safety stock
- Check vendor lead times before setting requested date
- For multiple items from same vendor, create separate lines (system may consolidate on apply)
- Verify dimension code matches your department

---

## Applying Changes to Purchase Orders

### Understanding the Apply Process

> **Critical Concept:** Changes in the worksheet are **temporary** and do not affect real purchase orders until you **Apply** them.

**Apply Process Overview:**

1. System reviews all lines marked **"Line Modified = true"**
2. Determines what changed (quantity, date, vendor, PO assignment)
3. Executes appropriate action on actual purchase documents
4. Updates worksheet with new PO numbers and line numbers
5. Marks change log entries as "Applied"
6. Removes "Line Modified" flags
7. Updates line backgrounds to white (no longer pending)

**Types of Changes Applied:**

| What Changed | System Action |
|--------------|---------------|
| **Quantity only** | Updates purchase line quantity field |
| **Date only** | Updates PO header dates (Requested Receipt Date, Expected Receipt Date) |
| **Quantity + Date** | Updates both quantity and dates |
| **Vendor changed** | Moves line to different vendor's PO (creates/deletes lines) |
| **PO number changed** | Moves line to different PO |
| **New line (no PO yet)** | Creates new PO header and line, or adds to existing PO |
| **Quantity set to 0** | Deletes purchase line (if nothing received) |

### Apply Selected Lines

**Use when:** You want to apply only specific changes, not everything.

**Steps:**

1. Review lines to apply (orange/yellow background = modified)
2. Select lines to apply:
   - Click checkbox on each line, or
   - Ctrl+Click to select multiple, or
   - Select range with Shift+Click
3. Click **"Apply selected"** button
4. System processes selected lines
5. Progress indicator shows processing
6. Message displays: *"X Changes applied"*

**What gets applied:**
- Only the lines you selected
- Only if marked as modified
- Processed in the order they appear in the grid

**When to use:**
- Testing apply process on a few lines first
- Applying urgent changes before completing full review
- Different team members responsible for different vendors

### Apply All Changes

**Use when:** You've completed your planning and want to commit all pending changes.

**Steps:**

1. Review all modified lines (scan for orange/yellow backgrounds)
2. Verify **Cum. Avail. (simulated)** looks correct
3. Check **Cart Total Purch. Order** values are reasonable
4. Click **"Apply all"** button
5. System processes **ALL** modified lines
6. Progress indicator shows processing
7. Message displays: *"X Changes applied"*

**What gets applied:**
- Every line marked as modified
- All quantity changes
- All date changes
- All new purchase lines
- All vendor/PO moves

> **Warning:** You cannot undo after applying. All changes immediately affect live purchase orders. Review carefully before clicking "Apply all."

### What Happens During Apply

#### For New Orders (New Purchase Lines)

1. System searches for existing PO with:
   - Same vendor
   - Same requested receipt date
   - Same global dimension 2 code
2. **If found:** Adds new line to existing PO
3. **If not found:** Creates new PO header with:
   - Your specified vendor
   - Your specified dates
   - Default payment terms, delivery location
4. Creates purchase line with:
   - Item, quantity, unit cost from item/vendor
   - Blanket order reference (if applicable)
   - Dimension codes
5. Updates worksheet with new PO number and line number

#### For Quantity Changes

1. Opens existing purchase order line
2. Validates quantity change is allowed (not over-received)
3. Updates **Quantity** field
4. Recalculates:
   - Line amount
   - VAT
   - Blanket order used quantity
   - Outstanding quantity
5. If quantity changed to **0** and nothing received: **Deletes line**

#### For Date Changes

1. Opens purchase order header
2. Updates **Requested Receipt Date**
3. Calculates **Expected Receipt Date** (Requested - Vendor Lead Time + Inbound Time)
4. Prompts: *"Do you want to update all lines on this PO?"*
   - **Yes:** All lines on PO get new dates
   - **No:** Only changed line gets new date (may cause inconsistency)
5. Updates worksheet with new dates

#### For Move Line (Vendor/PO Change)

1. Creates new line on target purchase order:
   - Same item, quantity, unit cost
   - Same blanket order reference
   - Target vendor, target PO
2. Updates blanket order quantities (if applicable)
3. Deletes original line (if nothing received):
   - Otherwise, reduces quantity to received amount
4. Updates worksheet with new PO number and line number

#### For Released Purchase Orders

**If PO is already released:**

1. System automatically **reopens** the PO
2. Makes the changes
3. Automatically **re-releases** the PO
4. You may see messages: *"Reopening PO-001234..."* and *"Releasing PO-001234..."*

> **Note:** Released POs can be changed, but may require manager approval depending on your company's workflow setup.

### After Applying Changes

**Verify Success:**

1. Modified lines turn back to **white background**
2. **Line Modified** flags clear
3. **Purchase Order No.** populates for new orders
4. **Cart totals** finalize
5. No error messages displayed

**Next Steps:**

1. **Check Purchase Orders:**
   - Click on the PO numbers to open orders
   - Verify quantities are correct
   - Verify dates are correct
   - Review vendor details

2. **Print and Send:**
   - Print purchase orders for vendor confirmation
   - Email or fax orders to vendors
   - Follow up on delivery confirmations

3. **Update Worksheet (Optional):**
   - Click **"Refresh Data"** to reload latest data
   - Verify availability calculations updated
   - Continue planning for next period

---

## Advanced Features

### Copy Purchase Order

**Purpose:** Create a template copy of an existing purchase order with a new date.

**Use Cases:**
- Recurring weekly/monthly orders from same vendor
- Seasonal purchase patterns
- Copying last year's order to this year
- Creating backup orders with later dates

**Steps:**

1. Select a line from the purchase order you want to copy
2. Click **"Copy Purch. Order"** button
3. Dialog opens showing all lines from that PO

**Dialog Options:**

| Field | Purpose |
|-------|---------|
| **New Receipt Date** | The delivery date for the copied order |
| **Include Zero Qty Lines** | ☑ = Copy lines even with zero quantity |

4. Review the lines to be copied
5. Set the **New Receipt Date**
6. Click **OK**

**What happens:**

- System creates new worksheet lines for each line on original PO
- Lines have same vendor, items, quantities
- Lines have your specified new receipt date
- Lines are marked as modified (not yet applied)
- When applied: Creates new purchase order

**Tips:**
- Use this for standard reorder patterns
- Adjust quantities on copied lines before applying
- Verify cart totals don't exceed capacity
- Check availability on new date before applying

### Set Required Dates

**Purpose:** Batch update requested receipt dates across multiple worksheet lines.

**Use Cases:**
- Vendor changes delivery schedule
- Moving entire shipment to different week
- Adjusting for holidays or plant shutdowns
- Coordinating multi-item deliveries

**Steps:**

1. Select multiple lines (Ctrl+Click or Shift+Click)
2. Click **"Set Required Dates"** or similar date-setting action
3. Dialog opens

**Dialog Fields:**

| Field | Purpose |
|-------|---------|
| **New Requested Receipt Date** | Date you want for all selected lines |
| **Recalculate Expected Date** | ☑ = Auto-calculate exp. date from inbound time |

4. Set the new date
5. Click **OK**

**What happens:**

- All selected lines update to new requested receipt date
- Expected receipt dates recalculate
- Lines marked as modified
- Availability recalculates for new dates
- Lines may merge if demand exists on new dates

**Tips:**
- Check with vendor before batch date changes
- Watch for negative availability after shifts
- Consider lead times when moving dates earlier
- Group lines by vendor for coordinated changes

### Change Vendor or Purchase Order

**Purpose:** Move a purchase line to a different vendor or a different purchase order.

**Use Cases:**
- Switching to alternate vendor (price, availability)
- Consolidating multiple small orders
- Splitting large order across multiple vendors
- Moving line from one PO to another for same vendor

**Steps:**

1. Select the line to move
2. Click **"Change Vendor or Purchase Order"** button
3. Dialog opens

**Dialog Fields:**

| Field | Purpose |
|-------|---------|
| **Vendor No.** | Select new vendor (or keep same) |
| **Vendor Name** | Displays selected vendor name |
| **Exp. Receipt Date** | Current expected date (read-only) |
| **Make new Order** | ☑ = Create new PO<br>☐ = Move to existing PO |

**Option 1: Move to Existing PO (Same Vendor)**

1. Keep same vendor in **Vendor No.**
2. Uncheck **"Make new Order"**
3. Dialog shows list of existing POs for that vendor
4. Select target PO from list
5. If dates differ, system confirms: *"Different date. Continue?"*
6. Click **OK**

**Result:**
- Line moves to selected PO
- Quantity added to PO
- Original line deleted (if nothing received)

**Option 2: Move to Different Vendor**

1. Change **Vendor No.** to new vendor
2. Check or uncheck **"Make new Order"**:
   - **Checked:** Creates new PO for new vendor
   - **Unchecked:** Adds to existing PO for new vendor (select from list)
3. Click **OK**

**Result:**
- New line created on target vendor PO
- Original line deleted
- Unit costs may recalculate based on new vendor pricing

**Option 3: Create New PO (Same Vendor)**

1. Keep same vendor
2. Check **"Make new Order"**
3. Click **OK**

**Result:**
- New PO created for same vendor
- Line moved to new PO
- Use this to split orders for shipment capacity

**Tips:**
- Verify new vendor has item on file
- Check pricing differences before moving
- Watch for blanket order impacts
- Consider minimum order quantities

### Refresh Data

**Purpose:** Reload worksheet data without clearing and recreating.

**Use Cases:**
- Someone else created/changed purchase orders
- Sales orders were added or changed
- Inventory levels updated
- Verify applied changes reflected correctly

**Steps:**

1. Click **"Refresh"** or **"Update Supply"** button
2. System reloads:
   - Purchase order quantities and dates
   - Sales demand
   - Inventory levels
   - Availability calculations
3. Worksheet updates with latest data

**Preserves:**
- Your filters (date range, items, vendors)
- Your unapplied changes (Line Modified = true)
- Your forecast settings

**Updates:**
- Purchase quantities from actual POs
- Demand from sales orders
- Availability figures
- Cart quantities

**Tips:**
- Refresh before applying changes to catch external updates
- Refresh after applying to verify success
- Use when working collaboratively with other purchasers

### Check for Changes on Existing Purchase Lines

**Purpose:** Detect if purchase order lines have been modified by someone else since you loaded the worksheet.

**Steps:**

1. Click **"Check for Changes on existing Purchase Lines"** button
2. System compares:
   - Worksheet quantities vs. actual PO quantities
   - Worksheet dates vs. actual PO dates
   - Hash/checksum values
3. Message displays: *"X Purchase Lines were changed after they were pulled"*
4. Changed lines flagged with **"Purchase Line changed" = true**
5. **Warning** column may display message

**What to do if lines changed:**

- Review which lines changed (filter on "Purchase Line changed" = true)
- Decide: Keep worksheet values or reload from PO?
- If reloading: Use "Refresh Data"
- If keeping: Apply your changes (overwrites external changes)

**Tips:**
- Run this check before "Apply All" in collaborative environments
- Coordinate with team to avoid conflicting changes
- Use change log to see who made external changes

---

## Common Workflows

### Daily Purchase Planning Routine

**Scenario:** You're a buyer responsible for 50 vendors and 500 items. Every morning you review demand and adjust orders.

**Workflow:**

1. **Open Purchase Worksheet**
2. **Check if previous session exists:**
   - If yes, decide: Keep or Clear?
   - If no changes pending: Clear page
3. **Set filters:**
   - Start Date: Today
   - End Date: +4 weeks
   - Item No. Filter: `%my` (your assigned items)
   - Vendor No. Filter: `%my` (your assigned vendors)
   - Brokered Items only: ☑ Checked
4. **Get Data** (wait for load)
5. **Filter on "Unavailable Items"** to see shortages
6. **Review negative availability lines:**
   - Drill down on Demand Qty. to verify sales orders
   - Check if purchase orders exist but quantities too low
   - Check if no purchase order exists
7. **For shortages with existing POs:**
   - Increase **Purch. Line Quantity New**
   - Watch simulated availability turn positive
8. **For shortages without POs:**
   - Click **"New Purchase Line"**
   - Set vendor, quantity, date
   - Create line
9. **Switch to "Supply Only"** filter
10. **Review all pending changes** (orange background)
11. **Verify cart totals** < 40
12. **Apply All**
13. **Print and send POs to vendors**

**Time:** 30-45 minutes daily

### Seasonal Bulk Ordering

**Scenario:** It's January and you need to plan spring purchases for March-May delivery.

**Workflow:**

1. **Open Purchase Worksheet**
2. **Clear Page** (start fresh)
3. **Set filters:**
   - Start Date: 03/01/2026
   - End Date: 05/31/2026
   - Item No. Filter: `%Spring`
   - Vendor No. Filter: (blank - all vendors)
   - Brokered Items only: ☑ Checked
4. **Set Forecast:**
   - Forecast: "Spring 2026"
   - Include Purchases from: 03/01/2026
   - Include Purchases to: 05/31/2026
5. **Get Data**
6. **Review Forecast Balance column:**
   - Positive balance = need to order more
   - Negative balance = may be over-ordered
7. **Sort by Item Description**
8. **For each item:**
   - Review demand pattern (drill down)
   - Review forecast vs. actual
   - Adjust quantities to meet forecast
   - Create new lines as needed
9. **Sort by Vendor Name** to group orders
10. **Review cart totals** by vendor
11. **Apply All** when planning complete
12. **Coordinate delivery dates with vendors**

**Time:** 2-4 hours (one-time per season)

### Vendor Consolidation

**Scenario:** Your primary vendor for an item is out of stock. You need to source from an alternate vendor.

**Workflow:**

1. **Identify the item short on availability**
   - Use "Unavailable Items" filter
2. **Select the line** with primary vendor
3. **Click "Change Vendor or Purchase Order"**
4. **In dialog:**
   - Change Vendor No. to alternate vendor
   - Check "Make new Order"
5. **Click OK**
6. **Verify pricing** on new line (may differ)
7. **Adjust quantity if needed**
8. **Apply changes**
9. **Open new PO** to review terms
10. **Contact alternate vendor** to confirm availability
11. **Print and send PO**

**Alternative:** If moving entire order to different vendor:

1. Select all lines for that vendor/item
2. Use "Change Vendor" on each line
3. Or create new lines and delete old ones (set qty to 0)

### Emergency Shortage Response

**Scenario:** Sales just added a large order for tomorrow. You don't have enough inventory.

**Workflow:**

1. **Open Purchase Worksheet**
2. **Set filters:**
   - Start Date: Today
   - End Date: Tomorrow + 1 week
   - Item No. Filter: *specific item* (or browse demand)
3. **Get Data**
4. **Locate the item** showing negative availability
5. **Drill down on Demand Qty.** to see new sales order
6. **Check existing POs:**
   - Can you expedite delivery?
   - Can you increase quantity?
7. **If yes - expedite:**
   - Change **Requested Receipt Date** to earlier
   - Increase **Purch. Line Quantity New**
   - Apply changes
   - **Contact vendor immediately** for emergency delivery
8. **If no existing PO:**
   - Click **"New Purchase Line"**
   - Choose fastest vendor
   - Set date to tomorrow
   - Apply
   - **Call vendor for rush order**
9. **Notify sales** of delivery timeline

### Coordinating Multi-Item Shipments

**Scenario:** You want to coordinate delivery of 10 items from one vendor to arrive on same truck.

**Workflow:**

1. **Filter on specific vendor**
   - Vendor No. Filter: *vendor code*
2. **Get Data**
3. **Identify lines to consolidate:**
   - Sort by Exp. Receipt Date
   - Select lines arriving in similar timeframe (same week)
4. **Select all lines** to coordinate (Ctrl+Click each)
5. **Use "Set Required Dates"** (or change dates individually)
6. **Set same Requested Receipt Date** for all
7. **Review Cart Total Purch. Order:**
   - Verify total < 40 carts
   - If over: Split into two shipments with different dates
8. **Apply changes**
9. **Contact vendor:** "Please deliver these items together on [date]"
10. **Monitor receipt:** All items should arrive on same delivery

---

## Change Tracking and Collaboration

### Understanding the Change Log

**Every modification you make is logged automatically:**

| Change Type | Log Entry Created |
|-------------|-------------------|
| Quantity change | "Quantity Change" |
| Date change | "Date Change" |
| Vendor change | "Vendor Change" |
| New line creation | "New Line" |
| Line deletion | "Delete Line" |

**Log entries include:**
- User ID (who made change)
- Item description
- Old value
- New value
- Timestamp
- Applied status (true/false)

### Viewing Change Logs

**View All Changes:**

1. Click **"Change Log"** > **"All Changes"**
2. Page opens showing all log entries for your worksheet
3. Review who changed what and when

**View Line Changes:**

1. Select a specific worksheet line
2. Click **"Change Log"** > **"Line Changes"**
3. Page opens showing only changes to that line

**Log Entry Details:**

| Column | Description |
|--------|-------------|
| **Entry No.** | Unique log entry ID |
| **Worksheet Entry No.** | Which line was changed |
| **User ID** | Who made the change |
| **Change** | Type: Quantity Change, Date Change, etc. |
| **Item Description** | Which item |
| **Old Value** | Before change |
| **New Value** | After change |
| **Change Applied** | ☑ = Already applied to PO<br>☐ = Pending |

### Collaborative Workflow

**Scenario:** Multiple buyers share responsibility for vendors/items.

**Best Practices:**

1. **Coordinate worksheet sessions:**
   - Decide who handles which vendors/items
   - Use separate user IDs (each has own worksheet)
   - Communicate before "Apply All"

2. **Use change logs to track:**
   - What your colleague changed
   - What you need to review
   - What has been applied vs. pending

3. **Check for changes before applying:**
   - Click "Check for Changes on existing Purchase Lines"
   - Review any external modifications
   - Refresh data if needed

4. **Communicate on shared orders:**
   - If multiple buyers work on same PO: Coordinate
   - Use comments in purchase orders
   - Alert team when you apply bulk changes

5. **Clear worksheet when done:**
   - Don't leave pending changes overnight
   - Either Apply All or Clear Page
   - Start fresh each session

### Unapplied Changes

**What are unapplied changes?**

Changes marked as "Line Modified = true" but not yet applied to purchase orders.

**How to identify:**
- Orange/yellow background on lines
- "Line Modified" column = ☑
- Change log shows "Change Applied" = ☐

**When to keep unapplied changes:**
- Multi-day planning sessions
- Waiting for vendor confirmation
- Coordinating with colleagues
- Building "what-if" scenarios

**When to clear unapplied changes:**
- Planning session complete
- Changes no longer relevant
- Someone else made external PO changes
- Starting fresh analysis

**To clear specific unapplied changes:**
1. Select the line
2. Reset **Purch. Line Quantity New** to match **Purch. Line Quantity**
3. Or use "Refresh Data" to reload from PO

**To clear all unapplied changes:**
1. Click "Clear Page"
2. Confirm deletion
3. All unapplied changes are lost

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: "Please clear the page first" Error

**Symptom:** When clicking "Get Data", error message appears.

**Cause:** Worksheet already has data. System requires empty worksheet to load fresh data.

**Solution:**
1. Click **"Clear Page"**
2. Confirm deletion
3. Click **"Get Data"** again

---

#### Issue: Data Takes Too Long to Load

**Symptom:** "Get Data" runs for several minutes or times out.

**Cause:** Date range too large, too many items, or system performance.

**Solution:**
1. **Reduce date range:**
   - Try 4-6 weeks instead of 12 weeks
2. **Filter items more narrowly:**
   - Use `%my` or specific item list instead of all items
3. **Filter vendors:**
   - Limit to specific vendors
4. **Try smaller batches:**
   - Load one season at a time
   - Load one vendor at a time

---

#### Issue: Negative Availability Everywhere

**Symptom:** Most lines show red negative numbers in "Qty. Available" column.

**Cause:** 
- Inventory levels are low
- Large sales demand
- Not enough purchase orders
- Calculation date range issue

**Solution:**
1. **Verify inventory:** Check if physical inventory is actually low
2. **Review demand:** Drill down on Demand Qty. - are sales orders real?
3. **Check existing POs:** Are they before or after demand dates?
4. **Adjust quantities:** Increase purchase quantities to cover demand
5. **Check date range:** Ensure Start Date isn't before inventory adjustment dates

---

#### Issue: Changes Not Applying

**Symptom:** Click "Apply All" but lines stay orange/modified.

**Cause:**
- Permission issues
- Purchase order is archived or closed
- Validation errors on PO
- Blanket order quantity exceeded

**Solution:**
1. **Check permissions:** Verify you can edit purchase orders
2. **Review error messages:** System may display specific errors
3. **Try "Apply selected":** Apply one line at a time to isolate problem
4. **Check PO status:**
   - Is it released? (Should auto-reopen, but may fail)
   - Is it posted? (Cannot change)
   - Is it archived? (Cannot change)
5. **Check blanket orders:** If linked, verify quantity available
6. **Refresh data** and try again

---

#### Issue: Purchase Order No. Not Populating After Apply

**Symptom:** Applied new purchase line, but PO No. still blank.

**Cause:**
- Apply failed silently
- Validation error prevented PO creation
- System performance issue

**Solution:**
1. **Check error messages:** Look for validation errors
2. **Check vendor:** Verify vendor exists and is not blocked
3. **Check item:** Verify item can be purchased
4. **Re-apply:** Try "Apply selected" on just that line
5. **Manual create:** If worksheet fails, create PO manually and refresh worksheet

---

#### Issue: Cart Quantities Seem Wrong

**Symptom:** Cart Quantity Line or Cart Total Purch. Order shows unexpected values.

**Cause:**
- Item packaging changed
- Unit of measure issue
- Cart calculation setup incorrect

**Solution:**
1. **Check item card:** Verify "Qty. per Cart" or packaging fields
2. **Verify UOM:** Ensure purchase unit of measure is correct
3. **Check calculation logic:** Contact administrator if consistently wrong
4. **Use as guidance:** Cart quantities are informational; verify with warehouse

---

#### Issue: Dates Won't Change

**Symptom:** Change Requested Receipt Date, but it reverts or errors.

**Cause:**
- Quantity already received on PO line
- Date validation rules (weekends, holidays)
- Purchase order is posted

**Solution:**
1. **Check "Quantity Received":** If > 0, line may be locked
2. **Use valid date:** Avoid weekends/holidays
3. **Check PO status:** Cannot change posted POs
4. **Split line:** If partial receipt, create new line for remaining qty

---

#### Issue: Worksheet Closes and Loses Data

**Symptom:** Close worksheet page, reopen, and data is gone.

**Cause:** You chose "No" when asked "Do you want to keep this sheet for later use?"

**Solution:**
1. **When closing:** Choose **"Yes"** to keep worksheet
2. **Data persists** until you clear page or apply changes
3. **If lost:** Recreate worksheet with "Get Data"

---

#### Issue: Simulation Availability Doesn't Update

**Symptom:** Change Purch. Line Quantity New, but Cum. Avail. (simulated) doesn't recalculate.

**Cause:**
- Calculation error
- Page needs refresh
- Validation logic issue

**Solution:**
1. **Press F5** to refresh page
2. **Click in another field** to trigger recalculation
3. **Check formula:** Simulated = Cum. Avail. + Purch. Line Quantity Adj.
4. **Report bug** if consistently wrong

---

## Best Practices

### Planning Best Practices

1. **Plan regularly:**
   - Daily review for short-term (1-2 weeks)
   - Weekly review for medium-term (4-6 weeks)
   - Monthly review for seasonal (12+ weeks)

2. **Use appropriate date ranges:**
   - Don't load more data than needed
   - Focus on actionable timeframes
   - Extend range for seasonal planning

3. **Filter strategically:**
   - Use `%my` for routine daily work
   - Use seasonal filters for bulk planning
   - Use vendor filters for vendor-specific reviews

4. **Review before applying:**
   - Check simulated availability
   - Verify cart totals
   - Review all orange lines
   - Confirm dates are achievable

5. **Coordinate with vendors:**
   - Confirm delivery dates before applying
   - Check lead times
   - Verify minimum order quantities
   - Communicate changes promptly

### Data Quality Best Practices

1. **Keep item data current:**
   - Assign default vendors to items
   - Maintain purchase unit of measure
   - Update packaging/cart quantities
   - Set correct lead times

2. **Maintain vendor data:**
   - Accurate lead time formulas
   - Current pricing
   - Blocked status when appropriate
   - Purchaser code assignments

3. **Clean up old data:**
   - Archive old POs
   - Close completed blanket orders
   - Remove test/obsolete items
   - Maintain accurate inventory counts

### Collaboration Best Practices

1. **Communicate with team:**
   - Alert others before bulk changes
   - Coordinate on shared vendors
   - Share insights from demand analysis
   - Use change logs to track activity

2. **Apply changes promptly:**
   - Don't leave pending changes overnight
   - Apply before end of day
   - Clear worksheet if planning incomplete

3. **Check for external changes:**
   - Run "Check for Changes" before Apply All
   - Refresh data if working collaboratively
   - Review change logs periodically

4. **Document decisions:**
   - Add notes to POs after creating
   - Communicate with sales on shortages
   - Track vendor performance issues

### Performance Best Practices

1. **Optimize data loads:**
   - Use needed date range only
   - Filter items and vendors
   - Close other users' inactive sessions
   - Run during off-peak hours for large loads

2. **Batch operations:**
   - Group quantity changes before applying
   - Group date changes before applying
   - Use "Apply All" vs. repeated "Apply selected"

3. **Refresh strategically:**
   - Refresh only when needed
   - Don't refresh repeatedly in short time
   - Clear and reload for major data changes

---

## Quick Reference

### Button Quick Guide

| Button | Action | When to Use |
|--------|--------|-------------|
| **Get Data** | Load worksheet from POs and demand | Start new planning session |
| **Clear Page** | Delete all lines and filters | Start fresh or remove old data |
| **Apply selected** | Apply changes for selected lines only | Apply specific changes |
| **Apply all** | Apply all pending changes | Commit all planning to POs |
| **Refresh** / **Update Supply** | Reload data without clearing | Check for external changes |
| **New Purchase Line** | Create purchase line from demand | Cover unfulfilled demand |
| **Copy Purch. Order** | Copy PO to new date | Template/recurring orders |
| **Change Vendor or Purchase Order** | Move line to different vendor/PO | Vendor substitution, consolidation |
| **Set Required Dates** | Batch update dates | Coordinate deliveries |
| **Check for Changes** | Detect external PO modifications | Before apply in collaboration |
| **Filter on unavailable Items** | Show negative availability only | Find shortages |
| **Filter on Supply Lines** | Show lines with PO or changes | Focus on orders |
| **Reset Filter & Sorting** | Return to default view | Clear custom filters |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **F5** | Refresh page |
| **F6** | Assist Edit (item/vendor filter) |
| **Ctrl+Click** | Select multiple lines |
| **Shift+Click** | Select range of lines |
| **Enter** | Confirm field change |
| **Esc** | Cancel dialog |
| **Ctrl+F** | Find in grid |

### Filter Syntax Quick Reference

| Syntax | Result |
|--------|--------|
| `%my` | Items or vendors assigned to you |
| `%Spring` | All spring season items |
| `%Summer` | All summer season items |
| `ITEM001` | Single item |
| `ITEM001\|ITEM002` | Multiple specific items |
| *(blank)* | All (no filter) |

### Column Color Coding

| Color | Meaning |
|-------|---------|
| **White background** | No pending changes |
| **Orange/Yellow background** | Line modified (pending apply) |
| **Red text (Qty. Available)** | Negative availability (shortage) |
| **Red text (Demand Qty.)** | High demand value  |
| **Red style (Cart Total)** | Over 40 carts (transportation warning) |

### Status Indicators

| Indicator | Meaning |
|-----------|---------|
| **Purchase Order No. populated** | Existing PO line |
| **Purchase Order No. blank** | Demand-only or new line |
| **Line Modified = ☑** | Changes pending apply |
| **Line Modified = ☐** | No changes or applied |
| **Purchase Line changed = ☑** | External modification detected |

### Common Calculations

**Qty. Available:**
```
= Current Inventory 
  + All Receipts up to this date 
  - All Sales Demand up to this date
  + Purch. Line Quantity New
```

**Cum. Availability:**
```
= Running total of Qty. Available across all dates
```

**Cum. Avail. (simulated):**
```
= Cum. Availability + Purch. Line Quantity Adj.
```

**Cart Quantity Line:**
```
= Purch. Line Quantity New / Qty. per Cart (from Item card)
```

### Typical Values and Thresholds

| Metric | Typical Value | Threshold |
|--------|---------------|-----------|
| **Planning Horizon** | 4-6 weeks | > 12 weeks = slow load |
| **Date Range for Data Load** | 30-45 days | > 90 days = performance issue |
| **Cart Total per PO** | 15-30 carts | > 40 carts = split shipment |
| **Negative Availability** | < 10% of lines | > 25% = major shortage issue |
| **Daily Planning Time** | 30-45 minutes | > 2 hours = too much data |

---

## SOP document

The full SOP for this process is available on SharePoint:  
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/purchase-worksheet-user-guide.pdf)

---

## Related Resources

- [Broker Workspace - Staff Guide](broker-workspace/broker-workspace-staff-guide.md) - Detailed operational guide
- [Purchase Receipt Process](purchase-receipt-process.md) - Receiving purchased goods
- [Availability Troubleshooting Guide](../availability/availability-troubleshooting-guide.md) - Resolving inventory availability issues

---

**Document Control**  
*Prepared for: Clesen Wholesale*  
*Classification: Internal Use*  
*Review Frequency: Quarterly*
