# Broker Workspace - IT Troubleshooting Guide

**Version:** 1.0  
**Last Updated:** February 13, 2026  
**Audience:** IT Support, System Administrators, Developers  

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technical Components](#technical-components)
3. [Data Flow and Algorithms](#data-flow-and-algorithms)
4. [Common Issues and Solutions](#common-issues-and-solutions)
5. [Data Integrity Checks](#data-integrity-checks)
6. [Performance Optimization](#performance-optimization)
7. [Debugging Procedures](#debugging-procedures)
8. [Error Reference](#error-reference)
9. [Database Maintenance](#database-maintenance)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      BROKER WORKSPACE                             │
│                  (Page 50086 - Entry Point)                       │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐             ┌───────▼────────┐
        │  Data Sources  │             │  Business Logic │
        │                │             │                 │
        │ • Sales Lines  │             │ • CLE Purchase  │
        │ • Purch Lines  │             │   Management    │
        │ • Item Ledger  │             │   (Codeunit     │
        │ • Forecast     │             │   50017)        │
        │ • Availability │             │                 │
        └───────┬────────┘             └───────┬─────────┘
                │                              │
        ┌───────▼──────────────────────────────▼─────────┐
        │          Worksheet Lines Table                  │
        │      (Table 50020 - Temporary Storage)          │
        │                                                  │
        │  User-specific, session-based planning data     │
        └────────────────┬─────────────────────────────────┘
                         │
                ┌────────▼────────┐
                │  Change Log     │
                │  (Table 50021)  │
                │                 │
                │  Tracks all     │
                │  modifications  │
                └────────┬────────┘
                         │
                ┌────────▼─────────────────┐
                │   Apply Changes          │
                │                          │
                │  Updates Purchase Orders │
                │  (Standard BC Tables)    │
                └──────────────────────────┘
```

### Component Layer Breakdown

**Presentation Layer:**
- Page 50086: Main workspace interface
- Page 50087: New PO line dialog
- Page 50088: Vendor change dialog
- Page 50094: Copy PO dialog

**Business Logic Layer:**
- Codeunit 50017: CLE Purchase Management (lines 572-2298)
  - CreateWorksheet
  - ApplyWorksheetLineChange
  - UpdateDemand / UpdateSupply
  - Change vendor/date/quantity logic
  - Availability calculations

**Data Access Layer:**
- Table 50020: CLE Purch. Worksheet Line (temp planning)
- Table 50021: CLE Purch. Wrksht Log Entry (audit)
- Standard BC tables: Purchase Line, Sales Line, Item, Vendor

**Integration Layer:**
- CLE Availability Calculation (Codeunit) - Forecasting engine
- CLE Availability Management - Location filtering
- Standard BC Purch.-Post codeunit - Order creation

---

## Technical Components

### Table 50020: CLE Purch. Worksheet Line

**Purpose:** Temporary storage for planning session

**Key Fields:**

| Field No. | Field Name | Type | Purpose |
|-----------|----------|------|---------|
| 1 | Entry No. | Integer | Auto-increment primary key |
| 2 | Vendor No. | Code[20] | Vendor link |
| 3 | Item No. | Code[20] | Item link |
| 6 | Purchase Order No. | Code[20] | Linked PO (blank if new) |
| 7 | Purch. Order Line No. | Integer | PO line number |
| 10 | Purch. Line Quantity | Decimal | Current PO quantity |
| 11 | Purch. Line Quantity New | Decimal | **Editable - Planned quantity** |
| 12 | Purch. Line Quantity Adj. | Decimal | Difference (New - Current) |
| 14 | Demand Qty. | Decimal | Sales order demand |
| 15 | Qty. Available | Decimal | Projected inventory |
| 16 | Cum. Availability | Decimal | Running total |
| 23 | Requested Receipt Date | Date | **Editable - Delivery date** |
| 29 | User ID | Code[100] | Session isolation |
| 36 | QtyReceived | Decimal | For hash validation |
| 37-40 | Original * fields | Various | For change detection |
| 41 | Line Modified | Boolean | **Change flag** |

**Indexes:**
- PK: Entry No.
- K2: User ID, Item No., Exp. Receipt Date (default sorting)

**Triggers:**
- OnValidate (Purch. Line Quantity New): Updates avail, logs change
- OnValidate (Requested Receipt Date): Recalculates dates, merges demand
- OnValidate (Vendor No.): Updates linked PO header vendor

### Table 50021: CLE Purch. Wrksht Log Entry

**Purpose:** Audit trail of all worksheet modifications

**Fields:**

| Field | Name | Type | Purpose |
|-------|------|------|---------|
| 1 | Entry No. | Integer | Auto-increment |
| 2 | Worksheet Entry No. | Integer | FK to Table 50020 |
| 3 | User ID | Text[100] | Who made change |
| 4 | Change | Enum | Change type (0-4) |
| 5 | Item Description | Text[100] | Display |
| 6 | Old Value | Text[50] | Before |
| 7 | New Value | Text[40] | After |
| 8 | Change Applied | Boolean | Applied to PO? |

**Change Enum Values:**
```
0 = New Order
1 = Quantity Change
2 = Date Change
3 = Vendor Change
4 = Move Line
```

### Codeunit 50017: CLE Purchase Management

**Key Procedures:**

**CreateWorksheet(StartDate, EndDate, Forecast, PurchaseOnly, ItemFilter, VendorFilter, ForecastDates)**
- Lines 677-826
- Scans purchase orders and sales demand
- Creates worksheet lines for all items in date range
- Calculates availability using CLE Availability Calculation codeunit
- Populates forecast data if selected

**ApplyWorksheetLineChange(WorksheetLine) : Boolean**
- Lines 1852-1925
- Determines change type: New Order, Qty Change, Date Change, Move Line
- Routes to appropriate handler
- Updates cumulative availability
- Sets log entries to applied
- Clears Line Modified flag

**CreateNewPurchaseHeader(WorksheetLine) : Boolean**
- Lines 2042-2082
- Checks for existing PO with same vendor/date/dimension
- Creates new PO header if none found
- Links worksheet line to PO

**CreateNewPurchaseLine(PurchHeader, WorksheetLine) : Boolean**
- Lines 2084-2121
- Finds next available line number (last + 10000)
- Creates item line with planned quantity
- Links blanket orders if applicable

**ChangePurchLineQuantity(WorksheetLine) : Boolean**
- Opens existing PO line
- Validates quantity change
- Updates PO line quantity field
- Triggers BC standard recalculation

**ChangePurchHeaderDate(WorksheetLine) : Boolean**
- Opens PO header
- Updates Requested and Expected Receipt Dates
- May prompt to update all lines on PO

**ChangeVendorOnWorksheetLine(WorksheetLine)**
- Lines 1428-1503
- Opens vendor change dialog
- Creates new line on target vendor/PO
- Marks old line for deletion

**UpdateSimulatedAvail(WorksheetLine)**
- Lines 848-889
- Recalculates "Cum. Avail. (simulated)" for all lines
- Propagates changes forward and backward in time
- Shows impact of pending changes

---

## Data Flow and Algorithms

### Get Data Process

**Step-by-Step Flow:**

```
1. User clicks "Get Data" button
   ↓
2. OnAction trigger validates filters set
   ↓
3. Calls CLEPurchMgt.CreateWorksheet()
   ↓
4. Set Item filters: Type = Inventory, Replenishment = Purchase (if checked)
   ↓
5. Set Vendor filters (if provided)
   ↓
6. Loop through all items:
   For each item:
     a. Calculate demand: CheckDemand(ItemNo, StartDate, EndDate)
        → Queries Sales Lines in date range
        → Sums outstanding quantities
     
     b. Calculate supply: CheckSupply(ItemNo, StartDate, EndDate)
        → Queries Purchase Lines in date range
        → Sums outstanding quantities
     
     c. If demand > 0 OR supply > 0:
        For each day in date range:
          i. Query purchase orders for this item/date
          
          ii. If PO exists:
              → Create worksheet line (supply line)
              → Link to PO number/line number
              → Populate current quantity
              → Set Purch Line Quantity New = Current
              → Calculate availability
              → Calculate cart quantity
          
          iii. If no PO but demand exists:
              → Create worksheet line (demand line)
              → Leave PO fields blank
              → Set Demand Qty
              → Calculate availability
   ↓
7. Calculate cumulative availability
   ↓
8. Populate forecast data (if selected)
   ↓
9. Display in grid
```

**Performance Characteristics:**
- Time complexity: O(I × D × P) where I=items, D=days, P=POs per day
- Typical run time: 30-90 seconds for 100 items × 30 days
- Database queries: ~1000-5000 depending on data volume

### Availability Calculation Algorithm

**Inventory Forecast Logic:**

```
Function GetInventoryForecastForDate(ItemNo, DateToCalculate):
  1. Get current inventory from Item.Inventory
  2. Create TempAvailLine record
  3. Set period: 0D to DateToCalculate
  4. Call AvailCalculation.CalculateSupplyDuringPeriod()
     → Sums: Purchase Orders, Transfer Orders, Prod Orders
  5. Call AvailCalculation.CalculateDemandDuringPeriod()
     → Sums: Sales Orders, Transfer Orders, Prod Components
  6. ForecastQty = Inventory + Supply - Demand
  7. Return ForecastQty
```

**Cumulative Availability:**

```
For each item:
  CumAvail = Inventory at start date
  
  For each date in range:
    Demand = Sales orders for this date
    Supply = Purchase orders for this date
    
    CumAvail = CumAvail + Supply - Demand
    
    Store CumAvail in worksheet line for this date
```

**Simulated Availability (with pending changes):**

```
For each modified line:
  Adjustment = Purch Line Quantity New - Purch Line Quantity
  
  Update all lines for same item:
    If line date <= modified line date:
      Cum Avail (simulated) = Cum Availability + Adjustment
    
    If line date > modified line date:
      Cum Avail (simulated) = Cum Availability + Adjustment + 
                              sum(adjustments from earlier lines)
```

### Apply Changes Algorithm

**Change Detection:**

```
Function GetRequestedChange(WorksheetLine):
  IF Vendor No != Original Vendor No:
    IF Original Vendor No != blank:
      RETURN "Move Line"
    ELSE:
      RETURN "New Order"
  
  IF Purchase Order No != Original PO Number:
    IF Original PO Number != blank:
      RETURN "Move Line"
    ELSE:
      RETURN "New Order"
  
  IF Requested Receipt Date != Original Request Date:
    ChangeType = "Date Change"
  
  IF Purch Line Quantity New != Purch Line Quantity:
    IF ChangeType = "Date Change":
      RETURN "Change Date and Qty"
    ELSE:
      RETURN "Change Quantity"
  
  IF ChangeType is set:
    RETURN ChangeType
  
  RETURN blank (no change)
```

**Apply Process:**

```
For each modified line:
  1. Validate: CheckforChangesOnPurchLine()
     → Compare hash of current PO to stored hash
     → IF changed: Mark as "Purchase Line changed", skip
  
  2. Determine change type
  
  3. Route to handler:
     New Order:
       → CreateNewPurchaseHeader()
       → CreateNewPurchaseLine()
     
     Change Quantity:
       → Open PO line
       → Update Quantity field
       → BC recalculates amounts
     
     Change Date:
       → Open PO header
       → Update Requested Receipt Date
       → Update Expected Receipt Date
     
     Move Line:
       → CreateNewPurchaseLine(target PO)
       → DeleteOldPurchaseLine(original PO)
     
     Change Date and Qty:
       → Execute Date change
       → Execute Qty change
  
  4. Update worksheet:
     → Set new PO number/line number
     → Clear Line Modified flag
     → Set Original values to new values
  
  5. Mark log entries as applied
  
  6. Recalculate availability (UpdateCumAvailAfterApply)
```

### Hash Validation

**Purpose:** Detect external changes to POs

**Algorithm:**

```
Function CreateHashValue(PurchLine):
  String = ItemNo + Quantity + QtyReceived + RequestedReceiptDate
  Hash = CryptoMgt.GenerateHashAsBase64String(String, HashAlgorithm SHA256)
  Return Hash
```

**Validation:**

```
Function CheckforChangesOnPurchLine(WorksheetLine):
  Get PurchLine from PO
  Current Hash = CreateHashValue(PurchLine)
  Stored Hash = CreateHashValueFromWorksheetLine(WorksheetLine)
  
  IF Current Hash != Stored Hash:
    RETURN true (changed)
  ELSE:
    RETURN false (unchanged)
```

---

## Common Issues and Solutions

### Issue 1: Slow Get Data Performance

**Symptoms:**
- Takes >2 minutes to load
- Browser timeout
- Incomplete data load

**Root Causes:**

1. **Too many items in filter**
   - Solution: Narrow item filter, use vendor filter

2. **Wide date range (>90 days)**
   - Solution: Limit to 60 days for routine planning

3. **Large transaction volume**
   - Diagnosis SQL:
   ```sql
   SELECT 
       COUNT(*) AS [Sales Lines],
       MIN([Shipment Date]) AS [First Date],
       MAX([Shipment Date]) AS [Last Date]
   FROM [Clesen Horticulture$Sales Line]
   WHERE [Shipment Date] BETWEEN @StartDate AND @EndDate
       AND [Outstanding Quantity] > 0
   ```

4. **Missing indexes**
   - Check:
     - Sales Line: Document Type, Shipment Date, Outstanding Qty
     - Purchase Line: Document Type, Expected Receipt Date, No.
     - Item Ledger Entry: Item No., Posting Date

**Performance Tuning:**

```sql
-- Create index on Sales Line if missing
CREATE NONCLUSTERED INDEX [IX_SalesLine_ShipmentDate_OutstandingQty]
ON [Clesen Horticulture$Sales Line] ([Shipment Date], [Outstanding Quantity])
INCLUDE ([No_], [Quantity])

-- Create index on Purchase Line if missing
CREATE NONCLUSTERED INDEX [IX_PurchLine_ExpectedReceipt_Item]
ON [Clesen Horticulture$Purchase Line] ([Expected Receipt Date], [No_])
INCLUDE ([Quantity], [Quantity Received])
```

### Issue 2: Availability Always Shows Zero

**Diagnosis Steps:**

1. **Check location filter in availability calculation**
   ```
   Debug: CLEAvailMgt.CreateActiveLocationFilter()
   Expected: Returns pipe-separated list like "LOC1|LOC2|LOC3"
   ```

2. **Verify inventory exists**
   ```sql
   SELECT 
       [Item No_],
       [Location Code],
       SUM(Quantity) AS [Qty]
   FROM [Clesen Horticulture$Item Ledger Entry]
   WHERE [Item No_] = 'TESTITEM'
   GROUP BY [Item No_], [Location Code]
   ```

3. **Check CLE Availability Calculation codeunit**
   - Set breakpoint in CalculateItemAvailabilityForDate
   - Verify parameters: ItemNo, UOM, LocationFilter, Date
   - Step through supply/demand calculation

**Common Fixes:**

- Location marked inactive (CLE Location Type = Regular)
- Item unit of measure mismatch (Base vs. Purch UOM conversion)
- Availability setup missing (CLE Availability Management)

### Issue 3: Changes Not Applying

**Error Messages:**

**"Please clear the page first"**
- Cause: Trying to Get Data when lines exist
- Fix: Click "Clear Page" first

**"You cannot change this value on a Demand Line..."**
- Cause: Trying to set Purch Line Quantity New on line without vendor
- Fix: Use "New Purchase Line" action instead

**"The Purchase Line has changed after you retrieved it"**
- Cause: Hash mismatch - PO modified externally
- Fix: Run "Update Supply", then retry apply

**Silent failure (no error, nothing happens)**
- Cause: Line Modified = false (change didn't trigger flag)
- Debug: Check OnValidate triggers firing
- Fix: Make small change to force flag, then apply

### Issue 4: Duplicate Demand Lines

**Symptoms:**
- Same item appears multiple times for same date
- Demand quantity duplicated

**Root Cause:**
- UpdateDemand called multiple times without clearing
- Sales order has multiple lines for same item/date

**Diagnosis:**

```sql
SELECT 
    sl.[No_],
    sl.[Shipment Date],
    COUNT(*) AS [Line Count],
    SUM([Outstanding Quantity]) AS [Total Demand]
FROM [Clesen Horticulture$Sales Line] sl
INNER JOIN [Clesen Horticulture$Sales Header] sh 
    ON sl.[Document Type] = sh.[Document Type]
    AND sl.[Document No_] = sh.[No_]
WHERE sl.[Shipment Date] = '2026-03-01'
    AND sl.[No_] = 'ITEM001'
    AND sl.[Outstanding Quantity] > 0
GROUP BY sl.[No_], sl.[Shipment Date]
HAVING COUNT(*) > 1
```

**Fix:**
- MergeDemandAndSupplyLinesOnDateChange should consolidate
- If not: Manual cleanup required
  ```sql
  DELETE FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
  WHERE [User ID] = 'PROBLEM_USER'
  ```

### Issue 5: Cart Quantities Wrong

**Symptoms:**
- Cart Quantity Line shows 0 or incorrect values
- Cart Total doesn't match sum of lines

**Diagnosis:**

1. **Check item Net Weight field**
   ```sql
   SELECT 
       [No_],
       Description,
       [Net Weight],
       [Purch_ Unit of Measure]
   FROM [Clesen Horticulture$Item]
   WHERE [No_] = 'PROBLEM_ITEM'
   ```

2. **Verify CalculateCartQty function**
   - Located in Codeunit 50017, lines 1389-1401
   - Formula: Quantity / Net Weight
   - Requires Net Weight > 0

**Fix:**
- Set Item.Net Weight for all brokered items
- Run UpdateCartQtyPerUnit procedure to recalculate

---

## Data Integrity Checks

### Routine Validation Queries

**Check 1: Orphaned Worksheet Lines**

```sql
-- Lines with invalid item numbers
SELECT ws.*
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
LEFT JOIN [Clesen Horticulture$Item] i ON ws.[Item No_] = i.[No_]
WHERE i.[No_] IS NULL
```

**Check 2: Worksheet Lines with Invalid PO References**

```sql
SELECT ws.*
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
LEFT JOIN [Clesen Horticulture$Purchase Line] pl 
    ON ws.[Purchase Order No_] = pl.[Document No_]
    AND ws.[Purch_ Order Line No_] = pl.[Line No_]
    AND pl.[Document Type] = 1
WHERE ws.[Purchase Order No_] != ''
    AND pl.[Document No_] IS NULL
```

**Check 3: Log Entries Without Worksheet Lines**

```sql
SELECT log.*
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log
LEFT JOIN [Clesen Horticulture$CLE Purch_ Worksheet Line] ws 
    ON log.[Worksheet Entry No_] = ws.[Entry No_]
    AND log.[User ID] = ws.[User ID]
WHERE ws.[Entry No_] IS NULL
    AND log.[Change Applied] = 0
```

**Check 4: Modified Lines Without Log Entries**

```sql
SELECT ws.*
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
LEFT JOIN [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] log 
    ON ws.[Entry No_] = log.[Worksheet Entry No_]
    AND ws.[User ID] = log.[User ID]
WHERE ws.[Line Modified] = 1
    AND log.[Entry No_] IS NULL
```

**Check 5: Availability Calculation Consistency**

```sql
-- Compare calculated vs. stored availability
SELECT 
    ws.[Item No_],
    ws.[Exp_ Receipt Date],
    ws.[Qty_ Available] AS [Stored Avail],
    (
        SELECT SUM(Quantity)
        FROM [Clesen Horticulture$Item Ledger Entry] ile
        WHERE ile.[Item No_] = ws.[Item No_]
            AND ile.[Posting Date] <= ws.[Exp_ Receipt Date]
    ) AS [Calculated Avail],
    ABS(ws.[Qty_ Available] - (
        SELECT COALESCE(SUM(Quantity), 0)
        FROM [Clesen Horticulture$Item Ledger Entry] ile
        WHERE ile.[Item No_] = ws.[Item No_]
            AND ile.[Posting Date] <= ws.[Exp_ Receipt Date]
    )) AS [Variance]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line] ws
WHERE ABS(ws.[Qty_ Available] - (
    SELECT COALESCE(SUM(Quantity), 0)
    FROM [Clesen Horticulture$Item Ledger Entry] ile
    WHERE ile.[Item No_] = ws.[Item No_]
        AND ile.[Posting Date] <= ws.[Exp_ Receipt Date]
)) > 10 -- Variance threshold
```

### Monthly Maintenance

**Cleanup Script:**

```sql
-- Archive old worksheet lines (>60 days)
BEGIN TRANSACTION

-- Copy to archive table
INSERT INTO [Clesen Horticulture$CLE Purch_ Worksheet Archive]
SELECT *, GETDATE() AS [Archived Date]
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
WHERE [timestamp] < DATEADD(day, -60, GETDATE())

-- Delete from active table
DELETE FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
WHERE [timestamp] < DATEADD(day, -60, GETDATE())

-- Archive old log entries (>90 days)
INSERT INTO [Clesen Horticulture$CLE Purch_ Wrksht Log Archive]
SELECT *, GETDATE() AS [Archived Date]
FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry]
WHERE [timestamp] < DATEADD(day, -90, GETDATE())

DELETE FROM [Clesen Horticulture$CLE Purch_ Wrksht Log Entry]
WHERE [timestamp] < DATEADD(day, -90, GETDATE())

COMMIT TRANSACTION
```

---

## Performance Optimization

### Database Indexes

**Recommended Indexes:**

```sql
-- Index on Sales Line for demand calculation
CREATE NONCLUSTERED INDEX [IX_SalesLine_Demand_Calc]
ON [Clesen Horticulture$Sales Line] 
([Document Type], [Type], [Shipment Date], [Outstanding Quantity])
INCLUDE ([No_], [Quantity])

-- Index on Purchase Line for supply calculation
CREATE NONCLUSTERED INDEX [IX_PurchLine_Supply_Calc]
ON [Clesen Horticulture$Purchase Line]
([Document Type], [Type], [Expected Receipt Date], [Quantity Received])
INCLUDE ([No_], [Quantity], [Buy-from Vendor No_])

-- Index on Worksheet Line for user queries
CREATE NONCLUSTERED INDEX [IX_WorksheetLine_User_Item_Date]
ON [Clesen Horticulture$CLE Purch_ Worksheet Line]
([User ID], [Item No_], [Exp_ Receipt Date])
INCLUDE ([Entry No_], [Vendor No_], [Purchase Order No_])

-- Index on Log Entry for change tracking
CREATE NONCLUSTERED INDEX [IX_LogEntry_User_Applied]
ON [Clesen Horticulture$CLE Purch_ Wrksht Log Entry]
([User ID], [Change Applied], [timestamp])
INCLUDE ([Worksheet Entry No_], [Change])
```

### Query Optimization

**Slow Query: CheckDemand Function**

**Before (lines 1174-1192):**
```al
TempAvailLine.Init();
TempAvailLine."Item No." := ItemNo;
TempAvailLine."Period Type" := TempAvailLine."Period Type"::Day;
TempAvailLine."Availability Date" := StartDate;
TempAvailLine."Period End Date" := EndDate;
TempAvailLine.Insert();
CLEAvailCalculation.CalculateDemandDuringPeriod(TempAvailLine);
exit(TempAvailLine."Quantity Demand (Base)");
```

**Optimization:** This calls into availability engine which may do full table scans. For large date ranges:
- Cache results per item
- Use batch processing

**After (suggested):**
```al
IF ItemDemandCache.Get(ItemNo, StartDate, EndDate) THEN
    exit(ItemDemandCache.Demand);

// Calculate only if not cached
TempAvailLine.Init();
...
ItemDemandCache.Item := ItemNo;
ItemDemandCache.StartDate := StartDate;
ItemDemandCache.EndDate := EndDate;
ItemDemandCache.Demand := TempAvailLine."Quantity Demand (Base)";
ItemDemandCache.Insert();
```

### Caching Strategy

**Session-Level Cache:**
- Demand calculations per item (reduce repeated queries)
- Availability forecasts (snapshot at GetData time)
- Vendor/Item lookups (reduce table hits)

**Implementation:**
```al
// Add to codeunit as global variables
var
    DemandCache: Dictionary of [Code[60], Decimal]; // "ItemNo|StartDate|EndDate" -> Demand
    AvailCache: Dictionary of [Code[60], Decimal];  // "ItemNo|Date" -> Availability
```

---

## Debugging Procedures

### Enable Detailed Logging

**AL Code Modification:**

```al
// In CreateWorksheet procedure, add logging
procedure CreateWorksheet(...)
var
    LogFile: File;
    OutStream: OutStream;
begin
    IF DebugMode THEN BEGIN
        LogFile.Create('C:\Temp\BrokerWorkspace_Debug.txt');
        LogFile.CreateOutStream(OutStream);
        OutStream.WriteText('Starting CreateWorksheet');
        OutStream.WriteText('StartDate: ' + Format(StartDate));
        OutStream.WriteText('EndDate: ' + Format(EndDate));
    END;
    
    // ... existing code ...
    
    IF DebugMode THEN
        OutStream.WriteText('Items processed: ' + Format(NoOfItems));
end;
```

### Debugging Apply Changes

**Breakpoint Locations:**

1. **ApplyWorksheetLineChange** (Line 1852)
   - Verify WorksheetLine parameters
   - Check Line Modified = true
   - Watch ChangeRequestResult enum

2. **GetRequestedChange** (Line 2008)
   - Examine Original vs. Current values
   - Verify correct change type returned

3. **CreateNewPurchaseHeader** (Line 2042)
   - Check if existing PO found
   - Verify new PO creation

4. **ChangePurchLineQuantity** (implementation)
   - Verify PO line found
   - Check quantity validation

**AL Debugger Watch Variables:**

```
WorksheetLine."Line Modified"
WorksheetLine."Purchase Order No."
WorksheetLine."Original PO Number"
WorksheetLine."Purch. Line Quantity New"
WorksheetLine."Purch. Line Quantity"
ChangeRequestResult (enum value 0-4)
Success (Boolean return)
```

### SQL Profiler Trace

**Capture Slow Queries:**

```sql
-- Run SQL Profiler during Get Data operation
-- Filter to:
--   - Duration > 1000ms
--   - Application Name LIKE '%Business Central%'
--   - DatabaseName = 'Clesen Horticulture'

-- Look for patterns:
--   - Table scans on large tables
--   - Missing indexes (Index Seek vs. Index Scan)
--   - Excessive reads (>10,000 logical reads)
```

### Event Log Analysis

**Check BC Event Log:**

```powershell
# PowerShell script to extract BC errors
Get-WinEvent -LogName "Microsoft-DynamicsNAV-Server/Admin" -MaxEvents 100 |
    Where-Object {$_.Message -like "*Broker Workspace*" -or $_.Message -like "*50086*"} |
    Select-Object TimeCreated, LevelDisplayName, Message |
    Format-Table -AutoSize
```

---

## Error Reference

### Error Code: "CLE-PWS-001"

**Message:** "Please clear the page first"

**Cause:** Worksheet lines exist when Get Data clicked

**Solution:** Click "Clear Page" button

**Prevention:** Modify page to auto-clear if > X days old

---

### Error Code: "CLE-PWS-002"

**Message:** "You cannot change this value on a Demand Line if the item does not have a vendor assigned"

**Cause:** OnValidate trigger on Purch. Line Quantity New field fires when vendor is blank

**Location:** Table 50020, Field 11, OnValidate

**Solution:** Use "New Purchase Line" action to assign vendor first

**Code Location:**
```al
// Table 50020, Line 101-110
trigger OnValidate()
begin
    if ("Vendor No." = '') and ("Purch. Line Quantity New" <> 0) then
        Error(NoChangeOndemandLinesErrorMsg);
    // ...
end;
```

---

### Error Code: "CLE-PWS-003"

**Message:** "The Purchase Line has changed after you retrieved it. Please update the line first."

**Cause:** Hash validation failed - external modification detected

**Location:** Table 50020, Field 23 (Requested Receipt Date), OnValidate, Line 235

**Diagnostic:**

```al
// Compare hashes
CurrentHash := CLEPurchMgt.CreateHashValue(PurchLine);
StoredHash := CLEPurchMgt.CreateHashValueFromWorksheetLine(Rec);
IF CurrentHash <> StoredHash THEN
    // Error triggered
```

**Solution:** Run "Update Supply" to refresh data

---

### Error Code: "CLE-PWS-004"

**Message:** "No Date, No PO..."

**Cause:** CreateCopyOfWorkSheetPO called with Requested Receipt Date = 0D

**Location:** Codeunit 50017, Line 2213

**Solution:** Set date in Copy PO dialog before clicking OK

---

### Error Code: "CLE-PWS-005"

**Message:** "Process aborted."

**Cause:** User declined date change confirmation in ChangeVendorOnWorksheetLine

**Location:** Codeunit 50017, Line 1445

**Solution:** Not an error - user intentionally cancelled

---

### Error Code: "CLE-PWS-006"

**Message:** "Something went wrong and the line was not created."

**Cause:** CreateNewWorksheetLine returned 0 (insert failed)

**Location:** Codeunit 50017, Line 1312

**Diagnostic:** Check AL error log for insert failure reason

**Common Causes:**
- Primary key violation (Entry No. collision)
- Validation error on required field
- Database connection issue

**Solution:**
```sql
-- Check for duplicate entry numbers
SELECT [Entry No_], COUNT(*)
FROM [Clesen Horticulture$CLE Purch_ Worksheet Line]
WHERE [User ID] = 'USER01'
GROUP BY [Entry No_]
HAVING COUNT(*) > 1
```

---

### Error Code: "CLE-PWS-007"

**Message:** "Qty. to Move cannot be greater than the existing Qty. on the Order"

**Cause:** Copy PO dialog - trying to move more than available

**Location:** Page 50094, Line 93

**Solution:** Reduce Qty. to Move to <= source line quantity

---

## Database Maintenance

### Table Statistics

**Update Statistics Monthly:**

```sql
-- Update stats for worksheet tables
UPDATE STATISTICS [Clesen Horticulture$CLE Purch_ Worksheet Line] WITH FULLSCAN;
UPDATE STATISTICS [Clesen Horticulture$CLE Purch_ Wrksht Log Entry] WITH FULLSCAN;

-- Update stats for frequently queried BC tables
UPDATE STATISTICS [Clesen Horticulture$Purchase Line] WITH FULLSCAN;
UPDATE STATISTICS [Clesen Horticulture$Sales Line] WITH FULLSCAN;
UPDATE STATISTICS [Clesen Horticulture$Item Ledger Entry] WITH FULLSCAN;
```

### Index Maintenance

**Rebuild Fragmented Indexes:**

```sql
-- Check fragmentation
SELECT 
    OBJECT_NAME(ips.object_id) AS TableName,
    i.name AS IndexName,
    ips.avg_fragmentation_in_percent,
    ips.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'DETAILED') ips
INNER JOIN sys.indexes i ON ips.object_id = i.object_id AND ips.index_id = i.index_id
WHERE ips.avg_fragmentation_in_percent > 30
    AND ips.page_count > 1000
    AND OBJECT_NAME(ips.object_id) LIKE '%Purch%Worksheet%'
ORDER BY ips.avg_fragmentation_in_percent DESC

-- Rebuild if needed
ALTER INDEX ALL ON [Clesen Horticulture$CLE Purch_ Worksheet Line] REBUILD;
```

### Backup Considerations

**Archive Before Cleanup:**

```sql
-- Create archive tables if not exist
IF NOT EXISTS (SELECT * FROM sys.objects 
               WHERE object_id = OBJECT_ID(N'[dbo].[Clesen Horticulture$CLE Purch_ Worksheet Archive]'))
BEGIN
    CREATE TABLE [Clesen Horticulture$CLE Purch_ Worksheet Archive] (
        /* Copy structure from original table */
        /* Add: [Archived Date] datetime NOT NULL */
    )
END
```

---

## Document Information

**Version History:**

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 02/13/2026 | Initial release | Documentation Team |

**Related Documents:**
- Broker Workspace Staff Guide
- Broker Workspace Manager Guide
- AL Code Reference (Codeunit 50017)
- Database Schema Documentation

**Support:**
Contact it.support@clesenhoriculture.com

---

*End of Broker Workspace IT Troubleshooting Guide*

---

## Related documents

- [[README]]
- [[broker-workspace-staff-guide]]
- [[broker-workspace-manager-guide]]
