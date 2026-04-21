---
title: Sales Planning — Target Management
type: howto
tags: [sales-planning, sales-targets, sales-forecasting]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-planning-user-guide.md]
---

# Sales Planning — Target Management

Module for setting, tracking, and managing annual sales targets with seasonal and weekly breakdowns.

## Overview

**Purpose:** Enable salespeople and managers to set, track, and manage annual sales targets

**Capabilities:**
- **Hierarchical Target Structure:** Organize targets by customer with seasonal detail
- **Weekly Breakdown:** Distribute seasonal targets across weeks with cumulative tracking
- **Approval Workflow:** Manager approval process for target commitments
- **Performance Tracking:** Real-time comparison against prior year revenue and current bookings
- **GAP Analysis:** Automatic calculation of target vs actual performance
- **Blanket Order Integration:** Link targets to blanket orders for streamlined execution

### Key Concepts

| Concept | Meaning | Example |
|---------|---------|---------|
| **Headline Row** | Aggregated view showing total targets across all seasons for a customer | Customer 10000: $500,000 (all seasons combined) |
| **Detail Row** | Individual seasonal targets | Customer 10000 - Spring: $125,000 |
| **Financial Season** | Fiscal season aligned with company financial calendar | Spring, Summer, Fall, Winter |
| **Approval Status** | Workflow state of target | Open → Approval Requested → Approved/Declined |
| **Sales Line History** | Tracks every change to sales orders for accurate performance measurement | See [[sales-process-history]] |

## Getting Started

### Accessing Sales Planning

1. Open **CLE Salesperson Planning** page
2. System displays existing targets in a tree view structure
3. Use tree view controls to expand/collapse customer groups

### Understanding the Interface

**Column Structure:**

| Column | Description | Example |
|--------|-------------|---------|
| **Year** | Target year | 2026 |
| **Customer No.** | Customer identifier | CUST-001 |
| **Customer Name** | Customer business name | Acme Wholesale |
| **Financial Season** | Spring/Summer/Fall/Winter (or blank for headline) | Spring |
| **Sales Target (LCY)** | Target revenue amount in local currency | $125,000 |
| **Revenue prev. Year (LCY)** | Prior year revenue for comparison | $112,500 |
| **Increase %** | Percentage increase/decrease vs prior year | 11.1% |
| **Booked** | Current year revenue booked to date | $85,000 |
| **GAP** | Difference between target and booked (Target - Booked) | $40,000 |
| **Approval Status** | Open/Approval requested/Approved/Declined | Approved |

**Grid Totals:**
- Total Sales Target across all rows
- Total Revenue previous Year
- Total Increase %

## Creating Sales Targets

### Method 1: Insert My Customers (Recommended)

This method creates headline and detail rows for all your customers at once.

**Process:**
1. Click **Actions → Functions → Insert My Customers**
2. Choose your options:
   - **Create with Prior Year Revenue:** Automatically populate "Revenue prev. Year" from Sales Line History
   - **Use Prior Year Allocation:** Distribute targets across seasons based on prior year's seasonal split
   - **Default Increase %:** Apply a uniform percentage increase (e.g., 10% growth)
3. Click **OK**

**System creates:**
- One headline row per customer (blank season)
- Four detail rows per customer (Spring, Summer, Fall, Winter)

**Example Result:**
```
Customer 10000 - Headline       | $500,000 | $450,000 | 11.1%
  ↳ Customer 10000 - Spring     | $125,000 | $112,500 | 11.1%
  ↳ Customer 10000 - Summer     | $150,000 | $135,000 | 11.1%
  ↳ Customer 10000 - Fall       | $125,000 | $112,500 | 11.1%
  ↳ Customer 10000 - Winter     | $100,000 | $ 90,000 | 11.1%
```

### Method 2: Manual Entry

1. Click **+New** or press **Ctrl+N**
2. Enter:
   - **Year:** Target year
   - **Customer No.:** Select customer
   - **Financial Season:** Leave blank for headline, or select specific season
   - **Sales Target (LCY):** Enter target amount
3. Press **Enter** to save

**For Detail Rows:**
- Create headline first (blank season)
- Then create detail rows for each season
- System automatically calculates headline totals

## Managing Hierarchical Targets

### Headline vs Detail Rows

**Headline Row (Season = Blank):**
- Automatically aggregates all detail rows for that customer
- Shows total annual target across all seasons
- Cannot be manually edited if detail rows exist
- Displays in **bold** in the tree view

**Detail Row (Season = Spring/Summer/Fall/Winter):**
- Represents target for specific season
- Can be edited independently
- Updates propagate to headline automatically
- Displays indented under headline

### Tree View Navigation

**Expand/Collapse:**
- Click **▶** arrow next to headline to expand
- Click **▼** arrow to collapse
- Use **Ctrl+Click** to expand/collapse all customers

**Indentation:**
- Headline rows: No indentation
- Detail rows: Single-level indentation

### Adjusting Targets

**Editing Detail Rows:**
1. Navigate to the detail row (e.g., Spring)
2. Click in **Sales Target (LCY)** field
3. Enter new amount
4. Press **Enter**
5. Headline row updates automatically

**Using Increase %:**
1. Enter a percentage in **Increase %** field
2. Press **Enter**
3. System calculates: New Target = Revenue prev. Year × (1 + Increase %)
4. Detail rows update proportionally

**Example:**
- Prior Year Revenue: $400,000
- Enter Increase %: 15%
- New Target: $400,000 × 1.15 = $460,000
- System distributes across seasons based on prior allocation

## Weekly Target Breakdowns

Each seasonal target can be broken down into weekly targets to track progress more granularly.

### Viewing Weekly Breakdown

1. Select a detail row (not headline)
2. Click **Navigate → Sales Target by Week**
3. The weekly breakdown page opens

### Understanding Weekly Targets

**Week Structure:**
- Each financial season is divided into weeks
- Weeks are numbered according to company calendar (1-52)
- Each week shows:
  - **Week No.:** Calendar week number
  - **Week Start/End Date:** Date range
  - **Season Target:** Total season target (same for all weeks in season)
  - **Week Target (LCY):** Target amount for this week
  - **Week Target %:** This week's target as % of season total
  - **Current Week Target:** Cumulative % through this week

### Setting Weekly Targets

**Method 1: Even Distribution (Default)**
- System automatically divides season target evenly across weeks
- Example: $120,000 season / 12 weeks = $10,000/week

**Method 2: Custom Weekly %**
1. Open **Sales Target by Week** page
2. Enter **Week Target %** for each week
3. System calculates dollar amount: Week Target = Season Target × Week %
4. **Important:** Week Target % is cumulative and must increase week over week

**Example - Ramping Up:**
```text
Week 1:  5% cumulative  | $6,000  (ramping up - early season)
Week 2: 12% cumulative  | $8,400
Week 3: 22% cumulative  | $12,000
Week 4: 35% cumulative  | $15,600
Week 5: 50% cumulative  | $18,000 (peak season)
...
Week 12: 100% cumulative | remaining balance
```

## Approval Workflow

### Target Status States

| Status | Meaning | Next Action |
|--------|---------|-------------|
| **Open** | Draft, not yet submitted | Request Approval |
| **Approval Requested** | Submitted for manager review | Manager approves/declines |
| **Approved** | Manager confirmed target | Use for tracking |
| **Declined** | Manager rejected target | Revise and resubmit |

### Requesting Approval

1. Complete all target rows (headline + details)
2. Click **Actions → Request Approval**
3. Select manager approval group
4. System sends notification to designated approvers
5. Status changes to "Approval Requested"

**Approval Details Sent:**
- Target amounts by season
- Prior year comparison
- Increase percentages
- Weekly breakdown (if completed)

### Manager Approval Process

**For Managers:**
1. Review submitted targets
2. Check reasonableness vs. history
3. Validate against company growth goals
4. Click **Approve** or **Decline**

**If Approved:**
- Status changes to "Approved"
- Targets become active for tracking
- Available for blanket order linkage

**If Declined:**
- Status changes to "Declined"
- Returned to salesperson with feedback
- Salesperson revises and resubmits

## Performance Tracking

### Real-Time Metrics

**Booked Amount:**
- Current year revenue from [[sales-process-history]]
- Shows sales already closed/invoiced
- Updated in real-time as orders post

**GAP Amount:**
- Calculated as: Target - Booked
- Positive GAP = Still need to achieve
- Negative GAP = Exceeded target

**Booked %:**
- Calculated as: Booked / Target × 100%
- Shows progress toward target
- 100% = Target achieved

**Prior Year Comparison:**
- Displays revenue from previous year
- Enables % growth calculation
- Baseline for setting targets

### Seasonal Analysis

**Using Financial Seasons:**
1. Expand customer headline to see seasonal detail
2. Compare seasonal targets year-over-year
- Spring 2025 vs Spring 2026
- Identify seasonal trends
- Plan for peak/low seasons

**By-Week Analysis:**
1. Click **Sales Target by Week** for detail row
2. View week-by-week target vs booked
3. Identify weeks falling behind
4. Take action to catch up

## Blanket Order Integration

**Purpose:** Link sales targets to blanket orders for streamlined execution

**How It Works:**
1. Create blanket order with customer
2. Link to approved sales target
3. System tracks releases against target
4. Blanket order quantities tied to seasonal targets

**Benefits:**
- Ensure orders fulfill targets
- Automatic fulfillment tracking
- Simplifies order generation
- Maintains target compliance

## Best Practices

✅ **DO:**
- Use "Insert My Customers" to start (faster than manual)
- Set prior year revenue baseline (enables % growth calculations)
- Distribute targets across seasons based on historical patterns
- Request approval promptly (don't wait until deadline)
- Review booked vs target weekly
- Adjust targets if business conditions change
- Use weekly breakdown for high-value customers
- Document target changes for audit trail

❌ **DON'T:**
- Set unrealistic targets (damages credibility)
- Change approved targets without resubmitting
- Ignore declining targets (address gaps early)
- Leave targets in "Open" status indefinitely
- Forget to request approval before using targets
- Create targets without prior year baseline
- Overlook seasonal variations
- Miss weekly targets without action

## Common Scenarios

### Scenario 1: Create Annual Targets for New Salesperson

**Steps:**
1. Click **Insert My Customers**
2. Select **Create with Prior Year Revenue** = YES
3. Set **Default Increase %** = 5%
4. Click OK
5. System creates headline + 4 seasonal detail rows
6. Review and adjust seasonal allocations
7. Request Approval
8. Manager reviews and approves

**Result:** Ready to track performance against targets

### Scenario 2: Analyze Mid-Year Performance

**Steps:**
1. Open **CLE Salesperson Planning**
2. Check **Booked** vs **Sales Target** by season
3. Calculate GAP for each customer
4. Identify customers exceeding targets (top performers)
5. Identify customers falling behind (need action)
6. Click **Sales Target by Week** for detail
7. See which weeks are lagging
8. Plan action to catch up in remaining weeks

### Scenario 3: Adjust Targets Due to Market Change

**Steps:**
1. Open affected detail row
2. Change **Sales Target (LCY)** to new amount
3. Click **Request Approval**
4. Manager reviews justification
5. Approved → New target takes effect
6. System recalculates booked vs target (GAP)
7. Weekly breakdown remains but may need adjustment

## Troubleshooting

### Issue: Cannot Approve Targets

**Cause:** Approval Status incorrect or not in approval group

**Solution:**
- Check status is "Approval Requested"
- Verify user is in approval group
- Contact administrator if permission issue

### Issue: Prior Year Revenue Not Populating

**Cause:** Sales Line History not enabled OR no prior year sales exist

**Solution:**
- Verify Sales Line Tracking is enabled (see [[sales-process-history]])
- Check if customer had sales in prior year
- Manually enter prior year revenue

### Issue: Weekly Breakdown Not Adding Up

**Cause:** Week Target % not cumulative or > 100%

**Solution:**
- Ensure each week's % is greater than previous week
- Final week should = 100%
- System will error if incorrect; fix percentages

## Related Pages

- [[sales-order-management]] — Creating orders to fulfill targets
- [[sales-process-history]] — Tracking sales for accuracy
- [[order-lock]] — Locking orders in picking workflow
