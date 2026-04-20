# Inventory Adjustments (Picking Corrections) - Staff Guide

> **Version:** 1.0
> **Last Updated:** 2026-03-17
> **Author:** Taylor Docs
> **Audience:** Warehouse Managers, Inventory Control Staff

## Table of contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [When to create adjustments](#when-to-create-adjustments)
- [Types of picking discrepancies](#types-of-picking-discrepancies)
- [Understanding reason codes](#understanding-reason-codes)
- [How to create picking adjustment entries](#how-to-create-picking-adjustment-entries)
  - [Method 1: During picking (Quantity Cut)](#method-1-during-picking-quantity-cut)
  - [Method 2: Post-shipment adjustment (Item Journal)](#method-2-post-shipment-adjustment-item-journal)
- [Viewing adjustment history](#viewing-adjustment-history)
- [Impact on inventory and accounting](#impact-on-inventory-and-accounting)
- [Common adjustment scenarios](#common-adjustment-scenarios)
- [Best practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Related guides](#related-guides)

---

## Overview

**Inventory Adjustments for Picking Corrections** are used to correct discrepancies between what was recorded as picked and what was actually shipped to customers. These adjustments ensure that:

- Physical inventory matches system inventory
- Customer orders reflect what was actually shipped
- Reasons for discrepancies are documented for future analysis
- Accounting and financial records remain accurate

Picking corrections can happen **during the picking process** (when shortages are discovered) or **after shipment** (when discrepancies are found during quality checks or customer complaints).

This guide focuses on corrections related to warehouse picking operations, not production adjustments or purchase receipt corrections.

---

## Prerequisites

Before creating picking adjustments, ensure:

- You have appropriate permissions to modify inventory
- You understand the picking process workflow (see [Master Picking Process](master-picking-process.md))
- You know which reason code to use (see [Understanding reason codes](#understanding-reason-codes))
- For post-shipment adjustments: Manager approval may be required depending on your organization's policy

**System Requirements:**

- Access to Master Pick Tickets, Supermarket Pick Tickets, or Item Journal
- Permission to record quantity cuts during picking
- For Item Journal adjustments: Access to Physical Inventory Journal or Item Reclassification Journal

---

## When to create adjustments

### During Picking (Real-Time)

Create adjustments **during picking** when:

- Item is not in the expected bin location
- Quantity available is less than required
- Items are damaged and cannot be shipped
- Items fail quality inspection
- Wrong variant was staged (and substitute not available)

**Action:** Record as **Quantity Cut** directly on the picking ticket line.

### Post-Shipment (After the Fact)

Create adjustments **after shipment** when:

- Customer reports short shipment (received less than invoiced)
- Customer reports over shipment (received more than invoiced)
- Post-shipment quality check reveals damaged items were shipped
- Wrong items were shipped (item substitution error)
- Counting discrepancy discovered during cycle count
- Inventory variance identified during physical inventory

**Action:** Use **Item Journal** to create correcting entry with appropriate reason code.

---

## Types of picking discrepancies

| Discrepancy Type | Description | When It Happens | Correction Method |
|------------------|-------------|-----------------|-------------------|
| **Short Pick** | Fewer items picked than ordered | During picking | Quantity Cut on pick ticket |
| **Over Pick** | More items picked than ordered | During picking or post-shipment | Item Journal (negative adjustment) |
| **Item Not Found** | Item missing from expected bin | During picking | Quantity Cut with reason "Not in Bin" |
| **Damaged Item** | Item physically damaged, unsellable | During picking or quality check | Quantity Cut or Item Journal |
| **Wrong Variant** | Wrong blooming stage or variety picked | Quality check or customer complaint | Item Journal (negative old, positive correct) |
| **Bin Discrepancy** | Item in wrong location | During picking | Report to supervisor for bin correction |
| **Quality Rejection** | Item fails quality standards | Quality check phase | Quantity Cut with reason "Quality Issue" |

---

## Understanding reason codes

Reason codes document **why** an adjustment was made. They are critical for:

- Inventory variance analysis
- Process improvement identification
- Accountability and audit trails
- Financial reporting accuracy

### Common Picking-Related Reason Codes

| Reason Code | Description | When to Use | Impact |
|-------------|-------------|-------------|--------|
| **OUT OF STOCK** | Item not available in bin | Item completely missing from location | System may trigger reordering |
| **DAMAGED** | Physical damage to item | Item damaged during handling or storage | May trigger waste recording |
| **QUALITY ISSUE** | Item fails quality standards | Item doesn't meet shipping standards | Supervisor review required |
| **NOT READY** | Item not ready for shipment | Blooming stage not appropriate | Common for live plants |
| **WRONG LOCATION** | Item in unexpected bin | Bin layout error or misplacement | Triggers location audit |
| **SHORT COUNT** | Fewer items than expected | Physical count less than system | Inventory variance investigation |
| **OVERGROWN** | Plant past optimal stage | Blooming stage progressed too far | Waste or alternative sale |
| **CUSTOMER REQUEST** | Customer-initiated change | Customer modifies order after picking starts | Sales team involved |

> **Note:** The system administrator configures which reason codes trigger automatic inventory adjustments. Ask your supervisor which codes require additional approval or documentation.

### Audited Reason Codes

Some reason codes trigger **automatic inventory audit entries** that move inventory to a "hold" location for further investigation:

- **OUT OF STOCK** (if configured)
- **NOT READY** (if configured)
- **DAMAGED** (may trigger waste recording)

When you use these codes, the system may:

1. Create an item journal entry automatically
2. Move inventory from the pick location to a hold/investigation location
3. Send notification to inventory control manager
4. Flag the item for cycle count verification

> **Warning:** Using an audited reason code may prevent the item from being picked again until a manager resolves the hold.

---

## How to create picking adjustment entries

### Method 1: During picking (Quantity Cut)

This is the **preferred method** for real-time corrections during the picking process.

#### For Master Picking, Supermarket Picking, or Direct Location Picking

**Step-by-Step:**

1. Open your picking ticket (Master Pick Ticket, Supermarket Pick Ticket, or Direct Location Pickup)
2. Click **Start Picking** to begin the pick
3. For each item line, navigate to the bin location
4. **If you cannot pick the full quantity:**

   a. Enter the actual **Quantity Picked** (what you physically picked)

   b. The system automatically calculates **Quantity Cut** = Quantity to Pick - Quantity Picked

   c. **Select a Reason Code** from the dropdown (required if Quantity Cut > 0)

   d. Add optional **notes** explaining the situation (visible to managers)

5. Continue picking remaining items
6. Click **Finish Picking** when complete
7. The system validates that `Picked + Cut = Total` for each line
8. Complete quality checks (Labels, Quality, Quantity, Water)

**Example:**

```text
Order requires: 100 units of Item 10500 (Rosa, Bud & Bloom)
Bin Location: WEST-A-05
Physical count in bin: 85 units

Actions:
- Quantity to Pick: 100
- Quantity Picked: 85
- Quantity Cut: 15 (calculated automatically)
- Reason Code: "SHORT COUNT"
- Notes: "Bin only had 85, rest may be in adjacent bin WEST-A-06"
```

**What Happens Next:**

- Sales order line quantity is reduced by the cut amount
- Sales Line Change Log records the change
- If reason code is monitored, Item Audit creates journal entry
- Inventory availability is updated for other orders
- Manager is notified of significant cuts

> **Tip:** Always check adjacent bins before recording a cut. Items may have been placed in nearby locations during a previous receiving cycle.

#### For Continuous Picking Mode

If using **Continuous Picking Mode** (available after clicking Start Picking):

1. System prompts you item-by-item automatically
2. For each item prompt:

   - Enter **Quantity Picked**
   - If less than required, select **Reason Code** from prompt
   - System moves to next item automatically

3. Faster than manual line-by-line entry
4. Keeps you focused on picking without navigation

---

### Method 2: Post-shipment adjustment (Item Journal)

Use this method for corrections discovered **after** picking is complete and items have been shipped or are staged for shipment.

> **Warning:** Post-shipment adjustments require manager approval in most organizations. Check with your supervisor before proceeding.

#### Physical Inventory Journal (For Quantity Corrections)

**Use when:** Physical count differs from system inventory after shipment.

**Step-by-Step:**

1. Navigate to **Physical Inventory Journal**

   - Use Search (Alt+Q), type "Physical Inventory Journal"
   - Or navigate: Inventory → Journals → Physical Inventory Journal

2. Select the appropriate **Journal Batch** (ask supervisor if unsure)

3. Click **Calculate Inventory** to populate expected quantities

4. For each line requiring adjustment:

   a. Verify **Item No.**, **Variant Code**, **Location Code**, **Bin Code**

   b. Enter **Quantity (Physical Inventory)** = actual count

   c. System calculates **Quantity (Calculated)** = system inventory

   d. **Difference** = Physical - Calculated (positive = gain, negative = loss)

   e. Select **Reason Code** (required for adjustments)

   f. Enter **Document No.** (use format: ADJ-YYYY-MM-DD or as directed)

   g. Verify **Posting Date** (usually today)

5. Review all lines carefully

6. Click **Post** to create adjustment entries

7. System creates:

   - Item Ledger Entries (inventory change)
   - Warehouse Entries (bin content change)
   - Value Entries (accounting impact)

**Example Scenario: Short Shipment Discovery**

```text
Situation: Customer reports receiving 90 units instead of 100 of Item 10500

Investigation reveals:
- Picking ticket shows: 100 picked
- Packing slip shows: 100 packed
- Customer received: 90
- 10 units missing (damaged in transit or packing error)

Correction in Physical Inventory Journal:
- Item No.: 10500
- Variant Code: BUD-BLOOM
- Location Code: MAIN
- Bin Code: SHIPPING
- Qty (Physical): 90 (what customer actually got)
- Qty (Calculated): 100 (what system thinks was shipped)
- Difference: -10 (negative adjustment)
- Reason Code: "SHORT SHIPMENT"
- Document No.: ADJ-2026-03-17-SO-12345
```

> **Note:** Some organizations require credit memo creation instead of inventory adjustment for customer-reported shortages. Check your company's policy.

#### Item Reclassification Journal (For Location/Bin Corrections)

**Use when:** Items were picked from or placed in the wrong location.

**Step-by-Step:**

1. Navigate to **Item Reclassification Journal**

   - Search: "Item Reclassification Journal"
   - Or: Inventory → Journals → Item Reclassification Journal

2. For each correction line:

   a. **Item No.**: Item requiring correction

   b. **Variant Code**: If applicable

   c. **Location Code**: Current (incorrect) location

   d. **Bin Code**: Current (incorrect) bin

   e. **New Location Code**: Correct location

   f. **New Bin Code**: Correct bin

   g. **Quantity**: Amount to move

   h. **Reason Code**: Why correction is needed

   i. **Document No.**: Reference (e.g., original pick ticket)

3. Click **Post**

**Example: Wrong Bin Correction**

```text
Situation: Items picked from WEST-A-05 but should have been WEST-A-06

Reclassification Entry:
- Item No.: 10500
- Location Code: MAIN (remains same)
- Bin Code: WEST-A-05 (where picked from incorrectly)
- New Bin Code: WEST-A-06 (correct bin for accounting)
- Quantity: 100
- Reason Code: "WRONG LOCATION"
- Document No.: Reference to pick ticket PICK-2026-001
```

> **Tip:** Item Reclassification does **not** change the physical location of items. If items are physically in the wrong place, you may need to physically move them first, then use reclassification to update the system.

---

## Viewing adjustment history

### Sales Line History (For Picking Cuts)

**To view changes made during picking:**

1. Open the **Sales Order** that was affected
2. Navigate to the **Lines** section
3. Select the line you want to review
4. Ribbon: **Line → Sales Process History**
5. The **Sales Line History** page opens

**What You'll See:**

- Original quantity ordered
- Quantity cut during picking
- Reason code used
- User who made the change
- Date and time of change
- Difference from prior quantity

See the [Sales Process History User Guide](../../sales/staff/sales-process-history-user-guide.md) for full details.

### Item Ledger Entries (For All Adjustments)

**To view inventory movement history:**

1. Navigate to **Item Ledger Entries**

   - Search: "Item Ledger Entries"
   - Or: Inventory → Entries → Item Ledger Entries

2. Apply filters:

   - **Item No.**: Specific item
   - **Entry Type**: "Negative Adjmt." or "Positive Adjmt."
   - **Posting Date**: Date range
   - **Reason Code**: Specific reason
   - **Document No.**: Reference number

3. Review entries showing:

   - Entry No. (unique identifier)
   - Posting Date
   - Entry Type (Purchase, Sale, Positive/Negative Adjmt, Transfer)
   - Item, Variant, Location, Bin
   - Quantity (positive = increase, negative = decrease)
   - Remaining Quantity (current balance)
   - Reason Code
   - Document No. (reference)

### Warehouse Entries (For Bin-Level Detail)

**To view bin-level inventory changes:**

1. Navigate to **Warehouse Entries**

   - Search: "Warehouse Entries"
   - Or: Warehouse → Entries → Warehouse Entries

2. Apply filters similar to Item Ledger Entries

3. Shows same information with additional bin-specific details

> **Note:** Warehouse Entries are automatically created when Item Ledger Entries are posted. They provide bin-level granularity for warehouse operations.

---

## Impact on inventory and accounting

### Inventory Impact

**Immediate Effects:**

- **Physical Inventory**: Updated to reflect actual quantity on hand
- **Available Inventory**: Recalculated for other sales orders and planning
- **Bin Contents**: Bin quantities adjusted to match physical reality
- **Availability Checking**: Future orders validated against corrected inventory

**Downstream Effects:**

- **Reordering Triggers**: Low inventory may trigger purchase suggestions
- **Production Planning**: Updated for production order component availability
- **Other Orders**: Sales orders for same item may show shortages if adjustment was negative
- **Shortage Resolution**: Manager may need to resolve shortages for other customers

### Accounting Impact

**Financial Entries Created:**

- **Value Entries**: Cost of inventory change posted to G/L
- **Inventory Adjustment Account**: Debit or credit depending on adjustment direction
- **COGS (if applicable)**: Cost reflected in period's cost of goods sold

**Example Financial Impact:**

```text
Negative Adjustment (Inventory Loss):
- Item: 10500, Quantity: -10, Unit Cost: $5.00
- Total Cost Impact: -$50.00

Journal Entry (automatic):
   Debit: Inventory Adjustment Expense    $50.00
   Credit: Inventory Asset                $50.00
```

> **Important:** Large or frequent adjustments may trigger audit reviews and impact financial reporting. Always use accurate reason codes and document thoroughly.

### Audit Trail

Every adjustment creates a complete audit trail:

1. **Item Ledger Entry**: Inventory movement record
2. **Warehouse Entry**: Bin-level movement
3. **Value Entry**: Financial impact (cost and GL posting)
4. **Sales Line Change Log**: If related to sales order (picking cut)
5. **Reason Code Documentation**: Why the adjustment was needed

**Auditors can trace:**

- Who made the adjustment
- When it was made
- Why it was necessary
- What financial impact occurred
- Which customer orders were affected (if applicable)

---

## Common adjustment scenarios

### Scenario 1: Short pick due to bin shortage

**Situation:** You go to pick 100 units of Item 10500 from bin WEST-A-05. Physical count shows only 85 units.

**Actions:**

1. **During picking:**

   - Quantity Picked: 85
   - Quantity Cut: 15 (automatic)
   - Reason Code: "SHORT COUNT"
   - Notes: "Only 85 in bin, expected 100"

2. **After picking:**

   - Check adjacent bins WEST-A-04 and WEST-A-06 for remaining 15 units
   - Report to supervisor for investigation
   - Supervisor may approve cycle count to verify bin contents

**Result:**

- Customer receives 85 units instead of 100
- Sales order updated to reflect 85 shipped
- 15-unit shortage investigated by inventory control
- Future orders may be affected if shortage is real

---

### Scenario 2: Damaged items during picking

**Situation:** While picking, you notice 20 units of Item 10600 are damaged (broken stems, wilted).

**Actions:**

1. **During picking:**

   - Do not pick damaged items
   - Quantity Picked: Original qty - 20
   - Quantity Cut: 20
   - Reason Code: "DAMAGED"
   - Notes: "Broken stems, not shippable"

2. **After reporting:**

   - Supervisor inspects damaged items
   - Waste recording process initiated (separate workflow)
   - Replacement inventory sourced if available

**Result:**

- Customer order reduced or alternative sourced
- Damaged inventory moved to waste location
- Waste recorded for financial reporting
- Root cause investigated (handling, storage, age)

---

### Scenario 3: Over-pick discovered post-shipment

**Situation:** Packing team reports that 110 units of Item 10700 were picked, but order was only for 100.

**Actions:**

1. **Investigate:**

   - Review picking ticket (should show 100)
   - Check if picker entered 110 by mistake
   - Verify with packing team count

2. **If 110 actually shipped:**

   - **Option A (Standard):** Ship the extra 10 at no charge (customer delight)
   - **Option B (Policy-Dependent):** Create additional invoice line for 10 units
   - Update sales order to 110 shipped

3. **If 110 were picked but only 100 shipped:**

   - 10 units are "missing" (lost, staged elsewhere, or counted wrong)
   - Create **negative adjustment** in Item Journal:
     - Item No.: 10700
     - Location: MAIN
     - Bin: SHIPPING (or last known location)
     - Qty: -10 (negative adjustment)
     - Reason Code: "SHORT SHIPMENT"
     - Document No.: Reference pick ticket

**Result:**

- Inventory corrected to match physical reality
- Customer receives what was actually shipped
- Internal process review to prevent over-picking

---

### Scenario 4: Wrong variant picked (blooming stage error)

**Situation:** Order was for "Bud & Bloom" variant, but "Full Bloom" was picked and shipped. Customer complains.

**Actions:**

1. **Immediate:**

   - Apologize to customer
   - Offer replacement or credit

2. **Inventory correction (if replacement provided):**

   **Step 1: Adjust original (wrong) variant out**
   - Item No.: 10500
   - Variant: FULL-BLOOM
   - Qty: -100 (negative)
   - Reason Code: "WRONG VARIANT"

   **Step 2: Adjust correct variant out (as if originally picked)**
   - Item No.: 10500
   - Variant: BUD-BLOOM
   - Qty: -100 (negative)
   - Reason Code: "CUSTOMER CORRECTION"

   **Step 3: Adjust wrong variant back in (if returned)**
   - Item No.: 10500
   - Variant: FULL-BLOOM
   - Qty: +100 (positive)
   - Reason Code: "CUSTOMER RETURN"

3. **If credit memo issued instead:**

   - Sales team creates credit memo for wrong variant
   - No manual inventory adjustment needed (automatic via credit posting)

**Result:**

- Inventory reflects what was actually shipped
- Financial records accurate (credit or replacement cost)
- Customer satisfied
- Training opportunity to prevent recurrence

---

### Scenario 5: Items not ready (blooming stage)

**Situation:** Items are in the bin, but blooming stage is not appropriate for shipment (too green, not yet bloomed).

**Actions:**

1. **During picking:**

   - Quantity Picked: 0 (or less than ordered)
   - Quantity Cut: Full quantity (or shortage)
   - Reason Code: "NOT READY"
   - Notes: "Still too green, needs 3-5 more days"

2. **After reporting:**

   - Production/growing team notified
   - Sales team contacts customer about delay
   - Order rescheduled or alternative sourced

**Result:**

- Customer receives quality product (even if delayed)
- Sales order shipment date updated
- Growing schedule reviewed for future accuracy

---

### Scenario 6: Customer-requested change after picking started

**Situation:** Customer calls during picking to reduce order quantity or cancel items.

**Actions:**

1. **If picking not yet started for that item:**

   - Sales team updates order
   - Picker sees updated quantity on ticket

2. **If picking already started or completed:**

   - Sales team updates order (quantity reduced)
   - If items already picked:
     - Return to inventory (physical movement)
     - Create **positive adjustment** to restore inventory:
       - Qty: Amount returned
       - Reason Code: "CUSTOMER REQUEST"
       - Document No.: Reference sales order change

**Result:**

- Customer order reflects their final request
- Inventory returned to available status for other orders
- No loss or waste

---

## Best practices

### Before Recording Adjustments

✓ **Verify physical reality** - Always physically check before recording a discrepancy

✓ **Check adjacent bins** - Items may be in nearby locations due to receiving or restocking

✓ **Ask experienced staff** - Colleagues may know where items were moved

✓ **Take photos if helpful** - For damaged items or unusual situations, photos assist investigation

✓ **Communicate immediately** - Don't wait until end of shift to report shortages

### During Adjustment Entry

✓ **Use correct reason code** - Accurate codes enable trend analysis and process improvement

✓ **Add detailed notes** - Explain the situation fully for future reference

✓ **Verify item/variant/bin** - Double-check you're adjusting the correct item in correct location

✓ **Confirm quantities** - Re-count before finalizing adjustment

✓ **Document reference** - Always link to original pick ticket, sales order, or customer complaint

### After Adjustment

✓ **Follow up with supervisor** - Ensure they're aware of significant adjustments

✓ **Review impact on other orders** - Check if adjustment created shortages elsewhere

✓ **Participate in root cause analysis** - Help identify why discrepancy occurred

✓ **Update processes if needed** - Suggest improvements to prevent recurrence

### Organization-Wide

✓ **Weekly adjustment review meetings** - Managers and staff discuss trends and patterns

✓ **Training on accurate picking** - Focus on quality to minimize post-shipment corrections

✓ **Cycle counting program** - Regular counts prevent accumulation of discrepancies

✓ **Reason code analysis** - Identify top reasons for adjustments, target improvements

✓ **Supplier quality review** - If many "DAMAGED" adjustments, review receiving and supplier quality

---

## Troubleshooting

### "I can't record a quantity cut on the picking ticket"

**Possible causes:**

- Picking ticket not started yet (click **Start Picking** first)
- Ticket already finished (status shows complete)
- You don't have permission to modify quantities
- Line is locked or already posted

**Solution:**

- Verify ticket status
- Ask supervisor to reopen ticket if needed
- Check with system administrator about permissions

---

### "System won't let me post the item journal"

**Possible causes:**

- Required field missing (Reason Code, Document No., Posting Date)
- Item, variant, location, or bin doesn't exist in system
- You don't have permission to post journals
- Journal batch is locked by another user
- Posting date is in a closed fiscal period

**Solution:**

- Review all fields for completeness
- Verify item/location/bin codes are correct (use lookups)
- Check with accounting about fiscal period status
- Ask supervisor for permission assistance

---

### "Adjustment created negative inventory"

**Possible causes:**

- Adjustment quantity exceeds actual inventory
- Other transactions reduced inventory while you were entering adjustment
- Multi-location scenario: Item exists elsewhere but not in specified location

**Solution:**

- Verify physical inventory in the bin right now
- Check if other sales orders or adjustments occurred recently
- Consider transferring from another location first
- Ask supervisor if negative inventory is acceptable temporarily

> **Note:** Business Central can allow negative inventory depending on setup, but it's generally not recommended for operational accuracy.

---

### "Reason code is missing or invalid"

**Possible causes:**

- Reason code not configured for this transaction type
- Reason code has been blocked or made inactive
- Required reason code field not filled in

**Solution:**

- Use dropdown to select from available reason codes
- Ask supervisor which code is appropriate
- Contact system administrator if needed codes are missing

---

### "Can't find the adjustment in history"

**Possible causes:**

- Adjustment not yet posted (still in journal)
- Filters applied are too restrictive
- Looking in wrong entry table (Item Ledger vs. Warehouse Entry)
- Entry posted to different location or item than expected

**Solution:**

- Clear all filters and search again
- Verify adjustment was actually posted (check journal)
- Check both Item Ledger Entries and Warehouse Entries
- Search by Document No. or Posting Date instead of item

---

### "Manager says adjustment shouldn't have been made"

**Possible causes:**

- Misunderstanding of adjustment policy
- Items were found later (premature adjustment)
- Adjustment was in wrong direction (positive instead of negative)
- Customer issue should have been handled differently (credit memo vs. adjustment)

**Solution:**

- **If not yet posted:** Delete journal line, do not post
- **If already posted:** Manager may need to create reversing entry
- **Learn from situation:** Clarify policy and get approval before similar future adjustments
- **Document conversation:** Understand company-specific guidelines

---

## Related guides

### Picking Process Guides

- [Master Picking Process](master-picking-process.md) - Core picking workflow with quantity cut procedures
- [Supermarket Picking Process](supermarket-picking-process.md) - Single-order picking with adjustment options
- [Direct Location Pickup](direct-location-pickup.md) - Simplified picking for customer pickups
- [Handling Escalations](handling-escalations.md) - Priority order adjustments

### Management Guides

- [Inventory Shortage Resolution Manager Guide](../managers/inventory-shortage-resolution-manager-guide.md) - Pre-picking shortage management
- [Master Picking Manager Guide](../managers/master-picking-manager.md) - Oversight of picking operations

### Sales Guides

- [Sales Process History User Guide](../../sales/staff/sales-process-history-user-guide.md) - Comprehensive change tracking for sales orders
- [Move Lines User Guide](../../sales/staff/move-lines-user-guide.md) - Transferring sales lines between orders

### Inventory Guides

- Counting Exception Handling (Manager Guide) - Physical inventory adjustment procedures
- Waste Recording Process - Damaged inventory handling workflow

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/picking-adjustment-guide.pdf)

---

*For additional assistance with picking adjustments, contact your warehouse supervisor or inventory control manager. For system access or configuration issues, contact IT support.*
