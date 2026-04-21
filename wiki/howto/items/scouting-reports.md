---
title: Scouting Reports
type: howto
tags: [items, inventory-visibility, picking, blooming-stages, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [scouting-report-user-guide.md]
---

# Scouting Reports

Inventory visibility tool for planning picking activities and managing blooming stage advancement.

## What Is a Scouting Report?

**Scouting Reports** show exactly where inventory is located across all bins, production orders, and purchase orders for a specific shipment date.

**Key purpose:** Visibility into inventory availability, location, and potential inventory (in-process) to support picking planning and blooming stage decisions.

**Not for quality observations.** For recording crop grades, pest damage, or field conditions, use [[crop-inspection]] instead.

## Opening Scouting Reports

### From the Search Bar

1. Press `Alt+Q` or click the search icon
2. Type **Scouting Report Lines**
3. Press `Enter` to open

### From the Picking Workflow

1. Search for **Item Scouting**
2. When prompted, select the shipment date
3. System generates and opens the report

**Tip:** Bookmark Scouting Report Lines in your Role Center for quick daily access.

## Understanding the Report Structure

Scouting Reports use a **tree structure** with collapsible levels:

```
📦 Item No. — Description (Total required for shipment date)
  📍 Location Code (Where item is stored)
    📦 Bin Code — Actual inventory in this bin
    🏭 Production Order No. — Potential inventory from production
    🛒 Purchase Order No. — Potential inventory from purchases
  💼 Demand (Sales orders for this item)
    📄 Sales Order Line — Specific order details
```

### Tree Levels Explained

| Level | Shows | Indentation | Example |
|-------|-------|---|---|
| Item | Total qty needed for shipment date | 0 (no indent) | Rose-Red-12 — Required 500 |
| Location | Inventory at this warehouse location | 1 (indented) | GH-01 |
| Bin Content | Current inventory in a bin | 2 (double indent) | Bin GB-1: 200 units |
| Production Order | Potential inventory coming from production | 2 | Prod Order 1001: 300 units |
| Purchase Order | Potential inventory coming from purchases | 2 | PO ABC-500: 150 units |
| Demand | All sales orders needing this item | 1 | Demand: 650 units |
| Sales Line | Individual order details | 2 | SO-1234: 150 units, Ship 2026-04-22 |

**How to navigate:** Click the arrow next to Item or Location names to expand/collapse. Report opens with all items **collapsed** by default.

## Reading the Report Data

### Key Columns

| Column | What It Shows | Visible When |
|--------|---|---|
| **Line Type** | Item, Location, Bin, Production, etc. | Always |
| **Item / Location / Order** | Item no., location code, or order no. | Always |
| **Descr / Bin Name / Customer** | Description, bin code, customer | Always |
| **Variant Code** | Blooming stage variant (GB, BB, FB, OG) | Always |
| **Expected in Location(s)** | Where system expects to find item | Item lines |
| **Expected in Zone(s)** | Which zones have this item | Item lines |
| **Expected in Bin(s)** | Which bins contain this item | Item lines |
| **Required Qty.** | Total needed (in sales UOM) | Item and Sales line |
| **Inventory (Sales)** | Current qty in bin (sales UOM) | Bin Content lines |
| **Potential Inventory (Sales)** | Qty from production or purchase (sales UOM) | Production/Purchase lines |
| **Qty. in Pick** | Already allocated to pick documents | All levels |
| **Unit of Measure** | UOM code (trays, flats, etc.) | Always |

**Quantities in Sales UOM:** Automatically converted from base units using item's "Qty. per Sales UOM" field (easier for staff to read).

### Quantity Calculations

**Required Qty.** (Item level)
- Sum of all units needed across sales orders for this item and shipment date
- Shows in sales UOM (e.g., trays, not individual plants)

**Inventory (Sales)** (Bin level)
- Current quantity physically in that bin
- From Bin Content records

**Potential Inventory** (Production level)
- Remaining output from Released production orders
- Only if Due Date <= shipment date

**Potential Inventory** (Purchase level)
- Qty ordered but not yet received
- Only if Expected Receipt Date < shipment date

**Qty. in Pick**
- Already allocated to warehouse pick documents
- Deducted from available inventory when planning picks

## Expected Location Indicators

The **Expected in Location(s)**, **Expected in Zone(s)**, and **Expected in Bin(s)** columns help you find items quickly.

### How Expected Locations Work

1. **From Item Master:** Default Item Location Code on the Item Card
2. **From History:** Bins where this item has been stored previously
3. **From Picking Patterns:** Based on how item is typically picked

### Using Expected Locations

**If inventory is in expected locations:** ✓ Stock is where it should be
**If inventory is NOT in expected locations:** ⚠️ Indicates misplaced stock or need to update item's default location

### Printing Location-Specific Reports

When printing scouting reports:

1. Click **Print** in the toolbar
2. In the request page:
   - **Location Code** (required) — Select the warehouse location
   - **Zone Code** (optional) — Further filter to one zone
3. Click **Preview** or **Print**

**Result:** Report only shows items with inventory in that location/zone. Cleaner, location-specific picking list.

## Advancing Blooming Stages from Scouting Reports

If your items use the [[blooming-stages]] system, you can **immediately advance inventory to the next stage** directly from the scouting report.

### When to Advance Stages Manually

- Large demand requires next stage earlier than scheduled
- Growers verify plants are physically ready ahead of schedule
- Urgent orders need immediate stage progression

⚠️ **Manual advancement bypasses normal scheduled progression. Only use when you've verified plants are physically ready.**

### Advancing Bin Content (Inventory)

1. Open scouting report for your shipment date
2. Expand the item and location to see bin content lines
3. Select the bin content line (indented under location)
4. Click **Post Next Stage** in the toolbar

**What happens:**
- Reclassification journal posts:
  - Negative adjustment on current variant (e.g., GB)
  - Positive adjustment on next variant (e.g., BB)
- Quantity transfers between variants in same bin
- Page refreshes to show updated inventory

**Result:** Inventory immediately moves to next blooming stage.

### Advancing Production Order Stages

1. Open scouting report for shipment date
2. Expand item and location to see production order lines
3. Select the production order line
4. Click **Post Next Stage**

**What happens:**
- Production order line's Growing Stage updates to next stage
- Next Stage Change Date recalculates
- No journal posts (posting occurs at output)
- When finished, inventory posts at new stage

**Result:** Production output will post at the advanced stage.

### Stage Advancement Validation

System validates before allowing advancement:

| Check | Requirement |
|-------|---|
| **Variant has blooming stage** | Variant must have CLE Blooming Stage field set |
| **Next stage variant exists** | A variant must exist for the next stage |
| **Auto transition enabled** | If advancing to Overgrown, feature must be enabled |
| **Line type correct** | Can only advance Bin Content or Production Order lines |

You **cannot** advance Location, Item, Purchase Order, Demand, or Sales Line rows.

## Prioritizing Bins for Picking

If your setup has **pick prioritization enabled**, manage which bins are picked first:

### Viewing Bin Priorities

**Pick Priority** shown on Bin Content lines:

| Value | Meaning |
|-------|---------|
| **Blank or 0** | No priority (picked in warehouse order) |
| **1-98** | Priority order (lower = picked first) |
| **99** | Excluded from automatic picking |

### Setting Bin Priorities

1. Open scouting report
2. Expand item to Bin Content level
3. Select a bin content line
4. Click **Prioritize Bins**

**System opens** Bin Content page filtered to this item (non-supermarket bins only).

Edit the **CLE Picking Priority** field for each bin, then close to return to report.

### Priority Example

```
Bin A-01-001: Priority 1  ← Picked first
Bin A-01-002: Priority 2  ← Picked second
Bin A-01-003: Priority 0  ← Picked after prioritized
Bin HOLD-001: Priority 99 ← Never picked (reserved stock)
```

**Tip:** Use priority 99 for bins with inventory on hold, quality control, or reserved stock that shouldn't be picked automatically.

## Printing Scouting Reports

Generate a location-specific printed report for field use:

### Steps

1. Open **Scouting Report Lines**
2. Click **Print**
3. Enter:
   - **Location Code** (required) — The location to scout
   - **Zone Code** (optional) — Narrow to one zone
4. Click **Preview** or **Print**

### What's Included

- Items grouped with sales order demand
- Expected bins for each item
- Current and potential inventory
- Customer, salesperson, shipment date

**Use for:**
- Hand to pickers as picking guide
- Growers walking greenhouse to verify readiness
- Physical inventory checks before shipment
- Field communication when tablets unavailable

**Note:** Report automatically excludes items with no inventory or demand in selected location/zone (keeps it concise).

## Common Scouting Scenarios

### Scenario 1: Checking Tomorrow's Picking Requirements

1. Open **Item Scouting** → Select tomorrow's date
2. Review **Required Qty.** for each item
3. Expand locations to see where inventory is stored
4. Note any items highlighted as short

**Next:** If inventory insufficient, check production/purchase potential or escalate.

### Scenario 2: Advancing Stages for Large Order

1. Open scouting report for shipment date
2. Locate item (e.g., Petunia Purple)
3. Expand to see bin in Green Bud stage
4. Verify with grower that plants are ready
5. Select bin content line
6. Click **Post Next Stage**

**Result:** Inventory now at Bud & Bloom, available for order.

### Scenario 3: Finding Misplaced Inventory

1. Open scouting reports
2. Locate item
3. Check **Expected in Location(s)** vs actual bins shown
4. If misplaced, use Item Reclassification Journal to move inventory

### Scenario 4: Bin Prioritization for Efficiency

1. Open scouting report
2. Expand item to Bin Content level
3. Click **Prioritize Bins**
4. Set A-zone bins to priority 1-10
5. Set B-zone bins to priority 11-20
6. Set hold bins to priority 99

**Result:** Warehouse picks A-zone first (faster picking).

## Best Practices

✅ **DO:**
- Run scouting reports daily for next 2-3 shipment dates
- Review demand vs available inventory
- Identify shortfalls early (purchasing/production can respond)
- Print location-specific reports for field staff
- Verify plants before manually advancing stages
- Coordinate manual stage advances with growers
- Use prioritization to improve pick efficiency
- Document reasons for manual stage advancement

❌ **DON'T:**
- Advance stages without physical verification
- Leave old scouting data stale (refresh daily)
- Ignore items with unexpected locations (investigate why)
- Use scouting reports for quality assessment (use crop inspection instead)
- Forget supermarket bins are excluded (customer-owned inventory)
- Advance items already in Overgrown stage (final stage)

## Troubleshooting

### Issue: Report Shows No Data

**Cause:** No sales orders for selected shipment date, or all orders fully shipped

**Solution:**
1. Verify sales orders exist for selected date
2. Check that sales lines have positive qty not shipped
3. Try different shipment date

### Issue: Item Shows Required Qty. But No Inventory

**Cause:** Inventory in different location, in supermarket bin, or not yet received/produced

**Solution:**
1. Expand item to all locations and check
2. Look for production/purchase potential inventory
3. Search Bin Contents for item globally
4. Create purchase or production order if missing

### Issue: Post Next Stage Button Disabled

**Cause:** Selected line is not Bin Content or Production Order, or variants not configured

**Solution:**
1. Select Bin Content or Production Order line (indented under Location)
2. Verify item has blooming stage variants
3. Confirm next stage variant exists

### Issue: Expected Locations Are Blank

**Cause:** Item's Default Location Code not set, or item never stored historically

**Solution:**
1. Open Item Card and set Default Location Code
2. Run scouting report again (recalculates on-the-fly)

## Related Pages

- [[blooming-stages]] — Automatic stage progression and grower worksheet
- [[crop-inspection]] — Quality assessment and corrective actions
- [[customer-preferred-stages]] — Customer blooming stage preferences
