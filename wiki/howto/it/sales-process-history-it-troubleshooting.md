---
title: Sales Process History — IT Troubleshooting
type: howto
tags: [sales-orders, audit-trail, it-support, system-administration]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-process-history-it-troubleshooting-guide.md]
---

# Sales Process History — IT Troubleshooting Guide

Technical documentation for IT staff supporting the Sales Process History feature.

## System Architecture

### Component Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              Sales Process History System                   │
└─────────────────────────────────────────────────────────────┘
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
┌───▼───┐         ┌────▼────┐         ┌───▼───┐
│Tables │         │Codeunits│         │ Pages │
└───┬───┘         └────┬────┘         └───┬───┘
    │                  │                  │
 50025: CLE      50009: CLE Sales   50044: CLE Sales
 Sales Line      Management          Line History
 History         50010: CLE Sales    (Display)
 (Storage)       Mgt Subscribers
                 (Event Triggers)
```

### Data Flow Architecture

```text
User Action (Insert/Modify/Delete Sales Line)
    ↓
Sales Line Table Event (OnAfterInsert/OnAfterModify/OnAfterDelete)
    ↓
Event Subscriber (Codeunit 50010)
    ├─ Check: CW Activate S-Line Tracking = TRUE?
    ├─ Check: Not in Upgrade Mode?
    ├─ Check: Not Temporary Inactive?
    └─ Check: Not temporary record?
    ↓ (All checks pass)
Call InsertSalesHistoryLine() (Codeunit 50009)
    ├─ Get Prior History Entry (same Set ID)
    ├─ Calculate Current Amount
    ├─ Calculate Difference = Current - Prior
    ├─ Skip if Difference = 0 or Set ID = 0
    ├─ Get Booking Date (from Blanket/Order)
    ├─ Calculate Week Numbers
    ├─ Determine Financial Season
    ├─ Capture User/Salesperson/Customer
    └─ Insert New History Record
    ↓
CLE Sales Line History Table (50025)
    ↓
User Views History
    ↓
CLE Sales Line History Page (50044)
```

### Posting Flow

```text
Post Sales Order (Invoice/Credit Memo)
    ↓
Sales Invoice Line / Sales Cr.Memo Line Inserted
    ↓
OnAfterInsertEvent Triggered
    ↓
Event Subscriber (Codeunit 50010)
    ├─ For Invoice: InsertSalesHistoryLineOnPostInvoice()
    └─ For Credit Memo: InsertSalesHistoryLineOnPostCreditMemo()
    ↓
History Record Created (Action = "Posting")
    ├─ Invoice: Positive amounts
    └─ Credit Memo: Negative amounts
```

## Technical Components

### Custom Tables

#### Table 50025: CLE Sales Line History

**Purpose:** Store-only table for audit trail records

**Primary Key:** Sales Line Set ID (Integer) + Set Entry Line No. (Integer)

**Indexing:**
- **Clustered:** Yes (on primary key)
- **SIFT Index:** Customer No., Document Type, Document No., Date of Change
  - SIFT Field: SUM(Diff. to prior Amount (LCY))
  - Enables pre-calculated sums for fast reporting

**Growth Rate:** 
- ~1-5 records per sales line modification
- ~10,000-50,000 records per month (varies by transaction volume)
- ~500 bytes per record
- Append-only (records never updated or deleted)

**Key Fields:**

| Field | Type | Length | Purpose |
|-------|------|--------|---------|
| Sales Line Set ID | Integer | — | Groups related lines across documents |
| Set Entry Line No. | Integer | — | Sequential within set (PK part 2) |
| Document Type | Option | — | Blanket Order, Order, Invoice, Credit Memo |
| Document No. | Code | 20 | Source document number |
| Doc. Line No. | Integer | — | Line number in source document |
| Quantity | Decimal | — | Qty at time of change (negative for CM) |
| Line Amount (LCY) | Decimal | — | Total line amount in local currency |
| Diff. to prior Amount (LCY) | Decimal | — | Change from previous entry (used in SIFT) |
| Date of Change | Date | — | When modification occurred |
| Time of Change | Time | — | Time when modification occurred |
| Booking Date | Date | — | Original order/blanket date |
| Booking Week/Year | Integer | — | Week/year of original booking |
| Changing Week/Year | Integer | — | Week/year when change occurred |
| Shipment Date | Date | — | Planned shipment date |
| Shipment Week/Year | Integer | — | Week/year of shipment |
| Fin. Season | Code | 10 | Financial season (Spring/Summer/Fall/Winter) |
| Salesperson Code | Code | 20 | Salesperson assigned to order |
| Sell-to Customer No. | Code | 20 | Customer number |
| User ID | Code | 50 | User who made the change |
| Action taken | Text | 50 | Insert, Line Change, Delete Line, Make Order, Posting |
| Reason Code | Code | 10 | Optional reason for change |
| Web Order | Boolean | — | TRUE if from web portal |

### Custom Codeunits

#### Codeunit 50009: CLE Sales Management

**Purpose:** Core logic for capturing sales history

**Key Procedure: InsertSalesHistoryLine()**
- Called by event subscribers
- Calculates amount differences
- Captures booking/changing/shipment dates
- Determines financial season
- Inserts history record

#### Codeunit 50010: CLE Sales Mgt Subscribers

**Purpose:** Event triggers and integration points

**Key Events:**
- OnAfterInsertEvent (Sales Line)
- OnAfterModifyEvent (Sales Line)
- OnAfterDeleteEvent (Sales Line)
- OnAfterInsertEvent (Sales Invoice Line)
- OnAfterInsertEvent (Sales Credit Memo Line)

**Validation Checks:**
- CW Activate S-Line Tracking must be TRUE
- Not in upgrade mode
- Not temporary inactive
- Not temporary record
- Set ID must be > 0
- Amount difference must be > 0

### Custom Pages

**Page 50044: CLE Sales Line History**
- Display-only page showing history records
- Filters, sorting, grouping capabilities
- Links to related documents
- No direct editing (append-only data)

## Common Issues and Solutions

### Issue 1: Tracking Disabled or Not Configured

**Symptom:** No history records created when sales lines are modified

**Diagnosis:**

Check if tracking is enabled:
```sql
SELECT [CW Activate S-Line Tracking]
FROM [Clesen Setup];
```

Check if feature is configured:
```sql
SELECT [CW Activate S-Line Tracking], [CW Sales Line Set ID]
FROM [Clesen Setup];
```

**Solution:**
1. Open **Clesen Setup** page
2. Enable field: **CW Activate S-Line Tracking** = YES
3. Ensure **CW Sales Line Set ID** is set to sequential counter
4. Save changes
5. Verify: Modify a sales line; check if history record created

### Issue 2: Set ID Not Assigned or Zero

**Symptom:** History appears for some lines but not others

**Cause:** Sales Line Set ID not assigned (value = 0)

**Check:**
```sql
SELECT [No_], [Line No_], [Sales Line Set ID]
FROM [Sales Line]
WHERE [Sales Line Set ID] = 0 OR [Sales Line Set ID] IS NULL;
```

**Solution:**
1. System should auto-assign Set ID on line creation
2. If missing, verify Codeunit 50010 is properly installed
3. Manual assignment (last resort):
   - Run SQL to assign sequential Set IDs
   - Contact BC support for proper procedure

### Issue 3: History Records Growing Too Large

**Symptom:** History table growing faster than expected OR query performance degrading

**Diagnosis:**

Check record count:
```sql
SELECT COUNT(*) as HistoryRecordCount
FROM [CLE Sales Line History];
```

Check growth rate:
```sql
SELECT COUNT(*) as DailyRecords, [Date of Change]
FROM [CLE Sales Line History]
WHERE [Date of Change] >= DATEADD(day, -30, CAST(GETDATE() AS DATE))
GROUP BY [Date of Change]
ORDER BY [Date of Change] DESC;
```

Check for duplicate/unnecessary entries:
```sql
SELECT [Sales Line Set ID], COUNT(*) as EntryCount
FROM [CLE Sales Line History]
GROUP BY [Sales Line Set ID]
HAVING COUNT(*) > 100
ORDER BY EntryCount DESC;
```

**Solution:**
1. Verify tracking is enabled: Should only track meaningful changes
2. Check if amount calculation is correct: Zero differences should be skipped
3. Archive old history (if retention policy exists):
   - Move records > 2 years to archive table
   - Keep SIFT indexes on active table
4. Monitor and optimize indexes

### Issue 4: Slow Performance on History Page

**Symptom:** Sales Line History page takes long time to load or filter

**Diagnosis:**

Check index usage:
```sql
SELECT 
    [name] as IndexName,
    [type_desc] as IndexType
FROM sys.indexes
WHERE [object_id] = OBJECT_ID('[CLE Sales Line History]');
```

Check for missing statistics:
```sql
DBCC SHOW_STATISTICS ('[CLE Sales Line History]', 'PK_SalesLineHistory');
```

**Solution:**
1. Rebuild clustered index:
   ```sql
   ALTER INDEX PK_SalesLineHistory ON [CLE Sales Line History] REBUILD;
   ```
2. Update statistics:
   ```sql
   UPDATE STATISTICS [CLE Sales Line History];
   ```
3. Archive old records (see Issue 3)
4. Add filters to page query (by date range, customer, document type)

### Issue 5: Posting History Records Missing

**Symptom:** Sales order posts successfully but no "Posting" history entry created

**Cause:** Event subscriber not triggered during posting OR Set ID not linked

**Diagnosis:**

Check if posted invoice has Set ID link:
```sql
SELECT [Document No_], [Sales Line Set ID]
FROM [Sales Invoice Line]
WHERE [Document No_] = 'SI-2024-100';
```

Check if history record exists:
```sql
SELECT [Sales Line Set ID], [Action taken], [Date of Change]
FROM [CLE Sales Line History]
WHERE [Document Type] = 1 -- Invoice
  AND [Document No_] = 'SI-2024-100'
  AND [Action taken] = 'Posting';
```

**Solution:**
1. Verify Codeunit 50010 event subscribers are active:
   - Go to **Event Subscriptions**
   - Search for "CLE Sales Mgt Subscribers"
   - Ensure all subscriptions are enabled
2. Check posting code path:
   - Verify sales posting codeunit calls InsertSalesHistoryLine
3. Recompile codeunits if needed
4. Test posting with simple test order

## Data Integrity Checks

### Check 1: Set ID Uniqueness

**Purpose:** Verify Set IDs are assigned uniquely

```sql
SELECT COUNT(DISTINCT [Sales Line Set ID]) as UniqueSetIDs,
       COUNT(*) as TotalHistoryRecords
FROM [CLE Sales Line History];
```

**Expected Result:** Every history record should have unique Set ID

### Check 2: Amount Difference Consistency

**Purpose:** Verify Diff. to prior Amount calculations are correct

```sql
SELECT [Sales Line Set ID], [Set Entry Line No_],
       [Line Amount (LCY)],
       [Diff. to prior Amount (LCY)],
       LAG([Line Amount (LCY)]) OVER (
           PARTITION BY [Sales Line Set ID] 
           ORDER BY [Set Entry Line No_]
       ) as PriorAmount
FROM [CLE Sales Line History]
ORDER BY [Sales Line Set ID], [Set Entry Line No_];
```

**Expected Result:** Diff. should equal current Amount minus Prior Amount

### Check 3: Orphaned Records

**Purpose:** Find history records with no source document

```sql
SELECT h.[Sales Line Set ID], h.[Document Type], h.[Document No_]
FROM [CLE Sales Line History] h
LEFT JOIN [Sales Line] sl ON h.[Sales Line Set ID] = sl.[Sales Line Set ID]
WHERE sl.[Sales Line Set ID] IS NULL
  AND h.[Document Type] = 1 -- Order type
GROUP BY h.[Sales Line Set ID], h.[Document Type], h.[Document No_];
```

**Expected Result:** No rows (all history should have source document)

## Performance Optimization

### Recommended Indexes

```sql
-- Primary Key (Clustered)
CREATE CLUSTERED INDEX PK_SalesLineHistory
ON [CLE Sales Line History] ([Sales Line Set ID], [Set Entry Line No_])
WITH (FILLFACTOR = 80);

-- SIFT Index for Reporting
CREATE NONCLUSTERED INDEX IX_SalesLineHistory_Customer_Reporting
ON [CLE Sales Line History] (
    [Sell-to Customer No_],
    [Document Type],
    [Document No_],
    [Date of Change]
)
INCLUDE ([Diff. to prior Amount (LCY)], [Quantity], [Line Amount (LCY)]);

-- Date Range Queries
CREATE NONCLUSTERED INDEX IX_SalesLineHistory_DateRange
ON [CLE Sales Line History] ([Date of Change], [Changing Week], [Changing Year]);
```

### Archival Strategy

**Archive Tables (for > 2 years old):**
```sql
CREATE TABLE [CLE Sales Line History Archive] (
    -- Same schema as production table
    [Archive Date] datetime,
    PRIMARY KEY ([Sales Line Set ID], [Set Entry Line No_])
);
```

**Archive Job (quarterly):**
```sql
INSERT INTO [CLE Sales Line History Archive]
SELECT *, GETDATE()
FROM [CLE Sales Line History]
WHERE [Date of Change] < DATEADD(YEAR, -2, GETDATE());

DELETE FROM [CLE Sales Line History]
WHERE [Date of Change] < DATEADD(YEAR, -2, GETDATE());
```

## Debugging Procedures

### Enable Tracing

In Clesen Setup:
- Set **Debug Mode** = YES
- Set **Log Level** = Verbose
- Check **Event Log** for detailed traces

### Verify Event Subscription

```sql
SELECT [Event Type], [Function], [Active]
FROM [Event Subscriptions]
WHERE [Publisher Object Type] = 'Table'
  AND [Publisher Object ID] = 37; -- Sales Line
```

**Expected Result:**
- OnAfterInsert: Active, Function = SalesManagementSubscribers.InsertSalesHistoryLine
- OnAfterModify: Active, Function = SalesManagementSubscribers.UpdateSalesHistoryLine
- OnAfterDelete: Active, Function = SalesManagementSubscribers.DeleteSalesHistoryLine

## Escalation Guidelines

### Contact Microsoft Support For:
- Core posting engine failures
- Event subscription failures
- Database corruption
- License/configuration questions

### Information to Provide:
1. **Error Details:** Full error message, screenshot, timestamp
2. **Environment:** BC version, extension version, database size
3. **Reproduction Steps:** Exact sequence to reproduce issue
4. **SQL Diagnostics:** Results of data integrity checks
5. **Code:** Relevant codeunit/page code if custom modifications

## Related Pages

- [[sales-process-history]] — User guide for audit trail
- [[sales-order-management]] — Sales order system
