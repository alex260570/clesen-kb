# Supermarket Pick Scan Verification

> **Version:** 1.0
> **Last Updated:** 2026-04-21
> **Author:** Clesen Horticulture Development Team
> **Audience:** Warehouse Staff, Quality Control, Pickers

## Table of contents

- [What this is](#what-this-is)
- [When to use it](#when-to-use-it)
- [What you need before you start](#what-you-need-before-you-start)
- [How to use scan verification](#how-to-use-scan-verification)
- [Understanding scan results](#understanding-scan-results)
- [Advanced features](#advanced-features)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## What this is

Scan Verification is the **final quality control step** in the three-phase Supermarket Picking process. After physically picking items from master carts into customer-specific carts, you use barcode scanning to verify that the correct items and quantities were picked.

**Core purpose:**

- Verify picked items match what was ordered
- Catch picking errors before items ship to customers
- Provide fast, accurate quality control using barcode technology
- Track who verified each order and when

**Key concepts:**

| Concept | Definition |
|---------|-----------|
| **GTIN** | Global Trade Item Number - the barcode on each item that identifies it uniquely |
| **Scan Session** | A locked verification session for one ticket, preventing multiple people from scanning the same ticket |
| **Quantity Checked** | How many units have been scanned/verified so far |
| **Quantity Picked** | Total units that were physically picked (the target to verify) |
| **Entry Method** | How the item was verified: Scanner, Manual Entry, or Test GTIN (sandbox only) |
| **Scan Outcome** | Result of each scan attempt: Success, Not On Ticket, Over Scan, Unknown GTIN, etc. |

**How it fits in the workflow:**

1. **Phase 1: Master Picking** - Pick from warehouse bins into zone/run carts
2. **Phase 2: Cart Transfer** - Carts moved to Supermarket location
3. **Phase 3: Supermarket Picking** - Pick from master carts into customer carts
4. **Phase 4: Scan Verification** ← **YOU ARE HERE**
5. **Phase 5: Shipping** - Customer carts loaded onto trucks

---

## When to use it

**You must complete scan verification:**

- After finishing a Supermarket Pick (ticket status = "Picked")
- Before customer carts can be released to shipping
- As part of final quality control for every order

**Typical workflow:**

1. Complete Supermarket Picking → Click "Finish Picking"
2. System changes ticket status to "Picked"
3. Open the ticket and start scan verification
4. Scan all items to verify quantities
5. System auto-completes when all items verified
6. Ticket marked "Quantity Checked" = true
7. Customer cart ready for shipping

> **Note:** If you're scanning and someone else tries to start scanning the same ticket, they'll get an error. Only one person can scan a ticket at a time.

---

## What you need before you start

**Prerequisites:**

- ✓ Supermarket Pick Ticket with status **"Picked"** (picking must be completed first)
- ✓ Barcode scanner device connected to your workstation
- ✓ Customer cart(s) with picked items ready to verify
- ✓ Items must have GTIN barcodes assigned in the system

**User permissions required:**

- Access to Supermarket Pick Tickets page
- Ability to modify ticket quality check fields

**Equipment:**

- Barcode scanner (recommended: handheld wireless scanner)
- Computer/tablet running Business Central
- Clear workspace to scan items one by one

> **Note:** If items are missing GTIN barcodes in Business Central, you can use Manual Item Entry as a fallback, but this is slower and tracked separately for improvement purposes.

---

## How to use scan verification

### Step 1: Open the completed picking ticket

1. Navigate to **Picking → Supermarket Pick Tickets**
2. Find your completed ticket (Status = **"Picked"**)
3. Open the ticket by clicking on it
4. Review the lines to see what items need verification

**What you should see:**

- All lines show "Quantity Picked" values
- "Quantity Checked" should be 0 or incomplete
- Status bar shows "Picked"

### Step 2: Start the scan session

1. On the Supermarket Pick Ticket page, look for the **"Start Scan Check"** button (or similar action)
2. Click the button to open the scan verification interface
3. System locks the ticket to you (prevents others from scanning it simultaneously)
4. System loads all ticket lines into the scan interface

**Scan verification interface opens showing:**

- **Item** field - Currently selected/last scanned item
- **Progress** field - "X / Y lines complete" (e.g., "3 / 12 lines complete")
- **Last action** field - Feedback from your most recent scan
- **Scan** input field - Where scanned barcodes appear

### Step 3: Scan items using barcode scanner

**For each item in the customer cart:**

1. Pick up the item or hold scanner over the item's barcode
2. Scan the **GTIN barcode** with your scanner
3. System automatically processes the scan and gives instant feedback
4. Feedback appears in color:
   - **Green (Favorable)** - Success! Item scanned correctly
   - **Yellow (Ambiguous)** - Warning or informational message
   - **Red (Unfavorable)** - Error, item not recognized or already scanned

5. Read the feedback message (e.g., "Roses: 5/10" means 5 out of 10 scanned)
6. Continue scanning the next item

**Repeat this process** for every item on the ticket until all lines are complete.

### Step 4: Handle scan results

**Successful scan:**

- You'll see: **"[Item Description]: X/Y"** (e.g., "Red Roses: 8/10")
- Progress counter increments
- Move to the next item
- Green/favorable styling confirms success

**Item not recognized:**

- You'll see: **"Unknown barcode: [barcode number]"**
- Check if you scanned the correct barcode (should be GTIN, not internal label)
- Check if the barcode is in the system (contact supervisor if not)
- Use **"Enter Item No. Manually"** button as fallback (see Step 5)

**Item not on ticket:**

- You'll see: **"[Item] is not on this ticket"**
- You scanned an item that wasn't picked for this order
- Check if you're scanning the correct customer cart
- Contact supervisor if item shouldn't be there

**Item already fully scanned:**

- You'll see: **"[Item] already fully scanned (X/X)"**
- You've already verified all required units for this item
- Move to the next unverified item
- If you scanned by mistake, use **"Undo Last"** button

### Step 5: Use manual entry when needed

**If barcode scanning fails:**

1. Click the **"Enter Item No. Manually"** button
2. Dialog opens prompting for:
   - **Item No.** - Type or select the item number
   - **Quantity** - Enter how many units to verify (default: 1)
3. Click **OK**
4. System processes the entry just like a scan
5. Shows progress with "(manual)" notation

> **Note:** Manual entries are tracked separately from scanner usage. Use this only when necessary — high manual entry rates indicate barcode coverage issues that should be reported to IT.

### Step 6: Undo mistakes

**If you scan the wrong item:**

1. Click **"Undo Last"** button immediately
2. System reverses the most recent scan
3. Feedback shows: "Quantity reduced from X to Y"
4. You can now scan the correct item

**Important limitations:**

- Only the **most recent scan** can be undone
- After scanning another item, the previous scan is locked in
- If you need to undo multiple scans, contact a supervisor

### Step 7: Complete verification automatically

**When all items are verified:**

- System detects that Quantity Checked ≥ Quantity Picked for all lines
- **Automatically commits** all changes to the database
- **Automatically closes** the scan interface
- Ticket marked with "Quantity Checked" = true
- Session unlocked for others (if needed)

**You don't need to click "Finish" or "Done"** — the system handles this automatically!

**What happens after:**

- Ticket updated with verification timestamp
- Your user ID recorded as the verifier
- Scan metrics logged (scanner vs. manual entry counts)
- Customer cart released to shipping queue
- Sales order ready for final shipment processing

---

## Understanding scan results

### Scan outcomes explained

| Outcome | What it means | Color | What to do |
|---------|--------------|-------|-----------|
| **Success** | Item scanned correctly, quantity incremented | Green | Continue to next item |
| **Not On Ticket** | Item scanned isn't on this specific ticket | Yellow | Verify you're scanning the correct cart; contact supervisor if confused |
| **Over Scan** | You already scanned all required units for this item | Red | Move to next item, or use "Undo Last" if mistake |
| **Unknown GTIN** | Barcode not recognized in system | Red | Check barcode quality; try manual entry; report to supervisor |
| **Multiple GTIN Match** | Barcode matches multiple items (data error) | Red | Contact supervisor or IT — this is a system configuration issue |
| **Undo Ok** | Previous scan successfully reversed | Yellow | Now scan the correct item |
| **Nothing To Undo** | No recent scan to undo | Yellow | Continue scanning normally |

### Feedback styles

**Favorable (Green):**
- Successful scan
- Item and quantity verified
- Progress incremented

**Ambiguous (Yellow):**
- Informational messages
- Warnings that aren't errors
- Undo confirmations

**Unfavorable (Red):**
- Errors requiring attention
- Item not found
- Validation failures

---

## Advanced features

### Test GTIN mode (sandbox environments only)

In non-production (sandbox/test) environments, you'll see an additional field: **"Test GTIN (sandbox)"**

**Purpose:**

- Test the scan workflow without physical scanners
- Validate barcode data in the system
- Train new staff on the interface

**How to use:**

1. Type a GTIN barcode into the "Test GTIN" field
2. Press Enter
3. System processes it exactly like a scanner input

> **Note:** This field is **hidden in production** environments and only appears during testing.

### Session locking mechanism

**How it works:**

- When you click "Start Scan Check", the ticket is locked to your user ID
- Lock timestamp recorded
- Other users trying to scan the same ticket see: "Ticket is being scan-checked by [Your Name] since [Time]"
- Lock automatically released when you complete or abandon the session

**Why this matters:**

- Prevents duplicate verification
- Avoids conflicting scans from multiple people
- Ensures data integrity

**Supervisor override:**

- Supervisors can force-clear a scan lock if:
  - You left the session open accidentally
  - Your device crashed mid-scan
  - Emergency verification needed
- Contact a supervisor if you see a lock error and the person isn't actively scanning

### Telemetry and analytics

The system tracks valuable metrics about scan verification:

**Metrics captured:**

- **Scanner count** - How many items verified via barcode scanner
- **Test GTIN count** - Sandbox-only test scans
- **Manual count** - Items entered manually (fallback method)
- **Session duration** - Time from start to completion
- **Scan errors** - Unknown GTINs, over scans, etc.

**Why this matters:**

- Identifies items needing better barcode coverage
- Measures verification efficiency
- Detects problematic items or workflows
- Justifies equipment/training investments

> **Note:** All telemetry is logged automatically — you don't need to do anything special. Your supervisor can review these metrics to improve the process.

### Temporary buffer design

**Technical note for advanced users:**

The scan interface uses a **temporary buffer** to track your scans:

1. When you start, all ticket lines are copied to a temporary table in memory
2. Your scans update this temporary buffer (not the real database)
3. When all items are verified, the buffer is committed to the real database in one transaction
4. If you abandon the session (close without finishing), the buffer is discarded

**Benefits:**

- Fast performance (memory operations)
- No partial updates to database if you quit mid-scan
- Ability to undo recent scans
- All-or-nothing verification guarantee

---

## Field reference

These are the key fields on the **Scan Verification** interface:

| Field | What it means | Can you edit it? |
|-------|---------------|-----------------|
| **Item** | Description of the currently selected/last scanned item | No (display only) |
| **Progress** | Shows "X / Y lines complete" (completed lines vs. total lines) | No (display only) |
| **Last action** | Feedback message from most recent scan (success, error, etc.) | No (display only) |
| **Scan** | Input field where barcode scanner data appears | Yes (scans auto-clear) |
| **Test GTIN** | Sandbox-only field to manually type GTINs for testing | Yes (sandbox only) |

**On the underlying ticket:**

| Field | What it means | Can you edit it? |
|-------|---------------|-----------------|
| **Quantity Picked** | Total units physically picked during Supermarket Picking | No (set during picking) |
| **Quantity Checked** | Total units verified via scanning | No (updated by scan) |
| **Checked** | Boolean: True when Quantity Checked ≥ Quantity Picked | No (auto-calculated) |
| **Quantity checked** (header) | Boolean: True when all lines are fully verified | No (auto-calculated) |
| **Scan In Progress** | Boolean: True when someone is actively scanning this ticket | No (auto-managed) |
| **Scan Started By** | User ID of person who started the current scan session | No (auto-filled) |
| **Scan Started At** | Timestamp when scan session started | No (auto-filled) |

---

## Troubleshooting

### Error: "Scan check is only available on a Picked ticket"

**Cause:** You're trying to start scan verification on a ticket that hasn't been picked yet, or was already completed.

**Solution:**

1. Check the ticket status — must be **"Picked"**
2. If status is "New" or "Ready to Pick", complete the picking first
3. Click **"Finish Picking"** on the ticket before starting scan verification
4. If already verified (status shows as complete), no action needed

---

### Error: "Ticket is being scan-checked by [Name] since [Time]"

**Cause:** Another user already has a scan session open for this ticket, or their session wasn't properly closed.

**Solution:**

1. **Check if that person is actively scanning:**
   - Find them and ask if they're still working on it
   - If yes, wait for them to finish
   - If no, they may have left the session open accidentally

2. **If session is abandoned (more than 15-30 minutes old):**
   - Contact a supervisor to force-clear the lock
   - Supervisor can reset the "Scan In Progress" flag
   - Then you can start a new scan session

3. **If it's your own username:**
   - You may have another browser/device open with this ticket
   - Close all other sessions
   - Refresh the page and try again

---

### Error: "Unknown barcode: [barcode number]"

**Cause:** The GTIN you scanned isn't assigned to any item in the system.

**Solution:**

1. **Check the barcode quality:**
   - Is the barcode damaged, dirty, or faded?
   - Try scanning again more slowly
   - Try cleaning the barcode with a dry cloth

2. **Verify you're scanning the correct barcode:**
   - Some items have multiple barcodes (internal codes, vendor codes, GTIN)
   - Look for the barcode labeled "GTIN" or the standard product barcode
   - Avoid scanning internal warehouse labels

3. **Check if the item is in the system:**
   - Use **"Enter Item No. Manually"** button
   - Type the item number from the ticket
   - If the item exists, this confirms the GTIN isn't set up

4. **Report to supervisor if GTIN is missing:**
   - Supervisor can add GTIN to the item master data
   - Use manual entry for now
   - Continue with remaining items

---

### Error: "Barcode [number] matches multiple items"

**Cause:** The same GTIN is assigned to two or more different items in the system. This is a **data integrity issue**.

**Solution:**

1. **Stop scanning this item**
2. **Report to IT or system administrator immediately**
   - Provide the GTIN barcode number
   - Provide the item numbers from the ticket
3. **Use manual entry as workaround:**
   - Click "Enter Item No. Manually"
   - Enter the specific item number from the ticket
4. **IT will correct the duplicate GTIN assignment**

> **Note:** This is a critical data quality issue. Duplicate GTINs break the scanning system and must be resolved.

---

### Issue: "[Item] is not on this ticket"

**Cause:** You scanned an item that isn't listed on this specific Supermarket Pick Ticket.

**Solution:**

1. **Verify you're scanning the correct customer cart:**
   - Check the cart label/tag matches the ticket number
   - You may have multiple carts nearby — make sure you're scanning the right one

2. **Check if the item was supposed to be picked:**
   - Review the ticket lines
   - Item might have been cut (quantity picked = 0)
   - Item might be on a different ticket

3. **Contact supervisor if item is unexpected:**
   - Item may have been placed in wrong cart during picking
   - May need to be moved to correct cart
   - Document the discrepancy

---

### Issue: "[Item] already fully scanned (X/X)"

**Cause:** You've already verified all required units for this item.

**Solution:**

1. **If intentional:**
   - Move on to the next item on the ticket
   - Check progress to see what still needs verification

2. **If you scanned by mistake:**
   - Click **"Undo Last"** button immediately
   - This reverses the most recent scan
   - Scan the correct item

3. **If you scanned an extra unit:**
   - You can't scan more than the picked quantity (system blocks over-scanning)
   - This is intentional to prevent errors
   - Verify the quantity picked matches physical count

---

### Issue: "Closing will discard scan progress for all incomplete lines. Continue?"

**Cause:** You're trying to close the scan interface before completing verification of all items.

**Solution:**

1. **If you want to finish later:**
   - Click **"No"** or **"Cancel"**
   - Continue scanning until all items verified
   - System auto-closes when complete

2. **If you need to stop mid-scan:**
   - Click **"Yes"** to confirm
   - All scans are discarded (temporary buffer cleared)
   - Ticket remains in "Picked" status
   - You or someone else can restart scan verification later
   - Session lock is released

3. **Emergency stop:**
   - Acceptable if you need to leave immediately
   - Supervisor may need to reassign verification
   - All progress is lost (start over next time)

> **Note:** Only incomplete scans are discarded. If you finish all items, the system auto-commits and there's no risk of losing data.

---

### Issue: Scanner not responding or data not appearing

**Cause:** Hardware issue with barcode scanner or connectivity problem.

**Solution:**

1. **Check scanner power/battery:**
   - Ensure scanner is powered on
   - Check battery level (wireless scanners)
   - Try charging or replacing battery

2. **Check connection:**
   - Wired: Ensure USB cable is securely connected
   - Wireless: Check Bluetooth pairing or wireless receiver
   - Try unplugging and reconnecting

3. **Test scanner in another application:**
   - Open Notepad or a text field
   - Try scanning a barcode
   - If data appears in Notepad, scanner works (problem is Business Central focus)
   - If data doesn't appear, scanner is faulty (replace or repair)

4. **Check cursor focus:**
   - Click inside the **"Scan"** input field
   - Scanner must send data to an active input field
   - Try scanning again after clicking in the field

5. **Restart or switch scanners:**
   - If all else fails, use a different scanner
   - Report faulty scanner to IT for repair

---

### Issue: Progress shows X/Y but some lines still incomplete

**Cause:** You may have partially scanned some items (not all units verified yet).

**Solution:**

1. **Review each ticket line:**
   - Check "Quantity Checked" vs. "Quantity Picked"
   - Lines are only complete when Checked ≥ Picked
   - Find lines where Checked < Picked

2. **Continue scanning incomplete items:**
   - Scan the remaining units for each incomplete item
   - Progress counter updates as you complete each line

3. **Example:**
   - Line 1: Roses - Picked 10, Checked 10 ✓ (Complete)
   - Line 2: Tulips - Picked 8, Checked 5 ✗ (Need 3 more)
   - Line 3: Lilies - Picked 6, Checked 0 ✗ (Need 6 more)
   - Progress shows "1 / 3 lines complete" until you finish lines 2 and 3

---

## FAQ

**Q: What's the difference between "Quantity Picked" and "Quantity Checked"?**

A: **"Quantity Picked"** is what was physically picked from master carts into customer carts during Supermarket Picking (Phase 3). **"Quantity Checked"** is what has been verified via barcode scanning. They should match when you're done scanning. The scan process verifies that what was recorded as picked actually made it into the customer cart.

---

**Q: Can I scan items in any order, or must I follow the ticket line order?**

A: **You can scan in any order!** The system matches each scanned GTIN to the correct ticket line automatically. Scan items as you find them in the customer cart — you don't need to follow the line sequence on the ticket. Progress is tracked per item, not sequentially.

---

**Q: What happens if I close the scan window before finishing?**

A: The system asks for confirmation: **"Closing will discard scan progress for all incomplete lines. Continue?"** If you click Yes, all your scans are discarded and the ticket remains in "Picked" status (not verified). You or someone else will need to start over. Only close if you must abandon the session — otherwise, finish scanning all items so the system auto-completes.

---

**Q: Can I pause scanning and come back later?**

A: **No, not directly.** Scan sessions are all-or-nothing. If you need to stop, you must close the session (discarding progress) and start over later. However, because the system auto-closes when complete, most scan sessions are fast (5-15 minutes for typical tickets). Plan to complete the full verification in one session.

---

**Q: What if the physical count doesn't match what was picked?**

A: **This is a serious discrepancy.** Scan verification confirms what was PICKED, not what should have been picked. If you notice items missing or extra items in the cart:

1. Stop scanning
2. Contact a supervisor immediately
3. Do a physical recount of the cart
4. Supervisor may need to adjust the "Quantity Picked" on the ticket
5. Investigate what happened (picking error, transfer damage, theft, etc.)

Don't try to force the scan to match — report the issue first.

---

**Q: How do I know which items still need scanning?**

A: **Check the ticket lines.** Items with "Quantity Checked" less than "Quantity Picked" still need scanning. The **Progress** field shows "X / Y lines complete" for a quick overview. You can also track this by watching the feedback messages — successful scans show "Item: X/Y" (e.g., "Roses: 8/10" means you need 2 more scans for roses).

---

**Q: Can multiple people scan different tickets at the same time?**

A: **Yes!** Each ticket has its own independent scan session. User A can scan Ticket 001 while User B scans Ticket 002 simultaneously. The lock only prevents multiple people scanning the **same** ticket. You can't have two scanners working on Ticket 001 at the same time, but you can each work on different tickets.

---

**Q: What if an item doesn't have a barcode?**

A: Use the **"Enter Item No. Manually"** button:

1. Click the button
2. Type the item number from the ticket
3. Enter quantity (default is 1)
4. Click OK

The system treats this like a scan. However, this is tracked separately as "Manual Entry" — high rates of manual entry indicate missing barcodes that should be reported to IT for correction.

---

**Q: Why does the system track Scanner vs. Manual entry counts?**

A: **For process improvement.** The system logs:

- How many items verified via barcode scanner (fast, accurate)
- How many items verified via manual entry (slow, error-prone)

This data helps identify:

- Items missing GTIN barcodes (need to be added)
- Scanner hardware issues
- Training opportunities
- ROI on barcode equipment investments

High manual entry rates trigger reviews to improve barcode coverage.

---

**Q: What happens if my scanner crashes or I lose power mid-scan?**

A: **No data loss risk.** The scan interface uses a temporary buffer — scans aren't written to the database until ALL items are verified. If you crash/lose power:

1. Temporary buffer is automatically discarded
2. Ticket remains in "Picked" status (not verified)
3. Session lock is released after a timeout
4. You start over from the beginning

This all-or-nothing design prevents partial/corrupt verification data.

---

**Q: Can supervisors see who verified each ticket and when?**

A: **Yes.** When you complete scan verification, the system records:

- Your user ID
- Start and end timestamps
- Session duration
- Scanner vs. manual entry breakdown
- Any scan errors or unusual patterns

Supervisors can review this for quality assurance and training purposes.

---

**Q: What's "Test GTIN" mode and why don't I see it?**

A: **Test GTIN mode only appears in sandbox/test environments.** It's for:

- Testing the scan workflow without physical scanners
- Validating GTIN data in the system
- Training new staff

You type GTINs manually to simulate scanning. In production environments, this field is hidden because you should use real scanners.

---

**Q: How long does a typical scan session take?**

A: **Depends on ticket size:**

- Small tickets (1-5 lines, 10-30 units): 2-5 minutes
- Medium tickets (6-15 lines, 30-100 units): 5-15 minutes
- Large tickets (15+ lines, 100+ units): 15-30 minutes

Experienced users with good scanners average 8-12 items per minute. The system tracks session duration to help optimize workflows.

---

**Q: Can I undo multiple scans in a row?**

A: **No, only the most recent scan.** The "Undo Last" button reverses your last scan only. Once you scan another item, the previous scan is locked in. If you need to undo multiple scans, contact a supervisor to clear the session and restart.

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/supermarket-scan-verification-staff-guide.pdf)

---

**Related guides:**

- [Supermarket Picking Process](supermarket-picking-process.md) - Phase 3 of the picking workflow
- [Cart Transfer Process](cart-transfer-process.md) - Phase 2 of the picking workflow
- [Picking Process Overview](Picking-Process.md) - Complete three-phase picking system

---

*For technical support or to report issues with scan verification, contact IT Support or your warehouse supervisor.*
