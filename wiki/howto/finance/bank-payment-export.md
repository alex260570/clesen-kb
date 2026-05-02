---
title: Bank Payment Export
type: howto
tags: [purchasing, payments, finance, bank-export, ach-check, payment-processing]
created: 2026-04-21
updated: 2026-04-21
sources: [bank-payment-export-user-guide.md]
---

# Bank Payment Export

How to export vendor payments from the Payment Journal directly to the bank using ACH (Electronic Payment) or computer check processing.

---

## What This Is

The bank payment export process lets you send vendor payments directly to the bank from the **Payment Journal** in Business Central. Two payment types are supported:

- **ACH (Electronic Payment)** — direct bank transfers to vendor accounts
- **Check (Computer Check)** — paper checks that the bank prints and mails

The export produces a `Paymentfile.csv` that is uploaded to the bank portal. Once the bank confirms receipt, you complete the process in Business Central by confirming transmission.

---

## When to Use It

Use this process when you are ready to pay vendors from a completed payment journal batch. This is typically done as part of the weekly or bi-weekly payment run.

---

## Prerequisites

Before exporting, make sure the following are set up:

**Company bank account** (the account you are paying from):

- `Bank Account No.` is filled in
- `Transit No.` is filled in (ABA routing number)
- `Bank Branch No.` is filled in (routing number)

**Vendor bank account** (for ACH payments only):

- `Bank Branch No.` is filled in (vendor's routing number)
- `Bank Account No.` is filled in (vendor's account number)

**Each journal line must have:**

- `Document Date` — used as the payment date by the bank
- `Document No.` — the check or ACH reference number
- `Amount` — must not be zero
- `Bank Payment Type` — either `Computer Check` or `Electronic Payment`
- `Account Type` — must be `Vendor`
- `Account No.` — the vendor number
- `Bal. Account Type` — must be `Bank Account`
- `Bal. Account No.` — the company bank account to pay from
- `Recipient Bank Account` — required for Electronic Payment (ACH) lines
- The payment must be applied to one or more invoices (`Applies-to Doc. No.` or `Applies-to ID`)

---

## How to Export Payments

### Step 1: Open the Payment Journal

1. Search for **Payment Journal** in the Business Central search bar
2. Select the correct **Batch Name** for your payment run

### Step 2: Review the Journal Lines

Verify that all lines are correct before exporting:

- Confirm the `Document Date` matches the intended payment date
- Confirm each line is applied to the correct invoice(s)
- Confirm `Bank Payment Type` is set correctly (`Computer Check` or `Electronic Payment`)

### Step 3: Export the Payment File

1. Click **Export Bank File** in the action bar
2. The system validates all journal lines automatically
3. If any line has a problem, you will see: *"Export failed. Check the error log for further details."*
   - See [Troubleshooting](#troubleshooting) for solutions
4. If all lines pass validation, your browser automatically downloads `Paymentfile.csv`

### Step 4: Upload the File to the Bank Portal

1. Log in to the bank's online portal
2. Navigate to the payment file upload section
3. Upload `Paymentfile.csv`
4. Confirm and submit the payment batch in the portal
5. Wait for the bank to confirm receipt

> **Note:** Do not close the Payment Journal or delete journal lines until you have confirmed transmission in Step 5.

### Step 5: Confirm Transmission

Once the bank has confirmed they received the file:

1. Open the **Payment Journal** and select the same batch
2. Click **Confirm Transmission** in the action bar
3. Confirm the prompt: *"Are you sure you want to confirm the transmission of all payments in this journal batch?"*
4. Click **Yes**

Business Central will:

- Mark all payment lines as `Check Exported` and `Check Transmitted`
- For **Computer Check** lines: create a check ledger entry using the `Document No.` as the check number
- For **Electronic Payment** lines: mark the line as transmitted (no check ledger entry)

> **Warning:** Only confirm transmission after the bank has actually received and accepted the file. This action cannot be undone from the journal — reversing payments after confirmation requires voiding entries.

---

## Field Reference

### Journal Line Fields

| Field | Description | Required |
|-------|-------------|----------|
| `Document Date` | The payment date sent to the bank | Yes |
| `Posting Date` | The date the entry will post in BC (ACH only) | Yes (ACH) |
| `Document No.` | Check number or ACH reference | Yes |
| `Amount` | Payment amount (must not be zero) | Yes |
| `Bank Payment Type` | `Computer Check` or `Electronic Payment` | Yes |
| `Account Type` | Must be `Vendor` | Yes |
| `Account No.` | Vendor number | Yes |
| `Bal. Account Type` | Must be `Bank Account` | Yes |
| `Bal. Account No.` | Company bank account to pay from | Yes |
| `Recipient Bank Account` | Vendor bank account code (ACH only) | Yes (ACH) |
| `Applies-to Doc. No.` | Invoice number this payment applies to (single invoice) | Yes* |
| `Applies-to ID` | Applies-to ID when paying multiple invoices at once | Yes* |

*At least one of `Applies-to Doc. No.` or `Applies-to ID` must be set.

### Payment File Structure

The exported CSV contains the following record types:

| Record Type | Description |
|-------------|-------------|
| `1` — Header | Column labels row |
| `2` — Payment | Payment details: dates, amount, company bank info, payment method (CHK or ACH) |
| `3` — Payee | Vendor name, address, vendor bank account (routing/account for ACH), email |
| `6` — Invoice Detail | One row per applied invoice: vendor's invoice number, posting date, description, gross amount, discount, net amount |
| `7` — Invoice Totals | Totalled gross, discount, and net amounts for the payment |

---

## Troubleshooting

### Export Failed Message

If you see *"Export failed. Check the error log for further details"*, navigate to the **Payment Journal Export Errors** page to see specific errors per line.

**Error: "Document Date must have a value"**
- **Cause:** The `Document Date` field is blank
- **Solution:** Enter a document date on each payment line

**Error: "Amount must have a value"**
- **Cause:** A journal line has an amount of zero
- **Solution:** Verify the line is applied to an invoice and amount is correct

**Error: "Bank Payment Type must be either Computer Check or Electronic Payment"**
- **Cause:** A line has a blank or unsupported `Bank Payment Type`
- **Solution:** Set `Bank Payment Type` to either `Computer Check` or `Electronic Payment`

**Error: "Account Type must be Vendor"**
- **Cause:** A line has an account type other than `Vendor`
- **Solution:** Only vendor payment lines should be in the batch

**Error: "Bal. Account Type must be Bank Account"**
- **Cause:** The balancing account on the line is not a bank account
- **Solution:** Set `Bal. Account Type` to `Bank Account` and enter the correct company bank account

**Error: "Recipient Bank Account must have a value"**
- **Cause:** An Electronic Payment line is missing the vendor bank account code
- **Solution:** Enter the vendor's `Recipient Bank Account` code. If missing, go to **Vendor Bank Accounts** and add one

**Error: "Payment must be applied to an invoice"**
- **Cause:** The line has no `Applies-to Doc. No.` and no `Applies-to ID`
- **Solution:** Apply the payment to an invoice using **Apply Entries** function

**Error: "Bank Account No. must have a value"**
- **Cause:** The company bank account is missing its bank account number, transit number, or routing number
- **Solution:** Open **Bank Accounts**, select the bank account, and fill in all required fields

**Error: "Vendor Bank Account No. [x] not found"**
- **Cause:** The vendor bank account code on the line does not exist
- **Solution:** Open the vendor card, go to **Bank Accounts**, and verify the code

---

## Frequently Asked Questions

**Can I re-export after a failed export?**
Yes. Fix the errors on the journal lines and click **Export Bank File** again.

**What happens if I export the file twice?**
The file is regenerated each time. Only upload one file to the bank per batch.

**Can I mix checks and ACH payments in the same batch?**
Yes. Both `Computer Check` and `Electronic Payment` lines can be in the same batch. They appear as `CHK` and `ACH` records respectively.

**Can I confirm transmission for only some lines?**
No. **Confirm Transmission** applies to all payment lines in the current journal batch. To separate payments, move them to a different batch first.

**What is the Applies-to ID used for?**
When a single payment covers multiple invoices, you use **Apply Entries** to assign a common `Applies-to ID` to all invoices. The export then creates one invoice detail row per invoice.

---

## Best Practices

✅ **DO:**
- Verify all document dates match intended payment dates
- Confirm each line is applied to correct invoices
- Double-check bank payment type selection
- Wait for bank confirmation before confirming transmission
- Keep the Payment Journal open until transmission is confirmed

❌ **DON'T:**
- Export without verifying all required fields
- Confirm transmission before bank confirms receipt
- Mix different payment runs in one batch
- Delete journal lines before confirming transmission
- Export the same batch twice

---

## Related Pages

- [[purchase-receipt-overview]] — Purchasing and receiving process
- [[purchase-worksheet]] — Purchase order planning and management
