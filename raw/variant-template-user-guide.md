# Variant templates

> **Version:** 1.0
> **Last Updated:** 2026-03-16
> **Author:** Alexander Thiel
> **Audience:** Operations Staff, Managers

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to create a variant template](#how-to-create-a-variant-template)
- [How to apply a template to an item](#how-to-apply-a-template-to-an-item)
- [How to sync variants to component items](#how-to-sync-variants-to-component-items)
- [What happens after you finish](#what-happens-after-you-finish)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

**Variant Templates** let you define a reusable set of item variants with their blooming stage configuration. Instead of manually creating variants one by one on each item, you define the set once in a template and apply it to any item.

When you apply a template to a **rollup item** (a parent item with component items), the system automatically cascades the variants down to every component item.

**When you need to set up variants for a new item, you:**

1. Create a variant template (or reuse an existing one)
2. Define the variant codes, stages, days, and defaults on the template lines
3. Apply the template to the item from the Item Variants page
4. The system creates or updates all variants on the item and its components

---

## When to use it

Use variant templates when:

- Setting up blooming stage variants on a new item
- Applying a standard set of variants across multiple items
- Standardizing variant configurations across rollup items and their components

> **Note:** You can also create variants manually on the Item Variants page. Templates are most useful when you have a standard set of variants you apply to many items.

---

## What you need before you start

- A clear definition of which variants the item needs (variant codes, blooming stages, number of days per stage)
- Knowledge of which variant is the default for sales, purchasing, and production
- If applying to a rollup item: the rollup item and its component items must already exist

---

## How to create a variant template

### Step 1: Open the Variant Template List

1. Search for **Variant Template List** in the Business Central search bar.
2. The list of existing templates opens.

### Step 2: Create a new template

1. Click **New** to create a new template.
2. The **Variant Template Card** opens.
3. Enter a `Code` (e.g., `GERANIUM-3STAGE`) and a `Description` (e.g., `Geranium 3-stage blooming`).

### Step 3: Add template lines

In the **Lines** section, add one line per variant:

1. `Variant Code` — The variant code to create on the item (e.g., `GB`, `BB`, `FB`)
2. `CLE Stage` — The numeric sequence (1, 2, 3)
3. `CLE Blooming Stage` — The blooming stage name (Green Bud, Bud & Bloom, Full Bloom)
4. `CLE No. of Days` — How many days before this stage advances to the next
5. `CLE Sales Default` — Check for the variant used by default on sales orders
6. `CLE Purchase Default` — Check for the variant used by default on purchase orders
7. `CLE Production Default` — Check for the variant used by default on production orders

> **Tip:** Only one variant per template should be marked as the Sales Default, one as Purchase Default, and one as Production Default. These determine what variant is auto-filled when no specific variant is selected.

### Step 4: Save and close

The template saves automatically as you enter data. Close the card when done.

---

## How to apply a template to an item

### Step 1: Open the Item Variants page

1. Open the **Item Card** for the item.
2. Navigate to **Item** > **Variants** to open the **Item Variants** page.

### Step 2: Apply the template

1. Click **Apply Variant Template** in the action bar.
   - This action is visible only when the item has component items (is a rollup item).
2. The **Variant Template List** opens.
3. Select the template you want to apply and click **OK**.

### Step 3: Review the result

The system creates or updates variants on the item based on the template lines:

- If a variant code from the template already exists on the item, it is **updated** with the template values.
- If a variant code does not exist, it is **created**.
- If the item is a rollup item, the same template is automatically applied to every component item.

A confirmation message shows how many variants were created or updated.

---

## How to sync variants to component items

If you modify variants manually on a rollup item (instead of using a template), you can push those changes to all component items:

### Step 1: Open the Item Variants page

1. Open the **Item Card** for the rollup item.
2. Navigate to **Item** > **Variants**.

### Step 2: Make your changes

Edit, add, or remove variants as needed. The following fields are synced to components:

- Variant Code
- CLE Stage
- CLE Blooming Stage
- CLE No. of Days
- CLE Sales Default, CLE Purchase Default, CLE Production Default

### Step 3: Sync to components

**Option A — Manual sync:**

1. Click **Sync to Components** in the action bar.
2. The system copies all variant codes and CLE fields from the rollup item to every component item.
3. A summary message shows how many variants were added or updated.

**Option B — Automatic prompt on close:**

1. If you modified or added variants and close the page, the system asks: *"You have made changes to variants on this item. Do you want to sync them to component items now?"*
2. Click **Yes** to sync, or **No** to skip.

---

## What happens after you finish

Once variants are applied:

1. **Item Variants page** — Shows all variants with their blooming stage configuration, sorted by stage number.
2. **Sales orders** — The Sales Default variant is auto-filled on new sales lines for this item.
3. **Purchase orders** — The Purchase Default variant is auto-filled on new purchase lines.
4. **Production orders** — The Production Default variant is used for stage date calculations.
5. **Component items** — All component items have the same variant set as the rollup item.

---

## Field reference

### Template header

| Field         | What it means                        | Can you edit it? |
|---------------|--------------------------------------|------------------|
| `Code`        | Unique identifier for the template   | Yes              |
| `Description` | Description of what this template is | Yes              |

### Template lines

| Field                    | What it means                                                          | Can you edit it? |
|--------------------------|------------------------------------------------------------------------|------------------|
| `Variant Code`           | The variant code that will be created on the item                      | Yes              |
| `CLE Stage`              | Numeric sequence (1, 2, 3, ...) — determines sort order               | Yes              |
| `CLE Blooming Stage`     | The blooming stage name (Green Bud, Bud & Bloom, Full Bloom, etc.)    | Yes              |
| `CLE No. of Days`        | Days before this stage advances to the next                            | Yes              |
| `CLE Sales Default`      | Check to make this the default variant on sales orders                 | Yes              |
| `CLE Purchase Default`   | Check to make this the default variant on purchase orders              | Yes              |
| `CLE Production Default` | Check to make this the default variant on production orders            | Yes              |

### Item Variants page (additional CLE fields)

| Field            | What it means                                                     | Can you edit it? |
|------------------|-------------------------------------------------------------------|------------------|
| `CLE Stage`      | Numeric sequence for this variant                                 | Yes              |
| `CLE Blooming Stage` | Blooming stage (visible only when feature is active)         | Yes              |
| `CLE No. of Days` | Days before advancing to next stage (visible only when active)  | Yes              |
| `CLE Inventory`  | Current inventory quantity for this variant (calculated)          | No               |

---

## Troubleshooting

### The "Apply Variant Template" button is not visible

**Cause:** The item does not have any component items. The button is only shown for rollup items.

**Solution:** If the item should be a rollup item, verify that component items have their `Rollup Item No.` field set to this item. If it is a standalone item, apply the template manually by creating variants on the Item Variants page using the template as a reference.

---

### The "Sync to Components" button is not visible

**Cause:** Same as above — the item has no component items.

**Solution:** Verify the rollup relationship. Component items must have their `Rollup Item No.` set to the parent item number.

---

### Error when deleting a variant: inventory exists on component items

**Cause:** You tried to delete a variant from a rollup item, but one or more component items still have inventory in that variant.

**Solution:** You cannot delete a variant while component items have inventory recorded against it. First, reclassify or consume the inventory on the affected component items, then try deleting again.

---

### Applied a template but variants look wrong

**Cause:** If the item already had variants, the template **updates** existing ones and **adds** missing ones. It does not delete variants that are not in the template.

**Solution:** Manually remove any unwanted variants from the Item Variants page after applying the template.

---

## FAQ

**Can I apply the same template to multiple items?**

Yes. Templates are reusable. Apply the same template to as many items as needed.

**Does applying a template delete existing variants?**

No. The template only creates new variants or updates existing ones. It never deletes variants. Remove unwanted variants manually.

**What happens if I re-apply a template after changing it?**

The system updates existing variant codes to match the new template values and creates any new variant codes that were added. Previously applied variants that are no longer in the template remain unchanged.

**Do I need to sync to components every time I change a variant?**

If you change variants on a rollup item using the Item Variants page, the system prompts you to sync when you close the page. If you use **Apply Variant Template**, the cascade to components is automatic.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/variant-template-user-guide.pdf)
