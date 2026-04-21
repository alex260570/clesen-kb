---
title: Availability System - IT Troubleshooting
type: howto
tags: [availability, troubleshooting, IT, system-architecture]
created: 2026-04-21
updated: 2026-04-21
sources: [availability-troubleshooting-guide.md]
---

# Availability System - IT Troubleshooting

Technical reference for diagnosing and fixing availability calculation issues.

## System Architecture

### Core Components

**Codeunit 50064: CLE Availability Calculation**
- Primary calculation engine
- Implements period-based availability algorithm
- Entry point: `CalculateItemAvailabilityForDate()`

**Codeunit 50053: CLE Availability Management**
- High-level coordination and filtering
- Creates location filters (`CreateActiveLocationFilter()`)
- Manages calculation modes (optimized vs. full)

**Codeunit 50055: CLE Availability Forecast Mgt**
- Generates drill-down demand/supply lists
- Entry point: `CreateDemandSupplyListForItem()`
- Recently fixed: Production component quantity display

**Table 50014: CLE Item Avail. by Period**
- Temporary table storing period calculations
- Fields: Availability Date, Period End Date, Supply, Demand, Net, Running Total

**Table 50077: CLE Availability Reserve**
- Stores temporary inventory reserves
- Reduces availability until release date
- Optional feature (controlled by setup)

### Pages Using Availability

| Page | ID | Primary Use |
|------|----|----|
| CLE Avail Forecast Matrix | 50138 | Multi-item/multi-date grid view |
| CLE Sales Speed Entry | 50142 | Order entry with availability |
| CLE Item Availability Factbox | 60078 | Sales document sidebar |
| CLE Daily Availability | 50187 | Planning overview |
| CLE Rapid Order Entry | 50071 | Fast order entry |

## Calculation Algorithm

### Period-Based Approach

The system divides time into periods bounded by supply dates. For each period:

1. **Supply:** Sum of purchase orders + production orders arriving in period
2. **Demand:** Sum of sales orders + production components due in period
3. **Net Change:** Supply - Demand
4. **Running Total:** Previous period availability + Net Change

### Negative Period Handling

If any future period goes negative, it "pulls back" from current availability:

```
Example:
- Today: 100 pcs available
- Period 2 (next week): -50 pcs (shortage)
- Result: Current availability reduced to 50 pcs
```

This prevents over-promising inventory already committed to future demand.

### Source Data

**Supply Sources:**

- `Purchase Line` — Orders with Expected Receipt Date, filtered by Location
- `Prod. Order Line` — Released production orders with Due Date
  - Regular items: `"Remaining Qty. (Base)" - "CLE Safety Qty. (Base)"`
  - Roll-up items: Additional supply from by-products

**Demand Sources:**

- `Sales Line` — Blanket orders (`"CLE Blanket Qty.Remain (Base)"`)
- `Sales Line` — Regular orders (`"CLE Qty. not Shipped (Base)"`)
- `Prod. Order Component` — Released components (`"Remaining Quantity"`)

### Key Fields

**Production Order Component:**

- `"Quantity (Base)"` — Total allocated quantity (DON'T USE for availability)
- `"Remaining Quantity"` — Quantity still needed (USE THIS)

**Production Order Line:**

- `"Remaining Qty. (Base)"` — Production quantity not yet finished
- `"CLE Safety Qty. (Base)"` — Buffer stock excluded from availability

## Recent Bug Fix (February 2026)

### Issue

Production order components displayed incorrect quantities in availability drill-down (e.g., showing -0.1 cases instead of -36 cases).

### Root Cause

**File:** `50055.Codeunit.CLE.AvailabilityForecastMgt.al`  
**Procedure:** `AddDemandToList()`, lines 141-143

Used `"Quantity (Base)"` instead of `"Remaining Quantity"`:

```
// WRONG (old code)
TempSalesLine.Quantity := (ProdOrderComponent."Quantity (Base)" / Item."CLE Qty. per Sales UOM") * (-1)

// CORRECT (fixed)
TempSalesLine.Quantity := (ProdOrderComponent."Remaining Quantity" / Item."CLE Qty. per Sales UOM") * (-1)
```

### Why It Mattered

- Availability calculation (50064) uses `"Remaining Quantity"` (line 339)
- Drill-down display (50055) was using `"Quantity (Base)"`
- These fields diverge when components are partially consumed
- Mismatch caused display to show total allocated vs. actual remaining demand

### Verification

If users report quantity mismatches:

1. Check if component is partially consumed
2. Compare `"Quantity (Base)"` vs. `"Remaining Quantity"` on component record
3. Verify drill-down matches availability calculation result

## Troubleshooting Guide

### Problem: Availability Shows Wrong Number

#### Step 1: Verify Calculation

```
In Codeunit 50064, line 13-53
Set breakpoint and check:
- LocationFilter value
- SupplyDates collection
- TempAvailLine records after CreateTempLines()
```

#### Step 2: Check Source Data

- Open Item Ledger Entries — verify inventory at locations
- Check Purchase Lines — confirm Expected Receipt Dates and quantities
- Check Prod. Order Lines — verify Due Dates and Remaining Qty
- Check Sales Lines — verify Shipment Dates and not-shipped quantities
- Check Prod. Order Components — verify Due Dates and Remaining Quantity

#### Step 3: Verify Location Filter

```
In Codeunit 50053, CreateActiveLocationFilter()
Should return: "EVANSTON|GRAYSLAKE|..." (active locations only)
Check Location table: "CLE Hide from Availability" = false
```

#### Step 4: Check for Reserves

```
If "CLE Use Availability Reserves" enabled
Query Table 50077 for active reserves on the item
Filter: "Release at Date" > TODAY
```

### Problem: Drill-Down Shows Different Total Than Availability

#### Check Unit of Measure Conversions

Drill-down converts all quantities to Sales UoM:

```
For Purchase Orders (line 209):
TempSalesLine.Quantity := (PurchLine."Quantity (Base)" - "Qty. Received (Base)") / SalesQuantityPer

For Production Components (line 141):
TempSalesLine.Quantity := (ProdOrderComponent."Remaining Quantity" / Item."CLE Qty. per Sales UOM") * (-1)
```

Verify:

1. Item."Sales Unit of Measure" is set correctly
2. Item Unit of Measure."Qty. per Unit of Measure" is correct
3. FlowField "CLE Qty. per Sales UOM" calculates properly

#### Check for Missing Data

Drill-down might not include all sources if:

- Purchase Line has wrong Location Code (not in active locations)
- Sales Line Document Type doesn't match filter (Order vs. Blanket Order)
- Production Order Status isn't Released
- Date filters exclude records

### Problem: Negative Availability When Inventory Exists

#### This is often correct behavior

Future demand exceeds current + future supply. Check:

1. Sales orders with near-term shipment dates
2. Production components due soon
3. Lack of purchase orders to replenish

#### Verify with drill-down

- Click availability number
- Sum all negative values (demand)
- Sum all positive values (supply + inventory)
- If demand > supply, negative availability is correct

### Problem: Performance Issues

#### Optimized Mode

System has two calculation modes:

**Original Mode** (line 59-95):
- Loops through each supply date
- Queries demand/supply for each period
- Slower for many supply dates

**Optimized Mode** (line 97-152):
- Pre-fetches all supply dates: `GetAllSupplyDates()`
- Single pass through results
- Better performance with many periods

Check which mode is active and consider optimization if slow.

#### Location Filtering

Ensure location filter is properly applied:

```
Queries should use LocationFilter variable
PurchLine.SetFilter("Location Code", LocationFilter);
ProdOrderLine.SetFilter("Location Code", LocationFilter);
```

### Problem: Production Components Not Showing

#### Check Status Filter

```
Line 130 in 50055
ProdOrderComponent.SetRange("Status", ProdOrderComponent.Status::Released);
```

Components on Planned/Simulated/Finished orders are excluded. Verify production order is Released.

#### Check Date Filter

```
Line 131 in 50055
ProdOrderComponent.SetFilter("Due Date", DateFilter);
```

Verify component Due Date falls within the requested date range.

## Performance Tuning

### Diagnosis: Is Availability Performance an Issue?

```
Symptom: Matrix page takes >5 seconds to load

Enable diagnostic logging:
Setup > Activity Log
Enable: "Availability Calculation"
Rerun calculation, note elapsed time

Target times:
< 100 items: 500ms
100-500 items: 2s
500-1000 items: 5s
>1000 items: >5s (optimization needed)
```

### Optimization 1: Location Filtering

**Issue:** Calculating availability for all 50 locations slows matrix.

**Solution:**

1. Setup > Availability Settings
2. Mark only active warehouse locations in "Active Locations for Availability"
3. Set "CLE Hide from Availability" = FALSE on dormant locations
4. Save and recalculate

**Expected improvement:** 30-50% faster if >50% of locations disabled.

### Optimization 2: Date Range Limiting

**Issue:** Extending forecast 12 months creates too many periods.

**Solution:**

1. Page 50138 Availability Matrix
2. Set "Forecast Period" = "6 Months" (default)
3. Use date range filters to show only next 3 months
4. For long-range planning, use "Summary" view

**Expected improvement:** 40-60% faster.

### Optimization 3: Production Order Filtering

**Issue:** Including all production statuses creates detail.

**Solution:**

1. Setup > Availability Settings
2. "Include Production Status": Select only "Released"
3. Excludes Planned/Simulated from calculations

**Trade-off:** Loses planning visibility, but much faster.

**Expected improvement:** 20-40% faster.

### Optimization 4: Periodic Snapshots

**Issue:** Real-time calculation every page load is expensive.

**Solution:** Pre-calculate availability snapshots on a schedule.

1. Setup > Job Queue Entries
2. Create new entry:
   - Object Type: Codeunit
   - Object ID: 50064 (CLE Availability Calc)
   - Recurrence: Daily at 6 AM
3. Save

**Effect:** Availability calculated once daily, pages load pre-computed results.

**Expected improvement:** 1000%+ (pre-calculated vs. live).

**Trade-off:** Availability up to 24 hours old during day.

### Optimization 5: Archive Old Availability

**Issue:** Years of availability history in Table 50014 causes indexing overhead.

**Solution:**

1. Maintenance > Archive Availability
2. "Keep Historical Data From": 12 months back
3. Older records moved to archive table (50014A)
4. Run quarterly

**Expected improvement:** 10-20% faster queries.

## Configuration

### Setup Requirements

#### Location Setup

- Field: "CLE Hide from Availability" (Boolean)
- Purpose: Exclude locations from availability calculation
- Used in: CreateActiveLocationFilter()

#### General Setup

- Field: "CLE Use Availability Reserves" (Boolean)
- Purpose: Enable/disable availability reserve feature
- Used in: CalculateItemAvailabilityForDate()

### Field Extensions

#### Item Table Extensions

```
field(60517; "CLE Qty. per Sales UOM"; Decimal)
{
    FieldClass = FlowField;
    CalcFormula = lookup("Item Unit of Measure"."Qty. per Unit of Measure" 
                         where("Item No." = field("No."), 
                               Code = field("Sales Unit of Measure")));
}
```

#### Sales Line Extensions

```
"CLE Qty. not Shipped (Base)" - FlowField for demand calculation
"CLE Blanket Qty.Remain (Base)" - FlowField for blanket order demand
```

#### Production Order Line Extensions

```
"CLE Safety Qty. (Base)" - Buffer stock excluded from supply
"Roll-up Item No." - For by-product supply tracking
```

## Related Files

### Core Calculation

- `app/5 Codeunits/Availability/50064.Codeunit.CLE.AvailabilityCalculation.al`
- `app/5 Codeunits/Availability/50053.Codeunit.CLE.AvailabilityManagement.al`
- `app/5 Codeunits/Availability/50055.Codeunit.CLE.AvailabilityForecastMgt.al`

### Data Tables

- `app/1 Tables/Availability/Tab50014.CLEItemAvailbyPeriod.al`
- `app/1 Tables/Availability/Tab50077.CLEAvailabilityReserve.al`

### Pages

- `app/3 Pages/Availability/50138.Page.CLE.AvailForecastMatrix.al`
- `app/3 Pages/Availability/50142.Page.CLE.SalesSpeedEntry.al`
- `app/3 Pages/Availability/60078.PagePart.CLE.ItemAvailabilityFactbox.al`

### Table Extensions

- `app/2 Table Extensions/Item/50020.Tab-Ext.CLE.Item.al`
- `app/2 Table Extensions/Inventory/Tab-Ext50022.CLESalesLine.al`

## Escalation

If troubleshooting doesn't resolve the issue:

1. **Collect diagnostics:**
   - Item No. and date causing issue
   - Screenshot of availability number
   - Screenshot of drill-down details
   - Manual calculation of expected availability

2. **Check recent changes:**
   - Git history of availability codeunits
   - Recent version deployments
   - Configuration changes to locations or setup

3. **Create reproducible test:**
   - Document exact steps to see the issue
   - Include test data (item, orders, inventory levels)
   - Note expected vs. actual results

4. **Contact development team** with full diagnostics

## Related Pages

- [[availability-system]] — System overview
- [[availability-reserves]] — Managing reserves
- [[move-lines-troubleshooting]] — Move Lines IT troubleshooting
