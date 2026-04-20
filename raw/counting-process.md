# Inventory Counting Process - Staff Guide

## What This Is

Inventory Counting is how you verify physical inventory matches what the system expects. The system automatically creates count lines for you based on different business needs (items shipping soon, production orders finishing, etc.). Your job is to count the physical items and enter the results.

**Last Updated:** February 10, 2026

## When You Count

- When you see lines in your **Inventory Count Sheet** with status "Released"
- Lines appear automatically based on automated count preparation
- Sorted by Location → Bin → Priority (count high priority items first)

## The Counting Process

### Step 1: Open Your Count Sheet

1. Open **Inventory Count Sheet** from your menu
2. System automatically filters to your assigned location/zone
3. You'll see lines sorted by priority (most important first)
4. Each line shows:
   - Item number and description
   - Location and bin code
   - Expected quantity (what system thinks is there)
   - Type of count
   - Source (Inventory or Production Order)

### Step 2: Find the Item

1. Go to the bin location shown on the line
2. Find the item (use item number or description)
3. For production orders, find items on the production line/bench

**Tip:** Lines are sorted to minimize walking - count items in order shown

### Step 3: Count Physically

**Count carefully:**
- Count ALL units of the item in that bin
- For plants: Include all pots/trays
- For cases: Count cases AND loose pieces
- Don't estimate - physical count only
- If item is in multiple bins, each bin has separate line

**Cases and Pieces:**
- If item is sold in cases (e.g., 6-packs), you can enter:
  - Number of cases in "Quantity Counted" 
  - Loose pieces in "Qty Base to Add"
  - System calculates total base quantity

### Step 4: Enter Count

**Option A: Manual Entry**
1. Click on the "Quantity Counted" field
2. Enter the quantity you physically counted
3. Press Tab or Enter

**Option B: Barcode Scanning** *(Planned - Not Yet Available)*
1. Click "Scan" button
2. Use device camera to scan barcode
3. System finds item automatically
4. Enter quantity in dialog
5. Submit

**Note:** Barcode scanning feature is currently in development and not yet available.

### Step 5: Submit Count

1. After entering quantity, click **"Finish & Submit"** button
2. System validates your count:
   - If count is close to expected → Accepted
   - If count differs significantly → Warning message appears
   - Review warning and confirm if count is correct
3. Line disappears from your sheet (status changes to "Counted")

**Important:** If you made a mistake, tell your supervisor immediately - they can reset the line for recount

## Understanding Count Results

### Your Count Matches Expected
- No warning shown
- Line processed automatically
- Inventory adjusted if needed

### High Deviation Warning

**Message:** "The counted quantity differs significantly from expected. Are you sure?"

**What it means:**
- Your count is very different from what system expected
- Could be:
  - Real inventory discrepancy (correct count)
  - Counting error (wrong count)
  - Items moved during counting

**What to do:**
1. **If you're confident:** Click Yes - count is submitted
2. **If unsure:** Click No - recount the item
3. **If confused:** Ask supervisor

### System Will Recount

If your first count has high deviation:
- System automatically requests **recount**
- Line appears again with status "Recount Request"
- Count the item again carefully
- If second count still differs → Supervisor will review

## Types of Count Sources

### Inventory Counts
- Physical bin content
- Regular warehouse bins
- What you see in the bin should match what you count

### Production Order Counts
- Items currently in production
- On production benches/lines
- Count what's physically there right now
- Production may not be complete yet

## Common Situations

### "I can't find the item in the bin"

**What to do:**
1. Double-check bin code - are you in the right location?
2. Check nearby bins - may have been moved
3. Check if item is out for picking
4. **Enter zero (0)** if truly not there
5. Tell supervisor - this is important

### "Item is in multiple locations"

**This is normal:**
- Each bin has its own count line
- Count only what's in the specified bin
- Don't add up items from other bins
- System tracks each bin separately

### "Expected quantity shows zero but items are here"

**What to do:**
- Count what's physically there
- Enter the actual quantity
- System expected zero but you found inventory
- This is exactly what counting is for!

### "Production order items - some are finished, some aren't"

**What to do:**
- Count ALL items for that production order
- Include finished and unfinished
- System tracks remaining quantity to produce
- Your count helps adjust for scrap/waste

### "Can I skip lines?"

**No - count in order:**
- Lines are prioritized for business reasons
- High priority items need counting first
- Complete lines in order shown
- If you must skip, tell supervisor

### "Line disappeared before I counted it"

**Possible reasons:**
1. Someone else counted it
2. System reset it (zone started picking)
3. Production order finished
4. Check with supervisor if needed

## Barcode Scanning *(Planned - Not Yet Available)*

When barcode scanning becomes available:

### How It Will Work:

1. Click **"Scan"** button on count sheet
2. Point device camera at barcode on item label
3. System reads GTIN/barcode and finds matching item
4. If multiple lines exist (Inventory + Production Order), you'll choose which one
5. Dialog appears for entering count:
   - Cases field
   - Pieces field
6. Click OK to submit

**Benefits:**
- Faster than manual lookup
- Reduces typing errors
- Confirms you're counting correct item

**Note:** This feature is currently in development and not yet available.

## Tips for Accurate Counting

✓ **Count during quiet times** - Fewer interruptions = better accuracy  
✓ **Count methodically** - Don't rush, accuracy matters  
✓ **Recount if unsure** - Better to take extra time than be wrong  
✓ **Keep bin organized** - Makes counting easier  
✓ **Report issues immediately** - Don't wait until end of day  
✓ **Follow priority order** - High priority items count first  
✓ **Zero is a valid count** - If bin is empty, enter 0  
✓ **Don't estimate** - Always physical count

## What Happens After You Submit

1. **System processes your count** (automated, every minute)
2. **Calculates adjustment needed:**
   - If inventory increased → Positive adjustment
   - If inventory decreased → Negative adjustment
3. **Posts adjustment** (if within acceptable range)
4. **Updates inventory** in system
5. **Archives count line** with history

**If outside acceptable range:**
- First time → System requests recount (you'll see line again)
- Second time → Supervisor reviews and approves

## Quality Standards

**Your counting accuracy matters:**
- Affects inventory accuracy
- Impacts customer orders
- Prevents stockouts
- Reduces waste

**Performance expectations:**
- Count carefully, not quickly
- Accuracy more important than speed
- Report discrepancies honestly
- Ask questions when unsure

## Where to Find This

**Menu:** Inventory → Inventory Count Sheet  
**Page Name:** Inventory Count Lines  
**Used by:** Warehouse Staff, Counters  
**Your Role:** Physical Counting

## Need Help?

**If you need assistance:**
- Ask your supervisor
- Check history entries on line (shows previous counts/activities)
- Review this guide
- Don't guess - accuracy is critical!

---

## Related documents

- [[counting-system-overview]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-release]]
- [[understanding-count-types]]
- [[count-processing]]
- [[counting-exception-handling]]

---

*For manager-level information about count types, automation, and exception handling, see the Manager's Guides.*
