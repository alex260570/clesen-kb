# Planning flexibility lock

> **Version:** 1.0
> **Last Updated:** 2026-04-14
> **Author:** Alexander Thiel
> **Audience:** Purchasing Staff

## Table of contents

- [What this is](#what-this-is)
- [Why MRP suggests canceling or rescheduling your orders](#why-mrp-suggests-canceling-or-rescheduling-your-orders)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to lock lines on a purchase order](#how-to-lock-lines-on-a-purchase-order)
- [How to lock lines from the planning worksheet](#how-to-lock-lines-from-the-planning-worksheet)
- [How to unlock lines](#how-to-unlock-lines)
- [What happens after you lock](#what-happens-after-you-lock)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [SOP document](#sop-document)

---

## What this is

**Planning flexibility lock** lets you protect selected purchase order lines from being changed or canceled by MRP (the planning worksheet). When a line is locked, MRP ignores it — no action messages, no reschedule suggestions, no cancel suggestions — even if MRP would normally recommend a change.

You lock and unlock lines in two places:

- Directly on a **Purchase Order** — while reviewing a specific order
- From the **Planning Worksheet** — after running MRP, before carrying out action messages

---

## Why MRP suggests canceling or rescheduling your orders

Understanding why MRP does this makes it easier to know when to lock.

MRP looks at total demand and total supply for each item. When it sees multiple purchase orders for the same item, it tries to consolidate them — it will suggest canceling one order and increasing the quantity on another. This is standard MRP logic designed to minimize the number of open orders.

**The problem for horticulture:** Plants are not interchangeable between suppliers the way manufactured parts are. You may have ordered 500 units from Vendor A and 300 units from Vendor B because:

- Market availability limits how much any one grower can supply
- You need variety from different sources
- Delivery schedules are different

MRP does not know any of this. It just sees two orders for the same item and suggests combining them. If you carry out that action message, you would cancel a real order that you need.

**Locking is the solution.** When you lock a line, you are telling MRP: *I know about this order, I placed it intentionally, and I do not want you to touch it.* MRP will stop generating action messages for that line, and the line will no longer appear as something to act on in the planning worksheet.

---

## When to use it

Use planning flexibility lock when:

- You have placed orders with multiple vendors for the same item and MRP keeps suggesting you cancel one of them
- A purchase order is confirmed and booked with a vendor — you do not want to accidentally cancel it while carrying out other MRP actions
- You have negotiated a specific delivery date and quantity with a vendor and do not want MRP to reschedule the line
- You are carrying out action messages in the planning worksheet and want to process some lines while leaving others untouched

> **Note:** Locking a line does not prevent you from manually editing the purchase order. It only stops MRP from generating action messages for that line.

---

## What you need before you start

- You need access to the **Purchase Orders** page or the **Planning Worksheet**
- The lines you want to lock must already exist as open purchase order lines

---

## How to lock lines on a purchase order

Use this method when you are reviewing a specific purchase order and want to protect certain lines before running MRP.

### Step 1: Open the purchase order

1. Search for **Purchase Orders** in the Business Central search bar.
2. Open the order you want to work with.

### Step 2: Select the lines to lock

1. On the **Lines** subpage, click the first line you want to lock.
2. To select multiple lines, hold `Ctrl` and click each additional line.
3. To select a range, click the first line, then hold `Shift` and click the last line.

### Step 3: Lock the selected lines

1. In the **Lines** toolbar, click **Functions**.
2. Click **Lock Planning Flexibility**.
3. A message confirms how many lines were locked, for example: *"3 line(s) locked. MRP will not reschedule or cancel these lines."*

> **Note:** Lines that are already locked are skipped automatically. The count in the message only includes lines that were actually changed.

### Step 4: Verify

Check the `Planning Flexibility` column on the lines you locked. The value should now show `None`.

> **Tip:** If the `Planning Flexibility` column is not visible, right-click any column header and choose **Choose Columns** to add it.

---

## How to lock lines from the planning worksheet

Use this method after running MRP when you can see exactly which lines are generating unwanted action messages.

### Step 1: Run the planning worksheet

1. Search for **Planning Worksheet** in the Business Central search bar.
2. Run **Calculate Regenerative Plan** or **Calculate Net Change Plan** as usual.
3. Review the action messages.

### Step 2: Identify lines to lock

Look for lines with action messages like **Cancel**, **Change Qty.**, or **Reschedule** that point to purchase orders you want to keep as-is.

Note the item number and vendor for those lines — you will lock the corresponding purchase order lines.

> **Note:** You can also lock directly from the planning worksheet (see Step 3 below), which sets `Planning Flexibility` on the requisition line itself. This prevents MRP from generating new action messages for that line the next time you run the plan.

### Step 3: Select lines and lock

1. In the planning worksheet, click the first line you want to lock.
2. Select multiple lines using `Ctrl` or `Shift`.
3. Click **Lock Planning Flexibility** from the toolbar.
4. A message confirms how many lines were locked.

### Step 4: Re-run the plan

After locking, run **Calculate Net Change Plan** again. The locked lines should no longer appear with action messages.

---

## How to unlock lines

Unlocking restores normal MRP behavior for the selected lines. MRP will resume generating action messages for those lines the next time you run a plan.

### On a purchase order

1. Open the purchase order.
2. Select the lines to unlock (using `Ctrl` or `Shift` for multiple lines).
3. Click **Functions** > **Unlock Planning Flexibility**.
4. A message confirms how many lines were unlocked.

### On the planning worksheet

1. Select the lines to unlock in the planning worksheet.
2. Click **Unlock Planning Flexibility** from the toolbar.
3. A message confirms how many lines were unlocked.

> **Note:** After unlocking, run **Calculate Net Change Plan** again to see updated action messages for those lines.

---

## What happens after you lock

When a line is locked (`Planning Flexibility = None`):

1. **MRP ignores the line** — no action messages are generated for it during planning runs.
2. **The line is safe from bulk actions** — if you click **Carry Out Action Messages** in the planning worksheet, locked lines are not affected.
3. **The order is still fully editable** — you can still manually change quantity, date, or any other field on the purchase order. Locking only affects what MRP suggests, not what you can do manually.
4. **The lock persists until you unlock it** — running MRP again does not reset the lock.

---

## Field reference

These are the fields you see on the **Purchase Order Lines** and **Planning Worksheet**:

| Field                  | What it means                                                                                                     | Can you edit it? |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------- |
| `Planning Flexibility` | Controls whether MRP can suggest changes to this line. `None` = locked (MRP ignores it). `Unlimited` = normal MRP behavior. | No (use Lock/Unlock actions) |

---

## Troubleshooting

### The "Lock Planning Flexibility" button does nothing

**Cause:** No lines are selected.

**Solution:** Click on a line first to select it. Use `Ctrl+click` to select multiple lines. Then click the button again.

### MRP still shows action messages for lines I locked on the purchase order

**Cause:** Locking a purchase order line sets `Planning Flexibility` on the `Purchase Line`. Locking from the planning worksheet sets it on the `Requisition Line` (the planning worksheet entry). These are separate records. MRP reads from the requisition line during planning, so locking on the purchase order alone may not suppress action messages until you also lock from the planning worksheet — or re-run the plan after locking.

**Solution:** After locking on the purchase order, open the planning worksheet, run **Calculate Net Change Plan**, select the lines that still appear, and lock them there too.

### A line is locked but I need to change it manually

**Cause:** The lock prevents MRP from suggesting changes, but does not prevent you from editing the line.

**Solution:** You do not need to unlock first. Open the purchase order and edit the line directly. Unlock only when you want MRP to resume normal planning for that line.

### I accidentally locked lines I did not mean to lock

**Solution:** Select the lines and click **Unlock Planning Flexibility**. This restores `Planning Flexibility = Unlimited` on those lines. Run **Calculate Net Change Plan** to see updated action messages.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/planning-flexibility-user-guide.pdf)
