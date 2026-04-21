---
title: Purchase Worksheet — Planning Guide
type: howto
tags: [purchasing, planning, forecasting, inventory]
created: 2026-04-21
updated: 2026-04-21
sources: [purchase-worksheet-user-guide.md]
---

# Purchase Worksheet — Planning Guide

Comprehensive planning tool for demand-driven purchasing with what-if scenario modeling.

## Overview

The Purchase Worksheet (also known as the Broker Workspace) is a powerful planning tool that provides a comprehensive view of your purchasing needs. It allows you to:

- **Plan purchases collaboratively** in a temporary workspace before committing changes
- **See demand from sales orders** alongside existing purchase orders
- **Calculate projected inventory levels** for each item on each date
- **Model "what-if" scenarios** without affecting actual purchase orders
- **Make bulk adjustments** to quantities, dates, and vendors
- **Apply all changes at once** to convert planning to actual purchase orders
- **Track all modifications** with a complete audit trail

**Think of it as:** An intelligent spreadsheet that pulls real-time data from sales orders and purchase orders, lets you plan your purchases, and then pushes your decisions back to create or update actual purchase orders.

## Key Benefits

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

## When to Use the Purchase Worksheet

- **Daily/weekly purchase planning** — Review demand and adjust orders
- **Responding to demand changes** — Customers add or change orders
- **Adjusting delivery schedules** — Vendor delays or early shipments
- **Seasonal planning** — Bulk ordering for spring, summer, fall campaigns
- **Forecast comparison** — Compare actual orders against production forecasts
- **Vendor coordination** — Consolidate orders or switch suppliers
- **Shortage management** — Identify and resolve inventory shortfalls

## Getting Started

### Accessing the Worksheet

**Navigation:**

1. Open Business Central
2. In the search box, type **"Broker Workspace"** or **"Purchase Worksheet"**
3. Click to open page 50086 "CLE Purchase Worksheet"

**Alternative Access:**
- From the **Purchasing Role Center**, look for the "Tasks" section
- Bookmark the page for quick access

### Prerequisites

**Your user profile must have:**

- **Purchaser Code** assigned in User Setup
- **Permission** to create and edit purchase orders
- **Access** to view items, vendors, sales orders, and inventory
- **Understanding** of your company's purchasing processes

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
4. Click **OK** — system builds filter automatically

#### Set Vendor Filter

**Common filtering patterns:**

| Filter Syntax | Result |
|---------------|--------|
| *(blank)* | All vendors |
| `%my` | Vendors assigned to your purchaser code |
| `V001` | Single vendor |
| `V001\|V002` | Multiple vendors |

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

> **Note:** If you get an error, verify your date range isn't too large. Try reducing to 4-6 weeks.

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
- **Cum. Avail. (simulated)** recalculates for this date and all future dates
- **Change log entry** is created automatically
- Line background may turn orange/yellow (pending changes)

### Changing Dates

**To move an order to a different delivery date:**

1. Locate the line to change
2. Click in the **Requested Receipt Date** cell
3. Select new date from calendar picker
4. Press **Enter**

**What happens immediately:**

- **Exp. Receipt Date** auto-calculates
- System checks if purchase order line has already changed
- If other lines exist on same PO, system may ask: *"Adjust other lines too?"*
- **Line Modified** flag sets to `true`
- **Demand and availability recalculate** for new date
- If demand exists on new date, lines may merge
- **Change log entry** is created

### Creating New Purchase Lines

**When you have demand but no supply:**

Demand lines (blank Purchase Order No.) represent sales orders without corresponding purchase orders. You need to create a new purchase line to fulfill this demand.

**Steps:**

1. Select the demand line (click on the row)
2. Click **"New Purchase Line"** button (or right-click > New Purchase Line)
3. Dialog opens with pre-filled information
4. Review all fields, adjust as needed
5. Click **OK**

**Dialog Fields:**

| Field | Pre-Filled | Editable | Notes |
|-------|-----------|----------|-------|
| **Item** | Yes | No | From selected demand line |
| **Vendor No.** | Yes (item's default) | **Yes** | Choose vendor from dropdown |
| **Quantity** | No | **Yes** | Enter quantity to order |
| **Requested Receipt Date** | Yes (from demand) | **Yes** | When you need delivery |

**Tips:**
- Order enough to cover demand **plus** safety stock
- Check vendor lead times before setting requested date
- For multiple items from same vendor, create separate lines

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

> **Warning:** You cannot undo after applying. All changes immediately affect live purchase orders. Review carefully before clicking "Apply all."

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

---

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
4. **Get Data**
5. **Review forecast balance** — identify over/under order patterns
6. **Sort by Item Description**
7. **For each item:**
   - Review demand pattern
   - Review forecast vs. actual
   - Adjust quantities to meet forecast
   - Create new lines as needed
8. **Sort by Vendor Name** to group orders
9. **Review cart totals** by vendor
10. **Apply All** when planning complete
11. **Coordinate delivery dates with vendors**

**Time:** 2-4 hours (one-time per season)

---

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

## Troubleshooting

### Issue: Data Takes Too Long to Load

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

### Issue: Negative Availability Everywhere

**Symptom:** Most lines show red negative numbers in "Qty. Available" column.

**Cause:** 
- Inventory levels are low
- Large sales demand
- Not enough purchase orders
- Calculation date range issue

**Solution:**
1. **Verify inventory:** Check if physical inventory is actually low
2. **Review demand:** Drill down on Demand Qty. — are sales orders real?
3. **Check existing POs:** Are they before or after demand dates?
4. **Adjust quantities:** Increase purchase quantities to cover demand
5. **Check date range:** Ensure Start Date isn't before inventory adjustment dates

---

### Issue: Changes Not Applying

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

## Quick Reference

### Button Quick Guide

| Button | Action | When to Use |
|--------|--------|-------------|
| **Get Data** | Load worksheet from POs and demand | Start new planning session |
| **Clear Page** | Delete all lines and filters | Start fresh or remove old data |
| **Apply All** | Apply all pending changes | Commit all planning to POs |
| **New Purchase Line** | Create purchase line from demand | Cover unfulfilled demand |
| **Refresh** | Reload data without clearing | Check for external changes |

### Common Calculations

**Qty. Available:**
```
= Current Inventory 
  + All Receipts up to this date 
  - All Sales Demand up to this date
  + Purch. Line Quantity New
```

**Cum. Avail. (simulated):**
```
= Cum. Availability + Purch. Line Quantity Adj.
```

**Cart Quantity Line:**
```
= Purch. Line Quantity New / Qty. per Cart (from Item card)
```

## Related Pages

- [[purchase-receipt-overview]]
- [[purchase-receipt-staff]]
- [[purchase-receipt-manager]]
- [[purchase-receipt-it-troubleshooting]]
