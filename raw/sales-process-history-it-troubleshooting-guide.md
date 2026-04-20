# Sales Process History - IT Troubleshooting Guide

## Document Overview

**Purpose**: Technical reference for IT staff supporting the Sales Process History feature
**Audience**: System administrators, developers, IT support
**Related**: [Sales Process History User Guide](staff/sales-process-history-user-guide.md)

---

## System Architecture

### Component Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                    Sales Process History System              │
└─────────────────────────────────────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
   ┌────▼────┐          ┌─────▼─────┐         ┌─────▼─────┐
   │ Tables  │          │ Codeunits │         │   Pages   │
   └────┬────┘          └─────┬─────┘         └─────┬─────┘
        │                     │                      │
   50025: CLE          50009: CLE Sales        50044: CLE Sales
   Sales Line          Management               Line History
   History             50010: CLE Sales         (Display)
   (Storage)           Mgt Subscribers
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
    ├─ Calculate Week Numbers (Booking/Changing/Shipment)
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

---

## Database Schema

### Table: 50025 CLE Sales Line History

**Primary Key**: Sales Line Set ID (Integer) + Set Entry Line No. (Integer)
**Clustered**: Yes (on primary key)
**SIFT Index**: Customer No., Document Type, Document No., Date of Change (SUM: Diff. to prior Amount)

#### Field Definitions

| Field No. | Field Name | Type | Length | Description |
| ----------- | ------------ | ------ | -------- | ------------- |
| 1 | Sales Line Set ID | Integer | - | Unique identifier grouping related lines |
| 2 | Set Entry Line No. | Integer | - | Sequential number within set (PK part 2) |
| 10 | Document Type | Option | - | Blanket Order, Order, Invoice, Credit Memo |
| 11 | Document No. | Code | 20 | Source document number |
| 12 | Doc. Line No. | Integer | - | Line number in source document |
| 20 | Quantity | Decimal | - | Quantity at time of change (negative for CM) |
| 21 | Line Amount (LCY) | Decimal | - | Total line amount in local currency |
| 22 | Diff. to prior Amount (LCY) | Decimal | - | Change from previous entry (used in SIFT) |
| 30 | Date of Change | Date | - | Date when change occurred |
| 31 | Time of Change | Time | - | Time when change occurred |
| 32 | Booking Date | Date | - | Original order/blanket date |
| 33 | Booking Week | Integer | - | ISO week number of booking |
| 34 | Booking Year | Integer | - | Year of booking |
| 35 | Changing Week | Integer | - | ISO week when change happened |
| 36 | Changing Year | Integer | - | Year when change happened |
| 37 | Shipment Date | Date | - | Planned shipment date |
| 38 | Shipment Week | Integer | - | ISO week of shipment |
| 39 | Year | Integer | - | Shipment year |
| 40 | Fin. Season | Code | 10 | Financial season (Spring/Summer/Fall/Winter) |
| 50 | Salesperson Code | Code | 20 | Salesperson assigned to order |
| 51 | Sell-to Customer No. | Code | 20 | Customer number |
| 60 | User ID | Code | 50 | User who made the change |
| 61 | Action taken | Text | 50 | Insert, Line Change, Delete Line, Make Order, Posting |
| 62 | Reason Code | Code | 10 | Optional reason for change |
| 70 | Web Order | Boolean | - | TRUE if from web portal |

#### Indexes

**Primary Key (Clustered)**:

```sql
Sales Line Set ID ASC, Set Entry Line No. ASC
```

- **Usage**: Direct lookup by Set ID for line history
- **Cardinality**: Unique
- **Maintenance**: Automatic (primary key)

**Key 2 (SIFT Enabled)**:

```sql
Sell-to Customer No., Document Type, Document No., Date of Change
```

- **SIFT Fields**: SUM(Diff. to prior Amount (LCY))
- **Usage**: Customer/document aggregations, reporting
- **Performance**: Pre-calculated sums for fast totals
- **Maintenance**: Updated on insert/delete (no updates since append-only)

#### Storage Characteristics

- **Append-Only**: Records never updated or deleted
- **Growth Rate**: ~1-5 records per sales line modification
- **Typical Size**: 500 bytes per record
- **Expected Volume**: 10,000-50,000 records per month (varies by transaction volume)

---

## Business Logic Details

### Sales Line Set ID Assignment

**Location**: Codeunit 50010, OnAfterInsertEvent(Sales Line)
**Logic**:

```al
if (Rec."CW Sales Line Set ID" = 0) and (not Rec.IsTemporary()) then begin
    Rec."CW Sales Line Set ID" := GetNextSetID();
    Rec.Modify();
end;
```

**GetNextSetID() Implementation**:

- Queries CLE Sales Line History for MAX(Set Entry Line No. globally)
- Increments by 1
- Thread-safe via database locking
- Returns Integer (2,147,483,647 max value)

**Edge Cases**:

- Temporary records: Never assigned Set ID
- Copy operations: Source Set ID preserved
- Blanket-to-Order: Set ID carried from blanket to order

---

### InsertSalesHistoryLine() Procedure

**Location**: Codeunit 50009, Line ~1807-2000
**Parameters**:

- SalesLine (Sales Line record)
- ActionTaken (Text[50])

**Detailed Logic**:

```text
1. EXIT CONDITIONS (skip history creation):
   - Sales Line Set ID = 0
   - ActionTaken = '' (empty)
   - Setup: CW Activate S-Line Tracking = FALSE
   - Temporary record

2. GET PRIOR ENTRY:
   - Query: Sales Line History filtered by Set ID
   - Sort: Set Entry Line No. descending
   - Get top 1 (most recent)
   - If not found: PriorAmount = 0

3. CALCULATE CURRENT AMOUNT:

   CASE Document Type OF
     Blanket Order:
       Amount = Outstanding Qty. + Qty. to Ship
       (This is "available remaining" on blanket)
     Order, Invoice, Credit Memo:
       Amount = Outstanding Amount (LCY) + Line Discount Amount
       (This is total line value)
   END

4. CALCULATE DIFFERENCE:

   Difference = Current Amount - Prior Amount

   EXIT IF Difference = 0 (no financial change)

5. GET BOOKING DATE:

   IF Blanket Order exists for this Set ID THEN
     Booking Date = Blanket Order Date
   ELSE
     Booking Date = Order Date (current document)

6. CALCULATE WEEKS/YEARS:

   Booking Week = ISO Week of Booking Date
   Booking Year = Year of Booking Date
   Changing Week = ISO Week of TODAY
   Changing Year = Year of TODAY
   Shipment Week = ISO Week of Shipment Date
   Shipment Year = Year of Shipment Date

7. GET FINANCIAL SEASON:

   Based on Shipment Date:

   - Query CLE Financial Season table
   - Match: Shipment Date BETWEEN Start Date AND End Date
   - Return: Season Code (Spring, Summer, Fall, Winter)

8. GET NEXT ENTRY LINE NO.:

   Query same Set ID, get MAX(Set Entry Line No.) + 1

9. INSERT HISTORY RECORD:

   Sales Line Set ID = Set ID
   Set Entry Line No. = Next Entry No.
   Document Type/No./Line No. = From Sales Line
   Quantity = Sales Line Quantity
   Line Amount (LCY) = Calculated Amount
   Diff. to prior Amount = Difference
   Date of Change = TODAY
   Time of Change = TIME
   Booking Date/Week/Year = Calculated
   Changing Week/Year = Calculated
   Shipment Date/Week = From Sales Line
   Year = Shipment Year
   Fin. Season = Season Code
   Salesperson Code = From Sales Header
   Sell-to Customer No. = From Sales Header
   User ID = USERID
   Action taken = ActionTaken parameter
   Web Order = Sales Header "CW Web Order" flag
```

**Special Cases**:

**Blanket Orders**:

- Amount calculated as "Available Remaining"
- Formula: `Outstanding Qty. + Qty. to Ship`
- This shows how much blanket still has available
- When "Make Order" executed, blanket history shows reduction

**Credit Memos**:

- Handled by InsertSalesHistoryLineOnPostCreditMemo()
- Quantities: Stored as negative values
- Amounts: Stored as negative values
- Difference: Negative (reduces total sales)

**Invoices**:

- Handled by InsertSalesHistoryLineOnPostInvoice()
- Action = "Posting"
- Captures final posted values
- Difference usually = 0 (no change from order to invoice)

---

## Event Subscriber Details

### Codeunit 50010: CLE Sales Mgt Subscribers

#### OnAfterInsertEvent(Sales Line)

**Location**: Line ~505
**Purpose**: Assign Sales Line Set ID
**Triggered**: When new sales line inserted
**Conditions**: Not temporary record
**Action**: Assigns new Set ID if currently 0

#### OnAfterModifyEvent(Sales Line)

**Location**: Line ~524
**Purpose**: Track line modifications
**Triggered**: When existing sales line modified
**Conditions**:

- CW Activate S-Line Tracking = TRUE
- Not in Upgrade Mode
- Not temporary inactive
- Not temporary record
- Has Set ID assigned

**Action**: Calls `InsertSalesHistoryLine(Rec, 'Line Change')`

**Performance**: Executes on EVERY modify, optimize by checking if financial fields changed

#### OnAfterDeleteEvent(Sales Line)

**Location**: Line ~541
**Purpose**: Track line deletions
**Triggered**: When sales line deleted
**Conditions**: Same as OnAfterModifyEvent
**Action**: Calls `InsertSalesHistoryLine(xRec, 'Delete Line')`
**Note**: Uses xRec (before image) since Rec is already deleted

#### OnAfterInsertEvent(Sales Invoice Line)

**Location**: Line ~553
**Purpose**: Capture invoice posting
**Triggered**: When invoice line posted
**Conditions**: Same as OnAfterModifyEvent
**Action**: Calls `InsertSalesHistoryLineOnPostInvoice(Rec)`

#### OnAfterInsertEvent(Sales Cr.Memo Line)

**Location**: Line ~565
**Purpose**: Capture credit memo posting
**Triggered**: When credit memo line posted
**Conditions**: Same as OnAfterModifyEvent
**Action**: Calls `InsertSalesHistoryLineOnPostCreditMemo(Rec)`

---

## Configuration & Setup

### CLE Clesen Setup Table

**Table**: 50000 (assumption, verify actual number)
**Key Field**: `CW Activate S-Line Tracking` (Boolean)

**How to Enable**:

1. Search for "CLE Clesen Setup"
2. Enable "CW Activate S-Line Tracking"
3. Changes take effect immediately (next transaction)

**Impact of Disabling**:

- New history records NOT created
- Existing history preserved
- Event subscribers still fire but exit early
- Re-enabling resumes tracking (no backfill of missed changes)

### Financial Season Setup

**Table**: CLE Financial Season (verify table number)
**Required Fields**:

- Season Code (e.g., "SPRING", "SUMMER")
- Start Date
- End Date

**Setup Requirements**:

- No date gaps (every date should fall in a season)
- No overlaps (dates in exactly one season)
- Covers full calendar year

**Impact of Missing Season**:

- Fin. Season field will be blank in history
- No error, just missing data
- Reports by season will exclude these records

**Validation Query**:

```sql
-- Check for date gaps
SELECT
    DATEADD(day, 1, EndDate) AS GapStart,
    LEAD(StartDate) OVER (ORDER BY StartDate) AS GapEnd
FROM [CLE Financial Season]
WHERE DATEADD(day, 1, EndDate) < LEAD(StartDate) OVER (ORDER BY StartDate)

-- Check for overlaps
SELECT *
FROM [CLE Financial Season] s1
JOIN [CLE Financial Season] s2
    ON s1.StartDate <= s2.EndDate
    AND s1.EndDate >= s2.StartDate
    AND s1.Code <> s2.Code
```

---

## Common Issues & Solutions

### Issue 1: History Not Being Created

**Symptoms**:

- User modifies sales line
- No history record appears
- Sales Line History page empty for that line

**Diagnostic Steps**:

1. **Check Setup Flag**:

```sql
SELECT [CW Activate S-Line Tracking]
FROM [CLE Clesen Setup$]
```
Expected: TRUE (1)

1. **Check Sales Line Set ID**:

```sql
SELECT [CW Sales Line Set ID], [Document No_], [Line No_]
FROM [Sales Line]
WHERE [Document No_] = 'SO-2024-001'
```
Expected: Non-zero integer

1. **Check Event Subscribers**:

- Open Event Subscriber Monitor (if available)
- Verify OnAfterModifyEvent for Sales Line is bound
- Check if other subscribers interfering

1. **Check Upgrade Mode**:

```sql
-- Check NAV/BC Service Tier settings
-- Upgrade Mode should be FALSE for normal operations
```

**Solutions**:

- **Setup disabled**: Enable in CLE Clesen Setup
- **Set ID = 0**:
  - Check OnAfterInsertEvent subscriber is active
  - Manually assign Set ID via code if needed:

    ```al
    SalesLine."CW Sales Line Set ID" := GetNextAvailableSetID();
    SalesLine.Modify();
    ```

- **Upgrade mode active**: Complete upgrade, set to normal mode
- **Temporary inactive flag**: Check and clear temp inactive flags

---

### Issue 2: Incorrect Difference Calculations

**Symptoms**:

- "Diff. to prior Amount" doesn't match expected change
- Sum of differences ≠ current line amount
- Negative differences when should be positive (or vice versa)

**Diagnostic Steps**:

1. **Query History Sequence**:

```sql
SELECT
    [Set Entry Line No_],
    [Action taken],
    [Line Amount (LCY)],
    [Diff_ to prior Amount (LCY)],
    [Date of Change],
    [Time of Change]
FROM [CLE Sales Line History$]
WHERE [Sales Line Set ID] = 12345
ORDER BY [Set Entry Line No_]
```

1. **Manually Calculate**:

```text
For each entry:
  Expected Diff = Current Amount - Prior Entry Amount
  If Entry 1: Expected Diff = Current Amount (no prior)
```

1. **Check for Missing Entries**:

- Are there gaps in Set Entry Line No.?
- Filter applied hiding some entries?

1. **Verify Blanket Order Logic**:

```sql
-- For blanket orders, amount should be Available Remaining
SELECT
    [Outstanding Qty_],
    [Qty_ to Ship],
    [Outstanding Qty_] + [Qty_ to Ship] AS CalculatedAmount
FROM [Sales Line]
WHERE [Document Type] = 1 -- Blanket Order
```

**Root Causes & Solutions**:

**Cause**: Concurrent modifications created race condition

- **Solution**: Review transaction isolation levels, ensure proper locking
- **Prevention**: Events are sequential per line (Set ID), should not happen

**Cause**: Prior entry lookup failed (wrong filter)

- **Solution**: Review GetLastHistoryEntry() logic
- **Check**: Ensure filter on Set ID only, no accidental customer/doc filters

**Cause**: Blanket order amount calculation incorrect

- **Solution**: Verify formula matches spec: `Outstanding Qty + Qty to Ship`
- **Check**: Are both fields populated correctly on blanket line?

**Cause**: Rounding differences

- **Solution**: Review decimal precision in calculations
- **Check**: Are amount fields using correct decimal places?

---

### Issue 3: Performance Degradation - Slow History Page

**Symptoms**:

- Sales Line History page takes >5 seconds to load
- Timeouts when filtering by customer
- High CPU/disk I/O when accessing history

**Diagnostic Steps**:

1. **Check Record Count**:

```sql
SELECT COUNT(*) AS TotalRecords
FROM [CLE Sales Line History$]

-- By year
SELECT
    [Changing Year],
    COUNT(*) AS RecordCount
FROM [CLE Sales Line History$]
GROUP BY [Changing Year]
ORDER BY [Changing Year] DESC
```

1. **Check Index Fragmentation**:

```sql
SELECT
    OBJECT_NAME(ips.object_id) AS TableName,
    i.name AS IndexName,
    ips.avg_fragmentation_in_percent,
    ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('CLE Sales Line History$'), NULL, NULL, 'DETAILED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 30
```

1. **Check SIFT Index Status**:

```sql
-- Verify SIFT table exists and is being maintained
SELECT TOP 100 *
FROM [CLE Sales Line History$VSIFT$1]  -- SIFT table for Key 2
ORDER BY [Sell-to Customer No_], [Document Type]
```

1. **Analyze Query Plan**:

```sql
SET STATISTICS IO ON
SET STATISTICS TIME ON

SELECT *
FROM [CLE Sales Line History$]
WHERE [Sell-to Customer No_] = 'C00001'
    AND [Date of Change] >= '2024-01-01'
```

**Solutions**:

**Problem**: Index fragmentation >30%

```sql
-- Rebuild indexes
ALTER INDEX ALL ON [CLE Sales Line History$] REBUILD

-- Or reorganize for less locking
ALTER INDEX ALL ON [CLE Sales Line History$] REORGANIZE
```

**Problem**: SIFT not being used

- Verify Key 2 has MaintainSIFTIndex = TRUE in AL code
- Check SIFT table exists in SQL
- Rebuild SIFT: Sync NAV/BC table, regenerate SIFT

**Problem**: Too many records without filters

- Educate users to ALWAYS filter by date range first
- Consider date-based partitioning (advanced)
- Implement warning if loading >100K records without filter

**Problem**: Missing statistics

```sql
UPDATE STATISTICS [CLE Sales Line History$] WITH FULLSCAN
```

---

### Issue 4: Duplicate Set IDs

**Symptoms**:

- Multiple unrelated sales lines have same Set ID
- History shows entries from different customers/products mixed together
- Set ID assignment not unique

**Diagnostic Steps**:

1. **Find Duplicates**:

```sql
SELECT
    sl.[CW Sales Line Set ID],
    sl.[Document No_],
    sl.[Line No_],
    sl.[No_],
    sl.[Description],
    sl.[Sell-to Customer No_]
FROM [Sales Line] sl
WHERE sl.[CW Sales Line Set ID] IN (
    SELECT [CW Sales Line Set ID]
    FROM [Sales Line]
    WHERE [CW Sales Line Set ID] <> 0
    GROUP BY [CW Sales Line Set ID]
    HAVING COUNT(DISTINCT [Document No_]) > 3  -- Adjust threshold
)
ORDER BY sl.[CW Sales Line Set ID], sl.[Document No_]
```

1. **Check Set ID Assignment Logic**:

- Review GetNextSetID() implementation
- Check for concurrent transaction conflicts
- Verify locking mechanism

1. **Check for Data Import Issues**:

- Were Set IDs imported from external system?
- Was data migrated incorrectly?

**Root Causes & Solutions**:

**Cause**: GetNextSetID() not thread-safe

- **Solution**: Implement pessimistic locking:

```al
procedure GetNextSetID(): Integer
var
    SalesLineHistory: Record "CLE Sales Line History";
begin
    SalesLineHistory.LockTable();  // Lock before reading
    if SalesLineHistory.FindLast() then
        exit(SalesLineHistory."Sales Line Set ID" + 1)
    else
        exit(1);
end;
```

**Cause**: Data migration assigned duplicate IDs

- **Solution**: Reassign Set IDs for affected lines:

```sql
-- Backup first!
UPDATE sl
SET sl.[CW Sales Line Set ID] = newid_assignment.NewSetID
FROM [Sales Line] sl
JOIN (
    SELECT
        [Document No_],
        [Line No_],
        ROW_NUMBER() OVER (ORDER BY [Document No_], [Line No_]) +
            (SELECT MAX([CW Sales Line Set ID]) FROM [Sales Line]) AS NewSetID
    FROM [Sales Line]
    WHERE [CW Sales Line Set ID] = 12345  -- Duplicate ID
        AND [Document No_] <> 'SO-ORIGINAL'  -- Keep one with original
) newid_assignment
    ON sl.[Document No_] = newid_assignment.[Document No_]
    AND sl.[Line No_] = newid_assignment.[Line No_]
```

---

### Issue 5: Missing Booking Dates

**Symptoms**:

- Booking Date field is blank (01/01/1753)
- Booking Week/Year are 0 or incorrect
- Affects commission reporting

**Diagnostic Steps**:

1. **Check History Records**:

```sql
SELECT
    [Sales Line Set ID],
    [Document Type],
    [Document No_],
    [Booking Date],
    [Booking Week],
    [Booking Year],
    [Action taken]
FROM [CLE Sales Line History$]
WHERE [Booking Date] = '1753-01-01'  -- SQL Server default blank date
    OR [Booking Date] IS NULL
```

1. **Check Source Blanket Order**:

```sql
-- Does blanket exist for these Set IDs?
SELECT DISTINCT
    slh.[Sales Line Set ID],
    sl.[Document Type],
    sl.[Document No_],
    sl.[Order Date]
FROM [CLE Sales Line History$] slh
LEFT JOIN [Sales Line] sl
    ON sl.[CW Sales Line Set ID] = slh.[Sales Line Set ID]
    AND sl.[Document Type] = 1  -- Blanket Order
WHERE slh.[Booking Date] = '1753-01-01'
```

1. **Check Logic in InsertSalesHistoryLine()**:

- Review booking date assignment
- Is blanket order lookup working?
- Fallback to Order Date implemented?

**Root Causes & Solutions**:

**Cause**: No blanket order exists, Order Date also blank

- **Solution**: Ensure Order Date is populated on sales header
- **Prevention**: Validate Order Date when creating orders

**Cause**: Blanket order lookup failing (wrong filter)

- **Solution**: Review query logic:

```al
// Should look like this:
SalesLine.SetRange("CW Sales Line Set ID", CurrentSetID);
SalesLine.SetRange("Document Type", SalesLine."Document Type"::"Blanket Order");
if SalesLine.FindFirst() then
    BookingDate := SalesLine."Order Date"
else
    BookingDate := CurrentSalesLine."Order Date";  // Fallback
```

**Cause**: Blanket order deleted before order created

- **Solution**: Preserve blanket Order Date in first history entry
- **Prevention**: Don't delete blankets with remaining quantities

---

### Issue 6: Web Order Flag Not Set

**Symptoms**:

- Web Order field always FALSE
- Cannot distinguish web orders from manual orders
- Reporting incorrect

**Diagnostic Steps**:

1. **Check Sales Header Flag**:

```sql
SELECT
    [No_],
    [CW Web Order],
    [Order Date]
FROM [Sales Header]
WHERE [CW Web Order] = 1  -- TRUE
```

1. **Check History Records**:

```sql
SELECT
    [Sales Line Set ID],
    [Document No_],
    [Web Order],
    [Action taken]
FROM [CLE Sales Line History$]
WHERE [Document No_] IN (
    SELECT [No_]
    FROM [Sales Header]
    WHERE [CW Web Order] = 1
)
```

1. **Verify Field Assignment**:

- Check InsertSalesHistoryLine() code
- Is SalesHeader."CW Web Order" being read?

**Root Causes & Solutions**:

**Cause**: Web Order flag not set on Sales Header

- **Solution**: Fix web order import/creation process
- **Check**: API or XMLport that creates web orders

**Cause**: Field not being copied to history

- **Solution**: Verify code:

```al
SalesLineHistory."Web Order" := SalesHeader."CW Web Order";
```

**Cause**: Field added later, existing history missing flag

- **Solution**: Backfill historical data:

```sql
UPDATE slh
SET slh.[Web Order] = sh.[CW Web Order]
FROM [CLE Sales Line History$] slh
JOIN [Sales Header] sh ON slh.[Document No_] = sh.[No_]
WHERE slh.[Web Order] = 0  -- Currently FALSE
    AND sh.[CW Web Order] = 1  -- Should be TRUE
```

---

### Issue 7: Fin. Season Not Populated

**Symptoms**:

- Financial Season blank on history records
- Season reporting incomplete
- "Season not found" warnings in logs

**Diagnostic Steps**:

1. **Check Financial Season Setup**:

```sql
SELECT
    [Code],
    [Start Date],
    [End Date]
FROM [CLE Financial Season$]
ORDER BY [Start Date]
```

1. **Check for Date Gaps**:

```sql
-- Identify dates without season
SELECT DISTINCT
    [Shipment Date]
FROM [CLE Sales Line History$]
WHERE [Fin_ Season] = ''
    AND [Shipment Date] <> '1753-01-01'
ORDER BY [Shipment Date]
```

1. **Test Season Lookup**:

```sql
-- Does this date fall in a season?
SELECT
    [Code],
    [Start Date],
    [End Date]
FROM [CLE Financial Season$]
WHERE '2024-06-15' BETWEEN [Start Date] AND [End Date]
```

**Root Causes & Solutions**:

**Cause**: Financial Season table not configured

- **Solution**: Set up seasons covering full year
- **Example**:

```
Code: SPRING, Start: 03/01, End: 05/31
Code: SUMMER, Start: 06/01, End: 08/31
Code: FALL,   Start: 09/01, End: 11/30
Code: WINTER, Start: 12/01, End: 02/28
```

**Cause**: Date gaps in season definitions

- **Solution**: Adjust dates to eliminate gaps
- **Check**: Every possible date falls in exactly one season

**Cause**: Shipment Date not set on sales line

- **Solution**: Validate Shipment Date is required field
- **Prevention**: Default to WORKDATE if blank

**Cause**: Historical records missing season (table added later)

- **Solution**: Backfill:

```sql
UPDATE slh
SET slh.[Fin_ Season] = fs.[Code]
FROM [CLE Sales Line History$] slh
JOIN [CLE Financial Season$] fs
    ON slh.[Shipment Date] BETWEEN fs.[Start Date] AND fs.[End Date]
WHERE slh.[Fin_ Season] = ''
    AND slh.[Shipment Date] <> '1753-01-01'
```

---

### Issue 8: Action Taken Field Incorrect

**Symptoms**:

- Action shows "Line Change" but should be "Delete Line"
- Multiple consecutive "Insert" actions for same line
- "Posting" action missing for invoiced orders

**Diagnostic Steps**:

1. **Review Action History**:

```sql
SELECT
    [Sales Line Set ID],
    [Set Entry Line No_],
    [Action taken],
    [Document Type],
    [Document No_],
    [Date of Change],
    [Time of Change]
FROM [CLE Sales Line History$]
WHERE [Sales Line Set ID] = 12345
ORDER BY [Set Entry Line No_]
```

1. **Check Event Subscriber Calls**:

- OnAfterModifyEvent should call with "Line Change"
- OnAfterDeleteEvent should call with "Delete Line"
- OnAfterInsertEvent (Invoice/CM) should call with "Posting"

1. **Check for Custom Code**:

- Are there customizations calling InsertSalesHistoryLine()?
- Is ActionTaken parameter hardcoded incorrectly?

**Root Causes & Solutions**:

**Cause**: Event subscriber passing wrong action string

- **Solution**: Review and correct:

```al
// In OnAfterModifyEvent
InsertSalesHistoryLine(Rec, 'Line Change');  // Correct

// In OnAfterDeleteEvent
InsertSalesHistoryLine(xRec, 'Delete Line');  // Correct (use xRec!)

// In OnAfterInsertEvent (Invoice Line)
InsertSalesHistoryLineOnPostInvoice(Rec);  // Sets 'Posting' internally
```

**Cause**: Multiple systems creating history (duplication)

- **Solution**: Audit all calls to InsertSalesHistoryLine()
- **Check**: Custom code, extensions, event publishers

**Cause**: Re-insert after delete without Set ID change

- **Solution**: When deleting and re-inserting, preserve Set ID:

```al
OldSetID := SalesLine."CW Sales Line Set ID";
SalesLine.Delete(true);
// ... create new line ...
SalesLine."CW Sales Line Set ID" := OldSetID;
SalesLine.Insert(true);
```

---

## Performance Optimization

### Query Performance Best Practices

#### 1. Always Use Indexed Columns in Filters

✅ **Good** (uses indexes):

```sql
WHERE [Sales Line Set ID] = 12345  -- Primary key
WHERE [Sell-to Customer No_] = 'C00001'  -- SIFT index
WHERE [Date of Change] >= '2024-01-01'  -- SIFT index
```

❌ **Bad** (no indexes):
```sql
WHERE [Time of Change] > '12:00:00'  -- Not indexed
WHERE [Action taken] = 'Insert'  -- Not indexed
WHERE [Reason Code] <> ''  -- Not indexed
```


#### . 


✅ **Good**:
```al
SalesLineHistory.SetRange("Date of Change", CalcDate('<-30D>', Today()), Today());
SalesLineHistory.FindSet();
```

❌ **Bad**:
```al
SalesLineHistory.FindSet();  // Retrieves ALL records!
```


#### 3. Use SIFT for Aggregations

✅ **Good** (uses pre-calculated SIFT):
```al
SalesLineHistory.SetRange("Sell-to Customer No.", CustomerNo);
SalesLineHistory.CalcSums("Diff. to prior Amount (LCY)");
TotalChange := SalesLineHistory."Diff. to prior Amount (LCY)";
```

❌ **Bad** (manual aggregation):
```al
SalesLineHistory.SetRange("Sell-to Customer No.", CustomerNo);
if SalesLineHistory.FindSet() then
    repeat
        TotalChange += SalesLineHistory."Diff. to prior Amount (LCY)";
    until SalesLineHistory.Next() = 0;
```


#### . 


✅ **Good**:
```al
SalesLineHistory.SetFilter("Document No.", 'SO-2024*');  -- Index can be used
```

❌ **Bad**:
```al
SalesLineHistory.SetFilter("Document No.", '*2024*');  -- Full table scan
```

### Index Maintenance Schedule

**Weekly**:
```sql
-- Check fragmentation
SELECT
    i.name AS IndexName,
    ips.avg_fragmentation_in_percent,
    ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), OBJECT_ID('CLE Sales Line History$'), NULL, NULL, 'SAMPLED') ips
JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 10
```

**Monthly**:
```sql
-- Reorganize if 10-30% fragmentation
ALTER INDEX ALL ON [CLE Sales Line History$] REORGANIZE

-- Rebuild if >30% fragmentation
ALTER INDEX ALL ON [CLE Sales Line History$] REBUILD
```

**Quarterly**:
```sql
-- Update statistics with full scan
UPDATE STATISTICS [CLE Sales Line History$] WITH FULLSCAN
```

### Table Partitioning (Advanced)

For very large databases (>10M history records), consider partitioning:

**Partition by Year**:
```sql
-- Create partition function
CREATE PARTITION FUNCTION pfSalesHistoryYear (int)
AS RANGE RIGHT FOR VALUES (2022, 2023, 2024, 2025, 2026)

-- Create partition scheme
CREATE PARTITION SCHEME psSalesHistoryYear
AS PARTITION pfSalesHistoryYear
TO (FileGroup2021, FileGroup2022, FileGroup2023, ...)

-- Note: Requires recreating table with partition scheme
-- Consult with DBA before implementing
```

---

## Monitoring & Diagnostics

### Health Check Queries

**1. Daily Record Volume**:
```sql
SELECT
    [Date of Change],
    COUNT(*) AS RecordCount,
    SUM(CASE WHEN [Action taken] = 'Insert' THEN 1 ELSE 0 END) AS Inserts,
    SUM(CASE WHEN [Action taken] = 'Line Change' THEN 1 ELSE 0 END) AS Changes,
    SUM(CASE WHEN [Action taken] = 'Delete Line' THEN 1 ELSE 0 END) AS Deletes,
    SUM(CASE WHEN [Action taken] = 'Posting' THEN 1 ELSE 0 END) AS Postings
FROM [CLE Sales Line History$]
WHERE [Date of Change] >= DATEADD(day, -7, GETDATE())
GROUP BY [Date of Change]
ORDER BY [Date of Change] DESC
```

**2. Top Users by Activity**:
```sql
SELECT
    [User ID],
    COUNT(*) AS TotalChanges,
    SUM([Diff_ to prior Amount (LCY)]) AS TotalImpact,
    MIN([Date of Change]) AS FirstChange,
    MAX([Date of Change]) AS LastChange
FROM [CLE Sales Line History$]
WHERE [Date of Change] >= DATEADD(day, -30, GETDATE())
GROUP BY [User ID]
ORDER BY TotalChanges DESC
```

**3. Orphaned Set IDs**:
```sql
-- Set IDs in history but not in active sales lines
SELECT DISTINCT slh.[Sales Line Set ID]
FROM [CLE Sales Line History$] slh
WHERE NOT EXISTS (
    SELECT 1
    FROM [Sales Line] sl
    WHERE sl.[CW Sales Line Set ID] = slh.[Sales Line Set ID]
)
    AND NOT EXISTS (
        SELECT 1
        FROM [Sales Invoice Line] sil
        WHERE sil.[CW Sales Line Set ID] = slh.[Sales Line Set ID]
    )
    AND slh.[Date of Change] >= DATEADD(day, -90, GETDATE())
-- Note: Orphans are normal for posted/deleted orders
```

**4. Difference Anomalies**:
```sql
-- Find unusually large differences
SELECT
    [Sales Line Set ID],
    [Set Entry Line No_],
    [Document No_],
    [Action taken],
    [Diff_ to prior Amount (LCY)],
    [Date of Change],
    [User ID]
FROM [CLE Sales Line History$]
WHERE ABS([Diff_ to prior Amount (LCY)]) > 10000  -- Adjust threshold
    AND [Date of Change] >= DATEADD(day, -30, GETDATE())
ORDER BY ABS([Diff_ to prior Amount (LCY)]) DESC
```

### Performance Metrics

**Benchmark Targets**:

- **Insert history record**: <100ms
- **Query by Set ID**: <200ms
- **Customer history (1 year)**: <2 seconds
- **SIFT aggregation**: <500ms
- **Page load (filtered)**: <3 seconds

**Measuring Performance**:
```sql
SET STATISTICS TIME ON
SET STATISTICS IO ON

-- Your query here
SELECT *
FROM [CLE Sales Line History$]
WHERE [Sales Line Set ID] = 12345

-- Review results:
-- CPU time: should be <100ms
-- Logical reads: should be <1000 pages
```

**Application Insights** (if available):

- Track History Page load times
- Monitor InsertSalesHistoryLine() execution time
- Alert if >90th percentile exceeds 500ms

---

## Data Integrity Checks

### Validation Queries

**1. Check for Gaps in Entry Numbers**:
```sql
SELECT
    [Sales Line Set ID],
    [Set Entry Line No_] AS CurrentEntry,
    LAG([Set Entry Line No_]) OVER (
        PARTITION BY [Sales Line Set ID]
        ORDER BY [Set Entry Line No_]
    ) AS PriorEntry,
    [Set Entry Line No_] - LAG([Set Entry Line No_]) OVER (
        PARTITION BY [Sales Line Set ID]
        ORDER BY [Set Entry Line No_]
    ) AS Gap
FROM [CLE Sales Line History$]
WHERE [Set Entry Line No_] - LAG([Set Entry Line No_]) OVER (
        PARTITION BY [Sales Line Set ID]
        ORDER BY [Set Entry Line No_]
    ) > 1
-- Gaps should not exist (sequential numbering)
```

**2. Verify Difference Calculations**:
```sql
;WITH HistoryWithPrior AS (
    SELECT
        [Sales Line Set ID],
        [Set Entry Line No_],
        [Line Amount (LCY)] AS CurrentAmount,
        [Diff_ to prior Amount (LCY)] AS RecordedDiff,
        LAG([Line Amount (LCY)], 1, 0) OVER (
            PARTITION BY [Sales Line Set ID]
            ORDER BY [Set Entry Line No_]
        ) AS PriorAmount
    FROM [CLE Sales Line History$]
)
SELECT *,
    CurrentAmount - PriorAmount AS CalculatedDiff,
    RecordedDiff - (CurrentAmount - PriorAmount) AS Discrepancy
FROM HistoryWithPrior
WHERE ABS(RecordedDiff - (CurrentAmount - PriorAmount)) > 0.01
-- Any discrepancies indicate calculation errors
```

**3. Validate SIFT Totals**:
```sql
-- Manual sum
SELECT
    [Sell-to Customer No_],
    SUM([Diff_ to prior Amount (LCY)]) AS ManualSum
FROM [CLE Sales Line History$]
WHERE [Sell-to Customer No_] = 'C00001'
    AND [Date of Change] >= '2024-01-01'
GROUP BY [Sell-to Customer No_]

-- Compare to SIFT (use BC page with CalcSums)
-- Should match exactly
```

---

## Debugging Guide

### Enabling Debug Mode


#### 


1. Open VS Code with AL extension
2. Set breakpoints in:
   - Codeunit 50010, OnAfterModifyEvent
   - Codeunit 50009, InsertSalesHistoryLine()
3. Attach debugger to sandbox
4. Perform sales line change
5. Step through code


#### 

```al
// Add to InsertSalesHistoryLine() temporarily
procedure InsertSalesHistoryLine(var SalesLine: Record "Sales Line"; ActionTaken: Text[50])
begin
    // At start of procedure
    EventLog.LogMessage(
        '0000ABC',  // Unique ID
        StrSubstNo('History Insert: SetID=%1, Action=%2, Amount=%3',
            SalesLine."CW Sales Line Set ID", ActionTaken, CalculatedAmount),
        Verbosity::Normal,
        DataClassification::CustomerContent,
        TelemetryScope::ExtensionPublisher,
        'Sales History Debug'
    );

    // ... rest of procedure ...
end;
```


#### 


1. Open SQL Server Profiler
2. Start trace with filters:
   - Database: Your BC database
   - Object Name: CLE Sales Line History$
3. Perform sales line change
4. Review INSERT statements
5. Check execution time and parameters

### Common Debug Scenarios

#### Scenario: History not created

1. Set breakpoint in OnAfterModifyEvent
2. Modify sales line
3. Check if breakpoint hits:
   - **YES**: Step through, check exit conditions
   - **NO**: Event subscriber not bound, check setup

#### Scenario: Wrong difference calculated

1. Set breakpoint in InsertSalesHistoryLine()
2. Add watches for:
   - `PriorAmount`
   - `CurrentAmount`
   - `Difference`
3. Step through calculation logic
4. Verify each step matches expected

#### Scenario: Performance issue

1. Enable SQL trace
2. Filter by:
   - Duration > 1000ms
   - Reads > 10000 pages
3. Identify slow queries
4. Check execution plans
5. Add/optimize indexes

---

## Disaster Recovery

### Backup Strategies

**Full Backup (Daily)**:
```sql
BACKUP DATABASE [BC_Database]
TO DISK = 'E:\Backups\BC_Full_20260212.bak'
WITH COMPRESSION, STATS = 10
```

**History Table Backup (Weekly)**:
```sql
-- Export to separate table
SELECT *
INTO [CLE Sales Line History_Archive_20260212]
FROM [CLE Sales Line History$]
WHERE [Date of Change] < DATEADD(year, -1, GETDATE())
```

### Recovery Scenarios


#### 


**Detection**:
```sql
-- Compare current count to yesterday's backup
SELECT COUNT(*) FROM [CLE Sales Line History$]  -- Current
SELECT COUNT(*) FROM [Backup_DB]..[CLE Sales Line History$]  -- Backup
```

**Recovery**:
```sql
-- Restore missing records from backup
INSERT INTO [CLE Sales Line History$]
SELECT *
FROM [Backup_DB]..[CLE Sales Line History$] b
WHERE NOT EXISTS (
    SELECT 1
    FROM [CLE Sales Line History$] c
    WHERE c.[Sales Line Set ID] = b.[Sales Line Set ID]
        AND c.[Set Entry Line No_] = b.[Set Entry Line No_]
)
```


#### 


**Detection**:
```sql
-- Run integrity check (from Data Integrity section)
```

**Recovery**:
```sql
-- Recalculate all differences
UPDATE h
SET h.[Diff_ to prior Amount (LCY)] =
    h.[Line Amount (LCY)] - ISNULL(prior.[Line Amount (LCY)], 0)
FROM [CLE Sales Line History$] h
LEFT JOIN [CLE Sales Line History$] prior
    ON h.[Sales Line Set ID] = prior.[Sales Line Set ID]
    AND prior.[Set Entry Line No_] = h.[Set Entry Line No_] - 1
-- WARNING: Only run after backup and verification
```


#### 


**Detection**:
```sql
SELECT COUNT(*)
FROM [Sales Line]
WHERE [CW Sales Line Set ID] = 0
```

**Recovery**:
```al
// Run in AL
codeunit 50999 "Fix Missing Set IDs"
{
    trigger OnRun()
    var
        SalesLine: Record "Sales Line";
        NextID: Integer;
    begin
        NextID := GetMaxSetID() + 1;

        SalesLine.SetRange("CW Sales Line Set ID", 0);
        if SalesLine.FindSet(true) then
            repeat
                SalesLine."CW Sales Line Set ID" := NextID;
                SalesLine.Modify(false);  // Skip triggers
                NextID += 1;
            until SalesLine.Next() = 0;
    end;

    local procedure GetMaxSetID(): Integer
    var
        SalesLineHistory: Record "CLE Sales Line History";
    begin
        if SalesLineHistory.FindLast() then
            exit(SalesLineHistory."Sales Line Set ID")
        else
            exit(0);
    end;
}
```

---

## Extension Points & Customization

### Adding Custom Fields to History

**Example: Add "Customer Category"**

1. **Extend Table**:

```al
tableextension 50099 "Custom Sales Line History" extends "CLE Sales Line History"
{
    fields
    {
        field(50000; "Customer Category"; Code[20])
        {
            Caption = 'Customer Category';
            TableRelation = "Customer Category";
        }
    }
}
```

2. **Populate Field in InsertSalesHistoryLine()**:

```al
// Extend via event subscriber
[EventSubscriber(ObjectType::Codeunit, Codeunit::"CLE Sales Management", 'OnAfterInsertSalesHistoryLine', '', false, false)]
local procedure OnAfterInsertSalesHistoryLine(var SalesLineHistory: Record "CLE Sales Line History"; SalesLine: Record "Sales Line")
var
    Customer: Record Customer;
begin
    if Customer.Get(SalesLineHistory."Sell-to Customer No.") then begin
        SalesLineHistory."Customer Category" := Customer."Customer Category";
        SalesLineHistory.Modify();
    end;
end;
```

3. **Add to Page**:

```al
pageextension 50099 "Custom Sales Line History Page" extends "CLE Sales Line History"
{
    layout
    {
        addafter("Sell-to Customer No.")
        {
            field("Customer Category"; Rec."Customer Category")
            {
                ApplicationArea = All;
            }
        }
    }
}
```

### Custom Event Publishers

**Publish events for external integrations**:

```al
// In Codeunit 50009
[IntegrationEvent(false, false)]
local procedure OnBeforeInsertSalesHistoryLine(var SalesLine: Record "Sales Line"; ActionTaken: Text[50]; var IsHandled: Boolean)
begin
end;

[IntegrationEvent(false, false)]
local procedure OnAfterInsertSalesHistoryLine(var SalesLineHistory: Record "CLE Sales Line History"; SalesLine: Record "Sales Line")
begin
end;

// Usage in InsertSalesHistoryLine():
procedure InsertSalesHistoryLine(var SalesLine: Record "Sales Line"; ActionTaken: Text[50])
var
    IsHandled: Boolean;
begin
    OnBeforeInsertSalesHistoryLine(SalesLine, ActionTaken, IsHandled);
    if IsHandled then
        exit;

    // ... main logic ...

    SalesLineHistory.Insert(true);
    OnAfterInsertSalesHistoryLine(SalesLineHistory, SalesLine);
end;
```

---

## Security & Compliance

### Access Control

**Permissions Required**:

**Read History**:

- Table: CLE Sales Line History - Read
- Page: CLE Sales Line History - Execute

**Navigate to Source Documents**:

- Sales Header - Read
- Sales Invoice Header - Read
- Sales Cr.Memo Header - Read
- Posted Sales Shipment - Read

**Modify Setup**:

- Table: CLE Clesen Setup - Modify (admin only)

**Delete History** (should be restricted):

- Table: CLE Sales Line History - Delete (rarely needed)

### Audit Requirements

**GDPR Compliance**:

- **User ID**: Personal data, requires consent to store
- **Customer No.**: Customer data, link to privacy policy
- **Retention**: Define data retention policy (e.g., 7 years)
- **Right to Erasure**: Procedure to anonymize/delete customer history

**SOX Compliance**:

- **Immutability**: History never updated, only inserted
- **Audit Trail**: Complete record of all financial changes
- **User Attribution**: Every change tracked to user
- **Timestamp**: Exact date/time of changes

**Example GDPR Anonymization**:
```sql
-- Anonymize history for customer (after legal retention period)
UPDATE [CLE Sales Line History$]
SET [User ID] = 'ANONYMIZED',
    [Sell-to Customer No_] = 'DELETED',
    [Salesperson Code] = ''
WHERE [Sell-to Customer No_] = 'C00001'
    AND [Date of Change] < DATEADD(year, -7, GETDATE())
```

---

## Reference Information

### Key Codeunits

| Codeunit | Name | Purpose |
| ---------- | ------ | --------- |
| 50009 | CLE Sales Management | Core business logic, InsertSalesHistoryLine procedures |
| 50010 | CLE Sales Mgt Subscribers | Event subscribers for automatic tracking |

### Key Tables

| Table | Name | Purpose |
| ------- | ------ | --------- |
| 50025 | CLE Sales Line History | Stores all history records |
| 50000 | CLE Clesen Setup | Configuration (tracking enabled flag) |
| Sales Line | Standard BC table | Source sales lines |
| Sales Invoice Line | Standard BC table | Posted invoice lines |
| Sales Cr.Memo Line | Standard BC table | Posted credit memo lines |

### Key Pages

| Page | Name | Purpose |
| ------ | ------ | --------- |
| 50044 | CLE Sales Line History | Display history, Document Lookup |
| 60059 | Sales Order Subform (Ext) | Sales Process History action |

### AL Field References

**Sales Line Table**:

- `CW Sales Line Set ID` (Integer): Links to history

**CLE Sales Line History Table** (50025):

- All fields documented in Database Schema section

---

## Contact & Support

### Escalation Path

**Level 1: User Issues**

- Check this troubleshooting guide
- Verify setup (CW Activate S-Line Tracking)
- Basic filtering and access issues

**Level 2: Data Issues**

- Incorrect calculations
- Missing history
- Performance problems
- Run diagnostic queries from this guide

**Level 3: Code Issues**

- Event subscribers not firing
- Logic errors in InsertSalesHistoryLine()
- Integration problems
- Engage AL developer

**Level 4: Database Issues**

- Index corruption
- SIFT table problems
- Partitioning needs
- Engage DBA

### Documentation Updates

This guide should be updated when:

- New fields added to history table
- Event logic changes
- Performance optimization implemented
- New common issues discovered

**Version History**:

- v1.0 (Feb 2026): Initial comprehensive guide

---

*Last Updated: February 12, 2026*
*Author: IT Department*
*Document Version: 1.0*

---

## Related documents

- [[sales-process-history-user-guide]]
