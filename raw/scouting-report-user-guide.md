# Scouting reports

> **Version:** 1.0
> **Last Updated:** 2026-03-17
> **Author:** Taylor Docs (BC Code Intelligence)
> **Audience:** Growers, Field Scouts, Greenhouse Managers

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How scouting reports differ from crop inspection](#how-scouting-reports-differ-from-crop-inspection)
- [Opening scouting reports](#opening-scouting-reports)
- [Understanding the scouting report view](#understanding-the-scouting-report-view)
- [Reading scouting report data](#reading-scouting-report-data)
- [Using expected location indicators](#using-expected-location-indicators)
- [Advancing blooming stages from scouting reports](#advancing-blooming-stages-from-scouting-reports)
- [Prioritizing bins for picking](#prioritizing-bins-for-picking)
- [Printing scouting reports](#printing-scouting-reports)
- [Common scouting scenarios](#common-scouting-scenarios)
- [Best practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

**Scouting Reports** are an inventory visibility tool that helps growers, field scouts, and warehouse managers see exactly where inventory is located across all locations, bins, production orders, and purchase orders for a specific shipment date.

The system:

1. Shows which items are needed for upcoming shipments
2. Displays current inventory by location, zone, and bin
3. Shows potential inventory from production orders and purchase orders
4. Highlights expected locations based on item setup
5. Allows immediate blooming stage advancement from the report
6. Provides a tree-view structure for easy navigation from item down to bin level

**This is not a field observation tool.** Scouting Reports show where inventory is physically located and whether you have enough to fulfill orders. For recording crop quality observations, grades, or issues in the field, use **Crop Inspection Entries** instead.

---

## When to use it

Use Scouting Reports when:

- Planning daily picking activities
- Verifying inventory availability before shipment dates
- Locating specific items across multiple bins and locations
- Checking if production or purchase orders will provide needed inventory
- Deciding when to advance blooming stages based on demand
- Prioritizing bins for picking operations
- Training new staff on warehouse layout and item locations

> **Note:** Scouting Reports are typically run by picking coordinators, growers, or warehouse supervisors as part of daily shipment preparation.

---

## What you need before you start

- Access to the **Scouting Report Lines** page
- A shipment date to scout (usually tomorrow or a near-future date)
- Basic understanding of your warehouse locations, zones, and bins
- Optional: Familiarity with the [blooming stage system](blooming-stage-user-guide.md) if you plan to advance stages

> **Note:** The system automatically calculates which items are needed based on open sales orders for the selected shipment date. You don't need to manually select items.

---

## How scouting reports differ from crop inspection

| Feature                    | Scouting Reports                          | Crop Inspection                           |
|----------------------------|-------------------------------------------|-------------------------------------------|
| **Purpose**                | Inventory visibility and picking planning | Quality observation and grading           |
| **Data Source**            | Bin content, production, purchase orders  | Manual field observations                 |
| **Input Method**           | Automatically generated                   | User-entered inspection records           |
| **Primary Users**          | Warehouse staff, picking coordinators     | Growers, field scouts, QC staff           |
| **Key Actions**            | View locations, advance stages, prioritize| Record grades, photos, comments, recount  |
| **Link to Production**     | Shows production order status             | Updates production order based on findings|
| **Timing**                 | Run daily for upcoming shipments          | Recorded during field inspections         |

**When to use Crop Inspection instead:**
- Recording quality grades (A, B, C)
- Documenting pest or disease issues
- Capturing photos of crop condition
- Requesting recounts or label changes
- Logging field observations and corrective actions

---

## Opening scouting reports

### From the search bar

1. Press `Alt+Q` or click the search icon
2. Type **Scouting Report Lines**
3. Press `Enter` or click the page name

### From the picking dialog

1. Search for **Item Scouting** (codeunit runs automatically)
2. Select the shipment date when prompted
3. The system generates the report and opens the page

> **Tip:** If you run scouting reports regularly for the same shipment dates, create a bookmark in your Role Center for quick access.

---

## Understanding the scouting report view

The Scouting Report uses a **tree structure** with collapsible levels:

```
📦 Item No. - Description
  📍 Location Code
    📦 Bin Code (Bin Content) - shows actual inventory
    🏭 Production Order No. - shows potential inventory
    🛒 Purchase Order No. - shows potential inventory
  💼 Demand (Sales Orders grouped)
    📄 Sales Order Line details
```

### Tree structure levels

| Level                   | Line Type         | Indentation | What It Shows                          |
|-------------------------|-------------------|-------------|----------------------------------------|
| Item                    | Item              | 0           | Total required quantity across all orders|
| Location                | Location          | 1           | Inventory and orders at this location  |
| Bin Content             | Bin Content       | 2           | Current inventory in a specific bin    |
| Production Order        | Production Order  | 2           | Potential inventory from production    |
| Purchase Order          | Purchase Order    | 2           | Potential inventory from purchases     |
| Demand                  | Demand            | 1           | Summary of sales orders for this item  |
| Sales Line              | Sales Line        | 2           | Individual sales order line details    |

### Collapsing and expanding

- Click the **arrow** next to an item or location to expand/collapse
- The report opens with **all items collapsed** by default (TreeInitialState = CollapseAll)
- Expand items to drill down into locations, bins, and orders

---

## Reading scouting report data

### Key columns

| Column                          | Description                                           | When Visible                |
|---------------------------------|-------------------------------------------------------|-----------------------------|
| `Line Type`                     | Item, Location, Bin Content, Production Order, etc.   | Always                      |
| `Item_Location_Order`           | Item number, location code, or order number           | Always                      |
| `Descr_Bin_Name`                | Description, bin code, or customer name               | Always                      |
| `Variant Code`                  | Item variant (e.g., blooming stage variant)           | Always                      |
| `Expected in Location(s)`       | Locations where this item is expected                 | Always (Item lines)         |
| `Expected in Zone(s)`           | Zones where this item is expected                     | Always (Item lines)         |
| `Expected in Bin(s)`            | Bins where this item is expected                      | Always (Item lines)         |
| `Required Qty.`                 | Total quantity needed (in sales UOM)                  | Item and Sales Line levels  |
| `Inventory (Sales)`             | Current inventory (in sales UOM)                      | Bin Content level           |
| `Potential Inventory (Sales)`   | Inventory coming from production or purchase orders   | Production/Purchase levels  |
| `Qty. in Pick`                  | Quantity already allocated to pick documents          | All levels                  |
| `Unit of Measure Code`          | UOM for quantities displayed                          | Always                      |

> **Note:** Sales UOM quantities are automatically converted from base UOM using the item's `Qty. per Sales UOM` field. This makes quantities easier to read for operational staff.

### Understanding quantity calculations

**Required Qty.** (Item Level)
- Sum of `CLE Qty. not Shipped (Base)` from all sales order lines for this item and shipment date
- Displayed in sales UOM (e.g., trays, flats) not base UOM (individual plants)

**Inventory (Sales)** (Bin Content Level)
- Current quantity in this specific bin
- Calculated from `Bin Content."Quantity (Base)"` converted to sales UOM

**Potential Inventory (Sales)** (Production Order Level)
- `Remaining Qty. (Base)` from production order line
- Only shows production orders with `Due Date` <= shipment date
- Only includes Released production orders

**Potential Inventory (Sales)** (Purchase Order Level)
- `Quantity (Base)` - `Qty. Received (Base)` from purchase line
- Only shows purchase orders with `Expected Receipt Date` < shipment date

**Qty. in Pick**
- Quantity already on warehouse pick documents for this item/location/bin
- Subtracts from available inventory when planning additional picks

---

## Using expected location indicators

The **Expected in Location(s)**, **Expected in Zone(s)**, and **Expected in Bin(s)** columns show where the system expects to find inventory for each item.

### How expected locations work

1. **Item Level:** The `Default Item Location Code` from the Item card
2. **Zone Level:** Derived from bins where this item has been stored historically
3. **Bin Level:** Calculated from `Bin Content` records and picking patterns

### Expected location format

```
Expected in Location(s): GH-01, GH-03
Expected in Zone(s): SHIPPING, PRODUCTION
Expected in Bin(s): A-01-001, A-01-002, B-02-005
```

> **Tip:** If inventory is **not** in an expected location, it may indicate misplaced stock or a need to update the item's default location.

### Printed report filtering

When you print the scouting report (see [Printing scouting reports](#printing-scouting-reports)), you can filter by:

- **Location Code** (required) - only show one location
- **Zone Code** (optional) - further filter to one zone

The printed report automatically **hides items** that don't have inventory in the selected location/zone, making it easier to create location-specific pick lists.

---

## Advancing blooming stages from scouting reports

If your items use the [blooming stage system](blooming-stage-user-guide.md), you can **immediately advance inventory or production orders** to the next blooming stage directly from the scouting report.

### When to advance stages manually

- Demand requires the next stage earlier than scheduled
- Growers confirm plants are ready ahead of schedule
- Urgent order fulfillment requires immediate stage progression

> **Important:** Manual stage advancement from scouting reports is **immediate** and bypasses the normal scheduled progression. Use this feature only when you've verified the plants are physically ready for the next stage.

### Advancing bin content to next stage

**Applies to:** Bin Content lines (inventory)

1. Open the scouting report for your shipment date
2. Expand the item and location to see bin content lines
3. Select the bin content line you want to advance
4. Click **Post Next Stage** in the toolbar

**What happens:**

- The system posts a reclassification journal entry:
  - **Negative adjustment** on the current variant (e.g., Green Bud)
  - **Positive adjustment** on the next variant (e.g., Bud & Bloom)
- The quantity is transferred between variants in the same bin
- Item Ledger Entries are stamped with `CLE Next Stage Change Date` for future progression
- The page refreshes to show the updated inventory

**Result:** The inventory in that bin immediately advances to the next blooming stage.

### Advancing production order stages

**Applies to:** Production Order lines

1. Open the scouting report for your shipment date
2. Expand the item and location to see production order lines
3. Select the production order line you want to advance
4. Click **Post Next Stage** in the toolbar

**What happens:**

- The production order line's `CLE Blooming Stage` field is updated to the next stage
- The `CLE Next Stage Change Date` is recalculated based on the new stage's duration
- No journal posting occurs (production output will be posted at the new stage when finished)
- The page refreshes to show the updated stage

**Result:** When this production order is output-posted, it will create inventory at the newly advanced blooming stage.

### Stage advancement validation

The system validates the following before allowing stage advancement:

| Validation                              | Error If...                                           |
|-----------------------------------------|-------------------------------------------------------|
| **Variant has blooming stage**          | `CLE Blooming Stage` is blank on the current variant  |
| **Next stage variant exists**           | No variant exists for the next blooming stage         |
| **Auto Transition to Overgrown enabled**| Advancing to Overgrown when feature is disabled       |
| **Line type is correct**                | Selected line is not Bin Content or Production Order  |

> **Note:** You cannot advance **Location**, **Item**, **Purchase Order**, **Demand**, or **Sales Line** rows. Only Bin Content and Production Order lines support stage advancement.

### Cross-reference: Grower Stage Worksheet

For **scheduled** stage transitions (not immediate), use the **Grower Stage Worksheet** instead:

- See [blooming-stage-user-guide.md](blooming-stage-user-guide.md#how-to-use-the-grower-stage-worksheet)
- The worksheet shows all upcoming transitions with delay options
- Use the worksheet for normal, scheduled stage progression
- Use scouting reports for **immediate** stage advancement in response to demand

---

## Prioritizing bins for picking

If your setup has **picking prioritization** enabled (`Activate Pick Priority` in Clesen Setup), you can manage which bins are picked first for each item.

### Viewing bin priorities

**Picking Priority** is shown on Bin Content lines (indented under Location):

- **Blank or 0:** No priority set (picked in default warehouse order)
- **1-98:** Priority order (lower numbers picked first)
- **99:** Exclude from automatic picking

### Modifying bin priorities

1. Open the scouting report
2. Expand an item to the Bin Content level
3. Select a bin content line
4. Click **Prioritize Bins** in the toolbar

**What happens:**

- The system opens the **Bin Content** page filtered to this item
- Only bins marked as **non-supermarket** are shown (`CLE Supermarket Bin` = false)
- Edit the `CLE Picking Priority` field for each bin
- Close the page to return to the scouting report

### Priority rules

| Priority Value | Picking Behavior                            |
|----------------|---------------------------------------------|
| **0 (blank)**  | Default picking order (FEFO, bin ranking)   |
| **1-98**       | Higher priority, picked first (ascending)   |
| **99**         | Excluded from automated warehouse picks     |

**Example scenario:**

```
Bin A-01-001: Priority 1  (picked first)
Bin A-01-002: Priority 2  (picked second)
Bin A-01-003: Priority 0  (picked after prioritized bins)
Bin HOLD-001: Priority 99 (never picked automatically)
```

> **Tip:** Use priority 99 for bins that contain inventory on hold, quality-control items, or reserved stock that should not be picked by warehouse staff.

---

## Printing scouting reports

Generate a location-specific printed scouting report for field use:

### Steps to print

1. Open **Scouting Report Lines**
2. Click **Print** in the toolbar (under Reporting section)
3. In the request page:
   - **Location Code:** Select the location to scout (required)
   - **Zone Code:** Optionally filter to one zone (leave blank for all zones)
4. Click **Preview** to see the report or **Print** to send to printer

### What's included in the printed report

The printed report shows:

- **Filtered to selected location and zone only**
- Items grouped with sales order demand details
- Expected bins for each item
- Current inventory and potential inventory
- Shipment date and order date
- Customer type and salesperson code
- Line-by-line item requirements

**Use cases for printed reports:**

- Hand to pickers as a picking guide
- Growers walking the greenhouse to verify readiness
- Physical inventory checks before shipment day
- Field communication when tablets are unavailable

> **Note:** The printed report automatically excludes items with no inventory or demand in the selected location/zone. This keeps the report concise and relevant to that specific location.

---

## Common scouting scenarios

### Scenario 1: Checking tomorrow's picking requirements

**Goal:** See what inventory is needed for tomorrow's shipments.

1. Open **Item Scouting** (or directly open **Scouting Report Lines**)
2. Select tomorrow's date as the shipment date
3. Review each item line for `Required Qty.`
4. Expand locations to see where inventory is located
5. Note any items with insufficient inventory (highlighted red if line format is applied)

**Next steps:** If inventory is insufficient, check production order potential inventory or create a purchase order.

---

### Scenario 2: Advancing blooming stages to meet demand

**Goal:** Immediately advance Green Bud inventory to Bud & Bloom because a large order needs it.

1. Open scouting reports for the shipment date
2. Locate the item (e.g., Petunia Purple)
3. Expand to see bin content in Green Bud stage
4. Verify with grower that the plants are ready for Bud & Bloom
5. Select the bin content line
6. Click **Post Next Stage**
7. Confirm the reclassification posted successfully

**Result:** The inventory in that bin is now at Bud & Bloom stage and available for the order.

---

### Scenario 3: Locating misplaced inventory

**Goal:** Find where a specific item is actually located (not where it's expected).

1. Open scouting reports
2. Locate the item in the tree
3. Check **Expected in Location(s)** and **Expected in Bin(s)**
4. Expand the Location level to see all actual bin contents
5. Compare actual bin codes to expected bins

**If misplaced:**
- Use a reclassification journal to move inventory to the correct bin
- Update the item's `Default Item Location Code` if the expectation is wrong
- Train staff on proper put-away procedures

---

### Scenario 4: Prioritizing bins for faster picking

**Goal:** Ensure pickers always take from the A-zone bins before B-zone bins.

1. Open scouting reports
2. Expand the item to Bin Content level
3. Click **Prioritize Bins** (available if picking prioritization is active)
4. Set A-zone bins to priority 1-10
5. Set B-zone bins to priority 11-20
6. Set hold bins to priority 99
7. Close and return to scouting report

**Result:** Warehouse picks will now allocate from A-zone bins first, improving pick efficiency.

---

### Scenario 5: Reviewing production readiness for demand

**Goal:** Confirm that production orders will provide enough inventory by the shipment date.

1. Open scouting reports for the shipment date
2. Locate the item
3. Expand to Location level
4. Check the `Potential Inventory (Sales)` from Production Order lines
5. Verify that production order `Due Date` is on or before the shipment date

**If production won't be ready:**
- Delay the sales order line's shipment date
- Expedite production by adjusting the due date
- Source inventory from another location or purchase order
- Contact the customer to negotiate a new delivery date

---

## Best practices

### Daily scouting routines

- Run scouting reports every morning for the next 2-3 shipment dates
- Review demand vs. inventory availability
- Identify shortfalls early so purchasing or production can respond
- Print location-specific reports for field scouts and pickers

### Using scouting reports with blooming stages

- Check production order stage progression dates regularly
- Manually advance stages only after physical verification by growers
- Use the **Grower Stage Worksheet** for scheduled transitions, not scouting reports
- Document reasons for manual stage advancement in notes or comments

### Inventory accuracy

- Investigate items found in unexpected locations
- Correct bin content errors using reclassification journals
- Update item default locations when usage patterns change
- Train warehouse staff on proper put-away and bin discipline

### Collaboration between roles

- **Picking coordinators:** Use scouting reports to generate pick lists
- **Growers:** Use scouting reports to verify production readiness and stage plants
- **Warehouse supervisors:** Use scouting reports to plan labor and prioritize bins
- **Customer service:** Use scouting reports to confirm order fulfillment capability

### Mobile/field use

- Print simplified reports for staff without tablet access
- Use the web client on tablets for real-time scouting report access
- Bookmark the **Scouting Report Lines** page in your Role Center for quick access

---

## Troubleshooting

### The report shows no data

**Possible causes:**

- No sales orders exist for the selected shipment date
- Sales lines have `CW Item Type` other than Inventory
- All required items have already been fully shipped

**Solution:**

1. Verify that sales orders exist with the selected shipment date
2. Check that sales lines have positive `CLE Qty. not Shipped (Base)`
3. Confirm that items have `Type` = Item and `CW Item Type` = Inventory

---

### An item shows Required Qty. but no inventory

**Possible causes:**

- Inventory is in a different location than expected
- Inventory is in supermarket bins (excluded from scouting reports)
- Item has not yet been received or produced

**Solution:**

1. Expand the item to Location level and check all locations
2. Check if production orders or purchase orders show potential inventory
3. Search for the item in **Bin Contents** to see all actual locations
4. If inventory is missing, create a purchase order or production order

---

### Post Next Stage button is disabled

**Possible causes:**

- Selected line is not a Bin Content or Production Order line
- Item does not have blooming stage variants configured
- No variant exists for the next blooming stage

**Solution:**

1. Ensure you selected a Bin Content or Production Order line (indented level 2 under Location)
2. Verify that the item has variants with `CLE Blooming Stage` values set
3. Confirm that a variant exists for the next stage (e.g., if current is Green Bud, Bud & Bloom must exist)

---

### Prioritize Bins button is not visible

**Possible causes:**

- Picking prioritization is not enabled in Clesen Setup
- The `Activate Pick Priority` toggle is off

**Solution:**

1. Open **Clesen Setup** (search for it)
2. Check that `Activate Pick Priority` is enabled
3. Close and reopen the scouting report page

---

### Expected locations are blank

**Possible causes:**

- Item's `Default Item Location Code` is not set
- Item has not been stored in any bins historically

**Solution:**

1. Open the item card and set `Default Item Location Code`
2. Run the scouting report again (expected locations are calculated on-the-fly)

---

### Printed report shows items I didn't expect

**Possible causes:**

- Location or zone filter was not applied on the request page
- Items have demand in the selected location even if inventory is elsewhere

**Solution:**

1. When printing, always specify **Location Code** on the request page
2. Use **Zone Code** to further filter if needed
3. The report only shows items relevant to the selected filters

---

## FAQ

### What's the difference between scouting reports and crop inspection?

**Scouting Reports** = Inventory visibility tool (where is inventory located?).

**Crop Inspection** = Quality observation tool (what's the grade and condition?).

Use scouting reports for picking and logistics. Use crop inspection for field observations and grading.

---

### Can I edit quantities in the scouting report?

No. Scouting reports are **read-only** for viewing inventory and demand. To adjust quantities:

- Inventory: Use reclassification journals or adjustment journals
- Production: Modify production order lines directly
- Sales demand: Modify sales order line quantities

---

### Why is some inventory not shown?

Scouting reports only include:

- Non-supermarket bins (`CLE Supermarket Bin` = false)
- Released production orders (not Planned or Firm Planned)
- Purchase orders with Expected Receipt Date before the shipment date

Supermarket bins are excluded because they represent customer-owned inventory, not available stock.

---

### Can I run scouting reports for past dates?

Yes, but it's uncommon. Scouting reports are designed for **future shipment dates** to help with picking planning. Running reports for past dates shows historical demand and inventory snapshots, but those shipments have likely already been processed.

---

### How often should I run scouting reports?

**Best practice:** Daily, for the next 2-3 shipment dates. This gives you visibility into near-future demand and time to address shortfalls.

---

### Can I export scouting report data to Excel?

Yes. From the **Scouting Report Lines** page:

1. Click **Open in Excel** (in the Share section of the toolbar)
2. Edit and analyze the data in Excel
3. Changes made in Excel cannot be imported back (read-only export)

---

### What happens if I advance a stage but the plants aren't ready?

**Impact:**

- The inventory is reclassified to the next variant
- Orders may allocate this inventory immediately
- If the physical plants aren't actually at that stage, customers receive lower-quality product

**Prevention:**

- Always physically verify plants with a grower before clicking **Post Next Stage**
- Use the **Grower Stage Worksheet** for scheduled transitions where verification is part of the workflow
- Implement a two-person approval process for manual stage advancements

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/scouting-report-user-guide.pdf)

---

## Related resources

- [Blooming Stage User Guide](blooming-stage-user-guide.md) - Understanding automatic stage progression
- [Picking Operations Guide](../picking/staff/picking-user-guide.md) - Using scouting reports to create picks
- [Crop Inspection Guide](crop-inspection-user-guide.md) - Recording field observations and quality grades *(if exists)*
- [Production Order Management](../production/prod-order-management-user-guide.md) - Managing production for inventory availability
- [Inventory Management](../inventory/staff/inventory-basics-user-guide.md) - Understanding bins, zones, and locations *(if exists)*
