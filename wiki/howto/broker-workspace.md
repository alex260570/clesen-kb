---
title: Broker Workspace - Purchase Planning Guide
type: howto
tags: [purchasing, procurement, broker-workspace, planning]
created: 2026-04-21
updated: 2026-04-21
sources: [broker-workspace-staff-guide.md]
---

# Broker Workspace - Purchase Planning Guide

Central planning tool for purchase order management. Plan inventory purchases, model scenarios, and apply changes to live purchase orders.

## What is the Broker Workspace?

The Broker Workspace is your central command center for purchase planning. Instead of working directly with purchase orders, work with a planning sheet that lets you:

- See all item demand from sales orders
- View existing purchase orders
- Calculate projected inventory levels
- Plan new purchases or adjust existing ones
- Model "what-if" scenarios before applying changes
- Apply all changes at once to actual purchase orders

**Think of it as:** A smart worksheet connected to live purchase and sales data, with the ability to push changes back to actual orders.

## Key Benefits

- **Demand-Driven Planning** — See exactly what customers need and when
- **Availability Forecasting** — Know projected inventory levels
- **Bulk Changes** — Adjust multiple orders at once
- **Safe Planning** — Test changes without affecting real orders
- **Transportation Planning** — See cart quantities for shipment planning
- **Change Tracking** — Complete audit log of all modifications

## When to Use It

- Daily/weekly purchase planning reviews
- Responding to demand changes
- Adjusting delivery schedules
- Planning seasonal purchases
- Reviewing forecast vs. actual orders
- Coordinating with vendors on delivery dates

## Getting Started

### Accessing the Workspace

**Navigation:**
1. Open Business Central
2. Search for "Broker Workspace" or "Purchase Worksheet"
3. Click to open page 50086

**First Time Setup:**

The workspace is user-specific. Your User Profile Must Have:
- Purchaser Code assigned in User Setup
- Permission to create/edit purchase orders
- Access to items and vendors

### Understanding User-Specific Filtering

The system automatically filters data to:
- Your assigned vendors (via Purchaser Code)
- Your assigned items (via Purchasing Code)
- Your previous session filters (persists between sessions)

## Page Layout

### Header Section (Top)

| Field | Purpose | Example |
|-------|---------|---------|
| **Start Date** | Beginning of planning window | 02/13/2026 |
| **End Date** | End of planning window | 03/15/2026 |
| **Item No. Filter** | Limit to specific items | `%Spring` or `ITEM001\|ITEM002` |
| **Vendor No. Filter** | Limit to specific vendors | `%my` or `V-001\|V-002` |
| **Brokered Items only** | Checkbox: Only show purchase items | ☑ |
| **User ID** | Your user (read-only) | BUYER01 |
| **Current Filter** | Active filter mode | Supply Only |

**Forecast Section:**

| Field | Purpose |
|-------|---------|
| **Forecast** | Production forecast to compare against |
| **Include Purchases from** | Start date for forecast balance calculation |
| **Include Purchases to** | End date for forecast balance calculation |

### Lines Grid

Each row represents either:
- **Supply Line** — An existing purchase order line
- **Demand Line** — Required purchases with no order yet

**Key Columns:**

| Column | Description | Editable |
|--------|-------------|----------|
| **Purchase Order No.** | Linked PO (blank if new) | No |
| **Vendor No./Name** | Vendor code and name | No |
| **Item Description** | Item name | No |
| **Requested Receipt Date** | Delivery request date | **Yes** |
| **Exp. Receipt Date** | Calculated arrival date | No |
| **Purch. Line Quantity** | Current PO quantity | No |
| **Purch. Line Quantity New** | Your planned quantity | **Yes** |
| **Purch. Line Quantity Adj.** | Change amount | No |
| **Demand Qty.** | Sales orders need | No |
| **Qty. Available** | Projected inventory | No |
| **Cum. Availability** | Running total inventory | No |
| **Cum. Avail. (simulated)** | With your changes | No |
| **Cart Quantity Line** | Carts for this line | No |
| **Cart Total Purch. Order** | Total carts for PO | No |

**Color Coding:**

- **White background** — No changes made
- **Yellow/Orange background** — Line has been modified (pending apply)
- **Red text (Qty. Available)** — Negative availability (shortage)
- **Red style (Cart Total)** — Exceeds 40 carts (transportation warning)

## Daily Workflow

### Standard Morning Planning Routine

#### Step 1: Clear Previous Session (if needed)

If you have old data from yesterday:

1. Click **"Clear Page"** button
2. Confirm "Yes" to delete all lines
3. All filters and changes are wiped clean

#### Step 2: Set Your Filters

**Date Range:**
- Start Date: Today's date
- End Date: 4-6 weeks out (typical planning horizon)

**Item Filter Options:**

| Filter | Result |
|--------|--------|
| `%my` | All items assigned to you |
| `%Spring` | All spring season items |
| `%Summer` | All summer season items |
| `Item001\|Item002` | Specific items |
| (blank) | All items in vendor filter |

**To select multiple items:**
1. Click the **...** button next to Item No. Filter
2. Use Assist Edit (F6)
3. Select items from list
4. Click OK — filter builds automatically

**Vendor Filter Options:**

| Filter | Result |
|--------|--------|
| `%my` | All vendors assigned to you |
| `V-001\|V-002` | Specific vendors |
| (blank) | All vendors |

**Brokered Items Only:**
- ☑ Checked = Only Purchase replenishment items
- ☐ Unchecked = All inventory items

#### Step 3: Get Data

1. Click **"Get Data"** button
2. Wait for calculation (may take 30-60 seconds for large date ranges)
3. Progress window shows item calculation progress

**What happens:**
- System scans all purchase orders in date range
- Calculates sales demand per item per day
- Calculates projected availability
- Creates worksheet lines
- Populates forecast data (if selected)

#### Step 4: Review and Plan

Now you have a complete picture:

**Look for:**
- **Negative Qty. Available** (red numbers) — Items you'll run out of
- **High Demand Qty.** without orders — Items you need to buy
- **Existing orders** that may need adjustment
- **Cart totals > 40** — May need to split shipments

## Planning Your Purchases

### Understanding Availability Calculations

**Qty. Available:**
- Inventory you'll have on that specific date
- Calculated as: Current Inventory + Receipts - Sales Demand
- Updates daily as you move forward in time

**Cum. Availability (Cumulative):**
- Running total for this item
- Shows impact of all transactions up to this date
- Helps spot inventory shortages

**Cum. Avail. (simulated):**
- What availability will be WITH your planned changes
- Updates automatically as you modify quantities
- Lets you see impact before applying

### Reading Demand

**Demand Qty. Column:**
- Shows total sales order quantity for this item on this date
- Click the number to drill down to actual sales lines
- Blank = No sales demand

**Use Cases:**
- Verify demand is real (not test orders)
- Check customer names
- See ship-to locations
- Identify blanket order releases

### Using Filters Effectively

**Current Filter Dropdown:**

1. **Blank (Show All)** — All lines (demand + supply)
2. **Supply Only** — Only lines with purchase orders or quantity changes
3. **Unavailable Items** — Only items with negative availability

**When to use each:**

- **Show All** — Initial review, seeing complete picture
- **Supply Only** — Focusing on what you're actually buying
- **Unavailable Items** — Finding problems, shortage planning

**Tip:** Switch between filters to focus your work, then reset when done.

### Forecast Comparison

If your company uses production forecasts:

1. Select **Forecast** name from dropdown
2. Set **Include Purchases from/to** dates (optional)
3. System populates:
   - **Season Forecast Qty.** — Total forecasted
   - **Season Forcast Balance** — Difference between forecast and orders

**Positive Balance:** You've ordered less than forecast (may need to order more)  
**Negative Balance:** You've ordered more than forecast (may want to reduce)

## Making Changes

### Changing Quantities

**To increase or decrease order quantity:**

1. Find the line to adjust
2. Click in **Purch. Line Quantity New** cell
3. Type new quantity
4. Press Enter

**What happens:**
- **Purch. Line Quantity Adj.** updates (shows +/- change)
- **Line Modified** flag sets to true (marks for applying)
- **Cum. Avail. (simulated)** recalculates for this and all future dates
- **Cart Quantity Line** recalculates
- **Cart Total Purch. Order** updates for entire PO
- System creates change log entry

**Business Rules:**
- Cannot set negative quantity
- For demand-only lines: Must assign vendor first
- Existing PO lines: Can change to zero (line will be deleted on apply)

**Tips:**
- Make all quantity changes before applying
- Use simulated availability to verify your plan
- Watch cart totals — over 40 carts may require split shipments

### Changing Dates

**To move an order to different delivery date:**

1. Find the line to adjust
2. Click in **Requested Receipt Date** cell
3. Select new date from calendar
4. Press Enter

**What happens:**
- **Exp. Receipt Date** auto-calculates (Requested Date - Inbound Handling Time)
- System checks if date changed on existing PO
- If other lines on same PO: Prompts "Adjust other lines too?"
- **Line Modified** flag sets
- Demand and availability recalculate for new date
- System creates change log entry

**Business Rules:**
- Date must respect business calendar (skips holidays)
- All lines on same PO typically share same Requested Receipt Date
- Changing date may merge/split lines if demand exists on target date

**Tips:**
- Group related date changes together
- Check if vendor can accommodate new date
- Watch for negative availability after date shifts

### Creating New Purchase Lines

**When you have demand but no order:**

1. Select the demand line (has Demand Qty. but no Purchase Order No.)
2. Click **"New Purchase Line"** button (or right-click line > New Purchase Line)
3. Dialog opens with pre-filled data:
   - Item: Pre-populated
   - Vendor: Select from list (or defaults to item's vendor)
   - Quantity: Enter amount to order
   - Requested Receipt Date: Set delivery date
   - Inbound Time: Auto-filled from location
   - Expected Receipt Date: Auto-calculated
   - Global Dimension 2 Code: Department code

4. Review calculated dates
5. Click **OK**

**Result:**
- New worksheet line created
- Marked as modified (no PO yet)
- When applied: Creates new purchase order
- Original demand line merges if quantities match

**Tips:**
- Order enough to cover demand plus safety stock
- Check vendor lead times before setting date
- Multiple demand lines? Create one PO with multiple items

## Applying Changes

### Understanding "Apply"

**Important:** Changes in the worksheet don't affect real purchase orders until you **Apply** them.

**Apply Process:**
1. Reviews all lines marked "Line Modified = true"
2. Determines what changed (qty, date, vendor, PO)
3. Executes appropriate action on actual purchase documents
4. Updates worksheet with new PO numbers/line numbers
5. Marks change log entries as applied
6. Removes "Line Modified" flags

### Apply Selected Lines

**Use when:** You want to apply only certain changes

**Steps:**
1. Select line(s) to apply (click checkbox or Ctrl+Click multiple)
2. Click **"Apply selected"** button
3. System processes selected lines
4. Message shows count: "X Changes applied"

**What gets applied:**
- Only lines you selected
- Only if marked as modified
- In order they appear in grid

### Apply All Changes

**Use when:** You're ready to commit all pending changes

**Steps:**
1. Review all modified lines (orange background)
2. Click **"Apply all"** button
3. System processes ALL modified lines
4. Message shows count: "X Changes applied"

**Warning:** Cannot undo after applying. All changes go to live purchase orders.

### What Happens During Apply

**For New Orders:**
1. System checks for existing PO with same vendor, date, dimension
2. If found: Adds line to existing PO
3. If not found: Creates new PO header
4. Creates purchase line with your quantity
5. Links blanket orders if applicable
6. Updates worksheet with new PO number

**For Quantity Changes:**
1. Opens existing PO line
2. Changes Quantity field
3. Recalculates amounts, VAT, totals
4. If quantity = 0 and nothing received: Deletes line

**For Date Changes:**
1. Opens PO header
2. Changes Requested Receipt Date
3. Changes Expected Receipt Date
4. Asks if you want to update all lines on PO

**For Released POs:**
- System automatically reopens
- Makes changes
- Re-releases
- You may see "Reopening..." messages

### After Applying

**Verify Success:**
1. Modified lines turn back to white background
2. "Line Modified" flags clear
3. PO numbers populate for new orders
4. Cart totals finalize

**Check Purchase Orders:**
1. Open the purchase orders (click PO number)
2. Verify quantities correct
3. Verify dates correct
4. Print and send to vendors

## Advanced Features

### Changing Vendor or Purchase Order

**Use when:** You need to move a line to different vendor or different PO

**Steps:**
1. Select the line to move
2. Click **"Change Vendor or Purchase Order"** button
3. Dialog opens showing:
   - Current vendor
   - Expected Receipt Date
   - List of existing POs for selected vendor
   - "Make new Order" checkbox

**Option 1: Move to Existing PO**
1. Leave "Make new Order" unchecked
2. Select target PO from list
3. Click OK
4. System moves line to target PO

**Option 2: Move to New Vendor**
1. Select new vendor from dropdown
2. Check "Make new Order"
3. Click OK
4. System creates new PO with selected vendor
5. Moves line to new PO

## Troubleshooting

### Lines Not Showing in Worksheet

**Cause:** Filters may be too restrictive or worksheet is empty

**Solutions:**
1. Clear filters to see all data
2. Check if item is marked as "Brokered Item" (if checked)
3. Verify vendor has active items
4. Run "Get Data" again

### Availability Calculations Look Wrong

**Cause:** May need to refresh calculations

**Solutions:**
1. Close and reopen the workspace
2. Run "Get Data" again
3. Check if all source data is current
4. Verify item/vendor filters are correct

### Cannot Apply Changes

**Cause:** PO may have been modified externally or validation issue

**Solutions:**
1. Review error message
2. Check if PO numbers are still valid
3. Verify purchase order still exists and isn't deleted
4. Refresh data and try again

## Best Practices

### Planning Discipline

✅ **Do:**
- Review demand carefully before ordering
- Compare forecasts to actual orders
- Monitor cart quantities for transportation planning
- Apply changes regularly (don't let pending pile up)
- Verify orders with vendor before applying

❌ **Don't:**
- Order without checking availability
- Make large quantity changes without review
- Let changes sit pending for days
- Ignore red warnings (negative availability, high cart counts)

### Change Management

✅ **Do:**
- Make all changes before applying
- Review simulated availability before applying
- Apply in batches by vendor or date
- Verify PO details after applying
- Document large changes (add notes to PO)

❌ **Don't:**
- Apply partial changes then modify same PO again
- Make changes after worksheet is applied
- Ignore vendor date constraints
- Create overly large orders without splitting

### Vendor Coordination

✅ **Do:**
- Verify vendor can meet requested dates
- Consolidate small orders into larger shipments
- Respect vendor minimum order quantities
- Communicate changes to vendor promptly
- Track vendor performance on delivery

❌ **Don't:**
- Make aggressive date changes without vendor approval
- Change vendors without business reason
- Create orders vendor can't fulfill
- Ignore vendor feedback on feasibility

## Related Pages

- [[broker-workspace-manager]] — Manager oversight and monitoring
- [[broker-workspace-troubleshooting]] — IT troubleshooting guide
