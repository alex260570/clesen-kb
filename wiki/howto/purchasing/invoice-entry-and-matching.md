---
title: Invoice Entry and Matching
type: howto
tags: [purchasing, invoices, accounts-payable, receiving]
created: 2026-04-21
updated: 2026-04-21
sources: [invoice-approval-workflow-guide.md]
---

# Invoice Entry and Matching

## Invoice entry methods

Invoices are received through multiple channels:

1. **Email:** PDF invoice emailed to invoicing team
2. **Portal:** Vendor uploaded to supplier portal
3. **EDI:** Electronic data interchange from supplier systems
4. **Paper:** Physical invoice received in mail
5. **System integration:** API integration from vendor systems

## Creating invoice records

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

## Automatic invoice matching

For invoices integrated via EDI or API:

1. System automatically matches to POs and receipts
2. If match is successful, invoice enters workflow automatically
3. If match fails, invoice flagged as **Exception** for manual review
4. Accounts payable staff must review and correct exceptions

## Flagging for approval

Once invoice is saved:

1. Click **Submit for Approval** or system may submit automatically
2. Invoice status changes to **Pending Approval**
3. Appropriate approvers receive notification

## 3-Way Match validation

Before approval, the system validates invoice against:

1. **Purchase Order (PO):** Item descriptions, quantities, and pricing match
2. **Purchase Receipt:** Received quantities match ordered and invoiced quantities
3. **Invoice:** Dates, amounts, and terms are valid

If any of these don't match, the invoice is flagged for review. Common issues:
- Quantities ordered ≠ quantities received ≠ quantities invoiced
- Prices on PO ≠ prices invoiced
- Item descriptions don't match

See [[invoice-approval-process]] for handling matched vs. unmatched invoices.