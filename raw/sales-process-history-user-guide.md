# Sales Process History User Guide

## Overview

The **Sales Process History** feature provides a complete audit trail of every change made to sales order lines throughout their entire lifecycle. From the initial blanket order through regular orders, invoicing, and even credit memos, every modification is automatically tracked and available for review.

This is essential for:

- Understanding how orders evolved over time
- Tracking quantity and price changes
- Identifying who made changes and when
- Analyzing sales performance by week/season
- Compliance and audit requirements
- Customer dispute resolution
- Commission calculations

---

## Prerequisites

Before using Sales Process History:

- System administrator must enable "CW Activate S-Line Tracking" in Clesen Setup
- Sales lines must have a Sales Line Set ID assigned (automatically assigned by system)
- Appropriate permissions to view sales history data

---

## Accessing Sales Process History

### From Sales Order Line

1. Open any **Sales Order**
2. Navigate to the **Lines** section (subform)
3. Click on the line you want to review
4. In the ribbon, go to **Line → Sales Process History**
5. The Sales Line History page opens showing all changes for that line

**Keyboard Shortcut**: None (use mouse/ribbon navigation)

**What You'll See**: All historical entries for lines with the same Sales Line Set ID (includes related items in kits/bundles)

---

### From Sales Line History Page Directly

1. Use Search (Alt+Q or Ctrl+F10) and type "Sales Line History"
2. Select **CLE Sales Line History** page
3. View complete history for all sales lines
4. Apply filters to find specific records

---

## Understanding the History Page

### Key Columns

| Column | Description | Example |
| -------- | ------------- | --------- |
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
| **Fin. Season** | Financial season (horticulture) | Spring, Summer, Fall, Winter |
| **Booking Date** | Original order date | 2/1/2026 |
| **Booking Week/Year** | Week when originally booked | Week 5, 2026 |
| **Shipment Date** | Planned shipment date | 3/15/2026 |

### Hidden Columns (Available via Personalization)

- **Salesperson Code**: Who sold the order
- **Sell-to Customer No.**: Customer number
- **Sales Line Set ID**: Unique identifier for grouped lines
- **Set Entry Line No.**: Sequential number within set
- **Reason Code**: Change reason if provided
- **Year**: Shipment year
- **Changing Week/Year**: Week when change was made

---

## Understanding Sales Line Set ID

**What is it?**
A unique integer identifier that groups related sales lines together, even across different documents.

**Why is it important?**

- Tracks line lifecycle: Blanket Order → Sales Order → Posted Invoice
- Groups kit/bundle components together
- Preserves history when lines move between documents
- Enables comprehensive tracking

**Example**:

```text
Blanket Order 1001, Line 10000 (Rose Bouquet Kit - Roses)
  ↓ Creates Order
Sales Order SO-2024-050, Line 10000 (Same roses)
  ↓ Posts Invoice
Posted Invoice SI-2024-100, Line 10000 (Same roses)

All three have Sales Line Set ID = 54321
History shows complete journey!
```

---

## Common Scenarios

### Scenario 1: Reviewing Quantity Changes on an Order

**Use Case**: Customer claims they ordered 100 units but order shows 75. You need to verify what happened.

**Steps**:

1. Open the sales order
2. Click the line in question
3. Open **Line → Sales Process History**
4. Review entries sorted by **Date of Change** and **Time of Change**
5. Look for "Line Change" actions

**What to Check**:

- Initial "Insert" entry shows original quantity
- Subsequent "Line Change" entries show modifications
- **Diff. to prior Amount** shows dollar impact of each change
- **User ID** identifies who made each change
- **Reason Code** may explain why (if entered)

**Example History**:

```text
Date        Time      Action      Qty    Amount    Diff.    User
2/1/2026    9:15 AM   Insert      100    $1,000    +$1,000  MJONES
2/3/2026    2:30 PM   Line Change  75      $750     -$250   JSMITH
```

**Interpretation**:
Line originally entered with 100 units by MJONES on 2/1. JSMITH reduced to 75 units on 2/3, reducing value by $250.

---

### Scenario 2: Tracking Blanket Order to Sales Order Conversion

**Use Case**: Need to see when and how blanket order quantities were released to actual orders.

**Steps**:

1. Open **Sales Line History** page
2. Filter by **Sales Line Set ID** (get this from blanket order line)
3. Review entries sorted by date

**What You'll See**:

1. **Blanket Order entries**: Show available remaining quantities
2. **"Make Order" action**: When blanket converts to order
3. **Order entries**: Show quantities allocated from blanket
4. **Changes**: Any modifications after order creation

**Example History**:

```text
Date        Doc Type       Doc No.    Action      Qty   Amount     User
1/15/2026   Blanket Order  BO-2024-1  Insert      200   $2,000     ADMIN
2/1/2026    Order          SO-001     Make Order   50     $500     JSMITH
2/1/2026    Blanket Order  BO-2024-1  Line Change 150   $1,500     JSMITH
2/8/2026    Order          SO-002     Make Order   30     $300     JSMITH
2/8/2026    Blanket Order  BO-2024-1  Line Change 120   $1,200     JSMITH
```

**Interpretation**:

- Blanket started with 200 units
- 50 units released to SO-001, leaving 150 available
- 30 more units released to SO-002, leaving 120 available

---

### Scenario 3: Understanding Price Changes

**Use Case**: Order was initially $1,000 but now shows $1,200. Need to understand why.

**Steps**:

1. Open sales order and navigate to line
2. Open **Sales Process History**
3. Look at **Line Amount (LCY)** column progression
4. Check **Diff. to prior Amount (LCY)** for changes

**What to Look For**:

- Price increases show positive differences
- Price decreases show negative differences
- Multiple small changes vs. one large change
- Timing of changes (before or after customer approval?)

**Example History**:

```text
Date        Action       Qty   Amount    Diff.     User      Notes
2/1/2026    Insert       100   $1,000    +$1,000   MJONES    Initial order
2/5/2026    Line Change  100   $1,200    +$200     ADMIN     Price adjustment
```

**Interpretation**:
Original order was $1,000. Price was adjusted upward by $200 on 2/5 by ADMIN.

---

### Scenario 4: Analyzing Returns via Credit Memos

**Use Case**: Customer returned items. Need complete picture of original sale and return.

**Steps**:

1. Open Sales Line History page
2. Filter by **Sell-to Customer No.** and/or **Document No.**
3. Look for negative quantities and amounts

**What You'll See**:

- **Original Order/Invoice**: Positive quantities and amounts
- **Credit Memo**: Negative quantities and amounts (shows as reduction)
- **Diff. to prior Amount**: Negative value showing money returned

**Example History**:

```text
Date        Doc Type    Doc No.     Action   Qty    Amount    Diff.
2/1/2026    Order       SO-001      Insert    50    $500      +$500
2/5/2026    Invoice     SI-050      Posting   50    $500      $0
2/10/2026   Credit Memo CM-010      Posting  -10   -$100     -$100
```

**Interpretation**:

- 50 units ordered and invoiced for $500
- 10 units returned via credit memo, refunding $100
- Net: Customer kept 40 units, paid $400

---

### Scenario 5: Tracking Web Orders vs. Manual Orders

**Use Case**: Compare web order performance vs. phone/email orders.

**Steps**:

1. Open Sales Line History page
2. Show column **Web Order** (via personalization if hidden)
3. Apply filters or export to Excel for analysis

**What You'll See**:

- **Web Order = TRUE**: Orders placed through web portal
- **Web Order = FALSE**: Orders entered manually

**Analysis Ideas**:

- Compare average order values (web vs. manual)
- Look at modification frequency (web orders modified less?)
- Analyze by season or product category
- Track fulfillment time differences

---

### Scenario 6: Weekly Sales Analysis

**Use Case**: Report on sales booked and shipped by week.

**Steps**:

1. Open Sales Line History
2. Show columns: **Booking Week**, **Booking Year**, **Shipment Week**
3. Filter by date range
4. Group by week (export to Excel for pivot table)

**Data You Can Extract**:

- **Booking Week**: When order was initially placed
- **Shipment Week**: When order was/will be shipped
- **Changing Week**: When modifications occurred
- **Diff. to prior Amount**: Impact of changes on weekly totals

**Report Example**:

```text
Booking Week | Total Booked | Shipped Same Week | Shipped Later

Week 5       | $50,000      | $20,000           | $30,000

Week 6       | $45,000      | $25,000           | $20,000
```

---

### Scenario 7: Financial Season Reporting (Horticulture)

**Use Case**: Analyze sales by growing season for forecasting.

**Steps**:

1. Open Sales Line History
2. Filter by **Fin. Season** (Spring, Summer, Fall, Winter)
3. Filter by **Year**
4. Review **Line Amount (LCY)** totals

**What to Analyze**:

- Which seasons drive most revenue?
- Booking dates vs. shipment dates by season
- Year-over-year season comparisons
- Customer buying patterns by season

**Example Analysis**:

```text
Season      2024 Sales    2025 Sales    Change
Spring      $250,000      $275,000      +10%
Summer      $180,000      $195,000      +8%
Fall        $220,000      $210,000      -5%
Winter      $150,000      $165,000      +10%
```

---

## Using Document Lookup

The **Document Lookup** action allows you to quickly navigate from history to the source document.

**Steps**:

1. In Sales Line History page, select any entry
2. Click **Actions → Processing → Document Lookup**
3. System opens the appropriate page:
   - **Blanket Order** → Blanket Sales Order page
   - **Order** → Sales Order page
   - **Invoice** → Posted Sales Invoice page (read-only)
   - **Credit Memo** → Posted Sales Credit Memo page (read-only)

**If Document Not Found**:

- Message: "Document [Type] [No.] can't be found. It is probably already posted."
- This happens when order has been posted and archived
- You may need to check posted document archives

**Tip**: Use this to quickly verify current state vs. historical state.

---

## Interpreting Action Types

### Action: "Insert"

- **Meaning**: New line was created
- **When**: First time item added to document
- **Diff. to prior Amount**: Full line amount (positive)
- **What to check**: Original quantities, prices, dates

### Action: "Line Change"

- **Meaning**: Existing line was modified
- **When**: Quantity, price, date, or other field changed
- **Diff. to prior Amount**: Difference from previous value
- **What to check**: What changed (compare to prior entry), who made change, when

### Action: "Delete Line"

- **Meaning**: Line was removed from document
- **When**: User deleted line or system cleaned up zero-qty lines
- **Diff. to prior Amount**: Negative of previous amount
- **What to check**: Why deleted, who deleted, timing

### Action: "Make Order"

- **Meaning**: Blanket order line converted to sales order
- **When**: "Make Order" function executed from blanket
- **Diff. to prior Amount**: Amount allocated from blanket
- **What to check**: How much quantity released, blanket remaining

### Action: "Posting"

- **Meaning**: Document was posted (Invoice or Credit Memo)
- **When**: Post Invoice or Post Credit Memo executed
- **Diff. to prior Amount**: Posted amount (or negative for credit memos)
- **What to check**: Final posted values, posting date

---

## Understanding Amount Differences

**Positive Difference (+)**:

- Line value increased
- Examples:
  - Quantity increased: 50 → 75 units
  - Price increased: $10 → $12 per unit
  - Line added (Insert action)
  - Invoice posted (adds to sales)

**Negative Difference (-)**:

- Line value decreased
- Examples:
  - Quantity decreased: 100 → 80 units
  - Price decreased: $15 → $12 per unit
  - Line deleted (removes value)
  - Credit memo posted (reduces sales)

**Zero Difference (0)**:

- Changes that don't affect amount
- Examples:
  - Shipment date changed (no $ impact)
  - Description updated
  - Reason code added
  - Note: System may skip creating history entry if difference = 0

**Calculating Total Impact**:
Sum all "Diff. to prior Amount" values for complete picture:

```text
Entry 1: +$1,000 (Insert)
Entry 2: +$200   (Price increase)
Entry 3: -$300   (Quantity decrease)
Entry 4: +$50    (Small adjustment)
---------------------------------
Total:   +$950   (Net change)
```

---

## Filtering and Searching

### Filter by Customer

1. Show column **Sell-to Customer No.**
2. Click filter icon in column header
3. Enter customer number or use lookup
4. View all history for that customer

### Filter by Date Range

1. Click filter on **Date of Change** column
2. Enter date range (e.g., "2/1/2026..2/29/2026")
3. Or use relative dates: "TODAY-30D..TODAY"

### Filter by User

1. Show column **User ID**
2. Filter to specific user
3. See all changes made by that person

### Filter by Action Type

1. Click filter on **Action taken** column
2. Select: Insert, Line Change, Delete Line, Make Order, or Posting
3. View only those action types

### Filter by Document

1. Filter **Document Type** and **Document No.**
2. See complete history for specific document
3. Useful for tracing order lifecycle

### Advanced Filters

Access via **Filter Pane** (Ctrl+Shift+F3):

- Combine multiple filters
- Use wildcards (*) for partial matches
- Use ranges for numeric fields
- Save filter views for reuse

---

## Exporting History Data

### Export to Excel

#### Method 1: Open in Excel

1. In Sales Line History page, click **Actions → Open in Excel**
2. Excel opens with current filtered data
3. Edit and analyze in Excel
4. Cannot publish changes back (read-only history)

#### Method 2: Analysis in Excel

1. Click **Actions → Analyze → Analyze in Excel**
2. Creates Excel with PivotTable connection
3. Refresh to get latest data
4. Build custom reports

### Export to CSV

1. Click **Actions → Export → Export to CSV**
2. Choose save location
3. Open in Excel or other tools
4. Use for integration with other systems

### Common Reports to Build

**Weekly Booking Report**:

- Group by Booking Week, Booking Year
- Sum Line Amount (LCY)
- Show by Salesperson

**Change Audit Report**:

- Filter by Date range
- Group by User ID, Action taken
- Count entries to see activity levels

**Season Performance Report**:

- Group by Fin. Season, Year
- Sum Line Amount (LCY)
- Compare year-over-year

**Customer Analysis Report**:

- Group by Sell-to Customer No.
- Count changes (order modification frequency)
- Sum amounts by action type

---

## Troubleshooting

### Problem: No History Showing for My Lines

**Possible Causes**:

1. Sales Line Set ID = 0 (not assigned)
2. Sales line tracking disabled in setup
3. Wrong filter applied
4. History not captured yet (very recent insert)

**Solutions**:

1. Check if line has Sales Line Set ID:
   - Open sales order line
   - Show field "CW Sales Line Set ID" via personalization
   - If 0, history won't be captured
2. Verify setup:
   - Search for "CLE Clesen Setup"
   - Check "CW Activate S-Line Tracking" is enabled
   - Contact admin if disabled
3. Remove all filters:
   - Click **Clear Filter** button
   - Search by Document No. directly
4. Refresh page (F5) to see recent changes

---

### Problem: History Shows Wrong Document Number

**Cause**: You may be looking at history from when line was on a different document.

**Explanation**:

- Sales Line Set ID tracks lines across documents
- Blanket order line has Set ID 12345
- When converted to order, order line gets same Set ID 12345
- History shows BOTH blanket entries AND order entries

**Solution**:

---

### Problem: Can't Open Document via Document Lookup

**Error Message**: "Document [Type] [No.] can't be found. It is probably already posted."

**Cause**: Document has been posted and original order/blanket is deleted/archived.

**Solutions**:

1. If Invoice/Credit Memo: These open fine (posted documents preserved)
2. If Order: Check if it was posted and archived
   - Search for Posted Sales Shipments/Invoices
   - Look up by original order number
3. If Blanket Order: May have been deleted after all quantity used
   - Review blanket order archives if available
   - Or just view history without navigating to document

---

### Problem: Amounts Don't Add Up

**Issue**: Sum of differences doesn't equal current line amount.

**Possible Reasons**:

1. **Viewing partial history**: Filter may be excluding some entries
   - Remove filters and sum all entries for line
2. **Multiple lines with same Set ID**: Viewing grouped history
   - Filter by Document No. and Doc. Line No. for single line
3. **Rounding differences**: Minor decimal differences
   - Check if amounts are very close (within pennies)
4. **Posted documents**: Posted amounts may differ from order amounts
   - Compare order history vs. invoice history separately

**Solution**:

- Filter to specific Document Type + Document No. + Line No.
- Sum all "Diff. to prior Amount" values
- Should match current line amount

---

### Problem: Can't See All Columns I Need

**Solution**: Use Personalization

1. Click **Personalize** (gear icon)
2. Click **More** → **Show hidden columns**
3. Drag columns to visible area
4. Save personalization

**Commonly Hidden Columns to Show**:

- Salesperson Code
- Sell-to Customer No.
- Reason Code
- Sales Line Set ID
- Year
- Web Order

---

### Problem: Too Much Data - Performance Slow

**Tips for Better Performance**:

1. **Always filter before loading**:
   - Filter by date range first
   - Then add other filters
2. **Limit time ranges**:
   - Don't load all history at once
   - Use quarters or months
3. **Export large datasets**:
   - For analysis of big date ranges, export to Excel
   - Run reports in Excel rather than in BC
4. **Use SIFT indexes**:
   - Filters on indexed columns perform better
   - Good filters: Customer No., Document Type/No., Date

---

## Best Practices

### 1. Regular Review

- Review history weekly for high-value orders
- Check for unauthorized changes
- Verify customer-requested modifications were made correctly

### 2. Training Users on Reason Codes

- Encourage entering Reason Codes when changing lines
- Makes history more meaningful
- Easier to understand "why" changes happened

### 3. Document Lookup Workflow

- When customer questions order, use Document Lookup
- Navigate from history to current document
- Compare what was vs. what is now

### 4. Use for Commission Disputes

- **Booking Date** determines commission period
- Review history to verify when order was originally booked
- Check if order was modified after initial booking

### 5. Seasonal Planning

- Export season history at end of each season
- Compare to forecasts
- Identify patterns for next year's planning

### 6. Customer Service Excellence

- When customer calls about order changes:
  - Pull up history immediately
  - Show transparency: "I can see what happened..."
  - Build trust with accurate information

### 7. Audit Trail Compliance

- Keep awareness that ALL changes are logged
- User ID and timestamp captured
- Make deliberate, documented changes

### 8. Blanket Order Management

- Review blanket order history monthly
- Check allocation patterns
- Identify underutilized blankets

### 9. Price Protection Verification

- If customer has price protection agreement
- Review history to ensure prices weren't increased
- Document any necessary adjustments

### 10. Analytics and Reporting

- Build Excel templates for common reports
- Schedule regular extracts for analysis
- Share insights with management

---

## Understanding Set ID Groups

**What are Set ID Groups?**
Multiple sales lines that share the same Sales Line Set ID, forming a logical group.

**Common Examples**:

1. **Kit Components**:
   - Rose Bouquet Kit includes: Roses, Vase, Ribbon
   - All three lines share Set ID 54321
   - History shows all three lines' changes together

2. **Matched Pairs**:
   - Male and Female plants sold as pair
   - Both share same Set ID
   - Track as unit through lifecycle

3. **Blanket-to-Order Lineage**:
   - Blanket Order line: Set ID 12345
   - First Order from blanket: Same Set ID 12345
   - Second Order from blanket: Same Set ID 12345
   - All related through Set ID

**Viewing Grouped History**:
When you open Sales Process History from a line:

- System filters by that line's Set ID
- You may see entries for multiple lines
- All entries share the same Set ID
- Shows complete group activity

**Filtering to Single Line**:
To see ONLY one line's history:

1. Note the **Document Type**, **Document No.**, **Doc. Line No.**
2. Apply filters for those three fields
3. Now showing only that specific line's changes

---

## Data Retention

**How Long is History Kept?**

- History is **never automatically deleted**
- Permanent audit trail
- Grows over time

**Why No Deletion?**

- Compliance requirements
- Audit trail integrity
- Historical analysis value

**Impact**:

- Database grows with transaction volume
- Older data may slow queries if not filtered
- Use date filters for better performance

**Archiving** (IT/Admin):

- May archive very old data to separate database
- Contact IT if need access to archived history
- Typically keep 7+ years online, archive beyond that

---

## Related Features

### Sales Line Change Log

- Different from Sales Process History
- More detailed field-level tracking
- Access via **Line → Sales Line Log Entries**
- Shows WHICH fields changed, not just amounts

**When to Use Which**:

- **Sales Process History**: Amount changes, lifecycle tracking, reporting
- **Sales Line Change Log**: Detailed field auditing, debugging, compliance

### Posted Document History

- Posted invoices/credit memos preserved in system
- Access via Posted Sales Invoice/Credit Memo lists
- Different from Sales Process History (shows posted state only)

### Blanket Order Tracking

- Blanket orders have their own history tracking
- Shows available vs. used quantities
- Complements Sales Process History

---

## Keyboard Shortcuts and Tips

**General Navigation**:

- **F5**: Refresh page to see latest data
- **Ctrl+F**: Quick filter (find text in any column)
- **Ctrl+Shift+F3**: Show/hide filter pane
- **Ctrl+Home**: Go to first record
- **Ctrl+End**: Go to last record

**Column Operations**:

- **Click header**: Sort by column (click again to reverse)
- **Right-click header**: Column options, hide/show, freeze
- **Drag header**: Reorder columns

**Action Shortcuts**:

- **Alt+N**: New (if allowed - not in history page)
- **F6**: Move to filter pane
- **Esc**: Close page/dialog

**Personalization**:

- **Gear icon**: Personalize page
- Save layouts for quick access

---

## Frequently Asked Questions

**Q: Why doesn't my line have any history?**
A: Line doesn't have a Sales Line Set ID assigned, or tracking is disabled in setup.

**Q: Can I delete history entries?**
A: No. History is read-only for audit integrity. Contact admin if truly necessary (rare).

**Q: Can I edit history to correct mistakes?**
A: No. History shows what actually happened. Fix current document, which creates new history entry.

**Q: Why do I see lines from other orders in my history?**
A: You're viewing by Set ID which groups related lines. Filter by Document No. to see single order.

**Q: What's the difference between Booking Date and Date of Change?**
A: **Booking Date** = when order was originally placed. **Date of Change** = when modification happened.

**Q: Why is quantity negative?**
A: Credit memos show negative quantities (returns/reductions). It's correct.

**Q: Can I see history for deleted orders?**
A: Yes! History preserved even after order deleted/posted. That's the point of audit trail.

**Q: How do I export history for a specific customer?**
A: Filter by Sell-to Customer No., then use "Open in Excel" or "Export to CSV".

**Q: What if Document Lookup doesn't work?**
A: Document may be posted/archived. Check posted documents list or navigate manually.

**Q: Can I track changes from rapid order entry/speed entry?**
A: Yes, those create history entries automatically like any other change.

---

## Quick Reference

| Task | Steps |
| ------ | ------- |
| **View line history** | Open order → Click line → Line menu → Sales Process History |
| **Filter by customer** | Show Sell-to Customer No. column → Filter |
| **Filter by date** | Click Date of Change filter → Enter range |
| **Open source document** | Select entry → Actions → Document Lookup |
| **Export to Excel** | Actions → Open in Excel or Analyze in Excel |
| **See all columns** | Personalize → Show hidden columns |
| **View single line only** | Filter: Document Type + Document No. + Line No. |
| **Sum amounts** | Export to Excel → Use SUM function on Diff. column |
| **Find your changes** | Filter User ID to your username |
| **See kit/bundle group** | View by Set ID (default when opening from line) |

---

## Need Help?

If you encounter issues not covered in this guide:

1. Check if sales line tracking is enabled (contact admin)
2. Verify line has Sales Line Set ID assigned
3. Try removing filters and searching fresh
4. Export problematic data and send to IT support
5. Reference IT Troubleshooting Guide for technical issues

For questions about:

- **Business logic**: Contact your supervisor
- **System setup**: Contact system administrator
- **Data issues**: Contact IT support with specific examples
- **Training**: Request additional training session

---

*Last Updated: February 2026*
Version: 1.0

---

## Related documents

- [[sales-process-history-it-troubleshooting-guide]]
