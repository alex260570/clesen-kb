# Sales fee management

> **Version:** 1.0
> **Last Updated:** 2026-03-16
> **Author:** Alexander Thiel
> **Audience:** Sales Staff, Operations Staff, Managers

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How fees work on sales orders](#how-fees-work-on-sales-orders)
- [How to configure fee setup](#how-to-configure-fee-setup)
- [How to manage fees on a sales order](#how-to-manage-fees-on-a-sales-order)
- [How to set customer address flags](#how-to-set-customer-address-flags)
- [What happens when you post](#what-happens-when-you-post)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

The **Sales Fee Management** system automatically calculates and applies fees to sales orders based on shipment method, payment method, and delivery requirements. Fees appear as a **Pending Sales Fees** section on the sales order and are converted to sales lines when the order is posted.

**Supported fee types:**

| Fee Type               | Triggered by                                          |
|------------------------|-------------------------------------------------------|
| Freight Charge         | Shipment method code on the order                     |
| Credit Card Fee        | Payment method code on the order                      |
| Lift Gate Fee          | `Lift Gate Required` flag on the order                |
| Residential Delivery   | `Residential Address` flag on the order               |
| Restocking Fee         | Return orders only — calculated on creation           |
| Handling Fee           | Added manually                                        |
| Insurance Fee          | Added manually                                        |
| Processing Fee         | Added manually                                        |

**Calculation types:**

- **Fixed Amount** — A flat fee regardless of order size
- **Percentage of Total** — A percentage of the order total, with optional minimum and maximum limits

---

## When to use it

The sales fee system works automatically in the background. Fees are calculated whenever relevant fields change on a sales order. You interact with it when:

- You need to review which fees are applied to an order
- You need to manually add a fee (Handling, Lift Gate, Residential)
- You need to remove a fee that should not apply
- You need to recalculate fees after changes

> **Note:** The system must be enabled by an administrator. When disabled, the legacy freight and credit card fee logic is used instead.

---

## What you need before you start

- **Sales Fees Enabled** must be turned on in the **CLE Sales Setup** page
- Fee rules must be configured in the **Sales Fee Setup** page (one record per fee type + code combination)
- Each fee rule must have an **Item No.** assigned — this is the item that appears on the sales order line when the fee is posted

> **Note:** Setup is typically done by a manager or administrator. Staff members interact with fees on individual sales orders.

---

## How fees work on sales orders

Fees are calculated automatically when you make changes to a sales order. Here is what triggers each fee type:

### Automatic triggers

| Action on Sales Order                                  | What recalculates                           |
|--------------------------------------------------------|---------------------------------------------|
| Change **Sell-to Customer No.**                        | All fees (freight, credit card, special)    |
| Change **Ship-to Code**                                | Address flags + shipment special fees       |
| Change **Shipment Method Code**                        | Freight charges                             |
| Change **Payment Method Code**                         | Credit card fees                            |
| Toggle **Residential Address** on the order            | Residential delivery fee                    |
| Toggle **Lift Gate Required** on the order             | Lift gate fee                               |
| Add first sales line                                   | All fees                                    |
| Change quantity, price, or discount on a sales line    | Percentage-based fees (e.g., credit card)   |
| Delete a sales line                                    | Percentage-based fees (or all, if no lines) |
| Change **Tax Liable**                                  | Credit card fees                            |

### Where fees appear

Fees show in the **Sales Fees** section at the bottom of the sales order page, below the sales lines. Each pending fee shows:

- Fee Type (Freight Charge, Credit Card Fee, etc.)
- Reference Code (shipment method or payment method code)
- Item No. (the fee item)
- Description
- Amount

---

## How to configure fee setup

### Step 1: Open the Sales Setup page

1. Search for **CLE Sales Setup** in the Business Central search bar.
2. The page shows the **Sales Fees Enabled** toggle.

### Step 2: Enable the system

Click **Enable Sales Fees** to turn on the new fee system. Click **Disable Sales Fees** to revert to the legacy system.

### Step 3: Open the Fee Setup

1. Click **Sales Fees** in the action bar (or search for **Sales Fee Setup**).
2. The **Sales Fee Setup** list opens.

### Step 4: Add fee rules

For each fee you want the system to calculate, create a line:

1. Select the `Fee Type` (e.g., Freight Charge, Credit Card Fee).
2. Enter the `Code`:
   - For Freight / Lift Gate / Residential fees: enter the **Shipment Method Code** this fee applies to.
   - For Credit Card fees: enter the **Payment Method Code** this fee applies to.
3. Enter the `Item No.` — the item that will be added to the sales order when the fee is applied.
4. Enter `Description` and optionally `Description 2`.
5. Select the `Calculation Type`:
   - **Fixed Amount** — enter the fee amount in `Amount/Percentage`.
   - **Percentage of Total** — enter the percentage in `Amount/Percentage`. Optionally set `Minimum Amount` and `Maximum Amount`.
6. Set the posting groups: `Gen. Prod. Posting Group`, `VAT Prod. Posting Group`, `Tax Group Code`.

> **Tip:** You can have multiple rules for the same fee type with different codes. For example, different freight charges for different shipment methods.

---

## How to manage fees on a sales order

### Viewing fees

Open a sales order. Below the sales lines, the **Sales Fees** section shows all pending fees. This section is only visible when the Sales Fees system is enabled.

### Manually adding fees

In the **Sales Fees** section, use the action bar:

- **Add Residential Delivery Fee** — Adds a residential delivery fee based on the order's shipment method
- **Add Lift Gate Fee** — Adds a lift gate fee based on the order's shipment method
- **Add Handling Fee** — Adds a handling fee

### Recalculating fees

If fees look incorrect or you want to force a refresh:

- **Calculate All Fees** — Recalculates all fee types
- **Recreate All Fees** — Deletes all pending fees and recalculates from scratch (asks for confirmation)
- **Freight Charges** / **Credit Card Fees** — Recalculate only a specific fee type

### Deleting fees

- **Delete Selected** — Removes the selected pending fee. If you delete a non-credit-card fee, credit card fees are recalculated (since the CC fee may be a percentage that includes other fees in its base).
- **Delete All** — Removes all unposted pending fees (asks for confirmation).

> **Note:** You cannot delete fees that have already been posted.

---

## How to set customer address flags

Two flags on the customer and ship-to address control whether special delivery fees apply:

### On the Customer Card

1. Open the **Customer Card**.
2. Set `CLE Residential Address` to **Yes** if the customer's default address is residential.
3. Set `CLE Lift Gate Required` to **Yes** if the customer's default address requires lift gate service.

When you change these flags, the system automatically updates all open sales orders for this customer and recalculates shipment special fees.

### On Ship-to Addresses

1. Open the customer's **Ship-to Addresses**.
2. Set the same flags (`CLE Residential Address`, `CLE Lift Gate Required`) on each ship-to address as needed.

When a sales order uses a specific ship-to code, the flags are copied from that ship-to address (not the customer default).

### On the Sales Order

The flags are also editable directly on the sales order header:

- `Residential Address` — visible below the Ship-to Code
- `Lift Gate Required` — visible below the Ship-to Code

Changing these flags on the order immediately recalculates the corresponding fee.

---

## What happens when you post

When you post a sales order:

1. The system removes any previously added fee lines from the order.
2. It recalculates all pending fees based on current setup.
3. It converts each pending fee into an actual sales line:
   - Item No. = the fee item from setup
   - Description = the fee description
   - Quantity = 1
   - Unit Price = the calculated fee amount
4. The order posts normally, including the fee lines.
5. Pending fees are marked as posted.

Fee lines appear on the posted sales invoice and shipment just like regular sales lines.

---

## Field reference

### CLE Sales Setup page

| Field                | What it means                                    | Can you edit it? |
|----------------------|--------------------------------------------------|------------------|
| `Sales Fees Enabled` | Master toggle for the fee system (on/off)        | Yes              |

### Sales Fee Setup (one line per fee rule)

| Field                    | What it means                                                           | Can you edit it? |
|--------------------------|-------------------------------------------------------------------------|------------------|
| `Fee Type`               | Type of fee (Freight, Credit Card, Lift Gate, etc.)                     | Yes              |
| `Code`                   | Shipment Method Code or Payment Method Code this rule applies to        | Yes              |
| `Item No.`               | Item added to sales order when fee is applied                           | Yes              |
| `Description`            | Display name for the fee                                                | Yes              |
| `Description 2`          | Additional description                                                  | Yes              |
| `Calculation Type`       | Fixed Amount or Percentage of Total                                     | Yes              |
| `Amount/Percentage`      | The fee value (dollar amount or percentage)                             | Yes              |
| `Minimum Amount`         | Floor for percentage-based fees (0 = no minimum)                        | Yes              |
| `Maximum Amount`         | Cap for percentage-based fees (0 = no maximum)                          | Yes              |
| `Gen. Prod. Posting Group` | GL posting group for the fee                                          | Yes              |
| `VAT Prod. Posting Group`  | VAT posting group                                                     | Yes              |
| `Tax Group Code`         | Tax group for fee                                                       | Yes              |

### Sales Order — fee-related fields

| Field                  | What it means                                                 | Can you edit it? |
|------------------------|---------------------------------------------------------------|------------------|
| `Residential Address`  | Order ships to a residential address (triggers residential fee)| Yes             |
| `Lift Gate Required`   | Order requires lift gate service (triggers lift gate fee)      | Yes             |

### Pending Sales Fees (on sales order)

| Field            | What it means                                        | Can you edit it? |
|------------------|------------------------------------------------------|------------------|
| `Fee Type`       | Type of fee                                          | No               |
| `Reference Code` | Shipment or payment method code                      | No               |
| `Item No.`       | Fee item that will be added to the order             | No               |
| `Description`    | Fee description                                      | No               |
| `Amount`         | Calculated fee amount                                | No               |

---

## Troubleshooting

### The "Sales Fees" section is not visible on the sales order

**Cause:** The Sales Fees system is not enabled.

**Solution:** Search for **CLE Sales Setup** and click **Enable Sales Fees**. The section appears on sales orders after enabling.

---

### No fees are calculated even though the system is enabled

**Cause:** No fee rules are configured in the Sales Fee Setup, or the shipment/payment method codes on the order do not match any setup rules.

**Solution:**

1. Open **Sales Fee Setup** and verify rules exist.
2. Check that the `Code` on each rule matches the shipment method or payment method used on the order.
3. Try clicking **Calculate All Fees** on the pending fees section.

---

### Credit card fee amount seems wrong after deleting a fee

**Cause:** Credit card fees calculated as a percentage include other fees (freight, lift gate, residential) in the calculation base. Deleting one of those fees changes the base amount.

**Solution:** The system automatically recalculates credit card fees when you delete a non-credit-card fee. If it still looks wrong, click **Recreate All Fees**.

---

### Fees did not update when I changed the customer's Residential Address flag

**Cause:** The system updates open orders automatically when you change the flag on the Customer Card or Ship-to Address. If the order uses a specific Ship-to Code, the customer-level flag is not used.

**Solution:** Verify which address the order uses:

- If `Ship-to Code` is set: update the flag on the **Ship-to Address**, not the customer.
- If `Ship-to Code` is blank: update the flag on the **Customer Card**.
- You can also toggle the flag directly on the sales order header.

---

### Error: Cannot delete a posted fee

**Cause:** The fee has already been posted with the sales order.

**Solution:** Posted fees cannot be removed. If the fee was applied in error, create a credit memo or adjustment.

---

### Percentage-based fee exceeds expected amount

**Cause:** The `Maximum Amount` field may not be set, or the order total is higher than expected.

**Solution:** Check the fee rule in **Sales Fee Setup**. Set a `Maximum Amount` to cap the fee if needed.

---

## FAQ

**What is the difference between the new system and the legacy system?**

The legacy system only handled freight charges (via Shipment Method Code) and credit card fees (via Payment Terms Code). The new system supports eight fee types, percentage-based calculations with min/max, pending fee preview before posting, and manual fee addition.

**Can I have multiple fee rules for the same fee type?**

Yes. Each rule is tied to a specific Code (shipment method or payment method). Different codes can have different amounts and calculation types.

**Are fees included in the order total shown on the sales order?**

Pending fees are shown in the Sales Fees section but are not added to the sales lines until posting. The order total on the sales order header does not include pending fees. After posting, fee lines are part of the invoice total.

**Can I manually change the fee amount?**

No. Fee amounts are calculated from the setup rules. To change a fee amount, update the rule in **Sales Fee Setup** and recalculate. You can delete a fee and the system will not re-add it automatically unless triggered by a field change.

**What happens to fees on a return order?**

Restocking fees are calculated automatically when a return order is created. Other fee types (freight, credit card) also apply to return orders based on the same setup rules.

**Do fees carry over when I copy a sales order?**

No. Fees are recalculated fresh on the new order based on current setup rules and order details.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/sales-fee-management-user-guide.pdf)
