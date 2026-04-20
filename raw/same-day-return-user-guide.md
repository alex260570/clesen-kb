# Same-Day Return

> **Version:** 1.3
> **Last Updated:** 2026-03-10
> **Author:** Alexander Thiel
> **Audience:** Warehouse Staff

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to create and post a same-day return](#how-to-create-and-post-a-same-day-return)
- [What happens after you finish](#what-happens-after-you-finish)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)

---

## What this is

A Same-Day Return lets you receive items back into the warehouse on the same day they were shipped to a customer. When the driver returns with refused or rejected items, you process the return directly from the **Loading Ticket** — the system creates the return paperwork and receives the inventory in one flow.

**When the driver returns with items, you:**

1. Open the loading ticket for that truck/route
2. Click one button to start the return
3. Enter which items came back and why
4. The system creates a return order automatically
5. Photograph the returned items and attach the photos to the return order
6. Post the return to receive the items into inventory

---

## When to use it

Use Same-Day Return when:

- A customer refused items at delivery and the driver has returned with them
- Items were loaded on the truck but the customer did not want them and the driver is back
- Part of an order came back while the rest was delivered

> **Note:** This only works after the driver has returned to the warehouse with the items. The loading ticket must also have a posted shipment — you cannot use this on a ticket that was never shipped.

---

## What you need before you start

- The driver must be back at the warehouse with the returned items
- The **Loading Ticket** for the route the items came back on
- Know which items came back and how many
- Know the reason for the return (e.g. "Damaged", "Wrong Item", "Customer Refused")

> **Note:** Return reasons are set up by your manager. You can only select reasons that have been approved for same-day returns. If the reason you need is not in the list, contact your manager.

---

## How to create and post a same-day return

### Step 1: Open the loading ticket

1. Go to **Loading Tickets** from your menu.
2. Find the ticket for the truck/route the driver just returned on.
3. Open the ticket by clicking on it.

### Step 2: Click "Create Same-Day Return Order"

1. On the loading ticket, click the **Create Same-Day Return Order** button.
   - This button is in the **Process** section of the toolbar at the top.
2. A list of all items that were shipped on this ticket appears.

> **Note:** If no items appear, the ticket has not been shipped yet. A shipment must be posted before you can create a return.

### Step 3: Enter the return quantities and reasons

The **Shipped Items** screen opens. It shows every item that went out on this ticket.

For each item being returned:

1. In the `Qty. to Return` column, enter how many are coming back.
   - Leave it at **0** for items that are NOT being returned.
   - You cannot enter more than the original shipped quantity.
2. In the `Return Reason` column, select the reason from the dropdown.
   - A reason is **required** for every item you enter a quantity for.
   - You cannot proceed until all items with a return quantity have a reason.

When done, click **OK**.

> **Tip:** If you only have one item coming back, just fill in that one row and leave everything else at 0.

### Step 4: Review the return order

The system automatically creates a **Sales Return Order** and opens it for you to review.

Check that:

- The customer name is correct
- The items and quantities match what is physically coming back
- The return reason codes are correct

If everything looks right, proceed to Step 5.

### Step 5: Photograph the returned items

Before posting, take photos of the returned items and attach them to the return order. This gives the manager visual evidence when deciding whether to approve or decline the credit.

**Take the photos first, then upload:**

> ⚠️ **Known issue on mobile devices:** The camera function inside the SharePoint attachment extension does not work correctly on phones or tablets. You must take the photos with your device's own camera app first, then upload them from your photo library.

1. Use your device's **camera app** to photograph the returned items.
   - Take at least one photo per item being returned.
   - Capture any visible damage clearly.
2. On the **Sales Return Order**, open the **SharePoint** attachment panel.
   - This is in the **FactBox** panel on the right side of the screen, or accessible from the **Attachments** action.
3. Click **Upload** (or the upload icon) and select the photos from your device's photo library.
4. Confirm the photos are visible in the attachment panel before continuing.

### Step 6: Post the return (receive the items)

Now post the return order to receive the items into inventory.

1. On the **Sales Return Order**, click **Post** in the toolbar.
2. A dialog appears asking what to post — select **Receive**.
3. Click **OK**.

The items are now received into the quarantine location and the return is recorded in inventory.

> **Note:** You must post **Receive** (not Invoice). Invoicing is handled separately by the manager after they approve or decline the credit.

---

## What happens after you finish

Once you post the return:

1. **The items are received into quarantine** — the system records the inventory back in at the quarantine location, separated from regular stock.
2. **The return order goes to a manager for credit approval** — a manager will review the return and decide whether to issue a credit or decline it.
3. **If approved:** A credit memo is issued to the customer.
4. **If declined:** The order is closed at $0 — no credit is given to the customer.

You do not need to do anything else after posting the return.

---

## Field reference

These are the columns you see on the **Shipped Items** screen:

| Field              | What it means                                                            | Can you edit it? |
| ------------------ | ------------------------------------------------------------------------ | ---------------- |
| `No.`              | The item number                                                          | No               |
| `Description`      | The item name                                                            | No               |
| `Quantity`         | How many were shipped — the maximum you can return                       | No               |
| `Unit of Measure`  | The unit (e.g. Case, Each)                                               | No               |
| `Qty. to Return`   | How many you are returning — enter your number here                      | Yes              |
| `Return Reason`    | Why the item is being returned — select from the list, required if qty > 0 | Yes            |

---

## Troubleshooting

### The "Create Same-Day Return Order" button does nothing or no items appear

**Cause:** The loading ticket has not been shipped yet. No shipment has been posted for this ticket.

**Solution:** Check with your supervisor to confirm the shipment was posted. The button only works after the truck has left and a shipment document exists for the ticket.

### A return reason I need is not in the dropdown list

**Cause:** Only approved return reasons are available for same-day returns. The reason you need has not been enabled.

**Solution:** Contact your manager. They can add new reasons through the **Return Reasons** setup page.

### Error: "A return reason is required for item..."

**Cause:** You entered a return quantity for an item but did not select a return reason.

**Solution:** Go back and select a reason in the `Return Reason` column for every item that has a quantity entered. You cannot proceed until all items with a quantity have a reason.

### Error: "Return quantity cannot be greater than shipped quantity"

**Cause:** You entered a number higher than what was originally shipped.

**Solution:** Check the `Quantity` column for that item — that is the maximum you can return. Correct the `Qty. to Return` to be equal to or less than that number.

### The camera does not open when I try to attach a photo from the SharePoint panel

**Cause:** There is a known bug in the SharePoint attachment extension on mobile devices. The in-app camera button does not work on phones or tablets.

**Solution:** Do not use the camera button inside the SharePoint panel. Instead:
1. Exit to your device's camera app and take the photos there.
2. Return to the return order in Business Central.
3. Use the **Upload** option in the SharePoint attachment panel to select the photos from your photo library.

### The return order opened but has wrong items or quantities

**Cause:** The wrong quantities or items were entered on the selection screen.

**Solution:** Contact your supervisor. Do not try to manually edit the return order lines. A supervisor or manager can correct the return order before it is approved.

---

## Related documents

- [[shipping-worksheet-overview]]
- [[shipping-worksheet-process]]

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/same-day-return-user-guide.pdf)
