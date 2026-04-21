---
title: Variant Templates
type: howto
tags: [items, variants, blooming-stages, templates, configuration]
created: 2026-04-21
updated: 2026-04-21
sources: [variant-template-user-guide.md]
---

# Variant Templates

Reusable sets of blooming stage variants that cascade configurations to items and rollup components.

## What Is a Variant Template?

A **Variant Template** is a master configuration that defines a complete set of blooming stage variants (Green Bud → Bud & Bloom → Full Bloom → Overgrown). Instead of manually creating variants on each item, you create a template once and apply it to multiple items.

**Key benefit:** Changes to the template automatically cascade to all component items in rollup relationships, keeping the entire item family synchronized.

## Variant Template Components

Each template line defines:

| Field | Description | Example |
|-------|-------------|---------|
| **Variant Code** | Unique identifier for this stage | GB, BB, FB, OG |
| **CLE Stage** | Numeric sequence (controls advancement order) | 10, 20, 30, 40 |
| **CLE Blooming Stage** | Human-readable name | Green Bud, Bud & Bloom, Full Bloom, Overgrown |
| **CLE No. of Days** | Days before auto-advancing to next stage | 5, 7, 14, 999 |
| **CLE Sales Default** | Default variant on sales orders | ✓ (checked for one stage) |
| **CLE Purchase Default** | Default variant on purchase orders | ✓ (checked for one stage) |
| **CLE Production Default** | Default variant on production orders | ✓ (checked for one stage) |

## Creating a Variant Template

### Step 1: Access Variant Templates

1. Use the search function (Alt+Q) and type **"Variant Templates"**
2. Click **Variant Templates** to open the list
3. Click **+ New** to create a new template

### Step 2: Configure Template Header

Fill in:

- **Code** — Short identifier (e.g., `STANDARD`, `PREMIUM`, `SEASONAL`)
- **Description** — Full name (e.g., "Standard 4-Stage Blooming Template")

### Step 3: Add Stage Lines

Click into the **Lines** repeater and add each stage:

1. Enter **Variant Code** (e.g., GB for Green Bud)
2. Enter **CLE Stage** as a numeric sequence (10, 20, 30, 40...)
   - Order must be sequential for auto-advancement to work
3. Enter **CLE Blooming Stage** name (user-facing label)
4. Enter **CLE No. of Days** before advancing
   - Use 999 (or high number) for final stage to prevent further advancement
5. Check appropriate defaults:
   - Check **CLE Sales Default** for the default selling stage (usually first or second stage)
   - Check **CLE Purchase Default** for incoming purchase orders (usually first stage)
   - Check **CLE Production Default** for production orders (usually first stage)

**Example Template: STANDARD**

| Variant Code | CLE Stage | CLE Blooming Stage | CLE No. of Days | Sales Def | Purch Def | Prod Def |
|---|---|---|---|---|---|---|
| GB | 10 | Green Bud | 5 | ☑ | ☑ | ☑ |
| BB | 20 | Bud & Bloom | 7 | | | |
| FB | 30 | Full Bloom | 14 | | | |
| OG | 40 | Overgrown | 999 | | | |

### Step 4: Save and Verify

1. Close the template to save
2. Verify template appears in Variant Templates list
3. Note the template code for item application

## Applying Templates to Items

### Apply to Single Item

1. Open **Item Card** (search for item)
2. Navigate to the **Variants** section
3. Click **Apply Variant Template**
4. Select the template code
5. Confirm — system generates variant lines from template

**Result:** Item now has variants for each stage (GB, BB, FB, OG)

### Apply to Item Family (Rollups)

When you apply a template to an **item that has components**:

1. Open item card
2. Click **Apply Variant Template**
3. Select template
4. Check **Apply to Components** (if offered)
5. Confirm

**Cascade logic:**
- Template applied to parent item
- **Automatically cascades** to all component items
- All components synced to same stages
- Ensures consistency across rollup relationships

**Example:**
- Parent item: "Rose Bush Package" (ROLLER)
- Components: Green Bud Rose, Bud & Bloom Rose, Full Bloom Rose
- Apply STANDARD template to parent → automatically applies to all 3 components

### Updating Existing Variants

To update variants already applied:

1. Modify template (add/remove lines, change day counts)
2. Open affected item
3. Click **Refresh Template** (if available)
4. Or delete old variants and re-apply template

**Note:** Refreshing template will overwrite existing variant configurations for that item.

## Template Defaults

### Understanding the Default Flags

When you create a sales order, purchase order, or production order, the system pre-selects a default variant:

- **Sales Default** — Variant automatically populated on new sales order lines
  - Typically first or second stage (what customers purchase)
- **Purchase Default** — Variant pre-filled on inbound purchase orders
  - Typically first stage (what comes from supplier)
- **Production Default** — Variant pre-filled on production orders
  - Typically first stage (what gets produced)

**Only ONE stage can have each default flag checked.** If you check "Sales Default" for two variants, the system uses the first one found.

### Changing Defaults

If you need a different stage as the default:

1. Open template
2. Find the line with the current default (flag ✓)
3. Uncheck that flag
4. Move to preferred line and check that flag
5. Save

**Affected documents:** Only NEW documents after the change use the updated default. Existing orders keep their current variant.

## Best Practices

✅ **DO:**
- Create templates for consistent blooming stages (reduces manual item setup)
- Use numeric CLE Stage fields in clear sequences (10, 20, 30, 40...)
- Set high day counts (999) for final stage to prevent unwanted advancement
- Check exactly one default per document type
- Document template purpose in Description field
- Test template on a single item before bulk application
- Use component cascading to keep rollups synchronized
- Review templates quarterly for accuracy

❌ **DON'T:**
- Leave CLE Stage numbers out of sequence (breaks advancement logic)
- Check multiple defaults for the same document type (creates confusion)
- Apply different templates to parent and component items (breaks rollup consistency)
- Use low day counts (< 1) for final stage (items advance too quickly)
- Modify templates without re-testing affected items
- Create redundant templates with same stages but different day counts

## Common Scenarios

### Scenario 1: Standard Blooming Template

**Goal:** Create a 4-stage template used on all roses and carnations

**Setup:**
1. Create template `STANDARD` with stages: GB (5d), BB (7d), FB (14d), OG (999d)
2. Set GB as all three defaults (sales, purchase, production)
3. Apply to items: Rose-Red, Rose-White, Carnation-Pink, etc.
4. All items now have synchronized variants

**Result:** All items follow same blooming timeline, consistent purchasing and sales

### Scenario 2: Premium Blooming Template

**Goal:** Premium flowers held longer before sale

**Setup:**
1. Create template `PREMIUM` with stages: GB (7d), BB (10d), FB (21d), OG (999d)
2. Set BB as sales default (start selling at Bud & Bloom)
3. Set GB as purchase/production defaults
4. Apply to: Premium-Rose-Gold, Premium-Orchid, etc.

**Result:** Premium items held 7 days before sale-ready (longer maturity), longer blooming window

### Scenario 3: Seasonal Quick-Turnaround Template

**Goal:** Holiday inventory moves fast, shorter stage times

**Setup:**
1. Create template `SEASONAL` with stages: GB (2d), BB (3d), FB (7d), OG (999d)
2. Set BB as sales default (quicker to market)
3. Apply to holiday items: Holiday-Poinsettia, Holiday-Amaryllis, etc.

**Result:** Seasonal inventory advances quickly, reducing holding costs

## Troubleshooting

### Issue: Template Not Applying to Components

**Cause:** "Apply to Components" option not checked, or item has no component relationships

**Solution:**
1. Verify item has components (check BOM)
2. Re-apply template with "Apply to Components" enabled
3. Check that parent item is actually a ROLLER or BOM item type

### Issue: Variants Have Different Stage Numbers After Application

**Cause:** Applied different templates to parent and component

**Solution:**
1. Delete all variants on components
2. Apply single template to parent with cascade option
3. Verify all variants sync to same stage sequence

### Issue: Sales Order Not Using Default Variant

**Cause:** Default flag may not be set, or variant code doesn't match

**Solution:**
1. Open template
2. Verify exactly one variant has "CLE Sales Default" checked
3. Create new sales order line (uses defaults)
4. Verify variant code matches template variant code

## Related Pages

- [[variant-reclassification]] — Moving inventory between blooming stages
- [[blooming-stages]] — Blooming stage system and automatic advancement
- [[item-attributes]] — Bulk attribute assignment to items
