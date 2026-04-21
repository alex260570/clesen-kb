---
title: Purchase Receipt — IT Troubleshooting Guide
type: howto
tags: [purchasing, receiving, it-support, system-administration, debugging]
created: 2026-04-21
updated: 2026-04-21
sources: [purchase-receipt-it-troubleshooting-guide.md]
---

# Purchase Receipt — IT Troubleshooting Guide

Technical documentation for IT support staff and system administrators to diagnose and resolve issues in the Purchase Receipt system.

## System Architecture

### Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User Interface Layer                                        │
│ ┌─────────────────┐  ┌──────────────────┐                 │
│ │ Page 50036      │  │ Page 50023       │                 │
│ │ Purchase        │→ │ Purchase Receipt │                 │
│ │ Receipts List   │  │ Card             │                 │
│ └─────────────────┘  └────────┬─────────┘                 │
│                               │                             │
│                               ▼                             │
│                     ┌──────────────────┐                   │
│                     │ Page 50035       │                   │
│                     │ Receipt Subform  │                   │
│                     └────────┬─────────┘                   │
└─────────────────────────────┼─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│ Business Logic Layer                                        │
│ ┌───────────────────────────────────────────────┐          │
│ │ Codeunit 50011: CLE Purch. Receipt Management│          │
│ │  - SplitLineForHold()                        │          │
│ │  - GetNewLineNo()                            │          │
│ └────────┬──────────────────────────────────────┘          │
│          │                                                  │
│          ▼                                                  │
│ ┌───────────────────────────────────────────────┐          │
│ │ Standard BC Codeunit: Purch.-Post            │          │
│ │  - Standard purchase posting engine           │          │
│ │  - Calls item posting routines               │          │
│ └────────┬──────────────────────────────────────┘          │
└──────────┼──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│ Data Layer                                                  │
│ ┌────────────────┐  ┌─────────────────┐                   │
│ │ Purchase Header│  │ Purchase Line   │                   │
│ │ (Table 38)     │  │ (Table 39)      │                   │
│ └────────┬───────┘  └────────┬────────┘                   │
│          │                    │                             │
│          ▼                    ▼                             │
│ ┌────────────────────────────────────┐                    │
│ │ Purch. Rcpt. Header/Line           │                    │
│ │ (Posted documents)                  │                    │
│ └────────┬───────────────────────────┘                    │
│          │                                                  │
│          ▼                                                  │
│ ┌────────────────────────────────────┐                    │
│ │ Item Ledger Entry, Value Entry     │                    │
│ │ (Inventory transactions)            │                    │
│ └────────────────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### Quality Hold Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Action: Click "To Hold Location"                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Page 50052: Pick Quantity to Send Dialog                │
│    - User enters quantity and reason code                   │
│    - Validates quantity <= outstanding                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Codeunit 50011.SplitLineForHold()                       │
│    - Partial or Full Hold?                                  │
│    - Create new line or modify existing?                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Standard BC Posting (F9 pressed)                         │
│    - Create Item Ledger Entries (2 locations)               │
│    - Update inventory quantities                            │
│    - Generate Posted Purchase Receipt                       │
└─────────────────────────────────────────────────────────────┘
```

## Technical Components

### Custom Pages

| Page ID | Name | Purpose | Key Fields |
|---------|------|---------|-----------|
| **50023** | CLE Purchase Receipt | Receipt card interface | Vendor Shipment No. (REQUIRED), Posting Date, Receive, Invoice |
| **50035** | CLE Purchase Receipt Subform | Line details entry | Variant Code, Qty. to Receive, Bin Code |
| **50036** | CLE Purchase Receipts | Open orders list | Expected Receipt Date, CLE Cart Quantity |
| **50052** | CLE Pick Quantity to Send | Hold quantity dialog | Qty (max outstanding), Reason Code |

### Custom Codeunits

#### Codeunit 50011: CLE Purch. Receipt Management

**Key Procedures:**

- **SplitLineForHold()** — Main hold splitting logic
  - Accepts user input (quantity, reason code)
  - Decides: partial hold (create new line) or full hold (modify existing)
  - Re-releases document if it was released
  
- **GetNewLineNo()** — Calculates line number for new split line
  - If next line exists: midpoint between current and next
  - If no next line: current line + 10000

### Table Extensions

| Extension ID | Base Table | Fields Added | Purpose |
|--------------|-----------|-------------|---------|
| **50032** | Purchase Header (38) | CLE Cart Quantity | Displays total cart quantity (FlowField) |
| **50042** | Purchase Line (39) | CLE Cart Quantity | Line-level cart quantity |
| **50028** | Location (14) | CLE Location Type, CLE Quarantine Location | Links regular locations to quarantine |

## Common Issues and Solutions

### Issue 1: Posting Hangs or Times Out

**Symptoms:** User clicks Post → system appears frozen → no error message → timeout

**Possible Causes:**

**A. Large Number of Lines (> 100 lines)**
- **Solution:** Process in batches of 50 lines at a time
- Set "Qty. to Receive" = 0 on lines not being processed now
- Post first batch, then repeat for remaining lines

**B. Database Lock Contention**
- **Check:** Query system locks and blocking sessions
- **Solution:** Wait and retry during off-peak hours; contact DBA if persistent

**C. Insufficient Item Ledger Entry Posting Buffers**
- **Solution:** Run "Clear Item Register"; optimize item tracking if enabled

**D. Complex Item Tracking (Lot/Serial Numbers)**
- **Solution:** Verify tracking numbers are valid; pre-create tracking entries if needed

### Issue 2: "Vendor Shipment No. must have a value" Error

**Symptoms:** User presses F9 → error message → posting cancels

**Root Cause:** Required field validation in Post action (Page 50023)

**Solution:**
1. Have user enter value in **Vendor Shipment No.** field
2. If no packing slip available: Use PO number as temporary value
3. Field accepts any text format

**Prevention:** Make field more prominent in UI; add validation warning on card open

### Issue 3: Hold Location Not Working

**Symptoms:** "To Hold Location" button doesn't work OR error: "Location Code not valid"

**Diagnosis Steps:**

**Check 1: Quarantine Locations Exist**
```sql
SELECT Code, Name, [CLE Location Type]
FROM Location
WHERE [CLE Location Type] = 2;  -- Quarantine enum value
```

**Check 2: Primary Location Has Quarantine Assigned**
```sql
SELECT 
    Code as PrimaryLocation,
    Name,
    [CLE Quarantine Location]
FROM Location
WHERE Code = 'MAIN';
```

**Solution:**

1. **Create Quarantine Location** (if missing):
   - Open Locations page → New
   - Code: HOLD-01
   - Name: Quality Hold - Main Warehouse
   - CLE Location Type: Quarantine
   - Use As In-Transit: NO
   - Save

2. **Link to Primary Location**:
   - Open primary location (MAIN)
   - Set CLE Quarantine Location = HOLD-01
   - Save

3. **Test**: Create test PO with location = MAIN, try "To Hold Location"

### Issue 4: Line Splitting Creates Wrong Line Number

**Symptoms:** Split creates new line with duplicate line number OR lines appear out of order

**Root Cause:** GetNewLineNo() calculation failure or existing line number gaps

**Diagnosis:**
```sql
SELECT [Line No_], [No_], Quantity, [Location Code]
FROM [Purchase Line]
WHERE [Document Type] = 1 AND [Document No_] = 'PO-12345'
ORDER BY [Line No_];

-- Look for gaps, non-standard increments, or lines very close together
```

**Solution:**

**If Posting Failed (Line Still Editable):**
1. Note original line quantity
2. Manually create new line with safe line number (e.g., 99000)
3. Set all attributes matching original
4. Set quantity = amount to hold, location = HOLD-01, reason code
5. Modify original line quantity to remaining amount
6. Post

**Code-Level Fix** (for developers):
- Add safety check in GetNewLineNo()
- If next line is too close (< 20 apart), use safe increment instead of midpoint

### Issue 5: Items Not Showing in Quarantine Location

**Symptoms:** Receipt posted successfully → items should be in HOLD-01 → inventory shows zero

**Diagnosis:**

**Check 1: Was Line Actually Modified?**
```sql
SELECT l.[Line No_], l.Quantity, l.[Location Code]
FROM [Purch_ Rcpt_ Line] l
JOIN [Purch_ Rcpt_ Header] h ON l.[Document No_] = h.[No_]
WHERE h.[No_] = 'RCPT-12345';
```

**Check 2: Item Ledger Entry**
```sql
SELECT [Item No_], [Location Code], Quantity
FROM [Item Ledger Entry]
WHERE [Document No_] = 'RCPT-12345' AND [Entry Type] = 0; -- Purchase
```

**Possible Causes:**

- **Line not split before posting** → User didn't confirm hold dialog or location stayed as MAIN
  - **Fix:** Use Item Reclassification Journal to move items
  
- **Wrong quarantine location used** → System used different quarantine than expected
  - **Fix:** Verify location configuration

- **Location filter on query** → User looking at wrong location
  - **Fix:** Verify which location was actually used

### Issue 6: Permission Errors

**Symptoms:** "You do not have permission to access page 50023" OR cannot post receipt

**Diagnosis:**

**Check User Permissions:**
```sql
SELECT ups.[Role ID], ps.[Name]
FROM [User Permission Set] ups
JOIN [Permission Set] ps ON ups.[Role ID] = ps.[Role ID]
WHERE ups.[User ID] = 'JOHNDOE';
```

**Check Object Permissions:**
```sql
SELECT 
    p.[Role ID],
    p.[Object Type],
    p.[Object ID],
    p.[Execute Permission]
FROM Permission p
WHERE p.[Object ID] IN (50023, 50035, 50036, 50052);
```

**Solution:**

1. **Add to Existing Permission Set:**
   - Open Permission Sets
   - Select receiving staff permission set
   - Add permissions for Pages 50023, 50035, 50036, 50052
   - Add permission for Codeunit 50011
   - Add table permissions (Table 38, 39)

2. **Or Create New Permission Set** with required object permissions

## Data Integrity Checks

### Check 1: Purchase Line Quantity Consistency

**Purpose:** Verify line quantities match header totals

```sql
SELECT 
    h.[No_],
    h.Quantity as HeaderQuantity,
    SUM(l.Quantity) as LineQuantitySum,
    h.Quantity - SUM(l.Quantity) as Variance
FROM [Purchase Header] h
LEFT JOIN [Purchase Line] l ON h.[Document Type] = l.[Document Type]
    AND h.[No_] = l.[Document No_]
WHERE h.[Document Type] = 1 AND h.Status IN (1, 2)
GROUP BY h.[No_], h.Quantity
HAVING ABS(h.Quantity - SUM(l.Quantity)) > 0.01;
```

**Expected Result:** No rows (zero variance)

**If Found:** Investigate manual modifications; recalculate header; document cause

### Check 2: Quarantine Location Configuration

**Purpose:** Ensure all active locations have quarantine assigned

```sql
SELECT 
    l.Code,
    l.Name,
    l.[CLE Quarantine Location],
    CASE 
        WHEN l.[CLE Quarantine Location] = '' THEN 'MISSING'
        WHEN NOT EXISTS (
            SELECT 1 FROM Location q 
            WHERE q.Code = l.[CLE Quarantine Location]
              AND q.[CLE Location Type] = 2
        ) THEN 'INVALID'
        ELSE 'OK'
    END as Status
FROM Location l
WHERE l.[CLE Location Type] <> 2
  AND l.[Use As In-Transit] = 0;
```

**Expected Result:** All Status = 'OK'

### Check 3: Orphaned Hold Lines

**Purpose:** Find posted receipt lines in quarantine with no reason code

```sql
SELECT 
    prl.[Document No_],
    prl.[Line No_],
    prl.[No_] as ItemNo,
    prl.Quantity,
    prl.[Location Code],
    pl.[Return Reason Code]
FROM [Purch_ Rcpt_ Line] prl
LEFT JOIN [Purchase Line] pl ON prl.[Order No_] = pl.[Document No_]
WHERE prl.[Location Code] IN (
    SELECT Code FROM Location WHERE [CLE Location Type] = 2
)
AND (pl.[Return Reason Code] = '' OR pl.[Return Reason Code] IS NULL);
```

**Expected Result:** No rows

### Check 4: Receipt vs. Item Ledger Reconciliation

**Purpose:** Verify posted receipts match item ledger entries

```sql
WITH ReceiptSummary AS (
    SELECT [Document No_], SUM(Quantity) as ReceiptQty
    FROM [Purch_ Rcpt_ Line]
    WHERE Type = 2
    GROUP BY [Document No_]
),
LedgerSummary AS (
    SELECT [Document No_], SUM(Quantity) as LedgerQty
    FROM [Item Ledger Entry]
    WHERE [Entry Type] = 0 AND [Document Type] = 1
    GROUP BY [Document No_]
)
SELECT 
    r.[Document No_],
    r.ReceiptQty,
    l.LedgerQty,
    r.ReceiptQty - l.LedgerQty as Variance
FROM ReceiptSummary r
FULL OUTER JOIN LedgerSummary l ON r.[Document No_] = l.[Document No_]
WHERE ABS(r.ReceiptQty - l.LedgerQty) > 0.01;
```

**Expected Result:** No rows

**If Variance Found:** Critical — Posting engine failure. Escalate immediately; do not attempt manual fix.

## Error Message Reference

### User-Facing Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Vendor Shipment No. must have a value" | Required field blank | Enter packing slip number |
| "Quantity cannot be greater than Outstanding Quantity" | Over-receipt attempt | Verify count, adjust PO if needed |
| "Item Variant does not exist" | Variant not in system | Create variant or use valid value |
| "Bin Code not valid for Location" | Wrong bin/location combination | Clear bin or select valid bin |
| "Nothing to post" | All Qty. to Receive = 0 | Enter quantities to receive |
| "You must select a Reason Code" | Hold without reason | Select reason from dropdown |
| "Location Code not valid" | Quarantine location not configured | Configure quarantine location |

### System Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "The field Line No. contains a value that cannot be found" | Duplicate line number | Manually adjust line numbers |
| "Purchase Header does not exist" | Header deleted during posting | Investigate deletion; restore if needed |
| "You do not have permission to run this page" | Permission issue | Add page execute permission |
| "Another user has modified the record" | Concurrent editing | Refresh and retry |
| "Transaction cannot be completed - inconsistencies" | Data integrity issue | Check locks, retry, contact support |

## Manual Correction Procedures

### Procedure 1: Correct Wrong Location After Posting

**1. Verify Current Location:**
```sql
SELECT [Entry No_], [Item No_], [Location Code], Quantity
FROM [Item Ledger Entry]
WHERE [Document No_] = 'RCPT-12345' AND [Entry Type] = 0;
```

**2. Use Item Reclassification Journal:**
- Item No., Variant Code
- From Location Code: [wrong location]
- To Location Code: [correct location]
- Quantity: [amount to move]
- Document No.: Reference to receipt
- Post journal

**3. Verify Move:**
```sql
SELECT [Location Code], SUM([Remaining Quantity])
FROM [Item Ledger Entry]
WHERE [Item No_] = '10400'
GROUP BY [Location Code];
```

**4. Document:** Add note to original receipt; update correction log; notify manager

### Procedure 2: Add Missing Reason Code to Posted Hold

**1. Identify Problem Receipts:**
```sql
SELECT prl.[Document No_], prl.[Line No_], prl.[No_]
FROM [Purch_ Rcpt_ Line] prl
WHERE prl.[Location Code] = 'HOLD-01' AND prl.[Document No_] = 'RCPT-12345';
```

**2. Update Reason Code** (only if order not fully invoiced/closed):
```sql
UPDATE [Purchase Line]
SET [Return Reason Code] = 'DAMAGE'
WHERE [Document No_] = 'PO-12345' AND [Line No_] = 10000;
```

**3. If Already Closed:** Cannot modify; document in audit note with receipt number, items, reason, date discovered, corrective action taken

### Procedure 3: Reverse Incorrect Receipt

**⚠️ WARNING: Only for critical errors. Contact accounting first.**

**1. Check if Already Invoiced:**
```sql
SELECT vil.[Document No_]
FROM [Value Entry] vil
WHERE vil.[Document Type] = 2 AND vil.[Document No_] LIKE '%RCPT-12345%';
```

**2. If NOT Invoiced:** Use Copy Document
- Purchase Credit Memo → Functions → Copy Document
- Document Type: Posted Receipt
- Document No.: RCPT-12345
- Post credit memo to reverse

**3. If Already Invoiced:** More complex — create credit memo and new receipt; notify accounting

**4. Document Reversal:** Receipt number, reason, corrective action, approvals, date

## Performance Optimization

### Recommended Database Indexes

```sql
-- Purchase Line by Document and Outstanding
CREATE INDEX IX_PurchLine_Doc_Outstanding 
ON [Purchase Line] ([Document Type], [Document No_], [Outstanding Quantity])
INCLUDE ([No_], [Variant Code], [Location Code]);

-- Item Ledger Entry by Document for reconciliation
CREATE INDEX IX_ItemLedger_DocNo_EntryType
ON [Item Ledger Entry] ([Document No_], [Entry Type])
INCLUDE ([Item No_], [Location Code], Quantity);

-- Location by quarantine lookup
CREATE INDEX IX_Location_QuarantineLocation
ON Location ([CLE Quarantine Location])
INCLUDE (Code, Name, [CLE Location Type]);
```

### Optimization Strategies

**1. Reduce Line Processing**
- Skip validation when copying line attributes
- Only validate quantity after copy
- Use Insert(false) instead of Insert(true) when possible

**2. Batch Processing Configuration**
- Set MaxLinesPerBatch = 50 for large receipts
- Enable async posting if available
- Limit concurrent posts to 3

**3. FlowField Optimization**
- Cache CLE Cart Quantity calculations
- Recalculate only when line changes
- Avoid frequent page refreshes

**Target Performance:** < 5 seconds for receipts with < 20 lines

## Debugging Procedures

### Enable Debug Mode

**AL Code Debugging:**
1. Open VS Code with AL extension
2. Open app workspace
3. Press F5 to Start Debugging
4. Set breakpoints in:
   - Codeunit 50011, line 23 (SplitLineForHold entry)
   - Page 50023, line 96 (Post action)

**Watch Variables During Split:**
- QtyForNewLine: Decimal
- ReasonCode: Code[10]
- NewLineNo: Integer
- Location."CLE Quarantine Location": Code[10]
- DocumentWasReleased: Boolean

**Step Through Logic:**
- F10: Step over current line
- F11: Step into function
- Shift+F11: Step out of function
- F5: Continue to breakpoint

### Common Debug Scenarios

**Scenario 1: Split Not Creating New Line**
- Set breakpoints in partial split IF statement
- Watch: Is QtyForNewLine > 0 and < PurchLine.Quantity?
- Does GetNewLineNo() return valid number?
- Does Insert succeed or throw error?

**Scenario 2: Wrong Location Used**
- Set breakpoints at Location.Get() and Validate("Location Code")
- Watch: What is PurchLine."Location Code"?
- Does Location.Get succeed?
- What is Location."CLE Quarantine Location" value?

**Scenario 3: Posting Fails Silently**
- Set breakpoints at Page 50023 Post action trigger
- Watch: Does code reach PurchPost.Run?
- Is error caught in try-catch?
- Check Rec."Vendor Shipment No." value

## Escalation Guidelines

### When to Escalate to BC Partner

- Posting engine errors (standard BC codeunit failures)
- Database corruption suspected
- Performance issues after optimization attempts
- Need for core BC modification
- License or configuration issues

### Information to Provide

1. **Error Details:** Full error message, screenshot, timestamp
2. **Environment:** BC version, extension version, database size, server specs
3. **Reproduction Steps:** Exact sequence, test data, frequency
4. **SQL Diagnostics:** Data integrity check results, slow query analysis, blocking info
5. **Code Context:** AL code snippets, recent changes, custom modifications

## Related Pages

- [[purchase-receipt-overview]]
- [[purchase-receipt-staff]]
- [[purchase-receipt-manager]]
- [[purchase-worksheet]]
