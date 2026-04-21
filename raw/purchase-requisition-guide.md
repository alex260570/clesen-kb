# Purchase requisition guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Purchasers, buying agents, department managers
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Creating purchase requisitions](#creating-purchase-requisitions)
- [Understanding the approval process](#understanding-the-approval-process)
- [Converting requisitions to orders](#converting-requisitions-to-orders)
- [Consolidating requisitions](#consolidating-requisitions)
- [Tracking requisition status](#tracking-requisition-status)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Purchase Requisition system enables departments and managers to formally request items for purchase. Requisitions route through an approval workflow and are consolidated into purchase orders for supplier placement. This ensures budget control and centralized procurement.

### Purpose and benefits

- **Budget control:** Centralize purchase requests through approval workflow
- **Spend visibility:** Track all requested purchases before orders are placed
- **Approval routing:** Ensure proper authorization before committing to spend
- **Consolidation:** Group similar requisitions to suppliers for volume discounts
- **Audit trail:** Maintain complete history of who requested what and when

### Prerequisites

- Department manager or authorized purchase requestor role
- Budget access to commit funds
- Item master knowledge (knowing what items are available)
- Supplier and vendor information

## Creating purchase requisitions

### Steps to create a purchase requisition

1. Navigate to **Purchasing** > **Purchase Requisitions** or **Purchasing** > **New Requisition**.
2. Click **New** to create a requisition.
3. Enter the header information:
   - `Requisition date`: Today's date
   - `Department`: Your department
   - `Requested By`: Your name or username (may auto-populate)
   - `Due Date`: When items are needed (this drives supplier selection)
   - `Reason/Project` (optional): Reference code or project number if applicable
4. Click **OK** to create the requisition (Status: **Draft**).

### Adding requisition lines

After creating the requisition:

1. Click **Edit** to open the full form.
2. In the lines section, click **Add Line** or **New Line**.
3. For each item requested, enter:
   - `Item No.`: Select or type the item number
   - `Description`: System auto-fills; verify it's correct
   - `Quantity`: How many units needed
   - `Unit of Measure`: System auto-fills (Each, Pack, Case, etc.)
   - `Currency Code`: Currency for pricing (if applicable)
   - `Dimension/Variant` (if applicable): Select specific size or color variant
4. (Optional) `Unit Price`: If you know the expected price, enter it for budgeting
5. Click **Save** after entering each line, or complete all lines before saving.

### Adding multiple items efficiently

To add items quickly:

1. Open the requisition for editing.
2. In the lines section, click **Add Multiple Items** (if available).
3. Enter items in list format:
   ```
   Item No.    Quantity
   ITEM-001    100
   ITEM-002    50
   ITEM-003    25
   ```
4. Click **Import** to add all items at once.

### Optional requisition details

You can add additional information to the requisition:

- `Expected Supplier`: Suggest a preferred vendor (not binding)
- `Special Instructions`: Delivery instructions or quality requirements
- `Cost Center/Budget Code`: Charge this purchase to a specific budget
- `Attachments`: Attach specification sheets, drawings, or reference documents

## Understanding the approval process

### Approval workflow overview

Purchase requisitions route through a standard approval workflow:

```
Draft → Submitted → Pending Approval → Approved → Ready for PO
                          ↓
                      Rejected (return to Draft)
```

### Submitting a requisition for approval

1. After completing the requisition and adding all lines, click **Submit for Approval**.
2. (Optional) Add a note for the approver:
   - Explain urgency if needed
   - Reference project or cost center
   - Note any special requirements
3. Click **Submit**.
4. Status changes to **Pending Approval** and an approval notification is sent.

### Manager approval process

Managers review submitted requisitions:

1. Navigate to **Purchasing** > **Requisitions to Review** or **My Approvals**.
2. Click on a pending requisition to review:
   - Verify items are reasonable for the department
   - Check quantities are appropriate
   - Confirm budget code is correct
   - Review Due Date (does supplier have items available?)
3. To approve:
   - Click **Approve**
   - (Optional) Add approval comment (e.g., "Approved for Q2 growing supplies")
   - Click **Confirm**
   - Status changes to **Approved**
4. To reject:
   - Click **Reject**
   - Provide reason (e.g., "Please use vendor discount code XYZ")
   - Click **Confirm**
   - Requisition returns to **Draft** for requester to correct

### High-value approval routing

For requisitions exceeding a authorization threshold (e.g., >$5,000):

1. The requisition requires an additional approval level
2. Department manager approves first (standard process)
3. Then routes to Director or Finance approval
4. All approvers notified; each must approve for requisition to proceed

### Overriding rejections

If a requisition is rejected but you believe it's necessary:

1. Open the requisition (status: **Draft** after rejection).
2. Address the reviewer's concerns:
   - Attach additional justification documents
   - Add notes explaining why the purchase is necessary
   - Include vendor quotes or specifications
3. Click **Submit for Approval** again with updated information.

## Converting requisitions to orders

### Automatic conversion

After a requisition is **Approved**:

1. The system may automatically suggest purchase orders
2. Review the suggested PO(s):
   - Correct supplier selected?
   - Quantities reasonable for one order or should be split?
   - Delivery date achievable?
3. Click **Create Purchase Order** to generate the official PO.

### Manual purchase order creation

To create a purchase order from an approved requisition:

1. Open the requisition (Status should be **Approved**).
2. Click **Create PO** or **Convert to Purchase Order**.
3. In the creation dialog:
   - `Supplier No.`: Select the vendor
   - `PO Type`: Standard order, blanket order, or drop-ship
   - `Requested Delivery Date`: When items should arrive
   - `Special Terms` (optional): Payment terms, FOB, etc.
4. Click **Create** to generate the PO.

The requisition status changes to **Converted** and links to the new PO number.

### Splitting requisitions across multiple suppliers

If different items should come from different suppliers:

1. Open the approved requisition.
2. Click **Create PO** multiple times, selecting different suppliers:
   - First PO: Items available from Supplier A
   - Second PO: Items available from Supplier B
   - Third PO: Items available from Supplier C
3. Each PO covers the items that supplier provides.
4. Delete lines from subsequent POs that aren't applicable.

## Consolidating requisitions

### Understanding consolidation

Consolidation groups multiple requisitions into a single purchase order for volume discounts or shipping efficiency.

### Automatic consolidation suggestions

1. Navigate to **Purchasing** > **Requisition Consolidation** or **Consolidation Dashboard**.
2. System suggests consolidations based on:
   - Same supplier
   - Similar due dates
   - Same item categories
3. Review suggested consolidations:
   - Do due dates align closely enough?
   - Would consolidation delay delivery for any items?
   - Are quantities reasonable to combine?
4. Click **Approve Consolidation** for groupings you want combined.

### Manual consolidation

To manually consolidate requisitions:

1. Open the first requisition.
2. Click **View Related** > **Other Requisitions** to see pending requisitions.
3. Click **Consolidate With** and select other requisitions to combine.
4. Review the combined items:
   - Confirm all items from both requisitions are included
   - Group by supplier if applicable
5. Complete supplier selection and create one combined PO.

### Consolidation tips

- Consolidate items going to the same supplier for volume discounts
- Be mindful of due dates (don't delay urgent items for non-urgent ones)
- Once converted to POs, requisitions cannot be recombined
- Consolidation decisions should balance cost savings vs. delivery speed

## Tracking requisition status

### Viewing your requisitions

1. Navigate to **Purchasing** > **My Requisitions** or **Purchase Requisitions**.
2. System displays requisitions created by you with status:
   - **Draft**: Being prepared, not yet submitted
   - **Pending Approval**: Awaiting approval
   - **Approved**: Approved; ready to convert to PO
   - **Converted**: Already created as PO
   - **Rejected**: Rejected by approver; needs correction

### Tracking through approval

To see where a requisition is in the approval process:

1. Open the requisition.
2. Click **Approval History** or **Status Timeline**.
3. View:
   - When it was submitted
   - Who it's awaiting approval from
   - Approval comments or rejection reasons

### Viewing related purchase orders

Once a requisition converts to a PO:

1. Open the requisition (Status: **Converted**).
2. Click **View Related** > **Purchase Order** or **View PO**.
3. The linked PO opens, showing:
   - Purchase order number
   - Order date
   - Supplier
   - Ordered items and quantities
   - PO status (pending, received, invoiced, etc.)

### Following receipt and invoicing

After a PO is created:

1. System tracks receipt: Click **View Related** > **Purchase Receipt** once items arrive
2. Invoice status: When invoice arrives, shows on PO
3. Payment: Once receipt and invoice match, ready for payment

## Troubleshooting

### Issue: Cannot create requisition

**Problem:** New button is disabled or requisition won't create.

**Solutions:**
1. Verify you have purchasing or requisition creation permissions
2. Check if a budget or cost center is required (need to select before creating)
3. Try refreshing the page
4. Contact your manager or IT support

### Issue: Requisition stuck in Pending Approval

**Problem:** Requisition has been pending approval for days.

**Solutions:**
1. Open the requisition and check approval history:
   - See who it's waiting for
   - Check if they left comments
2. Contact the approver directly (don't wait for automatic reminders)
3. Escalate to their manager if they're unavailable
4. May need to add urgency note and resubmit

### Issue: Cannot convert requisition to purchase order

**Problem:** Approved requisition shows error when trying to create PO.

**Solutions:**
1. Verify all item numbers are valid (no deleted or invalid items)
2. Ensure supplier is marked as active in vendor master
3. Manually enter supplier if system can't find it
4. Contact purchasing department if issue persists

### Issue: Items in requisition no longer needed

**Problem:** After submitting, you realize one item shouldn't have been requested.

**Solutions:**
1. If still in **Draft**: Simply delete the line and save
2. If **Pending Approval**: Request rejection, correct, and resubmit
3. If already **Converted to PO**: Contact purchasing to cancel the PO line

## FAQ

**Q: Can I edit a requisition after submitting it?**
A: No. Once submitted, requisitions lock to prevent changes during approval. If you need to make changes, request the approver reject it, then you can edit and resubmit.

**Q: How do I request expedited approval?**
A: Add a note when submitting explaining urgency. You can also contact the approver directly. Urgent requisitions may route to a director-level approval if spending threshold allows override.

**Q: What if I don't know the supplier yet?**
A: Leave supplier blank in the requisition. Once approved, the purchasing department selects the best supplier. Or, suggest a supplier in the requisition notes for purchasing to consider.

**Q: Can I share a requisition draft with colleagues?**
A: Requisitions are individual records. To coordinate with colleagues, attach specification documents that multiple people need to review. Then submit as a single requisition.

**Q: How far in advance should I submit a requisition?**
A: Submit at least 1 week before needed for standard items, 2-3 weeks for specialty items or if supplier needs to order. Very urgent requests may take longer due to approval process.

**Q: What's the difference between a requisition and a purchase order?**
A: Requisition is a request (internal document). Purchase order is a formal offer to a supplier (external document). Requisitions must be approved before converting to POs.

**Q: Can I cancel a requisition?**
A: Yes. If Approved but not yet converted to PO, click **Cancel**. If already converted to PO, you must cancel the PO instead.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/purchase-requisition-guide.pdf)
