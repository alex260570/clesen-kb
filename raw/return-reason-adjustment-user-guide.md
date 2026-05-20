# Return order reason code change

> **Version:** 1.0
> **Last Updated:** 2026-05-20
> **Author:** Clesen Development
> **Audience:** Sales support, returns processing staff, system administrators

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to change a return reason code](#how-to-change-a-return-reason-code)
- [What the system updates](#what-the-system-updates)
- [Setup and authorization](#setup-and-authorization)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

The **Adjust Return Reason (Posted)** function lets an authorized user correct the `Return Reason Code` on return order lines that have **already been posted as received**.

Normally, once a return is received the reason code is locked into the posted records and cannot be changed from the document. This feature provides a controlled, auditable way to fix a wrong reason code without reversing the receipt.

When you run it, the system updates the reason code in three places at once so the open order and the posted records stay consistent:

**Key concepts:**

| Concept | Definition |
|---------|-----------|
| `Return Reason Code` | The code that explains why a customer returned goods (for example, `DAMAGED`, `WRONG-ITEM`). Used for reporting and analysis. |
| Posted Return Receipt | The permanent record created when a return order line is received into inventory. |
| Value Entry | The financial/inventory ledger record tied to the posted receipt. It also stores the reason code for reporting. |

---

## When to use it

Use this function when a return has been received with the wrong reason code and you need the posted records to reflect the correct one — for example, when returns analysis or a customer credit decision depends on accurate reason coding.

> **Note:** This function only changes the reason code. It does **not** reverse, re-post, or change quantities, amounts, or inventory. If you need to change anything other than the reason code, reverse the receipt instead.

Typical situations:

- A picker or processor selected the wrong reason at receipt time.
- A reason code was left blank and needs to be filled in after the fact.
- Returns reporting flagged a miscoded batch that needs correcting.

---

## What you need before you start

- The return order line must already be **received** (it has a `Return Qty. Received` greater than zero).
- You must be a member of the authorization group configured for this function (see [Setup and authorization](#setup-and-authorization)).
- The replacement `Return Reason Code` must already exist in the **Return Reasons** list.

> **Note:** If you are not authorized, contact a system administrator to be added to the authorization group. Administrators configure the group in **Sales Setup**.

---

## How to change a return reason code

1. Open the **Sales Return Order** that contains the line you need to correct.
2. In the **Lines** section, select one or more lines that have been received.
   - You can select multiple lines with `Ctrl+Click` or `Shift+Click`. The same new reason code is applied to all selected lines.
3. On the lines toolbar, choose **Functions** > **Adjust Return Reason (Posted)**.
4. In the **Return Reasons** window, select the correct reason code and click **OK**.
5. Review the confirmation message. It shows the new code and how many lines will be changed.
6. Click **Yes** to apply the change.

When the change completes, a summary message confirms how many sales lines, posted receipt lines, and value entries were updated.

**Example:**

| Field | Value | Notes |
|-------|-------|-------|
| Selected lines | 3 | All three were received |
| New `Return Reason Code` | `DAMAGED` | Chosen from the Return Reasons list |
| Confirmation | "...change the Return Reason Code to DAMAGED on 3 selected line(s)..." | Click **Yes** to proceed |

---

## What the system updates

When you confirm the change, the system updates the reason code in all of the following, in a single all-or-nothing operation:

- The **open Sales Return Order line** — so the document matches the posted records.
- Every matching **Posted Return Receipt Line** — linked by `Return Order No.` and `Return Order Line No.`.
- Every matching **Value Entry** — the inventory/financial ledger records for those receipt lines.

> **Note:** The operation is all-or-nothing. If anything prevents the update from finishing, no changes are saved and you can safely try again.

The function is safe to run more than once. Records that already have the target reason code are skipped, so re-running it does no harm.

---

## Setup and authorization

This function is restricted to a named authorization group. Only system administrators perform this setup.

**To configure authorization:**

1. Search for **Sales Setup** in Business Central and open it.
2. In the `Posted Return Reason Adjustment Authorization` field, select the authorization group whose members are allowed to change posted return reason codes.
3. Add the relevant users to that authorization group.

> **Tip:** Reuse an existing authorization group if its membership already matches who should have this permission, or create a dedicated group for tighter control.

---

## Field reference

These are the key fields involved in this function:

| Field | What it means | Can you edit it? |
|-------|---------------|-----------------|
| `Return Reason Code` (Sales Return Order line) | The reason the goods were returned | Yes, through this function for received lines |
| `Return Qty. Received` (Sales Return Order line) | How much of the line has been received; must be greater than zero to qualify | No (system-maintained) |
| `Posted Return Reason Adjustment Authorization` (Sales Setup) | The authorization group allowed to run the function | Yes (administrators) |

---

## Troubleshooting

### Error: "You are not authorized to adjust the Return Reason Code on posted documents."

**Cause:** Your user is not a member of the configured authorization group.

**Solution:** Ask a system administrator to add you to the group named in the `Posted Return Reason Adjustment Authorization` field in **Sales Setup**.

---

### Error: "No authorization group has been configured for Posted Return Reason Adjustment in Sales Setup."

**Cause:** The `Posted Return Reason Adjustment Authorization` field in **Sales Setup** is blank.

**Solution:** An administrator must set this field to a valid authorization group before anyone can use the function. See [Setup and authorization](#setup-and-authorization).

---

### Error: "None of the selected lines have been posted as received. There is nothing to adjust."

**Cause:** The lines you selected have not been received yet (their `Return Qty. Received` is zero), so there are no posted records to update.

**Solution:** Select lines that have already been received. For lines that are not yet received, change the reason code directly on the line as you normally would.

---

### Error: "This function can only be used on Sales Return Orders."

**Cause:** The function was triggered from a document that is not a return order.

**Solution:** Run the function only from a **Sales Return Order**.

---

## FAQ

**Q: Does this change the quantity, amount, or inventory of the return?**

A: No. It only changes the reason code. Quantities, values, and inventory are untouched.

---

**Q: Can I change several lines at once?**

A: Yes. Select multiple received lines before running the function. The same reason code is applied to all of them.

---

**Q: What happens if I run it twice with the same code?**

A: Nothing harmful. Lines already on that reason code are skipped, so re-running is safe.

---

**Q: I picked the wrong code by mistake — can I fix it?**

A: Yes. Run the function again and select the correct code. It will overwrite the previous change on the posted records.

---

**Q: Why can't I see the action?**

A: The action lives under **Functions** on the return order lines toolbar. If you still cannot use it, you may not be in the authorization group — contact an administrator.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/return-reason-adjustment-user-guide.pdf)
