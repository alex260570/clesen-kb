# Item substitution

> **Version:** 1.0
> **Last Updated:** 2026-03-10
> **Author:** Alexander Thiel
> **Audience:** Operations Staff

## Table of contents

- [Overview](#overview)
- [When to use this process](#when-to-use-this-process)
- [Prerequisites](#prerequisites)
- [How to cut or substitute an item](#how-to-cut-or-substitute-an-item)
- [How to change blooming stages](#how-to-change-blooming-stages)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## Overview

The **Clesen Item Substitution** tool lets you manage inventory shortages by reducing or replacing sales commitments when a primary item has insufficient supply.

Two outcomes are available:

- **Cut** — reduce the quantity on a customer's sales line (remove the shortage quantity from their order or blanket order)
- **Substitute** — replace the original item with a different item of sufficient stock

The tool loads all open sales orders and blanket orders for the item, prioritizes customers by rank (highest-ranked customers are protected first), pre-fills the quantities to adjust, and then applies all changes at once with a single **Apply Changes** action.

---

## When to use this process

Use this process when an item does not have enough inventory to fulfill all open sales commitments and you need to decide which customers to cut or substitute before the next shipment date.

---

## Prerequisites

Before starting, make sure you have:

- The item number you need to cut or substitute
- The total quantity you need to remove from orders (`Quantity to Cut`)
- A **Cut Reason Code** to record why the cut is happening
- If substituting: the substitute item number and confirmation it has sufficient available inventory

---

## How to cut or substitute an item

### Step 1: Open the Item Substitution page

1. Search for **Clesen Item Substitution** in the Business Central search bar.
2. The page opens with empty fields, ready for input.

### Step 2: Enter the item and quantity

1. In the `Item No.` field, enter or select the item you need to cut.
   - The `Item Description` and `Next Availability Date` fields fill in automatically.
2. In the `Quantity to Cut (Sales Unit of Measure)` field, enter the total quantity to remove across all orders.
   - The `Quantity to Cut (Base Unit of Measure)` updates automatically.
3. If you are substituting, enter the substitute item in the `Substitute Item No.` field.
   - The system will pre-mark which lines can be covered by the substitute based on its availability.

### Step 3: Load the sales lines

Choose one of these actions:

- **Get Lines** — loads all open sales order and blanket order lines for the item, up to the full quantity to cut.
- **Get Lines before next Avail. Date** — loads only lines with a shipment date before the `Next Availability Date`. Use this when you only need to cut lines that would ship before stock is replenished.

The lines appear sorted by customer priority — highest-ranked customers appear at the top (line 1 = highest priority, last line = lowest priority). The `Qty. to Adjust` column is pre-filled for each line in priority order until the full cut quantity is distributed.

> **Note:** Lines with a `Qty. to Adjust` of 0 will not be processed when you apply changes.

### Step 4: Review and adjust the lines

For each line in the list, review:

- **Customer name, type, and rank** — confirms which customers are affected
- **Document type and number** — the sales order or blanket order being modified
- **Shipment date** — the date the cut affects
- **Outstanding Qty.** — quantity currently committed on the line
- **Qty. to Adjust** — the quantity that will be cut or substituted; you can change this manually
- **Substitute** checkbox — checked automatically if the substitute item has enough availability; uncheck to cut instead of substitute
- **Substitute Availability** — remaining availability of the substitute after allocating previous lines
- **Qty. Substitute Item** — the quantity of the substitute item that will be added (accounts for unit-of-measure differences)

> **Tip:** If the substitute availability drops below zero on any line, the system blocks the **Apply Changes** action. Uncheck **Substitute** on some lines or pick a different substitute item.

To refresh the substitute availability totals after making manual changes, click **Update Quantity**.

### Step 5: Enter the cut reason

In the `Cut Reason Code` field, select the reason code for this cut. This field is required before applying changes.

Optionally, enter a free-text note in the `Comment` field.

### Step 6: Export to Excel (optional)

Click **Export to Excel** to download a spreadsheet of all lines before applying changes. The export captures:

- Customer name and salesperson
- Document type and number
- Item number and description
- Quantity cut, substitute item, and shipment date
- Cut reason code and comment

> **Note:** The system also exports automatically when you click **Apply Changes**, so you will always have a record.

### Step 7: Apply the changes

1. In the `Cut Reason Code` field, confirm a reason code is entered.
2. Click **Apply Changes**.
   - If the total `Quantity Cut` does not match `Quantity to Cut`, the system asks you to confirm before proceeding.
   - If any sales line has changed since you loaded the lines, the system blocks the apply and asks you to restart.
3. Click **Yes** to confirm.

The system processes each line:

- **Cut (Substitute checkbox unchecked):** Reduces the quantity on the sales order line by the `Qty. to Adjust`. If the quantity reaches zero, the line is deleted. The linked blanket order line is also reduced (unless **Put back on Blanket Order** is enabled — see below).
- **Full substitute (Substitute checkbox checked, entire line quantity being replaced):** Swaps the item number on the existing sales line to the substitute item. The blanket order line is also swapped.
- **Partial substitute (Substitute checkbox checked, only part of the line quantity being replaced):** Reduces the original line and creates a new sales line for the substitute item quantity. A new blanket order line is also created for the substitute item.

After applying, the lines that were processed are removed from the list.

---

## How to change blooming stages

If the item has blooming stage variants configured, you can update the variant code on all loaded sales lines to match each customer's preferred blooming stage.

1. Load the sales lines using **Get Lines** or **Get Lines before next Avail. Date**.
2. Click **Change Stage**.
3. The system applies each customer's configured stage preference to their line and shows how many lines were updated.

> **Note:** **Change Stage** only works when the Blooming Stages feature is active in Clesen Setup. If it is not active, the system displays a message and does nothing.

---

## Field reference

### Header fields

| Field                                      | Description                                                                              | Required |
|--------------------------------------------|------------------------------------------------------------------------------------------|----------|
| `Item No.`                                 | The item to cut or substitute                                                            | Yes      |
| `Item Description`                         | Description of the item (read-only, auto-filled)                                         | —        |
| `Substitute Item No.`                      | The replacement item; leave blank for a pure cut                                         | No       |
| `Substitute Item Description`              | Description of the substitute item (read-only, auto-filled)                              | —        |
| `Quantity to Cut (Sales Unit of Measure)`  | Total quantity to remove across all orders, in the item's sales unit of measure          | Yes      |
| `Quantity to Cut (Base Unit of Measure)`   | Same quantity converted to the base unit of measure (read-only)                          | —        |
| `Quantity Cut (Sales Unit of Measure)`     | Sum of all `Qty. to Adjust` values currently in the lines list (read-only)               | —        |
| `Next Availability Date`                   | Next date within the next 3 months when the item has positive available inventory        | —        |
| `Cut Reason Code`                          | Reason code for this cut; recorded on each modified sales line                           | Yes      |
| `Comment`                                  | Free-text note included in the Excel export                                              | No       |
| `Put back on Blanket Order`                | When checked on a pure cut (no substitute), the blanket order quantity is **not** reduced — the cut is taken only from the sales order. Cannot be used when substituting. | No |

### Lines columns

| Column                    | Description                                                                          |
|---------------------------|--------------------------------------------------------------------------------------|
| `Line`                    | Sort order; line 1 is the highest-priority customer                                  |
| `Customer No.`            | Customer number                                                                      |
| `Customer Name`           | Customer name                                                                        |
| `Cust. Type`              | Customer type dimension value                                                        |
| `Cust. Rank`              | Customer class dimension value; used to determine priority order                     |
| `Prod. Line`              | Product line dimension value from the sales line                                     |
| `Salesperson Code`        | Salesperson assigned to the order                                                    |
| `Document Type`           | `Order` or `Blanket Order`                                                           |
| `Document No.`            | The sales order or blanket order number                                              |
| `Document Line No.`       | Line number within the document                                                      |
| `Order Date`              | Date the order was created                                                           |
| `Shipment Date`           | Scheduled shipment date for this line                                                |
| `Quantity`                | Total quantity on the line                                                           |
| `Outstanding Qty.`        | Remaining quantity not yet shipped (orders) or blanket qty remaining (blanket orders)|
| `Substitute`              | Check to substitute this line; uncheck to cut. Auto-checked when substitute stock is available. |
| `Substitute Availability` | Available quantity of the substitute item on this shipment date, after accounting for all lines above it in the list |
| `Qty. to Adjust`          | Quantity to cut or substitute on this line; auto-filled but editable                 |
| `Qty. Substitute Item`    | Quantity of the substitute item that will be placed on the new line (may differ from `Qty. to Adjust` if the items use different units of measure) |

---

## Troubleshooting

### Error: "Please choose an item first"

**Cause:** You clicked **Get Lines** without entering an item number.

**Solution:** Enter a value in the `Item No.` field before clicking **Get Lines**.

---

### Error: "Quantity to Cut must have a value"

**Cause:** You clicked **Get Lines** without entering a quantity to cut.

**Solution:** Enter a value greater than zero in the `Quantity to Cut` field.

---

### Error: "Please enter the Qty. to Adjust first"

**Cause:** You checked the **Substitute** checkbox on a line that has a `Qty. to Adjust` of zero.

**Solution:** Enter a quantity in the `Qty. to Adjust` field on that line before checking **Substitute**.

---

### Error: "Qty. to Adjust may not exceed Outstanding Quantity"

**Cause:** You entered a `Qty. to Adjust` that is larger than the `Outstanding Qty.` on the line.

**Solution:** Reduce `Qty. to Adjust` to be equal to or less than the `Outstanding Qty.` shown on the line.

---

### Error: "Reason Code must have a value"

**Cause:** You clicked **Apply Changes** without a `Cut Reason Code`.

**Solution:** Select a reason code in the `Cut Reason Code` field before applying.

---

### Error: "Line No. X will create an item shortage of Y. Please correct this first."

**Cause:** The substitute item does not have enough available inventory to cover line X. The `Substitute Availability` on that line would go negative.

**Solution:** Either:

- Uncheck **Substitute** on that line to cut it instead.
- Choose a different substitute item with more available inventory.
- Reduce the `Qty. to Adjust` on that line.

---

### Error: "One or more Sales Lines have been changed after you started. Please restart your activity."

**Cause:** A sales line was modified by another user or process after you loaded the lines, and the data in the list no longer matches the database.

**Solution:** Click **Get Lines** again to reload the current data, then re-apply your changes.

---

### Error: "You can use this option only when you are not substituting an item."

**Cause:** You tried to check **Put back on Blanket Order** while a substitute item is entered.

**Solution:** The **Put back on Blanket Order** option is only available for pure cuts. Clear the `Substitute Item No.` field first.

---

## FAQ

**What is the difference between a cut and a substitute?**

A cut reduces the quantity on a customer's order — they will receive less (or nothing) for that item. A substitute replaces the item on their order with a different item of comparable availability.

**Why are some customers listed first?**

Lines are sorted by customer rank (highest class first) and then by order date (oldest first within the same rank). This means the highest-priority customers appear at the bottom of the list and their lines are assigned a `Qty. to Adjust` of zero last — protecting them from the cut as long as supply allows.

**What happens to the blanket order when I cut?**

By default, the cut is applied to both the sales order line and its linked blanket order line. If you want to keep the full blanket order quantity intact (for example, if the customer will receive their full amount later in the season), check the **Put back on Blanket Order** option before applying.

**Why does the substitute quantity differ from the cut quantity?**

If the original item and the substitute item have different units of measure, the system converts the base quantity and rounds up to the nearest whole sales unit of measure for the substitute. The `Qty. Substitute Item` column shows the resulting quantity.

**Can I partially substitute a line?**

Yes. Lower the `Qty. to Adjust` on the line to less than its `Outstanding Qty.` and check **Substitute**. The original line will be reduced by `Qty. to Adjust` and a new line will be added for the substitute item covering only that quantity.

**What if no lines load after clicking Get Lines?**

Either there are no open sales orders or blanket orders for that item, or all lines have zero outstanding quantity. Verify the item number and check the item's open orders directly.

**Can I undo the changes after applying?**

No. **Apply Changes** modifies the sales orders and blanket orders directly. If you need to reverse a cut, you must manually reopen the affected orders and restore the quantities.

---

## Related documents

- [[bin-reclassification-user-guide]]
- [[variant-reclassification-user-guide]]
- [[gtin-upc-management-user-guide]]

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/item-substitution-user-guide.pdf)
