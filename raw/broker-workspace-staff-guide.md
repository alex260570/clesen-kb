# Broker Workspace - Staff User Guide

**Version:** 1.0  
**Last Updated:** February 13, 2026  
**Audience:** Buyers, Purchasing Agents, Brokers  

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Understanding the Workspace](#understanding-the-workspace)
4. [Daily Workflow](#daily-workflow)
5. [Planning Your Purchases](#planning-your-purchases)
6. [Making Changes](#making-changes)
7. [Applying Changes](#applying-changes)
8. [Advanced Features](#advanced-features)
9. [Common Scenarios](#common-scenarios)
10. [Troubleshooting](#troubleshooting)
11. [Quick Reference](#quick-reference)

---

## Overview

### What is the Broker Workspace?

The Broker Workspace is your central command center for purchase planning and order management. Instead of working directly with purchase orders, you work with a planning sheet that lets you:

- See all your items' demand from sales orders
- View existing purchase orders
- Calculate how much inventory you'll have on each date
- Plan new purchases or adjust existing ones
- Model "what-if" scenarios before committing changes
- Apply all changes at once to actual purchase orders

**Think of it as:** A smart Excel sheet connected to your live purchase and sales data, with the ability to push changes back to actual orders.

### Key Benefits

- **Demand-Driven Planning** - See exactly what customers need and when
- **Availability Forecasting** - Know your projected inventory levels
- **Bulk Changes** - Adjust multiple orders at once
- **Safe Planning** - Test changes without affecting real orders
- **Transportation Planning** - See cart quantities for shipment planning
- **Change Tracking** - Complete audit log of all modifications

### When to Use It

- Daily/weekly purchase planning reviews
- Responding to demand changes
- Adjusting delivery schedules
- Planning seasonal purchases
- Reviewing forecast vs. actual orders
- Coordinating with vendors on delivery dates

---

## Getting Started

### Accessing the Broker Workspace

**Navigation:**
1. Open Business Central
2. Search for "Broker Workspace" (or "Purchase Worksheet")
3. Click to open page 50086

**Shortcut:** Bookmark the page for quick access

### First Time Setup

The workspace is user-specific - each buyer has their own workspace that persists between sessions.

**Your User Profile Must Have:**
- Purchaser Code assigned in User Setup
- Permission to create/edit purchase orders
- Access to items and vendors

### Understanding User-Specific Filtering

The system automatically filters data to:
- Your assigned vendors (via Purchaser Code)
- Your assigned items (via Purchasing Code)
- Your previous session filters (if you kept the sheet)

---

## Understanding the Workspace

### Page Layout

#### Header Section (Top)

| Field | Purpose | Example |
|-------|---------|---------|
| **Start Date** | Beginning of planning window | 02/13/2026 |
| **End Date** | End of planning window | 03/15/2026 |
| **Item No. Filter** | Limit to specific items | `%Spring` or `ITEM001|ITEM002` |
| **Vendor No. Filter** | Limit to specific vendors | `%my` or `V-001|V-002` |
| **Brokered Items only** | Checkbox: Only show purchase items | ☑ |
| **User ID** | Your user (read-only) | BUYER01 |
| **Current Filter** | Active filter mode | Supply Only |

**Forecast Section:**

| Field | Purpose |
|-------|---------|
| **Forecast** | Production forecast to compare against |
| **Include Purchases from** | Start date for forecast balance calculation |
| **Include Purchases to** | End date for forecast balance calculation |

#### Lines Section (Grid)

Each row represents either:
- **Supply Line** - An existing purchase order line
- **Demand Line** - Required purchases with no order yet

**Key Columns:**

| Column | Description | Example | Editable |
|--------|-------------|---------|----------|
| **Purchase Order No.** | Linked PO (blank if new) | PO-001234 | No |
| **Vendor No.** | Vendor code | V-12345 | No |
| **Vendor Name** | Vendor name | ABC Growers | No |
| **Item Description** | Item name | Red Geranium 4" | No |
| **Requested Receipt Date** | Delivery request date | 02/20/2026 | **Yes** |
| **Inbound Warehouse Time** | Processing days | 1D | No |
| **Exp. Receipt Date** | Calculated arrival date | 02/19/2026 | No |
| **Purch. Line Quantity** | Current PO quantity | 100 | No |
| **Purch. Line Quantity New** | Your planned quantity | 150 | **Yes** |
| **Purch. Line Quantity Adj.** | Change amount | +50 | No |
| **Demand Qty.** | Sales orders need | 120 | No |
| **Qty. Available** | Projected inventory | -20 | No |
| **Cum. Availability** | Running total inventory | 30 | No |
| **Cum. Avail. (simulated)** | With your changes | 80 | No |
| **Cart Quantity Line** | Carts for this line | 2.5 | No |
| **Cart Total Purch. Order** | Total carts for PO | 15 | No |
| **Global Dimension 2 Code** | Department/location | NURSERY | No |
| **Season Forecast Qty.** | Forecast amount | 200 | No |
| **Season Forcast Balance** | Forecast vs. orders | +50 | No |

**Color Coding:**

- **White background** - No changes made
- **Yellow/Orange background** - Line has been modified (pending apply)
- **Red text (Qty. Available)** - Negative availability (shortage)
- **Red style (Cart Total)** - Exceeds 40 carts (transportation warning)

---

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
| `Item001|Item002` | Specific items |
| (blank) | All items in vendor filter |

**To select multiple items:**
1. Click the **...** button next to Item No. Filter
2. Use Assist Edit (F6)
3. Select items from list
4. Click OK - filter builds automatically

**Vendor Filter Options:**

| Filter | Result |
|--------|--------|
| `%my` | All vendors assigned to you |
| `V-001|V-002` | Specific vendors |
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
- **Negative Qty. Available** (red numbers) - Items you'll run out of
- **High Demand Qty.** without orders - Items you need to buy
- **Existing orders** that may need adjustment
- **Cart totals > 40** - May need to split shipments

---

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

**Example:**

| Date | Demand | Purch Qty | Qty Available | Cum. Avail. | Your Change | Simulated |
|------|--------|-----------|---------------|-------------|-------------|-----------|
| 2/15 | 50 | 100 | 30 | 80 | +50 | 130 |
| 2/20 | 30 | 0 | 80 | 50 | 0 | 100 |
| 2/25 | 40 | 50 | 50 | 60 | 0 | 110 |

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

1. **Blank (Show All)** - All lines (demand + supply)
2. **Supply Only** - Only lines with purchase orders or quantity changes
3. **Unavailable Items** - Only items with negative availability

**When to use each:**

- **Show All** - Initial review, seeing complete picture
- **Supply Only** - Focusing on what you're actually buying
- **Unavailable Items** - Finding problems, shortage planning

**Tip:** Switch between filters to focus your work, then reset when done.

### Forecast Comparison

If your company uses production forecasts:

1. Select **Forecast** name from dropdown
2. Set **Include Purchases from/to** dates (optional)
3. System populates:
   - **Season Forecast Qty.** - Total forecasted
   - **Season Forcast Balance** - Difference between forecast and orders

**Positive Balance:** You've ordered less than forecast (may need to order more)  
**Negative Balance:** You've ordered more than forecast (may want to reduce)

---

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
- For demand-only lines: Must assign vendor first (see "New Purchase Line")
- Existing PO lines: Can change to zero (line will be deleted on apply)

**Tips:**
- Make all quantity changes before applying
- Use simulated availability to verify your plan
- Watch cart totals - over 40 carts may require split shipments

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

---

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

**Types of Changes Applied:**

| What Changed | System Action |
|--------------|---------------|
| Quantity only | Updates purchase line quantity |
| Date only | Updates PO header dates |
| Quantity + Date | Updates both |
| Vendor changed | Moves line to different vendor PO |
| PO number changed | Moves line to different PO |
| New line (no original PO) | Creates new PO header and line |

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

**For Move Line (Vendor/PO change):**
1. Creates new line on target PO
2. Copies all details (quantity, unit cost, blanket ref)
3. Deletes original line (if nothing received)
4. Updates blanket order quantities

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

---

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
3. System shows PO details (date, cart qty)
4. If date different: Confirms you want different date
5. Click OK
6. Line moves to selected PO (on apply)

**Option 2: Create New PO**
1. Check "Make new Order"
2. Change vendor if needed
3. Click OK
4. New PO will be created (on apply)
5. Line moves to new PO

**What happens on apply:**
- Creates new purchase line on target PO
- Copies quantity, unit cost, blanket reference
- Deletes original line (if not received)
- Updates worksheet

**Use cases:**
- Vendor can't deliver, move to alternate
- Consolidate multiple small POs
- Split large PO into multiple deliveries
- Change buyer assignment

### Copy Purchase Order

**Use when:** You want to duplicate a PO to a different date

**Example:** Spring PO that needs to repeat for summer season

**Steps:**
1. Select a line from the PO you want to copy
2. Click **"Copy Purch. Order"** button
3. System finds all lines on that PO
4. Dialog opens showing all items
5. Grid displays:
   - Item descriptions
   - Current quantities
   - Qty. to Move (editable)
   - Cart quantities

6. **For each line:**
   - Leave as-is: Stays on original PO
   - Set "Qty. to Move": Moves to new date
   - You can move full or partial quantities

7. **Set new date:**
   - Top of dialog: Requested Receipt Date
   - Inbound Warehouse Time
   - Exp. Receipt Date
   - All lines will use this date

8. **Watch cart total:**
   - Shows in red if > 40 carts
   - May need to adjust quantities

9. Click **OK**

**What happens:**
- Original PO quantities reduce by "Qty. to Move"
- New worksheet lines created for moved quantities
- New date assigned
- Same vendor, dimension, blanket orders preserved
- On apply: Creates new PO or adds to existing

**Tips:**
- Don't move received items (system prevents)
- Cart total warns if shipment too large
- Can merge with existing PO if dates match

### Update Demand

**Use when:** Sales orders changed since you loaded worksheet

**Steps:**
1. Click **"Update Demand"** button
2. System rescans sales orders
3. Updates "Demand Qty." for all lines
4. Creates new demand lines if needed
5. Removes demand lines if sales orders cancelled

**Use cases:**
- Sales team added new orders
- Customer cancelled orders
- Blanket orders released
- During your planning session (orders changing)

**Tip:** Run this before applying changes to ensure you're working with current demand.

### Update Supply

**Use when:** Purchase orders changed outside the worksheet

**Steps:**
1. Click **"Update Supply"** button
2. System rescans purchase orders
3. Updates existing supply lines
4. Adds new supply lines if POs created elsewhere
5. Removes lines if POs deleted

**Use cases:**
- Another buyer created POs
- Manager adjusted PO manually
- External system integrated
- Receiving posted (quantities changed)

**Tip:** Run daily if multiple buyers work on same items.

### Check for Changes on Existing Purchase Lines

**Use when:** Verifying POs haven't been modified externally

**Steps:**
1. Click **"Check for Changes on existing Purchase Lines"**
2. System compares worksheet to actual PO lines
3. Uses hash comparison (Item + Qty + Received + Date)
4. Flags lines that don't match
5. Message: "X Purchase Lines were changed after they were pulled"

**If lines changed:**
- "Purchase Line changed" column shows checkmark
- You should run Update Supply to refresh
- Or manually review the PO

**Use cases:**
- Before applying (ensure data fresh)
- After Update Demand (check if supply also changed)
- Weekly audit to find discrepancies

---

## Common Scenarios

### Scenario 1: Daily Shortage Review

**Goal:** Find and order items that will run out

**Steps:**
1. Set dates: Today to 30 days out
2. Item filter: `%my` (your items)
3. Vendor filter: (blank - all)
4. Check "Brokered Items only"
5. Click **Get Data**
6. Change **Current Filter** to "Unavailable Items"
7. Review items with negative Qty. Available
8. For each shortage:
   - Has PO? Increase Purch. Line Quantity New
   - No PO? Click "New Purchase Line"
9. **Apply All**
10. Print POs and email vendors

**Time:** 15-30 minutes

### Scenario 2: Responding to Rush Order

**Goal:** Customer needs 200 units next week, adjust existing orders

**Steps:**
1. Note item number and required date
2. Set Item Filter to that item
3. Click **Get Data**
4. Find line for that date
5. Review current Purch. Line Quantity
6. Calculate needed: Demand Qty. + Rush Qty. - Current Inventory
7. Update Purch. Line Quantity New
8. Check Cum. Avail. (simulated) turns positive
9. May need to adjust date earlier if vendor lead time
10. **Apply Selected**
11. Call vendor to confirm rush delivery

**Time:** 5-10 minutes

### Scenario 3: Vendor Can't Deliver - Switch to Alternate

**Goal:** Main vendor delayed, move orders to backup vendor

**Steps:**
1. Set Vendor Filter to problem vendor
2. Set dates to affected range
3. Click **Get Data**
4. Current Filter: "Supply Only"
5. Select first line
6. Click **"Change Vendor or Purchase Order"**
7. Change Vendor No. to alternate vendor
8. Check "Make new Order"
9. Click OK
10. Repeat for all affected lines
11. Review cart totals
12. **Apply All**
13. Email cancellation to original vendor
14. Email new POs to alternate vendor

**Time:** 20-40 minutes (depending on number of lines)

### Scenario 4: Planning Seasonal Buys Against Forecast

**Goal:** Order spring plants based on production forecast

**Steps:**
1. Set dates: Start of season (e.g., March) to peak (May)
2. Item Filter: `%Spring`
3. Vendor Filter: `%my`
4. Check "Brokered Items only"
5. Click **Get Data**
6. Set **Forecast** = "Spring 2026"
7. Set Include Purchases from/to = season dates
8. System populates Season Forecast columns
9. Review Season Forcast Balance:
   - Positive = Under-ordered, need to buy more
   - Negative = Over-ordered, may reduce
10. Adjust Purch. Line Quantity New to align with forecast
11. Create new lines for items not ordered
12. **Apply All**

**Time:** 1-2 hours (seasonal planning)

### Scenario 5: Consolidating Small Orders for Better Shipping

**Goal:** Combine 3 small POs into 1 large shipment

**Steps:**
1. Set Vendor Filter to vendor with small POs
2. Click **Get Data**
3. Current Filter: "Supply Only"
4. Review cart totals - note POs < 10 carts each
5. Select line from PO #1
6. Click **"Change Vendor or Purchase Order"**
7. Select PO #3 (largest one)
8. Click OK
9. Select line from PO #2
10. Click **"Change Vendor or Purchase Order"**
11. Select PO #3
12. Click OK
13. Review combined cart total
14. May need to change date to accommodate larger shipment
15. **Apply All**
16. Result: PO #1 and #2 deleted, PO #3 has all items

**Time:** 15-20 minutes

### Scenario 6: Copying Last Year's Orders

**Goal:** Spring 2025 orders worked well, repeat for 2026

**Steps:**
1. Manually create PO #1 for Spring 2026 (small test order)
2. Open Broker Workspace
3. Set dates to include Spring 2025 and 2026
4. Click **Get Data**
5. Filter to show 2025 orders
6. Select line from 2025 PO
7. Click **"Copy Purch. Order"**
8. Dialog shows all items from that PO
9. Set new date: Spring 2026
10. Set "Qty. to Move" for items you want to repeat
11. Review cart total
12. Click OK
13. New lines created for 2026 date
14. Adjust quantities as needed
15. **Apply All**
16. Result: Same items ordered for new season

**Time:** 30-45 minutes per PO copied

---

## Troubleshooting

### Common Issues

#### Issue: "Please clear the page first" Error

**Cause:** Trying to Get Data when worksheet already has lines

**Solution:**
1. Click **"Clear Page"**
2. Confirm deletion
3. Then click **"Get Data"**

**Prevention:** Always clear before loading new date range

---

#### Issue: "You cannot change this value on a Demand Line if the item does not have a vendor assigned"

**Cause:** Trying to set quantity on line without vendor

**Solution:**
1. Click **"New Purchase Line"** button
2. Select vendor from dropdown
3. Set quantity
4. Click OK
5. Now line has vendor and quantity

**Prevention:** Use "New Purchase Line" for demand-only lines

---

#### Issue: Changes Not Applying

**Symptoms:**
- Click Apply but nothing happens
- No message shown
- Lines still yellow

**Solution 1:** Lines not marked as modified
- Verify "Line Modified" shows checkmark
- Make a small change to trigger flag
- Save line (Tab or Enter)
- Try Apply again

**Solution 2:** Validation errors
- Check error messages (may flash quickly)
- Common errors:
  - Quantity too high (exceeds blanket)
  - Date in past
  - Vendor blocked
- Fix validation issue
- Apply again

**Solution 3:** Purchase order locked
- Another user editing same PO
- PO has posted receipts (can't delete)
- Ask manager to unlock

---

#### Issue: "The Purchase Line has changed after you retrieved it"

**Cause:** Someone else modified the PO since you loaded worksheet

**Solution:**
1. Click **"Update Supply"**
2. System refreshes data
3. Review changes
4. Re-plan your adjustments
5. **Apply** again

**Prevention:**
- Run "Check for Changes" before applying
- Coordinate with other buyers
- Apply changes promptly after planning

---

#### Issue: Negative Availability Persists After Ordering

**Symptoms:**
- Increased order quantity
- Applied changes
- Availability still negative

**Possible Causes:**

**Cause 1:** Date wrong
- Check Expected Receipt Date
- Must be BEFORE demand date
- Adjust Requested Receipt Date earlier
- Apply change

**Cause 2:** Not enough ordered
- Demand Qty. shows 100
- You ordered 50
- Still short 50 units
- Increase quantity further

**Cause 3:** Multiple demand dates
- Check if item has demand on multiple dates
- May need separate orders for each date
- Or one large order for earliest date

**Cause 4:** Already received inventory missing
- Physical inventory lower than system
- Contact warehouse team
- May need inventory adjustment

---

#### Issue: Cart Total Exceeds 40 (Red Warning)

**Cause:** Total shipment too large for standard delivery

**Solutions:**

**Option 1:** Split into multiple POs
1. Select some lines from large PO
2. Click **"Change Vendor or Purchase Order"**
3. Check "Make new Order"
4. Set different date
5. Click OK
6. Reduces original PO cart total
7. Creates second PO

**Option 2:** Reduce quantities
- Review each line
- Reduce non-critical items
- Order remainder later

**Option 3:** Coordinate with transportation
- May be able to send 2 trucks
- Special delivery arrangement
- Note in PO comments field

---

#### Issue: Can't Find Vendor in Change Vendor Dialog

**Cause:** Vendor not in system or blocked

**Solution:**
1. Cancel dialog
2. Search Vendors list
3. Verify vendor exists
4. Check "Blocked" field = blank
5. If blocked, ask manager to unblock
6. If doesn't exist, create vendor record
7. Retry change

---

#### Issue: Date Validation Fails

**Symptoms:**
- Can't set requested date
- Error: "Date must be working day"

**Cause:** Selected date is weekend or holiday

**Solution:**
1. Check company calendar
2. Select next working day
3. System will adjust automatically

**Prevention:**
- Use date picker (shows non-working days in different color)
- Know your vendor schedules (some don't deliver Mondays)

---

### Getting Help

**Level 1: Check This Guide**
- Review scenario matching your task
- Check troubleshooting section
- Try Update Demand/Supply

**Level 2: Ask Experienced Buyer**
- Another buyer can walk through
- May have seen your issue before
- Can check your worksheet

**Level 3: Contact Purchasing Manager**
- For policy questions
- For vendor issues
- For approval needed
- For complex scenarios

**Level 4: IT Support**
- System errors
- Permission issues
- Integration problems
- Data corruption

**Emergency:** If purchase orders are wrong after applying, contact manager immediately. They can manually correct POs or request IT restore.

---

## Quick Reference

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **F5** | Refresh page |
| **F6** | Assist Edit (for filters) |
| **F8** | Copy value from line above |
| **Ctrl + N** | New line (not applicable in worksheet) |
| **Tab** | Next field (saves current field) |
| **Shift + Tab** | Previous field |
| **Ctrl + Home** | First line |
| **Ctrl + End** | Last line |
| **Enter** | Save field and move down |
| **Esc** | Cancel edit |
| **Ctrl + F** | Find |

### Filter Syntax Reference

| Syntax | Meaning | Example |
|--------|---------|---------|
| `%my` | My assigned items/vendors | `%my` |
| `%Spring` | Spring season items | `%Spring` |
| `A|B` | Item A OR Item B | `ITEM001|ITEM002` |
| `A..Z` | Range A through Z | `ITEM001..ITEM999` |
| `*text*` | Contains text | `*Geranium*` |
| `>100` | Greater than 100 | `>100` |
| `<50` | Less than 50 | `<50` |

### Button Quick Reference

| Button | When to Use | Result |
|--------|-------------|--------|
| **Get Data** | Start of session | Loads all data |
| **Clear Page** | Before getting new data | Deletes all lines |
| **Apply selected** | Specific changes only | Applies marked lines |
| **Apply all** | All pending changes | Applies everything |
| **New Purchase Line** | Create new order | Dialog for new line |
| **Change Vendor/PO** | Move to different vendor/PO | Dialog for move |
| **Copy Purch. Order** | Duplicate PO to new date | Dialog for copy |
| **Check for Changes** | Verify POs unchanged | Validates hashes |
| **Update Demand** | Sales orders changed | Refreshes demand |
| **Update Supply** | POs changed elsewhere | Refreshes supply |
| **Filter on unavailable Items** | Find shortages | Shows negative avail |
| **Filter on Supply Lines** | See only orders | Hides demand-only |
| **Reset Filter & Sorting** | Return to default view | Clears filters |
| **All Changes** (nav) | View change log | Opens log page |
| **Line Changes** (nav) | View this line's log | Opens filtered log |

### Field Quick Reference

**Read-Only Fields (System Calculated):**
- Purchase Order No.
- Vendor No., Vendor Name
- Item No., Item Description
- Inbound Warehouse Time
- Exp. Receipt Date
- Purch. Line Quantity
- Purch. Line Quantity Adj.
- Demand Qty.
- Qty. Available
- Cum. Availability
- Cum. Avail. (simulated)
- Cart Quantity Line
- Cart Total Purch. Order
- Season Forecast Qty.
- Season Forcast Balance

**Editable Fields (You Control):**
- Requested Receipt Date
- Purch. Line Quantity New

### Color Coding

| Color | Meaning |
|-------|---------|
| White background | No changes |
| Yellow/Orange background | Modified (pending apply) |
| Red text (Qty. Available) | Negative availability |
| Red style (Cart Total) | >40 carts |

### Change Types

| Your Change | What Applies | System Action |
|-------------|--------------|---------------|
| Quantity only | Quantity Change | Updates PO line |
| Date only | Date Change | Updates PO header |
| Quantity + Date | Both | Updates both |
| Vendor changed | Move Line | Creates new line, deletes old |
| PO number changed | Move Line | Creates new line, deletes old |
| New line (no PO) | New Order | Creates PO header + line |

### Best Practices Checklist

**Daily:**
- [ ] Clear previous session
- [ ] Set date range (today + 4-6 weeks)
- [ ] Set filters (items, vendors)
- [ ] Get Data
- [ ] Filter to "Unavailable Items"
- [ ] Address shortages
- [ ] Apply changes
- [ ] Print and send POs to vendors

**Weekly:**
- [ ] Review forecast vs. actual
- [ ] Consolidate small POs
- [ ] Check for changes on existing lines
- [ ] Update demand and supply
- [ ] Plan upcoming seasonal needs

**Monthly:**
- [ ] Review all vendor performance
- [ ] Plan major seasonal buys
- [ ] Coordinate with sales team on forecast
- [ ] Clean up old POs (cancel/close)

**Before Leaving:**
- [ ] Apply all pending changes
- [ ] Verify POs sent to vendors
- [ ] Close worksheet (choose "Keep" if planning continues tomorrow)

---

## Document Information

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 02/13/2026 | Initial release | Documentation Team |

**Related Documents:**
- Broker Workspace Manager Guide
- Broker Workspace IT Troubleshooting Guide
- Purchase Order Processing Guide
- Vendor Management Guide

**Feedback:**
Contact purchasing@clesenhoriculture.com with suggestions or corrections.

---

*End of Broker Workspace Staff User Guide*

---

## Related documents

- [[README]]
- [[broker-workspace-manager-guide]]
- [[broker-workspace-it-troubleshooting-guide]]
