---
title: Purchase Requisitions
type: howto
tags: [purchasing, requisitions, budgets, approval, procurement]
created: 2026-04-27
updated: 2026-04-27
sources: [purchase-requisition-guide.md]
---

# Purchase Requisitions

Formal purchase request system for departments to request items, route through approval workflow, consolidate for volume discounts, and track procurement spending.

---

## What This Is

The Purchase Requisition system enables controlled procurement by:

1. **Centralizing requests** — All purchase requests go through formal requisition process
2. **Enforcing approval** — Budget and manager authorization before orders placed
3. **Consolidating** — Grouping similar requests to same suppliers for volume discounts
4. **Tracking** — Complete audit trail of who requested what, when, and for what reason
5. **Preventing unauthorized spend** — Budget controls prevent overspending

**Key benefits:**

- Budget control through approval routing
- Spend visibility before orders are placed
- Volume discounts through consolidation
- Audit trail for compliance
- Prevents duplicate or unnecessary purchases

---

## When to Use It

Use Purchase Requisitions when you need to:

- Request items for your department
- Consolidate purchases with other departments
- Track spending before orders are placed
- Route requests through approval workflow
- Document the reason for purchases

---

## Prerequisites

- Department manager or authorized purchase requestor role
- Budget access or cost center assignment
- Knowledge of available items (item numbers)
- Supplier and vendor information

---

## How to Create a Purchase Requisition

### Step 1: Start a new requisition

1. Navigate to **Purchasing** > **Purchase Requisitions** or **Purchasing** > **New Requisition**
2. Click **New** to create a requisition
3. Enter header information:
   - `Requisition Date`: Today's date
   - `Department`: Your department
   - `Requested By`: Your name (may auto-populate)
   - `Due Date`: When items are needed (drives supplier selection)
   - `Reason/Project` (optional): Reference code or project number
4. Click **OK** to create (Status: **Draft**)

### Step 2: Add requisition lines

1. Click **Edit** to open the full form
2. In the lines section, click **Add Line** or **New Line**
3. For each item requested, enter:
   - `Item No.`: Select or type the item number
   - `Description`: System auto-fills; verify it's correct
   - `Quantity`: How many units needed
   - `Unit of Measure`: System auto-fills (Each, Pack, Case, etc.)
   - `Unit Price` (optional): Expected price for budgeting
   - `Dimension/Variant` (optional): Select specific size or color
4. Click **Save** after each line or complete all lines before saving

### Step 3: Add multiple items efficiently

To add many items at once:

1. Open requisition for editing
2. Click **Add Multiple Items** (if available)
3. Enter items in list format:
   ```
   Item No.    Quantity
   ITEM-001    100
   ITEM-002    50
   ITEM-003    25
   ```
4. System adds all items at once

---

## Understanding the Approval Process

### Requisition status flow

```
Draft → Pending Approval → Approved → Converted to PO → Complete
              ↓
          Rejected (return to Draft)
```

### Approval routing

Requisitions route for approval based on:

| Criteria | Approver |
|----------|----------|
| Budget limit | Cost center manager |
| Amount threshold | Department director |
| Department rules | Department head |
| Special items | Procurement approval |

### What happens during approval

1. Your completed requisition is submitted for approval
2. Approver(s) review the requisition
3. Approver checks budget availability
4. Approver either approves or rejects
5. If rejected, returns to you with comments
6. If approved, moves to conversion

---

## Converting Requisitions to Orders

### Automatic consolidation

When requisitions are approved:

1. System identifies similar requisitions for the same supplier
2. Groups them together (consolidation)
3. Buyer reviews consolidated group
4. Buyer creates single purchase order for volume discount
5. Individual requisitions linked to the order

### Creating purchase orders from requisitions

1. Navigate to **Purchasing** > **Approved Requisitions**
2. Select requisition(s) to convert
3. Click **Create Purchase Order** or **Consolidate**
4. System shows consolidation options:
   - **By Supplier**: Group all items from one supplier
   - **By Requested Date**: Group by when items are needed
   - **By Department**: Group by requesting department
5. Click **OK** to create order(s)
6. Requisition status changes to **Converted**

---

## Consolidating Requisitions

### Viewing consolidation opportunities

1. Navigate to **Purchasing** > **Consolidation Workbench** (if available)
2. System shows pending requisitions with consolidation suggestions
3. Review grouped requisitions
4. Analyze volume discount opportunity

### Manual consolidation

1. Select multiple requisitions for the same supplier
2. Click **Consolidate into PO**
3. System creates single purchase order
4. Volume discount may apply
5. All linked requisitions marked as converted

---

## Tracking Requisition Status

### Finding a requisition

1. Navigate to **Purchasing** > **Purchase Requisitions**
2. Use filters:
   - By status (Draft, Pending, Approved, Converted)
   - By date range
   - By department
   - By requesting person
3. Click a requisition to view details

### Checking approval status

1. Open your requisition
2. **Status** field shows: Draft, Pending Approval, Approved, or Converted
3. **Approval Log** section shows:
   - Who reviewed it
   - When they reviewed it
   - Their comments
   - Approval or rejection reason

### Following up on stuck requisitions

If a requisition is stuck in Pending Approval:

1. Check the due date (may have changed)
2. Contact the approver to check status
3. Request expedited approval if urgent
4. If approver unavailable, escalate through management chain

---

## Troubleshooting

### "Budget exceeded" error

**Problem:** Cannot submit requisition because budget is insufficient.

**Solutions:**
1. Reduce quantity requested
2. Request fewer items (defer some to next period)
3. Request budget increase through manager
4. Ask procurement if different item is available at lower cost

### "Item not found" error

**Problem:** Item number doesn't exist in system.

**Solutions:**
1. Verify item number is correct
2. Search for the item to find correct number
3. If item truly doesn't exist, submit request to add it to system first
4. Contact procurement if unsure about available items

### Requisition stuck in Pending Approval

**Problem:** Requisition not moving forward; approver hasn't reviewed it.

**Solutions:**
1. Check approver's vacation status
2. Reach out directly to approver
3. Request delegation to backup approver
4. Escalate through manager if urgent

---

## FAQ

**Q: Can I edit a requisition after submitting it?**
A: Only if it's still in Draft status. After submission, editing is typically locked.

**Q: What's the difference between requisition and purchase order?**
A: Requisition is the request (internal); Purchase Order is the binding order sent to supplier.

**Q: How long does approval typically take?**
A: Usually 1-2 business days. Check your company's approval SLA.

**Q: Can I convert my requisition multiple times?**
A: No. Once converted to a purchase order, the requisition is locked.

**Q: What if the supplier price is higher than I estimated?**
A: The purchase order amount controls final cost. Requisition price estimate is for budgeting only.

---

## Related Pages

- [[invoice-approval-process]] — Approving invoices after goods are received
- [[purchase-receipt-overview]] — Receiving and quality checks
- [[approval-routing-rules]] — How approval amounts are determined
