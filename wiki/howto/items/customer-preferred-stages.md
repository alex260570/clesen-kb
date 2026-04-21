---
title: Customer Preferred Blooming Stages
type: howto
tags: [items, variants, blooming-stages, sales-orders, customer-management]
created: 2026-04-21
updated: 2026-04-21
sources: [customer-preferred-stage-user-guide.md]
---

# Customer Preferred Blooming Stages

Configuring customer preferences for blooming stage variants on sales orders.

## What Is Customer Preferred Blooming Stage?

**Customer Preferred Blooming Stage** allows you to configure which blooming stage a customer prefers to receive. When a sales order is created for that customer, the system **automatically selects the variant matching their preference** instead of forcing manual selection.

**Example:** Customer ABC prefers "Bud & Bloom" stage roses. When you add roses to their sales order, the system auto-selects the Bud & Bloom variant instead of the default Green Bud.

**Prerequisite:** The "Activate Blooming Stages" feature must be enabled in Growing Setup. Without this, the system uses the Sales Default variant for all customers.

## Setting Customer Preferences

### Step 1: Open the Customer Card

1. Search for the customer or open their **Customer Card**
2. Scroll down to the **Blooming Stages** section
3. The section is only visible when the feature is active

### Step 2: Set the Preferred Stage

In the **Preferred Blooming Stage** field, select one of:

| Option | Meaning |
|--------|---------|
| **Green Bud** | Customer prefers early-stage plants (tight, unopened) |
| **Bud & Bloom** | Customer prefers partially open plants (mid-stage) |
| **Full Bloom** | Customer prefers fully open plants at peak beauty |
| **(blank)** | No preference; system uses Sales Default variant |

**Recommendation:** If the customer specified their preference, select it. If they didn't specify, leave blank to use Sales Default.

### Step 3: Set the Substitution Direction

In the **Stage Substitution** field, select how the system should behave if the preferred stage is unavailable:

| Option | Behavior | Example |
|--------|----------|---------|
| **Previous** | Try the earlier stage first | Bud & Bloom unavailable → try Green Bud |
| **Next** | Try the later stage first | Bud & Bloom unavailable → try Full Bloom |
| **No Preference** | Use Sales Default variant if preferred unavailable | Preferred unavailable → fall back to default |
| **(blank)** | Only use preferred stage; no substitution | No available → order short |

**Best practice:** Set this based on customer tolerance:
- Luxury customers wanting peak bloom → Prefer "Full Bloom" with "Next" (upgrade if needed)
- Budget-conscious customers → Prefer "Green Bud" with "Previous" (accept nothing)
- Flexible customers → Prefer specific stage but allow "Previous" or "Next" substitution

### Validation Rules

The system **prevents invalid combinations**:

| Invalid Combination | Why | Solution |
|---|---|---|
| **Full Bloom** + **Next** | No stage after Full Bloom except Overgrown (never substituted) | Choose "Previous" or "No Preference" |
| **Green Bud** + **Previous** | No stage before Green Bud | Choose "Next" or "No Preference" |

If you try to set an invalid combination, the system displays an error message.

## How It Works on Sales Orders

### Automatic Preference Application

When you create a sales order for a customer with a preferred blooming stage:

1. **Sales Header** — The customer's preferences are automatically copied:
   - Preferred Blooming Stage
   - Stage Substitution option

2. **Sales Lines** — When you enter an item with blooming stage variants:
   - System looks up the customer's preferred stage
   - Finds the variant matching that stage
   - Auto-fills the **Variant Code** on the line
   - The **CLE Blooming Stage** field shows the selected stage (read-only)

3. **Fallback Logic** — If the preferred variant can't be used:
   - Item has no blooming stage variants → Uses Sales Default
   - Customer has no preferred stage → Uses Sales Default
   - Preferred variant doesn't exist on the item → Uses Sales Default

**Result:** Customers always get their preferred stage without manual variant selection (in most cases).

### Changing the Customer on an Existing Order

⚠️ **Important:** If you change the customer on an existing sales header:

- New customer's preferences are copied to the sales header
- **Existing lines keep their original variant** (not updated)
- **New lines use the new customer's preferences**

**If you need to update existing lines after changing customer:** Manually change the Variant Code on each line, or delete and re-add lines.

## Shortage Substitution During Picking

During the picking process, if a sales line's variant is short on inventory, the system uses the customer's **Stage Substitution** preference to find an alternative:

### Substitution Algorithm

1. **First:** Tries the customer's preferred substitution direction
   - If "Previous": look for the earlier stage
   - If "Next": look for the later stage
2. **Second:** If nothing available in preferred direction, tries the opposite direction
   - If was "Previous", now tries "Next"
   - If was "Next", now tries "Previous"
3. **Third:** If still nothing, tries all remaining stages (except Overgrown)
4. **Final:** If no substitute found, line remains short

### Substitution Rules

- **Overgrown is NEVER used as a substitute** (quality too low)
- System checks available inventory across all standard locations
- Accounts for other pending picks on the same shipment date
- If substitute found in customer's preferred direction, flags as "preferred match"

**Example:** Customer prefers Bud & Bloom, substitution = "Next"
- Bud & Bloom short? → Try Full Bloom (preferred direction)
- Full Bloom also short? → Try Green Bud (opposite direction)
- All short? → Line remains short, alert picking

## Field Reference

### Customer Card — Blooming Stages Group

| Field | Description | Editable? | Required? |
|-------|---|---|---|
| **Preferred Blooming Stage** | Which stage customer wants (Green Bud, Bud & Bloom, Full Bloom, blank) | Yes | No |
| **Stage Substitution** | What to do if preferred is unavailable (Previous, Next, No Preference, blank) | Yes | No |

### Sales Header (Copied from Customer)

| Field | Description | Editable? |
|-------|---|---|
| **CLE Preferred Blooming Stage** | Copied from customer on order creation | Yes |
| **CLE Stage Substitution** | Copied from customer on order creation | Yes |

### Sales Line

| Field | Description | Editable? |
|-------|---|---|
| **Variant Code** | Selected variant (auto-filled from preference, or override) | Yes |
| **CLE Blooming Stage** | Blooming stage of the variant (auto-calculated) | No |

**You can always override the auto-selected variant** by manually changing the Variant Code field.

## Best Practices

✅ **DO:**
- Ask customers about their preferred blooming stage (don't assume)
- Set clear preferences for high-volume customers
- Choose substitution direction based on customer expectations
- Review and update preferences quarterly as customer needs change
- Test the preference on a new order before it goes into production
- Document customer preferences in notes for future reference
- Use "Previous" for quality-conscious customers
- Use "Next" for customers who accept upgrades

❌ **DON'T:**
- Set impossible combinations (Full Bloom + Next, Green Bud + Previous)
- Assume all customers want the same stage
- Change customer preferences without customer approval
- Leave preferences blank if customer specified a stage
- Create preferences for items that don't have blooming stage variants
- Manually change variants on every order (defeats purpose of preferences)

## Troubleshooting

### Issue: Blooming Stages Group Not Visible

**Cause:** Feature is not enabled in Growing Setup

**Solution:** Contact administrator to enable "Activate Blooming Stages" in Growing Setup

### Issue: Cannot Set Full Bloom with Next Substitution

**Cause:** Full Bloom is the last valid stage. "Next" would mean Overgrown, which is never allowed

**Solution:** Choose "Previous" or "No Preference" for the substitution direction

### Issue: Cannot Set Green Bud with Previous Substitution

**Cause:** Green Bud is the first stage. There is no earlier stage

**Solution:** Choose "Next" or "No Preference" for the substitution direction

### Issue: Preferred Variant Not Applied on Sales Lines

**Cause:** Item doesn't have blooming stage variants, or variant doesn't match customer's preference

**Solution:**
1. Open Item Variants page
2. Verify item has variants with matching **CLE Blooming Stage** values
3. Verify at least one variant matches customer's preference
4. Create missing variants if needed

### Issue: Existing Sales Lines Didn't Update When Customer Changed

**Cause:** By design, changing customer only affects new lines

**Solution:**
1. Delete existing lines and re-add them (they'll get new customer's preferences)
2. Or manually update Variant Code on each existing line

### Issue: Order Shows Wrong Variant

**Cause:** Preferred variant doesn't exist on the item, or customer has no preference set

**Solution:**
1. Check customer preferences are set correctly
2. Check item has all needed blooming stage variants
3. Manually override the Variant Code if needed
4. For future orders, verify item/customer combo works first

## FAQ

**Does this apply to blanket orders?**

Yes. The same preference logic applies when creating sales lines on blanket orders. Preferred variants auto-apply.

**What if a customer has no preferred stage?**

The system uses the item's Sales Default variant (same as before this feature existed).

**Can I override the auto-selected variant on a sales line?**

Yes. The Variant Code field is editable. Change it to any available variant on the item. This doesn't affect the customer's preference record—just this order.

**Does substitution happen automatically during picking?**

Yes. When the preferred variant is short, the shortage resolution system checks the customer's substitution preference and finds the closest available alternative.

**What is the difference between "No Preference" and leaving blank?**

Both result in Sales Default variant being used. "No Preference" explicitly indicates you've asked the customer and they don't care. Blank means preference hasn't been set yet.

**Can different customers have different preferences for the same item?**

Yes. Each customer can have their own preference. When you change customers on an order, preferences update (but existing lines don't).

## Related Pages

- [[variant-templates]] — Variant template creation and configuration
- [[blooming-stages]] — Blooming stage system and automatic advancement
- [[scouting-reports]] — Inventory visibility and picking planning
