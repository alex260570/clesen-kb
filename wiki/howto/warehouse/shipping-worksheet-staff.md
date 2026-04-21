---
title: Shipping Worksheet — Staff Guide
type: howto
tags: [warehouse, shipping, route-planning, staff, daily-operations]
created: 2026-04-21
updated: 2026-04-21
sources: [shipping-worksheet-process.md]
---

# Shipping Worksheet — Staff Guide

Daily workflow for managing delivery routes and generating driver instructions.

## What Is the Shipping Worksheet?

The Shipping Worksheet (also called the Routing Worksheet) is a tool that groups all delivery orders by customer and address, so routes can be planned efficiently. It shows how many carts need to go where, and feeds that information into OptimoRoute for route optimization.

## Daily Workflow

### Step 1: Open the Routing Worksheet

1. From the **Transportation Role Center**, click **Routing Worksheet**
2. The system loads all qualifying sales orders for the next 4 days
3. Orders going to the same customer and address are combined into one line

### Step 2: Review the Worksheet

Each line shows:

| Column | Description |
|--------|-------------|
| **Shipment Date** | When the order ships |
| **Customer No.** | The customer |
| **Ship-to Name / Address** | Delivery destination |
| **Total Cart Qty.** | Total carts needed (rounded up) |
| **Shipment Method** | How it's being delivered |
| **Notes** | The sales order number(s) included in this line |

**Combined Orders:** If a line has multiple order numbers in the `Notes` field (e.g., "SO-1234,SO-1235"), it means those orders are shipping to the same address and have been grouped together.

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

**When Orders Stay Separate:** If the addresses differ in any way (even slightly), they will be separate lines. This includes differences in abbreviations (e.g., "Road" vs "Rd").

## Shipping Labels and Manifests

After routes are optimized and assigned to drivers, shipping labels and manifests must be generated for physical fulfillment.

### Shipping Labels

**What it is:** Physical label attached to each shipped case or pallet

**Contains:** Destination address, tracking barcode, weight

**Generated:** One per unique customer address

**Used by:** Carrier (UPS, FedEx, LTL service) for routing

**Generating Labels:**

1. Open **Routing Worksheet** for the shipment date
2. Select shipment date and driver
3. Click **Generate Shipping Labels**
4. Choose printer type (Zebra, Avery, etc.)
5. System creates one label per address grouped by stop sequence
6. Print and attach barcode-facing outward to shipment box

### Delivery Manifests

**What it is:** Detailed list of all stops on a delivery route

**Contains:** Stop sequence, customer, package count, signature requirements

**Given to:** Driver before departure

**Used for:** Proof of delivery confirmation

**Generating Manifests:**

1. From **Routing Worksheet** for the date
2. Click **Generate Driver Manifest**
3. Select specific driver or leave blank for all
4. Choose export format: PDF (print-ready) or Excel (records)
5. Verify all stops are present before handing to driver

### What's on a Manifest

A manifest shows:

- Delivery date and driver name
- Load number (YYMMDD + Driver Serial)
- Total stops and total carts
- For each stop: Address, contact, cart count, signature requirements

### Manifest Corrections

**If an Order Was Added After Manifest Printed:**

1. Return to Routing Worksheet
2. Click **Reprint Manifest** — picks up new order
3. Marked as "Version 2" on manifest
4. Give updated version to driver

## Integration with Service Zones

Service zones define which geographic areas receive delivery on which days.

### What Are Service Zones?

Service zones are geographic regions with:
- Defined boundaries (ZIP codes or coverage areas)
- Delivery day schedule (which days of week they deliver)
- Minimum order requirements
- Carrier assignment

**Example:** Zone A covers ZIP 40000-40499 and delivers Monday/Thursday, while Zone B covers 40500-40999 and delivers Tuesday/Friday

### How Worksheet Uses Zones

When the Routing Worksheet generates:

1. System reads each order's ship-to address
2. Matches address to defined service zone
3. Only shows orders valid for that day's delivery zone
4. Prevents scheduling orders to zones that don't deliver

**Result:** You won't see Tuesday orders if running the worksheet for Wednesday (no zone covers that area on Wednesday).

### Scheduling to Zones

**If Customer Needs Delivery by Friday But You're Running Worksheet Wednesday:**

1. Check **Service Zones** to see which days that location delivers
2. If Friday available — hold the order until Friday worksheet
3. If only Monday/Thursday available — escalate to sales for expedited option

## Common Questions

### Why Is an Order Missing from the Worksheet?

The order's `Shipment Method` must have "Include in OptimoRoute" enabled. Check with your manager if a shipment method needs to be added.

### Why Are Two Orders Separate When They Should Be Combined?

The addresses on the two orders are slightly different. Check the `Ship-to Address` fields on both sales orders — even small differences (like "St" vs "Street") will keep them separate.

### What Do the Cart Quantities Mean?

`Total Cart Qty.` is the sum of all cart quantities from the sales lines on the included orders, rounded up to the nearest whole number.

### Can I Edit the Worksheet?

The worksheet is generated fresh each time you open it. Any route assignments (driver, load, stop) are written back to the sales orders when you import from OptimoRoute.

## Best Practices

✅ **DO:**
- Review worksheet before exporting to verify groupings
- Export to OptimoRoute on a regular schedule
- Import optimized routes promptly
- Generate driver sheets and manifests before dispatch
- Print manifests clearly (drivers rely on them)
- Verify manifest has all expected stops
- Reprint if orders are added after initial print
- Communicate delays to drivers immediately

❌ **DON'T:**
- Forget to export to OptimoRoute (missed optimization)
- Leave worksheet data stale (refresh daily)
- Ignore missing orders (investigate why)
- Assume addresses are identical (verify consolidation)
- Skip driver sheet generation (drivers need instructions)
- Give outdated manifests to drivers
- Combine orders to different regions into one route

## Troubleshooting

### Issue: Order Missing from Worksheet

**Cause:** Shipment Method not configured for OptimoRoute

**Solution:** Check with manager; may need configuration update

### Issue: Wrong Orders Grouped Together

**Cause:** Similar addresses were actually different

**Solution:** Correct address data on sales orders for future orders

### Issue: Too Many Lines in Worksheet

**Cause:** Orders have slightly different addresses (e.g., abbreviation differences)

**Solution:** Standardize address entry to improve grouping

### Issue: Manifest Doesn't Match Orders

**Cause:** Orders added after manifest was generated

**Solution:** Regenerate and reprint manifest to include new orders

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Routing Worksheet | Alt+Q → "Routing Worksheet" |
| Export to Excel | Ctrl+E (or use ribbon button) |
| Print | Ctrl+P |
| Save Excel | Ctrl+S (in Excel) |

## Related Pages

- [[shipping-worksheet]] — Manager's guide and configuration
- [[bin-management]] — Moving inventory between bins
- [[cart-exchange]] — Container tracking
- [[service-zone-configuration]] — Geographic delivery zones
