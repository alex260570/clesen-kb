# Finance dashboard user guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Finance managers, executives (CFO, CEO)
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Accessing the dashboard](#accessing-the-dashboard)
- [Dashboard layout](#dashboard-layout)
- [Key performance indicators](#key-performance-indicators)
- [Interpreting metrics](#interpreting-metrics)
- [Drill-down capabilities](#drill-down-capabilities)
- [Customizing your view](#customizing-your-view)
- [Refreshing data](#refreshing-data)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Finance Dashboard provides real-time insights into key financial metrics, helping executives and finance managers monitor business performance at a glance. The dashboard displays revenue, profitability, cash flow, and operational efficiency metrics.

### Purpose and benefits

- **Executive visibility:** Real-time financial KPIs without manual reporting
- **Data-driven decisions:** Key metrics highlight areas needing attention
- **Performance tracking:** Monitor trends vs. targets
- **Drill-down analysis:** Click through metrics to underlying data
- **Fast reporting:** Dashboard available anytime vs. waiting for monthly reports

### Prerequisites

- Finance manager or executive role
- Access to financial data in the system
- Basic understanding of financial metrics (revenue, expenses, cash flow)
- (Optional) Budget targets configured in the system

## Accessing the dashboard

### Via the main menu

1. Log in to the Clesen Horticulture system.
2. Navigate to **Dashboards** > **Finance Dashboard** or **Reports** > **Finance Dashboard**.
3. Dashboard loads with current financial data.

### Bookmarking the dashboard

For quick access:

1. Open the Finance Dashboard.
2. Browser menu: **Ctrl+D** (Windows) or **Cmd+D** (Mac) to bookmark.
3. Name the bookmark "Finance Dashboard" for easy reference.
4. Next time, click the bookmark to open instantly.

### Setting as your home page

1. Open the Finance Dashboard.
2. Click **⋯** (More) menu > **Set as Home Page** or **Default View**.
3. Next login, dashboard appears automatically.

## Dashboard layout

### Dashboard sections

The Finance Dashboard is organized into sections:

#### 1. Quick metrics ribbon (top)

Key figures displayed at a glance:

- **Year-to-Date Revenue:** Total sales received to date
- **Year-to-Date Expenses:** Total operational expenses to date
- **Gross Profit Margin:** Revenue minus COGS ÷ Revenue (%)
- **Current Period Net Income:** Profit/loss for current accounting period
- **Cash Position:** Current available cash balance
- **Accounts Receivable (A/R):** Outstanding customer invoices not yet paid

Each metric shows the current value and comparison to prior period (↑ better, ↓ worse).

#### 2. Revenue section (left column)

Displays revenue trends and customer performance:

- **Revenue Trend Chart:** Monthly revenue last 12 months with trend line
- **Revenue by Customer:** Top 5 customers by revenue; click for details
- **Revenue by Product Category:** Sales by crop type or product line

#### 3. Profitability section (right column)

Shows profitability metrics and margins:

- **Gross Profit Margin Trend:** GM% by month; target line if configured
- **Operating Expenses Ratio:** OpEx as % of revenue; trend vs. target
- **Net Profit Margin:** Bottom-line margin by period
- **Profitability by Business Unit:** Revenue minus direct costs by division

#### 4. Cash flow section (center bottom)

Monitors cash position and inflows/outflows:

- **Cash Flow Summary:** Cash from operations, investing, financing
- **Aging A/R Chart:** Invoices by age (current, 30 days, 60+ days)
- **Outstanding Payables:** What we owe suppliers vs. what customers owe us

#### 5. Key alerts section (right side)

Highlights items needing attention:

- **Budgets Near/Over Limit:** Departments or cost centers exceeding budget
- **Critical Issues:** Large write-offs, unusual items, compliance warnings
- **Aged Receivables:** Invoices more than 60 days old suggest collection issues

## Key performance indicators

### Revenue metrics

**Year-to-Date (YTD) Revenue**

- **What it is:** Total sales invoiced from January 1 to current date
- **Why it matters:** Tracks business growth progress toward annual goals
- **Target:** Compare to yearly revenue goal; are you on pace?
- **Formula:** Sum of all sales invoices YTD

**Revenue by Customer**

- **What it is:** Ranking of top customers by sales volume
- **Why it matters:** Concentration risk if reliant on a few customers
- **Action:** Ensure top customers are healthy; may signal sales opportunity if one customer declining
- **Formula:** Sum of invoices by customer

**Revenue Growth Rate**

- **What it is:** Percentage increase vs. prior period (month/year-over-year)
- **Why it matters:** Shows business momentum
- **Target:** Should match strategic plan (e.g., 15% annual growth)
- **Example:** If current month $500K and last year same month $435K, growth = 15%

### Profitability metrics

**Gross Profit Margin**

- **What it is:** Revenue minus cost of goods sold (COGS) ÷ Revenue
- **Why it matters:** Shows operational efficiency; higher = more efficient operations
- **Target:** Varies by industry; typical: 40-60% for nursery/horticulture
- **Formula:** (Revenue - COGS) ÷ Revenue × 100
- **Action if low:** Investigate input costs (seeds, labor, materials)

**Operating Expense Ratio**

- **What it is:** Operating expenses ÷ Revenue (expressed as %)
- **Why it matters:** Shows overhead efficiency; lower is better
- **Target:** 20-30% typical for horticultural operations
- **Includes:** Salaries, rent, utilities, delivery, marketing, admin
- **Action if high:** Look for unnecessary spending or revenue decline

**Net Profit Margin**

- **What it is:** Net income ÷ Revenue; your bottom-line profitability
- **Why it matters:** Shows true profitability after all expenses and taxes
- **Target:** 5-15% typical for horticultural businesses
- **Formula:** Net Income ÷ Revenue × 100

### Cash flow metrics

**Operating Cash Flow**

- **What it is:** Cash generated from normal business operations
- **Why it matters:** Most important indicator of business health; more important than profit
- **Difference from profit:** Profit is accounting; cash flow is actual money movement
- **Key drivers:**
  - Fast customer collections (improve receivables aging)
  - Slow payment of suppliers (negotiate better terms)
  - Inventory management (don't tie up cash in excess stock)

**Days Sales Outstanding (DSO)**

- **What it is:** Average days to collect payment from customers
- **Why it matters:** Shows how fast you convert sales to cash
- **Target:** Lower is better; typical: 30-45 days
- **Formula:** (Accounts Receivable ÷ Daily Revenue)
- **Action if high:** Customers are slow to pay; may need collection efforts

**Days Payable Outstanding (DPO)**

- **What it is:** Average days you take to pay suppliers
- **Why it matters:** Longer payment windows preserve cash
- **Target:** Balance between: keeping cash vs. maintaining supplier relationships
- **Formula:** (Accounts Payable ÷ Daily COGS)

### Operational metrics

**Inventory Turnover**

- **What it is:** Number of times inventory sells and is replaced per year
- **Why it matters:** Faster turnover = less cash tied up in slow-moving inventory
- **Target:** Varies by crop; fresh plants: 6-12x/year; perennials: 2-4x/year
- **Action if low:** Excess inventory; risk of waste/spoilage

**Asset Turnover**

- **What it is:** Revenue ÷ Total Assets; how efficiently assets generate revenue
- **Why it matters:** Shows ROI on equipment, facilities, and investments
- **Target:** 1-2x typical for horticultural operations
- **Action if low:** Underutilized assets; consider selling or reallocating

## Interpreting metrics

### Color coding system

Dashboard metrics use color to indicate status:

| Color | Meaning | Action |
|-------|---------|--------|
| 🟢 Green | On target or good performance | No action needed; monitor trends |
| 🟡 Yellow | Slightly off target or warning | Review cause; minor corrective action |
| 🔴 Red | Significantly off target or problem | Immediate attention required |
| ⚪ Gray | No data available or not applicable | May need additional configuration |

### Trend indicators

Each metric displays a small trend icon:

- **↑ Up arrow:** Positive trend (good for revenue; bad for expenses)
- **↓ Down arrow:** Negative trend (bad for revenue; good for expenses)
- **↔ Horizontal:** Flat trend; stable or no change

### Comparison references

Metrics often show comparison to:

- **Prior month:** Same metric last month for month-over-month (MoM) growth
- **Prior year:** Same period last year for year-over-year (YoY) growth
- **Budget:** Set values (if budget data is configured)
- **Industry benchmark:** Typical values for horticulture industry

Example: "Revenue: $485,500 (↑ 12% vs. March 2025, ↓ 3% vs. budget)"

## Drill-down capabilities

### Clicking through metrics

Most dashboard numbers are clickable links to underlying data:

1. Click a metric (e.g., "Revenue by Customer").
2. Detailed view opens showing:
   - Customer names with revenue amounts
   - Orders and shipments
   - Profitability by customer
   - Customer-specific trends
3. From detailed view, further drill down:
   - Click a customer name to see their orders
   - Click an order to see line items and profitability by product

### Example drill-down path

**Dashboard → Top Customers → Customer "ABC Growers" → Customer Orders → Order #12345 → Line Items**

This path lets you investigate: why is revenue down? → identify underperforming customer? → which products aren't selling?

### Creating custom reports from drill-down

After drilling down to detailed data:

1. Use **Export** to save data to Excel
2. Use **Create Report** to generate custom report
3. Schedule report delivery to stakeholders (if available)

## Customizing your view

### Rearranging dashboard widgets

To reorder sections:

1. Click **Edit Dashboard** button (if available).
2. Drag-and-drop widgets to rearrange sections.
3. Choose which metrics to display/hide.
4. Click **Save Changes**.

### Filtering by period

To view metrics for specific time period:

1. Look for **Date Range** filter at top of dashboard.
2. Predefined options:
   - **This Month**
   - **This Quarter**
   - **Year-to-Date**
   - **Last 12 Months**
   - **Custom Date Range** (select specific start/end dates)
3. Select option; dashboard updates automatically.

### Filtering by department or cost center

If available:

1. Look for **Department** or **Cost Center** filter.
2. Select specific department to see metrics for that area only.
3. Or select "All Departments" for company-wide view.

### Changing metric display options

Some metrics offer display options:

- **Chart type:** Switch between bar chart, line chart, pie chart
- **Sort:** Sort by value, date, or name (ascending/descending)
- **Aggregation:** Show totals, averages, or percentages

To change visualization:

1. Click the metric's **⋯** (More Options) menu.
2. Select display preference.
3. Chart updates to your preference.

## Refreshing data

### Manual refresh

To update dashboard data immediately:

1. Click **Refresh** button (often a circular arrow icon at top right).
2. Or press **F5** (Windows) or **Cmd+R** (Mac).
3. Dashboard data refreshes to current values.

### Automatic refresh

Dashboard may auto-refresh based on timer:

- Default: Every 5-15 minutes
- Check your company's configuration
- Auto-refresh provides latest data without manual action

### Data lag considerations

Dashboard data may be slightly delayed:

- **Real-time:** Cash position, year-to-date revenue (updated immediately)
- **Near-real-time:** Monthly data (updated hourly or daily)
- **Batch processed:** Historical trends (updated nightly or weekly)

If exact current value needed, check source system directly.

## Troubleshooting

### Issue: Dashboard loads slowly or times out

**Problem:** Dashboard takes >30 seconds to load or shows timeout error.

**Causes:**
- Large date range selected (requesting lots of historical data)
- Network connectivity issues
- System under heavy load

**Solutions:**
1. Use shorter date range (current month vs. last 3 years)
2. Refresh browser; clear cache
3. Try again during off-hours
4. Contact IT support if persistent

### Issue: Metrics show $0 or no data

**Problem:** Dashboard displays blank or all zeros.

**Causes:**
- Date range has no transactions
- User doesn't have permission to view financial data
- Data not yet loaded/processed

**Solutions:**
1. Check date range (switch to Last 12 Months if current week empty)
2. Verify you have Finance access; contact administrator if needed
3. Check that data has been entered in the system
4. Wait until end-of-day data processing (if just after transaction time)

### Issue: Cannot drill down to detailed data

**Problem:** Clicking on a metric does nothing or opens wrong page.

**Solutions:**
1. Verify the metric is clickable (should show cursor change on hover)
2. Try double-clicking instead of single click
3. Refresh page and try again
4. Check browser for pop-up blocker (detailed view may open new window)

### Issue: Custom filters not working

**Problem:** Selecting a filter doesn't update the dashboard.

**Solutions:**
1. Click **Apply Filter** or **Go** button if present
2. Refresh the page
3. Clear browser cache and try again
4. Try different filter combinations

## FAQ

**Q: How often is dashboard data updated?**
A: Near-real-time for key metrics (within hours). Some metrics refresh nightly during batch processing. Use **Refresh** button to get latest data immediately.

**Q: Who can see the Finance Dashboard?**
A: Typically Finance managers and executives with appropriate permissions. Department managers may see their cost center metrics only. Contact IT administrator about access.

**Q: Can I download the dashboard as a report?**
A: Yes. Look for **Export** or **Print** option on dashboard. Formats typically include PDF or Excel. Exported reports are snapshots at the time exported.

**Q: What if a metric seems wrong or doesn't match my records?**
A: Use drill-down capability to inspect underlying data. May be transaction timing (invoices posted but not yet received payment). Discuss discrepancies with Finance team.

**Q: Can I set up alerts for when metrics miss targets?**
A: Depends on system configuration. Check with IT administrator about alert capabilities. Dashboard may highlight red-flagged items in Alerts section.

**Q: How do I interpret negative numbers on the dashboard?**
A: Negative typically indicates loss or expense. For example, negative Net Income = company lost money; negative Cash Flow = cash decreased. Context matters; review specific metric definition.

**Q: Can I share a dashboard data with someone without system access?**
A: Yes. Use **Export** to save as Excel or PDF, then email/share. Or request they be granted system access for direct viewing.

**Q: Why does my Dashboard look different from my colleague's?**
A: May be different roles/permissions showing different metrics, or customization (your custom filters/layout). Contact them or IT to compare access.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/finance-dashboard-user-guide.pdf)
