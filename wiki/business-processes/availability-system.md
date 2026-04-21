---
title: Availability System Overview
type: business-process
tags: [availability, inventory, planning, system]
created: 2026-04-21
updated: 2026-04-21
sources: [availability-user-guide.md]
---

# Availability System Overview

The availability system provides real-time visibility into current and future item stock levels across all locations. It analyzes inventory, incoming supply, and outgoing demand to show what's available when.

## What Availability Calculates

The system combines:

- **Current inventory on hand** — Physical stock at all active locations
- **Incoming purchase orders** — Items arriving from suppliers
- **Incoming production orders** — Items being manufactured (including by-products)
- **Outgoing sales orders** — Customer orders not yet shipped (including blanket orders)
- **Production order component requirements** — Items needed for production

## Where to Find Availability Information

### Availability Matrix (Page 50138)

Grid view showing availability for multiple items across multiple future dates. Click any number to see the demand/supply breakdown.

### Sales Speed Entry (Page 50142)

Displays availability for items as you enter sales lines. Click the availability number to see details.

### Sales Factbox (Page 60078)

Shows availability summary on sales documents (sidebar).

### Daily Availability (Page 50187)

Overview of availability for planning purposes.

### Rapid Order Entry (Page 50071)

Availability displayed during fast order entry process.

## Understanding Availability Numbers

### Positive Numbers (Green)

Items are available in the quantity shown for the date. You can promise delivery to customers.

### Negative Numbers (Red)

Projected shortage. Demand exceeds available inventory and incoming supply. This means:

- Sales orders exceed available inventory and incoming supply
- Production components are allocated but items aren't arriving in time
- May need to delay shipments or expedite purchase/production orders

### Zero

No projected availability. Either perfectly balanced supply/demand or item not in use for that period.

## Availability Drill-Down Details

Click any availability number to see the breakdown:

**Supply (Positive Quantities):**

- **Quantity on Hand (Sales)** — Current inventory across all locations
- **Purchase Order** — Items arriving from suppliers
- **Production Order** — Items being manufactured
- **Production Order (Roll-Up)** — Items produced as by-products

**Demand (Negative Quantities):**

- **Blanket Sales Order** — Standing orders with remaining quantity
- **Sales Order** — Customer orders not yet shipped
- **Production Order Component** — Items needed for production

## How the System Calculates Availability

### Period-Based Calculation

The system divides time into periods bounded by supply dates:

```
Period 1: Today → First Supply Date
Period 2: First Supply Date → Second Supply Date
Period 3: Second Supply Date → Third Supply Date
...
```

For each period:

1. **Start with current inventory** at all active locations (Evanston, Grayslake, etc.)

2. **Create periods** between each supply date (when purchase orders or production orders are due)

3. **For each period**, calculate:
   - Supply arriving in the period
   - Demand shipping in the period
   - Net change to availability

4. **Handle negative periods** — If a future period goes negative, it reduces current period availability (you've already committed more than you'll have)

5. **Apply reserves** (if enabled) — Temporarily held inventory for specific purposes

### Example: Period-Based Forecasting

**Situation:**
- Today: March 5
- Current Inventory: 1,000 units
- Purchase Order arriving: March 10 with 500 units
- Purchase Order arriving: March 20 with 300 units
- Sales Order due: March 8 for 200 units
- Sales Order due: March 15 for 400 units

**Periods created:**

| Period | Dates | Supply | Demand | Net | Running Total |
|--------|-------|--------|--------|-----|---|
| 1 | Mar 5-9 | 0 | 200 | -200 | 800 |
| 2 | Mar 10-14 | 500 | 0 | +500 | 1,300 |
| 3 | Mar 15-19 | 0 | 400 | -400 | 900 |
| 4 | Mar 20+ | 300 | 0 | +300 | 1,200 |

## Availability Reserves

Availability Reserves temporarily hold inventory from calculations for specific purposes. Reserves reduce availability until their release date.

**Common uses:**
- Quality control holds (pending inspection)
- Customer holds (waiting for order confirmation)
- Trade show or event inventory
- Planned promotions

See [[availability-reserves]] for detailed information.

## Tips for Users

### Planning Sales Orders

- Check availability before promising delivery dates
- Negative availability = need to delay or find alternatives
- Drill down to see if purchase orders are arriving soon

### Understanding Shortages

If availability is negative:

1. Click the number to see the drill-down
2. Check if production components are blocking stock
3. Look for incoming purchase orders that could be expedited
4. Consider if sales orders can be delayed or split

### Multi-Location Availability

The system automatically aggregates across all active locations. You don't need to check each location separately.

### Blanket Orders

Blanket order remaining quantities count as demand. As you ship against blanket orders, the remaining quantity decreases and availability improves.

## Seasonal Availability Planning

Many horticultural operations experience strong seasonal demand patterns requiring advance planning.

### Seasonal Patterns

**Spring (March-May):** High demand for starters, seeds → Build inventory starting January

**Summer (June-August):** Peak landscape season → Maximize production, frequent orders

**Fall (September-October):** Fall plantings, mums → Stagger production

**Winter (November-February):** Holiday season → Pre-plan holiday production

### Planning Approach

- Set up seasonal patterns in **Plan > Seasonal Forecast**
- Use **Availability Matrix** with "Extend Forecast 6 Months" to see seasonal projections
- Plan purchase orders at least 8 weeks ahead of seasonal peaks
- Build 2-week buffer stock before major seasons
- Review annually and adjust based on actual results

## Availability Suggestions Workflow

When items are unavailable, the system recommends alternatives to fulfill orders successfully.

### Suggestion Types

- **Timeline shift** — "Ship on 4/17 instead of 4/10" when future period has availability
- **Substitution** — "Use 4.5\" pot instead of 4\"" for same family item with better availability
- **Partial shipment** — "100 units available now, offer partial shipment"
- **Split delivery** — "120 on 4/10, 80 on 4/17" when combined availability in different periods

### Acting on Suggestions

- **Accept** — Alternative added to order
- **Decline** — Flag logged, original order proceeds
- **Negotiate** — Create custom suggestion if neither option fits
- **Communicate** — System generates email template for customers

## Special Features

### Production Component Visibility

When items are allocated as components in production orders, they show as demand. This helps you understand why items show as unavailable even when physically in stock.

### Safety Stock

Production orders can include safety stock quantities that don't count toward availability. This ensures buffer inventory for production reliability.

## Common Questions

**Q: Why does availability show negative when I have inventory?**
A: Future demand (sales orders or production components) exceeds your current inventory plus incoming supply. Check the drill-down to see what's consuming the inventory.

**Q: Why does a production component show a small quantity like -0.1?**
A: The system converts component quantities from base units (pieces) to your sales units (cases). If you see unexpected values, there may be a configuration issue with unit of measure setup.

**Q: When does availability update?**
A: Immediately as you create or modify sales orders, purchase orders, production orders, or post inventory transactions.

**Q: Can I see availability for one location only?**
A: The standard view aggregates all active locations. For single-location views, use inventory reporting or apply location filters.

**Q: What if the availability number seems wrong?**
A: Click the number to see the drill-down details. This shows every transaction contributing to the calculation. If the total still seems incorrect, contact IT support.

## Related Pages

- [[availability-reserves]] — Creating and managing inventory reserves
- [[move-lines]] — Moving sales order lines based on availability
- [[availability-troubleshooting]] — IT troubleshooting guide
