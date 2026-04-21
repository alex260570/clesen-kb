# Waste recording guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Warehouse staff, production staff, inventory control
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [When to record waste](#when-to-record-waste)
- [Creating waste records](#creating-waste-records)
- [Using waste reason codes](#using-waste-reason-codes)
- [Linking waste to source](#linking-waste-to-source)
- [Waste approval workflow](#waste-approval-workflow)
- [Waste reporting](#waste-reporting)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Waste Recording system tracks inventory loss, damage, and disposal to ensure accurate inventory ledgers and to identify patterns of waste that may require process improvements or supplier quality issues.

### Purpose and benefits

- **Inventory accuracy:** Log all inventory losses to maintain accurate on-hand quantities
- **Cost analysis:** Quantify waste and identify cost reduction opportunities
- **Root cause tracking:** Identify whether waste originates from production, warehouse, damage, or other sources
- **Compliance:** Maintain records for regulatory requirements
- **Waste prevention:** Analyze waste patterns to identify process improvements

### Prerequisites

- Warehouse staff, production staff, or inventory control role
- Understanding of waste reason codes used in your operation
- Production orders or purchase documents for tracing waste sources
- Approval authority (for manager-level waste review)

## When to record waste

### Types of waste to record

Record waste in the following situations:

| Situation | Category | Example |
|-----------|----------|---------|
| Production error | Production waste | Incorrect item mixed into batch; defective production output |
| Warehouse handling | Warehouse waste | Dropped items causing damage; fork truck collision damage |
| Damage on receipt | Receiving damage | Damaged shipment from supplier; customer returned item in unsaleable condition |
| Spoilage/expiration | Expiration waste | Perishable item expired in inventory; natural decay of plant material |
| Unknown loss | Shrinkage | Inventory count discrepancy with no identified cause; suspected theft |
| Environmental disposal | Environmental waste | Pruning waste; plant material requiring disposal per regulation |
| Quality rejection | Quality waste | Items rejected by quality control and deemed unsaleable |

### When NOT to record waste

Do not use the waste recording system for:

- **Normal sales movements:** Use sales order processing instead
- **Transfers between facilities:** Use inventory transfer documents
- **Reclassification:** Use item journal reclassifications
- **Returns to supplier:** Record supplier return order instead
- **Items held for customer issues:** Don't record as waste until final decision (may be salvageable)

## Creating waste records

### Starting a waste record

1. Navigate to **Inventory** > **Waste Transactions** or **Inventory** > **Waste Recording**.
2. Click **New** to create a waste entry.
3. Enter the following required information:
   - `Waste Date`: Today's date or the date waste was discovered
   - `Item No.`: Select the item being wasted
   - `Quantity Wasted`: Enter the quantity in base unit of measure (e.g., number of plants)
   - `Unit of Measure`: Confirm the unit (e.g., Each, Packs, Cases)
   - `Waste Reason Code`: Select the reason for waste (see section below)
   - `Reported By`: Your name or username
   - `Facility/Location`: Where the waste occurred (greenhouse, warehouse, shipping, etc.)
4. Click **OK** to create the waste record (status: **Draft**).

### Adding waste details

After creating the waste record:

1. Click **Edit** to open the full details form.
2. Complete additional information:
   - `Description`: Provide details about the waste (e.g., "Diseased plants removed from Production Order 50001, Section A")
   - `Unit Value`: (Optional) System may auto-populate item's standard cost. Adjust if different.
   - `Total Waste Value`: System calculates as Quantity × Unit Value
   - `Production Order No.` (if applicable): Link to the order if waste is from production
   - `Approved By`: Leave blank until manager approves
   - `Waste Disposal Method`: Disposal method used (e.g., Composting, Incineration, Landfill, Recycling)
3. (Optional) Attach photos or documents as evidence.
4. Click **Save**.

### Submitting for manager approval

1. On the waste record (status should be **Draft**), click **Submit for Approval**.
2. Leave a note for the approver if needed (e.g., "Frost damage to 500 plants in Section B").
3. Click **Submit**.
4. The record status changes to **Pending Approval** and a notification is sent to the waste manager.

## Using waste reason codes

### Standard waste reason codes

Use these standardized codes when recording waste:

| Code | Category | Description | Example Situations |
|------|----------|-------------|-------------------|
| PROD | Production | Manufacturing or production error | Wrong item in batch; defective production run |
| WAREHOUSE | Warehouse | Handling damage in warehouse operations | Dropped items; fork truck damage; stacking collapse |
| RECEIVING | Receiving | Damage upon receipt from supplier or customer | Crushed shipment; damaged product on arrival |
| SPOILAGE | Expiration | Expired or spoiled items | Expired perishables; natural plant decay |
| SHRINK | Shrinkage | Inventory count variances or unexplained loss | Count discrepancies; suspected theft; lost items |
| QUALITY | Quality Control | Rejected by quality standards | Failed QC inspection; failed crop inspection |
| ENVIRONMENTAL | Environmental | Environmental or regulatory disposal | Pruning waste; hazardous material disposal |
| DAMAGE | Customer Damage | Damage for customer-related reasons | Returned damaged goods; customer sample destruction |
| OTHER | Other | Miscellaneous reasons not above | (Use sparingly, describe in notes) |

### Selecting the correct reason code

When choosing a reason code:

1. Identify the primary cause of the waste
2. Select the corresponding reason code from the list
3. Provide specific details in the `Description` field
4. If multiple categories apply, select the most significant

**Examples:**

- Diseased plants in production → **QUALITY** (failed crop inspection)
- Dropped pallet in warehouse → **WAREHOUSE** (handling damage)
- Returned item arrived damaged → **RECEIVING** (damage on receipt)
- Inventory count short → **SHRINK** (unexplained loss)

## Linking waste to source

### Linking to production orders

If waste resulted from a production issue:

1. On the waste record, enter the `Production Order No.` field.
2. Select or type the production order number.
3. System displays the order details (item, quantity, expected output).
4. This creates a link from the waste record to the production batch.
5. Later analysis can trace waste back to specific production runs.

### Linking to purchase documents

If waste resulted from a supplier issue:

1. On the waste record, enter the `Receiving Document No.` (the purchase receipt that brought the damaged item in).
2. This links the waste to the receipt and ultimately to the supplier.
3. Useful for supplier quality issues and claims.

### Linking to locations

Always specify where waste occurred:

1. `Facility/Location`: The greenhouse or warehouse location
2. `Bin/Rack`: (Optional) Specific bin location if available
3. `Production Order No.`: Links to the specific crop/batch (if applicable)

This creates traceability for pattern analysis (e.g., "Section C has 3x more waste than other sections").

## Waste approval workflow

### Approval levels

Waste records follow an approval workflow:

| Status | Who Can Submit | Next Step | Notes |
|--------|---------------|-----------|-------|
| Draft | Data entry staff | Submit for Approval | Created but not yet official |
| Pending Approval | Submitted by staff | Manager reviews and approves/rejects | Awaiting manager decision |
| Approved | Manager approves | Record is finalized | Deducted from inventory; costs charged to Waste account |
| Rejected | Manager rejects | Staff corrects and resubmits | Issues identified; return to Draft for correction |

### Manager approval process

Managers review submitted waste records:

1. Navigate to **Inventory** > **Waste Approvals** or **Pending Approvals**.
2. Review waiting waste records:
   - Quantity seems reasonable for the item and reason?
   - Description is clear and detailed?
   - Linked to correct production order or document?
   - Unit value (waste cost) is reasonable?
3. To approve:
   - Click the record to open it
   - Click **Approve**
   - Optionally add approval notes
   - Click **Confirm**
4. To reject (request correction):
   - Click the record
   - Click **Reject**
   - Enter reason for rejection (e.g., "Please link to correct Production Order")
   - Click **Confirm**
   - Record returns to **Draft** for staff to correct

### Recording high-value waste

For waste exceeding a certain threshold (e.g., >$1,000 value):

1. The record requires an additional approval level (e.g., Warehouse Manager or Director)
2. Submit as normal and note the high value
3. Director receives escalated notification
4. Director reviews and approves/rejects

## Waste reporting

### Viewing waste by reason code

1. Navigate to **Reports** > **Inventory** > **Waste by Reason Code**.
2. Specify date range and any facility filters.
3. Report shows:
   - Quantity wasted by each reason code
   - Total waste value by reason
   - Trends identifying most common waste types
4. Use to identify improvement opportunities (e.g., if warehouse damage is high, improve handling training)

### Waste trending reports

1. Navigate to **Reports** > **Inventory** > **Waste Trend**.
2. Enter `Start Date` and `End Date` for analysis period.
3. Specify `Facility/Location` if focusing on a specific area.
4. Click **Generate Report**.

Report shows:
- Monthly waste quantities and costs
- Trends over time (increasing/decreasing)
- Waste by category over time

### Production waste analysis

Track waste from specific production orders:

1. Navigate to **Reports** > **Production** > **Production Waste**.
2. Enter `Production Order No.` or leave blank to see all orders.
3. Report shows:
   - Waste quantity and value per order
   - Waste reason codes per order
   - Quality score (% yield after waste)

Use this to identify problematic production runs or orders.

### Waste cost allocation

The system can allocate waste costs to specific cost centers:

1. When approving waste, verify the `Cost Center` or `Account Code` is correct.
2. Approved waste reduces standard inventory balance and charges to the Waste account.
3. Reports can show waste costs by department, facility, or time period for budgeting analysis.

## Troubleshooting

### Issue: Cannot create waste record for item

**Problem:** When trying to select an item, it doesn't appear or gives an error.

**Solutions:**
1. Verify the item exists in inventory (check Item Master)
2. Ensure the item is not marked as inactive/discontinued
3. Try typing the full item number instead of selecting
4. Check that you have inventory access permissions

### Issue: Supervisor won't approve my waste record

**Problem:** Submitted waste has been rejected multiple times.

**Solutions:**
1. Check the rejection notes from the supervisor
2. Ensure waste reason code matches the actual cause
3. Add more detailed description of what happened
4. Verify linked production order number is correct
5. Contact the supervisor directly to clarify expectations

### Issue: Wrong waste recorded but already approved

**Problem:** An approved waste record has incorrect information.

**Solutions:**
1. Contact your Inventory Manager or IT support—approved records cannot be edited by staff
2. Request a **reversal** waste transaction:
   - Create a new waste record with the same quantity but negative value
   - This offsets the incorrect approved transaction
3. Document the reason for reversal in notes

### Issue: Waste not appearing in cost reports

**Problem:** Approved waste is not reducing standard cost in reports.

**Solutions:**
1. Verify the waste was **Approved** (not just submitted)
2. Wait until end-of-day batch processing (waste may process after business hours)
3. Check if the waste date is within the reporting period
4. Contact IT support for batch job status

## FAQ

**Q: How quickly does approved waste reduce my inventory?**
A: Approved waste records normally reduce standard cost and inventory balances within 24 hours. Depending on system configuration, it may process during end-of-day batch jobs or in real-time.

**Q: Can I record waste with a negative quantity to reverse an entry?**
A: No. To reverse an incorrect waste entry, create a new reversal entry with positive quantity and reason code "Reversal" or "Correction". This maintains an audit trail.

**Q: Who decides the unit value of wasted items?**
A: The system uses the item's cost from the item master. For custom waste values, contact your inventory manager or accountant. High-value waste may require special approval.

**Q: What if I don't know which production order the waste came from?**
A: Leave the Production Order field blank and provide as much detail as possible in the Description. The manager may be able to research or request you find the order.

**Q: Can I bulk record multiple waste transactions at once?**
A: Not through the standard waste entry form. Ask your IT administrator about bulk import capabilities if you need to record many waste entries at once.

**Q: How do I report on waste trends over time?**
A: Use the **Waste Trend Report** (Reports > Inventory > Waste Trend) to view waste by month and reason code over a selected time period.

**Q: Is there a way to prevent certain waste categories?**
A: Analyzing waste reports can identify opportunities for improvement. Work with your manager on process changes (better handling, supplier quality issues, production training, etc.) to reduce waste in problem areas.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/waste-recording-guide.pdf)
