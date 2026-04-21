---
title: Sales Process History — Audit Trail
type: howto
tags: [sales-orders, audit-trail, tracking, history]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-process-history-user-guide.md]
---

# Sales Process History — Audit Trail

Complete audit trail of every change made to sales order lines throughout their entire lifecycle.

## Overview

**Purpose:** Track every modification to sales orders from creation through invoicing

**Essential For:**
- Understanding how orders evolved over time
- Tracking quantity and price changes
- Identifying who made changes and when
- Analyzing sales performance by week/season
- Compliance and audit requirements
- Customer dispute resolution
- Commission calculations

## Prerequisites

Before using Sales Process History:

- System administrator must enable "CW Activate S-Line Tracking" in Clesen Setup
- Sales lines must have a Sales Line Set ID assigned (automatically assigned by system)
- Appropriate permissions to view sales history data

## Accessing Sales Process History

### From Sales Order Line

1. Open any **Sales Order**
2. Navigate to the **Lines** section
3. Click on the line you want to review
4. In the ribbon, go to **Line → Sales Process History**
5. The Sales Line History page opens showing all changes for that line

**What You'll See:** All historical entries for lines with the same Sales Line Set ID (includes related items in kits/bundles)

### From Sales Line History Page Directly

1. Use Search (Alt+Q or Ctrl+F10) and type "Sales Line History"
2. Select **CLE Sales Line History** page
3. View complete history for all sales lines
4. Apply filters to find specific records

## Understanding the History Page

### Key Columns

| Column | Description | Example |
|--------|-------------|---------|
| **Action taken** | What triggered this entry | "Insert", "Line Change", "Delete Line", "Make Order", "Posting" |
| **Document Type** | Type of sales document | Blanket Order, Order, Invoice, Credit Memo |
| **Document No.** | Document number | SO-2024-001 |
| **Doc. Line No.** | Line number within document | 10000 |
| **Quantity** | Quantity at time of change | 100 (or -50 for credit memos) |
| **Line Amount (LCY)** | Total line amount in local currency | $1,250.00 |
| **Diff. to prior Amount (LCY)** | Change from previous entry | +$250.00 (increase), -$100.00 (decrease) |
| **Date of Change** | When modification occurred | 2/12/2026 |
| **Time of Change** | Exact time of modification | 2:35:47 PM |
| **User ID** | Who made the change | JSMITH |
| **Fin. Season** | Financial season | Spring, Summer, Fall, Winter |
| **Booking Date** | Original order date | 2/1/2026 |
| **Booking Week/Year** | Week when originally booked | Week 5, 2026 |
| **Shipment Date** | Planned shipment date | 3/15/2026 |

### Available Columns (via Personalization)

- **Salesperson Code** — Who sold the order
- **Sell-to Customer No.** — Customer number
- **Sales Line Set ID** — Unique identifier for grouped lines
- **Set Entry Line No.** — Sequential number within set
- **Reason Code** — Change reason if provided
- **Year** — Shipment year
- **Changing Week/Year** — Week when change was made

## Understanding Sales Line Set ID

### What is it?

A unique integer identifier that groups related sales lines together, even across different documents.

### Why is it important?

- **Tracks line lifecycle:** Blanket Order → Sales Order → Posted Invoice
- **Groups kit/bundle components** together
- **Preserves history** when lines move between documents
- **Enables comprehensive tracking** across the entire order lifecycle

### Example

```text
Blanket Order 1001, Line 10000 (Rose Bouquet Kit - Roses)
  ↓ Creates Order
Sales Order SO-2024-050, Line 10000 (Same roses)
  ↓ Posts Invoice
Posted Invoice SI-2024-100, Line 10000 (Same roses)

All three have Sales Line Set ID = 54321
History shows complete journey!
```

## Common Scenarios

### Scenario 1: Reviewing Quantity Changes on an Order

**Use Case:** Customer claims they ordered 100 units but order shows 75. You need to verify what happened.

**Steps:**
1. Open the sales order
2. Click the line in question
3. Open **Line → Sales Process History**
4. Review entries sorted by **Date of Change** and **Time of Change**
5. Look for "Line Change" actions

**What to Check:**
- Initial "Insert" entry shows original quantity
- Subsequent "Line Change" entries show modifications
- **Diff. to prior Amount** shows dollar impact of each change
- **User ID** identifies who made each change
- **Reason Code** may explain why (if entered)

**Example History:**
```text
Date        Time      Action      Qty    Amount    Diff.    User
2/1/2026    9:15 AM   Insert      100    $1,000    +$1,000  MJONES
2/3/2026    2:30 PM   Line Change  75      $750     -$250   JSMITH
```

**Interpretation:** Line originally entered with 100 units by MJONES on 2/1. JSMITH reduced to 75 units on 2/3, reducing value by $250.

### Scenario 2: Tracking Blanket Order to Sales Order Conversion

**Use Case:** Understand how a blanket order became a regular sales order.

**Steps:**
1. Open blanket order line
2. Open **Line → Sales Process History**
3. Look for "Make Order" action entries

**What to Check:**
- Blanket Order insert shows original line
- "Make Order" entry indicates regular order created
- New Document No. shows which sales order was created
- Quantity tracks how much was used from blanket

### Scenario 3: Analyzing Sales by Season or Week

**Use Case:** Compare sales performance by season or week

**Steps:**
1. Open **CLE Sales Line History** page
2. Add filter: **Fin. Season** = "Spring" (or desired season)
3. Add filter: **Booking Year** = 2026
4. Group by: **Booking Week**
5. Summarize: SUM(**Diff. to prior Amount**)

**Result:** See total sales booked by week for your desired season

### Scenario 4: Commission Calculations

**Use Case:** Determine commission for salesperson based on orders booked

**Steps:**
1. Filter: **Salesperson Code** = JSMITH
2. Filter: **Booking Date** between date range
3. Filter: **Action taken** = "Insert" (original bookings only)
4. Summarize: SUM(**Line Amount (LCY)**)

**Result:** Total revenue booked by JSMITH during period

## Action Types Explained

| Action | When Triggered | What It Means |
|--------|-----------------|---------------|
| **Insert** | New line created | Line first entered into system |
| **Line Change** | Line quantity/price modified | Existing line was edited |
| **Delete Line** | Line removed from order | Line was removed (deleted) |
| **Make Order** | Blanket order converted to regular order | A regular order was created from blanket |
| **Posting** | Order posted as invoice or credit memo | Document was invoiced or credited |

## Best Practices

✅ **DO:**
- Review history for disputed order quantities
- Use **Sales Line Set ID** to track complete line lifecycle
- Filter by **Booking Date** for period-specific analysis
- Check **User ID** to identify who made changes
- Use **Fin. Season** for seasonal performance analysis
- Create **Reason Codes** when making adjustments for audit trail

❌ **DON'T:**
- Assume current order matches original booking
- Ignore history when analyzing sales performance
- Delete lines without noting reason
- Rely on order date alone for performance metrics
- Miss credit memos that offset original sales

## Troubleshooting

### Issue: No History Appears for a Line

**Cause:** Sales Line Tracking not enabled in setup

**Solution:** Contact system administrator to enable "CW Activate S-Line Tracking"

### Issue: Different Line Has Same Set ID

**Cause:** Lines are grouped together (bundle/kit components)

**Solution:** This is intentional — Set ID groups related lines. Check "Action taken" to understand the relationship.

### Issue: Cannot Find Specific Line Changes

**Cause:** May need to scroll through history or use filters

**Solution:**
- Sort by **Date of Change** descending (most recent first)
- Filter by **Document Type** (Blanket, Order, Invoice, Credit Memo)
- Filter by **User ID** if looking for specific person's changes

## Related Pages

- [[sales-order-management]] — Creating and managing sales orders
- [[sales-planning]] — Sales targets and planning
- [[sales-process-history-it-troubleshooting]] — IT technical documentation
