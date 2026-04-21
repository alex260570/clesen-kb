---
title: Production Order Posting — Staff Guide
type: howto
tags: [production, posting, output, scrap, staff]
created: 2026-04-21
updated: 2026-04-21
sources: [prod-order-posting-staff-guide.md]
---

# Production Order Posting — Staff Guide

Record finished production output and adjust quantities for scrap or recovery.

## Posting Output

### When to Use
- Completed a production phase
- Need to record finished goods
- Have scrap to report

### Step-by-Step

1. **Open Production Order**
   - Navigate to **Released Production Orders**
   - Find your order

2. **Click Post Output (or press F9)**
   - Dialog opens showing:
     - Current production phase
     - Expected output quantity
     - Posting date

3. **Enter Information**

   **Output Quantity:** Amount of good, usable product (cannot exceed calculated)

   **Finished Checkbox:** ☑ if phase is complete
   - Converts any difference to scrap automatically

   **Scrap Quantity:** Amount of waste
   - Auto-calculated if "Finished" checked
   - Can be manually entered
   - **Required** if scrap > 0

   **Scrap Code:** Select reason (QUALITY, DAMAGE, GROWTH, etc.)
   - **Required** if scrap posted

   **Run Time:** Time spent on phase (optional, for capacity planning)

   **Variant Code:** Required at final phase if item has variants
   - System auto-fills with current blooming stage variant
   - Can override if needed

   **Release Safety:** ☑ at final phase
   - Releases safety buffer as available output

4. **Confirm and Post**
   - Click **OK**
   - System posts to inventory

### Example: Posting Final Output

**Scenario:** Final phase, 1030 units calculated

- Output Quantity: 1000
- Finished: ☑ Checked
- Scrap: 30 (auto-calculated)
- Scrap Code: GROWTH
- Release Safety: ☑ Checked
- Result: 1000 finished goods, 30 scrapped

## Adjusting Quantity Down (Scrapping)

### When to Use
- Reduce production order quantity
- Discover more scrap than initially planned
- Cancel part of order

### Step-by-Step

1. **Click Adjust Quantity**
2. **Review Current Information**
   - Current quantity
   - Already posted scrap
3. **Enter New Quantity**
   - System calculates: Scrap = Current - New
4. **Select Scrap Code** (required if production started)
5. **Confirm**
   - System shows: "X Scrap with Code Y will be posted. Correct?"
   - Click **Yes**

### Important Rules

**If Production Has Started:**
- Scrap code mandatory
- System posts actual scrap transaction
- History preserved

**If Production Hasn't Started:**
- Can adjust without scrap code
- System updates quantity directly
- No scrap transaction created

**Setting to Zero:**
- If no postings: deletes production line
- If postings exist: posts all remaining as scrap

## Adjusting Quantity Up (Recovery)

### When to Use
- Quality assessment too pessimistic
- Previously scrapped items actually usable
- Need to increase production quantity

### Step-by-Step

1. **Click Adjust Quantity**
2. **Enter New Higher Quantity**
3. **System Checks Posted Scrap**
   - Can only increase by available scrap amount
4. **Confirm Recovery**
   - Message: "Order will be adjusted by X. Existing scrap posting will be reduced by X. Correct?"
5. **Click Yes**

### Limitations

**Can Increase If:**
- Production hasn't started (freely)
- Have posted scrap available

**Cannot Increase If:**
- Production started AND no scrap available
- Requested increase exceeds available scrap

**Solution:** Create new production order for additional quantity

## Common Scenarios

### Normal Production Finish
1. Post Output
2. Verify output matches actual
3. Check "Finished"
4. Enter any scrap
5. Release safety at final phase
6. Post

### Major Quality Issue Mid-Production
1. Adjust Quantity
2. Enter reduced quantity
3. Select scrap code
4. Confirm
5. Continue with reduced quantity

### Quality Re-Assessment
1. Adjust Quantity
2. Increase quantity (recovers from posted scrap)
3. System recovers posted scrap
4. Continue production

### Cancel Order Before Start
1. Adjust Quantity
2. Set New Quantity: 0
3. Confirm (deletes production line)

### Partial Phase Completion
1. Post Output
2. Enter partial quantity
3. DO NOT check "Finished"
4. Enter scrap if any
5. Can post more output later

## Troubleshooting

### Cannot Post More Output Than Calculated
**Error:** "Cannot post more Output than 1030"

**Solution:** Use Adjust Quantity to increase order first, then post

### Scrap Code Required
**Error:** "Scrap Code may not be empty"

**Solution:** Always select code when scrap > 0

### Variant Code Required
**Error:** "Variant Code may not be empty"

**Solution:** At final phase with variants, select from lookup

### Cannot Increase Quantity
**Error:** "Cannot increase quantity. Insufficient scrap to recover"

**Solution:**
- Check Posted Scrap amount
- Can only increase up to that amount
- Create new order for additional quantity

## Best Practices

✓ Always verify production order number before posting  
✓ Count carefully before entering quantities  
✓ Select correct scrap code (accurate reporting)  
✓ Check variant code at final phase  
✓ Post immediately after completing phase  
✓ Document unusual situations  
✓ Ask supervisor if unsure  

## Quick Reference

**Post Output (F9):**
- Output Quantity (required)
- Scrap Code (if scrap > 0)
- Variant Code (if final phase with variants)
- Finished checkbox (completes phase)
- Release Safety (at final phase)

**Adjust Quantity:**
- Decrease: enter lower quantity + scrap code
- Increase: enter higher quantity (recovers scrap)

**When to Call Supervisor:**
- Cannot post/adjust (errors)
- Posted to wrong phase
- Need to increase but no scrap
- Unsure of scrap code

## Related Pages

- [[prod-order-overview]]
- [[prod-order-posting-manager]]
- [[prod-order-tasks-staff]]
