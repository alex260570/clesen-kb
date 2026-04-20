# Customer preferred blooming stage

> **Version:** 1.0
> **Last Updated:** 2026-03-16
> **Author:** Alexander Thiel
> **Audience:** Sales Staff, Operations Staff

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to set a customer's preferred blooming stage](#how-to-set-a-customers-preferred-blooming-stage)
- [How it works on sales orders](#how-it-works-on-sales-orders)
- [How shortage substitution works](#how-shortage-substitution-works)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

The **Customer Preferred Blooming Stage** feature lets you configure which blooming stage a customer prefers to receive. When a sales order is created for that customer, the system automatically selects the variant matching their preference.

If the preferred stage is out of stock, the system can substitute with a nearby stage based on the customer's configured substitution direction.

**Example:** A customer prefers Bud & Bloom. When you add an item with blooming stage variants to their sales order, the system auto-selects the Bud & Bloom variant instead of the default.

---

## When to use it

Use this feature when:

- A customer has a standing preference for a specific blooming stage
- You want to automate variant selection on sales orders instead of picking variants manually
- You want the picking system to substitute with the right stage when the preferred one is unavailable

> **Note:** This feature only works when **Activate Blooming Stages** is enabled in Growing Setup. If blooming stages are not active, the system uses the Sales Default variant for all customers.

---

## What you need before you start

- The **Activate Blooming Stages** feature must be enabled in Growing Setup
- The item must have blooming stage variants configured
- You need to know the customer's preferred stage and substitution preference

---

## How to set a customer's preferred blooming stage

### Step 1: Open the Customer Card

1. Search for the customer or open their **Customer Card**.
2. Scroll down to the **Blooming Stages** group.

> **Note:** The Blooming Stages group is only visible when the feature is active.

### Step 2: Set the preferred stage

In the `Preferred Blooming Stage` field, select one of:

- **Green Bud** — Customer prefers early-stage plants
- **Bud & Bloom** — Customer prefers partially open plants
- **Full Bloom** — Customer prefers fully open plants
- *(blank)* — No preference; the system uses the Sales Default variant

### Step 3: Set the substitution direction

In the `Stage Substitution` field, select one of:

- **Previous** — If preferred stage is unavailable, try the earlier stage first (e.g., Bud & Bloom not available → try Green Bud)
- **Next** — If preferred stage is unavailable, try the later stage first (e.g., Bud & Bloom not available → try Full Bloom)
- **No Preference** — Use the Sales Default variant if the preferred stage is unavailable
- *(blank)* — No substitution; only the preferred stage is used

### Validation rules

The system prevents invalid combinations:

| Preferred Stage | Cannot be combined with |
|----------------|------------------------|
| Full Bloom     | Substitution = Next (there is no stage after Full Bloom except Overgrown, which is never auto-substituted) |
| Green Bud      | Substitution = Previous (there is no stage before Green Bud) |

---

## How it works on sales orders

When you create a sales order for a customer with a preferred blooming stage:

1. **Sales Header** — The customer's `Preferred Blooming Stage` and `Stage Substitution` are copied to the sales header automatically.

2. **Sales Lines** — When you enter an item on a sales line:
   - If the item has blooming stage variants, the system looks up the customer's preferred stage.
   - It finds the variant matching that stage and auto-fills the `Variant Code` on the line.
   - The `CLE Blooming Stage` field on the line shows the selected stage (read-only).

3. **Fallback logic:**
   - If the item has no blooming stage variants → Sales Default variant is used.
   - If the customer has no preferred stage → Sales Default variant is used.
   - If the preferred variant does not exist on the item → Sales Default variant is used.

> **Note:** Changing the customer on an existing sales header copies the new customer's preferences to the header, but does **not** update existing sales lines. Only new lines added after the change use the new preferences.

---

## How shortage substitution works

During the picking process, if a sales line's variant is short on inventory, the system uses `GetAvailableSubstituteVariant` to find an alternative:

1. **First:** Tries the customer's preferred substitution direction (Previous or Next).
2. **Second:** If nothing is available in the preferred direction, tries the opposite direction.
3. **Third:** If still nothing, tries all remaining stages (except Overgrown).
4. **If no substitute is found:** The line remains short.

**Rules:**
- Overgrown is **never** used as a substitute.
- The system checks available inventory across all standard locations, accounting for other pending picks.
- If a substitute is found in the customer's preferred direction, it is flagged as a preferred match.

---

## Field reference

### Customer Card — Blooming Stages group

| Field                      | What it means                                                         | Can you edit it? |
|----------------------------|-----------------------------------------------------------------------|------------------|
| `Preferred Blooming Stage` | The stage the customer prefers to receive (Green Bud, Bud & Bloom, Full Bloom, or blank) | Yes |
| `Stage Substitution`       | What to do if the preferred stage is unavailable (Previous, Next, No Preference, or blank) | Yes |

### Sales Header (copied from customer)

| Field                      | What it means                                            | Can you edit it? |
|----------------------------|----------------------------------------------------------|------------------|
| `CLE Preferred Blooming Stage` | Copied from customer on header creation              | Yes              |
| `CLE Stage Substitution`      | Copied from customer on header creation              | Yes              |

### Sales Line

| Field                | What it means                                                    | Can you edit it? |
|----------------------|------------------------------------------------------------------|------------------|
| `Variant Code`       | The selected variant (auto-filled from customer preference)      | Yes              |
| `CLE Blooming Stage` | The blooming stage of the selected variant (synced automatically)| No               |

---

## Troubleshooting

### The Blooming Stages group is not visible on the Customer Card

**Cause:** The Blooming Stages feature is not enabled.

**Solution:** Contact your administrator to enable **Activate Blooming Stages** in Growing Setup.

---

### Error: Cannot set Full Bloom with Next substitution

**Cause:** Full Bloom is the last valid stage. Setting substitution to "Next" would mean substituting to Overgrown, which is never allowed.

**Solution:** Choose a different substitution direction (Previous or No Preference) or a different preferred stage.

---

### Error: Cannot set Green Bud with Previous substitution

**Cause:** Green Bud is the first stage. There is no earlier stage to substitute to.

**Solution:** Choose a different substitution direction (Next or No Preference) or a different preferred stage.

---

### Customer's preferred variant is not being applied on sales lines

**Cause:** Possible reasons:

- The item does not have blooming stage variants configured.
- The item does not have a variant matching the customer's preferred stage.
- The Blooming Stages feature is not active.

**Solution:** Verify the item has blooming stage variants by opening the Item Variants page. Check that one variant has a `CLE Blooming Stage` matching the customer's preference.

---

### Existing sales lines did not update when I changed the customer

**Cause:** By design, changing the customer on a header only affects **new** lines. Existing lines keep their original variant.

**Solution:** Manually update the `Variant Code` on existing lines if needed, or delete and re-add the lines.

---

## FAQ

**Does this feature affect blanket orders?**

Yes. The same logic applies when creating sales lines on blanket orders. The customer's preferred variant is auto-applied.

**What if a customer has no preferred stage set?**

The system uses the item's Sales Default variant, just like it did before this feature existed.

**Can I override the auto-selected variant on a sales line?**

Yes. The `Variant Code` field on the sales line is editable. You can change it to any variant available on the item.

**Does the substitution happen automatically during picking?**

Yes. The shortage resolution system checks the customer's substitution preference when their preferred variant is short and finds the closest available alternative.

**What is the difference between "No Preference" and leaving the field blank?**

Both result in the Sales Default variant being used. "No Preference" explicitly indicates the customer has been asked and does not care. Blank means the preference has not been set.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/customer-preferred-stage-user-guide.pdf)
