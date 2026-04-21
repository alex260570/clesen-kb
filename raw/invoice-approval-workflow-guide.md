# Invoice approval workflow guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Accounts payable, finance managers, approvers
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Understanding the approval workflow](#understanding-the-approval-workflow)
- [Receiving invoices](#receiving-invoices)
- [Reviewing and approving invoices](#reviewing-and-approving-invoices)
- [Managing approval rules](#managing-approval-rules)
- [Delegation during absence](#delegation-during-absence)
- [Approval notifications](#approval-notifications)
- [Reporting on approvals](#reporting-on-approvals)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Invoice Approval Workflow ensures financial controls by requiring appropriate authorization before invoices are processed for payment. Invoices are routed to designated approvers based on amount, vendor, account code, and other criteria

### Purpose and benefits

- **Financial control:** Prevent unauthorized or erroneous payments
- **Segregation of duties:** Different approval levels for different amounts
- **Audit trail:** Complete history of who approved what and when
- **Exception handling:** Escalation for unusual or high-value invoices
- **Compliance:** Align with company policy and regulatory requirements

### Prerequisites

- Accounts payable staff or finance manager role
- Purchase orders or receipts created for corresponding purchases
- Knowledge of approval routing (who approves what)
- Budget visibility (may be required to approve per budget)

## Understanding the approval workflow

### Approval workflow overview

All invoices follow this standard workflow:

```
Invoice Received → 3-Way Match → Pending Approval → Approved → Ready for Payment
                       ↓                ↓
                   No match       Rejected (returned)
```

### Invoice matching (3-way match)

Before approval, the system validates invoice against:

1. **Purchase Order (PO):** Item descriptions, quantities, and pricing match
2. **Purchase Receipt:** Received quantities match ordered and invoiced quantities
3. **Invoice:** Dates, amounts, and terms are valid

If any of these don't match, the invoice is flagged for review.

### Approval routing

Invoices route to different approvers based on:

| Criteria | Approver |
|----------|----------|
| Amount ≤ $1,000 | Department Manager |
| Amount $1,001–$5,000 | Finance Manager |
| Amount $5,001–$50,000 | Director or VP |
| Amount > $50,000 | CFO approval required |
| Vendor change | Procurement approval |
| New vendor (first-time) | Finance + Procurement approval |
| Rush/expedited invoice | Department Manager + Finance |

The system automatically routes based on these rules.

## Receiving invoices

### Invoice entry methods

Invoices are received through multiple channels:

1. **Email:** PDF invoice emailed to invoicing team
2. **Portal:** Vendor uploaded to supplier portal
3. **EDI:** Electronic data interchange from supplier systems
4. **Paper:** Physical invoice received in mail
5. **System integration:** API integration from vendor systems

### Creating invoice records

For invoices received via email or paper:

1. Navigate to **Accounts Payable** > **Invoices** > **New Invoice**.
2. Enter header information:
   - `Invoice No.`: From vendor document
   - `Vendor No.`: Select the supplier
   - `Invoice Date`: Date on invoice
   - `Due Date`: Payment due date (may auto-calculate from terms)
   - `Currency Code`: Currency if non-USD (optional)
3. Enter or match to Purchase Order:
   - `Purchase Order No.`: If invoice is for a specific PO, enter it
   - System automatically populates line items from the PO
4. Verify line items match invoice:
   - `Item No.`, `Description`, `Quantity`, `Unit Price`
   - Add any manual lines if not on PO
5. Click **Save Invoice**.

### Automatic invoice matching

For invoices integrated via EDI or API:

1. System automatically matches to POs and receipts
2. If match is successful, invoice enters workflow automatically
3. If match fails, invoice flagged as **Exception** for manual review
4. Accounts payable staff must review and correct exceptions

### Flagging for approval

Once invoice is saved:

1. Click **Submit for Approval** or system may submit automatically
2. Invoice status changes to **Pending Approval**
3. Appropriate approvers receive notification

## Reviewing and approving invoices

### Accessing invoices to approve

1. Navigate to **Accounts Payable** > **Invoices to Approve** or **My Approvals**.
2. System displays invoices pending your approval, sorted by:
   - Date received (newest first) or
   - Amount (highest first)
3. Click on an invoice to review details.

### Reviewing an invoice before approval

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

### Approving an invoice

If invoice passes review:

1. Click **Approve**.
2. (Optional) Add approval comment:
   - "Approved as submitted"
   - "Approved per standing agreement"
   - "Pricing verified against contract"
3. Click **Confirm Approval**.
4. Invoice status changes to **Approved**, routing to payment processing.

An approval timestamp and your name are recorded in the audit trail.

### Rejecting an invoice

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

### Conditional approvals

For invoices with minor issues that don't prevent payment:

1. Click **Approve with Exception** (if available).
2. Document the exception:
   - What is different from normal
   - Why you're approving despite the difference
   - Any follow-up action needed
3. Click **Confirm**.

Invoice can proceed to payment while exception is tracked for later investigation.

## Managing approval rules

### Viewing approval rules

1. Navigate to **Finance** > **Approval Setup** > **Invoice Approval Rules** or **Administration** > **Approval Routing**.
2. System displays all active approval rules:
   - Amount thresholds
   - Department routing
   - Vendor-specific rules
   - Exception handling

### Creating custom approval rules

Finance managers can create custom rules:

1. Click **New Rule**.
2. Define rule parameters:
   - `Rule Name`: Description (e.g., "Marketing Dept High-Value")
   - `Criteria`:
     - Amount range (from/to)
     - Specific department or cost center
     - Vendor list or vendor category
     - Account code filter
   - `Approver(s)`: Who must approve
   - `Priority`: If multiple rules match, which takes precedence?
3. Click **Save Rule**.

Example custom rules:

- "Any invoice for Vendor XYZ over $500 requires Director approval"
- "Marketing Department expenses over $2,000 require CMO approval"
- "Equipment purchases over $5,000 require CFO approval plus two cost center managers"

### Multi-level approvals

For invoices requiring multiple approvers:

The system shows approval progression:

1. First approver (e.g., Department Manager) approves
2. Automatically routes to second approver (e.g., Finance Manager)
3. Second approver reviews and approves or rejects
4. Once all approvers sign off, invoice is **Fully Approved**

If any approver rejects, invoice returns for correction.

## Delegation during absence

### Setting up approval delegation

If you'll be away and need someone to approve invoices in your absence:

1. Navigate to **My Settings** > **Approval Delegation** or **Users** > **Your Profile** > **Delegation**.
2. Click **Create Delegation**.
3. Enter:
   - `Delegate To`: Select colleague who will approve on your behalf
   - `Effective Date`: When delegation starts
   - `End Date`: When delegation expires
   - `Approval Types`: Invoice approvals (or select which types)
   - `Amount Limit` (optional): Delegate only up to a certain amount
4. Click **Save**.

Your delegated approvers now receive invoices that would normally route to you.

### Revoking delegation

1. Navigate to **My Settings** > **Approval Delegation**.
2. Select the delegation to revoke.
3. Click **Delete** or **End Delegation**.

Once revoked, delegated approvers no longer receive invoices.

## Approval notifications

### Email notifications

Approvers receive email when:

1. **Invoice assigned to them:** "Invoice INV-12345 from ABC Vendor ($2,500) awaiting your approval"
2. **Approval reminder:** Sent if invoice not approved within 2 days
3. **Resubmitted after rejection:** "Previously rejected invoice INV-12345 has been resubmitted for approval"

### Notification preferences

To customize notification settings:

1. Navigate to **My Settings** > **Notification Preferences**.
2. Configure:
   - Receive email notifications (yes/no)
   - Frequency: Immediate, daily digest, or weekly summary
   - Thresholds: Only notify for invoices over a certain amount
3. Click **Save**.

### In-system notifications

Invoices also appear in the **My Approvals** dashboard showing:

- Number of pending approvals
- Highest priority invoices (based on amount or age)
- Overdue approvals (pending for >5 days)

## Reporting on approvals

### Approval status report

To track invoice approval status:

1. Navigate to **Reports** > **Accounts Payable** > **Invoice Approval Status**.
2. Enter parameters:
   - `Date Range`: Period to report on
   - `Status`: Pending, Approved, Rejected, all
   - `Approver`: Specific person (or all)
3. Report shows:
   - Number of invoices by status
   - Average approval time
   - Invoices pending over X days
   - Approval bottlenecks

### Approver performance metrics

To analyze approver efficiency:

1. Navigate to **Reports** > **Invoice Approval Performance**.
2. View by approver:
   - Total invoices approved
   - Average approval time
   - Rejection rate
   - High-value approval authority $
3. Use to identify training needs or workload imbalances

### Audit trail report

For compliance and audit purposes:

1. Navigate to **Reports** > **Invoice Approval Audit Trail**.
2. Report shows for each invoice:
   - Creation date and who created it
   - All approval actions (approved/rejected dates/times/person)
   - Comments added during approval
   - Final status and payment date
3. Export to Excel or PDF for audit documentation.

## Troubleshooting

### Issue: Invoice stuck in Pending Approval

**Problem:** Invoice has been pending approval for several days.

**Solutions:**
1. Check if approver is on vacation/out of office:
   - Contact the approver directly
   - If unavailable, request delegation to backup
2. Check for approval rule misclassification:
   - Verify the invoice was routed to the correct approver
   - May need to add exception handling if unique situation
3. Escalate to Finance Manager if approval delayed beyond acceptable timeframe

### Issue: Approval delegation not working

**Problem:** Invoices are still routing to the primary approver, not the delegate.

**Solutions:**
1. Verify delegation was saved successfully
2. Check delegation dates (is delegation active today?)
3. Check delegation amount limit isn't too restrictive
4. Clear browser cache and refresh
5. Contact IT support if issue persists

### Issue: Cannot approve or reject with reason for rejection entered

**Problem:** Button disabled or errors when trying to submit.

**Solutions:**
1. Verify all required fields are filled (approver may need to select specific reason code)
2. Try refreshing the page before submitting
3. Check if invoice is locked (may be edited by someone else)
4. Contact IT support for system errors

### Issue: Duplicate invoice not detected by system

**Problem:** A vendor invoice was received twice and both entries are in the system.

**Solutions:**
1. When reviewing second invoice, compare to first:
   - Same vendor, invoice number, amount, and date = duplicate
   - Mark as "Reject - Duplicate"
2. Ensure first invoice was approved (check status)
3. Add note to Accounts Payable team explaining it was duplicate
4. Check why system didn't flag automatically (may need vendor setup review)

## FAQ

**Q: How long do I have to approve an invoice?**
A: Typically 2-5 business days, depending on company policy. Check with Finance. Invoices pending >5 days trigger reminders.

**Q: Can I approve invoices remotely or on mobile?**
A: Yes. Most systems support mobile browsers. Check with IT support for best mobile app/access method.

**Q: What if I don't know who should approve an invoice?**
A: Check the approval rule or ask Finance Management. If it's an unusual situation, note that in the rejection/comment and route to Finance for guidance.

**Q: Can I undo an approval?**
A: Typically no. Once approved, the invoice moves to payment processing. If you approved in error, immediately notify Finance to halt payment if possible.

**Q: What does "3-Way Match" failure mean?**
A: It means something doesn't align between Purchase Order, Receipt, and Invoice. Common issues:
- Quantities ordered ≠ quantities received ≠ quantities invoiced
- Prices on PO ≠ prices invoiced
- Item descriptions don't match
Accounts payable should investigate before you approve.

**Q: How does the system know what amount requires director approval?**
A: Approval rules are configured by Finance. The system compares invoice amount to threshold rules and auto-routes accordingly. If you're unsure why an invoice came to you for approval, check the approval rule details.

**Q: What if a vendor asks why their invoice hasn't been paid?**
A: Invoices must be approved before payment. If pending, check approval status via **Invoice Approval Status** report or notify approver for status update.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/invoice-approval-workflow-guide.pdf)
