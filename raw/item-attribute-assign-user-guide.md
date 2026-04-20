# Bulk item attribute assignment

> **Version:** 1.0
> **Last Updated:** 2026-04-14
> **Author:** Alexander Thiel
> **Audience:** Purchasing Staff, Operations Staff

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to assign attributes to multiple items](#how-to-assign-attributes-to-multiple-items)
- [What happens after you click OK](#what-happens-after-you-click-ok)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [SOP document](#sop-document)

---

## What this is

**Bulk item attribute assignment** lets you select multiple items on the Item List and assign one or more attribute and value pairs to all of them at once. The values you enter overwrite any existing values for those attributes on every selected item.

Without this feature, you would need to open each item card individually, navigate to the Attributes section, and set the value one at a time. With bulk assignment, you can update dozens of items in a single action.

**When you need to assign attributes to multiple items, you:**

1. Select the items on the Item List
2. Click **Functions** > **Assign Item Attributes**
3. Enter the attributes and values you want to apply
4. Click **OK** — the system updates all selected items immediately

---

## When to use it

Use bulk item attribute assignment when:

- You receive a new shipment of plants and need to set the season attribute (Spring, Summer, Fall, Winter) on all items in a group
- You need to update a shared attribute — such as pot size, category, or origin — across a range of similar items
- You are setting up new items and want to apply a common set of attributes in one step rather than editing each card individually

> **Note:** This action always overwrites the existing value. If an item already has a value for an attribute you include, that value will be replaced. If you want to leave some items unchanged, exclude them from your selection.

---

## What you need before you start

- The attributes and values you want to assign must already exist in Business Central (under **Item Attributes** setup)
- You need access to the **Item List** page
- Know which items you want to update — you can filter the list before selecting

---

## How to assign attributes to multiple items

### Step 1: Open the Item List

1. Search for **Items** in the Business Central search bar.
2. The Item List opens.

### Step 2: Filter the list (optional)

If you are working with a large item catalog, filter the list first to narrow it down:

1. Use the search bar or filter pane to show only the items you want to update.
2. For example, filter by `Item Category Code` or `Description` to find a specific group.

### Step 3: Select the items

1. Click the first item you want to include.
2. To select additional items:
   - Hold `Ctrl` and click each additional item individually
   - Hold `Shift` and click the last item in a range to select all items between the first and last
3. Confirm your selection — selected rows are highlighted.

### Step 4: Open the assignment dialog

1. Click **Functions** in the action bar.
2. Click **Assign Item Attributes**.
3. The **Assign Item Attributes** dialog opens.

> **Note:** If no items are selected when you click the button, a message appears: *"No items selected."* Click OK, select at least one item, and try again.

### Step 5: Enter attributes and values

The dialog shows a list with four columns. Each row is one attribute+value pair to assign.

1. In the `Attribute` column, enter the numeric ID of the attribute you want to assign.
   - The `Attribute Name` column fills in automatically.
2. In the `Value` column, enter the numeric ID of the value.
   - The `Value Name` column fills in automatically.
3. To assign a second attribute at the same time, press `Enter` or move to the next row and repeat.

> **Tip:** If you do not know the attribute or value ID, press `F4` or click the lookup arrow in the field to browse the available options.

> **Note:** Rows where `Attribute` or `Value` is blank are ignored. Only complete rows (both fields filled in) are applied.

### Step 6: Click OK

1. Review the rows in the dialog.
2. Click **OK** to apply the assignments.
3. A message confirms how many assignments were applied, for example: *"12 attribute assignment(s) applied across selected items."*

> **Note:** The count is the total number of attribute assignments made — items × attribute rows. For example, selecting 4 items and entering 3 attribute rows results in 12 assignments.

---

## What happens after you click OK

For each selected item and each attribute row you entered:

1. **If the item already has a value for that attribute** — the existing value is overwritten with the new value.
2. **If the item does not yet have that attribute** — the attribute is added with the value you entered.
3. **Season attributes are updated automatically** — if one of the attributes you assigned is a season attribute (Spring, Summer, Fall, or Winter), the corresponding season flag on the item card is updated immediately. You do not need to do anything else.

The Item List refreshes automatically after the assignments are applied.

---

## Field reference

These are the fields you see in the **Assign Item Attributes** dialog:

| Field            | What it means                                                             | Can you edit it? |
| ---------------- | ------------------------------------------------------------------------- | ---------------- |
| `Attribute`      | The numeric ID of the item attribute to assign                            | Yes              |
| `Attribute Name` | The name of the attribute — fills in automatically after you enter the ID | No               |
| `Value`          | The numeric ID of the value to assign to the attribute                    | Yes              |
| `Value Name`     | The name of the value — fills in automatically after you enter the ID     | No               |

---

## Troubleshooting

### The "Assign Item Attributes" button is not visible

**Cause:** The **Functions** group may be collapsed or the action may not be promoted on your role center.

**Solution:** Click **Functions** in the action bar to expand it. If it is still not visible, use the **More options** (...) menu or contact your system administrator.

### "No items selected." message appears

**Cause:** No rows were selected on the Item List when you clicked the button.

**Solution:** Click on a row to select it first. Use `Ctrl+click` for multiple rows. Then click **Assign Item Attributes** again.

### The `Attribute Name` or `Value Name` does not fill in after entering an ID

**Cause:** The ID you entered does not match an existing attribute or value in the system.

**Solution:** Press `F4` in the `Attribute` or `Value` field to open the lookup and select from the available options. Do not type an ID manually unless you are certain it exists.

### The assignment count seems higher than expected

**Cause:** The count is items × attribute rows, not just the number of items. Three attribute rows applied to five items = 15 assignments.

**Solution:** This is expected behavior. Each attribute row is applied to every selected item.

### An attribute I assigned is not showing on the item card

**Cause:** The Item Card's Attributes FactBox or page may need to be refreshed.

**Solution:** Close and reopen the item card, or press `F5` to refresh. If the attribute still does not appear, check that both the `Attribute` and `Value` fields were filled in when you clicked OK — rows with a blank ID are skipped silently.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/item-attribute-assign-user-guide.pdf)
