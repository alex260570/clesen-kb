---
title: Invoice Approval — Troubleshooting
type: howto
tags: [purchasing, invoices, approval, it, troubleshooting]
created: 2026-04-21
updated: 2026-04-21
sources: [invoice-approval-workflow-guide.md]
---

# Invoice Approval — Troubleshooting

## Invoice stuck in Pending Approval

**Problem:** Invoice has been pending approval for several days.

**Solutions:**

1. Check if approver is on vacation/out of office:
   - Contact the approver directly
   - If unavailable, request [[approval-delegation]] to backup
2. Check for approval rule misclassification:
   - Verify the invoice was routed to the correct approver
   - May need to add exception handling if unique situation
3. Escalate to Finance Manager if approval delayed beyond acceptable timeframe

## Approval delegation not working

**Problem:** Invoices are still routing to the primary approver, not the delegate.

**Solutions:**

1. Verify delegation was saved successfully
2. Check delegation dates (is delegation active today?)
3. Check delegation amount limit isn't too restrictive
4. Clear browser cache and refresh
5. Contact IT support if issue persists

## Cannot approve or reject invoice

**Problem:** Approve/Reject button disabled or errors when trying to submit with rejection reason.

**Solutions:**

1. Verify all required fields are filled (approver may need to select specific reason code)
2. Try refreshing the page before submitting
3. Check if invoice is locked (may be edited by someone else)
4. Contact IT support for system errors

## Duplicate invoice not detected

**Problem:** A vendor invoice was received twice and both entries are in the system.

**Solutions:**

1. When reviewing second invoice, compare to first:
   - Same vendor, invoice number, amount, and date = duplicate
   - Mark as "Reject - Duplicate"
2. Ensure first invoice was approved (check status)
3. Add note to Accounts Payable team explaining it was duplicate
4. Check why system didn't flag automatically (may need vendor setup review)

## Mobile approval access

**Question:** Can I approve invoices remotely or on mobile?

**Answer:** Yes. Most systems support mobile browsers. Check with IT support for best mobile app/access method.