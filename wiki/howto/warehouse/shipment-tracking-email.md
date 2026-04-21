---
title: Shipment Tracking Email
type: howto
tags: [sales-orders, shipping, customer-communication, order-management]
created: 2026-04-21
updated: 2026-04-21
sources: [shipment-tracking-email-user-guide.md]
---

# Shipment Tracking Email

Notify customers automatically when their order ships with tracking information.

## What This Is

The shipment tracking email feature lets you notify customers by email when their order has shipped. When you enter a package tracking number on a sales order, Business Central automatically sends the email to the customer's shipping contact and BCCs the salesperson on the order.

**Workflow:**
1. Enter the `Package Tracking No.` on the sales order
2. Confirm the prompt to queue a tracking email
3. System automatically sends email to customer with carrier name, tracking link, and order number
4. Salesperson receives BCC copy for their records

---

## When to Use It

Use the shipment tracking email when:

- A package tracking number is available for a shipped sales order
- The customer should be notified of their shipment with carrier and tracking details
- You want the salesperson to have a BCC copy of the notification

**Note:** This feature only works when:
- Enabled in Clesen Setup
- A shipping contact job responsibility code has been configured
- Customer has at least one person contact with that job responsibility

If you do not see the confirmation prompt when entering a tracking number, contact IT to verify setup.

---

## Prerequisites

Before you can queue a tracking email:

1. **Sales order must have:** `Package Tracking No.` entered
2. **Customer must have:** At least one person contact with the configured shipping job responsibility
3. **Shipping agent must be configured:** So carrier name and tracking link appear in the email

**Note:** If the customer has no contacts with the shipping job responsibility, no email will be sent.

---

## How to Queue a Tracking Email

### Step 1: Open the Sales Order

1. Navigate to **Sales Orders** from your role center or search menu
2. Find and open the relevant sales order

### Step 2: Enter the Tracking Number

1. Locate the `Package Tracking No.` field (in the **Shipping and Billing** section)
2. Enter the package tracking number provided by the carrier
3. Press Tab or click another field to close the field

### Step 3: Respond to the Queue Prompt

When you close/save the sales order after entering a tracking number, a confirmation dialog appears:

> *Do you want to add this order to the Tracking E-Mail Queue?*

**Options:**
- **Yes** — Queue the tracking email. The `Add Tracking E-Mail to Queue` field is checked and the order is saved.
- **No** — Skip queueing. You can manually check the field later if needed.

**Note:** The prompt only appears if:
- A tracking number is present
- The order has not already been queued
- Once the email has been sent (status = `Sent`), the `Add Tracking E-Mail to Queue` field becomes read-only

### Step 4: Verify the Status

After the email is processed, check the `Tracking E-Mail Status` field on the order:

| Status | Meaning |
|--------|---------|
| `Sent` | Email was delivered successfully |
| `Error` | Email could not be sent (see troubleshooting) |
| (blank) | Not yet processed or not queued |

---

## What Happens After You Queue

Once the order is added to the queue:

1. **System finds customer's shipping contacts** — Looks for person contacts linked to the customer with the configured shipping job responsibility code

2. **Email sent to each qualifying contact** — Each email includes:
   - Order number (or customer PO number if available)
   - Carrier name
   - Tracking link (clickable)
   - Tracking number
   - Order details

3. **Salesperson receives BCC** — A copy goes to the salesperson's email for their records

4. **Status is updated** — `Tracking E-Mail Status` is set to:
   - `Sent` if at least one email was delivered
   - `Error` if none could be sent

**You don't need to do anything else** after queueing the email.

---

## Troubleshooting

### Issue: "Tracking Email Status" Shows Error

**Causes:**
- Customer has no contacts with the configured shipping job responsibility
- Customer contact email is invalid or missing
- Email system is not configured
- Shipping agent not configured for the carrier

**Resolution:**
1. Check customer's person contacts
2. Verify at least one contact has the shipping job responsibility
3. Verify contact email address is correct
4. Contact IT to verify email system configuration
5. Check shipping agent setup in Business Central

### Issue: Prompt Does Not Appear When Entering Tracking Number

**Causes:**
- Feature not enabled in Clesen Setup
- Shipping job responsibility not configured
- Order has already been queued
- No valid tracking number entered

**Resolution:**
1. Verify tracking number is entered and saved
2. Contact IT to check Clesen Setup
3. Contact IT to verify shipping job responsibility configuration
4. Check if order status already shows "Sent"

### Issue: Customer Did Not Receive Email

**Causes:**
- Customer contact email is incorrect
- Contact does not have the shipping job responsibility
- Email was filtered to spam
- Email system issue

**Resolution:**
1. Ask customer to check spam folder
2. Verify customer contact email address
3. Verify contact has correct job responsibility
4. Resend email or contact IT if system issue

### Issue: Wrong Contact Received Email

**Causes:**
- Multiple contacts assigned the shipping job responsibility
- Job responsibility assigned to wrong contact

**Resolution:**
1. Review customer's contacts
2. Verify only the intended contact has the shipping job responsibility
3. Update contact job responsibility if needed
4. Resend email with corrected contact

---

## Best Practices

✅ **DO:**
- Enter tracking number as soon as shipment is picked up
- Queue tracking email immediately when number is available
- Verify customer has shipping contact before sending
- Check email status to confirm delivery
- Keep tracking numbers accurate and complete

❌ **DON'T:**
- Enter fake or incomplete tracking numbers
- Forget to queue the email
- Assume customer received email if status shows "Sent"
- Queue email multiple times for same order
- Change tracking number after email is sent without notifying customer

---

## Email Content

The tracking email typically includes:

- **Subject:** Order shipment notification
- **Order Number:** Reference for customer
- **Customer PO:** If provided on order
- **Carrier Name:** Who is shipping
- **Tracking Number:** Full carrier tracking number
- **Tracking Link:** Direct link to carrier tracking page
- **Order Details:** Items shipped, quantities
- **Salesperson:** BCC'd for their records

---

## Related Pages

- [[sales-order-management]] — Sales order creation and workflow
- [[rapid-order-entry]] — Fast order entry tool
- [[same-day-return]] — Same-day return processing
