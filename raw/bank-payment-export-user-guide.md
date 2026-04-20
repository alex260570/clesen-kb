# Bank payment export

> **Version:** 1.0
> **Last Updated:** 2026-03-10
> **Author:** Alexander Thiel
> **Audience:** Finance Staff

## Table of contents

- [Overview](#overview)
- [When to use this process](#when-to-use-this-process)
- [Prerequisites](#prerequisites)
- [How to export payments](#how-to-export-payments)
- [How to confirm transmission](#how-to-confirm-transmission)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## Overview

The bank payment export process lets you send vendor payments directly to the bank from the **Payment Journal** in Business Central. It supports two payment types:

- **ACH (Electronic Payment)** — direct bank transfers to vendor accounts
- **Check (Computer Check)** — paper checks that the bank prints and mails

The export produces a `Paymentfile.csv` that is uploaded to the bank portal. Once the bank has received and confirmed the file, you complete the process in Business Central by confirming transmission, which marks the payments as sent and creates the necessary check ledger entries.

---

## When to use this process

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

## How to export payments

### Step 1: Open the Payment Journal

1. Search for **Payment Journal** in the Business Central search bar.
2. Select the correct **Batch Name** for your payment run.

### Step 2: Review the journal lines

Verify that all lines are correct before exporting:

- Confirm the `Document Date` matches the intended payment date.
- Confirm each line is applied to the correct invoice(s).
- Confirm `Bank Payment Type` is set correctly (`Computer Check` or `Electronic Payment`).

### Step 3: Export the payment file

1. Click **Export Bank File** in the action bar at the top of the page.
2. The system validates all journal lines automatically. If any line has a problem, the export stops and you will see the message:

   > *Export failed. Check the error log for further details.*

   See [Troubleshooting](#troubleshooting) for how to resolve errors.

3. If all lines pass validation, your browser automatically downloads `Paymentfile.csv`.

### Step 4: Upload the file to the bank portal

1. Log in to the bank's online portal.
2. Navigate to the payment file upload section.
3. Upload `Paymentfile.csv`.
4. Confirm and submit the payment batch in the portal.
5. Wait for the bank to confirm receipt.

> **Note:** Do not close the Payment Journal or delete journal lines until you have confirmed transmission in Step 5.

### Step 5: Confirm transmission

Once the bank has confirmed they received the file, return to Business Central and confirm transmission. See [How to confirm transmission](#how-to-confirm-transmission) below.

---

## How to confirm transmission

After the bank has confirmed receipt of the payment file:

1. Open the **Payment Journal** and select the same batch.
2. Click **Confirm Transmission** in the action bar.
3. Confirm the prompt:

   > *Are you sure you want to confirm the transmission of all payments in this journal batch?*

4. Click **Yes**.

Business Central will:

- Mark all payment lines as `Check Exported` and `Check Transmitted`.
- For **Computer Check** lines: create a check ledger entry using the `Document No.` as the check number and mark the line as `Check Printed`.
- For **Electronic Payment** lines: mark the line as transmitted (no check ledger entry is created).

> **Warning:** Only confirm transmission after the bank has actually received and accepted the file. This action cannot be undone from the journal — reversing payments after confirmation requires voiding entries.

---

## Field reference

### Journal line fields

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

### Payment file structure

The exported CSV contains the following record types:

| Record type | Description |
|-------------|-------------|
| `1` — Header | Column labels row |
| `2` — Payment | Payment details: dates, amount, company bank info, payment method (CHK or ACH) |
| `3` — Payee | Vendor name, address, vendor bank account (routing/account number for ACH), email |
| `6` — Invoice detail | One row per applied invoice: vendor's invoice number (external doc no.), posting date, description, gross amount, discount, net amount |
| `7` — Invoice totals | Totalled gross, discount, and net amounts for the payment |

---

## Troubleshooting

### Export failed message

If you see *"Export failed. Check the error log for further details"*, navigate to the **Payment Journal Export Errors** page to see a list of specific errors per line.

Common errors and fixes:

---

### Error: "Document Date must have a value"

**Cause:** The `Document Date` field is blank on one or more lines.

**Solution:** Enter a document date on each payment line. This date is used as the payment date by the bank.

---

### Error: "Amount must have a value"

**Cause:** A journal line has an amount of zero.

**Solution:** Verify the line is applied to an invoice and the amount populated correctly. Delete zero-amount lines that are not needed.

---

### Error: "Bank Payment Type must be either Computer Check or Electronic Payment"

**Cause:** A line has a blank or unsupported `Bank Payment Type`.

**Solution:** Set `Bank Payment Type` to either `Computer Check` or `Electronic Payment` on all lines.

---

### Error: "Account Type must be Vendor"

**Cause:** A line has an account type other than `Vendor` (e.g., G/L Account or Customer).

**Solution:** Only vendor payment lines should be in the batch. Remove or correct non-vendor lines.

---

### Error: "Bal. Account Type must be Bank Account"

**Cause:** The balancing account on the line is not a bank account.

**Solution:** Set `Bal. Account Type` to `Bank Account` and enter the correct company bank account in `Bal. Account No.`

---

### Error: "Recipient Bank Account must have a value"

**Cause:** An Electronic Payment line is missing the vendor bank account code.

**Solution:** Enter the vendor's `Recipient Bank Account` code on the line. If the vendor does not have a bank account set up, go to the **Vendor Bank Accounts** page and add one.

---

### Error: "Payment must be applied to an invoice"

**Cause:** The line has no `Applies-to Doc. No.` and no `Applies-to ID` set.

**Solution:** Apply the payment to an invoice using the **Apply Entries** function on the journal line.

---

### Error: "Bank Account No. must have a value in [bank account]"

**Cause:** The company bank account is missing its bank account number, transit number, or routing number.

**Solution:** Open the **Bank Accounts** page, select the bank account, and fill in `Bank Account No.`, `Transit No.`, and `Bank Branch No.`

---

### Error: "Vendor Bank Account No. [x] not found"

**Cause:** The vendor bank account code on the journal line does not exist in the system.

**Solution:** Open the vendor card, go to **Bank Accounts**, and verify the bank account code. Update the journal line to match.

---

### Error: "Bank Branch No. must have a value in Vendor Bank Account [x]"

**Cause:** The vendor's bank account is missing the routing number.

**Solution:** Open the **Vendor Bank Accounts** page for the vendor and fill in `Bank Branch No.` (the ABA routing number) and `Bank Account No.`

---

## FAQ

**Can I re-export after a failed export?**

Yes. Fix the errors on the journal lines and click **Export Bank File** again. The system always re-validates before generating a new file.

**What happens if I export the file twice?**

The file is regenerated each time you click **Export Bank File**. Only upload one file to the bank per batch. If you accidentally exported twice, upload only the most recent file.

**Can I mix checks and ACH payments in the same batch?**

Yes. The export handles both `Computer Check` and `Electronic Payment` lines in the same batch. They appear as `CHK` and `ACH` records in the file respectively.

**What is debug mode?**

The **Export Bank File (Debug Mode)** action runs the same validation and file generation but opens the export buffer on screen instead of downloading the CSV. This is used by IT to inspect the file structure without generating a download.

**Can I confirm transmission for only some lines?**

No. **Confirm Transmission** applies to all payment lines in the current journal batch. If you need to separate some payments, move them to a different batch before confirming.

**What is the Applies-to ID used for?**

When a single payment covers multiple invoices, you use **Apply Entries** to assign a common `Applies-to ID` to all the invoices. The export then creates one invoice detail row (record type 6) per invoice in the payment file.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/bank-payment-export-user-guide.pdf)
