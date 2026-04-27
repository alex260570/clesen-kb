---
title: Sales Return Process
type: howto
tags: [sales, returns, same-day-returns, previous-day-returns, business-central, approval-workflow]
created: 2026-04-27
updated: 2026-04-27
sources: [sales-return-user-guide.md]
---

# Sales Return Process

Complete guide to managing customer returns in Business Central. The Sales Return system handles two distinct types of returns with different workflows: same-day returns during pickup and previous-day returns after delivery.

---

## Overview

| Aspect | Same-Day Return | Previous-Day Return |
|--------|-----------------|-------------------|
| **Timing** | Customer is physically at loading dock | Items returned after delivery |
| **Processing** | Immediate, during pickup | Through approval workflow |
| **Inventory** | Pre-approved reason codes only | All reason codes available |
| **Location** | Moved to quarantine | Specified by receiver |
| **Approval** | Auto-routed by amount | Requires approval workflow |

---

## Key Concepts

**Return Reason Code** — Required code explaining why items are being returned. Reason codes are configured by administrators; only codes marked "Eligible for Same-Day Return" appear in the same-day return dialog.

**Inventory Status** — Determines the fate of returned items:
- **Product Return** — Items will go back into sellable inventory after inspection
- **On-Site Disposal** — Items are damaged/unusable; system auto-creates negative inventory adjustment

**Quarantine Location** — Temporary holding location for same-day returns pending inspection (configured in location setup).

**Approval Workflow** — Previous-day returns are automatically routed to approvers based on salesperson credit limits and return amount.

---

## Same-Day Returns

Use when a customer is **currently at the loading dock** picking up their order and wants to return items **before leaving**.

### Prerequisites

- Posted sales shipment must exist (customer order was processed)
- Loading ticket must be created and active
- Return reason codes must be configured with "Eligible for Same-Day Return" checked
- Quarantine location must be configured in location setup

### Process (6 Steps)

#### Step 1: Access the loading ticket
1. Open the **CLE Loading Ticket** page for the customer's current pickup
2. Verify customer and shipment details are correct
3. Confirm the loading ticket shows all shipments being loaded

#### Step 2: Create the return order
1. Click **Actions → Functions → Create Same-Day Return Order**
2. A dialog opens showing all inventory items from the shipments on this loading ticket:
   - Item No. and Description
   - Quantity shipped
   - Quantity already returned (if any)
   - Available quantity to return

3. For each item the customer wants to return:
   - Enter quantity in **Qty. To Return** field
   - **Select a Return Reason Code** from dropdown (required; only eligible codes appear)

4. Click **OK** to create the return order

> **Important:** Only return reasons marked "Eligible for Same-Day Return" appear in the list. If the reason you need isn't available, contact your supervisor.

**Example:**

| Item No. | Description | Shipped | Already Returned | Qty. to Return | Return Reason Code |
|----------|-------------|---------|------------------|----------------|--------------------|
| 1000 | Red Roses - 12 Stem | 100 | 0 | 25 | DAMAGED-TRANSIT |
| 2000 | Blue Orchids - 8" Pot | 50 | 0 | 10 | QUALITY-ISSUE |

#### Step 3: Verify the return order
1. System automatically creates a **Sales Return Order** with:
   - Status: "Same-Day Return"
   - Items moved to your **quarantine location**
   - Return-from address populated from original shipment
   - Customer information pre-filled

2. Review the return order to verify:
   - Quantities are correct
   - Return reason codes are appropriate
   - Location shows quarantine

3. Inform the customer their return has been processed

#### Step 4: Receive the items
1. Customer leaves items at loading dock
2. Open the return order: **Sales → Sales Return Orders**
3. Find the return order (filter by customer or date)
4. Click **Posting → Post**
5. Select **Receive** option
6. Click **OK**

Items are now in quarantine pending inspection.

#### Step 5: Approval and invoicing
After receiving, the return automatically routes to an approver based on dollar amount:
- **If approved:** Credit memo is issued after final inspection
- **If declined:** System creates a zero-dollar invoice (no credit issued)

> **Note:** Declined same-day returns still post with $0 amounts to close the transaction. Customer is notified they won't receive credit.

#### Step 6: Customer notification
Inform customer of approval or decline status. If declined, explain that no credit will be issued.

---

## Previous-Day Returns

Use when a customer calls or emails **after delivery** to report issues or request a return.

### Prerequisites

- Original sales order or posted shipment number
- Customer authorization or documentation (email, phone call notes)
- Return reason codes configured in the system
- Appropriate user permissions for creating return orders

### Process (8 Steps)

#### Step 1: Create a return order
1. Go to **Sales → Sales Return Orders**
2. Click **+New** to create a new return order
3. Enter the **Sell-to Customer No.**
4. The system fills in customer details automatically

#### Step 2: Add items to return

**Option A: Copy from posted shipment (recommended)**

1. Click **Actions → Functions → Get Posted Document Lines to Reverse**
2. Select **Document Type:** Posted Shipment
3. Select lines to be returned.
4. Click **OK**

The system copies the shipment lines and automatically populates the **Return-from Address** from the original ship-to location.

#### Step 3: Set return information

For **each line**, you must enter:

1. **Return Reason Code** (required):
   - Click the dropdown in the **Return Reason Code** field
   - Select the appropriate reason
   - All return reason codes are available (not filtered like same-day)

2. **Location Code**:
   - Enter the location where items will be received
   - Typically your main warehouse or quarantine location

**Example:**

| Item No. | Description | Quantity | Unit Price | Return Reason Code | Location |
|----------|-------------|----------|------------|-------------------|----------|
| 1000 | Red Roses - 12 Stem | 50 | $2.50 | CUSTOMER-DAMAGE | MAIN |
| 2000 | Blue Orchids - 8" Pot | 20 | $8.00 | WRONG-ITEM | MAIN |

#### Step 4: Set inventory status

On the return order **header** (top section):

1. Click in the **CLE Inventory Status** field
2. Choose:
   - **Product Return** — Items will go back into inventory for resale
   - **On-Site Disposal** — Items are damaged and will be disposed/destroyed

> **Important:** If you select "On-Site Disposal", the system will automatically create a journal entry to remove the items from inventory after posting.

#### Step 5: Request approval

1. Review the return order for accuracy
2. Click **Actions → Functions → Request Approval**
3. The system calculates if approval is needed:
   - **Within your limit:** Status becomes "Ready to Approve" (you can self-approve)
   - **Over your limit:** Status becomes "Approval Required" (manager approval needed)

4. A notification is sent to the appropriate approver

#### Step 6: Wait for approval

- Check the **CLE Sales Approval Status** field to see current status
- **Approved Inv. Posting awaiting** — You can proceed to receive items
- **Rejected** — Contact the approver for explanation

#### Step 7: Post the return receipt

Once approved:

1. Open the return order
2. Click **Posting → Post**
3. Select **Receive** option
4. Click **OK**

Items are received into inventory (or marked for disposal if On-Site Disposal was selected).

#### Step 8: Invoice the credit

After items are inspected and approved for credit:

1. Open the same return order
2. Click **Posting → Post**
3. Select **Invoice** option
4. Click **OK**

A **Sales Credit Memo** is created and posted to the customer's account.

---

## Approval Workflow

### How Approval Works

The system determines approval requirements based on:
- Your salesperson code and associated credit limit
- Total return amount in local currency
- Return type (same-day vs previous-day)

**Approval limits are set per salesperson:**

| Limit | Approval Behavior |
|-------|-------------------|
| **Unlimited** (-1) | Can approve any amount; status goes directly to "Ready to Approve" |
| **$0 - $X** | Can self-approve up to $X; amounts over $X require manager approval |

### Approval Statuses

| Status | Meaning | What You Can Do |
|--------|---------|----------------|
| **Open** | Not yet submitted | Continue editing |
| **Ready to Approve** | Within your limit | Self-approve or request approval |
| **Approval Required** | Over your limit | Must wait for manager approval |
| **Approval Requested** | Sent to approver | Wait for decision |
| **Approved Inv. Posting awaiting** | Approved; can receive items | Post receipt |
| **Released for Invoicing** | Fully approved and received | Post invoice |
| **Same-Day Return** | Created from loading ticket | Special same-day processing |
| **Rejected** | Declined by approver | Cannot proceed |
| **Rejected - Post Zero $ Invoice** | Same-day declined | Posts with $0 amount |

### Processing Approvals (For Approvers)

If you are an approver:

1. You'll receive notifications of pending returns
2. Go to **Sales → Approval Tasks** (or the page configured in your company)
3. Open the return order
4. Review:
   - Return reason codes
   - Item quantities and amounts
   - Customer history
5. Click **Actions → Functions → Process Approval**
6. Select:
   - **Approve** — Return proceeds to receiving
   - **Decline** — Return is rejected (or zero-dollar posted for same-day)

> **Note:** For same-day returns, declining sets all prices to $0 and allows posting without issuing credit. For previous-day returns, declining simply rejects the return.

---

## Field Reference

### Header Fields

| Field | Description | Required | Notes |
|-------|-------------|----------|-------|
| **No.** | Return order number | Auto-generated | From number series |
| **Sell-to Customer No.** | Customer returning items | Yes | Lookup from customer list |
| **Posting Date** | Date of return transaction | Yes | Defaults to work date |
| **CLE Inventory Status** | Fate of returned items | Yes | Returned or On-Site Disposal |
| **CLE Sales Approval Status** | Current approval state | Auto-calculated | Based on amount and limits |
| **CLE Same-Day Return** | Flag for same-day returns | Auto-set | System-managed |
| **CLE Return-from Code** | Original ship-to code | Auto-filled | When copying from shipment |
| **CLE Return-from Name** | Original ship-to name | Auto-filled | Shows where items shipped to |
| **CLE Return-from Address** | Original delivery address | Auto-filled | Complete address fields populated |

### Line Fields

| Field | Description | Required | Notes |
|-------|-------------|----------|-------|
| **Type** | Line type | Yes | Usually "Item" |
| **No.** | Item number | Yes | Lookup from item list |
| **Description** | Item description | Auto-filled | From item master |
| **Quantity** | Quantity to return | Yes | Must be ≤ originally shipped |
| **Unit Price** | Price per unit | Auto-filled | From original sale |
| **Return Reason Code** | Why item is being returned | Yes | Required before posting |
| **Location Code** | Where item will be received | Yes | Warehouse/quarantine location |
| **Appl.-from Item Entry** | Original shipment entry | Auto-filled | System-managed |

### Return Reason Codes

Administrators configure return reason codes with descriptions:

**Common codes:**
- **DAMAGED-TRANSIT** — Damaged during shipping
- **QUALITY-ISSUE** — Quality problem discovered by customer
- **WRONG-ITEM** — Incorrect item shipped
- **CUSTOMER-DAMAGE** — Damaged by customer
- **NO-LONGER-NEEDED** — Customer no longer needs item
- **LATE-DELIVERY** — Arrived too late to be useful

> **Note:** Only codes marked "Eligible for Same-Day Return" appear when creating same-day returns from loading tickets.

---

## Troubleshooting

### Cannot create same-day return from loading ticket

**Symptoms:**
- "Create Same-Day Return Order" button is grayed out
- No shipments appear in the loading ticket

**Solutions:**
1. Verify the loading ticket has posted shipments
2. Check that shipments contain **inventory items** (not services)
3. Ensure you have permission to create return orders
4. Verify the loading ticket status is correct

### Return reason code dropdown is empty

**Symptoms:**
- When trying to select return reason code, no options appear
- Error: "No return reasons available"

**For same-day returns:**
- Only codes marked "Eligible for Same-Day Return" appear
- Contact your supervisor to add eligible codes in setup

**For previous-day returns:**
- All codes should appear
- If none appear, contact IT to configure return reason codes

### Cannot post return — "Status must be Approved"

**Symptoms:**
- Posting button is grayed out or shows error
- Status shows "Approval Required" or "Approval Requested"

**Solutions:**
1. Check **CLE Sales Approval Status** field
2. If "Approval Required" — wait for manager approval
3. If "Ready to Approve" and you're the salesperson — request approval first
4. If "Open" — click **Request Approval** action

### Same-day return went to wrong location

**Symptoms:**
- Items received at main warehouse instead of quarantine
- Cannot find returned items for inspection

**Solutions:**
1. Check your **Location Setup** for quarantine location configuration
2. The location may not have a quarantine location defined
3. Contact IT to configure: Location → **CLE Quarantine Location** field
4. For already-posted returns, use transfer orders to move items

### Approval limit exceeded but I need to process urgently

**Symptoms:**
- Status: "Approval Required"
- Return amount exceeds your limit
- Manager is unavailable

**Solutions:**
1. Contact another approver with higher limit
2. Check User Setup to see who has "CLE Cr.Request Approver" flag
3. If truly urgent, have customer wait while you reach manager
4. **Do not** split return into multiple orders to bypass limits

### Customer wants credit but approval was declined

**Symptoms:**
- Status: "Rejected" or "Rejected - Post Zero $ Invoice"
- Customer is unhappy

**Solutions:**
1. Review the return with the approver who declined
2. Check if return reason code is appropriate
3. For quality issues, have QC inspect items first
4. If warranted, create a new return order with better documentation
5. **For same-day returns:** Declined returns still post but with $0 — customer gets no credit

### Cannot find the original shipment to copy from

**Symptoms:**
- Copy Document function shows no results
- Customer has receipt but you can't find the shipment

**Solutions:**
1. Ask customer for original invoice or packing slip number
2. Search Posted Sales Shipments by:
   - Customer number
   - Date range
   - External Document No. (customer PO)
3. If still not found, check if order was shipped from a different location
4. As last resort, manually enter items using the invoice copy

---

## Frequently Asked Questions

**Do I have to use return reason codes?**

Yes. Return reason codes are required on all return lines before you can post the receipt. They help track return patterns and identify quality issues.

**What's the difference between "Returned" and "On-Site Disposal" inventory status?**

- **Returned (Product Return):** Items go back into sellable inventory after inspection
- **On-Site Disposal:** Items are damaged/unusable and will be destroyed; system auto-creates negative inventory adjustment

**Can I process a same-day return after the customer has left?**

No. Once the customer leaves, it becomes a previous-day return. Same-day returns are only for customers physically on-site during pickup. The loading ticket must still be active.

**How do I know if I can self-approve a return?**

Check your **User Setup** for your credit limit. Returns under your limit show status "Ready to Approve" and you can approve them yourself. Returns over your limit require manager approval.

**Can I edit a return order after it's approved?**

**Before receipt posting:** Minor edits may be possible, but re-requesting approval is safer

**After receipt posting:** No — the receipt is permanent. You would need to:
1. Finish posting the credit memo
2. Create a new return order if additional items need to come back

**What happens if I select the wrong return reason code?**

**Before posting receipt:**
- Simply edit the line and change the return reason code

**After posting receipt:**
- The return reason is permanent on the posted document
- It cannot be changed, so always double-check before posting

**Can I return items from multiple shipments in one return order?**

**Yes**, but:
- Use Copy Document multiple times, or
- Manually add lines from different shipments
- Ensure **Appl.-from Item Entry** is correct for accurate inventory tracking

**Why did my same-day return get declined?**

Common reasons:
- Return amount exceeded available approval
- Items not in returnable condition
- Incorrect return reason code
- Customer history of excessive returns

**For same-day declined returns:** Items still post with $0 value to close the transaction. Customer receives no credit.

**How long does approval take?**

- **Same-day returns:** Usually within 1-2 hours if approver is available
- **Previous-day returns:** Typically same business day, up to 24 hours
- **Urgent returns:** Call the approver directly

**Can I see a customer's return history?**

Yes:
1. Open Customer Card
2. Navigate → **Return Orders** to see open returns
3. Navigate → **Posted Return Receipts** to see history
4. Navigate → **Posted Credit Memos** to see issued credits

---

## Related Pages

- [[same-day-return]] — Quick reference for same-day return process
- [[sales-return-it-troubleshooting]] — Technical guide and IT troubleshooting
- [[sales]] — Sales orders and order management overview
