---
title: Planning Flexibility Lock
type: howto
tags: [purchasing, mrp, order-management, planning, purchase-orders]
created: 2026-04-21
updated: 2026-04-21
sources: [planning-flexibility-user-guide.md]
---

# Planning Flexibility Lock

Protect selected purchase order lines from being changed or canceled by MRP (the planning worksheet).

## What This Is

**Planning flexibility lock** lets you protect purchase order lines from being changed or canceled by MRP. When a line is locked, MRP ignores it — no action messages, no reschedule suggestions, no cancel suggestions.

You lock and unlock lines in two places:
- Directly on a **Purchase Order**
- From the **Planning Worksheet**

---

## Why MRP Suggests Canceling or Rescheduling Orders

MRP looks at total demand and total supply for each item. When it sees multiple purchase orders for the same item, it tries to consolidate them — it will suggest canceling one order and increasing quantity on another. This is standard MRP logic designed to minimize open orders.

**The problem for horticulture:** Plants are not interchangeable between suppliers. You may have ordered:
- 500 units from Vendor A (only amount they can supply)
- 300 units from Vendor B (need variety from different sources)

MRP does not know this. It just sees two orders for the same item and suggests combining them.

**Locking is the solution.** When you lock a line, you tell MRP: *I know about this order, I placed it intentionally, and I do not want you to touch it.*

---

## When to Use It

Use planning flexibility lock when:

- You have multiple vendors for the same item and MRP keeps suggesting cancellation
- A purchase order is confirmed with a vendor — you don't want to accidentally cancel it
- You have negotiated specific delivery date and quantity — you don't want MRP to reschedule
- You are carrying out action messages and want to process some lines while leaving others untouched

**Note:** Locking a line does not prevent you from manually editing the purchase order. It only stops MRP from generating action messages.

---

## How to Lock Lines on a Purchase Order

Use this method when reviewing a specific purchase order and want to protect certain lines before running MRP.

### Step 1: Open the Purchase Order

1. Search for **Purchase Orders** in Business Central
2. Open the order you want to work with

### Step 2: Select the Lines to Lock

1. On the **Lines** subpage, click the first line you want to lock
2. To select multiple lines, hold `Ctrl` and click each additional line
3. To select a range, click the first line, then hold `Shift` and click the last line

### Step 3: Lock the Selected Lines

1. In the **Lines** toolbar, click **Functions**
2. Click **Lock Planning Flexibility**
3. A message confirms how many lines were locked

**Note:** Lines that are already locked are skipped automatically.

### Step 4: Verify

Check the `Planning Flexibility` column on the lines you locked. The value should now show `None`.

**Tip:** If the `Planning Flexibility` column is not visible, right-click any column header and choose **Choose Columns** to add it.

---

## How to Lock Lines from the Planning Worksheet

Use this method after running MRP when you can see exactly which lines are generating unwanted action messages.

### Step 1: Run the Planning Worksheet

1. Search for **Planning Worksheet** in Business Central
2. Run **Calculate Regenerative Plan** or **Calculate Net Change Plan** as usual
3. Review the action messages

### Step 2: Identify Lines to Lock

Look for lines with action messages like **Cancel**, **Change Qty.**, or **Reschedule** that point to purchase orders you want to keep as-is.

### Step 3: Select Lines and Lock

1. Click the first line you want to lock
2. Select multiple lines using `Ctrl` or `Shift`
3. Click **Lock Planning Flexibility** from the toolbar
4. A message confirms how many lines were locked

### Step 4: Re-run the Plan

After locking, run **Calculate Net Change Plan** again. The locked lines should no longer appear with action messages.

---

## How to Unlock Lines

Unlocking restores normal MRP behavior. MRP will resume generating action messages the next time you run a plan.

### On a Purchase Order

1. Open the purchase order
2. Select the lines to unlock (using `Ctrl` or `Shift` for multiple lines)
3. Click **Functions** > **Unlock Planning Flexibility**
4. A message confirms how many lines were unlocked

### On the Planning Worksheet

1. Select the lines to unlock in the planning worksheet
2. Click **Unlock Planning Flexibility** from the toolbar
3. A message confirms how many lines were unlocked

**Note:** After unlocking, run **Calculate Net Change Plan** again to see updated action messages.

---

## What Happens After You Lock

When a line is locked (`Planning Flexibility = None`):

1. **MRP ignores the line** — no action messages are generated during planning runs
2. **The line is safe from bulk actions** — if you click **Carry Out Action Messages**, locked lines are not affected
3. **The order is still fully editable** — you can still manually change quantity, date, or any other field
4. **The lock persists until you unlock it** — running MRP again does not reset the lock

---

## Field Reference

| Field | What it Means | Can You Edit It? |
|-------|---------------|-----------------|
| `Planning Flexibility` | Controls whether MRP can suggest changes to this line. `None` = locked (MRP ignores it). `Unlimited` = normal MRP behavior. | No (use Lock/Unlock actions) |

---

## Troubleshooting

### The "Lock Planning Flexibility" Button Does Nothing

**Cause:** No lines are selected

**Solution:** Click on a line first to select it. Use `Ctrl+click` to select multiple lines. Then click the button again.

### MRP Still Shows Action Messages for Lines I Locked on the Purchase Order

**Cause:** Locking a purchase order line sets `Planning Flexibility` on the Purchase Line. Locking from the planning worksheet sets it on the Requisition Line. MRP reads from the requisition line during planning.

**Solution:** After locking on the purchase order, open the planning worksheet, run **Calculate Net Change Plan**, select the lines that still appear, and lock them there too.

### A Line is Locked But I Need to Change It Manually

**Cause:** The lock prevents MRP from suggesting changes, but does not prevent you from editing the line

**Solution:** You do not need to unlock first. Open the purchase order and edit the line directly. Unlock only when you want MRP to resume normal planning.

### I Accidentally Locked Lines I Did Not Mean To Lock

**Solution:** Select the lines and click **Unlock Planning Flexibility**. This restores `Planning Flexibility = Unlimited` on those lines. Run **Calculate Net Change Plan** to see updated action messages.

---

## Best Practices

✅ **DO:**
- Lock orders confirmed with vendors before running MRP
- Review MRP suggestions carefully before carrying them out
- Unlock lines once orders are fulfilled
- Document why specific lines are locked
- Re-run planning after locking to verify results

❌ **DON'T:**
- Lock all lines indiscriminately (defeats MRP purpose)
- Forget to unlock after orders are complete
- Leave locked lines indefinitely without review
- Lock without reviewing MRP suggestions first

---

## Related Pages

- [[sales-planning]] — Sales planning and demand forecasting
- [[forecast-filter-planning]] — Filtering planning worksheet by forecast
