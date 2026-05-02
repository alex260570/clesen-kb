---
title: Production Order Posting — IT Troubleshooting Guide
type: howto
tags: [production, posting, troubleshooting, IT, system-architecture]
created: 2026-04-21
updated: 2026-04-21
sources: [prod-order-posting-it-troubleshooting-guide.md]
---

# Production Order Posting — IT Troubleshooting Guide

Technical reference for IT support staff diagnosing and resolving production order posting issues.

## System Architecture

### Component Overview

**Pages:**
- **50100** — CLE Pst Outp. from Prod. Order (Post Output)
- **50099** — CLE Pst Scrap from Prod. Order (Adjust Quantity)
- **50120** — CLE Adjust Safety in ProdOrder (Safety Adjustment)

**Codeunits:**
- **50007** — CLE Production Management (Main business logic)
- **50119** — CLE Post Scrap Capacity Entry (Scrap posting)

**Table Extensions:**
- **50047** — CLE Production Order (adds Requested Quantity, Source Prod. Order No.)
- **50034** — CLE Prod. Order Line (adds Safety Qty., Roll-up Item No.)

**Core Tables Used:**
- Production Order (header)
- Prod. Order Line
- Capacity Ledger Entry (posting destination)
- Item Ledger Entry (inventory movements)
- Item Journal Line (posting mechanism)

### Data Flow Architecture

```
User Interface (Pages)
    ↓
Validation Layer (Page Triggers)
    ↓
Business Logic (CLE Production Management)
    ↓
    ├─→ Adjust Header Quantity
    ├─→ Adjust Line Quantity
    ├─→ Adjust Safety Quantity
    └─→ Post Scrap Capacity Entry
        ↓
        Item Journal Post Line (Standard BC)
        ↓
        ├─→ Capacity Ledger Entry
        └─→ Item Ledger Entry
```

### Key Procedures

**CLE Production Management (Codeunit 50007):**
```al
// Main adjustment procedure
AdjustQuantityOnProdOrder(
    ProdOrder, 
    CurrentQty, 
    NewQty, 
    PostedScrap, 
    RoutingLinkCode, 
    ScrapCode
): Boolean

// Scrap recovery engine
AdjustScrapOnCapLedgerEntries(
    ProdOrder, 
    QtyToAdjust
): Decimal

// Header adjustments
AdjustQtyOnProdOrderHeader(ProdOrder, QtyToAdjust)
AdjustQtyOnProdOrderHeaderOnly(ProdOrder, QtyToAdjust)

// Line adjustments
AdjustQtyOnProdOrderLine(ProdOrder, QtyToAdjust): Boolean

// Safety quantity
AdjustSafetyQuantityOnProdOrderLine(ProdOrderLine)
CheckForSafetyAdjustmentAuthorization(): Boolean

// Special cases
SetProdOrderHeaderToZero(ProdOrder)
DeleteProdOrderLine(ProdOrder)

// Query functions
GetPostedScrap(ProdOrder): Decimal
GetDefaultOutputQty(ProdOrder, RoutingLine): Decimal
CheckProdOrderProcessStarted(ProdOrder): Boolean
```

**CLE Post Scrap Capacity Entry (Codeunit 50119):**
```al
PostScrapCapacityEntry(
    ProdOrder, 
    RoutingLinkCode, 
    ScrapQty, 
    ScrapCode
)

PostScrapCapacityEntryWithDate(
    ProdOrder, 
    RoutingLinkCode, 
    ScrapQty, 
    ScrapCode, 
    PostingDate, 
    OutputQty
)
```

## Common Issues and Solutions

### Issue 1: Cannot Increase Quantity

**Symptom:** User gets error when trying to increase production order quantity.

**Error Message:**
- "Cannot increase quantity. Insufficient scrap to recover."
- "Cannot increase quantity. No scrap available to recover and production has already started."

**Root Causes:**
1. Production has started (Capacity Ledger Entries exist)
2. No posted scrap available to recover
3. Requested increase exceeds available scrap

**Diagnostic Steps:**
```sql
-- Check if production has started
SELECT COUNT(*) FROM [Capacity Ledger Entry]
WHERE [Order No_] = 'PROD-ORDER-NO';

-- Check available scrap
SELECT SUM([Scrap Quantity]) as [Total Scrap]
FROM [Capacity Ledger Entry]
WHERE [Order No_] = 'PROD-ORDER-NO';
```

**Solutions:**

**Solution A: Has Posted Scrap**
1. Verify scrap amount available
2. Ensure increase amount ≤ posted scrap
3. Use Adjust Quantity to recover scrap
4. System will adjust Capacity Ledger Entries automatically

**Solution B: No Posted Scrap**
1. Cannot increase current order
2. Create new production order for additional quantity
3. Link orders via Source Prod. Order No. field for tracking

**Solution C: Partial Scrap Available**
1. Increase by available scrap amount first
2. Create supplemental order for remainder
3. Document both orders for tracking

### Issue 2: Header and Line Quantity Mismatch

**Symptom:** Production Order header quantity doesn't match line quantity.

**Diagnostic:**
```sql
SELECT 
    h.[No_], 
    h.[Quantity] as [Header Qty],
    l.[Quantity] as [Line Qty],
    h.[Quantity] - l.[Quantity] as [Difference]
FROM [Production Order] h
LEFT JOIN [Prod_ Order Line] l 
    ON h.[Status] = l.[Status] 
    AND h.[No_] = l.[Prod_ Order No_]
WHERE h.[Status] = 2 -- Released
    AND ABS(h.[Quantity] - l.[Quantity]) > 0.01;
```

**Root Causes:**
1. Incomplete posting transaction
2. Manual database modification
3. Scrap posted but header not updated
4. System error during quantity adjustment

**Solutions:**

**For Active Orders:**
```al
// Use CLE Production Management functions
ProdOrder.Get(Status::Released, 'PROD-ORDER-NO');
AdjustQtyOnProdOrderHeader(ProdOrder, Difference);
// Or
AdjustQtyOnProdOrderLine(ProdOrder, Difference);
```

**Manual Correction (Last Resort):**
```sql
-- Backup first!
UPDATE [Prod_ Order Line]
SET [Quantity] = (SELECT [Quantity] FROM [Production Order] 
                  WHERE [Status] = 2 AND [No_] = 'PROD-ORDER-NO')
WHERE [Status] = 2 
    AND [Prod_ Order No_] = 'PROD-ORDER-NO';
```

### Issue 3: Safety Quantity Not Updating

**Symptom:** Safety quantity field not recalculating after scrap posting.

**Diagnostic Steps:**
```sql
SELECT 
    [Prod_ Order No_],
    [Quantity],
    [CLE Safety Qty_],
    [Remaining Quantity],
    [Finished Quantity]
FROM [Prod_ Order Line]
WHERE [Status] = 2 
    AND [Prod_ Order No_] = 'PROD-ORDER-NO';
```

**Root Causes:**
1. Safety adjustment triggered incorrectly
2. Scrap exceeds safety quantity
3. Manual override by authorized user
4. Validation logic bypassed

**Expected Behavior:**
```
Initial: Safety = 30
Post 20 scrap: Safety should reduce to 10 (or 0 if "Release Safety" checked)
Post 50 scrap: Safety should be 0 (exceeds original 30)
```

**Code Logic:**
```al
// In Page 50100 - PostOutput
if ReleaseSafety = true then
    ProdOrderLine.Validate("CLE Safety Qty.", 0)
else
    ProdOrderLine.Validate("CLE Safety Qty.", 
        ProdOrderLine."CLE Safety Qty." - ScrapQty);

if ProdOrderLine."CLE Safety Qty." < 0 then
    ProdOrderLine.Validate("CLE Safety Qty.", 0);
```

**Solution:**
1. Verify "Release Safety" checkbox state during posting
2. Check if scrap exceeded safety (safety should be 0)
3. Recalculate manually if needed using Adjust Safety action

### Issue 4: Negative Scrap Quantity in Capacity Ledger

**Symptom:** Capacity Ledger Entry shows negative scrap quantity.

**Diagnostic:**
```sql
SELECT 
    [Entry No_],
    [Order No_],
    [Operation No_],
    [Output Quantity],
    [Scrap Quantity],
    [Posting Date],
    [User ID]
FROM [Capacity Ledger Entry]
WHERE [Order No_] = 'PROD-ORDER-NO'
    AND [Scrap Quantity] < 0
ORDER BY [Entry No_];
```

**Root Causes:**
1. Historical: Pre-fix adjustment logic (before 2026-01-21)
2. Scrap recovery created negative entries
3. Manual correction attempt
4. Data corruption

**Impact:**
- Indicates scrap was recovered in old system version
- May affect reporting accuracy
- Can confuse scrap analysis

**Solutions:**

**Use Cleanup Page (if available):**
- Page 50333 — CLE Corrupted Prod Orders Cleanup
- Designed to fix negative scrap issues
- Posts compensating entries

**Manual Correction:**
```sql
-- ONLY if cleanup page not available
-- Find entries with negative scrap
SELECT * FROM [Capacity Ledger Entry]
WHERE [Order No_] = 'PROD-ORDER-NO'
    AND [Scrap Quantity] < 0;

-- These should be reviewed and understood
-- before any correction
-- Consult with development team
```

**Prevention:**
- System updated 2026-01-21 to prevent this issue
- New logic: decreases post new scrap, don't modify existing entries
- Increases recover from existing scrap entries correctly

### Issue 5: Cannot Post Output — Variant Code Error

**Symptom:** "Variant Code may not be empty" error at final phase.

**Diagnostic:**
```sql
-- Check if item has variants
SELECT 
    i.[No_],
    COUNT(iv.[Code]) as [Variant Count]
FROM [Item] i
LEFT JOIN [Item Variant] iv ON i.[No_] = iv.[Item No_]
WHERE i.[No_] = 'ITEM-NO'
GROUP BY i.[No_];

-- Check production order line variant
SELECT 
    [Item No_],
    [Variant Code],
    [Quantity]
FROM [Prod_ Order Line]
WHERE [Status] = 2 
    AND [Prod_ Order No_] = 'PROD-ORDER-NO';
```

**Root Causes:**
1. Item has variants defined
2. Posting at final phase (last operation)
3. Variant code not selected

**Code Logic:**
```al
ItemVariant.SetRange("Item No.", ItemNo);
if not ItemVariant.IsEmpty() then
    HasVariant := true;

if IsLastPhase and HasVariant and (VariantCode = '') then
    Error('Variant Code may not be empty.');
```

**Solutions:**
1. User must select variant code from lookup
2. If wrong variant selected earlier, correct Prod. Order Line first
3. If item shouldn't have variants, remove variant definitions

### Issue 6: "Entries for this Order already exist" Error

**Symptom:** User cannot use "Adjustment Only" mode.

**Error Message:** "Entries for this Order already exist. To reduce the quantity, you need to post scrap."

**Diagnostic:**
```sql
SELECT 
    COUNT(*) as [Entry Count],
    SUM([Output Quantity]) as [Total Output],
    SUM([Scrap Quantity]) as [Total Scrap]
FROM [Capacity Ledger Entry]
WHERE [Order No_] = 'PROD-ORDER-NO';
```

**Root Cause:**
- Production has started (Capacity Ledger Entries exist)
- Once posting begins, cannot use direct adjustment
- Must use scrap posting for transaction history

**Expected Behavior:**
- This is CORRECT behavior
- System enforces audit trail
- User must select scrap code and post properly

**Solution:**
1. Uncheck "Adjustment Only"
2. Select appropriate scrap code
3. Confirm scrap posting
4. System creates proper audit trail

## Data Integrity Checks

### Verify Production Order Consistency

**SQL Health Check Script:**
```sql
-- Check 1: Header/Line quantity match
SELECT 
    'Header/Line Mismatch' as [Issue],
    h.[No_] as [Order No],
    h.[Quantity] as [Header Qty],
    l.[Quantity] as [Line Qty]
FROM [Production Order] h
LEFT JOIN [Prod_ Order Line] l 
    ON h.[Status] = l.[Status] 
    AND h.[No_] = l.[Prod_ Order No_]
WHERE h.[Status] = 2
    AND ABS(h.[Quantity] - l.[Quantity]) > 0.01;

-- Check 2: Safety quantity validation
SELECT 
    'Invalid Safety Qty' as [Issue],
    [Prod_ Order No_] as [Order No],
    [Quantity],
    [CLE Safety Qty_],
    [Remaining Quantity]
FROM [Prod_ Order Line]
WHERE [Status] = 2
    AND [CLE Safety Qty_] > [Remaining Quantity];

-- Check 3: Requested quantity validation
SELECT 
    'Invalid Requested Qty' as [Issue],
    [No_] as [Order No],
    [Quantity],
    [CLE Requested Quantity]
FROM [Production Order]
WHERE [Status] = 2
    AND [CLE Requested Quantity] > [Quantity];

-- Check 4: Orphaned capacity ledger entries
SELECT 
    'Orphaned Cap Entry' as [Issue],
    c.[Entry No_],
    c.[Order No_]
FROM [Capacity Ledger Entry] c
LEFT JOIN [Production Order] p 
    ON c.[Order No_] = p.[No_]
WHERE p.[No_] IS NULL
    AND c.[Posting Date] > DATEADD(month, -6, GETDATE());

-- Check 5: Negative scrap check
SELECT 
    'Negative Scrap' as [Issue],
    [Entry No_],
    [Order No_],
    [Scrap Quantity],
    [Posting Date]
FROM [Capacity Ledger Entry]
WHERE [Scrap Quantity] < 0
ORDER BY [Posting Date] DESC;
```

### Automated Monitoring

**Create SQL Job for Daily Checks:**
```sql
-- Store results in monitoring table
INSERT INTO [CLE Production Order Issues]
([Check Date], [Issue Type], [Order No], [Details])
SELECT 
    GETDATE(),
    'Header/Line Mismatch',
    h.[No_],
    CONCAT('Header: ', h.[Quantity], ', Line: ', l.[Quantity])
FROM [Production Order] h
LEFT JOIN [Prod_ Order Line] l 
    ON h.[Status] = l.[Status] 
    AND h.[No_] = l.[Prod_ Order No_]
WHERE h.[Status] = 2
    AND ABS(h.[Quantity] - l.[Quantity]) > 0.01;

-- Email alert if issues found
-- Configure SQL Server Database Mail
```

## Error Messages Reference

### User-Facing Errors

| Error Message | Source | Meaning | User Action |
|--------------|--------|---------|-------------|
| "Scrap Code may not be empty" | Page 50100/50099 | Scrap > 0 but no code selected | Select scrap code |
| "Variant Code may not be empty" | Page 50100 | Final phase with variants | Select variant |
| "You can not post more Output than X" | Page 50100 | Output exceeds calculated | Adjust quantity first |
| "Cannot increase quantity. Insufficient scrap to recover" | Codeunit 50007 | Increase > posted scrap | Create new order |
| "Cannot increase quantity. No scrap available..." | Codeunit 50007 | Production started, no scrap | Create new order |
| "The selected phase does not exist..." | Page 50099 | Invalid routing link code | Verify phase selection |
| "Safety Quantity may not be greater than Remaining Quantity" | Page 50120 | Invalid safety adjustment | Enter valid amount |
| "Status must be Released" | Page 50100/50099 | Wrong order status | Release order first |
| "This function can only be used on Orders with one Line" | Page 50100/50099 | Multi-line order | Not supported |
| "Entries for this Order already exist..." | Page 50099 | Adjustment Only invalid | Use scrap posting |

### System Errors

| Error Message | Source | Technical Cause | IT Action |
|--------------|--------|-----------------|-----------|
| "No operation found for Routing Link Code X" | Codeunit 50119 | Missing routing line | Check routing setup |
| "Scrap quantity must be greater than zero" | Codeunit 50119 | Invalid parameter | Check calling code |
| "More than one Production Order Line found" | Codeunit 50007 | Multi-line order | Not supported |
| Write transaction error | Various | Database lock | Retry/check locks |
| Item Journal Post Line error | Standard BC | Posting validation | Check standard BC logs |

## Manual Corrections

### Procedure: Correct Posted Output Quantity

**Scenario:** User posted wrong output quantity, needs correction.

**Assessment:**
1. Determine if within same day
2. Check if subsequent postings exist
3. Evaluate impact on inventory

**Method 1: Adjustment via Adjust Quantity**
```
Best for: Small corrections, scrap available for recovery
1. Use Adjust Quantity page
2. Increase/decrease to correct amount
3. System adjusts scrap entries
4. Preserves audit trail
```

**Method 2: Reversal and Repost (Complex)**
```
Use only if: Major error, same day, no inventory movements
1. Document current state
2. Contact BC administrator
3. May require capacity ledger entry reversal
4. Repost correctly
5. Full audit documentation
```

**Method 3: Compensating Entry**
```
Preferred for: Errors discovered later
1. Post additional output (if under-posted)
2. Post scrap (if over-posted)
3. Document as correction
4. Update order notes
```

### Procedure: Fix Negative Scrap Entries

**Use Cleanup Page (Recommended):**
1. Navigate to Page 50333 "CLE Corrupted Prod Orders Cleanup"
2. Filter to affected production order
3. Review calculated corrections
4. Execute "Fix This Order" action
5. System posts compensating entries

**Manual Approach (Advanced):**
```al
// Pseudo-code for correction logic
For each negative scrap entry:
    1. Calculate compensating scrap (absolute value)
    2. Calculate excess output to remove
    3. Post compensating scrap entry with scrap code "CLEANUP"
    4. Post negative output to correct excess
    5. Adjust line quantity if needed
```

### Procedure: Reset Production Order to Zero

**Scenario:** Order needs complete cancellation.

**Pre-Checks:**
```sql
-- Verify current state
SELECT 
    [Status],
    [Quantity],
    [CLE Requested Quantity]
FROM [Production Order]
WHERE [No_] = 'PROD-ORDER-NO';

-- Check for postings
SELECT COUNT(*) FROM [Capacity Ledger Entry]
WHERE [Order No_] = 'PROD-ORDER-NO';
```

**If No Postings:**
```al
// Use system function
ProdMgt.SetProdOrderHeaderToZero(ProdOrder);
ProdMgt.DeleteProdOrderLine(ProdOrder);
// Result: Header = 0, Line deleted, components cascade deleted
```

**If Has Postings:**
```al
// Must post remaining as scrap
Use Adjust Quantity page
Enter New Quantity = 0
Select scrap code
Confirm posting
// Result: All remaining qty posted as scrap
```

## Performance Optimization

### Index Recommendations

**Critical Indexes:**
```sql
-- Capacity Ledger Entry lookups
CREATE INDEX IX_CapLedger_OrderNo_ScrapQty 
ON [Capacity Ledger Entry]([Order No_], [Scrap Quantity])
INCLUDE ([Output Quantity], [Entry No_]);

-- Production Order Line lookups
CREATE INDEX IX_ProdOrderLine_Status_OrderNo 
ON [Prod_ Order Line]([Status], [Prod_ Order No_])
INCLUDE ([Quantity], [CLE Safety Qty_], [Remaining Quantity]);
```

### Query Optimization

**Slow Query: Get Posted Scrap**
```al
// Original (slow for large datasets)
CapLedgerEntry.SetRange("Order No.", ProdOrder."No.");
if CapLedgerEntry.FindSet(false) then begin
    CapLedgerEntry.CalcSums("Scrap Quantity");
    PostedScrapQty := CapLedgerEntry."Scrap Quantity";
end;

// Optimized
CapLedgerEntry.SetRange("Order No.", ProdOrder."No.");
CapLedgerEntry.CalcSums("Scrap Quantity");
PostedScrapQty := CapLedgerEntry."Scrap Quantity";
// Avoid FindSet when only need sum
```

### Caching Strategies

**Reduce Database Roundtrips:**
```al
// Cache production order line
ProdOrderLine.SetRange(Status, ProdOrder.Status);
ProdOrderLine.SetRange("Prod. Order No.", ProdOrder."No.");
if ProdOrderLine.FindFirst() then begin
    // Use local variable for multiple accesses
    LocalQty := ProdOrderLine.Quantity;
    LocalSafety := ProdOrderLine."CLE Safety Qty.";
    // Perform calculations
end;
```

## Debugging Procedures

### Enable Detailed Logging

**Application Insights:**
```al
// Add to codeunit for debugging
Session.LogMessage(
    '0000CLE001', 
    StrSubstNo('Adjusting quantity: Order=%1, Current=%2, New=%3', 
        ProdOrder."No.", CurrentQty, NewQty),
    Verbosity::Normal,
    DataClassification::SystemMetadata
);
```

**Event Log Monitoring:**
```powershell
# Monitor BC events
Get-WinEvent -LogName Application | 
    Where-Object {$_.Source -like "*Dynamics*"} | 
    Select-Object TimeCreated, Message | 
    Format-Table -Wrap
```

### Debugging Scrap Recovery

**Add Breakpoints:**
```al
// In AdjustScrapOnCapLedgerEntries
procedure AdjustScrapOnCapLedgerEntries(ProdOrder: Record "Production Order"; QtyToAdjust: Decimal): Decimal
var
    CapLedgerEntry: Record "Capacity Ledger Entry";
begin
    // Set breakpoint here to trace scrap recovery
    CapLedgerEntry.SetRange("Order No.", ProdOrder."No.");
    CapLedgerEntry.SetFilter("Scrap Quantity", '>0');
    
    // Monitor QtyToAdjust changes in watch window
    if CapLedgerEntry.FindSet(true) then begin
        repeat
            // Watch: QtyToAdjust, CapLedgerEntry."Scrap Quantity"
            // Step through logic
        until (CapLedgerEntry.Next() = 0) or (QtyToAdjust = 0);
    end;
    exit(QtyToAdjust);
end;
```

### Transaction Tracing

**Enable SQL Profiler:**
```sql
-- Trace production order modifications
SELECT 
    session_id,
    start_time,
    command,
    database_id,
    text
FROM sys.dm_exec_requests
CROSS APPLY sys.dm_exec_sql_text(sql_handle)
WHERE text LIKE '%Production Order%'
    OR text LIKE '%Capacity Ledger%'
ORDER BY start_time DESC;
```

## Database Schema

### Key Fields Reference

**Production Order (Header):**
```
No.: Code[20]                    -- Primary key
Status: Option                   -- 0=Simulated, 1=Planned, 2=Firm Planned, 3=Released, 4=Finished
Quantity: Decimal                -- Total production quantity (includes safety)
Source No.: Code[20]             -- Item number
CLE Requested Quantity: Decimal  -- Customer order quantity (without safety)
Source Prod. Order No.: Code[20] -- Original order if split
```

**Prod. Order Line:**
```
Status: Option                   -- Matches header status
Prod. Order No.: Code[20]        -- Foreign key to header
Line No.: Integer                -- Line number (usually 10000)
Item No.: Code[20]               -- Item being produced
Quantity: Decimal                -- Line quantity (should match header)
Remaining Quantity: Decimal      -- Not yet posted as output
Finished Quantity: Decimal       -- Total posted output
CLE Safety Qty.: Decimal         -- Current safety buffer
CLE Safety Qty. (Base): Decimal  -- Safety in base UOM
Roll-up Item No.: Code[20]       -- Rollup item if applicable
```

**Capacity Ledger Entry:**
```
Entry No.: Integer               -- Primary key
Order Type: Option               -- 0=Production
Order No.: Code[20]              -- Production order number
Operation No.: Code[10]          -- Routing operation
Output Quantity: Decimal         -- Good output posted
Scrap Quantity: Decimal          -- Scrap posted
Scrap Code: Code[10]             -- Reason for scrap
Posting Date: Date               -- When posted
User ID: Code[50]                -- Who posted
Routing No.: Code[20]            -- Routing used
Finished: Boolean                -- Operation complete
```

### Relationships

```
Production Order 1───∞ Prod. Order Line
                   ↓
                   └───∞ Capacity Ledger Entry
                   ↓
                   └───∞ Item Ledger Entry
                   ↓
                   └───∞ Prod. Order Component
                   ↓
                   └───∞ Prod. Order Routing Line
```

## Escalation Procedures

### Level 1: First Line Support
**Handle:**
- User errors (wrong input)
- Process questions
- Standard error messages
- Authorization issues

**Escalate if:**
- Data corruption suspected
- System error messages
- Cannot resolve within 30 minutes
- Affects multiple users

### Level 2: Technical Support
**Handle:**
- Data integrity issues
- Complex corrections
- Performance problems
- Configuration issues

**Escalate if:**
- Code changes required
- Database corruption
- Security incident
- System-wide impact

### Level 3: Development Team
**Handle:**
- Code defects
- Design issues
- Major corrections
- Custom modifications

## Best Practices for IT Support

1. **Always Backup Before Corrections**
   - Manual database changes = always backup
   - Document before and after states
   - Test in sandbox environment first

2. **Use System Functions When Possible**
   - Prefer AL functions over direct SQL
   - Maintains business logic
   - Proper audit trails

3. **Document All Interventions**
   - What was changed
   - Why it was changed
   - Who requested it
   - Impact assessment

4. **Test in Sandbox First**
   - Never test fixes in production
   - Validate correction logic
   - Verify side effects

5. **Monitor After Changes**
   - Watch for related issues
   - Verify fix effective
   - Check performance impact

## Related Pages

- [[prod-order-overview]]
- [[prod-order-posting-staff]]
- [[prod-order-posting-manager]]
- [[prod-order-tasks-staff]]
