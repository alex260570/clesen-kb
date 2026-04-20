# Purchase Receipt Process - IT Troubleshooting Guide

**Version:** 1.0  
**Last Updated:** February 13, 2026  
**Audience:** IT support staff, system administrators, developers

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Technical Components](#technical-components)
3. [Common Issues and Solutions](#common-issues-and-solutions)
4. [Data Integrity Checks](#data-integrity-checks)
5. [Error Message Reference](#error-message-reference)
6. [Manual Correction Procedures](#manual-correction-procedures)
7. [Performance Optimization](#performance-optimization)
8. [Debugging Procedures](#debugging-procedures)

---

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

### Data Flow - Quality Hold

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
│    Decision Point: Partial or Full Hold?                    │
└─────┬───────────────────────────────────────────────┬───────┘
      │                                               │
      │ Partial Hold                                  │ Full Hold
      ▼                                               ▼
┌──────────────────────────────┐         ┌──────────────────────┐
│ 4a. Create New Line Logic   │         │ 4b. Modify Line      │
│  - Calculate new line no.    │         │  - Change location   │
│  - Copy line attributes      │         │  - Apply reason code │
│  - Set qty = hold qty        │         │                      │
│  - Location = Quarantine     │         │                      │
│  - Reason code = selected    │         │                      │
│  - Reduce original line qty  │         │                      │
└──────────────────────────────┘         └──────────────────────┘
      │                                               │
      └───────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Standard BC Posting (F9 pressed)                         │
│    - Validate mandatory fields                              │
│    - Create Item Ledger Entries (2 locations)               │
│    - Update inventory quantities                            │
│    - Generate Posted Purchase Receipt                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Components

### Custom Pages

#### Page 50023: CLE Purchase Receipt

**Purpose:** Receipt card interface

**Key Fields:**
- `"Vendor Shipment No."` - REQUIRED for posting
- `"Posting Date"` - Defaults to WORKDATE
- `Receive` - Set TRUE before posting
- `Invoice` - Set FALSE (receipt only)

**Actions:**
- `Post` - Calls Codeunit "Purch.-Post"

**Source Code Location:**
```
app/3 Pages/Operations/50023.Page.CLE.PurchaseReceipt.al
```

**Critical Code Snippet:**
```al
trigger OnAction()
var
    PurchPost: Codeunit "Purch.-Post";
begin
    if Confirm('Do you want to post the document?') then begin
        Rec.Testfield(Rec."Vendor Shipment No.");  // Validation
        Rec.Invoice := false;                      // Receipt only
        Rec.Receive := true;                       // Enable receive
        PurchPost.Run(Rec);                        // Standard posting
    end;
end;
```

#### Page 50035: CLE Purchase Receipt Subform

**Purpose:** Line details entry

**Editable Fields:**
- `"Variant Code"` - Can change during receipt
- `"Qty. to Receive"` - Actual received quantity
- `"Bin Code"` - Destination bin

**Actions:**
- `"To Hold Location"` - Calls Codeunit 50011.SplitLineForHold

**Source Code Location:**
```
app/3 Pages/Operations/50035.Page.CLE.PurchaseReceiptSubform.al
```

#### Page 50036: CLE Purchase Receipts

**Purpose:** List of open purchase orders for receiving

**Source Table:** Purchase Header (Table 38)

**SourceTableView:**
```al
sorting("Expected Receipt Date") 
order(ascending) 
where("Document Type" = const(Order), 
      "Completely Received" = const(false))
```

**Custom FlowField Displayed:**
- `"CLE Cart Quantity"` - Sum of line cart quantities

**Source Code Location:**
```
app/3 Pages/Operations/50036.Page.CLE.PurchaseReceipts.al
```

#### Page 50052: CLE Pick Quantity to Send

**Purpose:** Dialog for quantity hold entry

**Variables:**
- `Qty: Decimal` - Amount to hold
- `MaxQty: Decimal` - Maximum allowable (outstanding qty)
- `PostingReasonCode: Code[10]` - Selected reason

**Validation:**
```al
if Qty > MaxQty then begin
    Message('The quantity cannot be greater than %1.', MaxQty);
    Qty := 0;
end;
```

**Source Code Location:**
```
app/3 Pages/Operations/Pag50052.CLEPickQuantitytoSend.al
```

### Custom Codeunits

#### Codeunit 50011: CLE Purch. Receipt Management

**Purpose:** Hold location splitting logic

**Key Procedure: SplitLineForHold()**

**Parameters:**
- `PurchLine: Record "Purchase Line"` - Line to split/modify

**Logic Flow:**

**Step 1: Get User Input**
```al
PageQtyToSend.SetDefaults(PurchLine."Outstanding Quantity");
if PageQtyToSend.RunModal() = Action::Ok then begin
    PageQtyToSend.GetValues(QtyForNewLine, ReasonCode);
```

**Step 2: Validate Reason Code**
```al
if ReasonCode = '' then
    Error('You must select a Reason Code.');
```

**Step 3: Reopen Document if Released**
```al
PurchHeader.Get(PurchLine."Document Type", PurchLine."Document No.");
if PurchHeader.Status = PurchHeader.Status::Released then begin
    DocumentWasReleased := true;
    ReleasePurchDocument.PerformManualReopen(PurchHeader);
end;
```

**Step 4: Split or Modify Line**

**Scenario A: Partial Hold**
```al
if (QtyForNewLine > 0) and (QtyForNewLine < PurchLine.Quantity) then begin
    NewLineNo := GetNewLineNo(PurchLine);
    NewPurchLine.Init();
    NewPurchLine."Document Type" := PurchLine."Document Type";
    NewPurchLine."Document No." := PurchLine."Document No.";
    NewPurchLine."Line No." := NewLineNo;
    NewPurchLine."Type" := PurchLine."Type";
    NewPurchLine.Validate("No.", PurchLine."No.");
    NewPurchLine.Insert(true);
    NewPurchLine.Validate(Quantity, QtyForNewLine);
    Location.Get(PurchLine."Location Code");
    NewPurchLine.Validate("Location Code", Location."CLE Quarantine Location");
    NewPurchLine."Return Reason Code" := ReasonCode;
    NewPurchLine.Modify(true);
    PurchLine.Validate(Quantity, PurchLine.Quantity - QtyForNewLine);
    PurchLine.Modify(true);
end;
```

**Scenario B: Full Hold**
```al
if QtyForNewLine = PurchLine.Quantity then begin
    Location.Get(PurchLine."Location Code");
    PurchLine.Validate("Location Code", Location."CLE Quarantine Location");
    PurchLine."Return Reason Code" := ReasonCode;
    PurchLine.Modify(true);
end;
```

**Step 5: Re-release if Needed**
```al
if DocumentWasReleased then
    ReleasePurchDocument.PerformManualRelease(PurchHeader);
```

**Source Code Location:**
```
app/5 Codeunits/Operations/50011.Codeunit.CLE.PurchReceiptManagement.al
```

**Helper Procedure: GetNewLineNo()**

**Purpose:** Calculate line number for new split line

**Logic:**
```al
NextPurchLine.SetRange("Document Type", PurchLine."Document Type");
NextPurchLine.SetRange("Document No.", PurchLine."Document No.");
NextPurchLine.Setfilter("Line No.", '>%1', PurchLine."Line No.");
if NextPurchLine.FindFirst() then
    NewLineNo := Round((NextPurchLine."Line No." + PurchLine."Line No." / 2), 1, '>')
else
    NewLineNo := PurchLine."Line No." + 10000;
```

**Result:**
- If next line exists: Midpoint between current and next
- If no next line: Current + 10000

### Table Extensions

#### TableExtension 50032: CLE Purchase Header

**Extends:** Purchase Header (Table 38)

**Custom Fields:**

```al
field(60053; "CLE Cart Quantity"; Decimal)
{
    Caption = 'Total Cart Quantity';
    Editable = false;
    FieldClass = FlowField;
    CalcFormula = sum("Purchase Line"."CLE Cart Quanity" 
        where("Document No." = field("No."), 
              "Document Type" = field("Document Type")));
}
```

**Purpose:** Displays total cart quantity for transportation planning

**Source Code Location:**
```
app/2 Table Extensions/Sales/50032.TableExtension.CLE.PurchHeader.al
```

#### TableExtension 50042: CLE Purchase Line

**Extends:** Purchase Line (Table 39)

**Custom Fields:**

```al
field(60204; "CLE Cart Quanity"; Decimal)
{
    Caption = 'Cart Quanity';
    DataClassification = CustomerContent;
    Editable = false;
}
```

**Source Code Location:**
```
app/2 Table Extensions/Purchasing/50042.Tab-Ext.CLE.PurchaseLine.al
```

#### TableExtension 50028: CLE Location

**Extends:** Location (Table 14)

**Custom Fields:**

```al
field(50001; "CLE Location Type"; Enum "CLE Location Type")
{
    Caption = 'Location Type';
    DataClassification = CustomerContent;
}

field(50002; "CLE Quarantine Location"; Code[10])
{
    Caption = 'Assigned Quarantine Location';
    DataClassification = CustomerContent;
    TableRelation = Location.Code 
        where("CLE Location Type" = CONST(Quarantine), 
              "Use As In-Transit" = CONST(false));
}
```

**Purpose:** 
- Links each regular location to its quarantine location
- Enables automatic routing of hold items

**Source Code Location:**
```
app/2 Table Extensions/Inventory/50028.Tab-Ext.CLE.CLELocation.al
```

---

## Common Issues and Solutions

### Issue 1: Posting Hangs or Times Out

**Symptoms:**
- User clicks Post (F9)
- System appears frozen
- No error message, just spinning cursor
- Eventually times out or requires force close

**Possible Causes:**

**A. Large Number of Lines**
```sql
-- Check line count for problem order
SELECT COUNT(*) as LineCount
FROM [Purchase Line]
WHERE [Document Type] = 1 -- Order
  AND [Document No_] = 'PO-12345';

-- If > 100 lines, this is likely the cause
```

**Solution:** 
- Process in batches: Receive 50 lines at a time
- Set "Qty. to Receive" = 0 on lines not receiving now
- Post, then repeat for next batch

**B. Database Lock Contention**
```sql
-- Check for blocking sessions
SELECT 
    blocking_session_id,
    session_id,
    wait_type,
    wait_time,
    wait_resource
FROM sys.dm_exec_requests
WHERE blocking_session_id <> 0;
```

**Solution:**
- Wait and retry during off-peak hours
- Contact DBA to investigate blocking
- May need to kill blocking session

**C. Insufficient Item Ledger Entry Posting Buffers**

**Solution:**
- Clear posting buffers: Run "Clear Item Register"
- Optimize item tracking (if enabled)
- Contact BC partner for performance tuning

**D. Complex Item Tracking (Lot/Serial Numbers)**

**Solution:**
- Verify tracking numbers are valid
- Pre-create tracking entries if needed
- Check for expired lots blocking posting

---

### Issue 2: "Vendor Shipment No. must have a value" Error

**Symptoms:**
- User presses F9 to post
- Error: "Vendor Shipment No. must have a value in Purchase Header"
- Posting cancels

**Root Cause:** 
Field validation in post action (Page 50023, line 96):
```al
Rec.Testfield(Rec."Vendor Shipment No.");
```

**Solution:**
- Have user enter ANY value in Vendor Shipment No.
- If no packing slip: Use PO number as temporary value
- Field is text, so any format acceptable

**Prevention:**
- Make field more prominent on UI
- Add validation warning when opening receipt card
- Consider default value (PO number?)

---

### Issue 3: Hold Location Not Working

**Symptoms:**
- User clicks "To Hold Location"
- Error: "Location Code not valid" or similar
- Line doesn't split or move to hold

**Diagnosis:**

**Check 1: Quarantine Location Exists**
```sql
SELECT Code, Name, [CLE Location Type]
FROM Location
WHERE [CLE Location Type] = 2; -- Quarantine enum value

-- If empty, no quarantine locations defined
```

**Check 2: Primary Location Has Quarantine Assigned**
```sql
SELECT 
    l.Code as PrimaryLocation,
    l.Name,
    l.[CLE Quarantine Location] as QuarantineLocation
FROM Location l
WHERE l.Code = 'MAIN'; -- Check the location being used

-- If Quarantine Location is blank, not configured
```

**Solution:**

**Create Quarantine Location:**
```al
1. Open Locations page
2. Create new location
3. Set:
   - Code: HOLD-01
   - Name: Quality Hold - Main Warehouse
   - CLE Location Type: Quarantine
   - Use As In-Transit: NO
4. Save
```

**Link to Primary Location:**
```al
1. Open primary location (e.g., MAIN)
2. Set CLE Quarantine Location = HOLD-01
3. Save
```

**Test:**
```al
1. Create test purchase order, location = MAIN
2. Try "To Hold Location"
3. Should now work and route to HOLD-01
```

---

### Issue 4: Line Splitting Creates Wrong Line Number

**Symptoms:**
- Split creates new line with line number that already exists
- Error: "Line No. 10000 already exists"
- Or: Lines appear out of order

**Root Cause:** 
GetNewLineNo() calculation issue or existing gaps in line numbers

**Diagnosis:**
```sql
-- Check line numbers for the order
SELECT [Line No_], [No_], Quantity, [Location Code]
FROM [Purchase Line]
WHERE [Document Type] = 1
  AND [Document No_] = 'PO-12345'
ORDER BY [Line No_];

-- Look for:
-- - Gaps in numbering
-- - Non-standard increments
-- - Lines very close together (e.g., 10000, 10001)
```

**Solution:**

**Manual Fix (if posting failed):**
```al
1. Note the original line quantity (e.g., 1000)
2. Note desired split (e.g., 850 main, 150 hold)
3. Manually create new line:
   - Use a safe line number (e.g., 99000)
   - Set all attributes matching original
   - Set quantity = 150
   - Set location = HOLD-01
   - Set reason code
4. Modify original line quantity to 850
5. Post
```

**Code Fix (developers):**
```al
// In GetNewLineNo(), add safety check:
NewLineNo := PurchLine."Line No." + 10000; // Safe default
NextPurchLine.SetRange("Document Type", PurchLine."Document Type");
NextPurchLine.SetRange("Document No.", PurchLine."Document No.");
NextPurchLine.Setfilter("Line No.", '>%1', PurchLine."Line No.");
if NextPurchLine.FindFirst() then begin
    if (NextPurchLine."Line No." - PurchLine."Line No.") > 20 then
        // Safe to use midpoint
        NewLineNo := Round((NextPurchLine."Line No." + PurchLine."Line No.") / 2, 1, '>')
    else
        // Lines too close, use safe increment
        NewLineNo := PurchLine."Line No." + 10000;
end;
```

---

### Issue 5: Items Not Showing in Quarantine Location

**Symptoms:**
- Receipt posted successfully
- Items supposed to go to HOLD-01
- Checking HOLD-01 inventory shows zero

**Diagnosis:**

**Check 1: Was Line Actually Modified?**
```sql
-- Check posted receipt line location
SELECT 
    l.[Document No_],
    l.[Line No_],
    l.[No_] as ItemNo,
    l.Quantity,
    l.[Location Code],
    h.[Posting Date]
FROM [Purch_ Rcpt_ Line] l
JOIN [Purch_ Rcpt_ Header] h ON l.[Document No_] = h.[No_]
WHERE h.[No_] = 'RCPT-12345'; -- Posted receipt number
```

**Check 2: Item Ledger Entry Location**
```sql
SELECT 
    [Item No_],
    [Location Code],
    Quantity,
    [Document No_],
    [Posting Date]
FROM [Item Ledger Entry]
WHERE [Document No_] = 'RCPT-12345'
  AND [Entry Type] = 0; -- Purchase
```

**Possible Causes:**

**A. Line Not Split Before Posting**
- Hold action didn't execute
- User didn't confirm dialog
- Location stayed as MAIN

**Solution:** Correct with transfer
```al
1. Open Item Reclassification Journal
2. From Location: MAIN
3. To Location: HOLD-01
4. Item and quantity
5. Post
```

**B. Wrong Quarantine Location Used**
- System used different quarantine location than expected
- Check configuration

**C. Location Filter on Inventory Query**
- User looking at wrong location
- Verify which location was actually used

---

### Issue 6: Permission Errors

**Symptoms:**
- User cannot open Purchase Receipts page
- Error: "You do not have permission to access page 50023"
- Or: Cannot post receipt

**Diagnosis:**

**Check User Permissions:**
```sql
-- Check permission sets for user
SELECT 
    ups.[Role ID],
    ps.[Name] as PermissionSetName
FROM [User Permission Set] ups
JOIN [Permission Set] ps ON ups.[Role ID] = ps.[Role ID]
WHERE ups.[User ID] = 'JOHNDOE';
```

**Check Object Permissions:**
```sql
-- Check if user has access to custom pages
SELECT 
    p.[Role ID],
    p.[Object Type],
    p.[Object ID],
    p.[Read Permission],
    p.[Insert Permission],
    p.[Modify Permission],
    p.[Execute Permission]
FROM Permission p
WHERE p.[Object ID] IN (50023, 50035, 50036, 50052) -- Custom pages
  AND p.[Role ID] IN (
      SELECT [Role ID] FROM [User Permission Set] 
      WHERE [User ID] = 'JOHNDOE'
  );
```

**Solution:**

**Add to Existing Permission Set:**
```al
1. Open Permission Sets
2. Select the receiving staff permission set
3. Add permissions:
   - Page 50023 (Execute)
   - Page 50035 (Execute)
   - Page 50036 (Execute)
   - Page 50052 (Execute)
   - Codeunit 50011 (Execute)
   - Table 38 Purchase Header (Read, Insert, Modify)
   - Table 39 Purchase Line (Read, Insert, Modify)
```

**Or Create New Permission Set:**
```xml
<PermissionSet xmlns="urn:microsoft-dynamics-nav/permissionset">
  <RoleID>RECV-STAFF</RoleID>
  <Name>Receiving Staff</Name>
  <Permission>
    <ObjectType>Page</ObjectType>
    <ObjectID>50023</ObjectID>
    <Execute>Yes</Execute>
  </Permission>
  <Permission>
    <ObjectType>Codeunit</ObjectType>
    <ObjectID>50011</ObjectID>
    <Execute>Yes</Execute>
  </Permission>
  <!-- Add remaining permissions -->
</PermissionSet>
```

---

## Data Integrity Checks

### Check 1: Purchase Line Quantity Consistency

**Purpose:** Verify header quantity matches sum of line quantities

**SQL Query:**
```sql
SELECT 
    h.[No_],
    h.Quantity as HeaderQuantity,
    SUM(l.Quantity) as LineQuantitySum,
    h.Quantity - SUM(l.Quantity) as Variance
FROM [Purchase Header] h
LEFT JOIN [Purchase Line] l ON h.[Document Type] = l.[Document Type]
    AND h.[No_] = l.[Document No_]
WHERE h.[Document Type] = 1 -- Order
  AND h.Status IN (1, 2) -- Released or Open
GROUP BY h.[No_], h.Quantity
HAVING ABS(h.Quantity - SUM(l.Quantity)) > 0.01;
```

**Expected Result:** No rows (zero variance)

**If Variance Found:**
- Investigate order: Manual modification?
- Recalculate header using standard function
- Document cause for audit

---

### Check 2: Quarantine Location Configuration

**Purpose:** Ensure all active locations have quarantine assigned

**SQL Query:**
```sql
SELECT 
    l.Code,
    l.Name,
    l.[CLE Location Type],
    l.[CLE Quarantine Location],
    CASE 
        WHEN l.[CLE Quarantine Location] = '' THEN 'MISSING'
        WHEN NOT EXISTS (
            SELECT 1 FROM Location q 
            WHERE q.Code = l.[CLE Quarantine Location]
              AND q.[CLE Location Type] = 2 -- Quarantine
        ) THEN 'INVALID'
        ELSE 'OK'
    END as Status
FROM Location l
WHERE l.[CLE Location Type] <> 2 -- Not itself a quarantine location
  AND l.[Use As In-Transit] = 0; -- Not in-transit
```

**Expected Result:** All Status = 'OK'

**If MISSING or INVALID:**
- Configure missing quarantine locations
- Verify referenced quarantine locations exist
- Update configuration

---

### Check 3: Orphaned Hold Lines

**Purpose:** Find posted receipt lines in quarantine with no reason code

**SQL Query:**
```sql
SELECT 
    prl.[Document No_],
    prl.[Line No_],
    prl.[No_] as ItemNo,
    i.Description,
    prl.Quantity,
    prl.[Location Code],
    prh.[Posting Date],
    pl.[Return Reason Code]
FROM [Purch_ Rcpt_ Line] prl
JOIN [Purch_ Rcpt_ Header] prh ON prl.[Document No_] = prh.[No_]
JOIN Item i ON prl.[No_] = i.[No_]
LEFT JOIN [Purchase Line] pl ON prh.[Order No_] = pl.[Document No_]
    AND prl.[Line No_] = pl.[Line No_]
WHERE prl.[Location Code] IN (
    SELECT Code FROM Location WHERE [CLE Location Type] = 2
)
AND (pl.[Return Reason Code] = '' OR pl.[Return Reason Code] IS NULL);
```

**Expected Result:** No rows

**If Found:**
- Data entry error during hold process
- Manually add reason codes for tracking
- Review training with staff

---

### Check 4: Receipt vs. Item Ledger Reconciliation

**Purpose:** Verify posted receipts match item ledger entries

**SQL Query:**
```sql
-- Group by document
WITH ReceiptSummary AS (
    SELECT 
        [Document No_],
        SUM(Quantity) as ReceiptQty
    FROM [Purch_ Rcpt_ Line]
    WHERE Type = 2 -- Item
    GROUP BY [Document No_]
),
LedgerSummary AS (
    SELECT 
        [Document No_],
        SUM(Quantity) as LedgerQty
    FROM [Item Ledger Entry]
    WHERE [Entry Type] = 0 -- Purchase
      AND [Document Type] = 1 -- Purchase Receipt
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

**Expected Result:** No rows (zero variance)

**If Variance:**
- Critical: Posting engine failure
- Escalate to BC partner immediately
- Do not attempt manual fix
- Restore from backup if recent

---

## Error Message Reference

### User-Facing Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "Vendor Shipment No. must have a value" | Required field blank | Enter packing slip number |
| "Quantity cannot be greater than Outstanding Quantity" | Over-receipt attempt | Verify count, adjust PO if needed |
| "Item Variant does not exist" | Variant not in system | Create variant or change to valid value |
| "Bin Code not valid for Location" | Wrong bin/location combo | Clear bin or select valid bin |
| "Nothing to post" | All Qty. to Receive = 0 | Enter quantities to receive |
| "You must select a Reason Code" | Hold without reason | Select reason from dropdown |
| "Location Code not valid" | Quarantine location not configured | Configure quarantine location |

### System Errors

| Error Message | Cause | Solution |
|---------------|-------|----------|
| "The field Line No. of table Purchase Line contains a value (10000) that cannot be found" | Duplicate line number | Manually adjust line numbers |
| "The Purchase Header does not exist. Identification fields and values: Document Type='Order',No.='PO-12345'" | Header deleted during posting | Investigate deletion, restore if needed |
| "You do not have permission to run this page" | Permission issue | Add page execute permission |
| "Another user has modified the record" | Concurrent editing | Refresh and retry |
| "The transaction cannot be completed because it will cause inconsistencies" | Data integrity issue | Check locks, retry, contact support |

### Debug Errors (Event Log)

| Error | Investigation |
|-------|---------------|
| "NavNCLDialogHandler: Error on page 50052" | Issue with hold quantity dialog | Check page triggers, validation code |
| "Item Ledger Entry posting failed" | Inventory posting issue | Check item setup, tracking, costing |
| "Codeunit 50011 execution error" | Hold split logic failure | Review codeunit code, check parameters |

---

## Manual Correction Procedures

### Procedure 1: Correct Wrong Location After Posting

**Scenario:** Items posted to wrong location, need to move

**Steps:**

**1. Verify Current Location**
```sql
SELECT 
    [Entry No_],
    [Item No_],
    [Location Code],
    Quantity,
    [Remaining Quantity]
FROM [Item Ledger Entry]
WHERE [Document No_] = 'RCPT-12345'
  AND [Entry Type] = 0; -- Purchase
```

**2. Use Item Reclassification Journal**
```al
1. Open Item Reclassification Journal
2. For each item:
   - Item No.: [from query]
   - Variant Code: [if applicable]
   - From Location Code: [wrong location]
   - To Location Code: [correct location]
   - Quantity: [amount to move]
   - Document No.: Reference to receipt
   - Posting Date: Today or receipt date
3. Post journal
```

**3. Verify Move**
```sql
SELECT 
    [Item No_],
    [Location Code],
    SUM([Remaining Quantity]) as Inventory
FROM [Item Ledger Entry]
WHERE [Item No_] = '10400'
GROUP BY [Item No_], [Location Code];
```

**4. Document**
- Add note to original receipt
- Update correction log
- Notify manager

---

### Procedure 2: Add Missing Reason Code to Posted Hold

**Scenario:** Item posted to hold location but no reason code

**Steps:**

**1. Identify Problem Receipts**
```sql
SELECT 
    prl.[Document No_],
    prl.[Line No_],
    prl.[No_] as ItemNo,
    prl.Quantity,
    prl.[Location Code]
FROM [Purch_ Rcpt_ Line] prl
WHERE prl.[Location Code] = 'HOLD-01'
  AND prl.[Document No_] = 'RCPT-12345';
```

**2. Find Original Purchase Line**
```sql
SELECT 
    pl.[Document No_],
    pl.[Line No_],
    pl.[Return Reason Code]
FROM [Purchase Line] pl
JOIN [Purch_ Rcpt_ Line] prl ON prl.[Order No_] = pl.[Document No_]
WHERE prl.[Document No_] = 'RCPT-12345';
```

**3. Update Reason Code (if still editable)**
```sql
-- Only if order not fully invoiced/closed
UPDATE [Purchase Line]
SET [Return Reason Code] = 'DAMAGE' -- or appropriate code
WHERE [Document No_] = 'PO-12345'
  AND [Line No_] = 10000;
```

**4. If Already Closed - Create Audit Note**
```al
-- Cannot modify closed transactions
-- Document in notes/log:
1. Receipt number
2. Items affected
3. Actual reason (from investigation)
4. Date discovered
5. Corrective action taken (if any)
```

---

### Procedure 3: Reverse Incorrect Receipt

**Scenario:** Receipt posted completely wrong, need to reverse

**⚠️ WARNING: Only use for critical errors. Contact accounting first.**

**Steps:**

**1. Verify Receipt**
```sql
SELECT 
    h.[No_],
    h.[Posting Date],
    h.[Buy-from Vendor No_],
    h.[Order No_]
FROM [Purch_ Rcpt_ Header] h
WHERE h.[No_] = 'RCPT-12345';
```

**2. Check if Already Invoiced**
```sql
SELECT 
    vil.[Document No_] as InvoiceNo,
    vil.[Receipt No_],
    vil.Quantity
FROM [Value Entry] vil
WHERE vil.[Document Type] = 2 -- Purchase Invoice
  AND vil.[Document No_] LIKE '%' + 'RCPT-12345' + '%';
```

**3. If NOT Invoiced - Use Copy Document**
```al
1. Open Purchase Credit Memo
2. Actions → Functions → Copy Document
3. Document Type: Posted Receipt
4. Document No.: RCPT-12345
5. Include Header: YES
6. Recalculate Lines: YES
7. OK
8. Review credit memo created
9. Post to reverse
```

**4. If Already Invoiced**
```al
-- More complex - requires credit memo and new receipt
1. Create Purchase Credit Memo
2. Copy from Posted Invoice
3. Post credit memo
4. Create new Purchase Receipt with correct data
5. Post new receipt
6. Notify accounting of correction
```

**5. Document Reversal**
- Original receipt number
- Reason for reversal
- Corrective action taken
- Approval signatures
- Date completed

---

## Performance Optimization

### Monitoring Posting Performance

**Metric:** Time from Post button click to completion

**Target:** < 5 seconds for receipts with < 20 lines

**Query - Slow Postings:**
```sql
-- Enable SQL Query Store first
SELECT 
    qs.query_id,
    qt.query_sql_text,
    rs.avg_duration / 1000.0 as avg_duration_ms,
    rs.execution_count
FROM sys.query_store_query qs
JOIN sys.query_store_query_text qt ON qs.query_text_id = qt.query_text_id
JOIN sys.query_store_plan qsp ON qs.query_id = qsp.query_id
JOIN sys.query_store_runtime_stats rs ON qsp.plan_id = rs.plan_id
WHERE qt.query_sql_text LIKE '%Purchase Line%'
  AND qt.query_sql_text LIKE '%Item Ledger Entry%'
  AND rs.avg_duration > 5000000 -- 5 seconds
ORDER BY rs.avg_duration DESC;
```

### Optimization Strategies

**1. Database Indexing**

**Recommended Indexes:**
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

**2. Reduce Line Processing**

**In SplitLineForHold, optimize:**
```al
// Current: Validates entire line
NewPurchLine.Validate("No.", PurchLine."No.");
NewPurchLine.Insert(true);

// Optimize: Skip validation when copying
NewPurchLine."No." := PurchLine."No.";
NewPurchLine."Variant Code" := PurchLine."Variant Code";
NewPurchLine."Location Code" := Location."CLE Quarantine Location";
// ... copy other fields directly
NewPurchLine.Insert(false); // Skip validation
NewPurchLine.Validate(Quantity, QtyForNewLine); // Only validate quantity
NewPurchLine.Modify(true);
```

**3. Batch Processing Configuration**

**Business Central Settings:**
```json
{
  "ItemTracking": {
    "MaxLinesPerBatch": 50,
    "EnableAsyncPosting": true
  },
  "Posting": {
    "MaxConcurrentPosts": 3,
    "TimeoutSeconds": 300
  }
}
```

**4. FlowField Optimization**

**Issue:** CLE Cart Quantity recalculates on every page load

**Optimize:**
```al
// Add to table trigger
trigger OnAfterModify()
begin
    // Calculate once on line change instead of every page refresh
    if (xRec."CLE Cart Quanity" <> Rec."CLE Cart Quanity") then
        CalcFields("CLE Cart Quantity");
end;
```

---

## Debugging Procedures

### Enable Debug Mode

**AL Code Debugging:**

**1. Attach Debugger**
```
1. Open VS Code with AL extension
2. Open workspace with app code
3. Press F5 (Start Debugging)
4. Select BC environment
5. Set breakpoints in:
   - Codeunit 50011, line 23 (SplitLineForHold entry)
   - Page 50023, line 96 (Post action)
```

**2. Debug Session Variables**

**Watch these variables during split:**
```al
QtyForNewLine: Decimal
ReasonCode: Code[10]
NewLineNo: Integer
Location."CLE Quarantine Location": Code[10]
DocumentWasReleased: Boolean
```

**3. Step Through Logic**
```
F10: Step over current line
F11: Step into function
Shift+F11: Step out of function
F5: Continue to next breakpoint
```

### Session Log Analysis

**Enable Telemetry:**
```json
{
  "applicationInsights": {
    "instrumentationKey": "YOUR-KEY",
    "logLevel": "Verbose"
  }
}
```

**Query Telemetry:**
```kql
traces
| where timestamp > ago(24h)
| where customDimensions.eventId in ("AL0000009", "AL0000CJO")
| where customDimensions.alObjectType == "CodeUnit"
| where customDimensions.alObjectId == "50011"
| project 
    timestamp,
    message,
    customDimensions.alObjectName,
    customDimensions.alLineNumber
| order by timestamp desc
```

### Common Debug Scenarios

**Scenario 1: Split Not Creating New Line**

**Set Breakpoints:**
- Line entering IF statement (partial split check)
- GetNewLineNo() function
- NewPurchLine.Insert(true)

**Watch:**
- Is QtyForNewLine > 0 and < PurchLine.Quantity? (Should be true)
- Does GetNewLineNo() return valid number?
- Does Insert succeed or throw error?

**Scenario 2: Wrong Location Used**

**Set Breakpoints:**
- Location.Get() call
- NewPurchLine.Validate("Location Code") call

**Watch:**
- What is PurchLine."Location Code"?
- Does Location.Get succeed?
- What is Location."CLE Quarantine Location" value?

**Scenario 3: Posting Fails Silently**

**Set Breakpoints:**
- Page 50023, Post action trigger
- Before PurchPost.Run(Rec) call

**Watch:**
- Does code reach PurchPost.Run?
- Is error caught in try-catch?
- Check Rec."Vendor Shipment No." value

---

## Support Escalation

### When to Escalate to BC Partner

- Posting engine errors (standard BC codeunit failures)
- Database corruption suspected
- Performance issues after optimization attempts
- Need for core BC modification
- License or configuration issues

### Information to Provide

**Package This Data:**

1. **Error Details**
   - Full error message text
   - Screenshot of error
   - Timestamp when occurred

2. **Environment**
   - BC version (e.g., BC23.4)
   - Extension version
   - Database size and server specs

3. **Reproduction Steps**
   - Exact sequence of actions
   - Test data if possible
   - Frequency (always, intermittent, specific conditions)

4. **SQL Diagnostics**
   - Results of data integrity checks
   - Slow query analysis
   - Blocking/locking information

5. **Code Context**
   - Relevant AL code snippets
   - Recent changes/deployments
   - Custom modifications involved

---

**Document Version:** 1.0  
**Created:** February 13, 2026  
**Last Review:** February 13, 2026  
**Next Review:** August 13, 2026  
**Owner:** IT Development Team

---

## Related documents

- [[purchase-receipt-process]]
- [[purchase-receipt-staff-guide]]
- [[purchase-receipt-manager-guide]]
