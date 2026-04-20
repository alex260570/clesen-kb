# Shipping Worksheet (Routing Worksheet) - Manager's guide

> **Version:** 1.0
> **Last Updated:** 2026-02-24
> **Audience:** Managers

## Table of contents

- [Process overview](#process-overview)
- [How it works](#how-it-works)
- [Launching the worksheet](#launching-the-worksheet)
- [Export to OptimoRoute](#export-to-optimoroute)
- [Import from OptimoRoute](#import-from-optimoroute)
- [Export for driver](#export-for-driver)
- [Return orders](#return-orders)
- [Configuration](#configuration)
- [Key codeunits](#key-codeunits)
- [Tables and pages](#tables-and-pages)
- [Troubleshooting](#troubleshooting)
- [Best practices](#best-practices)

---

## Process overview

The Shipping Worksheet consolidates sales orders into delivery routes for OptimoRoute optimization. It groups orders shipping to the same customer and address into single worksheet lines, calculates total cart quantities, and manages the export/import cycle with OptimoRoute for route planning.

## How it works

### End-to-end workflow

```text
Sales Orders Created
        |
        v
Run Shipping Worksheet (Role Center > Routing Worksheet)
        |
        v
Worksheet Generated (orders grouped by customer + address)
        |
        v
Export to Excel for OptimoRoute
        |
        v
Upload to OptimoRoute (external tool)
        |
        v
OptimoRoute Optimizes Routes
        |
        v
Download Optimized Excel from OptimoRoute
        |
        v
Import from OptimoRoute (writes back driver, load, stop, run)
        |
        v
Export Driver Sheets (per-driver delivery lists)
```

### Order grouping logic

When the worksheet is generated, orders are combined into a single line when **all** of the following match:

- `Shipment Date` - Same delivery date
- `Customer No.` - Same sell-to customer
- `Shipment Method Code` - Same delivery method
- `Document Type` - Same document type (Order or Return)
- Full ship-to address - `Address`, `Address 2`, `City`, `Post Code`, and `County` must all match

> **Important:** Orders with the same customer and `Ship-to Code` but different actual addresses appear as **separate** worksheet lines. This handles cases where addresses are manually overridden on the sales order or modified by webshop integrations.

When orders are combined:

- Cart quantities are summed
- Order numbers are concatenated in the `Notes` field (comma-separated)
- Address and contact information come from the first order processed

### Shipment method filter

Only orders with a Shipment Method that has `Include in OptimoRoute` enabled appear on the worksheet. Configure this flag on the **Shipment Method** card.

## Launching the worksheet

1. Open the **Transportation Role Center** (Page 50060).
2. Click **Routing Worksheet** in the action bar.
3. The system generates the worksheet for a 4-day window starting from the work date.
4. The **Shipping Worksheet** page opens with all qualifying orders.

## Export to OptimoRoute

**Purpose:** Generate an Excel file formatted for OptimoRoute upload.

**Process:**

1. On the **Shipping Worksheet** page, select **Export to Excel for OptimoRoute**.
2. A date picker dialog appears - select the shipment date to export.
3. The system generates an Excel file with columns:
   - `Customer No.`, `Order No.`, Ship-to Name/Address/City/State/ZIP
   - `Shipment Method`, `Salesperson Code`
   - Cart quantities per facility (EV, GL, LV, NB) multiplied by 100
   - Total carts, `Priority`, `Time Window`
   - Notification email/phone, Notification type
   - `Notes` (order numbers)
4. Download the file and upload to OptimoRoute.

> **Note:** Cart quantities are multiplied by 100 in the export to match OptimoRoute's expected format.

## Import from OptimoRoute

**Purpose:** Read back optimized route assignments from OptimoRoute.

**Process:**

1. Download the optimized Excel from OptimoRoute.
2. On the **Shipping Worksheet** page, select **Import from OptimoRoute**.
3. Select the Excel file.
4. The system reads each row and updates the corresponding sales orders with:
   - `Driver Name` - Assigned driver
   - `Delivery Run No.` - Route sequence
   - `Stop No.` - Stop position within route
   - `Load No.` - Generated load identifier (date + driver serial + run)

**Load number format:** `YYMMDD` + Driver Serial + Run Number

> **Note:** If the `Notes` field contains multiple order numbers (comma-separated), each order is updated with the same route assignment.

**Run number logic:** The import tracks driver changes and depot stops:

- Run number resets to 1 when a new driver is encountered
- Run number increments when a "Depot" location is encountered (indicates new trip)

## Export for driver

**Purpose:** Generate simplified delivery sheets for drivers.

**Process:**

1. On the **Shipping Worksheet** page, select **Export to Excel for Driver**.
2. Select the shipment date.
3. The system generates an Excel with columns:
   - `Shipment Date`, `Ship-to Name`, `City`, `State`, `ZIP`
   - `Total Carts` (rounded up), `Load No.`, `Delivery Run No.`, `Picking Run No.`
   - `Driver Name`, `Shipment Method`, `Notes`

## Return orders

Return order processing is controlled by the `AddReturnsToRoutingWorksheet` flag in **Clesen Setup**.

When enabled:

- Return orders with status "Approved Inv. Posting awaiting" and "Returned" inventory status are included
- Only returns where `Returned by Customer` = No (company-initiated returns requiring pickup)
- Uses the return-from address fields instead of ship-to fields
- If the return shipment date is in the past, it is automatically updated to the work date
- Same grouping logic applies (customer + address match)

## Configuration

### Prerequisites

- **Shipment Methods:** Mark methods with `Include in OptimoRoute` = TRUE
- **Clesen Setup:** Configure `AddReturnsToRoutingWorksheet` if return pickups are needed
- **Contact Job Responsibilities:** Set up `DEL_EMAIL` and `DEL_TEXT` job responsibilities for delivery notifications

### Notification system

The worksheet automatically populates notification preferences:

- Contacts with `DEL_EMAIL` job responsibility: Email addresses collected
- Contacts with `DEL_TEXT` job responsibility: Mobile phone numbers collected
- Notification type set based on available contact methods (E-Mail, Text, Both, or None)

### Priority and time windows

These values come from the **Shipment Method** record:

- `Priority` - CLE Priority field on Shipment Method
- `Time Window` - CLE Shipping Time Window field on Shipment Method

## Key codeunits

| Codeunit | Name                    | Purpose                                                        |
|----------|-------------------------|----------------------------------------------------------------|
| 50027    | CLE Shipping Management | Main orchestration - worksheet generation, Excel export/import |

### Key procedures

- `RunShippingWorksheet(StartDate, EndDate)` - Generates worksheet and opens page
- `CreateTemporaryShippingWorksheet(ShippingWorksheet, StartDate, EndDate)` - Core grouping logic
- `ExportToExcelForOptimoRoute(ShippingWorksheet, SuggestedDate)` - OptimoRoute Excel export
- `ImportFromExcelFromOptimoRoute()` - OptimoRoute Excel import
- `ExportToExcelForDriver(ShippingWorksheet, SuggestedDate)` - Driver sheet export

## Tables and pages

| Object             | ID    | Name                                |
|--------------------|-------|-------------------------------------|
| Table              | 50005 | CLE Shipping Worksheet (Temporary)  |
| Page               | 50106 | CLE Shipping Wrksht                 |
| Page               | 50019 | CLE Routing Worksheet Date Pic      |
| Page (Role Center) | 50060 | CLE Transportation Rolecenter       |

## Troubleshooting

### Orders not appearing on worksheet

**Check:**

- Does the order have a `Shipment Date` within the worksheet date range?
- Does the Shipment Method have `Include in OptimoRoute` enabled?
- Is `Document Type` = Order?
- Are there inventory item lines with quantity to ship?

### Orders not combining when they should

**Possible causes:**

- Different `Shipment Method Code` values between orders
- Address fields differ (even slight variations like "Rd" vs "Road")
- Different `Shipment Date` values
- Different `Document Type` values

**Resolution:** Standardize address data on the sales orders before running the worksheet.

### Orders combining when they shouldn't

**Possible causes:**

- All address fields happen to match across different `Ship-to Code` values
- Same customer with multiple orders to the same address but needing separate deliveries

**Resolution:** If orders should be separate despite matching addresses, use different `Shipment Method Code` values to force separation.

### Import not updating orders

**Check:**

- Order numbers in the `Notes` column match existing sales orders
- Excel format matches expected column layout (column 27 = Notes)
- Orders exist as `Document Type` = Order

## Freight Handling & Cost Allocation

Freight costs consume 8-15% of horticulture shipment costs. Manage these carefully to maintain margin accuracy and customer satisfaction.

### Freight cost sources

**1. Carrier charges (primary)**

- Base shipping rate from UPS, FedEx, LTL carrier
- Weight-based (lb) or dimensional based (DIM)
- Calculated from label generation
- Usually $8-$50 per shipment for small, $50-$300 for pallet

**2. Fuel surcharge**

- % adjustment based on gasoline prices
- Typically 5-15% of base rate
- Updated weekly by carriers
- Often passed to customer or absorbed

**3. Handling surcharge**

- Packaging materials, labor to prepare shipment
- Can be flat fee (e.g., $2/shipment) or % (5%)
- Set in **Clesen Setup > Shipping & Handling**

**4. International/specialty handling**

- Customs clearance (if applicable)
- Hazmat handling ($25-$100)
- Signature requirements ($5)
- Rural surcharge ($10-$30)

### Capturing freight costs

**Automatic capture:**

1. When order ships, system reads carrier rate from OptimoRoute import
2. Stores in sales order header: "Freight Amount Incurred"
3. If customer is charged, amount flows to sales invoice
4. If company absorbs, amount flows to expense

**Manual override (if needed):**

1. Open **Sales Order > Shipping tab**
2. "Freight Amount" field
3. Edit if discrepancy detected
4. Save - updates invoice automatically

### Freight allocation methods

**Method 1: Per-order allocation** (Most common)

- Each order charged its own freight
- Accurate but can frustrate customers with small orders
- Example: Order 1 = $15 freight, Order 2 = $18 freight

**Method 2: Customer consolidation**

- Multiple orders to same customer consolidated into one shipment
- Single freight charge split across orders
- Example: 2 orders consolidated, total $25 freight, each pays $12.50
- More customer-friendly; requires planning

**Method 3: Blanket order absorption**

- Large blanket orders include freight in unit price
- No additional freight line
- Example: Item sold as "$5/unit delivered" instead of "$4/unit + $8 freight"

**Config setting:**

1. **Clesen Setup > Shipping & Handling**
2. "Freight Allocation Method": Select above option
3. All new orders follow this method

### Negotiating carrier rates

**Question:** Why is freight so expensive?

**Analysis:**

1. Check **Reports > Shipping Cost Analysis**
2. Filter by date range, customer, carrier
3. Review average $ per shipment and $ per lb
4. Compare to industry benchmarks (4-6 $/lb is standard)

**If rates are high:**

1. Review shipment consolidation - are you sending small boxes when pallets would be cheaper?
2. Check weight reporting - are dimensional weights over-inflating charges?
3. Negotiate volume discount with carrier (>100 shipments/month usually qualifies)
4. Consider regional carrier alternatives (FedEx Connect, UPS Regional)

### Surcharge management

**Fuel surcharge pass-through:**

1. **Setup > Carrier Surcharges**
2. Link surcharge % to product price adjustment
3. When surcharge updates, customer pricing auto-adjusts
4. Example: "Fuel surcharge now 12%" → all quotes automatically +12%

**Fuel hold strategy:**

- Review surcharge weekly
- If trending >15%, renegotiate customer pricing
- If below 8%, hold surcharge steady (no customer notice)
- Update quarterly for budgeting stability

### Internal freight tracking

**Cost vs. Revenue reconciliation:**

1. **Reports > Freight P&L**
   - Period: Monthly
   - Shows total freight incurred vs. revenue
   - Gross margin on freight portion

2. **Review KPIs:**
   - Target: 90% cost recovery (ship at 10% margin)
   - Alert if < 85% (losing money on freight)
   - Alert if margin declining month-over-month

3. **Adjust pricing if needed:**
   - If margin < 85%, increase handling surcharge or pass through more fuel
   - Examples:
     - Increase handling from $2 to $3 per order
     - Increase fuel pass-through from 50% to 75%

## Performance Metrics & KPIs

Track shipping performance to identify bottlenecks and optimize operations.

### Key metrics to monitor

**1. On-time delivery %**

- Target: >95% orders ship on promised date
- Calc: Orders shipped on date / Total orders due that date
- Alert: If <90%, investigate root cause (stock-outs, labor, OptimoRoute delays)

**Tracking:**

1. **Reports > Shipping Dashboard > On-Time %**
2. Review by week, customer, location
3. Drill to specific late orders for root cause

**2. Orders per route**

- Target: 5-8 stops per route (optimal efficiency)
- Too low (<3): Routes inefficient, high freight per order
- Too high (>10): Driver overloaded, quality/safety risk

**Calc:**

```
Orders per route = Total orders shipped / Total delivery runs
```

**Tracking:**

1. **Reports > Route Efficiency**
2. Filter date range
3. Shows: Total routes, total orders, avg orders/route
4. Identifies short/long routes for optimization

**3. Cart fulfillment rate**

- Target: >98% of carts ordered actually shipped
- Shortfalls due to:
  - Inventory stock-outs
  - Damage during picking/packing
  - Customer cancellation

**Calc:**

```
Fulfillment % = Carts shipped / Carts ordered
```

**Tracking:**

1. **Reports > Fulfillment Rate**
2. Filter by item, location, date range
3. Drill to specific shortfalls

**4. Driver utilization %**

- Target: 75-85% (time spent driving/delivering vs. idle)
- High usage: Driver efficient but may face fatigue
- Low usage: Under-scheduled or inefficient routing

**Calc:**

```
Utilization % = (Delivery time / Available work time) × 100
```

**Tracking:**

1. From **OptimoRoute Integration Reports**
2. Filter by driver, period
3. Adjust route assignments if trending <70% or >90%

**5. Shipment cost per cart**

- Target: $3-$8 depending on geography
- Below target: Good efficiency
- Above target: Routes too dispersed, consider consolidation

**Calc:**

```
Cost per cart = Total freight + handling / Total carts shipped
```

**Tracking:**

1. **Reports > Freight Analysis**
2. Group by week, region, customer
3. Identify high-cost patterns

### Creating KPI dashboard

**Setup a daily review rhythm:**

1. **Every morning (8 AM):**
   - Check on-time % for today's shipments
   - Verify OptimoRoute import completed successfully
   - Flag any short-stock items affecting fulfillment

2. **Weekly (Friday end-of-day):**
   - Run Fulfillment Rate report
   - Review orders per route (adjust for next week)
   - Note any efficiency trends (improving/declining)

3. **Monthly:**
   - Full P&L on freight costs
   - Driver utilization review
   - Carrier rate comparison (considering renegotiation)
   - Team meeting to review metrics, celebrate wins, address issues

### Using metrics for decisions

**On-time % dropping below 90%?**
- Root causes: Stock-outs (inventory), labor shortage (ops), delivery date setting (sales)
- Action: Escalate to relevant team, implement corrective action
- Monitor weekly until recovery

**Cost per cart rising?**
- Possible causes: Geographic dispersion (customers spreading out), fuel spikes, route inefficiency
- Action: Review geographic zones, consolidate orders by region, renegotiate carrier rates

**Orders per route too high (>10)?**
- Driver overloaded/fatigued
- Risk of errors, customer complaints, safety issues
- Action: Split routes, hire additional driver, or optimize stop sequence with OptimoRoute

**Fulfillment % below 98%?**
- Investigate trend: Consistent item? Location? Type of shortage?
- Action: Investigate availability (understocking) vs. damage (quality control)

## Best practices

- **Standardize addresses** - Consistent address entry prevents incorrect grouping
- **Verify before export** - Review worksheet lines before uploading to OptimoRoute
- **Check notification contacts** - Ensure `DEL_EMAIL` and `DEL_TEXT` job responsibilities are current
- **Run for correct date range** - The default 4-day window starts from the work date
- **Review combined orders** - Check the `Notes` field to verify which orders are grouped
- **Monitor KPIs daily** - Catch trends early before they become problems
- **Consolidate when possible** - Grouping orders reduces freight costs and improves customer experience
- **Communicate transparently** - Keep customers informed of delivery windows and any delays

---

> **Primary Codeunit:** 50027 "CLE Shipping Management"
> **Primary Table:** 50005 "CLE Shipping Worksheet" (Temporary)
> **Role Center Action:** Routing Worksheet on Page 50060
