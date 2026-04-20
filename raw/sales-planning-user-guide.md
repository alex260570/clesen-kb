# Sales Planning User Guide

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Creating Sales Targets](#creating-sales-targets)
4. [Managing Hierarchical Targets](#managing-hierarchical-targets)
5. [Weekly Target Breakdowns](#weekly-target-breakdowns)
6. [Approval Workflow](#approval-workflow)
7. [Bulk Operations](#bulk-operations)
8. [Reporting and Analysis](#reporting-and-analysis)
9. [Integration with Blanket Orders](#integration-with-blanket-orders)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The Sales Planning module enables salespeople and managers to set, track, and manage annual sales targets with seasonal and weekly breakdowns. The system provides:

- **Hierarchical Target Structure**: Organize targets by customer with seasonal detail
- **Weekly Breakdown**: Distribute seasonal targets across weeks with cumulative tracking
- **Approval Workflow**: Manager approval process for target commitments
- **Performance Tracking**: Real-time comparison against prior year revenue and current bookings
- **GAP Analysis**: Automatic calculation of target vs actual performance
- **Blanket Order Integration**: Link targets to blanket orders for streamlined execution

### Key Concepts

- **Headline Row**: Aggregated view showing total targets across all seasons for a customer
- **Detail Row**: Individual seasonal targets (Spring, Summer, Fall, Winter)
- **Financial Season**: Fiscal season aligned with company financial calendar
- **Approval Status**: Open → Approval Requested → Approved/Declined
- **Sales Line History**: Tracks every change to sales orders for accurate performance measurement

---

## Getting Started

### Accessing Sales Planning

1. Open **CLE Salesperson Planning** page
2. The system displays existing targets in a tree view structure
3. Use the tree view controls to expand/collapse customer groups

### Understanding the Interface

The Sales Planning worksheet displays:

**Column Structure:**
- **Year**: Target year (e.g., 2026)
- **Customer No.**: Customer identifier
- **Customer Name**: Customer business name
- **Financial Season**: Spring/Summer/Fall/Winter (or blank for headline)
- **Sales Target (LCY)**: Target revenue amount in local currency
- **Revenue prev. Year (LCY)**: Prior year revenue for comparison
- **Increase %**: Percentage increase/decrease vs prior year
- **Booked**: Current year revenue booked to date
- **GAP**: Difference between target and booked (Target - Booked)
- **Approval Status**: Open/Approval requested/Approved/Declined

**Grid Totals:**
- Total Sales Target across all rows
- Total Revenue previous Year
- Total Increase %

---

## Creating Sales Targets

### Method 1: Insert My Customers (Recommended)

This method creates headline and detail rows for all your customers at once.

1. Click **Actions → Functions → Insert My Customers**
2. Choose your options:
   - **Create with Prior Year Revenue**: Automatically populate "Revenue prev. Year" from Sales Line History
   - **Use Prior Year Allocation**: Distribute targets across seasons based on prior year's seasonal split
   - **Default Increase %**: Apply a uniform percentage increase (e.g., 10% growth)
3. Click **OK**
4. The system creates:
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
   - **Year**: Target year
   - **Customer No.**: Select customer
   - **Financial Season**: Leave blank for headline, or select specific season
   - **Sales Target (LCY)**: Enter target amount
3. Press **Enter** to save

**For Detail Rows:**
- Create headline first (blank season)
- Then create detail rows for each season
- The system automatically calculates headline totals

---

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
- Click the **▶** arrow next to headline to expand
- Click the **▼** arrow to collapse
- Use **Ctrl+Click** to expand/collapse all customers

**Indentation:**
- Headline rows: No indentation
- Detail rows: Single-level indentation

### Adjusting Targets

**Editing Detail Rows:**
1. Navigate to the detail row (e.g., Spring)
2. Click in the **Sales Target (LCY)** field
3. Enter new amount
4. Press **Enter**
5. The headline row updates automatically

**Using Increase %:**
1. Enter a percentage in **Increase %** field
2. Press **Enter**
3. The system calculates: New Target = Revenue prev. Year × (1 + Increase %)
4. Detail rows update proportionally

**Example:**
- Prior Year Revenue: $400,000
- Enter Increase %: 15%
- New Target: $400,000 × 1.15 = $460,000
- System distributes across seasons based on prior allocation

---

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
  - **Week No.**: Calendar week number
  - **Week Start/End Date**: Date range
  - **Season Target**: Total season target (same for all weeks in season)
  - **Week Target (LCY)**: Target amount for this week
  - **Week Target %**: This week's target as % of season total
  - **Current Week Target**: Cumulative % through this week

### Setting Weekly Targets

**Method 1: Even Distribution (Default)**
- System automatically divides season target evenly across weeks
- Example: $120,000 season / 12 weeks = $10,000/week

**Method 2: Custom Weekly %**
1. Open **Sales Target by Week** page
2. Enter **Week Target %** for each week
3. System calculates dollar amount: Week Target = Season Target × Week %
4. **Important**: Week Target % is cumulative and must increase week over week

**Example - Ramping Up:**
```
Week 1:  5% cumulative  ($6,000)
Week 2: 12% cumulative  ($14,400 total, $8,400 this week)
Week 3: 22% cumulative  ($26,400 total, $12,000 this week)
...
Week 12: 100% cumulative ($120,000 total)
```

### Validations

**Cannot Modify Past Weeks:**
- Once a week's end date has passed, Week Target % becomes read-only
- This prevents retroactive changes to historical targets

**Cumulative % Must Increase:**
- Each week's cumulative % must be ≥ previous week
- System validates on entry
- Prevents target decreases mid-season

---

## Approval Workflow

Sales targets must be approved by management before becoming committed targets.

### Approval Status Flow

```
Open → Approval Requested → Approved (or Declined) → Open (if reopened)
```

### Requesting Approval

1. Select one or more target rows (headline or detail)
2. Click **Actions → Request Approval**
3. System performs validations:
   - Targets must have amounts
   - Cannot request approval for already approved targets
4. Status changes to **Approval Requested**
5. Email notification sent to manager with target details

**Email Contains:**
- Salesperson name
- Customer details
- Target amounts by season
- Prior year comparison
- Increase %

### Manager Approval

**Approving Targets:**
1. Manager opens **CLE Salesperson Planning** (filtered to their team)
2. Selects rows with Status = **Approval Requested**
3. Clicks **Actions → Approve selected Lines**
4. System validates manager permissions
5. Status changes to **Approved**
6. **Approved Target** field is populated with approved amount

**Declining Targets:**
1. Select rows with Status = **Approval Requested**
2. Click **Actions → Decline selected Lines**
3. Status changes to **Declined**
4. Salesperson must revise and resubmit

**Reopening Approved Targets:**
1. Select rows with Status = **Approved**
2. Click **Actions → Reopen Lines**
3. Status changes back to **Open**
4. Allows for target revisions
5. **Warning**: Reopening resets approval, requires re-approval

### Reducing Approved Targets

**Special Validation:**
- When you reduce a target that's already approved, system displays warning
- Manager must re-approve the revised target
- This prevents unauthorized target reductions

**Example Scenario:**
1. Original Target: $500,000 (Approved)
2. Salesperson changes to $450,000
3. System warns: "You are reducing an approved target"
4. Status automatically changes to **Open**
5. Must request approval again

---

## Bulk Operations

### Bulk Update Targets

Use this to apply percentage changes across multiple targets at once.

1. Click **Actions → Functions → Bulk Update**
2. Set filters (optional):
   - **Season Filter**: Update only specific season (e.g., Spring)
   - **Year Filter**: Specify target year
   - **Customer Filter**: Limit to specific customers
3. Choose update method:
   - **Increase by %**: Add percentage to existing targets
   - **Decrease by %**: Subtract percentage from existing targets
   - **Set to %**: Override with new percentage vs prior year
4. Enter percentage value
5. Click **OK**
6. System shows progress dialog with count of updated records

**Example - Increase All Spring Targets by 5%:**
- Filter: Season = Spring, Year = 2026
- Method: Increase by %
- Value: 5
- Result: All Spring 2026 targets increase by 5%

**Example - Set All Targets to 10% Growth:**
- Filter: Year = 2026
- Method: Set to %
- Value: 10
- Result: All 2026 targets become Prior Year × 1.10

### Bulk Delete

1. Select multiple rows using **Ctrl+Click** or **Shift+Click**
2. Click **Actions → Functions → Delete Line**
3. Confirm deletion
4. System deletes selected targets and associated weekly breakdowns

**Warning**: This action cannot be undone. Deleted targets and weekly data are permanently removed.

---

## Reporting and Analysis

### Performance Metrics

**Revenue prev. Year (LCY):**
- Automatically calculated from Sales Line History
- Includes all sales lines from prior year for this customer
- Updates as historical data changes
- Formula: Sum of Line Amount (LCY) for matching year/customer/season

**Booked:**
- Current year revenue booked to date
- Includes all sales orders (confirmed, not necessarily shipped)
- Real-time calculation from Sales Line History
- Formula: Sum of Line Amount (LCY) for current year/customer/season

**GAP:**
- Difference between target and actual bookings
- Formula: Sales Target (LCY) - Booked
- Positive GAP = Need more bookings
- Negative GAP = Exceeded target

**Increase %:**
- Percentage change from prior year
- Formula: ((Sales Target - Revenue prev. Year) / Revenue prev. Year) × 100
- Can be positive (growth) or negative (decline)

### Grid Totals

The bottom of the worksheet displays aggregated totals:
- **Total Sales Target**: Sum of all Sales Target (LCY) in view
- **Total Revenue previous Year**: Sum of all Revenue prev. Year
- **Total Increase %**: Calculated from totals

**Use Cases:**
- View total team target
- Compare year-over-year performance
- Track overall growth percentage

### Filtering and Sorting

**Filter by Status:**
1. Click filter icon in **Approval Status** column
2. Select status(es): Open, Approval Requested, Approved, Declined
3. View only targets in selected state

**Filter by Season:**
1. Click filter icon in **Financial Season** column
2. Select season(s): Spring, Summer, Fall, Winter, or blank (headlines)
3. Focus on specific seasonal targets

**Sort by GAP:**
1. Click **GAP** column header
2. Identify customers furthest from target
3. Prioritize sales efforts

---

## Integration with Blanket Orders

Blanket Sales Orders are standing orders used to fulfill seasonal targets.

### Blanket Order Enhancements

**Speed Entry:**
1. Open blanket order
2. Click **Actions → Speed Entry**
3. Rapid line entry mode activated
4. Enter items quickly without tab navigation

**Add Lines to Existing Order:**
1. From blanket order, click **Actions → Add Lines to existing Order**
2. Select target sales order
3. System copies blanket lines to order
4. Quantities update automatically

**Correct Remaining Quantity:**
1. Click **Actions → Reports → Correct Remaining Quantity**
2. System analyzes blanket vs actual usage
3. Generates report of discrepancies
4. Helps maintain accurate targets

### Blanket Quantity Tracking

**On Blanket Lines:**
- **CLE Blanket Qty.Used**: Total quantity released to sales orders
- **CLE Blanket Qty.Remaining**: Quantity still available for release
- Click drilldown to see detailed usage history

### Linking to Targets

**Sales Line History Integration:**
- All sales order lines created from blankets are tracked
- Booking Date and Shipment Date recorded
- Financial Season automatically assigned
- Feeds into "Booked" calculation in Sales Planning

**Workflow:**
1. Create Sales Target for customer/season
2. Set up Blanket Sales Order with items
3. Release sales orders from blanket throughout season
4. Sales Line History captures bookings
5. "Booked" field in Sales Planning updates automatically
6. Monitor GAP to track progress against target

---

## Best Practices

### Target Setting

**Use Historical Data:**
- Review "Revenue prev. Year" before setting targets
- Understand seasonal patterns in customer buying behavior
- Account for business cycle changes

**Season-Based Planning:**
- Different customers have different seasonal patterns
- Adjust seasonal mix based on product availability
- Consider industry-specific peak seasons (e.g., Spring for garden centers)

**Weekly Breakdowns:**
- Set weekly targets early in the season
- Use cumulative percentages to show ramp-up patterns
- Adjust mid-season only for exceptional circumstances

### Approval Management

**Before Requesting Approval:**
- Verify all amounts are correct
- Review prior year comparison
- Ensure seasonal split makes sense
- Check that increase % aligns with business goals

**For Managers:**
- Review team targets weekly during planning season
- Approve/decline promptly to avoid delays
- Document reasons for declining targets
- Monitor reopened targets for pattern analysis

### Performance Tracking

**Weekly Review:**
- Check "Booked" vs "Sales Target" each week
- Identify customers with large negative GAP
- Prioritize sales calls based on GAP analysis
- Adjust weekly targets if business conditions change

**Monthly Analysis:**
- Compare actual to target by season
- Review approval status distribution
- Analyze increase % vs actual growth rates
- Report findings to management

### Data Maintenance

**Annual Rollover:**
- Complete prior year approval process before year-end
- Archive approved targets for record-keeping
- Create new year targets using "Insert My Customers"
- Use prior year data to inform new targets

**Regular Cleanup:**
- Delete abandoned targets (status = Open, no activity)
- Consolidate duplicate customer entries
- Verify blanket order linkages
- Review and correct misaligned seasons

---

## Troubleshooting

### Headline Row Not Updating

**Symptom**: Changed detail row target, but headline doesn't reflect new total.

**Solution**:
1. Verify detail rows belong to same customer and year
2. Check that headline row exists (Season = blank)
3. Close and reopen the page to refresh
4. If issue persists, contact IT support

### Cannot Request Approval

**Symptom**: Request Approval button is disabled or produces error.

**Possible Causes:**
- Target amount is zero or blank
- Row is already in Approval Requested or Approved status
- User lacks permission to request approval

**Solution**:
1. Verify Sales Target (LCY) has a value
2. Check Approval Status is "Open"
3. Confirm user is assigned as salesperson on the target
4. Contact IT if permissions issue persists

### Revenue prev. Year is Zero

**Symptom**: Revenue prev. Year shows $0.00 but customer had sales last year.

**Possible Causes:**
- Sales Line History not populated for prior year
- Salesperson code mismatch between target and historical sales
- Financial season assignment incorrect in history
- Customer number changed

**Solution**:
1. Verify Sales Line History exists for prior year
2. Check salesperson code on historical sales lines
3. Confirm financial season calculations are correct
4. Contact IT to review data import/calculation procedures

### Weekly Breakdown Errors

**Symptom**: Cannot save weekly targets, validation errors appear.

**Possible Causes:**
- Cumulative Week Target % is not increasing week-over-week
- Trying to modify past week (week end date has passed)
- Week Target % exceeds 100%

**Solution**:
1. Ensure each week's cumulative % is ≥ previous week
2. Do not modify weeks in the past
3. Verify final week's cumulative % = 100%
4. Recalculate if season target changed

### Blanket Order Quantities Don't Match

**Symptom**: CLE Blanket Qty.Used doesn't match actual sales orders.

**Possible Causes:**
- Sales orders created manually (not from blanket)
- Quantity corrections made after release
- Blanket line deleted/recreated

**Solution**:
1. Run "Correct Remaining Quantity" report
2. Compare report to actual sales orders
3. Manually adjust blanket quantities if needed
4. Contact IT for data reconciliation

### Bulk Update Didn't Apply

**Symptom**: Ran bulk update but targets didn't change.

**Possible Causes:**
- Filters excluded target rows
- Targets were in Approved status (protected)
- Calculation resulted in same value

**Solution**:
1. Clear all filters and retry
2. Reopen approved targets before bulk update
3. Verify percentage and method are correct
4. Check progress dialog for count of updated records

---

## Summary

The Sales Planning module provides a comprehensive framework for setting, tracking, and managing sales targets with built-in approval workflow, historical comparison, and performance monitoring. Key features include:

- Hierarchical target structure with automatic aggregation
- Seasonal and weekly target breakdowns
- Manager approval workflow with email notifications
- Real-time performance tracking (Booked vs Target)
- GAP analysis for prioritizing sales efforts
- Bulk operations for efficient target management
- Integration with Blanket Orders and Sales Line History

For additional assistance, contact your IT department or system administrator.

---

## Related documents

- [[sales-planning-it-troubleshooting-guide]]
