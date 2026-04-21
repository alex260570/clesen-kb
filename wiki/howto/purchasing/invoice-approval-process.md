---
title: Invoice Approval Process
type: howto
tags: [purchasing, invoices, approval, accounts-payable]
created: 2026-04-21
updated: 2026-04-21
sources: [invoice-approval-workflow-guide.md]
---

# Invoice Approval Process

## Accessing invoices to approve

1. Navigate to **Accounts Payable** > **Invoices to Approve** or **My Approvals**.
2. System displays invoices pending your approval, sorted by:
   - Date received (newest first), or
   - Amount (highest first)
3. Click on an invoice to review details.

## Reviewing an invoice before approval

1. Open the invoice record.
2. Review the following sections:

   **Header Information:**
   - Vendor name and ID correct?
   - Invoice date reasonable (not too old)?
   - Due date appropriate?
   - Currency correct?

   **3-Way Match Status:**
   - ✅ PO Match: Quantities and prices align with PO
   - ✅ Receipt Match: Items received match invoiced quantities
   - ✅ Invoice Match: No duplicate invoices, valid amounts
   - Note any mismatches that require investigation

   **Line Items:**
   - Description matches what was ordered
   - Quantities received (check against packing slip)
   - Unit prices align with PO or pricing agreements
   - Calculate total: Sum should match invoice total

   **Supporting Documentation:**
   - Packing slip attached (if required)
   - Quality certification (if required)
   - Any special approvals or comments

3. Check for red flags:
   - Invoice amount significantly different from PO
   - Duplicate invoice (check by vendor + amount + date)
   - Unusual payment terms
   - Pricing deviates from established agreement

## Approving an invoice

If invoice passes review:

1. Click **Approve**.
2. (Optional) Add approval comment:
   - "Approved as submitted"
   - "Approved per standing agreement"
   - "Pricing verified against contract"
3. Click **Confirm Approval**.
4. Invoice status changes to **Approved**, routing to payment processing.

An approval timestamp and your name are recorded in the [[audit-trail]].

## Rejecting an invoice

If invoice has issues:

1. Click **Reject**.
2. Enter reason for rejection:
   - "PO amount mismatch—actual receipt was 40 units, not 50"
   - "Unit price exceeds agreement by $2/unit"
   - "Duplicate invoice—already paid invoice #INV-5678 on 3/15"
   - "Missing supporting documentation"
3. (Optional) Recommend corrective action:
   - "Contact vendor to confirm correct price"
   - "Check warehouse receipt to verify actual quantity received"
4. Click **Confirm Rejection**.

Invoice returns to **Pending** status with rejection comment visible. Accounts payable staff must address issue and resubmit.

## Conditional approvals

For invoices with minor issues that don't prevent payment:

1. Click **Approve with Exception** (if available).
2. Document the exception:
   - What is different from normal
   - Why you're approving despite the difference
   - Any follow-up action needed
3. Click **Confirm**.

Invoice can proceed to payment while exception is tracked for later investigation.

## Handling stuck invoices

If an invoice has been pending approval for several days:

1. Check if approver is on vacation/out of office:
   - Contact the approver directly
   - If unavailable, request [[approval-delegation]] to backup
2. Check for approval rule misclassification:
   - Verify the invoice was routed to the correct approver
   - May need to add exception handling if unique situation
3. Escalate to Finance Manager if approval delayed beyond acceptable timeframe