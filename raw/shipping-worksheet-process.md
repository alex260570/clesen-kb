# Shipping Worksheet - Staff Guide

> **Version:** 1.0  
> **Last Updated:** 2026-02-24  
> **Audience:** Staff

## Table of Contents

- [What Is the Shipping Worksheet?](#what-is-the-shipping-worksheet)
- [Daily Workflow](#daily-workflow)
  - [Step 1: Open the Routing Worksheet](#step-1-open-the-routing-worksheet)
  - [Step 2: Review the Worksheet](#step-2-review-the-worksheet)
  - [Step 3: Export for OptimoRoute](#step-3-export-for-optimoroute)
  - [Step 4: Import Optimized Routes](#step-4-import-optimized-routes)
  - [Step 5: Export Driver Sheets](#step-5-export-driver-sheets)
- [Understanding the Grouping](#understanding-the-grouping)
- [Common Questions](#common-questions)
- [Related Resources](#related-resources)

## What Is the Shipping Worksheet?

The Shipping Worksheet (also called the Routing Worksheet) is a tool that groups all delivery orders by customer and address, so routes can be planned efficiently. It shows how many carts need to go where, and feeds that information into OptimoRoute for route optimization.

## Daily Workflow

### Step 1: Open the Routing Worksheet

1. From the **Transportation Role Center**, click **Routing Worksheet**
2. The system loads all qualifying sales orders for the next 4 days
3. Orders going to the same customer and address are combined into one line

### Step 2: Review the Worksheet

Each line shows:

- `Shipment Date` - When the order ships
- `Customer No.` - The customer
- `Ship-to Name / Address` - Delivery destination
- `Total Cart Qty.` - Total carts needed (rounded up)
- `Shipment Method` - How it's being delivered
- `Notes` - The sales order number(s) included in this line

**Combined orders:** If a line has multiple order numbers in the `Notes` field (e.g., "SO-1234,SO-1235"), it means those orders are shipping to the same address and have been grouped together.

### Step 3: Export for OptimoRoute

1. Click **Export to Excel for OptimoRoute**
2. Select the shipment date you want to export
3. Save the downloaded Excel file
4. Upload the file to OptimoRoute for route optimization

### Step 4: Import Optimized Routes

After OptimoRoute has optimized the routes:

1. Download the optimized Excel from OptimoRoute
2. Click **Import from OptimoRoute**
3. Select the downloaded file
4. The system updates each sales order with:
   - Driver assignment
   - Load number
   - Stop number
   - Delivery run number

### Step 5: Export Driver Sheets

1. Click **Export to Excel for Driver**
2. Select the shipment date
3. Save and print the Excel file for each driver

The driver sheet includes: `Ship-to Name`, `City`, `State`, `ZIP`, `Total Carts`, `Load No.`, `Run No.`, and `Driver Name`.

## Understanding the Grouping

Orders are combined into one worksheet line when they match on:

- Same shipment date
- Same customer
- Same shipment method
- Same full address (street, city, state, ZIP)

**Example:** If Customer 10000 has two orders shipping on the same date to "123 Main St, Chicago, IL 60601" via the same method, they appear as one line with combined cart quantities and both order numbers in `Notes`.

**When orders stay separate:** If the addresses differ in any way (even slightly), they will be separate lines. This includes differences in abbreviations (e.g., "Road" vs "Rd").

## Shipping Labels and Manifests

After routes are optimized and assigned to drivers, shipping labels and manifests must be generated for physical fulfillment.

### Shipping labels

**What it is:** Physical label attached to each shipped case or pallet  
**Contains:** Destination address, tracking barcode, weight  
**Generated:** One per unique customer address  
**Used by:** Carrier (UPS, FedEx, LTL service) for routing

**Generating labels:**

1. Open **Routing Worksheet** for the shipment date
2. Select shipment date and driver
3. Click **Generate Shipping Labels**
4. Choose printer type (Zebra, Avery, etc.)
5. System creates one label per address grouped by stop sequence
6. Print and attach barcode-facing outward to shipment box

### Delivery manifests

**What it is:** Detailed list of all stops on a delivery route  
**Contains:** Stop sequence, customer, package count, signature requirements  
**Given to:** Driver before departure  
**Used for:** Proof of delivery confirmation

**Generating manifests:**

1. From **Routing Worksheet** for the date
2. Click **Generate Driver Manifest**
3. Select specific driver or leave blank for all
4. Choose export format: PDF (print-ready) or Excel (records)
5. Verify all stops are present before handing to driver

### What's on a manifest

A manifest shows:

- Delivery date and driver name
- Load number (YYMMDD + Driver Serial)
- Total stops and total carts
- For each stop: Address, contact, cart count, signature requirements

### Manifest corrections

**If an order was added after manifest printed:**
1. Return to Routing Worksheet
2. Click **Reprint Manifest** - picks up new order
3. Marked as "Version 2" on manifest
4. Give updated version to driver

## Integration with Service Zones

Service zones define which geographic areas receive delivery on which days.

### What are service zones?

Service zones are geographic regions with:
- Defined boundaries (ZIP codes or coverage areas)
- Delivery day schedule (which days of week they deliver)
- Minimum order requirements
- Carrier assignment

**Example:** Zone A covers ZIP 40000-40499 and delivers Monday/Thursday, while Zone B covers 40500-40999 and delivers Tuesday/Friday

### How worksheet uses zones

When the Routing Worksheet generates:

1. System reads each order's ship-to address
2. Matches address to defined service zone
3. Only shows orders valid for that day's delivery zone
4. Prevents scheduling orders to zones that don't deliver

**Result:** You won't see Tuesday orders if running the worksheet for Wednesday (no zone covers that area on Wednesday).

### Scheduling to zones

**If customer needs delivery by Friday but you're running worksheet Wednesday:**

1. Check **Service Zones** to see which days that location delivers
2. If Friday available - hold the order until Friday worksheet
3. If only Monday/Thursday available - escalate to sales for expedited option

## Common Questions

### Why is an order missing from the worksheet?

The order's `Shipment Method` must have "Include in OptimoRoute" enabled. Check with your manager if a shipment method needs to be added.

### Why are two orders separate when they should be combined?

The addresses on the two orders are slightly different. Check the `Ship-to Address` fields on both sales orders - even small differences (like "St" vs "Street") will keep them separate.

### What do the cart quantities mean?

`Total Cart Qty.` is the sum of all cart quantities from the sales lines on the included orders, rounded up to the nearest whole number.

### Can I edit the worksheet?

The worksheet is generated fresh each time you open it. Any route assignments (driver, load, stop) are written back to the sales orders when you import from OptimoRoute.

## Related Resources

- [Manager's Guide](../managers/shipping-worksheet-overview.md) - Configuration and troubleshooting details
