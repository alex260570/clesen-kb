# Sales Order Management User Guide

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Audience:** Sales Staff

## Table of Contents

- [Overview](#overview)
- [Creating Sales Orders](#creating-sales-orders)
- [Understanding the Sales Order Header](#understanding-the-sales-order-header)
- [Working with Sales Lines](#working-with-sales-lines)
- [Order Status and Workflow](#order-status-and-workflow)
- [Rapid Order Entry](#rapid-order-entry)
- [Move Lines Between Orders](#move-lines-between-orders)
- [Blanket Orders and Standing Orders](#blanket-orders-and-standing-orders)
- [Automatic Fee Management](#automatic-fee-management)
- [Order Locking and Pick Process](#order-locking-and-pick-process)
- [Shipment Date Management](#shipment-date-management)
- [Blooming Stage Preferences](#blooming-stage-preferences)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [SOP Document](#sop-document)

---

## Overview

The Sales Order Management system in Clesen Horticulture provides comprehensive tools for creating, modifying, and tracking customer orders throughout their lifecycle. This system integrates with inventory availability, pricing, picking operations, and shipping management to ensure accurate and efficient order processing.

### What You Can Do

- Create and manage sales orders, quotes, and blanket orders
- Add items quickly using Rapid Order Entry
- Transfer lines between orders using Move Lines
- Track order status through the picking and shipping process
- Manage automatic freight and credit card fees
- Set customer-specific blooming stage preferences
- Monitor order history and changes

### Prerequisites

- Active user account with sales permissions
- Access to Sales Order List and Sales Order pages
- Understanding of customer accounts and item inventory

---

## Creating Sales Orders

### Sales Order Types

The system supports three main document types:

| Document Type | Purpose | When to Use |
|---------------|---------|-------------|
| **Quote** | Price estimate for customer | Customer wants pricing before committing |
| **Blanket Order** | Standing order with periodic releases | Regular seasonal orders, contract customers |
| **Order** | Standard sales order | One-time orders, immediate shipments |

### Creating a New Sales Order

1. Navigate to **Sales → Sales Orders**
2. Click **+ New** to create a new order
3. Fill in the header information:

   **Required Fields:**
   - **Customer No.** - Select the customer (type to search)
   - **Shipment Date** - When the order will ship
   - **Order Date** - Date order was placed (defaults to today)

   **Important Fields:**
   - **Shipment Method Code** - How order will ship (affects freight calculation)
   - **Payment Method Code** - Payment terms (affects credit card fees)
   - **Location Code** - Warehouse location for items
   - **Salesperson Code** - Sales representative

4. Click **OK** to save the header
5. Add items to the order (see [Working with Sales Lines](#working-with-sales-lines))

> **Note:** The **Shipment Date** is required before you can add items or use Rapid Order Entry.

### Creating from Blanket Order

If the customer has a standing blanket order:

1. Open the **Blanket Order**
2. Click **Actions → Functions → Make Order**
3. Enter the **Shipment Date** for this release
4. Select items and enter **Qty. to Ship** for each line
5. Click **OK** to create the order

The system will:
- Create a new sales order with selected items
- Link order lines to blanket order lines
- Update blanket order quantities used
- Apply customer-specific pricing

> **Tip:** You can also add more items to an existing order from a blanket order using **Actions → Add Items from Blanket Order**.

---

## Understanding the Sales Order Header

The sales order header contains key information that controls how the entire order is processed.

### General Tab

**Customer Information:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Sell-to Customer No.** | Primary customer account | Yes |
| **Sell-to Customer Name** | Customer name (auto-filled) | No |
| **Bill-to Customer No.** | Billing customer (if different) | Yes |
| **Ship-to Code** | Alternate shipping address | Yes |
| **Ship-to Name/Address** | Delivery address (auto-filled from ship-to) | Yes |

**Order Details:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Order Date** | Date order was created | Yes |
| **Shipment Date** | Target ship date **[Required]** | Yes (with restrictions) |
| **Posting Date** | Accounting date for posting | Yes |
| **Document Date** | Document reference date | Yes |
| **Promised Delivery Date** | Date promised to customer | Yes |
| **Requested Delivery Date** | Date requested by customer | Yes |

**Logistics:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Location Code** | Warehouse/facility code | Yes |
| **Shipment Method Code** | Shipping carrier/method | Yes |
| **Payment Method Code** | Payment terms | Yes |
| **Payment Terms Code** | Invoice payment terms | Yes |
| **Salesperson Code** | Assigned sales rep | Yes |

### Clesen Extended Fields

**Status Fields:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Picking Status** | Current stage in pick process | No (system-managed) |
| **Approval Status** | Order approval state | No (system-managed) |
| **Fulfillment Status** | Overall order status | No (system-managed) |
| **Inventory Status** | Return inventory status | No |

**Web Order Fields:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Web Order** | Order originated from website | No |
| **Web Req. Shipment Date** | Original date requested online | No |
| **Web ShipDate Not Compliant** | Requested date unavailable | No |
| **Requested Shipment Date** | Date customer requested | No |
| **ShipDate Move Requested** | Change requested pending approval | No |

**Blanket Order Integration:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Blanket Sales Order No.** | Source blanket order | No |
| **Blanket Qty. Used** | Total quantity used from blanket | No (calculated) |
| **Blanket Qty. Remaining** | Remaining blanket quantity | No (calculated) |

**Picking & Shipping:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Picking Ticket No.** | Assigned pick ticket | No |
| **Run No.** | Picking run number | Yes |
| **Load No.** | Transportation load number | Yes |
| **Stop No.** | Delivery stop sequence | Yes |
| **Delivery Run No.** | Delivery route number | Yes |
| **Driver Name** | Assigned driver | Yes |
| **Direct Location Pickup** | Customer pickup vs. delivery | No |
| **Shipment Blocked** | Order cannot ship | No |

**Fee Management:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Freight Removed** | Manual freight removal flag | No |
| **Recalc. Credit Card Fee** | Fee recalculation trigger | No |

**Cart Management:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Cart Quantity** | Total carts needed | No (calculated) |
| **Ship From Facility Code** | Primary shipping facility | Yes |
| **Pick Facility 1-4 Code** | Facilities with items | No (calculated) |
| **Facility 1-4 Cart Qty.** | Carts per facility | No (calculated) |

**Tracking & Notifications:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Package Tracking No.** | Carrier tracking number | Yes |
| **Shipping Agent Code** | Shipping carrier | Yes |
| **Add Tracking Email to Queue** | Send tracking notification | Yes |
| **Tracking E-Mail Status** | Email delivery status | No |
| **Delivery Notification Sent** | Notification sent flag | No |

---

## Working with Sales Lines

Sales order lines contain the items being ordered. Each line has quantity, pricing, and delivery information.

### Adding Items Manually

1. Navigate to the **Lines** FastTab
2. Click in the first empty line
3. In the **Type** field, select **Item**
4. In the **No.** field, enter or lookup the item number
5. The system auto-fills:
   - Description
   - Unit of Measure
   - Default variant (if applicable)
   - Default location
   - Unit price
6. Enter **Quantity**
7. The system calculates:
   - Line Amount
   - Cart Quantity (for shipping)
   - Availability status

> **Tip:** For faster entry with multiple items, use [Rapid Order Entry](#rapid-order-entry) instead.

### Sales Line Fields Reference

**Item Information:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Type** | Line type (Item, G/L Account, Resource, etc.) | Yes |
| **No.** | Item number or account | Yes |
| **Description** | Item description | Yes |
| **Variant Code** | Item variant (auto-filled from default) | Yes |
| **Unit of Measure Code** | UOM (EA, FLAT, etc.) | Yes |

**Quantity & Pricing:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Quantity** | Total order quantity | Yes |
| **Qty. to Ship** | Quantity on this shipment | Yes |
| **Quantity Shipped** | Already shipped quantity | No |
| **Outstanding Quantity** | Remaining to ship | No |
| **Unit Price** | Price per unit | Yes |
| **Line Discount %** | Discount percentage | Yes |
| **Line Amount** | Extended line total | No (calculated) |

**Shipment & Location:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Shipment Date** | Line-specific ship date | Yes |
| **Location Code** | Warehouse location | Yes |
| **Bin Code** | Warehouse bin | Yes |
| **Qty. per Unit of Measure** | UOM conversion factor | No |

### Clesen Extended Line Fields

**Availability:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Avail. Status** | Availability indicator (color-coded) | No |
| **Avail. Shortage** | Oversold indicator | No |
| **Qty. Available prior Change** | Availability before this line | No |
| **Avail. Calc. Inactive** | Skips availability checking | No (system) |

**Blanket Order Tracking:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Blanket Order No.** | Source blanket order | No |
| **Blanket Order Line No.** | Source blanket line | No |
| **Blanket Qty. Used** | Quantity allocated from blanket | No |
| **Blanket Qty. Remaining** | Quantity still available on blanket | No |
| **Sales Line Set ID** | Groups related lines | No |

**Picking & Fulfillment:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Cart Quantity** | Carts required for this line | No (calculated) |
| **Pick Facility Code** | Facility where item is picked | Yes |
| **Run No.** | Picking run number | No |
| **Picking Ticket No.** | Assigned pick ticket | No |
| **Qty. not Shipped** | Outstanding quantity | No |
| **Qty. not Invoiced** | Quantity shipped but not invoiced | No |

**Item Classification:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Item Type** | Inventory vs. Non-Inventory | No (from item card) |
| **Pot Size Code** | Container size | No (from item) |
| **Blooming Stage** | Plant maturity stage | Yes |
| **Default Item Location Code** | Item's default location | No |

**Change Tracking:**

| Field | Description | Editable |
|-------|-------------|----------|
| **Change Reason Code** | Reason for manual changes | Yes |
| **Sales Line History Amount** | Historical value changes | No (calculated) |

**Return Processing:**

| Field | Description | Editable |
|-------|-------------|----------|
| **No Physical Return** | Credit without physical return | No |

### Line Validation Rules

The system enforces these rules when you modify sales lines:

1. **Item Number Changes:**
   - System sets default variant automatically
   - Default location is applied from item setup
   - Cart quantity recalculates based on UOM

2. **Quantity Changes:**
   - Availability is checked (if not disabled)
   - Cart quantity recalculates
   - Blanket order quantities update
   - Freight and credit card fees may recalculate

3. **Shipment Date Changes:**
   - Availability is rechecked for new date
   - Cannot set dates in the past
   - Service zone constraints apply

4. **Location Changes:**
   - Availability recalculates for new location
   - Pick facility may update

> **Warning:** If the order is already in the pick process (Picking Status ≠ " "), most fields are locked. See [Order Locking](#order-locking-and-pick-process) for details.

---

## Order Status and Workflow

Sales orders move through several status stages from creation to completion.

### Picking Status

The **Picking Status** field tracks the order through warehouse operations:

| Status | Meaning | Order Editable? |
|--------|---------|-----------------|
| **(Blank)** | Not yet in pick process | **Yes** |
| **Locked For Master Pick** | Assigned to pick batch, awaiting pull | **Authorized users only** |
| **Master Pull** | Being pulled in warehouse | **No** |
| **Picked** | Picked and ready for staging | **No** |
| **Supermarket** | In supermarket staging area | **No** |
| **Supermarket Pick** | Being picked from supermarket | **No** |
| **Direct Location Pick** | Customer pickup/direct ship | **Yes** |
| **In Transit** | Shipped from warehouse | **No** |
| **Escalation Request** | Exception requested | **Yes** |
| **Escalation Approved** | Exception approved | **No** |
| **Escalation Ticket Created** | Support ticket created | **No** |
| **Escalation in Pick** | Exception being processed | **Yes** |
| **Escalation Rejected** | Exception denied | **Yes** |
| **Shipped** | Completed and shipped | **Yes** |

> **Note:** The system automatically updates Picking Status as the order moves through warehouse operations. You cannot manually change this field.

### Approval Status

For orders requiring approval (returns, credits, etc.):

| Status | Meaning |
|--------|---------|
| **(Blank)** | No approval required |
| **Pending Approval** | Awaiting manager approval |
| **Approved Inv. Posting awaiting** | Approved, ready to post |
| **Rejected** | Approval denied |

### Fulfillment Status

Overall order fulfillment stage:

| Status | Meaning |
|--------|---------|
| **(Blank)** | Order created, not processed |
| **In Progress** | Items being picked/prepared |
| **Ready to Ship** | Picked, awaiting shipment |
| **Shipped** | Shipped to customer |
| **Invoiced** | Invoiced and complete |

---

## Rapid Order Entry

Rapid Order Entry provides a fast, grid-based interface for adding multiple items to an order at once. This is the fastest way to build orders with many line items.

### When to Use Rapid Order Entry

- Adding 5+ items to an order
- Reviewing item availability while ordering
- Building orders from seasonal item lists
- Quick reorders of common items

### Opening Rapid Order Entry

1. Open or create a sales order
2. **Enter the Shipment Date** (required)
3. Click **Actions → Processing → Rapid Order Entry**
4. The worksheet opens showing available items

> **Note:** You cannot use Rapid Order Entry if the order is already in the pick process.

### Using Rapid Order Entry

The worksheet shows:

- All items for the season matching your shipment date
- Items already on your order (marked "Sales Line")
- Real-time availability for each item
- Color-coded availability status (Green = Available, Red = Not Available)

**To add items:**

1. Browse or filter to find items
2. Enter quantities in the **New Qty.** column
3. For items already on order, this updates the quantity
4. For new items, this adds them to order
5. Click **OK** when finished

The system will:
- Add new lines for new items
- Update quantities for existing items
- Recalculate freight charges (if auto-freight enabled)
- Recalculate credit card fees (if applicable)
- Merge duplicate lines if necessary

**Filtering items:**
- Use the filter pane to narrow by description, pot size, or season
- Press `Ctrl+F` to search for specific items
- Season filters apply automatically based on shipment date

> **For complete details,** see the [Rapid Order Entry User Guide](rapid-order-entry-user-guide.md).

---

## Move Lines Between Orders

Move Lines allows you to transfer items (or portions of items) from one sales order to another. This is essential for order consolidation, splitting, and shipment date adjustments.

### When to Use Move Lines

- **Consolidate orders:** Combine multiple small orders into one shipment
- **Split orders:** Separate items with different ship dates
- **Adjust shipment dates:** Move items to orders with different delivery dates
- **Reorganize orders:** Adjust order composition based on availability

### Using Move Lines

1. Open the source order (order you're moving FROM)
2. Click **Actions → Functions → Move Lines**
3. The Move Lines worksheet opens showing all order lines

**To move lines to an existing order:**

1. Enter the target order number in **ToOrderNo** field
2. Set **New Shipment Date** for each line
3. Enter **Qty. to Move** for each line
4. Review availability on new date
5. Click **Move Items**

**To move lines to a new order:**

1. Leave **ToOrderNo** blank
2. Enter **Shipment Method Code** for the new order
3. Set **New Shipment Date** for lines being moved
4. Enter **Qty. to Move** for each line
5. Click **Move Items**

The system will:
- Transfer lines to target order (or create new order)
- Update blanket order quantities
- Recalculate fees on both orders
- Preserve pricing and discounts
- Merge lines if same item exists on target

> **For complete details and advanced scenarios,** see the [Move Lines User Guide](move-lines-user-guide.md).

---

## Blanket Orders and Standing Orders

Blanket orders are standing orders used for contract customers with regular, recurring deliveries throughout a season.

### Understanding Blanket Orders

A blanket order contains:
- Customer's total seasonal commitment
- Items and quantities for the full season
- Pricing locked for the season
- Terms and conditions

From the blanket order, you create **release orders** for specific shipment dates.

### Creating Orders from Blanket Orders

**Method 1: Make Order**

1. Open the blanket order
2. Click **Actions → Functions → Make Order**
3. Enter **Shipment Date** for this release
4. Enter **Qty. to Ship** for each item
5. Click **OK**

A new sales order is created with:
- Selected items and quantities
- Link to blanket order preserved
- Blanket quantities updated automatically

**Method 2: Add Items to Existing Order**

1. Open an existing sales order
2. Click **Actions → Add Items from Blanket Order**
3. Select the blanket order
4. Enter **Qty. to Ship** for items to add
5. Click **OK**

Items are added to the current order.

### Blanket Order Tracking

Each order line tracks its relationship to the blanket order:

| Field | What It Shows |
|-------|---------------|
| **Blanket Order No.** | Source blanket order number |
| **Blanket Order Line No.** | Line number on blanket order |
| **Blanket Qty. Used** | Total quantity released from blanket |
| **Blanket Qty. Remaining** | Quantity still available to order |

The blanket order header shows roll-up totals:
- **Blanket Qty. Used** - Total released across all orders
- **Blanket Qty. Remaining** - Total still available

### Blanket Order Rules

1. **Quantity Validation:**
   - You cannot release more than the blanket order quantity
   - System warns if trying to exceed blanket quantity
   - Can request blanket order increase if needed

2. **Pricing:**
   - Price comes from blanket order (locked for season)
   - Manual price changes require authorization

3. **Multiple Orders:**
   - One blanket order can have many release orders
   - Each release order can draw from multiple blanket orders
   - System tracks which orders use which blanket quantities

> **Important:** When Move Lines increases quantity beyond current line quantity, the system checks the blanket order and confirms if sufficient quantity is available.

---

## Automatic Fee Management

The system automatically calculates and adds freight and credit card fees to orders based on configuration.

### Freight Charges

Freight charges are controlled by the **Shipment Method Code** on the order header.

**Calculation Methods:**

1. **Fixed Price:**
   - Flat fee based on shipment method
   - Added as a line item automatically
   - Updates when shipment method changes

2. **Total Value:**
   - Percentage of order value
   - Recalculates when order total changes
   - Minimum and maximum amounts may apply

3. **Related Items:**
   - Specific items trigger freight charges
   - Freight item added if related item is on order

**When Freight Recalculates:**

- Shipment method changes
- Order lines are added/removed
- Quantities change
- Prices change
- Using Rapid Order Entry (deletes and recreates freight line)

**Manual Freight Removal:**

If you manually delete the freight line:
- **Freight Removed** flag is set
- System will not automatically re-add freight
- To re-enable, change shipment method or use Rapid Order Entry

### Credit Card Fees

Credit card fees are controlled by the **Payment Method Code** on the order header.

**How It Works:**

1. Payment method links to a specific credit card fee item
2. System calculates fee as percentage of order total (excluding other fees)
3. Fee line is added automatically
4. Recalculates when order total changes

**When Credit Card Fee Recalculates:**

- Payment method changes
- Order lines are added/removed
- Item quantities or prices change
- Using Rapid Order Entry (deletes and recreates fee line)

**Payment Terms Without Fees:**

If you change payment method to one without credit card fees:
- System deletes the fee line automatically
- No fee is charged

> **Note:** Credit card fee is always recalculated to match the current order total. You cannot manually adjust the fee amount.

### Fee Line Identification

Fee lines appear at the bottom of the order:

| Line Type | Item No. | Description |
|-----------|----------|-------------|
| **Freight** | Varies by shipment method | "Freight Charge" or carrier name |
| **Credit Card Fee** | Varies by payment terms | "Credit Card Processing Fee" |

These lines:
- Cannot be manually edited (price and quantity)
- Are automatically managed by the system
- Do not affect availability calculations
- Are excluded from cart quantity calculations

---

## Order Locking and Pick Process

Once an order enters the pick process, it becomes locked to prevent changes that could cause picking errors.

### When Orders Lock

Orders lock when **Picking Status** changes from blank to any pick-related status:

- **Locked For Master Pick** - Order assigned to a pick batch
- **Master Pull** - Warehouse is pulling items
- **Picked** - Items picked and staged
- **Supermarket/Supermarket Pick** - In staging/being picked
- **In Transit** - Shipped from warehouse

### What You Can't Do When Locked

- Add new lines
- Change quantities
- Change shipment dates on header
- Modify item numbers
- Change locations or bins
- Use Rapid Order Entry
- Use Move Lines (as source order)

### What You Can Still Do

- View order and lines
- Print documents
- Add comments/notes

### Unlocking Orders

**Authorized Users:**

Users with special authorization can:
- Edit locked orders for corrections
- Use the "unlock" function to temporarily enable changes

**Escalation Process:**

If changes are required:

1. Request escalation through picking management
2. **Picking Status** changes to **Escalation Request**
3. Manager reviews and approves
4. Status changes to **Escalation Approved**
5. Order becomes editable for corrections
6. Re-enters pick process after changes

### Direct Location Pickup Orders

Orders with **Direct Location Pickup** = Yes are not locked:
- These are customer pickup orders
- Not part of warehouse pick process
- Remain editable until posted

---

## Shipment Date Management

The shipment date controls when an order ships, affects item availability, and determines which warehouse operations process the order.

### Setting Shipment Dates

**On Order Header:**

1. Open the sales order
2. Enter or validate **Shipment Date** field
3. System validates date against business rules

**On Individual Lines:**

1. Navigate to sales lines
2. Each line can have its own **Shipment Date**
3. Lines with different dates may create separate shipments

### Shipment Date Rules

1. **Cannot be in the past**
   - System prevents backdated shipments
   - Exception: Authorized users can set past dates for corrections

2. **Service zone constraints**
   - Some customers have specific delivery days
   - System validates shipment date against service zone rules
   - Warning appears if date is not valid for customer's zone

3. **Availability checking**
   - Changing shipment date triggers availability recalculation
   - System checks if items are available on new date
   - Warnings appear if new date creates shortages

4. **Order locking**
   - If order is in pick process, shipment date cannot be changed
   - Requires escalation to modify

### Shipment Date Change Requests

For web orders or customer-requested changes:

**Fields Used:**

| Field | Purpose |
|-------|---------|
| **Requested Shipment Date** | Customer's desired date |
| **Shipment Date** | Confirmed/approved date |
| **ShipDate Move Requested** | Change pending approval |
| **Web Req. Shipment Date** | Original web order date |
| **Web ShipDate Not Compliant** | Web date not available |

**Workflow:**

1. Customer requests different date (phone, email, web)
2. **Requested Shipment Date** is recorded
3. **ShipDate Move Requested** flag is set
4. Manager reviews request
5. If approved, **Shipment Date** is updated
6. System recalculates availability and fees

### Changing Shipment Dates

**For unlocked orders:**

1. Click on **Shipment Date** field
2. Enter new date
3. Press `Tab` or `Enter`
4. System recalculates:
   - Availability for all lines
   - Season-appropriate items (if using Rapid Order Entry)
   - Pick assignments

**For locked orders:**

1. Request escalation through picking management
2. Provide reason for date change
3. Await approval
4. Make changes once approved
5. Order re-enters pick process

> **Tip:** If you need to split an order by shipment date, use [Move Lines](#move-lines-between-orders) to transfer items with different dates to a new order.

---

## Blooming Stage Preferences

For plant items, you can specify the desired blooming stage to ensure customers receive plants at the right maturity level.

### What is Blooming Stage?

Blooming stage indicates how developed a plant is:

| Stage | Description |
|-------|-------------|
| **Tight Bud** | Buds formed but not open |
| **Cracking Color** | Buds showing first color |
| **Partially Open** | Some blooms open |
| **Full Bloom** | Fully flowering |
| **Finished Bloom** | Past peak bloom |

### Setting Blooming Stage

**Order-Level Preference (Header):**

1. Open the sales order
2. Navigate to the **General** tab
3. Set **Preferred Blooming Stage**
4. Set **Stage Substitution** option:
   - **No Substitution** - Must match stage exactly
   - **Earlier Stage OK** - Can ship if earlier stage available
   - **Later Stage OK** - Can ship if later stage available
   - **Any Stage** - Ships whatever is available

**Line-Level Preference:**

1. Navigate to sales lines
2. For each plant item, set **Blooming Stage**
3. Line-level setting overrides order-level preference

### How Blooming Stage Works

1. **Availability Checking:**
   - System checks if items at requested stage are available
   - If substitution allowed, checks alternate stages

2. **Picking:**
   - Warehouse staff pick plants matching the requested stage
   - Substitution rules guide what stage is acceptable

3. **Customer Communication:**
   - Stage preference appears on pick tickets and packing slips
   - Ensures customer receives plants as expected

> **Best Practice:** For customers with specific stage preferences (e.g., retail customers who need tight buds for shelf life), always set blooming stage preferences and use "No Substitution" or narrow substitution rules.

---

## Common Tasks

### Checking Order Status

1. Open **Sales → Sales Orders**
2. Use filters to find order:
   - **Customer Name** filter
   - **Order No.** filter
   - **Shipment Date** filter
3. Review **Picking Status** and **Fulfillment Status** columns
4. Open order to see detailed status

### Printing Order Confirmation

1. Open the sales order
2. Click **Actions → Print → Order Confirmation**
3. Review print preview
4. Click **Print** or **Send by Email**

### Printing Pick Ticket

1. Open the sales order (must be released to pick)
2. Click **Actions → Print → Pick Ticket**
3. Review print preview
4. Print for warehouse

### Copying an Order

To create a new order based on an existing order:

1. Create a new sales order
2. Fill in customer and header information
3. Click **Actions → Functions → Copy Document**
4. Select **Document Type** = Order
5. Enter the **Document No.** to copy from
6. Select options:
   - **Include Header** - Copy header fields
   - **Recalculate Lines** - Update prices
7. Click **OK**

### Finding Customer's Order History

1. Open **Customers** list
2. Open the customer card
3. Click **Navigate → History → Ledger Entries**
4. Or click **Navigate → Orders → Orders**
5. Review past orders and quantities

### Creating a Quote

1. Navigate to **Sales → Sales Quotes**
2. Click **+ New**
3. Fill in customer and header information
4. Add items and pricing
5. Print or email quote to customer

**To convert quote to order:**

1. Open the quote
2. Click **Actions → Functions → Make Order**
3. System creates order from quote
4. Quote is archived

### Creating a Blanket Order

1. Navigate to **Sales → Blanket Sales Orders**
2. Click **+ New**
3. Fill in customer information
4. Set **Shipment Date** to season end date
5. Add all items for the season with total quantities
6. Lock pricing if seasonal contract

---

## Troubleshooting

### Cannot Add Items to Order

**Problem:** "Please enter a Shipment Date" message appears

**Solution:**
- Fill in the **Shipment Date** field on the order header
- Shipment Date is required before adding items

---

### Cannot Use Rapid Order Entry

**Problem:** "You cannot use Rapid Order Entry on this order because it is already in the pick process"

**Solution:**
- Order is locked for picking
- Add items manually instead, or
- Request escalation to unlock order

---

### Freight Charge Not Calculating

**Problem:** No freight line appears on order

**Possible Causes and Solutions:**

1. **Shipment method has no freight item:**
   - Check **Shipment Method Code** on order
   - Verify shipment method has **Freight Item No.** configured
   - Contact IT if freight setup is incorrect

2. **Freight was manually removed:**
   - Check if **Freight Removed** flag is set
   - Change shipment method to reset, or
   - Use Rapid Order Entry to rebuild order

3. **Freight calculation inactive:**
   - System may be in special mode (technical)
   - Changes will take effect after current operation completes

---

### Credit Card Fee Incorrect

**Problem:** Credit card fee doesn't match order total

**Solution:**
- Credit card fee recalculates automatically
- If not calculating:
  - Check **Payment Method Code** has credit card fee item configured
  - Save order (triggers recalculation)
  - Use Rapid Order Entry to force recalculation

---

### Cannot Change Shipment Date

**Problem:** Shipment Date field is locked or grayed out

**Possible Causes:**

1. **Order is in pick process:**
   - Check **Picking Status** field
   - If not blank, order is locked
   - Request escalation to change

2. **Merged lines exist:**
   - Previous use of Move Lines created merged lines
   - Merged lines block header shipment date changes
   - Change dates on individual lines instead

3. **Insufficient permissions:**
   - Contact your manager for access

---

### Items Not Available

**Problem:** Availability shows red/negative for items on order

**Options:**

1. **Change Shipment Date:**
   - Move order to date when items are available
   - Use availability display to find suitable date

2. **Split Order:**
   - Use Move Lines to separate available vs. unavailable items
   - Create two orders with different shipment dates

3. **Substitute Items:**
   - Check for alternate items or variants
   - Contact growing department for options

4. **Check Other Locations:**
   - Review availability at other warehouses
   - Change location code if item available elsewhere

---

### Order Shows Wrong Status

**Problem:** Picking status doesn't match warehouse status

**Solution:**
- Status is system-managed based on warehouse operations
- Contact warehouse or IT if status is incorrect
- Do not manually try to change status

---

### Cannot Delete Order

**Problem:** Delete option is grayed out or blocked

**Possible Causes:**

1. **Order is partially posted:**
   - Some lines are shipped or invoiced
   - Cannot delete partially processed orders
   - Can only delete lines that aren't posted

2. **Order is in pick process:**
   - Locked orders cannot be deleted
   - Request escalation to cancel and delete

3. **Order is closed/archived:**
   - Completed orders move to history
   - Cannot delete from history

---

## Best Practices

### Order Creation

1. **Always set shipment date first**
   - Required for adding items
   - Determines season and availability
   - Affects freight and fee calculation

2. **Use Rapid Order Entry for multi-item orders**
   - Faster than manual line entry
   - Shows availability in real-time
   - Reduces data entry errors

3. **Verify customer ship-to address**
   - Confirm correct delivery location
   - Update customer card if address changed
   - Avoid delays from incorrect addresses

4. **Select correct shipment method**
   - Affects freight calculation
   - Determines delivery timeframe
   - Impacts customer service zone validation

### Order Modification

1. **Check pick status before editing**
   - Locked orders require escalation
   - Avoid unnecessary unlock requests
   - Plan changes before order enters pick

2. **Use Move Lines for shipment date changes**
   - Cleaner than changing dates on locked orders
   - Preserves order history
   - Maintains fee calculations

3. **Document reasons for changes**
   - Use **Change Reason Code** on lines
   - Add comments to order
   - Helps with customer service and audits

### Blanket Orders

1. **Review blanket quantities before releasing**
   - Check remaining quantity on blanket
   - Avoid over-releasing
   - Plan releases across full season

2. **Keep pricing locked on blanket orders**
   - Ensures consistent seasonal pricing
   - Prevents accidental price changes
   - Honors customer contracts

3. **Monitor blanket usage regularly**
   - Track **Blanket Qty. Remaining**
   - Forecast customer needs
   - Plan for potential blanket increases

### Fees and Pricing

1. **Let system manage freight and credit card fees**
   - Don't manually delete fee lines unless necessary
   - System recalculates automatically
   - Override only when specifically needed

2. **Verify pricing before confirming order**
   - Check unit prices match customer agreement
   - Review discounts
   - Confirm total amount

3. **Use correct payment terms**
   - Affects credit card fee calculation
   - Determines when customer pays
   - Impacts accounting and cash flow

### Communication

1. **Update customers on shipment date changes**
   - Use **Requested Shipment Date** field to track
   - Send shipment confirmation emails
   - Call customers for significant changes

2. **Add notes to orders**
   - Special delivery instructions
   - Customer preferences
   - Internal coordination notes

3. **Use tracking notifications**
   - Enable **Add Tracking Email to Queue**
   - Customers receive automatic shipment notifications
   - Reduces "where is my order?" calls

### Availability Management

1. **Check availability before promising dates**
   - Use availability display in Rapid Order Entry
   - Review projected availability
   - Don't promise unavailable items

2. **Consider lead times**
   - Allow time for growing/production
   - Factor in warehouse processing time
   - Account for shipping transit time

3. **Split orders proactively**
   - Don't wait for warehouse to discover shortages
   - Use Move Lines to separate available items
   - Ship partial orders rather than delay entire order

---

## SOP Document

The full SOP for this process is available on SharePoint:  
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/sales-order-management-user-guide.pdf)

---

> **Need Help?** Contact your sales manager or IT support if you encounter issues not covered in this guide.
