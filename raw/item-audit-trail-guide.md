# Item audit trail guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Inventory managers, compliance/auditing staff
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Understanding audit logs](#understanding-audit-logs)
- [Viewing item log entries](#viewing-item-log-entries)
- [Interpreting change history](#interpreting-change-history)
- [Tracking facility and bin changes](#tracking-facility-and-bin-changes)
- [Monitoring unavailable items](#monitoring-unavailable-items)
- [Turnover analysis](#turnover-analysis)
- [Running audit reports](#running-audit-reports)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Item Audit Trail system provides comprehensive tracking of all changes made to items in the system. Every modification is logged with details about what changed, who changed it, when, and where applicable, which production order or document triggered the change.

### Purpose and benefits

- **Compliance:** Maintain detailed records for regulatory and internal audits
- **Traceability:** Track the complete history of any item's changes
- **Problem diagnosis:** Identify when issues were introduced
- **Performance analysis:** Monitor item turnover and usage patterns
- **Risk management:** Quickly locate and review sensitive changes

### Prerequisites

- Inventory manager or compliance auditor role
- Understanding of item master configuration
- Familiarity with Business Central inventory functions
- (Optional) Basic knowledge of SQL for advanced queries

## Understanding audit logs

### Types of item changes tracked

The audit trail captures the following item-related changes:

| Change Type | Description | Tracked Information |
|-------------|-------------|---------------------|
| Item created | New item added to master | Created by, created date, initial settings |
| Item updated | Item fields modified | Modified by, date, old value, new value, field name |
| Inventory posted | Stock movement via journal | Post date, quantity, value, location, document reference |
| Item facility changed | Item moved to different facility | Changed by, date, old facility, new facility |
| Item bin changed | Item moved to different bin location | Changed by, date, old bin, new bin |
| Item marked unavailable | Item removed from sale | Marked by, date, reason code |
| Item marked available | Item returned to active use | Changed by, date, reason for reactivation |
| Item marked obsolete | Item discontinued | Marked by, date, reason, disposal date |

### Log entry structure

Each audit log entry contains:

- `Item No.`: The item that was changed
- `Entry Type`: Category of change (creation, modification, movement, etc.)
- `Changed By`: Username of person making the change
- `Change DateTime`: Exact timestamp of the change
- `Field Changed`: Which field(s) were modified (for updates)
- `Old Value`: Previous value before the change
- `New Value`: Current value after the change
- `Document Reference`: Link to related document (if any)
- `Reason Code`: Optional reason for the change

## Viewing item log entries

### Accessing the item audit trail

1. Navigate to **Inventory** > **Item Audit Trail** or **Inventory** > **Items > Audit History**.
2. The page displays all item changes in chronological order (newest first).

### Filtering by item

1. Open the **Item Audit Trail** page.
2. In the `Item No.` field, enter or select the specific item to track.
3. Click **Apply Filter** (or **Search** if a search button is available).
4. Results show all changes to that item, ordered by date (newest first).

Viewing specific item changes:

1. Click on any log entry row to open full details.
2. Review all tracked fields and their changes:
   - `Field Name`: The specific field that changed
   - `Old Value`: What the field contained before
   - `New Value`: What the field contains now
   - `Changed By` and `Change DateTime`: Who and when

### Filtering by date range

1. Open the **Item Audit Trail** page.
2. Enter the `Start Date` and `End Date` for the period to review.
3. (Optional) Also filter by `Item No.` if focusing on specific items.
4. Click **Apply Filter** to show changes within that period.

This is useful for:
- Reviewing changes made yesterday or last week
- Investigating specific time periods when issues occurred
- Generating reports for periodic compliance reviews

### Advanced filtering options

The audit trail supports filtering by:

- `Changed By`: See all changes made by a specific user
- `Entry Type`: Filter to only certain change types (e.g., "Item Updated", "Item Facility Changed")
- `Reason Code`: Find all items changed for a specific reason
- `Document Reference`: Trace back to the source document (e.g., production order #12345)

1. Click **Advanced Filters** (or **More Filters**).
2. Enter desired filter criteria.
3. Click **Apply** to show results.

## Interpreting change history

### Understanding update entries

When an item is modified, the audit trail shows:

```
Item No: PLANT-001
Entry Type: Item Updated
Changed By: john.smith
Change DateTime: 2026-03-15 14:30:00
Field Changed: Unit Price
Old Value: 12.50
New Value: 13.50
Document Reference: (none)
Reason Code: Price Adjustment
```

This indicates that on March 15 at 2:30 PM, John Smith changed PLANT-001's unit price from $12.50 to $13.50 for a price adjustment.

### Understanding movement entries

When an item's location changes (facility or bin):

```
Item No: PLANT-001
Entry Type: Item Facility Changed
Changed By: jane.doe
Change DateTime: 2026-03-14 09:15:00
Old Value: Main Greenhouse
New Value: Secondary Facility
Document Reference: PO 50001
Reason Code: Production Transfer
```

This shows Jane Doe moved PLANT-001 from Main Greenhouse to Secondary Facility on March 14, triggered by Production Order 50001.

### Reading multiple changes to one item

Items are frequently modified multiple times. The audit trail shows a complete chronological history:

1. Open the **Item Audit Trail** for a specific item.
2. Review entries from bottom to top to see the progression from oldest to newest.
3. Look for patterns:
   - Frequent price changes indicate pricing volatility
   - Multiple facility moves suggest inventory routing issues
   - Recent unavailability flags suggest supply problems

## Tracking facility and bin changes

### Viewing all facility transfers

1. Open **Item Audit Trail**.
2. Click **Advanced Filters** > **Entry Type**.
3. Select **Item Facility Changed**.
4. Click **Apply**.
5. Results show only items that changed facilities.

### Identifying current item locations

1. To find where an item currently resides, review the most recent entry in its audit trail.
2. Look for the last "Item Facility Changed" or "Item Bin Changed" entry.
3. The `New Value` field shows the item's current location.

### Monitoring repeated moves

If an item moves between facilities frequently:

1. Open its audit trail.
2. Filter to "Item Facility Changed" entries only.
3. Note the dates and facilities involved.
4. Contact your warehouse operations manager to understand the reason.

Frequent moves may indicate:
- Inefficient warehouse organization
- Compatibility issues between production facilities
- Temporary staging that should be permanent

## Monitoring unavailable items

### Finding items marked unavailable

1. Open **Item Audit Trail**.
2. Click **Advanced Filters** > **Entry Type**.
3. Select **Item Marked Unavailable**.
4. Click **Apply**.

This shows a timeline of all items taken off the market.

### Understanding unavailability reasons

When viewing unavailable item entries, check the `Reason Code`:

| Reason | Meaning | Typical Action |
|--------|---------|-----------------|
| Discontinued | Item is permanently discontinued | Remove from catalogs, finish existing inventory |
| Out of Stock | Temporarily out of stock | Monitor for replenishment |
| Seasonal | Not available in current season | Plan for next availability |
| Quality Issue | Quality problem identified | Investigate root cause, implement corrective action |
| Supplier Issue | Supplier cannot provide | Source alternative supplier or item |
| Obsolete | Superceded by newer item | Direct customers to replacement item |

### Preventing accidental unavailability

1. When reviewing audit trail, look for items marked unavailable without an apparent reason.
2. If an item was mistakenly marked unavailable:
   - Contact the person who made the change (see `Changed By` field)
   - Request that the item be reactivated
   - Document the reason for reactivation in the audit trail

## Turnover analysis

### Understanding item turnover

The audit trail allows you to analyze how frequently items move through inventory:

1. Open **Item Audit Trail**.
2. Filter by `Entry Type` = **Inventory Posted** (movements through inventory).
3. For a specific `Item No.`, count the number of posts in a time period.
4. High posting frequency indicates fast-moving inventory; low frequency indicates slow-moving inventory.

### Identifying slow-moving items

1. Open **Item Audit Trail**.
2. Enter a date range (e.g., last 90 days).
3. Set `Entry Type` = **Inventory Posted**.
4. Review items with few or no entries—these are slow-moving items.
5. Consider:
   - Are slow-moving items still needed?
   - Should inventory levels be reduced?
   - Are there sales opportunities being missed?

### Identifying fast-moving items

1. Filter to recent "Inventory Posted" entries.
2. Identify items with many entries in short periods.
3. Consider:
   - Are inventory levels adequate to support demand?
   - Should suppliers increase delivery frequency?
   - Are there production bottlenecks?

## Running audit reports

### Accessing audit reports

1. Navigate to **Reports** > **Inventory** > **Item Audit Reports**.
2. Available reports include:
   - Item Change Summary
   - Item Movement History
   - Unavailable Items Report
   - Item Turnover Analysis

### Generating a change summary report

The Item Change Summary shows all items modified within a period:

1. Open **Reports** > **Item Audit Reports** > **Item Change Summary**.
2. Enter parameters:
   - `Start Date`: Beginning of reporting period
   - `End Date`: End of reporting period
   - `Include Fields Changed`: Check fields you want to see (optional, default: all)
3. Click **Generate Report**.

The report shows:
- All items changed during the period
- Types of changes made
- User who made each change
- Change timestamps
- Summary statistics (total items changed, most active users, etc.)

### Exporting audit data

1. Open **Item Audit Trail**.
2. Apply filters for the data you want to export.
3. Click **Export** > **To Excel** or **To CSV**.
4. Select save location and click **Save**.

Exported data can be analyzed in Excel for deeper insights or shared with auditors.

## Troubleshooting

### Issue: Missing entries in audit trail

**Problem:** Expected changes don't appear in the audit trail.

**Causes:**
- Audit logging may not have been enabled when the changes were made
- Date range filters are too restrictive
- Deleted items and their audit history may be archived

**Solutions:**
1. Verify the correct date range is selected
2. Clear all filters and search again
3. Ask your IT administrator if audit logging was active at the time
4. Check if the item was deleted (deleted items may have separate audit logs)

### Issue: Cannot find a specific change

**Problem:** You know a change was made but can't locate it in the audit trail.

**Solutions:**
1. Try filtering by `Changed By` (username) if you know who made the change
2. Expand the date range—dates may have been slightly different than expected
3. Check if the item number is correct (case-sensitive in some systems)
4. Use the `Document Reference` filter if you know the related document number

### Issue: Audit report takes too long to generate

**Problem:** Generating an audit report with a large date range is slow.

**Solutions:**
1. Narrow the date range (report smaller time periods separately)
2. Filter to specific item numbers rather than all items
3. Filter to specific entry types ("Item Updated", etc.) rather than all types
4. Contact IT to discuss report optimization

## FAQ

**Q: How long are audit trail entries retained?**
A: Audit trail entries are retained indefinitely. If your system is running low on disk space, old entries may be archived, but they remain available. Contact your IT administrator about retention policies.

**Q: Can I delete or modify audit trail entries?**
A: No. Audit trail entries are immutable—they cannot be edited or deleted by users. This is critical for compliance and audit integrity. Only system administrators can modify audit logs, and such modifications are themselves logged.

**Q: Who has access to the audit trail?**
A: Access to the full audit trail is typically restricted to inventory managers, compliance staff, and administrators. Some users may have read-only access to their own changes. Check with your IT administrator about access policies.

**Q: Can I see who deleted an item?**
A: If an item was deleted, the deletion itself is logged with the date, time, and user who deleted it. Navigate to the **Deleted Items** area if available, or ask your IT administrator for deletion logs.

**Q: What does "Interim" mean as an Entry Type?**
A: Interim entries capture temporary state changes. These rarely appear in normal operations; they typically indicate system health checks or maintenance activities.

**Q: Can I revert a change by looking at the audit trail?**
A: The audit trail shows what changed but doesn't provide an automatic revert button. To revert a change, you must manually update the item back to its previous value (which will create a new audit entry showing the reversion). Document your reason for the reversion.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/item-audit-trail-guide.pdf)
