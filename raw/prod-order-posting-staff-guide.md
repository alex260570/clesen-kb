# Production Order Posting - Staff Guide

**Version:** 1.1
**For Production Floor Staff**
**Last Updated:** 2026-03-16

---

## Table of Contents
1. [Overview](#overview)
2. [Posting Output](#posting-output)
3. [Adjusting Quantity Down (Scrapping)](#adjusting-quantity-down-scrapping)
4. [Adjusting Quantity Up (Recovery)](#adjusting-quantity-up-recovery)
5. [Common Scenarios](#common-scenarios)
6. [Troubleshooting](#troubleshooting)

---

## Overview

This guide covers the daily tasks for posting production output and adjusting production order quantities. You will learn how to:
- Post finished output quantities
- Record scrap when products don't meet quality standards
- Adjust production order quantities up or down

**Important:** Always ensure you have the correct production order open before posting.

> **Note:** Some items track blooming stages (Green Bud, Bud & Bloom, Full Bloom). On these production orders, you will see a `CLE Blooming Stage` field on the order lines showing the current stage. The system advances this stage automatically based on scheduled dates. When posting output at the final phase, the `Variant Code` field is pre-filled to match the current blooming stage — verify it looks correct before posting.

---

## Posting Output

### When to Use
Use this function when:
- You've completed a production phase (e.g., seeding, growing, ready)
- You need to record finished goods
- You have scrap to report from the current phase

### Step-by-Step Instructions

#### 1. Open the Production Order
- Navigate to **Released Production Orders**
- Find your production order using the search or filter
- Open the order

#### 2. Start Post Output
- Click the **Post Output** action (or press **F9**)
- The Post Output dialog opens

#### 3. Review Pre-filled Information
The system automatically fills in:
- **Current Phase:** Shows which production phase you're posting for
- **Posting Date:** Today's date
- **Output Quantity:** The expected quantity to post

#### 4. Enter Your Information

**Output Quantity:**
- Enter the actual quantity produced
- This is the good, usable quantity
- Cannot exceed the calculated quantity

**Finished Checkbox:**
- ☑ Check if this phase is complete
- When checked, any difference between calculated and output becomes scrap

**Scrap Quantity:**
- Automatically calculated if "Finished" is checked
- Can be manually entered if not finished
- Example: Calculated 1030, Output 1000 → Scrap = 30

**Scrap Code:**
- **Required** if scrap quantity > 0
- Select from dropdown (e.g., QUALITY, DAMAGE, GROWTH)
- Describes why items were scrapped

**Run Time:**
- Enter the time spent on this phase (optional)
- Used for capacity planning

**Variant Code:**
- Required if your item has multiple variants
- Select the specific variant produced
- Only required at the final phase
- For items with blooming stage variants, the system **auto-fills** this field with the variant matching the production order line's current blooming stage
- You can override the auto-filled value if needed — use the lookup (three dots) to see all available variants

**Release Safety:**
- ☑ Check at the final phase
- Releases the safety buffer quantity
- Usually checked automatically for last phase

#### 5. Confirm and Post
- Review all entered information
- Click **OK**
- System confirms: "Output posted."

### What Happens Behind the Scenes
1. System creates an output journal entry
2. Capacity ledger updated with output and scrap
3. Production order quantity reduced by scrap amount
4. Safety quantity adjusted
5. If finished, remaining inventory counted for tracking

### Example: Posting Final Output

**Scenario:** Final phase (READY), production order for 1030 units

1. Open production order
2. Click **Post Output** (F9)
3. System shows:
   - Current Phase: READY
   - Calculated Output: 1030
4. You enter:
   - Output Quantity: 1000 (actual good units)
   - Finished: ☑ Checked
   - Scrap Quantity: 30 (auto-calculated)
   - Scrap Code: GROWTH (select from list)
   - Variant Code: ROSE-RED (if applicable)
   - Release Safety: ☑ Checked
5. Click **OK**

**Result:** 1000 units posted as finished goods, 30 units scrapped, order completed.

---

## Adjusting Quantity Down (Scrapping)

### When to Use
Use this function when:
- You need to reduce the production order quantity
- You discover more scrap than initially planned
- You want to cancel part of an order

### Step-by-Step Instructions

#### 1. Open the Production Order
- Navigate to **Released Production Orders**
- Find and open your production order

#### 2. Start Adjust Quantity
- Click the **Adjust Quantity** action
- The Adjust Quantity dialog opens

#### 3. Review Current Information
The system shows:
- **Current Phase:** Where to post the scrap
- **Current Quantity:** Current production order quantity
- **Posted Scrap:** Total scrap already posted

#### 4. Enter New Quantity
- **New Quantity:** Enter the reduced quantity you want
- System calculates scrap = Current - New
- Example: Current 1030, New 1000 → Scrap = 30

#### 5. Enter Scrap Code
- **Required** if production has started
- Select reason code from dropdown
- If production hasn't started, scrap code not needed

#### 6. Adjustment Only
- This field appears when allowed
- Only available if no production postings exist yet
- When checked: adjusts quantity without posting scrap transaction

#### 7. Confirm and Post
- Review the confirmation message
- Confirms: "30 Scrap with Code QUALITY will be posted. Is that correct?"
- Click **Yes** to proceed

### Important Rules

**If Production Has Started:**
- Scrap code is mandatory
- System posts actual scrap transaction
- Transaction history preserved

**If Production Has NOT Started:**
- Can adjust without scrap code
- System simply updates the quantity
- No scrap transaction created

**Special Case: Setting to Zero**
- System asks: "You are going to set this Production Order to 0. Do you really want to proceed?"
- If confirmed and no postings exist: deletes the production line
- If postings exist: posts scrap for entire remaining quantity

### Example: Reducing Quantity After Discovery

**Scenario:** Discovered more damage, need to reduce from 1030 to 980

1. Open production order (current qty: 1030)
2. Click **Adjust Quantity**
3. System shows:
   - Current Quantity: 1030
   - Posted Scrap: 20
4. You enter:
   - New Quantity: 980
   - Scrap Code: DAMAGE
5. System confirms: "50 Scrap with Code DAMAGE will be posted. Is that correct?"
6. Click **Yes**

**Result:** Order reduced to 980, scrap transaction posted for 50 units.

---

## Adjusting Quantity Up (Recovery)

### When to Use
Use this function when:
- Initial quality assessment was too pessimistic
- Some previously scrapped items are actually usable
- You need to increase the production order quantity

### Step-by-Step Instructions

#### 1. Open the Production Order
- Navigate to **Released Production Orders**
- Find and open your production order

#### 2. Start Adjust Quantity
- Click the **Adjust Quantity** action

#### 3. Enter New Higher Quantity
- **New Quantity:** Enter quantity higher than current
- Example: Current 950, New 975 → Increase by 25

#### 4. Check Posted Scrap
- System shows **Posted Scrap** amount
- You can only increase by the amount of posted scrap available
- Example: Posted Scrap 50 → Can increase up to 50

#### 5. Review Confirmation
System shows different messages based on situation:

**If Posted Scrap Available:**
- "The Order will be adjusted by 25. The existing scrap posting will be reduced by 25. Is that correct?"
- This recovers scrap back to usable quantity

**If No Scrap Available:**
- If production hasn't started: "The Order will be adjusted by 25. Is that correct?"
- If production has started: **ERROR** - "Cannot increase quantity. No scrap available to recover and production has already started."

#### 6. Confirm
- Click **Yes** to proceed
- System recovers scrap and increases order quantity

### Important Limitations

**Can Only Increase If:**
1. **Production hasn't started** - can increase freely by adjusting header
2. **Have posted scrap** - can recover from previously posted scrap

**Cannot Increase If:**
- Production has started AND no scrap available
- Trying to increase by more than available scrap

**Solution for Cannot Increase:**
- Create a new production order for additional quantity
- System message tells you: "Please create a new production order for the remaining X if necessary"

### Example: Scrap Recovery

**Scenario:** Previously scrapped 50, now realize 25 are actually good

1. Open production order
   - Current Quantity: 950
   - Posted Scrap: 50
2. Click **Adjust Quantity**
3. Enter New Quantity: 975 (increase by 25)
4. System confirms: "The Order will be adjusted by 25. The existing scrap posting will be reduced by 25. Is that correct?"
5. Click **Yes**

**Result:** 
- Order quantity now 975
- Posted scrap reduced to 25
- The 25 units recovered from scrap entries

### Example: Cannot Increase

**Scenario:** Try to increase but no scrap available

1. Open production order
   - Current Quantity: 1000
   - Posted Scrap: 0
   - Production has started (some output posted)
2. Click **Adjust Quantity**
3. Enter New Quantity: 1050
4. System shows ERROR: "Cannot increase quantity. No scrap available to recover and production has already started. Please create a new production order for the additional quantity if necessary."

**Solution:** Create a new production order for 50 units.

---

## Common Scenarios

### Scenario 1: Normal Production Finish
**Situation:** Everything went well, finishing production

**Steps:**
1. Post Output (F9)
2. Verify output quantity matches actual
3. Check "Finished"
4. Enter scrap if any
5. Release safety at final phase
6. Post

### Scenario 2: Major Quality Issue Mid-Production
**Situation:** Discovered 100 units are damaged during growing phase

**Steps:**
1. Adjust Quantity
2. Enter reduced quantity (Current - 100)
3. Select Scrap Code: DAMAGE
4. Confirm posting
5. Continue production with reduced quantity

### Scenario 3: Quality Re-assessment
**Situation:** 30 units marked as scrap, but 20 are actually acceptable

**Steps:**
1. Adjust Quantity
2. Increase quantity by 20
3. System recovers from posted scrap
4. Confirm recovery
5. Continue production

### Scenario 4: Cancel Order Before Start
**Situation:** Need to cancel production order that hasn't started

**Steps:**
1. Adjust Quantity
2. Enter New Quantity: 0
3. Confirm "You are going to set this Production Order to 0"
4. System deletes production line
5. Order header remains for audit trail

### Scenario 5: Partial Phase Completion
**Situation:** Posted some output, but phase not finished yet

**Steps:**
1. Post Output
2. Enter partial output quantity
3. Do NOT check "Finished"
4. Enter scrap if any
5. Post
6. Can post more output later for same phase

---

## Troubleshooting

### Problem: Cannot Post More Output Than Calculated
**Error:** "You can not post more Output than 1030. If you need to post more, adjust the quantity first."

**Solution:**
1. First increase the production order quantity using Adjust Quantity
2. Then post the additional output

### Problem: Scrap Code Required Error
**Error:** "Scrap Code may not be empty."

**Solution:**
- Always select a scrap code when posting scrap > 0
- If unsure which code to use, check with supervisor
- Common codes: QUALITY, DAMAGE, GROWTH, CLEANUP

### Problem: Variant Code Required
**Error:** "Variant Code may not be empty."

**Solution:**
- Required at final phase if item has variants
- Press lookup (three dots) in Variant Code field
- Select appropriate variant from list

### Problem: Cannot Increase Quantity
**Error:** "Cannot increase quantity. Insufficient scrap to recover."

**Solution:**
- Check Posted Scrap amount
- Can only increase up to that amount
- For additional quantity, create new production order

### Problem: Adjustment Only Grayed Out
**Issue:** Cannot check "Adjustment Only" checkbox

**Reason:**
- Production postings already exist
- Once posting start, must use scrap transactions
- This is correct behavior

### Problem: Wrong Phase Selected
**Issue:** Posted to wrong production phase

**Solution:**
1. Contact supervisor immediately
2. May need IT support to correct
3. Do not post additional transactions
4. Document what happened

### Problem: Posted Wrong Scrap Amount
**Issue:** Accidentally posted 100 instead of 10

**Solution:**
1. Use Adjust Quantity to increase back
2. Recovery from scrap up to the wrong amount
3. Document the correction
4. If cannot recover, contact supervisor

---

## Quick Reference Card

### Post Output (F9)
```
Required Fields:
- Output Quantity
- Scrap Code (if scrap > 0)
- Variant Code (if last phase with variants)

Key Checkboxes:
- Finished (completes phase)
- Release Safety (at final phase)
```

### Adjust Quantity
```
Decrease:
- Enter lower New Quantity
- Select Scrap Code (if production started)
- Confirm

Increase:
- Enter higher New Quantity
- Verify Posted Scrap available
- Confirm recovery
```

### When to Call Supervisor
- Cannot post or adjust (unexpected errors)
- Posted to wrong phase
- Need to increase but no scrap available
- Unsure which scrap code to use
- Any unusual situation

---

## Best Practices

1. **Always verify production order number** before posting
2. **Count carefully** before entering quantities
3. **Select correct scrap code** for accurate reporting
4. **Check variant code** at final phase
5. **Post immediately** after completing phase (don't delay)
6. **Document unusual situations** for quality tracking
7. **Ask supervisor** if unsure about any step

---

## Related Documentation
- [Manager Guide](prod-order-posting-manager-guide.md) - Safety adjustments and oversight
- [IT Troubleshooting Guide](prod-order-posting-it-troubleshooting-guide.md) - Technical issues

---

**Questions?** Contact your production supervisor or IT support.
