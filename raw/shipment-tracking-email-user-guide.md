# Shipment tracking email

> **Version:** 1.0
> **Last Updated:** 2026-03-11
> **Author:** Alexander Thiel
> **Audience:** Inside Sales Staff
> **Status:** Published

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to queue a tracking email](#how-to-queue-a-tracking-email)
- [What happens after you finish](#what-happens-after-you-finish)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [SOP document](#sop-document)

---

## What this is

The shipment tracking email feature lets you notify customers by email when their order has shipped. When you enter a package tracking number on a sales order, Business Central asks if you want to queue a tracking email. Once queued, the system automatically sends the email to the customer's designated shipping contact and BCCs the salesperson on the order.

**When a package tracking number is entered on a sales order, you:**

1. Enter the `Package Tracking No.` on the sales order.
2. Confirm the prompt to add the order to the tracking email queue.
3. The system sends the email automatically — including the carrier name, tracking link, and order number.
4. The salesperson receives a BCC copy for their records.

---

## When to use it

Use the shipment tracking email when:

- A package tracking number is available for a shipped sales order.
- The customer should be notified of their shipment with carrier and tracking details.
- You want the salesperson to have a BCC copy of the notification.

> **Note:** This feature only works when it has been enabled in Clesen Setup and a shipping contact job responsibility code has been configured. If you do not see the confirmation prompt when entering a tracking number, contact IT or your manager to verify setup.

---

## What you need before you start

- The sales order must have a `Package Tracking No.` entered.
- The customer must have at least one person contact with the configured shipping job responsibility (set up in Clesen Setup).
- The shipping agent must be configured in Business Central (for the carrier name and tracking link to appear in the email).

> **Note:** If the customer has no contacts with the shipping job responsibility, no email will be sent. 

---

## How to queue a tracking email

### Step 1: Open the sales order

1. Navigate to **Sales Orders** from your role center or the search menu.
2. Find and open the relevant sales order.

### Step 2: Enter the tracking number

1. Locate the `Package Tracking No.` field on the order (in the **Shipping and Billing** section).
2. Enter the package tracking number provided by the carrier.
3. Close or leave the field.

### Step 3: Respond to the queue prompt

When you close the sales order after entering a tracking number, a confirmation dialog appears:

> *Do you want to add this order to the Tracking E-Mail Queue?*

- Click **Yes** to queue the tracking email. The `Add Tracking E-Mail to Queue` field is set to checked and the order is saved.
- Click **No** to skip. You can manually check the `Add Tracking E-Mail to Queue` field later if needed.

> **Note:** The prompt only appears if a tracking number is present and the order has not already been queued. Once the email has been sent (status = `Sent`), the `Add Tracking E-Mail to Queue` field becomes read-only.

### Step 4: Verify the status

After the email is processed, check the `Tracking E-Mail Status` field on the order:

- `Sent` — the email was delivered successfully.
- `Error` — the email could not be sent. See [Troubleshooting](#troubleshooting) below.

---

## What happens after you finish

Once the order is added to the queue:

1. **The system finds the customer's shipping contacts** — it looks for person contacts linked to the customer who have the configured shipping job responsibility code.
2. **An email is sent to each qualifying contact** — the email includes the order number (or customer PO number if available), the carrier name, a tracking link, and the tracking number.
3. **The salesperson receives a BCC** — a copy goes to the salesperson's email address for their records.
4. **The status is updated** — `Tracking E-Mail Status` is set to `Sent` if at least one email was delivered, or `Error` if none could be sent.

You do not need to do anything else after queueing the email.

---

## Field reference

These are the fields on the sales order related to tracking emails:

| Field                          | What it means                                                                             | Editable?                          |
| ------------------------------ | ----------------------------------------------------------------------------------------- | ---------------------------------- |
| `Package Tracking No.`         | The carrier's tracking number for the shipment                                            | Yes                                |
| `Add Tracking E-Mail to Queue` | When checked, the system will send a tracking email to the customer's shipping contacts   | Yes (read-only after email is sent) |
| `Tracking E-Mail Status`       | Shows whether the tracking email was sent successfully (`Sent`) or failed (`Error`)       | No — set automatically             |

---

## Troubleshooting

### The confirmation prompt did not appear when I entered the tracking number

**Cause:** The prompt only appears when you close the sales order. It will not show if the order was already queued, or if the feature is not enabled in Clesen Setup.

**Solution:** Manually check the `Add Tracking E-Mail to Queue` checkbox on the order. If the field is not visible, the feature may not be enabled — contact IT or your manager.

### `Tracking E-Mail Status` shows `Error`

**Cause:** Either no customer contacts had the required shipping job responsibility, or the email could not be delivered (e.g. invalid email address or email server issue).

**Solution:**

1. Check that the customer has at least one person contact with the shipping job responsibility code. If not, ask your manager to add it.
2. Verify the contact's email address is correct.
3. If contacts and email are correct, check the email log in Business Central (**Email Log Entries**) for the specific error, or contact IT.

### The customer contact did not receive the email but status shows `Sent`

**Cause:** The email was delivered from Business Central's perspective, but may have been filtered as spam or sent to the wrong address.

**Solution:** Verify the contact's email address on the customer contact record. Ask the customer to check their spam folder. If the address is wrong, correct it and uncheck `Add Tracking E-Mail to Queue` to re-queue the email (the field becomes editable again after unchecking).

### The tracking link in the email is not working

**Cause:** The shipping agent's Internet Address is not configured correctly in Business Central, or the tracking number was entered incorrectly.

**Solution:** Contact IT to verify the shipping agent setup. Confirm the tracking number is correct by checking the carrier's website directly.

### The `Add Tracking E-Mail to Queue` field is read-only

**Cause:** The email has already been sent (status is `Sent`). The field locks to prevent duplicate sends.

**Solution:** If you need to resend, contact IT — the status will need to be reset manually.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/shipment-tracking-email-user-guide.pdf)
