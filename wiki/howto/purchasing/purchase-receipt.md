---
title: Purchase Receipt
type: howto
tags: [purchasing, receiving, quality-control, warehouse]
created: 2026-04-21
updated: 2026-05-01
sources: [purchase-receipt-process.md, purchase-receipt-staff-guide.md, purchase-receipt-manager-guide.md]
---

# Purchase Receipt

Manage incoming vendor shipments with streamlined receiving and quality hold capabilities. This comprehensive guide covers staff procedures and manager oversight.

## Key Features

- **Simplified receiving interface** — Focused on essential fields only
- **Quality hold process** — Route problematic items to quarantine automatically
- **Variant flexibility** — Adjust item variants during receiving if vendor substituted
- **Partial receiving** — Receive shipments in multiple batches
- **Quarantine location routing** — Automatic location assignment for hold items
- **Reason code tracking** — Document why items placed on hold

## Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Vendor Delivery Arrives                                  │
│    - Physical shipment at receiving dock                     │
│    - Packing slip/BOL provided                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Staff Opens Purchase Receipts List                       │
│    - Finds matching PO by vendor and date                   │
│    - Opens purchase receipt card                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Data Entry                                               │
│    - Enter Vendor Shipment No. (REQUIRED)                   │
│    - Count items and enter quantities                       │
│    - Adjust variants if substitutions                       │
│    - Update bin codes if needed                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ├──────────────────────────┐
                     │                          │
          All Items Good                  Some Items Problem
                     │                          │
                     ▼                          ▼
┌────────────────────────────────┐    ┌──────────────────────────┐
│ 4a. Standard Posting      │    │ 4b. Quality Hold Process │
│     - Press F9             │    │     - Select problem line│
│     - All to warehouse     │    │     - Click "To Hold"    │
│     - Done!                │    │     - Enter quantity     │
└────────────────────────────┘    │     - Select reason code │
                                   │     - Line splits/moves  │
                                   │     - Press F9 to post   │
                                   └────────┬─────────────────┘
                                            │
                                            ▼
                     ┌──────────────────────────────────────────┐
                     │ 5. Posted Purchase Receipt Created       │
                     │    - Good items → Warehouse (MAIN, etc.) │
                     │    - Hold items → Quarantine (HOLD-01)   │
                     │    - Inventory updated in both locations │
                     └──────────────────┬───────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Post-Receipt Processing                                  │
│    - Good items: Available for picking immediately          │
│    - Hold items: Routed to quality team for inspection      │
│    - Manager reviews hold items and decides disposition     │
│    - Options: Release to warehouse, return to vendor, scrap │
└─────────────────────────────────────────────────────────────┘
```

## Key Concepts

### Quality Hold System

**Purpose:** Route items needing inspection or having issues to quarantine location instead of regular warehouse.

**How It Works:**
- Each warehouse location (MAIN, WEST, etc.) has an assigned **Quarantine Location** (HOLD-01, HOLD-02, etc.)
- Staff clicks "To Hold Location" on problem line
- Enters quantity and selects **Reason Code** (DAMAGE, QUALITY, SHORTAGE, etc.)
- System automatically:
  - Creates new line (partial hold) OR modifies existing line (full hold)
  - Routes to quarantine location
  - Applies reason code for tracking

**Business Value:**
- Prevents problematic items from being picked for orders
- Tracks quality issues by vendor and reason
- Enables inspection workflow
- Simplifies returns and credits

### Standard Reason Codes

| Code | Purpose |
|------|---------|
| **DAMAGE** | Physical damage (broken, crushed, bent) |
| **QUALITY** | Quality/specification issues |
| **SHORTAGE** | Count discrepancies needing verification |
| **WRONG-ITEM** | Vendor sent incorrect item/variant |
| **TEMP** | Temperature concerns (cold chain break) |
| **LABEL** | Labeling or documentation problems |

### Quarantine Locations

**Configuration:**
- **Location Type** field distinguishes quarantine from regular locations
- Each regular location linked to one quarantine location
- Quarantine locations have "Use As In-Transit" = NO
- Physical areas clearly marked as quality hold zones

**Typical Setup:**
```
MAIN (Primary Warehouse) → HOLD-01 (Main Quality Hold)
WEST (West Warehouse) → HOLD-02 (West Quality Hold)
GREENHOUSE → HOLD-GH (Greenhouse Hold)
```

## For Warehouse/Receiving Staff

### Getting Started

#### Opening the Purchase Receipts List

**Navigation:** Search for "Purchase Receipts" or use menu:
- Operations → Receiving → Purchase Receipts

You'll see a list of all purchase orders awaiting receipt, sorted by Expected Receipt Date.

**What You See:**
- **No.** — Purchase order number
- **Buy-from Vendor Name** — Who sent the shipment
- **Expected Receipt Date** — When the shipment was due
- **CLE Cart Quantity** — How many carts/pallets are expected

**Tip:** Orders at the top are oldest/most urgent.

#### Opening a Purchase Order for Receiving

1. Locate the purchase order that matches the vendor packing slip
2. Double-click the order or press Enter
3. Purchase Receipt card opens

### Standard Receipt Process

#### Step 1: Verify the Order

When the receipt card opens, check:
- **No.** — Does this match the PO number on the packing slip?
- **Buy-from Vendor Name** — Correct vendor?
- **Expected Receipt Date** — Is this the right shipment?

If anything doesn't match, **STOP** and ask your supervisor.

#### Step 2: Enter Vendor Shipment Number (REQUIRED)

**Location:** Header section, "Vendor Shipment No." field

**What to Enter:** The packing slip number or shipment number from the vendor's documentation

**Example:**
- Vendor packing slip shows "PS-2026-12345"
- Enter: `PS-2026-12345`

**Why It's Required:**
- Tracking for disputes
- Audit trail
- Linking multiple documents

**⚠️ You cannot post without this!**

#### Step 3: Review and Adjust Line Quantities

**Lines Section** shows each item on the purchase order:

| Field | Meaning | Editable? |
|-------|---------|-----------|
| **No.** | Item number | No |
| **Description** | Item name | No |
| **Variant Code** | Size/color/blooming stage variant | **Yes** |
| **Outstanding Quantity** | What's still expected | No |
| **Qty. to Receive** | What you're receiving now | **Yes** |

#### Step 4: Count and Enter Quantities

For each line item:

1. **Count the physical items** from the vendor shipment
2. Compare to **Outstanding Quantity** (what's expected)
3. Enter actual count in **Qty. to Receive**

**Scenarios:**

**Scenario A: Received Exactly What's Expected**
- Outstanding Qty: 1000 → Qty to Receive: 1000

**Scenario B: Received Less Than Expected**
- Outstanding Qty: 1000 → Qty to Receive: 850
- Note: Remaining 150 stays on PO for next shipment

**Scenario C: Received More Than Expected**
- **STOP** — Contact supervisor before proceeding
- May need PO adjustment or return

**Scenario D: Item Has Wrong Variant**
- PO shows Variant: "RED-4IN"
- Actual received: "BLUE-4IN"
- Action: Change **Variant Code** field to actual variant

**Scenario E: Item Has Blooming Stage Variants**
- Some items track blooming stages (Green Bud, Bud & Bloom, Full Bloom)
- These items **require** a variant code to be selected before posting
- If you try to post without a variant, system shows: **"You must select a variant"**
- Action: Select the variant that matches the actual blooming stage

#### Step 5: Post the Receipt (F9)

When all quantities and locations are correct:

1. Press **F9** or click **Post** button
2. Confirm dialog: "Do you want to post the document?"
3. Click **Yes**

**What Happens:**
- ✅ Inventory updated immediately
- ✅ Posted Purchase Receipt document created
- ✅ Items available for sales orders
- ✅ Vendor performance tracked
- ✅ Purchase order updated (quantity received)

**If Posting Fails:**
- Error message appears
- Most common: "Vendor Shipment No. must have a value"
- Fix the issue and try again

### Quality Hold Process

#### When to Use Quality Hold

Use the "To Hold Location" feature when received items have:

- **Quality issues** — Wrong color, damaged plants, incorrect size
- **Damage** — Broken pots, crushed boxes, torn labels
- **Quantity mismatches** — Suspected shortages requiring count verification
- **Documentation problems** — Missing tags, wrong labels
- **Temperature issues** — Items arrived too hot/cold

**Key Concept:** Items sent to hold go to a **Quarantine Location** for inspection, not regular warehouse inventory.

#### Hold Process — Step by Step

##### Step 1: Identify Problem Items

While reviewing the shipment, you notice issues with some items on a line.

**Example:**
- Line 1: Item 10400 "4-inch Geranium Red", Ordered 1000
- Count reveals: 850 good units, 150 damaged units

##### Step 2: Select the Problem Line

Click on the line with issues to select it.

##### Step 3: Click "To Hold Location" Button

**Location:** Actions menu → Processing → "To Hold Location"

A dialog box opens: "Pick Quantity to Send"

##### Step 4: Enter Hold Quantity

**Dialog Fields:**

**Quantity (Max XXXX):**
- Enter the number of units with issues
- Example: 150 (the damaged units)
- Cannot exceed Outstanding Quantity

**Reason Code:** (REQUIRED)
- Select from dropdown
- Common codes:
  - `DAMAGE` — Physical damage to items
  - `QUALITY` — Quality/specification issues
  - `SHORTAGE` — Suspected count discrepancy
  - `WRONG-ITEM` — Incorrect item/variant sent
  - `TEMP` — Temperature out of range
  - `LABEL` — Labeling/documentation issues

**⚠️ You must select a Reason Code!**

##### Step 5: Confirm the Split

Click **OK** button.

**What Happens:**

**Option A: Partial Hold (you entered less than the line quantity)**

The system automatically:
1. Creates a **new line** for the hold quantity
2. New line points to **Quarantine Location** (e.g., "HOLD-01")
3. New line gets the Reason Code
4. Original line reduced by hold quantity
5. Original line stays at normal location

**Example After Split:**
- Line 10000: Item 10400, Qty 850, Location: MAIN
- Line 15000: Item 10400, Qty 150, Location: HOLD-01, Reason: DAMAGE

**Option B: Full Hold (you entered the entire line quantity)**

The system:
1. Keeps one line (no split)
2. Changes Location to Quarantine Location
3. Applies Reason Code

**Example After Full Hold:**
- Line 10000: Item 10400, Qty 1000, Location: HOLD-01, Reason: QUALITY

##### Step 6: Continue or Post

After splitting to hold:

**If more lines need holds:**
- Repeat Steps 2-5 for each problem line

**When all items categorized:**
- Enter Vendor Shipment No. (if not already entered)
- Press **F9** to post
- Good items go to warehouse
- Hold items go to quarantine automatically

### Common Scenarios

#### Scenario 1: Perfect Receipt — No Issues

**Situation:** Vendor shipment matches PO exactly, all items in good condition.

**Steps:**
1. Open purchase order from receipts list
2. Enter Vendor Shipment No.: `PS-2026-00123`
3. Verify all quantities match (don't change anything)
4. Press **F9** to post
5. Done! ✅

**Time:** 2-3 minutes

#### Scenario 2: Partial Shipment

**Situation:** Vendor ships partial order, rest coming later.

**Purchase Order:**
- Line 1: Item 10400, Ordered 1000

**Actual Receipt:**
- Physical count: 500 units

**Steps:**
1. Open purchase order
2. Enter Vendor Shipment No.: `PS-2026-00124`
3. Change **Qty. to Receive** from 1000 to `500`
4. Press **F9** to post
5. Remaining 500 stays on PO for next shipment ✅

**Result:**
- 500 units added to inventory
- PO shows Outstanding Quantity: 500
- Next shipment can be received against same PO

#### Scenario 3: Damaged Items — Partial Hold

**Situation:** Most items good, some damaged.

**Purchase Order:**
- Line 1: Item 10400, Ordered 1000

**Actual Receipt:**
- Count: 900 good, 100 damaged (broken pots)

**Steps:**
1. Open purchase order
2. Enter Vendor Shipment No.: `PS-2026-00125`
3. Select Line 1 (Item 10400)
4. Click **To Hold Location**
5. Enter Quantity: `100`
6. Select Reason Code: `DAMAGE`
7. Click OK
8. System creates two lines:
   - Line 10000: Qty 900 → Location: MAIN
   - Line 15000: Qty 100 → Location: HOLD-01 (Damage)
9. Press **F9** to post

**Result:**
- 900 units available in warehouse immediately
- 100 units in quarantine for supervisor review
- Quality team can inspect and decide: scrap, return, or salvage

#### Scenario 4: Wrong Variant Received

**Situation:** Vendor sent different color/size than ordered.

**Purchase Order:**
- Line 1: Item 10400, Variant: RED-4IN, Ordered 1000

**Actual Receipt:**
- Received: 1000 units, but they're PINK-4IN

**Steps:**
1. Open purchase order
2. Enter Vendor Shipment No.: `PS-2026-00126`
3. On Line 1, change **Variant Code** from `RED-4IN` to `PINK-4IN`
4. Verify quantity: 1000
5. Press **F9** to post

**Result:**
- Inventory updated with correct variant
- System tracks what vendor actually shipped
- Purchasing can follow up about the substitution

**⚠️ If Variant Not in System:**
- STOP — do not proceed
- Contact supervisor to create variant or reject shipment

#### Scenario 5: Full Line on Hold — Quality Concern

**Situation:** Entire line item needs quality inspection before warehouse.

**Purchase Order:**
- Line 1: Item 10400, Ordered 1000

**Actual Receipt:**
- Count: 1000 units
- Concern: Plants look stressed, need quality review

**Steps:**
1. Open purchase order
2. Enter Vendor Shipment No.: `PS-2026-00127`
3. Select Line 1
4. Click **To Hold Location**
5. Enter Quantity: `1000` (entire line)
6. Select Reason Code: `QUALITY`
7. Click OK
8. Line changes to Quarantine Location
9. Press **F9** to post

**Result:**
- All 1000 units in quarantine
- Not available for customer orders
- Quality team inspects before releasing to warehouse

#### Scenario 6: Multiple Lines, Mixed Issues

**Situation:** Large shipment with various items, some good, some issues.

**Purchase Order:**
- Line 1: Item 10400, Ordered 1000
- Line 2: Item 10500, Ordered 500
- Line 3: Item 10600, Ordered 750

**Actual Receipt:**
- Line 1: 1000 good ✅
- Line 2: 400 good, 100 damaged ⚠️
- Line 3: 750 wrong color (need hold) ⚠️

**Steps:**
1. Open purchase order
2. Enter Vendor Shipment No.: `PS-2026-00128`
3. Line 1: Leave as is (1000)
4. **Line 2 (partial damage):**
   - Select line
   - Click "To Hold Location"
   - Enter Quantity: 100
   - Reason Code: DAMAGE
   - Click OK → Creates split
5. **Line 3 (full line hold):**
   - Select line
   - Click "To Hold Location"
   - Enter Quantity: 750
   - Reason Code: WRONG-ITEM
   - Click OK → Moves to hold location
6. Review all lines:
   - Line 1: 1000 → MAIN
   - Line 2: 400 → MAIN
   - Line 2 (split): 100 → HOLD-01 (Damage)
   - Line 3: 750 → HOLD-01 (Wrong Item)
7. Press **F9** to post

**Result:**
- 1400 units available in warehouse (1000 + 400)
- 850 units in quarantine (100 + 750)
- Supervisor can address each hold separately

### Troubleshooting

#### Problem: "Vendor Shipment No. must have a value"

**Cause:** Required field left blank

**Solution:**
1. Look at the vendor's packing slip or box label
2. Find shipment/tracking number
3. Enter in "Vendor Shipment No." field
4. If no number visible: Use PO number as temporary value

#### Problem: "Quantity cannot be greater than Outstanding Quantity"

**Cause:** Trying to receive more than ordered

**Solution:**
1. Recount physical items
2. If count is correct and higher than ordered:
   - Contact supervisor
   - PO may need modification
   - May need separate line or return process
3. If count was wrong, enter correct lower amount

#### Problem: Can't Find Purchase Order in List

**Possible Causes:**
1. Order already fully received (removed from list)
2. Order not released (still in draft)
3. Filtering issue

**Solution:**
1. Check "Posted Purchase Receipts" — might already be done
2. Ask purchasing team to release the order
3. Clear any filters on the list page

#### Problem: "You must select a variant" error when posting

**Cause:** The item has blooming stage variants configured and no variant code was selected on the purchase line.

**Solution:**
1. Look at the plants — identify the blooming stage (Green Bud, Bud & Bloom, Full Bloom)
2. Click the `Variant Code` field on the line
3. Select the variant that matches the actual blooming stage
4. If unsure which stage, ask your supervisor or the grower team
5. Try posting again

#### Problem: "To Hold Location" Button Not Working

**Possible Causes:**
1. Line not selected
2. Line already posted/fully received
3. System permissions

**Solution:**
1. Click directly on the line to select it
2. Verify line has Outstanding Quantity > 0
3. If still not working, contact IT support

### Quick Reference Card

#### Normal Receipt Checklist

```
□ Open Purchase Receipts list
□ Locate and open the correct PO
□ Enter Vendor Shipment No. (REQUIRED)
□ Count physical items
□ Enter quantities in "Qty. to Receive"
□ Adjust Variant Codes if needed
□ Press F9 to post
□ Confirm posting
□ Done!
```

#### Quality Hold Checklist

```
□ Complete normal receipt steps 1-3 above
□ Identify problem items
□ Select the problem line
□ Click "To Hold Location" button
□ Enter quantity with issues
□ Select Reason Code (REQUIRED)
□ Click OK
□ Verify line split or location change
□ Press F9 to post
□ Done!
```

#### Required Fields

| Field | Location | Example |
|-------|----------|---------|
| **Vendor Shipment No.** | Header | PS-2026-00123 |
| **Reason Code** | Hold dialog | DAMAGE |

#### Common Reason Codes

| Code | When to Use |
|------|-------------|
| **DAMAGE** | Physical damage (broken, crushed) |
| **QUALITY** | Quality issues (wrong specs, appearance) |
| **SHORTAGE** | Count discrepancies |
| **WRONG-ITEM** | Wrong item or variant sent |
| **TEMP** | Temperature concerns |
| **LABEL** | Labeling/documentation issues |

#### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Post Receipt | **F9** |
| Save (without posting) | Ctrl+S |
| Close page | Alt+F4 |
| Next field | Tab |
| Previous field | Shift+Tab |

#### Best Practices

**Do's ✅**

- **Count carefully** — accuracy is critical
- **Enter Vendor Shipment No.** — always required
- **Use Quality Hold** — for ANY questionable items
- **Select correct Reason Code** — helps with vendor performance tracking
- **Verify Variant Codes** — especially for similar items
- **Ask questions** — when unsure, ask supervisor
- **Document issues** — note problems on packing slip

**Don'ts ❌**

- **Don't guess quantities** — count everything
- **Don't skip Vendor Shipment No.** — posting will fail
- **Don't ignore quality issues** — use hold process
- **Don't change Location Code manually** — use "To Hold Location" button
- **Don't over-receive** — can't receive more than ordered without approval
- **Don't post twice** — be patient, posting takes time
- **Don't create variants** — not your responsibility

## For Managers

### Manager Responsibilities

As a receiving manager, you are responsible for:

**Operational Excellence:**
- Ensure accurate and timely receipt of vendor shipments
- Maintain inventory accuracy standards (target: 99%+)
- Manage quality hold process and quarantine items
- Handle receiving exceptions and escalations

**Staff Management:**
- Train receiving staff on procedures
- Monitor staff performance and accuracy
- Provide guidance on complex scenarios
- Address system access and permissions

**Vendor Relations:**
- Track vendor performance metrics
- Handle shipment discrepancies
- Coordinate returns and credits
- Escalate chronic issues to purchasing

**System Oversight:**
- Configure reason codes and locations
- Monitor posting errors and issues
- Ensure data integrity
- Coordinate with IT on system problems

### Daily Management Tasks

#### Morning Activities

**Review Incoming Receipts:**
```
1. Open "Purchase Receipts" list
2. Check Expected Receipt Date column
3. Identify today's expected deliveries
4. Assign staff to handle each shipment
5. Note any special handling requirements
```

**Check Hold Location Status:**
```
1. Navigate to Quarantine Location (e.g., "HOLD-01")
2. Review items currently in hold
3. Prioritize quality inspections
4. Clear resolved items back to warehouse
5. Coordinate vendor returns if needed
```

**Staffing Planning:**
```
1. Review "CLE Cart Quantity" on incoming orders
2. Estimate labor hours needed
3. Assign staff based on volume and complexity
4. Plan for special shipments (hazmat, oversized, etc.)
```

#### Throughout the Day

**Monitor Progress:**
- Check which orders are being worked on
- Ensure staff entering data correctly
- Watch for posting errors or system issues
- Be available for questions and escalations

**Handle Exceptions:**
- Over-shipments requiring PO adjustments
- Variant mismatches not in system
- Significant quality issues
- Missing documentation

**Quality Checks:**
- Spot-check receiving accuracy (random line verification)
- Review hold decisions — appropriate reason codes?
- Verify bin assignments make sense
- Ensure vendor shipment numbers being captured

### Key Performance Indicators

#### Operational KPIs

| KPI | Target | Measured |
|-----|--------|----------|
| **Accuracy Rate** | > 99% | Spot checks, audits |
| **Throughput** | 8-10 receipts/hour | Time tracking |
| **Quality Hold Rate** | < 5% | System data |

#### Vendor KPIs

| KPI | Target | Measured |
|-----|--------|----------|
| **On-Time Delivery** | > 95% | Expected vs. actual receipt date |
| **Quality Score** | A or B rating | Monthly scorecard |
| **Fill Rate** | > 95% | Ordered vs. received quantity |

## System Components

### Custom Pages

| Page ID | Name | Purpose |
|---------|------|---------|
| 50023 | CLE Purchase Receipt | Receipt card interface |
| 50035 | CLE Purchase Receipt Subform | Line entry |
| 50036 | CLE Purchase Receipts | Open orders list |
| 50052 | CLE Pick Quantity to Send | Hold quantity dialog |

### Custom Codeunits

| Codeunit ID | Name | Purpose |
|-------------|------|---------|
| 50011 | CLE Purch. Receipt Management | Hold splitting logic |

### Table Extensions

| Extension ID | Base Table | Purpose |
|--------------|------------|---------|
| 50032 | Purchase Header | Adds Cart Quantity field |
| 50042 | Purchase Line | Adds cart and pot size fields |
| 50028 | Location | Adds quarantine location link |

## Best Practices

### For All Users

✅ **DO:**
- Count carefully and verify against packing slip
- Enter vendor shipment numbers completely
- Use quality hold for any questionable items
- Select appropriate reason codes
- Ask questions when unsure
- Document unusual situations

❌ **DON'T:**
- Guess quantities or variant codes
- Skip mandatory fields
- Ignore quality issues
- Post without verification
- Create variants without approval
- Modify posted transactions directly

### For Managers

✅ **DO:**
- Review hold location daily
- Track vendor performance metrics
- Provide regular staff feedback
- Update procedures based on learnings
- Coordinate with quality and purchasing teams
- Maintain clear documentation

❌ **DON'T:**
- Let items age in quarantine indefinitely
- Ignore recurring vendor issues
- Skip staff spot checks
- Allow accuracy to drop below standards
- Make configuration changes without IT review

### For IT Support

✅ **DO:**
- Run data integrity checks weekly
- Monitor posting performance
- Keep debug logs for errors
- Test fixes in sandbox first
- Document all manual corrections
- Escalate complex issues promptly

❌ **DON'T:**
- Modify production data without backup
- Skip testing of configuration changes
- Attempt fixes outside expertise
- Ignore performance degradation
- Disable validations without understanding impact

## Related Pages

- [[broker-workspace]]
- [[purchase-receipt-it-troubleshooting]]
