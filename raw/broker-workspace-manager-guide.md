# Broker Workspace - Manager Guide

**Version:** 1.0  
**Last Updated:** February 13, 2026  
**Audience:** Purchasing Managers, Department Heads, Operations Managers  

---

## Table of Contents

1. [Overview](#overview)
2. [Management Responsibilities](#management-responsibilities)
3. [Monitoring Buyer Activity](#monitoring-buyer-activity)
4. [Change Log Analysis](#change-log-analysis)
5. [Exception Handling](#exception-handling)
6. [Vendor Performance Tracking](#vendor-performance-tracking)
7. [Training and Best Practices](#training-and-best-practices)
8. [Reporting and Analytics](#reporting-and-analytics)
9. [System Configuration](#system-configuration)
10. [Troubleshooting and Support](#troubleshooting-and-support)

---

## Overview

### Management Role

As a purchasing manager, the Broker Workspace provides visibility into:
- What buyers are planning to purchase
- Changes made before applying to orders
- Vendor performance and delivery reliability
- Inventory availability trends
- Purchasing patterns and seasonality

### Key Management Functions

**Daily Oversight:**
- Monitor pending worksheet changes
- Review change logs
- Approve large orders (policy dependent)
- Handle escalations

**Weekly Reviews:**
- Buyer performance metrics
- Vendor delivery compliance
- Inventory accuracy
- Forecast vs. actual analysis

**Monthly Strategic:**
- Vendor negotiations using data
- Buyer training needs
- Process improvements
- Budget tracking

### System Access Requirements

**Manager Permissions Needed:**
- Read access to all buyers' worksheets
- View change logs (all users)
- Edit purchase orders (for corrections)
- Run SQL queries (for reporting)
- Access user setup (for assignments)

---

## Management Responsibilities

### Buyer Assignment Management

**User Setup Configuration:**

Each buyer must have:
- **User ID** - Their BC login
- **Salespers./Purch. Code** - Links them to vendors/items
- **Purchasing Agent** checkbox - Enabled
- **Email** - For automated notifications

**Vendor Assignment:**
```
Vendor Card:
- Purchaser Code = Buyer's Code
- This makes vendor appear in buyer's %my filter
```

**Item Assignment:**
```
Item Card:
- Purchasing Code = Buyer's Code
- This makes item appear in buyer's %my filter
```

**Best Practice:** Assign items/vendors by category or region, not alphabetically. This ensures specialized knowledge.

### Approval Workflows

**Define Approval Thresholds:**

| Scenario | Auto-Apply | Manager Approval |
|----------|------------|------------------|
| Order < $5,000 | ✓ | After apply (review) |
| Order $5,000-$20,000 | ✓ | Before apply (monitor log) |
| Order > $20,000 | ✗ | Before apply (manual review) |
| New vendor | ✗ | Always approve |
| Date change > 2 weeks | ✗ | Approve if affects deliveries |
| Cancel/reduce > 50% | ✗ | Approve + vendor notice |

**Implementation:**
- Policy document for buyers
- Change log review daily
- Exception reports for large changes

### Policy Enforcement

**Standard Operating Procedures:**

1. **Minimum Order Quantities**
   - Define per vendor (e.g., $500 minimum)
   - Buyers must consolidate small orders
   - Exception: Rush orders

2. **Lead Time Requirements**
   - Standard items: 2-week minimum
   - Special order: 4-week minimum
   - Rush: Manager approval + vendor confirmation

3. **Vendor Selection**
   - Primary vendor first
   - Alternate vendor if:
     - Primary unavailable
     - Better pricing (>10% savings)
     - Manager approved

4. **Cart Quantity Limits**
   - Standard shipment: <40 carts
   - Over 40: Split PO or arrange special delivery
   - Document transportation arrangements

5. **Forecast Adherence**
   - Orders should align ±10% of forecast
   - Major variances require explanation
   - Monthly forecast review with buyers

---

## Monitoring Buyer Activity

### Daily Monitoring Routine

#### Step 1: Review Pending Changes

**SQL Query: Pending Worksheet Changes**

```sql
SELECT 
    [User ID] AS Buyer,
    COUNT(*) AS [Pending Lines],
    SUM([Purch. Line Quantity Adj_]) AS [Total Qty Change],
    MIN([Requested Receipt Date]) AS [Earliest Date],
    MAX([Requested Receipt Date]) AS [Latest Date]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
WHERE [Line Modified] = 1
GROUP BY [User ID]
ORDER BY [Total Qty Change] DESC
```

**What to look for:**
- Buyers with >50 pending lines (may need help or training)
- Large quantity changes (>1000 units)
- Dates in past or >90 days out

#### Step 2: Review Unapplied Changes Over 24 Hours

**SQL Query: Stale Worksheet Lines**

```sql
SELECT 
    ws.[User ID] AS Buyer,
    ws.[Item No_],
    ws.[Item Description],
    ws.[Vendor No_],
    ws.[Purch_ Line Quantity Adj_] AS [Qty Change],
    log.[Entry No_],
    log.[Change],
    log.[Created DateTime] AS [Pending Since]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
INNER JOIN [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
    ON ws.[Entry No_] = log.[Worksheet Entry No_]
    AND ws.[User ID] = log.[User ID]
WHERE ws.[Line Modified] = 1
    AND log.[Change Applied] = 0
    AND log.[Created DateTime] < DATEADD(hour, -24, GETDATE())
ORDER BY log.[Created DateTime]
```

**Actions:**
- Contact buyer to apply or explain delay
- May indicate indecision or problem
- Consider whether order should be cancelled

#### Step 3: Check for Duplicate Planning

**SQL Query: Multiple Buyers on Same Item**

```sql
SELECT 
    ws1.[Item No_],
    ws1.[Item Description],
    ws1.[Requested Receipt Date],
    ws1.[User ID] AS Buyer1,
    ws1.[Purch_ Line Quantity New] AS Qty1,
    ws2.[User ID] AS Buyer2,
    ws2.[Purch_ Line Quantity New] AS Qty2
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws1
INNER JOIN [Clesen Horticulture$CLE Purch_ Worksheet Line] ws2
    ON ws1.[Item No_] = ws2.[Item No_]
    AND ws1.[Requested Receipt Date] = ws2.[Requested Receipt Date]
    AND ws1.[User ID] < ws2.[User ID]
WHERE ws1.[Purch_ Line Quantity New] > 0
    AND ws2.[Purch_ Line Quantity New] > 0
```

**Risk:** Over-ordering same item by different buyers

**Actions:**
- Verify item assignments correct
- Coordinate buyers if legitimate overlap
- Consolidate orders to one buyer

### Weekly Activity Review

#### Buyer Performance Dashboard

**SQL Query: Weekly Buyer Statistics**

```sql
SELECT 
    log.[User ID] AS Buyer,
    COUNT(DISTINCT log.[Worksheet Entry No_]) AS [Lines Changed],
    SUM(CASE WHEN log.[Change] = 0 THEN 1 ELSE 0 END) AS [New Orders],
    SUM(CASE WHEN log.[Change] = 1 THEN 1 ELSE 0 END) AS [Qty Changes],
    SUM(CASE WHEN log.[Change] = 2 THEN 1 ELSE 0 END) AS [Date Changes],
    SUM(CASE WHEN log.[Change] = 3 THEN 1 ELSE 0 END) AS [Vendor Changes],
    SUM(CASE WHEN log.[Change] = 4 THEN 1 ELSE 0 END) AS [Line Moves],
    SUM(CASE WHEN log.[Change Applied] = 1 THEN 1 ELSE 0 END) AS [Changes Applied],
    SUM(CASE WHEN log.[Change Applied] = 0 THEN 1 ELSE 0 END) AS [Still Pending]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
WHERE log.[Created DateTime] >= DATEADD(day, -7, GETDATE())
GROUP BY log.[User ID]
ORDER BY [Lines Changed] DESC
```

**Metrics to track:**
- Lines Changed: Buyer activity level
- New Orders: Proactive purchasing
- Vendor Changes: Flexibility or problems?
- Still Pending: Indecision or workload?

**Benchmarks:**
- Active buyer: 20-50 changes/week
- New buyer: 10-20 changes/week
- Low activity (<10): May need more items assigned or training
- High pending (>20): May be overwhelmed

#### Inventory Accuracy Trends

**SQL Query: Availability Forecast Accuracy**

```sql
-- Compare forecasted availability to actual (requires historical snapshot)
-- This query checks if worksheet predictions were accurate

SELECT 
    ws.[Item No_],
    ws.[Item Description],
    ws.[Exp_ Receipt Date],
    ws.[Qty_ Available] AS [Forecasted Avail],
    ws.[Cum_ Availability] AS [Forecasted Cum Avail],
    -- Would need actual inventory from ledger entries
    COALESCE(ile.Quantity, 0) AS [Actual Inventory]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
LEFT JOIN (
    SELECT [Item No_], SUM(Quantity) AS Quantity
    FROM [Clesen Horticulture$Item Ledger Entry]
    WHERE [Posting Date] <= GETDATE()
    GROUP BY [Item No_]
) ile ON ws.[Item No_] = ile.[Item No_]
WHERE ws.[Exp_ Receipt Date] <= GETDATE()
ORDER BY ABS(ws.[Qty_ Available] - COALESCE(ile.Quantity, 0)) DESC
```

**Look for:**
- Large discrepancies (>20%)
- Systematic over/under forecasting
- Specific items with accuracy problems

**Actions:**
- Review item setup (UOM conversions)
- Check for unposted transactions
- Verify demand calculation logic
- Train warehouse on posting timeliness

---

## Change Log Analysis

### Understanding Change Types

**Change Type Enum:**

| Value | Type | Description | Risk Level |
|-------|------|-------------|------------|
| 0 | New Order | Creating new PO | Medium |
| 1 | Quantity Change | Increasing/decreasing | Low-Medium |
| 2 | Date Change | Moving delivery date | Medium |
| 3 | Vendor Change | Switching vendors | High |
| 4 | Move Line | Moving to different PO | Medium |

### Critical Changes to Monitor

#### High-Value Orders

**SQL Query: Large Order Changes**

```sql
SELECT 
    log.[User ID] AS Buyer,
    log.[Item Description],
    log.[Change],
    CAST(log.[Old Value] AS INT) AS [Old Qty],
    CAST(log.[New Value] AS INT) AS [New Qty],
    CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT) AS [Qty Increase],
    i.[Last Direct Cost],
    (CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT)) * i.[Last Direct Cost] AS [Value Change],
    log.[Created DateTime],
    log.[Change Applied]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
INNER JOIN [Clesen Horticulture$Item] i 
    ON log.[Item Description] LIKE i.Description + '%'
WHERE log.[Change] = 1 -- Quantity Change
    AND CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT) > 0
    AND (CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT)) * i.[Last Direct Cost] > 10000
    AND log.[Created DateTime] >= DATEADD(day, -7, GETDATE())
ORDER BY [Value Change] DESC
```

**Review criteria:**
- Order > $10,000: Verify with buyer
- Order > $50,000: Requires your approval
- Unusual item/quantity combination

#### Vendor Changes

**SQL Query: Vendor Switch Analysis**

```sql
SELECT 
    log.[User ID] AS Buyer,
    log.[Item Description],
    log.[Old Value] AS [Old Vendor],
    log.[New Value] AS [New Vendor],
    log.[Created DateTime],
    log.[Change Applied],
    CASE 
        WHEN v1.[Blocked] != '' THEN 'Old vendor blocked'
        WHEN v1.[On Hold] != '' THEN 'Old vendor on hold'
        ELSE 'Normal switch'
    END AS [Reason]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
LEFT JOIN [Clesen Horticulture$Vendor] v1 ON log.[Old Value] = v1.[No_]
WHERE log.[Change] = 3 -- Vendor Change
    AND log.[Created DateTime] >= DATEADD(day, -30, GETDATE())
ORDER BY log.[Created DateTime] DESC
```

**Follow-up actions:**
- Verify reason for switch
- Check if pricing/terms maintained
- Update preferred vendor if permanent
- Document vendor performance issue

#### Date Changes Impacting Deliveries

**SQL Query: Significant Date Shifts**

```sql
SELECT 
    log.[User ID] AS Buyer,
    log.[Item Description],
    CAST(log.[Old Value] AS DATE) AS [Old Date],
    CAST(log.[New Value] AS DATE) AS [New Date],
    DATEDIFF(day, CAST(log.[Old Value] AS DATE), CAST(log.[New Value] AS DATE)) AS [Days Shifted],
    log.[Created DateTime],
    log.[Change Applied]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
WHERE log.[Change] = 2 -- Date Change
    AND ABS(DATEDIFF(day, CAST(log.[Old Value] AS DATE), CAST(log.[New Value] AS DATE))) > 14
    AND log.[Created DateTime] >= DATEADD(day, -7, GETDATE())
ORDER BY ABS(DATEDIFF(day, CAST(log.[Old Value] AS DATE), CAST(log.[New Value] AS DATE))) DESC
```

**Concerns:**
- Date moved earlier: Rush order? Stock out risk?
- Date moved later: Vendor delay? Customer impact?
- >30 days shift: Verify legitimacy

### Change Pattern Analysis

#### Frequent Changes to Same Items

**SQL Query: Items with High Change Frequency**

```sql
SELECT 
    log.[Item Description],
    COUNT(*) AS [Total Changes],
    COUNT(DISTINCT log.[User ID]) AS [Unique Buyers],
    SUM(CASE WHEN log.[Change] = 1 THEN 1 ELSE 0 END) AS [Qty Changes],
    SUM(CASE WHEN log.[Change] = 2 THEN 1 ELSE 0 END) AS [Date Changes],
    MIN(log.[Created DateTime]) AS [First Change],
    MAX(log.[Created DateTime]) AS [Last Change]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
WHERE log.[Created DateTime] >= DATEADD(day, -30, GETDATE())
GROUP BY log.[Item Description]
HAVING COUNT(*) > 10
ORDER BY [Total Changes] DESC
```

**Interpretation:**
- High change frequency = Unstable demand or forecasting issue
- Multiple buyers = Item assignment problem
- Many qty changes = Sizing problem (wrong UOM?)
- Many date changes = Vendor reliability issue

**Actions:**
- Review item demand pattern
- Verify forecast accuracy
- Check if item should have safety stock
- Consider alternative vendors

---

## Exception Handling

### Manager Intervention Scenarios

#### Scenario 1: Buyer Requests Over-Budget Purchase

**Workflow:**
1. Buyer notifies you of large order
2. Review change log entry (not yet applied)
3. Check budget remaining
4. Verify business justification
5. Approve or request adjustment
6. Document decision

**SQL Query: Buyer's Month-to-Date Spending**

```sql
SELECT 
    ph.[Buy-from Vendor No_],
    SUM(pl.Quantity * pl.[Direct Unit Cost]) AS [Total Amount],
    COUNT(DISTINCT ph.[No_]) AS [Number of Orders],
    ph.[Purchaser Code]
FROM [Clesen Horticulture$Purchase Header] ph
INNER JOIN [Clesen Horticulture$Purchase Line] pl 
    ON ph.[Document Type] = pl.[Document Type]
    AND ph.[No_] = pl.[Document No_]
WHERE ph.[Document Type] = 1 -- Order
    AND ph.[Order Date] >= DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0) -- Start of month
    AND ph.[Purchaser Code] = 'BUYER01' -- Replace with buyer code
GROUP BY ph.[Buy-from Vendor No_], ph.[Purchaser Code]
ORDER BY [Total Amount] DESC
```

#### Scenario 2: Vendor Delivery Failure

**Situation:** Vendor consistently delivers late or wrong quantities

**Steps:**
1. Document incidents (dates, orders, discrepancies)
2. Calculate impact (sales lost, customer complaints)
3. Meet with buyer and vendor
4. Options:
   - Vendor improvement plan (30-60 days)
   - Switch to alternate vendor (worksheet makes this easy)
   - Split business between vendors (risk mitigation)
5. Update vendor performance score

**Worksheet Action:**
- Find all orders for problem vendor
- Use "Change Vendor or Purchase Order" to move to alternate
- Apply changes
- Notify original vendor of change

#### Scenario 3: Inventory Shortage Despite Orders

**Situation:** Availability shows negative, but POs exist

**Diagnostic Steps:**

1. **Verify PO Status**
```sql
SELECT 
    pl.[No_] AS [Item No_],
    pl.[Document No_] AS [PO No_],
    pl.[Expected Receipt Date],
    pl.Quantity,
    pl.[Quantity Received],
    pl.[Outstanding Quantity],
    ph.Status
FROM [Clesen Horticulture$Purchase Line] pl
INNER JOIN [Clesen Horticulture$Purchase Header] ph 
    ON pl.[Document Type] = ph.[Document Type]
    AND pl.[Document No_] = ph.[No_]
WHERE pl.[No_] = 'ITEM123' -- Replace with problem item
    AND pl.[Document Type] = 1 -- Order
    AND pl.[Outstanding Quantity] > 0
ORDER BY pl.[Expected Receipt Date]
```

2. **Check Demand Calculation**
```sql
SELECT 
    sl.[No_] AS [Item No_],
    sl.[Document No_] AS [Sales Order],
    sl.[Shipment Date],
    sl.Quantity,
    sl.[Quantity Shipped],
    sl.[Outstanding Quantity]
FROM [Clesen Horticulture$Sales Line] sl
INNER JOIN [Clesen Horticulture$Sales Header] sh 
    ON sl.[Document Type] = sh.[Document Type]
    AND sl.[Document No_] = sh.[No_]
WHERE sl.[No_] = 'ITEM123'
    AND sl.[Document Type] = 1 -- Order
    AND sl.[Outstanding Quantity] > 0
ORDER BY sl.[Shipment Date]
```

3. **Verify Inventory Balance**
```sql
SELECT 
    [Item No_],
    SUM(Quantity) AS [Total Inventory],
    [Location Code]
FROM [Clesen Horticulture$Item Ledger Entry]
WHERE [Item No_] = 'ITEM123'
GROUP BY [Item No_], [Location Code]
```

**Resolution:**
- If PO late: Expedite with vendor
- If demand miscalculated: Check sales order setup
- If inventory wrong: Physical count required
- If all correct but still short: Place rush order

#### Scenario 4: Buyer Left Company / On Leave

**Immediate Actions:**
1. Identify buyer's assigned items/vendors
2. Reassign to other buyers (temp or permanent)
3. Review all pending worksheet changes
4. Decide: Apply, reassign, or cancel
5. Update User Setup

**SQL Query: Get Buyer's Assignments**

```sql
-- Items
SELECT 'Item' AS Type, [No_] AS Code, Description
FROM [Clesen Horticulture$Item]
WHERE [Purchasing Code] = 'BUYER01' -- Departed buyer

UNION ALL

-- Vendors
SELECT 'Vendor' AS Type, [No_] AS Code, Name
FROM [Clesen Horticulture$Vendor]
WHERE [Purchaser Code] = 'BUYER01'
```

**SQL Query: Get Pending Worksheet**

```sql
SELECT 
    [Entry No_],
    [Item No_],
    [Item Description],
    [Vendor No_],
    [Purchase Order No_],
    [Requested Receipt Date],
    [Purch_ Line Quantity New],
    [Line Modified]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
WHERE [User ID] = 'DOMAIN\BUYER01' -- Departed buyer
ORDER BY [Requested Receipt Date]
```

**Reassignment Process:**
- Update Item: Purchasing Code = new buyer
- Update Vendor: Purchaser Code = new buyer
- Worksheet: New buyer loads data (items appear automatically)

---

## Vendor Performance Tracking

### Key Performance Indicators (KPIs)

#### On-Time Delivery Rate

**SQL Query: Vendor Delivery Performance**

```sql
WITH PurchaseDeliveries AS (
    SELECT 
        ph.[Buy-from Vendor No_] AS [Vendor No_],
        ph.[No_] AS [PO No_],
        ph.[Expected Receipt Date],
        prh.[Posting Date] AS [Actual Receipt Date],
        CASE 
            WHEN prh.[Posting Date] <= ph.[Expected Receipt Date] THEN 1
            WHEN prh.[Posting Date] <= DATEADD(day, 2, ph.[Expected Receipt Date]) THEN 0.5
            ELSE 0
        END AS [On Time Score],
        DATEDIFF(day, ph.[Expected Receipt Date], prh.[Posting Date]) AS [Days Late]
    FROM [Clesen Horticulture$Purchase Header] ph
    INNER JOIN [Clesen Horticulture$Purch_ Rcpt_ Header] prh 
        ON ph.[No_] = prh.[Order No_]
    WHERE ph.[Document Type] = 1 -- Order
        AND prh.[Posting Date] >= DATEADD(month, -3, GETDATE()) -- Last 3 months
)
SELECT 
    [Vendor No_],
    v.Name AS [Vendor Name],
    COUNT(*) AS [Total Deliveries],
    SUM([On Time Score]) AS [On Time Points],
    CAST(SUM([On Time Score]) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS [On Time %],
    AVG(CAST([Days Late] AS DECIMAL(10,2))) AS [Avg Days Late],
    MAX([Days Late]) AS [Max Days Late]
FROM PurchaseDeliveries pd
INNER JOIN [Clesen Horticulture$Vendor] v ON pd.[Vendor No_] = v.[No_]
GROUP BY [Vendor No_], v.Name
ORDER BY [On Time %] DESC
```

**Scoring:**
- 95-100%: Excellent (preferred vendor)
- 85-94%: Good (acceptable)
- 75-84%: Fair (monitor closely)
- <75%: Poor (consider alternatives)

#### Quality Hold Rate

**SQL Query: Vendor Quality Issues**

```sql
-- Assumes quality holds tracked in separate table or notes
-- This queries receipt lines with hold locations

SELECT 
    prl.[Buy-from Vendor No_] AS [Vendor No_],
    v.Name AS [Vendor Name],
    COUNT(*) AS [Total Receipt Lines],
    SUM(CASE WHEN prl.[Location Code] IN (
        SELECT Code FROM [Clesen Horticulture$Location] 
        WHERE [CLE Location Type] = 1 -- Quarantine
    ) THEN 1 ELSE 0 END) AS [Lines to Hold],
    CAST(SUM(CASE WHEN prl.[Location Code] IN (
        SELECT Code FROM [Clesen Horticulture$Location] 
        WHERE [CLE Location Type] = 1
    ) THEN 1 ELSE 0 END) * 100.0 / COUNT(*) AS DECIMAL(5,2)) AS [Hold Rate %]
FROM [Clesen Horticulture$Purch_ Rcpt_ Line] prl
INNER JOIN [Clesen Horticulture$Vendor] v ON prl.[Buy-from Vendor No_] = v.[No_]
WHERE prl.[Posting Date] >= DATEADD(month, -3, GETDATE())
    AND prl.Type = 2 -- Item
GROUP BY prl.[Buy-from Vendor No_], v.Name
HAVING COUNT(*) > 10 -- Minimum sample size
ORDER BY [Hold Rate %] DESC
```

**Targets:**
- <2%: Excellent quality
- 2-5%: Acceptable
- 5-10%: Concerning (vendor discussion needed)
- >10%: Unacceptable (switch vendors)

#### Price Variance

**SQL Query: Vendor Price Stability**

```sql
WITH ItemPrices AS (
    SELECT 
        pl.[Buy-from Vendor No_],
        pl.[No_] AS [Item No_],
        pl.[Direct Unit Cost],
        pl.[Order Date],
        ROW_NUMBER() OVER (
            PARTITION BY pl.[Buy-from Vendor No_], pl.[No_]
            ORDER BY pl.[Order Date] DESC
        ) AS RowNum
    FROM [Clesen Horticulture$Purchase Line] pl
    WHERE pl.[Document Type] = 1 -- Order
        AND pl.Type = 2 -- Item
        AND pl.[Order Date] >= DATEADD(month, -6, GETDATE())
)
SELECT 
    ip1.[Buy-from Vendor No_],
    v.Name AS [Vendor Name],
    COUNT(DISTINCT ip1.[Item No_]) AS [Items Purchased],
    AVG(ABS(ip1.[Direct Unit Cost] - ip2.[Direct Unit Cost]) / ip2.[Direct Unit Cost] * 100) AS [Avg Price Change %],
    MAX(ABS(ip1.[Direct Unit Cost] - ip2.[Direct Unit Cost]) / ip2.[Direct Unit Cost] * 100) AS [Max Price Change %]
FROM ItemPrices ip1
INNER JOIN ItemPrices ip2 
    ON ip1.[Buy-from Vendor No_] = ip2.[Buy-from Vendor No_]
    AND ip1.[Item No_] = ip2.[Item No_]
    AND ip2.RowNum = 2 -- Previous order
INNER JOIN [Clesen Horticulture$Vendor] v ON ip1.[Buy-from Vendor No_] = v.[No_]
WHERE ip1.RowNum = 1 -- Latest order
GROUP BY ip1.[Buy-from Vendor No_], v.Name
HAVING COUNT(DISTINCT ip1.[Item No_]) >= 5 -- Minimum variety
ORDER BY [Avg Price Change %] DESC
```

**Analysis:**
- <5% avg change: Stable pricing (good)
- 5-10%: Moderate volatility (monitor)
- >10%: High volatility (negotiate contracts)
- >20% max: Investigate specific items

#### Fill Rate (Complete Orders)

**SQL Query: Order Completeness**

```sql
SELECT 
    ph.[Buy-from Vendor No_],
    v.Name AS [Vendor Name],
    COUNT(DISTINCT ph.[No_]) AS [Total Orders],
    SUM(CASE 
        WHEN ph.[Completely Received] = 1 THEN 1 
        ELSE 0 
    END) AS [Fully Received],
    CAST(SUM(CASE 
        WHEN ph.[Completely Received] = 1 THEN 1 
        ELSE 0 
    END) * 100.0 / COUNT(DISTINCT ph.[No_]) AS DECIMAL(5,2)) AS [Fill Rate %]
FROM [Clesen Horticulture$Purchase Header] ph
INNER JOIN [Clesen Horticulture$Vendor] v ON ph.[Buy-from Vendor No_] = v.[No_]
WHERE ph.[Document Type] = 1 -- Order
    AND ph.[Expected Receipt Date] >= DATEADD(month, -3, GETDATE())
    AND ph.[Expected Receipt Date] <= GETDATE() -- Already due
GROUP BY ph.[Buy-from Vendor No_], v.Name
HAVING COUNT(DISTINCT ph.[No_]) >= 5
ORDER BY [Fill Rate %] DESC
```

**Targets:**
- >95%: Excellent
- 85-95%: Good
- 75-85%: Fair (frequent short shipments)
- <75%: Poor (reliability issue)

### Vendor Scorecard

**Combined Metrics Report**

```sql
-- Comprehensive vendor performance scorecard

WITH VendorMetrics AS (
    -- On-time delivery
    SELECT 
        ph.[Buy-from Vendor No_],
        AVG(CASE 
            WHEN prh.[Posting Date] <= ph.[Expected Receipt Date] THEN 100.0
            ELSE 0
        END) AS [OnTime_Score]
    FROM [Clesen Horticulture$Purchase Header] ph
    INNER JOIN [Clesen Horticulture$Purch_ Rcpt_ Header] prh ON ph.[No_] = prh.[Order No_]
    WHERE ph.[Document Type] = 1
        AND prh.[Posting Date] >= DATEADD(month, -3, GETDATE())
    GROUP BY ph.[Buy-from Vendor No_]
),
VendorVolume AS (
    -- Purchase volume
    SELECT 
        [Buy-from Vendor No_],
        SUM(Quantity * [Direct Unit Cost]) AS [Total_Spend]
    FROM [Clesen Horticulture$Purchase Line]
    WHERE [Document Type] = 1
        AND [Order Date] >= DATEADD(month, -3, GETDATE())
    GROUP BY [Buy-from Vendor No_]
)
SELECT 
    v.[No_] AS [Vendor No],
    v.Name AS [Vendor Name],
    v.[Purchaser Code] AS [Buyer],
    COALESCE(vm.[OnTime_Score], 0) AS [On Time %],
    COALESCE(vv.[Total_Spend], 0) AS [Spend (3mo)],
    CASE 
        WHEN vm.[OnTime_Score] >= 95 AND vv.[Total_Spend] > 10000 THEN 'A - Preferred'
        WHEN vm.[OnTime_Score] >= 85 THEN 'B - Good'
        WHEN vm.[OnTime_Score] >= 75 THEN 'C - Fair'
        ELSE 'D - Review'
    END AS [Performance Grade]
FROM [Clesen Horticulture$Vendor] v
LEFT JOIN VendorMetrics vm ON v.[No_] = vm.[Buy-from Vendor No_]
LEFT JOIN VendorVolume vv ON v.[No_] = vv.[Buy-from Vendor No_]
WHERE v.Blocked = '' -- Only active vendors
ORDER BY [Performance Grade], [Spend (3mo)] DESC
```

**Use in Reviews:**
- Share scorecard with buyers quarterly
- Discuss improvement plans for C/D vendors
- Negotiate better terms with A vendors (leverage volume)
- Consider consolidating with high performers

---

## Training and Best Practices

### New Buyer Onboarding

**Week 1: System Introduction**
- Overview of Broker Workspace
- Get Data and filters
- Reading availability forecasts
- Navigation and field meanings
- Practice with test data

**Week 2: Basic Operations**
- Creating new purchase lines
- Changing quantities
- Changing dates
- Applying changes
- Verifying results in POs

**Week 3: Advanced Features**
- Change vendor/PO
- Copy purchase orders
- Update demand/supply
- Using forecasts
- Change log review

**Week 4: Shadowing**
- Work alongside experienced buyer
- Handle real orders with supervision
- Troubleshoot issues
- Policy compliance

### Training Scenarios

**Scenario 1: Rush Order Handling**
```
Situation: Customer needs 500 units in 5 days instead of normal 2 weeks

Steps:
1. Open Broker Workspace
2. Filter to specific item
3. Get Data
4. Review current orders and availability
5. Options:
   a. Expedite existing PO (change date)
   b. Create new rush order
   c. Reallocate from other customer
6. Apply changes
7. Call vendor to confirm
8. Document as rush in system
```

**Scenario 2: Seasonal Planning**
```
Situation: Spring season starts in 6 weeks, need to plan orders

Steps:
1. Set date range: Today + 90 days
2. Item filter: %Spring
3. Vendor filter: %my
4. Get Data
5. Select Forecast: Spring 2026
6. Review Season Forecast Balance
7. Adjust quantities to match forecast
8. Create new orders for under-ordered items
9. Review cart totals (may need multiple deliveries)
10. Apply All
11. Print POs and schedule with vendors
```

### Best Practice Reinforcement

**Monthly Buyer Meetings:**
- Review performance metrics
- Share successful strategies
- Discuss problem vendors
- Preview upcoming seasons
- Update on policy changes

**Refresher Training:**
- Quarterly review of advanced features
- New feature rollout training
- Compliance reminders (policy, approvals)
- System updates and changes

### Common Mistakes to Coach

1. **Not clearing old data**
   - Results in stale availability calculations
   - May order wrong quantities
   - Training: Always clear before Get Data

2. **Forgetting to Apply**
   - Changes sit pending for days
   - Vendors not notified
   - Items stock out
   - Training: Apply daily, keep log clean

3. **Ignoring cart totals**
   - Orders over 40 carts
   - Shipping delays
   - Extra freight costs
   - Training: Check totals, split if needed

4. **Not checking vendor delivery dates**
   - Ordering too close to need date
   - Rush charges
   - Stock outs
   - Training: Know vendor lead times

5. **Over-relying on forecasts**
   - Forecasts are estimates
   - Market conditions change
   - Training: Use forecasts as guide, not gospel

---

## Reporting and Analytics

### Management Dashboard

**Power BI Report (SQL Query Base):**

```sql
-- Weekly Purchasing Activity Summary
SELECT 
    DATEPART(week, log.[Created DateTime]) AS [Week Number],
    DATEPART(year, log.[Created DateTime]) AS [Year],
    log.[User ID] AS Buyer,
    COUNT(*) AS [Total Changes],
    SUM(CASE WHEN log.[Change Applied] = 1 THEN 1 ELSE 0 END) AS [Applied],
    SUM(CASE WHEN log.[Change] = 0 THEN 1 ELSE 0 END) AS [New Orders],
    SUM(CASE WHEN log.[Change] = 1 THEN 1 ELSE 0 END) AS [Qty Changes],
    SUM(CASE WHEN log.[Change] = 2 THEN 1 ELSE 0 END) AS [Date Changes],
    SUM(CASE WHEN log.[Change] = 3 THEN 1 ELSE 0 END) AS [Vendor Switches]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
WHERE log.[Created DateTime] >= DATEADD(month, -3, GETDATE())
GROUP BY 
    DATEPART(week, log.[Created DateTime]),
    DATEPART(year, log.[Created DateTime]),
    log.[User ID]
ORDER BY [Year], [Week Number], Buyer
```

**Visualizations:**
- Bar chart: Changes per buyer per week
- Line chart: Trend over time
- Pie chart: Change type distribution
- KPI cards: Applied rate, avg changes/buyer

### Budget vs. Actual

**SQL Query: Purchasing Spend Analysis**

```sql
SELECT 
    ph.[Purchaser Code] AS Buyer,
    DATENAME(month, ph.[Order Date]) AS [Month],
    COUNT(DISTINCT ph.[No_]) AS [Orders Placed],
    SUM(pl.Quantity * pl.[Direct Unit Cost]) AS [Total Spend],
    SUM(CASE WHEN ph.Status = 1 THEN pl.Quantity * pl.[Direct Unit Cost] ELSE 0 END) AS [Released Orders],
    SUM(CASE WHEN ph.Status = 0 THEN pl.Quantity * pl.[Direct Unit Cost] ELSE 0 END) AS [Open Orders]
FROM [Clesen Horticulture$Purchase Header] ph
INNER JOIN [Clesen Horticulture$Purchase Line] pl 
    ON ph.[Document Type] = pl.[Document Type]
    AND ph.[No_] = pl.[Document No_]
WHERE ph.[Document Type] = 1 -- Order
    AND ph.[Order Date] >= DATEADD(month, -12, GETDATE())
    AND pl.Type = 2 -- Item
GROUP BY 
    ph.[Purchaser Code],
    DATENAME(month, ph.[Order Date]),
    MONTH(ph.[Order Date])
ORDER BY 
    ph.[Purchaser Code],
    MONTH(ph.[Order Date])
```

**Compare to Budget:**
- Import budget figures from finance
- Calculate variance: Actual - Budget
- Flag over-budget buyers
- Investigate variances >10%

### Forecast Accuracy Report

**SQL Query: Forecast vs. Actual Orders**

```sql
-- Requires forecast entries and worksheet logs
SELECT 
    pfe.[Item No_],
    pfe.[Production Forecast Name],
    SUM(pfe.[Forecast Quantity (Base)]) AS [Forecasted Qty],
    SUM(ws.[Purch_ Line Quantity New]) AS [Ordered Qty],
    SUM(pfe.[Forecast Quantity (Base)]) - SUM(ws.[Purch_ Line Quantity New]) AS [Variance],
    CASE 
        WHEN SUM(pfe.[Forecast Quantity (Base)]) = 0 THEN 0
        ELSE ABS(SUM(pfe.[Forecast Quantity (Base)]) - SUM(ws.[Purch_ Line Quantity New])) * 100.0 / SUM(pfe.[Forecast Quantity (Base)])
    END AS [Variance %]
FROM [Clesen Horticulture$Production Forecast Entry] pfe
LEFT JOIN [Clesen Horticulture$CLE Purch_ Worksheet Line] ws 
    ON pfe.[Item No_] = ws.[Item No_]
    AND pfe.[Production Forecast Name] = ws.[Forecast Code]
WHERE pfe.[Production Forecast Name] = 'Spring 2026' -- Example forecast
GROUP BY pfe.[Item No_], pfe.[Production Forecast Name]
HAVING SUM(pfe.[Forecast Quantity (Base)]) > 0
ORDER BY [Variance %] DESC
```

**Analysis:**
- Items consistently under/over ordered
- Forecast accuracy by category
- Buyer adherence to forecasts
- Adjust forecasting methodology

---

## System Configuration

### User Setup

**Required Fields:**
```
User ID: Domain login
Salespers./Purch. Code: Links to buyers/vendors
E-Mail: For notifications
Default Location: May affect availability calculations
```

**Permissions:**
- Purchase Order Create/Edit
- Vendor Read
- Item Read
- Broker Workspace (Page 50086)
- Change Log (Page for log entries)

### Setup Customization

**Purchasing Calendar:**
```
Location: CLE Clesen Setup
Field: CW Purchasing Base Calendar
Purpose: Defines working days for date calculations
```

**Inbound Handling Time:**
```
Location: Location Card
Field: Inbound Whse. Handling Time
Purpose: Auto-calculates Expected Receipt Date from Requested
Example: 1D (one day processing)
```

**Item Defaults:**
```
Item Card:
- Purchasing Code: Assigns to buyer
- Vendor No.: Default vendor
- Purch. Unit of Measure: Ordering unit
- Lead Time Calculation: Vendor lead time
```

**Vendor Defaults:**
```
Vendor Card:
- Purchaser Code: Assigns to buyer
- Lead Time Calculation: Default lead time
```

### System Parameters

**Date Range Recommendations:**
- Daily planning: Today + 30 days
- Weekly planning: Today + 60 days
- Seasonal planning: Today + 120 days
- Maximum range: 180 days (performance)

**Performance Tuning:**
- Large item counts (>1000): May take 2-3 minutes for Get Data
- Narrow filters to improve performance
- Run during off-hours for major planning
- Consider archiving old worksheet lines monthly

---

## Troubleshooting and Support

### Escalation Matrix

| Issue Type | First Contact | Escalate To | Time Frame |
|------------|---------------|-------------|------------|
| How-to question | Staff Guide / Peer buyer | Manager | Same day |
| Policy question | Manager | Director | 24 hours |
| Data discrepancy | Manager + IT | IT + Finance | 48 hours |
| System error | IT | Vendor support | 48 hours |
| Vendor issue | Buyer + Manager | Manager + Vendor | Immediate |
| Approval needed | Manager | Director | 24 hours |

### Manager Troubleshooting

#### Issue: Buyer Can't See Items/Vendors

**Diagnosis:**
1. Check User Setup: Salespers./Purch. Code assigned?
2. Check Item: Purchasing Code matches buyer?
3. Check Vendor: Purchaser Code matches buyer?
4. Check filter: Using %my correctly?

**Fix:**
- Update Item/Vendor assignments
- Or update User Setup code
- Buyer re-loads worksheet

#### Issue: Changes Not Applying

**Diagnosis:**
1. Check Line Modified flag
2. Check for errors in event log
3. Check PO status (can't edit posted)
4. Check permissions

**Fix:**
- Verify buyer has PO edit rights
- Reopen released PO if needed
- Check for receiving already posted
- May need to manually correct PO

#### Issue: Availability Always Wrong

**Diagnosis:**
1. Check inventory accuracy (cycle counts)
2. Verify sales orders posting correctly
3. Check for unposted purchase receipts
4. Review availability calculation setup

**Fix:**
- Post all pending receipts/shipments
- Run physical inventory
- Verify location filters
- Contact IT to review calculation logic

### Manager Tools

**SQL Query: Active User Sessions**

```sql
SELECT 
    [User ID],
    COUNT(*) AS [Active Lines],
    MIN([Start Date Filter]) AS [Date From],
    MAX([End Date Filter]) AS [Date To],
    MAX([timestamp]) AS [Last Activity]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
GROUP BY [User ID]
ORDER BY [Last Activity] DESC
```

**SQL Query: Orphaned Worksheet Lines** (cleanup)

```sql
-- Lines from users no longer in system
SELECT ws.*
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
LEFT JOIN [Clesen Horticulture$User] u ON ws.[User ID] = u.[User Name]
WHERE u.[User Name] IS NULL
```

**Cleanup Script:**
```sql
-- Remove old worksheet lines (>90 days)
DELETE FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
WHERE [timestamp] < DATEADD(day, -90, GETDATE())

-- Archive old change logs (>1 year)
-- Move to archive table before deleting
INSERT INTO [Clesen Horticulture$CLE Purch_ Wrksht Log Archive]
SELECT * FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry]
WHERE [Created DateTime] < DATEADD(year, -1, GETDATE())

DELETE FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry]
WHERE [Created DateTime] < DATEADD(year, -1, GETDATE())
```

---

## Document Information

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 02/13/2026 | Initial release | Documentation Team |

**Related Documents:**
- Broker Workspace Staff Guide
- Broker Workspace IT Troubleshooting Guide
- Purchasing Policy Manual
- Vendor Management Procedures

**Feedback:**
Contact purchasing.management@clesenhoriculture.com

---

*End of Broker Workspace Manager Guide*

---

## Related documents

- [[README]]
- [[broker-workspace-staff-guide]]
- [[broker-workspace-it-troubleshooting-guide]]
