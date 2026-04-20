# Forecast Filter — Planning Worksheet

> **Version:** 1.1
> **Last Updated:** 2026-04-20
> **Author:** Alexander Thiel
> **Audience:** Purchasing / Production Planning Staff

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [Setup](#setup)
- [What you need before you start](#what-you-need-before-you-start)
- [How to use the Forecast Filter](#how-to-use-the-forecast-filter)
- [What gets removed and what stays](#what-gets-removed-and-what-stays)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

When you run **Calculate Regenerative Plan** on the Planning Worksheet with a Demand Forecast selected, Business Central recalculates supply for every item in the system — not just the items that appear in your forecast. This means the worksheet fills up with planning lines for Spring and Summer items even when you are planning for a Fall forecast, making it difficult to focus on what actually needs to be ordered or produced right now.

The Forecast Filter solves this by providing an **Apply Forecast Filter** button in the Process menu. After the plan calculation finishes, you click the button and confirm — all planning lines that belong to items with no quantity in the configured forecast are removed, leaving only the lines relevant to your current planning season.

**Key concepts:**

| Concept | Definition |
|---------|-----------|
| Demand Forecast | A named forecast record in Business Central that holds projected demand quantities by item and date. |
| Calculate Regenerative Plan | The Planning Worksheet action that recalculates all supply requirements from scratch. Accessed via **Actions > Functions > Calculate Regenerative Plan**. |
| Planning Line | A single row on the Planning Worksheet representing a suggested purchase or production order for one item. |
| Apply Forecast Filter | A button in the Process menu of the Planning Worksheet. Reads the forecast configured on the current batch and removes all MPS lines for items with no quantity in that forecast. |
| Production Forecast (batch field) | A field on the planning worksheet batch (set in Req. Wksh. Names) that tells the Forecast Filter which forecast to check against. Set this once per batch — it persists until you change it. |

---

## When to use it

Use the Forecast Filter every time you run Calculate Regenerative Plan with a seasonal forecast:

- **Switching seasons** — When a new forecast is loaded (e.g., transitioning from Summer to Fall), running Calculate Plan populates the worksheet with items from all seasons. Click **Apply Forecast Filter** to reduce the worksheet to only Fall items.
- **Daily planning reviews** — After any regenerative calculation where you want to work only within the scope of the active forecast.
- **Before converting lines to orders** — Filter down to the relevant lines first so you do not accidentally create purchase or production orders for off-season items.

---

## Setup

Before using the Forecast Filter for the first time, configure which forecast your planning batch should check against. This is a one-time setup per batch — you only need to update it when switching between seasonal forecasts (e.g., from Fall to Winter).

1. Search for **Req. Wksh. Names** in Business Central and open it.
2. Find the batch you use for planning (for example, **DEFAULT**).
3. Set the **Production Forecast** field to the forecast you plan against (for example, **FALL-2026**).
4. Close the page. The setting is saved automatically.

> **Note:** You only need to update this field when changing to a different forecast (e.g., at the start of a new planning season). For day-to-day use within the same season, the setting persists.

---

## What you need before you start

- Access to the **Planning Worksheet** in Business Central.
- The **Production Forecast** field must be set on your planning batch in **Req. Wksh. Names** (see Setup above). If it is blank, clicking Apply Forecast Filter will show an error.
- A Demand Forecast must exist and be loaded with quantities for the current season's items. At least one item must have a forecast entry with a quantity greater than zero.
- Standard planning worksheet permissions (no additional setup or feature flags are required for this feature).

> **Note:** Contact your system administrator if the Req. Wksh. Names page is not accessible or if you do not have permission to run Calculate Regenerative Plan.

---

## How to use the Forecast Filter

### Step 1: Confirm your batch has the forecast configured

Before running the calculation, verify that the **Production Forecast** field is set on your batch in **Req. Wksh. Names** (see Setup). If you have already done this for the current season, no action is needed — the setting persists.

### Step 2: Run Calculate Regenerative Plan

1. Open the **Planning Worksheet** in Business Central.
2. On the Planning Worksheet, click **Actions** in the top menu.
3. Select **Functions**, then **Calculate Regenerative Plan**.
4. In the dialog that opens, set your planning dates and any other parameters as usual.
5. Click **OK** to start the calculation.

Wait for the calculation to finish. Depending on the number of items, this may take a moment.

### Step 3: Click Apply Forecast Filter

After Calculate Regenerative Plan finishes, click **Apply Forecast Filter** in the Process menu of the Planning Worksheet.

A confirmation dialog appears:

> "Forecast 'FALL-2026' is set on this batch. Do you want to remove planning lines for items that have no quantity in this forecast?"

Choose one of the following:

| Choice | What happens |
|--------|-------------|
| **Yes** | All MPS planning lines for items with no forecast quantity (or only zero-quantity entries) are deleted from the worksheet. A summary message confirms how many lines were removed and how many remain. |
| **No** | No lines are changed. All planning lines generated by the calculation remain on the worksheet. |

### Step 4: Review the summary (Yes path)

After clicking **Yes**, a confirmation message appears, for example:

> "14 line(s) removed. 38 line(s) remain."

The worksheet now shows only the items that have a positive quantity in the selected forecast. Proceed with reviewing, adjusting, and converting lines to orders as normal.

**Example — Fall planning scenario:**

| Field | Value | Notes |
|-------|-------|-------|
| Batch Production Forecast | FALL-2026 | Set in Req. Wksh. Names |
| Lines before filter | 52 | All items across all seasons |
| Lines removed | 14 | Spring/Summer items with no Fall forecast qty |
| Lines remaining | 38 | Fall items ready for review |

---

## What gets removed and what stays

### Lines that are removed (Yes is clicked)

A planning line is removed when the item has **no forecast entry with a quantity greater than zero** in the configured forecast. Specifically, an item is removed if:

- It has no entries at all in the selected forecast, **or**
- All of its forecast entries for the selected forecast have a quantity of zero or less.

Only **MPS lines** (production order suggestions for finished goods) are evaluated. MRP lines (component purchase order suggestions) are never affected by this filter.

### Lines that stay

A planning line stays on the worksheet when the item has **at least one forecast entry with a quantity greater than zero** in the selected forecast, regardless of date or location.

### Lines that are never affected by this filter

- The filter only removes lines after you click **Yes** in the confirmation dialog. Clicking **No** leaves the worksheet entirely unchanged.
- MRP lines (`MPS Order = false`) — component purchase order suggestions — are always kept regardless of forecast.
- Lines added manually to the worksheet are evaluated the same as calculated lines (by item number vs. forecast entries).

---

## Troubleshooting

### Issue 1: The action shows "No forecast is set on this worksheet batch"

**Cause:** The **Production Forecast** field on your planning batch (in Req. Wksh. Names) is blank.

**Solution:**

1. Search for **Req. Wksh. Names** in Business Central and open it.
2. Find your planning batch (for example, **DEFAULT**).
3. Set the **Production Forecast** field to the forecast you want to plan against.
4. Return to the Planning Worksheet and click **Apply Forecast Filter** again.

---

### Issue 2: "Lines I expected to stay were removed"

**Cause:** The item's forecast entries in the configured forecast may all have a quantity of zero, or the entries exist under a different forecast name than the one set on the batch.

**Solution:**

1. Open **Demand Forecasts** in Business Central and search for the forecast configured on your batch.
2. Filter forecast entries by the item number in question.
3. Confirm that at least one entry has a **Forecast Quantity** greater than zero.
4. If all entries are zero, update the forecast with the correct quantities and re-run Calculate Regenerative Plan, then click Apply Forecast Filter again.
5. If the item's entries are under a different forecast name, update the **Production Forecast** field on your batch in Req. Wksh. Names to match.

---

### Issue 3: "Lines I expected to be removed are still on the worksheet after clicking Yes"

**Cause:** The item has at least one forecast entry with a quantity greater than zero in the configured forecast — even if it is a small amount or a date far in the future. Or the line is an MRP line (component demand), which the filter never removes.

**Solution:**

1. Open the forecast and search for the item.
2. If the entry should not be there, remove it or set the quantity to zero, then re-run Calculate Regenerative Plan and click Apply Forecast Filter again.
3. If the entry is intentional, the line is correct to remain — review it and delete it manually from the worksheet if it should not result in an order.
4. If the line is an MRP line (component/purchase suggestion rather than a production order suggestion), it is intentionally kept — the filter only removes MPS lines.

---

## FAQ

**Q: Does clicking Yes permanently delete anything from my forecast?**

A: No. The filter only removes planning lines from the Planning Worksheet. Forecast entries, items, and all other data are untouched. Planning lines are temporary suggestions and can be regenerated at any time by running Calculate Regenerative Plan again.

---

**Q: Can I undo the removal after clicking Yes?**

A: No. Once lines are removed, they are gone from the current worksheet. To get them back, run Calculate Regenerative Plan again. If you are unsure, click **No** and manually delete the lines you do not need.

---

**Q: What forecast does the filter use?**

A: The filter uses the forecast set in the **Production Forecast** field on your planning batch in **Req. Wksh. Names**. Only that single forecast is checked. Items are kept only if they have a positive quantity in that forecast.

---

**Q: I ran Calculate Plan and my worksheet has too many lines. Can I still use this filter?**

A: Yes — as long as the **Production Forecast** field is set on your batch in Req. Wksh. Names, you can click **Apply Forecast Filter** at any time after running Calculate Plan.

---

**Q: Does the filter consider forecast quantities by date or location?**

A: No. The filter checks whether the item has any forecast entry with a positive quantity in the selected forecast, regardless of date or location. If an item has even one qualifying entry, all of its planning lines are kept.

---

**Q: What does "zero-qty entries don't count" mean?**

A: Some forecasts include placeholder rows with a quantity of zero (for example, items being phased out or not yet confirmed for the season). The Forecast Filter treats these the same as having no forecast entry — if every entry for an item is zero, that item's planning lines will be removed when you click Yes.

---

**Q: Will this affect MRP lines (component purchase suggestions)?**

A: No. The Forecast Filter only evaluates MPS lines — production order suggestions for finished goods. MRP lines (component demand, purchase order suggestions for pots, cuttings, soil, etc.) are never removed by this filter.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/forecast-filter-planning-worksheet-user-guide.pdf)
