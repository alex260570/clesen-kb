---
title: Sales Fees
type: howto
tags: [sales-orders, fees, freight, credit-card, pricing]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-fee-management-user-guide.md]
---

# Sales Fees

Automatic calculation and management of fees on sales orders.

## What Are Sales Fees?

**Sales Fees** are charges automatically calculated and applied to sales orders based on shipment method, payment method, and delivery requirements. Fees appear in a **Pending Sales Fees** section and convert to sales lines when the order is posted.

### Fee Types Supported

| Fee Type | Triggered By |
|----------|---|
| **Freight Charge** | Shipment method code |
| **Credit Card Fee** | Payment method code |
| **Lift Gate Fee** | Lift Gate Required flag |
| **Residential Delivery** | Residential Address flag |
| **Restocking Fee** | Return orders |
| **Handling Fee** | Added manually |
| **Insurance Fee** | Added manually |
| **Processing Fee** | Added manually |

### Calculation Types

- **Fixed Amount** — Flat fee regardless of order size
- **Percentage of Total** — Percentage of order total with optional min/max limits

## Enabling Sales Fees

1. Search for **CLE Sales Setup**
2. Click **Enable Sales Fees** to activate (or **Disable** to revert to legacy system)
3. Fees section appears on all sales orders

## Configuring Fee Rules

### Step 1: Open Sales Fee Setup

1. Search for **Sales Fee Setup**
2. The **Sales Fee Setup** list opens
3. Click **+ New** to add a fee rule

### Step 2: Create Fee Rule

For each fee type, fill in:

| Field | Description |
|-------|---|
| **Fee Type** | Freight Charge, Credit Card Fee, Lift Gate, etc. |
| **Code** | Shipment Method Code (freight/lift gate/residential) or Payment Method Code (CC fees) |
| **Item No.** | Item that appears on order line when fee is applied |
| **Description** | Display name for fee |
| **Calculation Type** | Fixed Amount or Percentage of Total |
| **Amount/Percentage** | Fee value (dollar amount or %) |
| **Minimum Amount** | Floor for percentage fees (0 = no minimum) |
| **Maximum Amount** | Cap for percentage fees (0 = no maximum) |
| **Gen. Prod. Posting Group** | GL posting group |
| **VAT Prod. Posting Group** | VAT posting group |
| **Tax Group Code** | Tax group |

**Tip:** Create multiple rules for same fee type with different codes (e.g., different freight charges per shipment method).

## Managing Fees on Sales Orders

### Viewing Fees

Open a sales order. Below sales lines, the **Sales Fees** section shows all pending fees (visible only when system enabled).

### Manually Adding Fees

In the **Sales Fees** section, use these actions:

- **Add Residential Delivery Fee** — Adds residential fee based on shipment method
- **Add Lift Gate Fee** — Adds lift gate fee based on shipment method  
- **Add Handling Fee** — Adds manual handling fee

### Recalculating Fees

- **Calculate All Fees** — Recalculates all fee types
- **Recreate All Fees** — Deletes all pending and recalculates (asks for confirmation)
- **Freight Charges** / **Credit Card Fees** — Recalculate specific type only

### Deleting Fees

- **Delete Selected** — Removes selected fee (CC fees recalculate if non-CC fee deleted)
- **Delete All** — Removes all unposted fees (asks for confirmation)

⚠️ **Cannot delete posted fees.** Use credit memo for corrections.

## Setting Customer Address Flags

Two flags control special delivery fees:

### On Customer Card

1. Open **Customer Card**
2. Set **CLE Residential Address** = Yes if address is residential
3. Set **CLE Lift Gate Required** = Yes if lift gate needed
4. Changes auto-update all open sales orders for this customer

### On Ship-to Addresses

1. Open customer's **Ship-to Addresses**
2. Set same flags on each address as needed
3. When order uses specific ship-to code, flags copied from that address (not customer)

### On Sales Order

Both flags also editable directly on order header:

- **Residential Address** — Below Ship-to Code
- **Lift Gate Required** — Below Ship-to Code

Changing these flags immediately recalculates corresponding fees.

## What Happens When You Post

When posting a sales order:

1. System removes any previously added fee lines
2. Recalculates all pending fees from current setup
3. Converts each fee into a sales line:
   - Item No. = fee item from setup
   - Description = fee description
   - Quantity = 1
   - Unit Price = calculated amount
4. Order posts normally including fee lines
5. Pending fees marked as posted

**Result:** Fee lines appear on posted invoice and shipment like regular sales lines.

## Automatic Fee Triggers

Fees recalculate automatically when:

| Action | What Recalculates |
|--------|---|
| Change Sell-to Customer No. | All fees |
| Change Ship-to Code | Address flags + special fees |
| Change Shipment Method Code | Freight charges |
| Change Payment Method Code | Credit card fees |
| Toggle Residential Address | Residential delivery fee |
| Toggle Lift Gate Required | Lift gate fee |
| Add first sales line | All fees |
| Change qty/price/discount on line | Percentage-based fees |
| Delete sales line | Percentage-based fees (or all if no lines) |
| Change Tax Liable | Credit card fees |

## Best Practices

✅ **DO:**
- Set up fee rules per shipment/payment method
- Configure address flags on customers and ship-to addresses
- Review pending fees before posting
- Understand CC fees include other fees in calculation base
- Use fixed amounts for predictable fees
- Use percentages with min/max for flexible fees

❌ **DON'T:**
- Create duplicate rules (consolidate into one)
- Leave address flags unset (use defaults from customer/ship-to)
- Try to delete posted fees manually (use credit memo)
- Change fee rules during active orders (causes inconsistency)
- Mix fee calculation types without documentation

## Troubleshooting

### Sales Fees Section Not Visible

**Cause:** System not enabled

**Solution:** Open CLE Sales Setup, click "Enable Sales Fees"

### No Fees Calculated When Enabled

**Cause:** No fee rules configured, or order's codes don't match setup

**Solution:**
1. Open Sales Fee Setup, verify rules exist
2. Check Code field matches order's shipment/payment method
3. Try clicking **Calculate All Fees** on order

### Credit Card Fee Amount Wrong After Deleting Fee

**Cause:** CC fee percentage includes other fees in base. Deleting non-CC fee changes base.

**Solution:** System auto-recalculates CC fees. If still wrong, click **Recreate All Fees**.

### Fees Not Updating After Customer Flag Change

**Cause:** Order uses specific Ship-to Code. Changes on Customer Card don't affect it.

**Solution:**
- Update flag on **Ship-to Address**, not Customer Card
- Or toggle flag directly on sales order header
- Or click **Calculate All Fees**

### Error: Cannot Delete Posted Fee

**Cause:** Fee already posted with order

**Solution:** Create a credit memo or manual adjustment.

## FAQ

**What's the difference between fixed and percentage fees?**
Fixed = same amount always. Percentage = varies with order total, with optional min/max limits.

**Can I have different fees for different shipment methods?**
Yes. Create separate rules for each code (shipment/payment method).

**Are pending fees included in sales order total?**
No. Pending fees shown in section but not in header total. After posting, fee lines are part of invoice total.

**Can I manually change fee amounts?**
No. Amounts calculated from setup rules. Update rules in Sales Fee Setup, then recalculate.

**What about fees on return orders?**
Restocking fees auto-calculate. Other fees (freight, CC) apply same as sales orders based on setup rules.

**Do fees copy when I copy a sales order?**
No. Fees recalculate fresh on new order based on current setup and order details.

## Related Pages

- [[sales-order-management]] — Sales order reference
- [[rapid-order-entry]] — Fast order entry tool
- [[sales-prices]] — Price management
