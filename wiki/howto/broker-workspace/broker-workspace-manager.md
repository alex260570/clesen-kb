---
title: Broker Workspace - Manager Guide
type: howto
tags: [purchasing, management, oversight, analytics]
created: 2026-04-21
updated: 2026-04-21
sources: [broker-workspace-manager-guide.md]
---

# Broker Workspace - Manager Guide

Management oversight, monitoring, and analytics for purchasing operations using the Broker Workspace.

## Management Role

As a purchasing manager, the Broker Workspace provides visibility into:
- What buyers are planning to purchase
- Changes made before applying to orders
- Vendor performance and delivery reliability
- Inventory availability trends
- Purchasing patterns and seasonality

## Key Management Functions

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

## System Access Requirements

**Manager Permissions Needed:**
- Read access to all buyers' worksheets
- View change logs (all users)
- Edit purchase orders (for corrections)
- Run SQL queries (for reporting)
- Access user setup (for assignments)

## Buyer Assignment Management

### User Setup Configuration

Each buyer must have:
- **User ID** — Their BC login
- **Salespers./Purch. Code** — Links them to vendors/items
- **Purchasing Agent** checkbox — Enabled
- **Email** — For automated notifications

### Vendor Assignment

```
Vendor Card:
- Purchaser Code = Buyer's Code
- This makes vendor appear in buyer's %my filter
```

### Item Assignment

```
Item Card:
- Purchasing Code = Buyer's Code
- This makes item appear in buyer's %my filter
```

**Best Practice:** Assign items/vendors by category or region, not alphabetically. This ensures specialized knowledge.

## Approval Workflows

### Define Approval Thresholds

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

## Policy Enforcement

### Standard Operating Procedures

**1. Minimum Order Quantities**
- Define per vendor (e.g., $500 minimum)
- Buyers must consolidate small orders
- Exception: Rush orders

**2. Lead Time Requirements**
- Standard items: 2-week minimum
- Special order: 4-week minimum
- Rush: Manager approval + vendor confirmation

**3. Vendor Selection**
- Primary vendor first
- Alternate vendor if:
  - Primary unavailable
  - Better pricing (>10% savings)
  - Manager approved

**4. Cart Quantity Limits**
- Standard shipment: <40 carts
- Over 40: Split PO or arrange special delivery
- Document transportation arrangements

**5. Forecast Adherence**
- Orders should align ±10% of forecast
- Major variances require explanation
- Monthly forecast review with buyers

## Daily Monitoring Routine

### Step 1: Review Pending Changes

Look for:
- Buyers with >50 pending lines (may need help or training)
- Large quantity changes (>1000 units)
- Dates in past or >90 days out

**Key Metrics:**
- Count of pending lines per buyer
- Total quantity adjustments
- Date range of changes

### Step 2: Review Unapplied Changes Over 24 Hours

**Actions:**
- Contact buyer to apply or explain delay
- May indicate indecision or problem
- Consider whether order should be cancelled

### Step 3: Check for Duplicate Planning

**Risk:** Over-ordering same item by different buyers

**Actions:**
- Verify item assignments correct
- Coordinate buyers if legitimate overlap
- Consolidate orders to one buyer

## Weekly Activity Review

### Buyer Performance Dashboard

**Metrics to Track:**
- Lines Changed: Buyer activity level
- New Orders: Proactive purchasing
- Vendor Changes: Flexibility or problems?
- Still Pending: Indecision or workload?

**Benchmarks:**
- Active buyer: 20-50 changes/week
- New buyer: 10-20 changes/week
- Low activity (<10): May need more items assigned or training
- High pending (>20): May be overwhelmed

### Inventory Accuracy Trends

**Look for:**
- Large discrepancies (>20%) between forecast and actual
- Systematic over/under forecasting
- Specific items with accuracy problems

**Actions:**
- Review item setup (UOM conversions)
- Check for unposted transactions
- Verify demand calculation logic
- Train warehouse on posting timeliness

## Change Log Analysis

### Understanding Change Types

| Value | Type | Description | Risk Level |
|-------|------|-------------|------------|
| 0 | New Order | Creating new PO | Medium |
| 1 | Quantity Change | Increasing/decreasing | Low-Medium |
| 2 | Date Change | Moving delivery date | Medium |
| 3 | Vendor Change | Switching vendors | High |
| 4 | Move Line | Moving to different PO | Medium |

### Critical Changes to Monitor

#### High-Value Orders

**Review Criteria:**
- Order > $10,000: Verify with buyer
- Order > $50,000: Requires your approval
- Unusual item/quantity combination

#### Vendor Changes

**Follow-up Actions:**
- Verify reason for switch
- Check if pricing/terms maintained
- Update preferred vendor if permanent
- Document vendor performance issue

#### Date Changes Impacting Deliveries

**Concerns:**
- Date moved earlier: Rush order? Stock out risk?
- Date moved later: Vendor delay? Customer impact?
- >30 days shift: Verify legitimacy

### Change Pattern Analysis

#### Frequent Changes to Same Items

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
1. Verify POs are all for correct items
2. Check PO expected receipt dates
3. Verify inventory posting is current
4. Check for unshipped sales orders
5. Review item demand forecast accuracy

**Actions:**
- Expedite PO with early receipt (if possible)
- Reduce demand by delaying sales orders
- Consider alternate suppliers
- Review and adjust forecast if inaccurate

## Training and Best Practices

### Buyer Training Priorities

**New Buyers (First Month):**
- Workspace navigation and data flow
- How to read demand and availability
- When and how to create new POs
- Approval thresholds and policy
- Change tracking and application

**Ongoing Development:**
- Advanced filtering and reporting
- Vendor negotiation using availability data
- Seasonal demand pattern recognition
- Forecast accuracy improvement
- Problem-solving for shortages

### Process Improvements

**Review Quarterly:**
1. Approval threshold effectiveness
2. Vendor performance metrics
3. Forecast accuracy trends
4. Buyer training needs
5. System issues or pain points

**Metrics Dashboard:**
- Average PO accuracy (forecast vs. actual)
- Buyer efficiency (lines per hour)
- Vendor on-time delivery %
- Order size distribution
- Pending change age

## Reporting and Analytics

### Key Reports to Run Regularly

**Weekly:**
- Pending worksheet changes by buyer
- Large orders awaiting approval
- Overdue changes not yet applied
- Vendor change activity

**Monthly:**
- Buyer performance scorecard
- Vendor delivery compliance
- Forecast vs. actual analysis
- Inventory availability trends
- Budget tracking by buyer

**Quarterly:**
- Year-over-year purchasing analysis
- Vendor consolidation opportunities
- Lead time performance
- Seasonal pattern identification
- Training effectiveness review

## System Configuration

### Setup Requirements

#### Location Setup

- Field: "CLE Hide from Availability" (Boolean)
- Purpose: Exclude locations from availability calculation
- Used in: CreateActiveLocationFilter()

#### General Setup

- Field: "CLE Use Availability Reserves" (Boolean)
- Purpose: Enable/disable availability reserve feature
- Used in: CalculateItemAvailabilityForDate()

## Best Practices for Managers

### Daily Oversight

✅ **Do:**
- Review pending changes each morning
- Monitor high-value orders
- Check for duplicate planning
- Respond quickly to escalations

❌ **Don't:**
- Let changes sit pending for days
- Ignore red warnings
- Approve orders without justification
- Skip vendor performance reviews

### Buyer Management

✅ **Do:**
- Train buyers on policy and thresholds
- Provide regular feedback on performance
- Recognize good planning decisions
- Support problem-solving with difficult situations

❌ **Don't:**
- Over-manage daily decisions
- Change orders after buyers apply changes
- Assign inappropriate items to buyers
- Ignore training needs

### Vendor Management

✅ **Do:**
- Track vendor performance systematically
- Communicate expectations clearly
- Follow through on consequences
- Negotiate based on data

❌ **Don't:**
- Switch vendors without reason
- Ignore vendor feedback
- Create unrealistic expectations
- Allow persistent poor performance

## Related Pages

- [[broker-workspace]] — Buyer workflow guide
- [[broker-workspace-troubleshooting]] — IT troubleshooting guide
