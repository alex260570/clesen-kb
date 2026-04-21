---
title: Sales Order Management
type: howto
tags: [sales-orders, order-management, order-entry]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-order-management-user-guide.md]
---

# Sales Order Management

Comprehensive guide to creating, managing, and tracking sales orders throughout their lifecycle.

## Overview

The Sales Order Management system provides tools for:

- Creating and managing sales orders, quotes, and blanket orders
- Adding items quickly using Rapid Order Entry
- Transferring lines between orders based on availability
- Tracking order status through picking and shipping
- Managing automatic freight and credit card fees
- Setting customer-specific blooming stage preferences
- Monitoring order history and changes

**Prerequisites:**
- Active user account with sales permissions
- Access to Sales Order List and Sales Order pages
- Understanding of customer accounts and item inventory

## Sales Order Types

| Document Type | Purpose | When to Use |
|---------------|---------|------------|
| **Quote** | Price estimate for customer | Customer wants pricing before committing |
| **Blanket Order** | Standing order with periodic releases | Regular seasonal orders, contract customers |
| **Order** | Standard sales order | One-time orders, immediate shipments |

## Creating a New Sales Order

**Navigation:** Sales → Sales Orders → New

**Required Fields:**
- **Customer No.** — Select the customer (type to search)
- **Shipment Date** — When the order will ship (required before adding items)
- **Order Date** — Date order was placed (defaults to today)

**Important Fields:**
- **Shipment Method Code** — How order will ship (affects freight calculation)
- **Payment Method Code** — Payment terms (affects credit card fees)
- **Location Code** — Warehouse location for items
- **Salesperson Code** — Sales representative

**Process:**
1. Click **+ New** to create order
2. Fill header information
3. Click **OK** to save header
4. Add items to order (see [Working with Lines](#working-with-lines))

### Creating from Blanket Order

1. Open the **Blanket Order**
2. Click **Actions → Functions → Make Order**
3. Enter **Shipment Date** for this release
4. Select items and enter **Qty. to Ship** for each line
5. Click **OK** to create order

**System performs:**
- Creates new sales order with selected items
- Links order lines to blanket order lines
- Updates blanket order quantities used
- Applies customer-specific pricing

## Understanding the Sales Order Header

### Customer Information

| Field | Description | Editable |
|-------|-------------|----------|
| **Sell-to Customer No.** | Primary customer account | Yes |
| **Sell-to Customer Name** | Customer name (auto-filled) | No |
| **Bill-to Customer No.** | Billing customer (if different) | Yes |
| **Ship-to Code** | Alternate shipping address | Yes |
| **Ship-to Name/Address** | Delivery address | Yes |

### Order Details

| Field | Description | Editable |
|-------|-------------|----------|
| **Order Date** | Date order was created | Yes |
| **Shipment Date** | Target ship date [REQUIRED] | Yes (with restrictions) |
| **Posting Date** | Accounting date for posting | Yes |
| **Document Date** | Document reference date | Yes |
| **Promised Delivery Date** | Date promised to customer | Yes |
| **Requested Delivery Date** | Date requested by customer | Yes |

### Logistics Fields

| Field | Description | Editable |
|-------|-------------|----------|
| **Location Code** | Warehouse/facility code | Yes |
| **Shipment Method Code** | Shipping carrier/method | Yes |
| **Payment Method Code** | Payment terms | Yes |
| **Payment Terms Code** | Invoice payment terms | Yes |
| **Salesperson Code** | Assigned sales rep | Yes |

### Picking & Shipping Status

| Field | Description | System-Managed |
|-------|-------------|-----------------|
| **Picking Status** | Current stage in pick process | Yes |
| **Approval Status** | Order approval state | Yes |
| **Fulfillment Status** | Overall order status | Yes |
| **Inventory Status** | Return inventory status | Yes |
| **Picking Ticket No.** | Assigned pick ticket | Yes |
| **Run No.** | Picking run number | Editable |
| **Load No.** | Transportation load number | Editable |
| **Stop No.** | Delivery stop sequence | Editable |
| **Delivery Run No.** | Delivery route number | Editable |
| **Driver Name** | Assigned driver | Editable |

### Blanket Order Integration

| Field | Description | Type |
|-------|-------------|------|
| **Blanket Sales Order No.** | Source blanket order | Read-only |
| **Blanket Qty. Used** | Total quantity used from blanket | Calculated |
| **Blanket Qty. Remaining** | Remaining blanket quantity | Calculated |

### Cart Management

| Field | Description | Type |
|-------|-------------|------|
| **Cart Quantity** | Total carts needed | Calculated |
| **Ship From Facility Code** | Primary shipping facility | Editable |
| **Pick Facility 1-4 Code** | Facilities with items | Calculated |
| **Facility 1-4 Cart Qty.** | Carts per facility | Calculated |

## Working with Sales Lines

### Adding Items to Order

**Method 1: Standard Line Entry**
1. In **Lines** section, click **New**
2. Enter **Item No.** (search to browse)
3. Enter **Quantity**
4. System auto-fills description, unit price, availability
5. Press **Enter** to save line

**Method 2: Rapid Order Entry** (faster for multiple items)
1. Click **Rapid Order Entry** button
2. Scan or type item numbers and quantities
3. System adds items automatically
4. Exit rapid mode to continue

**Method 3: Add Items from Blanket Order**
1. Click **Actions → Add Items from Blanket Order**
2. Select blanket order
3. Choose items and enter quantities
4. System links to blanket order

### Line Fields

| Field | Description | Editable | Notes |
|-------|-------------|----------|-------|
| **Type** | Item, Resource, G/L Account | No | Determined by header |
| **No.** | Item number | Yes | Required |
| **Variant Code** | Color, size, blooming stage | Yes | For items with variants |
| **Description** | Item name | Auto-filled | Can edit for notes |
| **Quantity** | Units to order | Yes | Decimal allowed |
| **Unit Price** | Price per unit | Yes | Overrides standard price |
| **Line Amount** | Qty × Unit Price | Calculated | Before discounts |
| **Discount %** | Line discount | Yes | Applied to amount |
| **Shipment Date** | When this line ships | Editable | Can differ from header |
| **Requested Delivery Date** | Customer desired date | Yes | For tracking |
| **Blanket Order No./Line** | Source blanket order | Read-only | If from blanket |

## Order Status and Workflow

### Status Progression

**Order Status** (shown in header):
- **Draft** — Being created, not released
- **Released** — Ready for processing
- **Partly Shipped** — Some items picked/shipped
- **Shipped** — All items shipped
- **Completely Invoiced** — Billed to customer

**Picking Status** (system-managed):
- **Blank** — Not yet in picking workflow
- **Locked For Master Pick** — Frozen, awaiting ticket generation
- **In Master Pick** — Master picking in progress
- **Supermarket Pick** — In supermarket phase
- **Completed** — Fully picked

## Rapid Order Entry

**Purpose:** Quickly add multiple items to order without clicking for each item

**How to Use:**
1. Click **Rapid Order Entry** button
2. Focus on item entry field
3. Scan or type item number
4. Press **Tab**, enter quantity
5. Press **Enter** to add to order
6. Repeat for next item
7. Click **Exit** when done

**Features:**
- Fast keyboard entry
- Real-time availability display
- Automatic pricing
- Batch item additions

## Move Lines Between Orders

**Purpose:** Transfer lines from one order to another based on availability

**When to Use:**
- Customer has multiple orders with different shipment dates
- Need to consolidate orders for more efficient picking
- Move items to earlier shipment date if available
- Move items to later date to preserve current availability for other customers

**See:** [[move-lines]] for complete guide

## Blanket Orders and Standing Orders

**Purpose:** Establish ongoing commitments with regular customers

**Creation:**
1. Create new order
2. Change **Document Type** to **Blanket Order**
3. Fill in standard customer and item information
4. Save with quantities and dates

**Making Orders from Blanket:**
- See "Creating from Blanket Order" section above
- System links new orders to original blanket
- Tracks quantities used vs. remaining

**Benefits:**
- Establish pricing/availability guarantees
- Track customer commitments
- Generate regular orders efficiently
- Monitor usage against commitment

## Automatic Fee Management

**Freight Fees:**
- Automatically calculated based on:
  - Shipment Method Code
  - Customer location
  - Order weight/dimension
  - Distance
- Can be manually overridden or removed

**Credit Card Fees:**
- Applied when Payment Method Code = credit card
- Calculated as percentage of order amount
- Can be recalculated if order changes
- Appears as separate line item

**Disable Fees:**
- Check **Freight Removed** to suppress freight
- Update **Payment Method** to avoid credit card fees

## Blooming Stage Preferences

Some customers prefer items at specific blooming stages (Green Bud, Bud & Bloom, Full Bloom).

**Setting Preferences:**
1. Open customer card
2. Go to **Blooming Stage Preferences** section
3. Set preferred stage for each item type
4. Save

**When Adding Items:**
- System shows customer preference
- Pre-fills variant code matching preference
- Can be overridden per line if needed

## Common Tasks

### Editing an Order After Creation

**Before Release:**
- All fields and lines fully editable
- Quantity, price, dates all changeable

**After Release:**
- Cannot delete order
- Can modify certain fields (dates, prices, quantities)
- Cannot add/remove lines once picking starts

### Changing Shipment Date

1. Open order
2. Change **Shipment Date** field
3. System validates availability for new date
4. Affects freight calculation if needed
5. Save changes

**Restriction:** Cannot change if order is in picking

### Assigning to Picking Run

**Manual Assignment:**
1. Open order
2. Enter **Run No.** (assigned by picking manager)
3. Save

**Automatic Assignment:**
- System assigns run when order locked for picking
- Based on shipment date and picking calendar

## Troubleshooting

### Issue: Cannot Add Items to Order

**Cause:** Shipment Date not set

**Solution:** Set **Shipment Date** in header before adding lines

### Issue: Item Shows Unavailable But in Inventory

**Cause:** Items reserved for other orders or in different location

**Solution:** 
- Check item availability report
- Use Move Lines to consolidate orders
- Check [[availability-reserves]] for reserved quantities

### Issue: Freight Fee Not Calculating

**Cause:** Shipment Method not set

**Solution:** Set **Shipment Method Code** in header

## Best Practices

✅ **DO:**
- Always set **Shipment Date** before adding items
- Use **Rapid Order Entry** for large orders
- Review order **Line Amount** before releasing
- Set **Salesperson Code** for commission tracking
- Use **Blanket Orders** for repeat customers
- Check inventory availability before confirming shipment

❌ **DON'T:**
- Release order without confirming availability
- Change shipment date after picking starts
- Delete lines after order released
- Manually adjust freight fees without approval
- Use generic item descriptions for notes

## Related Pages

- [[move-lines]] — Transfer lines between orders
- [[order-lock]] — Locking orders for picking workflow
- [[sales-planning]] — Managing sales targets
- [[sales-process-history]] — Tracking order changes
