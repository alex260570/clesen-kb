---
title: Shipping Worksheet
type: howto
tags: [warehouse, shipping, route-optimization, daily-operations, optimo-route]
created: 2026-04-21
updated: 2026-05-01
sources: [shipping-worksheet-overview.md, shipping-worksheet-process.md]
---

# Shipping Worksheet

Daily workflow for managing delivery routes and generating driver instructions. The Shipping Worksheet (also called the Routing Worksheet) consolidates sales orders by customer and address for efficient route planning with OptimoRoute optimization.

## What This Is

The Shipping Worksheet is a tool that groups all delivery orders by customer and address, so routes can be planned efficiently. It shows how many carts need to go where, and feeds that information into OptimoRoute for route optimization.

## Process Overview

**Purpose:** Group sales orders by customer and delivery address, then optimize routing with OptimoRoute

**What It Does:**
- Consolidates multiple orders shipping to same address into single worksheet line
- Calculates total cart quantities per delivery
- Manages export/import cycle with OptimoRoute for route planning
- Tracks driver assignments, load numbers, and delivery stops
- Generates driver sheets and manifests

## How It Works

### End-to-End Workflow

```
Sales Orders Created
        ↓
Run Shipping Worksheet (Role Center > Routing Worksheet)
        ↓
Worksheet Generated (orders grouped by customer + address)
        ↓
Export to Excel for OptimoRoute
        ↓
Upload to OptimoRoute (external tool)
        ↓
OptimoRoute Optimizes Routes
        ↓
Download Optimized Excel from OptimoRoute
        ↓
Import from OptimoRoute (writes back driver, load, stop, run)
        ↓
Export Driver Sheets (per-driver delivery lists)
```

### Order Grouping Logic

When the worksheet is generated, orders are combined into a single line when **all** of the following match:

- **Shipment Date** — Same delivery date
- **Customer No.** — Same sell-to customer
- **Shipment Method Code** — Same delivery method
- **Document Type** — Same document type (Order or Return)
- **Full ship-to address** — `Address`, `Address 2`, `City`, `Post Code`, and `County` must all match

**⚠️ IMPORTANT:** Orders with the same customer and `Ship-to Code` but different actual addresses appear as **separate** worksheet lines. This handles cases where addresses are manually overridden on the sales order or modified by webshop integrations.

**When orders are combined:**
- Cart quantities are summed
- Order numbers are concatenated in the `Notes` field (comma-separated)
- Address and contact information come from the first order processed

### Shipment Method Filter

Only orders with a Shipment Method that has `Include in OptimoRoute` enabled appear on the worksheet. Configure this flag on the **Shipment Method** card.

## For Warehouse/Shipping Staff

### Daily Workflow

#### Step 1: Open the Routing Worksheet

1. From the **Transportation Role Center**, click **Routing Worksheet**
2. The system loads all qualifying sales orders for the next 4 days
3. Orders going to the same customer and address are combined into one line

#### Step 2: Review the Worksheet

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

#### Step 3: Export for OptimoRoute

1. Click **Export to Excel for OptimoRoute**
2. Select the shipment date you want to export
3. Save the downloaded Excel file
4. Upload the file to OptimoRoute for route optimization

#### Step 4: Import Optimized Routes

After OptimoRoute has optimized the routes:

1. Download the optimized Excel from OptimoRoute
2. Click **Import from OptimoRoute**
3. Select the downloaded file
4. The system updates each sales order with:
   - Driver assignment
   - Load number
   - Stop number
   - Delivery run number

#### Step 5: Export Driver Sheets

1. Click **Export to Excel for Driver**
2. Select the shipment date
3. Save and print the Excel file for each driver

The driver sheet includes: `Ship-to Name`, `City`, `State`, `ZIP`, `Total Carts`, `Load No.`, `Run No.`, and `Driver Name`.

### Understanding the Grouping

Orders are combined into one worksheet line when they match on:

- Same shipment date
- Same customer
- Same shipment method
- Same full address (street, city, state, ZIP)

**Example:** If Customer 10000 has two orders shipping on the same date to "123 Main St, Chicago, IL 60601" via the same method, they appear as one line with combined cart quantities and both order numbers in `Notes`.

**When Orders Stay Separate:** If the addresses differ in any way (even slightly), they will be separate lines. This includes differences in abbreviations (e.g., "Road" vs "Rd").

### Shipping Labels and Manifests

After routes are optimized and assigned to drivers, shipping labels and manifests must be generated for physical fulfillment.

#### Shipping Labels

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

#### Delivery Manifests

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

#### What's on a Manifest

A manifest shows:

- Delivery date and driver name
- Load number (YYMMDD + Driver Serial)
- Total stops and total carts
- For each stop: Address, contact, cart count, signature requirements

#### Manifest Corrections

**If an Order Was Added After Manifest Printed:**

1. Return to Routing Worksheet
2. Click **Reprint Manifest** — picks up new order
3. Marked as "Version 2" on manifest
4. Give updated version to driver

### Integration with Service Zones

Service zones define which geographic areas receive delivery on which days.

#### What Are Service Zones?

Service zones are geographic regions with:
- Defined boundaries (ZIP codes or coverage areas)
- Delivery day schedule (which days of week they deliver)
- Minimum order requirements
- Carrier assignment

**Example:** Zone A covers ZIP 40000-40499 and delivers Monday/Thursday, while Zone B covers 40500-40999 and delivers Tuesday/Friday

#### How Worksheet Uses Zones

When the Routing Worksheet generates:

1. System reads each order's ship-to address
2. Matches address to defined service zone
3. Only shows orders valid for that day's delivery zone
4. Prevents scheduling orders to zones that don't deliver

**Result:** You won't see Tuesday orders if running the worksheet for Wednesday (no zone covers that area on Wednesday).

#### Scheduling to Zones

**If Customer Needs Delivery by Friday But You're Running Worksheet Wednesday:**

1. Check **Service Zones** to see which days that location delivers
2. If Friday available — hold the order until Friday worksheet
3. If only Monday/Thursday available — escalate to sales for expedited option

### Common Questions

#### Why Is an Order Missing from the Worksheet?

The order's `Shipment Method` must have "Include in OptimoRoute" enabled. Check with your manager if a shipment method needs to be added.

#### Why Are Two Orders Separate When They Should Be Combined?

The addresses on the two orders are slightly different. Check the `Ship-to Address` fields on both sales orders — even small differences (like "St" vs "Street") will keep them separate.

#### What Do the Cart Quantities Mean?

`Total Cart Qty.` is the sum of all cart quantities from the sales lines on the included orders, rounded up to the nearest whole number.

#### Can I Edit the Worksheet?

The worksheet is generated fresh each time you open it. Any route assignments (driver, load, stop) are written back to the sales orders when you import from OptimoRoute.

## For Managers

### Launching the Worksheet

1. Open the **Transportation Role Center** (Page 50060)
2. Click **Routing Worksheet** in the action bar
3. The system generates the worksheet for a 4-day window starting from the work date
4. The **Shipping Worksheet** page opens with all qualifying orders

## Export to OptimoRoute

**Purpose:** Generate an Excel file formatted for OptimoRoute upload

**Process:**

1. On the **Shipping Worksheet** page, select **Export to Excel for OptimoRoute**
2. A date picker dialog appears — select the shipment date to export
3. The system generates an Excel file with columns:
   - `Customer No.`, `Order No.`, Ship-to Name/Address/City/State/ZIP
   - `Shipment Method`, `Salesperson Code`
   - Cart quantities per facility (EV, GL, LV, NB) multiplied by 100
   - Total carts, `Priority`, `Time Window`
   - Notification email/phone, Notification type
   - `Notes` (order numbers)
4. Download the file and upload to OptimoRoute

**Note:** Cart quantities are multiplied by 100 in the export to match OptimoRoute's expected format.

## Import from OptimoRoute

**Purpose:** Read back optimized route assignments from OptimoRoute

**Process:**

1. Download the optimized Excel from OptimoRoute
2. On the **Shipping Worksheet** page, select **Import from OptimoRoute**
3. Select the Excel file
4. The system reads each row and updates the corresponding sales orders with:
   - **Driver Name** — Assigned driver
   - **Delivery Run No.** — Route sequence
   - **Stop No.** — Stop position within route
   - **Load No.** — Generated load identifier (date + driver serial + run)

**Load Number Format:** `YYMMDD` + Driver Serial + Run Number

**Note:** If the `Notes` field contains multiple order numbers (comma-separated), each order is updated with the same route assignment.

**Run Number Logic:** The import tracks driver changes and depot stops:
- Run number resets to 1 when a new driver is encountered
- Run number increments when a "Depot" location is encountered (indicates new trip)

## Export for Driver

**Purpose:** Generate simplified delivery sheets for drivers

**Process:**

1. On the **Shipping Worksheet** page, select **Export to Excel for Driver**
2. Select the shipment date
3. The system generates an Excel with columns:
   - `Shipment Date`, `Ship-to Name`, `City`, `State`, `ZIP`
   - `Total Carts` (rounded up), `Load No.`, `Delivery Run No.`, `Picking Run No.`
   - `Driver Name`, `Shipment Method`, `Notes`

## Return Orders

Return order processing is controlled by the `AddReturnsToRoutingWorksheet` flag in **Clesen Setup**.

When enabled:

- Return orders with status "Approved Inv. Posting awaiting" and "Returned" inventory status are included
- Only returns where `Returned by Customer` = No (company-initiated returns requiring pickup)
- Uses the return-from address fields instead of ship-to fields
- If the return shipment date is in the past, it is automatically updated to the work date
- Same grouping logic applies (customer + address match)

## Configuration Requirements

### Shipment Methods

Mark methods with `Include in OptimoRoute` = TRUE to include orders in worksheet

### Clesen Setup

Configure `AddReturnsToRoutingWorksheet` if return pickups are needed

### Contact Job Responsibilities

Set up `DEL_EMAIL` and `DEL_TEXT` job responsibilities for delivery notifications:
- Contacts with `DEL_EMAIL` job responsibility: Email addresses collected
- Contacts with `DEL_TEXT` job responsibility: Mobile phone numbers collected
- Notification type set based on available contact methods (E-Mail, Text, Both, or None)

### Priority and Time Windows

These values come from the **Shipment Method** record:
- **Priority** — CLE Priority field on Shipment Method
- **Time Window** — CLE Shipping Time Window field on Shipment Method

## System Components

### Key Codeunit

| Codeunit | Name | Purpose |
|----------|------|---------|
| 50027 | CLE Shipping Management | Main orchestration — worksheet generation, Excel export/import |

### Key Procedures

- `RunShippingWorksheet(StartDate, EndDate)` — Generates worksheet and opens page
- `CreateTemporaryShippingWorksheet(ShippingWorksheet, StartDate, EndDate)` — Core grouping logic
- `ExportToExcelForOptimoRoute(ShippingWorksheet, SuggestedDate)` — OptimoRoute Excel export
- `ImportFromExcelFromOptimoRoute()` — OptimoRoute Excel import
- `ExportToExcelForDriver(ShippingWorksheet, SuggestedDate)` — Driver sheet export

### Tables and Pages

| Object | ID | Name |
|--------|-----|------|
| Table | 50005 | CLE Shipping Worksheet (Temporary) |
| Page | 50106 | CLE Shipping Wrksht |
| Page | 50019 | CLE Routing Worksheet Date Picker |

## Best Practices

✅ **DO:**
- Review worksheet for expected groupings before export
- Verify cart quantities are reasonable
- Coordinate export timing with OptimoRoute schedules
- Import routes promptly after optimization
- Generate driver sheets before daily dispatch
- Monitor for orders missing from worksheet (check shipment method)
- Review grouped orders to ensure consolidation makes sense

❌ **DON'T:**
- Export without verifying shipment method flags
- Forget to import optimized routes (manual assignment wastes OptimoRoute benefit)
- Let old worksheet data sit (refresh daily)
- Ignore missing orders (investigate filtering/configuration)
- Assume addresses are identical (verify consolidation manually if critical)
- Skip driver sheet generation (drivers need clear instructions)

## Troubleshooting

### Issue: Order Missing from Worksheet

**Cause:** Order's `Shipment Method` doesn't have "Include in OptimoRoute" enabled

**Solution:** Check with your manager; the shipment method may need to be configured

### Issue: Two Orders Grouped When They Should Be Separate

**Cause:** Addresses match exactly (address, city, state, ZIP all the same)

**Solution:** Check sales orders — if addresses should differ, correct the data

### Issue: Why Are Two Orders Separate When They Should Be Combined?

**Cause:** Addresses differ slightly (e.g., "St" vs "Street", or different ZIP codes)

**Solution:** Standardize addresses on sales orders or accept separate worksheet lines

### Issue: OptimoRoute Import Not Updating Orders

**Cause:** File format incorrect OR order numbers don't match exactly

**Solution:**
1. Verify Excel file format matches OptimoRoute export template
2. Check that order numbers in `Notes` field match actual order numbers
3. Try importing a smaller subset first

## Related Pages

- [[bin-management]] — Moving inventory between bins
- [[service-zone-configuration]] — Geographic delivery zones
- [[warehouse-overview]] — Warehouse operations overview
