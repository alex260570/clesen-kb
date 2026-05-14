---
title: Sales Fees — Admin Guide
type: howto
tags:
  - sales-orders
  - fees
  - admin
  - system-configuration
created: 2026-05-07
updated: 2026-05-14
sources:
  - sales-fee-management.md
---

# Sales Fees — Admin Guide

System administration and configuration guide for the Sales Fee feature. For day-to-day staff usage, see [[sales-fees]].

## System Overview

The Sales Fee system replaces two legacy mechanisms:

- **Old freight logic** — hardcoded to `Shipment Method."Freight Item No."` and `"Calculation Method"`. Wrote sales lines directly during validation.
- **Old credit card fee logic** — hardcoded to `Payment Terms."Credit Card Charge Item"`. Wrote a sales line directly when payment terms changed.

The new system stages fees in the `CLE Pending Sales Fee` table and converts them to sales lines automatically when the order is posted. Configuration lives in two tables:

- **CLE Sales Fee Setup** — global fee rules, keyed by `Fee Type` + `Code` (Shipment Method or Payment Method).
- **CLE Customer Fee Override** — per-customer overrides; takes priority over the global setup when present.

Activation is controlled by `CLE Sales Setup."Sales Fees Enabled"`. While off, the legacy logic still runs.

## Fee Types

| Fee Type | Code Field | Trigger |
|---|---|---|
| **Freight Charge** | Shipment Method | Shipment Method Code on the order, or sell-to customer change |
| **Fuel Surcharge** | Shipment Method | Shipment Method Code on the order, or sell-to customer change |
| **Credit Card Fee** | Payment Method | Payment Method Code on the order |
| **Lift Gate Fee** | (blank) | `CLE Lift Gate Required` flag on the order |
| **Residential Delivery** | (blank) | `CLE Residential Address` flag on the order |
| **Restocking Fee** | (blank) | Return Orders only |
| **Handling Fee** | (any) | Manual action only |
| **Insurance Fee** | (any) | Manual action only |
| **Processing Fee** | (any) | Manual action only |

**Fuel Surcharge** is the newest fee type. It behaves like Freight Charge — keyed on Shipment Method and triggered by the same events — but is calculated and stored as a separate pending fee so finance can report on it independently.

## Calculation Types

All fee types support all four calculation methods:

### Fixed Amount

A flat fee. `Amount/Percentage` is the dollar amount.

### Percentage of Total

`Amount/Percentage` is a percent. The base depends on the fee type:

- **Credit Card Fee** — calculated against the order total **including** all other pending fees (incl. VAT). This ensures the customer is charged the CC processing fee on the total they actually pay.
- **All other fees** — calculated against the order total **excluding** any fee items.

`Minimum Amount` and `Maximum Amount` clamp the percentage result.

### Per Cart

`Amount/Percentage` is dollars per cart.

```
Fee = (CW Cart Quantity on Sales Header) × (Amount/Percentage)
```

`CW Cart Quantity` on the Sales Header is a FlowField that sums `CLE Cart Quantity` on the Sales Lines. Cart quantity is calculated from item quantity automatically — when line quantity changes, cart quantity updates and the Per Cart fee is recalculated.

`Minimum Amount` and `Maximum Amount` are not applied to Per Cart fees.

### Per Item

`Amount/Percentage` is dollars per item.

```
Fee = (Sum of Quantity on non-fee item lines) × (Amount/Percentage)
```

`Minimum Amount` and `Maximum Amount` are not applied to Per Item fees.

## Return Orders

On a Sales Return Order a fee is a **charge to the customer** — it must reduce the credit, not add to it. The `CLE Sales Fee Setup."Add To"` field (Sales Order / Return Order / Both) controls which fees are eligible on a return order; the Restocking Fee is normally set to *Return Order*.

The fee amount is calculated the same way (the calculation uses the positive return-order line total), but the pending fee is **stored signed by document type**:

- **Sales Order** — `Quantity = 1`, `Amount = +FeeAmount`.
- **Return Order** — `Quantity = -1`, `Amount = -FeeAmount`. `Unit Price` stays the positive per-unit rate.

This negative sign flows through everywhere: the Pending Sales Fees subpage shows a negative amount, `CalcTotalInclFeesAndTax` reduces the credit, per-fee tax is negative, and `AddFeesToSalesOrder` posts a negative sales line that reduces the credit memo. The sign is applied in `CreatePendingFee` and `AddManualFee`; `RecalculateVariableRateFees` keeps `Amount = Quantity × FeeAmount` so the sign survives variable-rate recalculation.

## Customer-Specific Overrides

Use **CLE Customer Fee Override** to give a specific customer different fee rates from the global setup.

- Override key is `Customer No.` + `Fee Type` + `Code` + `Line No.`
- When present, the override **fully replaces** the global setup row for that customer (the global row is not used)
- Overrides support all four calculation types and all fee types

Example: Customer `C-1000` has negotiated 5% credit card fee instead of the standard 3% — create a Customer Fee Override row keyed on `C-1000` + `Credit Card Fee` + `<their CC payment method>`.

## Per Shipment Fees

Some fees should only be charged once per physical shipment, even when multiple sales orders are loaded onto the same truck. Set the **Per Shipment** flag on the Sales Fee Setup or Customer Fee Override row to mark a fee this way.

When orders are loaded together (Loading Management → Prep Sales Orders), the system deduplicates pending fees marked Per Shipment so only one survives across the affected orders.

This is typically used for Freight Charge and Fuel Surcharge.

## Migration from the Legacy System

Run these steps in order when switching from the legacy system to the new Sales Fees system. The new system does not migrate configuration automatically — you must recreate setup rows from the legacy data.

### Step 1 — Configuration Migration

#### Freight Charges

For each `Shipment Method` record where `Freight Item No.` is populated:

| Old Field | New Row in CLE Sales Fee Setup |
|---|---|
| Shipment Method Code | `Code` |
| Freight Item No. | `Item No.` |
| Calculation Method = Total Value | `Calculation Type` = Percentage of Total |
| Calculation Method = Fixed Price | `Calculation Type` = Fixed Amount |
| Implicit rate (in item price) | `Amount/Percentage` — verify with accounting |

#### Credit Card Fees

For each `Payment Terms` record with `Credit Card Charge Item` populated:

1. Identify which `Payment Method` records correspond to that payment terms record (the new system is keyed on Payment Method, not Payment Terms).
2. Create one row in CLE Sales Fee Setup per Payment Method:
   - `Fee Type` = Credit Card Fee
   - `Code` = Payment Method Code
   - `Calculation Type` = Percentage of Total
   - `Amount/Percentage` = the CC rate

#### Fuel Surcharge

Configure once the rate is known:

- `Fee Type` = Fuel Surcharge
- `Code` = Shipment Method Code
- `Calculation Type` = Per Cart (most common)
- `Amount/Percentage` = $ per cart

#### Customer-Specific Overrides

Review customers with negotiated freight or CC rates and create CLE Customer Fee Override rows.

### Step 2 — Enable the New System

1. Open **CLE Sales Setup**.
2. Click **Enable Sales Fees**.

This action:

- Sets `Sales Fees Enabled = true` on the Sales Setup record.
- Sets `AutoFreightCharges = false` and `AutomaticCreditCardCharges = false` on Clesen Setup.
- Hides the two legacy checkboxes from Clesen Setup so they cannot be re-enabled accidentally.

### Step 3 — Migrate Open Orders

After enabling the system, click **Migrate Open Orders** on the **CLE Sales Setup** page.

This action:

1. Asks for confirmation showing the number of open Sales Orders.
2. Loops every open Sales Order and for each:
   - Calls `DeleteFreightLines(SalesHeader)` — removes legacy freight lines (item numbers from Shipment Method `Freight Item No.`).
   - Calls `DeleteCCLine(SalesHeader)` — removes legacy CC lines (item numbers from Payment Terms `Credit Card Charge Item`).
   - Calls `RecreateAllFees(SalesHeader)` — clears any stale pending fees and creates fresh ones using the new setup.
3. Shows a final count of migrated orders.

**Run this before the next posting cycle.** Otherwise old fee lines and new pending fees would coexist on the same order.

### Step 4 — Shipment Method Review (Data Task)

Review every active customer's open orders and verify the **Shipment Method Code** is set correctly. The new freight and fuel surcharge fees are keyed by Shipment Method Code; orders with a blank or wrong code will not get those fees.

Recommended: pull a list of open orders grouped by Customer + Shipment Method Code, flag anomalies, and correct before or immediately after enabling.

## Rollback Plan

If something goes wrong after enabling, the legacy system is **fully intact** and can be reactivated:

1. Open **CLE Sales Setup**.
2. Click **Disable Sales Fees**.
3. Open **CLE Clesen Setup** — the legacy `AutoFreightCharges` and `AutomaticCreditCardCharges` checkboxes become visible again.
4. Set them back to **Yes**.

The legacy subscribers in `CLE Sales Fee Subscriber` re-engage on the next sales order edit. No data is destroyed by toggling.

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| No freight fee on a new order | Shipment Method Code blank, or no Sales Fee Setup row for that code | Add the Shipment Method Code to the order, or create a setup row |
| Wrong fee amount on an order with multiple line changes | Fee was added manually and then lines changed — the manual fee did not recalc | Click **Recreate All Fees** on the Pending Sales Fees |
| CC fee includes another fee in its base | Expected — CC fees use total including other fees | This is correct. CC fee is on what the customer actually pays. |
| Fee uses wrong rate for a specific customer | Customer Fee Override row exists with stale rate | Update or delete the override row |
| Fuel Surcharge $0 with Per Cart selected | Cart Quantity on the order is 0 | Verify line items have non-zero `CLE Cart Quantity` (calculated from item Qty/Cart) |
| Both legacy freight line and new pending fee on order | Migration was not run after enabling | Run **Migrate Open Orders** on CLE Sales Setup |

## Related Pages

- [[sales-fees]] — Staff guide for daily fee management
- [[sales-order-management]] — Sales order documentation
