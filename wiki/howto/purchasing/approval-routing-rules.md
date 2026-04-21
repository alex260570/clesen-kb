---
title: Managing Approval Routing Rules
type: howto
tags: [purchasing, invoices, approval, finance-administration]
created: 2026-04-21
updated: 2026-04-21
sources: [invoice-approval-workflow-guide.md]
---

# Managing Approval Routing Rules

## Viewing approval rules

1. Navigate to **Finance** > **Approval Setup** > **Invoice Approval Rules** or **Administration** > **Approval Routing**.
2. System displays all active approval rules:
   - Amount thresholds
   - Department routing
   - Vendor-specific rules
   - Exception handling

## Creating custom approval rules

Finance managers can create custom rules:

1. Click **New Rule**.
2. Define rule parameters:
   - `Rule Name`: Description (e.g., "Marketing Dept High-Value")
   - `Criteria`:
     - Amount range (from/to)
     - Specific department or cost center
     - Vendor list or vendor category
     - Account code filter
   - `Approver(s)`: Who must approve
   - `Priority`: If multiple rules match, which takes precedence?
3. Click **Save Rule**.

## Example custom rules

- "Any invoice for Vendor XYZ over $500 requires Director approval"
- "Marketing Department expenses over $2,000 require CMO approval"
- "Equipment purchases over $5,000 require CFO approval plus two cost center managers"

## Standard approval thresholds

The default routing structure is:

| Amount | Approver |
|--------|----------|
| ≤ $1,000 | Department Manager |
| $1,001–$5,000 | Finance Manager |
| $5,001–$50,000 | Director or VP |
| > $50,000 | CFO approval required |

## Special approval scenarios

In addition to amount-based rules, special circumstances trigger additional routing:

- **Vendor change:** Procurement approval required
- **New vendor (first-time):** Finance + Procurement approval
- **Rush/expedited invoice:** Department Manager + Finance approval

See [[invoice-approval-workflow]] for the complete workflow overview.