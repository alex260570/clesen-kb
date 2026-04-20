# Item Availability System

## Overview

The availability system provides real-time visibility into current and future item stock levels across all locations. It calculates when items will be available by analyzing:

- Current inventory on hand
- Incoming purchase orders
- Incoming production orders
- Outgoing sales orders (including blanket orders)
- Production order component requirements

## Where to Find Availability Information

### Availability Matrix (Page 50138)

Shows availability for multiple items across multiple future dates in a grid format. Click any number to see the details of what makes up that availability figure.

### Sales Speed Entry (Page 50142)

Displays availability for items as you enter sales lines. Click the availability number to see demand and supply details.

### Sales Factbox (Page 60078)

Shows availability summary on sales documents.

### Daily Availability (Page 50187)

Overview of availability for planning purposes.

### Rapid Order Entry (Page 50071)

Availability displayed during fast order entry process.

## Understanding Availability Numbers

### Positive Numbers (Green)

Items are available in the quantity shown for the date. You can promise delivery to customers.

### Negative Numbers (Red)

Projected shortage. The system shows negative availability when demand exceeds supply. This means:

- Sales orders exceed available inventory and incoming supply
- Production components are allocated but items aren't arriving in time
- You may need to delay shipments or expedite purchase/production orders

### Zero

No projected availability. Either perfectly balanced or item not in use for that period.

## Availability Drill-Down Details

Click any availability number to see the breakdown of:

**Supply (Positive Quantities):**

- **Quantity on Hand (Sales)** - Current inventory across all locations
- **Purchase Order** - Items arriving from suppliers
- **Production Order** - Items being manufactured
- **Production Order (Roll-Up)** - Items produced as by-products of other production

**Demand (Negative Quantities):**

- **Blanket Sales Order** - Standing orders with remaining quantity
- **Sales Order** - Customer orders not yet shipped
- **Production Order Component** - Items needed for production

## How the System Calculates Availability

The system uses a **period-based calculation** that divides time into segments:

1. **Start with current inventory** at all active locations (Evanston, Grayslake, etc.)

2. **Create periods** between each supply date (when purchase orders or production orders are due)

3. **For each period**, calculate:

   - Supply arriving in the period
   - Demand shipping in the period
   - Net change to availability

4. **Handle negative periods** - If a future period goes negative, it reduces current period availability (you've already committed more than you'll have)

5. **Apply reserves** (if enabled) - Temporarily held inventory for specific purposes

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

## Period-Based Forecasting Details

### Understanding periods across time

A period runs from one supply date to the next supply date. The system divides your timeline into logical segments:

- **Period 1**: Today → First incoming supply
- **Period 2**: First supply → Second supply
- **Period 3**: Second supply → Third supply

Each period shows availability accounting for all orders within that timeframe.

### Practical use cases for period-based planning

**Case 1: Large order planning** - Check matrix for a period with adequate availability, schedule shipment accordingly  
**Case 2: Replenishment timing** - Identify periods showing negative availability, work backward to create timely POs  
**Case 3: Multi-location balance** - Compare availability across facilities, transfer stock as needed

## Seasonal Availability Planning

Many horticultural operations experience strong seasonal demand patterns that require advance planning.

### Managing seasonal peaks and valleys

**Spring (March-May)**: High demand for starters, seeds → Build inventory starting January  
**Summer (June-August)**: Peak landscape season → Maximize production, frequent orders  
**Fall (September-October)**: Fall plantings, mums → Stagger production  
**Winter (November-February)**: Holiday season → Pre-plan holiday production

### Forecasting for seasonal demand

- Set up seasonal patterns in **Plan > Seasonal Forecast**
- Use **Availability Matrix** with "Extend Forecast 6 Months" to see seasonal projections
- Plan POs at least 8 weeks ahead of seasonal peaks
- Build 2-week buffer stock before major seasons
- Review annually and adjust based on actual results

## Availability Reserves in Detail

Reservations temporarily hide inventory from calculations for specific business purposes.

### Creating and managing reserves

**From Inventory:** Inventory > Reservations > New, then specify Item No., Location, Quantity, Release at Date

**From Sales Order:** Open sales line, select Action > Reserve for this line (automatic reserve created matching line quantity)

**Monitoring:** View active reserves on Availability Matrix (red highlights showing reserve impact) or in Reserves list

**Expiration:** Reserves automatically stop affecting availability on their Release at Date, but records persist for audit

## Availability Suggestions Workflow

When items are unavailable, the system recommends alternatives to fulfill orders successfully.

### Understanding suggestion types

- **Timeline shift**: "Ship on 4/17 instead of 4/10" when current period unavailable but future period adequate
- **Substitution**: "Use 4.5\" pot instead of 4\"" for same family item with better availability
- **Partial shipment**: "100 units available now, offer partial shipment" for quantity adjustments
- **Split delivery**: "120 on 4/10, 80 on 4/17" when combined availability exists but in different periods

### Acting on suggestions

**Accept**: Alternative added to order  
**Decline**: Flag logged, original order proceeds  
**Negotiate**: Create custom suggestion if neither option fits  
**Communicate**: System generates email template for customer-facing suggestions

## Special Features

### Availability Reserves

If enabled, allows temporary holds on inventory (e.g., for quality inspection, customer holds). These reserves reduce availability until the release date.

### Production Component Visibility

When items are allocated as components in production orders, they show as demand with the production order number. This helps you understand why items show as unavailable even when physically in stock.

### Safety Stock

Production orders can include safety stock quantities that don't count toward availability - this ensures buffer inventory for production reliability.

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
