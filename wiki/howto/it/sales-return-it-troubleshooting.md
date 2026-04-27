---
title: Sales Return IT Troubleshooting
type: howto
tags: [sales, returns, it-troubleshooting, technical, business-central, codeunit, approval-workflow, database]
created: 2026-04-27
updated: 2026-04-27
sources: [sales-return-it-troubleshooting-guide.md]
---

# Sales Return IT Troubleshooting

Technical guide for IT support, system administrators, and developers managing the Sales Return system in Business Central.

---

## System Overview

The Sales Return system processes two distinct return types with different technical workflows:

### Same-Day Returns
- **Entry Point:** Loading Ticket (Page 50179)
- **Trigger:** `CreateSalesReturnOrderFromLoadingTicket()` action
- **Codeunit:** 50117 "CLE Create R-Order From Loadin"
- **Distinguishing Flag:** `CLE Same-Day Return = true`
- **Approval Status:** `"Same-Day Return"` enum value

### Previous-Day Returns
- **Entry Point:** Sales Return Order (Standard BC page)
- **Creation:** Manual or Copy Document
- **Distinguishing Flag:** `CLE Same-Day Return = false`
- **Approval Status:** Calculated based on salesperson credit limit

**Key Technical Characteristic:** The `CLE Same-Day Return` boolean field on Sales Header determines branching logic in approval processing, inventory handling, and posting workflows.

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SALES RETURN SYSTEM                      │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴──────────────┐
              ▼                              ▼
    ┏━━━━━━━━━━━━━━━━━┓          ┏━━━━━━━━━━━━━━━━━━━┓
    ┃  SAME-DAY PATH  ┃          ┃ PREVIOUS-DAY PATH ┃
    ┗━━━━━━━━━━━━━━━━━┛          ┗━━━━━━━━━━━━━━━━━━━┛
              │                              │
    ┌─────────┴─────────┐         ┌─────────┴──────────┐
    ▼                   ▼         ▼                    ▼
┌─────────┐      ┌──────────┐  ┌──────────┐    ┌──────────┐
│ Loading │      │ Return   │  │ Manual   │    │ Copy     │
│ Ticket  │──────│ Creation │  │ Entry    │    │ Document │
│ (50179) │      │ (50117)  │  │          │    │          │
└─────────┘      └──────────┘  └──────────┘    └──────────┘
                       │                  │            │
                       └──────────────────┴────────────┘
                                     │
                            ┌────────┴────────┐
                            ▼                 ▼
                    ┌──────────────┐  ┌──────────────┐
                    │   Approval   │  │  Validation  │
                    │   Workflow   │  │   Rules      │
                    │   (50037)    │  │   (50037)    │
                    └──────────────┘  └──────────────┘
                            │
                    ┌───────┴────────┐
                    ▼                ▼
            ┌─────────────┐  ┌─────────────┐
            │   Receipt   │  │   Invoice   │
            │   Posting   │  │   Posting   │
            └─────────────┘  └─────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  Inventory Journal   │
        │  (On-Site Disposal)  │
        │  Auto-Generation     │
        └──────────────────────┘
```

### Data Flow

**Same-Day Return:**
1. Posted Shipment → Temp Sales Shipment Line (filtered for inventory items)
2. User input (Page 50203) → Qty To Return + Return Reason Code
3. Codeunit 50117 → Create Sales Return Order Header with flags
4. Copy Document Mgt → Copy lines with application entries
5. Apply return reason codes → Set quarantine location
6. Approval workflow (Codeunit 50037) → Process based on `CLE Same-Day Return = true`
7. Receipt posting → Inventory movement to quarantine
8. Invoice posting (or zero-dollar if declined)

**Previous-Day Return:**
1. Manual creation or Copy Document
2. User sets return reason codes + inventory status
3. SetApprovalStatusInSalesHeader() → Calculate based on limits
4. Request approval → Create approval task
5. ProcessApproval() → Approve/Decline based on `CLE Same-Day Return = false`
6. Receipt posting → Inventory movement
7. Invoice posting → Credit memo generation

---

## Same-Day Return Process Flow

### Technical Sequence

```
User              Loading Ticket       Cod50117              Copy Doc Mgt        Cod50037
 |                     |                    |                      |                 |
 |──Click "Create"────>|                    |                      |                 |
 |                     |──Call CreateSalesReturnOrderFromLoadingTicket()             |
 |                     |──Get Posted Shipments from Ticket────────────────────────>|
 |                     |──Filter: Type=Inventory only                               |
 |                     |──Build TempShipmentLine                                    |
 |                     |──Show Page 50203 (Sales Shipment Lines)─────────────>      |
 |<────Enter Qty & Return Reasons────────────────────────────────────────────>     |
 |                     |──Validate: All lines have reason codes                     |
 |                     |──CreateSalesReturnOrderHeader()                            |
 |                     |    - Set CLE Same-Day Return = true                        |
 |                     |    - Set Status = "Same-Day Return"                        |
 |                     |──CopySalesLinesToDoc()                                     |
 |                     |──Apply Return Reason Codes                                 |
 |                     |──Set Location = Quarantine                                 |
 |<────Return Order Created──────────────────────────────────────────────────>     |
 |                     |                    |                      |                 |
[Later: User Posts Receipt]                |                      |                 |
 |──Post Receipt──────>|                    |                      |                 |
 |                     |──OnBeforeSalesReturnRcptPost event──────────────────────>  |
 |                     |──CheckReturnOrderApprovalStatusBeforePosting()             |
 |                     |    - Verify Status in allowed values                       |
 |                     |    - Check all lines have reason codes                     |
 |<────Receipt Posted────────────────────────────────────────────────────────>    |
 |                     |                    |                      |                 |
[Approver Processes]  |                    |                      |                 |
 |──Process Approval────────────────────────────────────────────────────────────>  |
 |                     |                    |                      |                 |
 |                     |                    |                      |    ProcessApproval()
 |                     |                    |                      |    IF CLE Same-Day Return:
 |                     |                    |                      |      - Check receipt status
 |                     |                    |                      |      - Approve: Release or Approved Inv. Posting awaiting
 |                     |                    |                      |      - Decline: Set prices to $0, status = Rejected Zero $
 |                     |                    |                      |                 |
 |<────Status Updated────────────────────────────────────────────────────────────> |
```

### Codeunit 50117 — Create R-Order From Loading

**Location:** `app/5 Codeunits/Picking/Cod50117.CLECreateROrderFromLoadin.al`

**Primary procedure:**
```al
procedure CreateSalesReturnOrderFromLoadingTicket(
    TicketHeader: Record "CLE Supermarket Picking Header")
```

**Logic flow:**
1. Query `Sales Shipment Header` filtered by `CLE Picking Ticket No.`
2. For each shipment, get `Sales Shipment Line` where Type = Item
3. Filter to only `Item.Type::Inventory` (exclude services)
4. Calculate `CLE Qty. To Return` = Quantity - Qty. Already Returned
5. Display Page 50203 for user input
6. Validate all lines with `CLE Qty. To Return > 0` have return reason codes
7. Create Sales Header:
   ```al
   SalesHeader."CLE Same-Day Return" := true;
   SalesHeader."CLE Sales Approval Status" := "Same-Day Return";
   SalesHeader."CLE Inventory Status" := Returned;
   ```
8. Call `CopyDocMgt.CopySalesLinesToDoc()` with temp lines
9. Apply return reason codes and set quarantine location:
   ```al
   if Location.Get(SalesLine."Location Code") then
       SalesLine."Location Code" := Location."CLE Quarantine Location";
   ```

**Critical validations:**
- All return lines must have return reason codes (enforced before creation)
- Return reason codes must be marked "CLE Eligible for Same-Day Return"
- Only inventory items are included (Type = Inventory)
- Cannot exceed shipped quantity

---

## Previous-Day Return Process Flow

### Technical Sequence

```
User              Sales Return Order    Cod50037              User Setup
 |                       |                  |                      |
 |──Create New Return───>|                  |                      |
 |──Copy Document or Manual Entry────────>  |                      |
 |──Enter Return Reason Codes───────────>   |                      |
 |──Set Inventory Status─────────────────>  |                      |
 |──Request Approval─────>|                  |                      |
 |                       |──SetApprovalStatusInSalesHeader()       |
 |                       |──GetSalespersonLimit()──────────────────>
 |                       |<──Credit Limit─────────────────────────|
 |                       |──CalcFields(Amount)                      |
 |                       |──IF Limit < 0: Status = Ready to Approve
 |                       |──ELSE IF Amount > Limit: Status = Approval Required
 |                       |──ELSE: Status = Ready to Approve        |
 |<──Status Updated──────|<─────────────────────────────────────────|
 |[Approver Reviews]     |                  |                      |
 |──Process Approval─────────────────────> |                      |
 |                       |──Check User Setup: CLE Cr.Request Approver = true
 |                       |──Check Amount vs. User's Approval Limit  |
 |<────Prompt Approve/Decline──────────────|                      |
 |──Select: Approve──────────────────────> |                      |
 |                       |──IF NOT CLE Same-Day Return:             |
 |                       |    Approve: Status = Approved Inv. Posting awaiting
 |                       |    Decline: Status = Rejected            |
 |<──Status Updated──────|<─────────────────────────────────────────|
 |──Post Receipt─────────>|                  |                      |
 |<──Receipt Posted──────|                  |                      |
```

### Codeunit 50037 — Product Credit Management

**Location:** `app/5 Codeunits/50037.Codeunit.CLE.ProductCreditManagement.al`

**Approval status calculation:**
```al
procedure SetApprovalStatusInSalesHeader(var SalesHeader: Record "Sales Header")
var
    Limit: Decimal;
begin
    // Skip if already in terminal status
    if SalesHeader."CLE Sales Approval Status" in [
        "Approved", "Rejected", "Approved Inv. Posting awaiting",
        "Released for Invoicing", "Approval requested", "Same-Day Return"] then
        exit;
    
    Limit := GetSalespersonLimit(SalesHeader."Salesperson Code");
    
    if Limit < 0 then
        // Unlimited approver
        SalesHeader."CLE Sales Approval Status" := "Ready to Approve"
    else begin
        SalesHeader.CalcFields(Amount);
        if SalesHeader.Amount > Limit then
            SalesHeader."CLE Sales Approval Status" := "Approval required"
        else
            SalesHeader."CLE Sales Approval Status" := "Ready to Approve";
    end;
    
    SalesHeader.Modify(true);
end;
```

**Approval processing for previous-day returns:**
```al
local procedure ProcessApproval(var SalesHeader: Record "Sales Header")
begin
    Selection := StrMenu('Approve,Decline', 1, 'Please choose');
    
    if not SalesHeader."CLE Same-Day Return" then begin
        // PREVIOUS-DAY RETURN LOGIC
        case Selection of
            1:  // Approve
                begin
                    if SalesHeader."Document Type" = "Credit Memo" then
                        SalesHeader."CLE Sales Approval Status" := "Released for Invoicing"
                    else
                        SalesHeader."CLE Sales Approval Status" := "Approved Inv. Posting awaiting";
                end;
            2:  // Decline
                SalesHeader."CLE Sales Approval Status" := Rejected;
        end;
    end;
end;
```

---

## Configuration Requirements

### Return Reason Codes

**Table:** Return Reason (Standard BC)
**Extension:** 50059 "CLE Return Reason"
**Setup location:** Search → Return Reasons

**Required field extension:**
```al
field(50000; "CLE Eligible for Same-Day Return"; Boolean)
{
    Caption = 'Eligible for Same-Day Return';
    DataClassification = CustomerContent;
}
```

**Configuration steps:**
1. Create return reason codes (Code field, Description)
2. For codes that should appear in same-day return picker:
   - Check **CLE Eligible for Same-Day Return**
3. All codes (regardless of flag) appear for previous-day returns

**Recommended codes:**

| Code | Description | Eligible for Same-Day |
|------|-------------|----------------------|
| DAMAGED-TRANSIT | Damaged during shipping/handling | ✓ Yes |
| QUALITY-ISSUE | Quality problem discovered | ✓ Yes |
| WRONG-ITEM | Incorrect item shipped | ✓ Yes |
| SHORT-SHELF | Short shelf life remaining | ✓ Yes |
| CUSTOMER-DAMAGE | Damaged by customer after delivery | No |
| NO-LONGER-NEEDED | Customer no longer needs item | No |
| LATE-DELIVERY | Delivered too late | No |

### Location Setup

**Table:** Location (Standard BC)
**Extension:** Must have "CLE Quarantine Location" field
**Setup location:** Search → Locations → Select location

**Required configuration:**
1. Open main warehouse location (e.g., MAIN)
2. Navigate to **CLE Quarantine Location** field
3. Select the location code designated for quarantine (e.g., QUARANTINE)
4. Save

**Field definition:**
```al
field(50XXX; "CLE Quarantine Location"; Code[10])
{
    Caption = 'Quarantine Location';
    TableRelation = Location.Code;
}
```

**Behavior:**
- When same-day return is created, items auto-route to this location
- If field is blank, items go to original location (not recommended)

### User Setup for Approvals

**Table:** User Setup (Standard BC)
**Setup location:** Search → User Setup

**Required fields:**
```al
field(50XXX; "CLE Cr.Request Approver"; Boolean)
{
    Caption = 'Credit Request Approver';
}

field(50XXX; "CLE Credit Request Limit"; Decimal)
{
    Caption = 'Credit Request Limit';
}

field(50XXX; "CLE Unlimited Credit Request"; Boolean)
{
    Caption = 'Unlimited Credit Request';
}
```

**Configuration per user:**

| User Type | Approver | Credit Limit | Unlimited |
|-----------|----------|--------------|-----------|
| **Warehouse Staff** | No | 0 | No |
| **Sales Rep** | No | $500 | No |
| **Sales Manager** | Yes | $5,000 | No |
| **VP Sales** | Yes | -1 | Yes |
| **IT Admin** | Yes | -1 | Yes |

**Limit interpretation:**
- **-1 (or Unlimited = true):** Can approve any amount
- **$0:** Cannot self-approve; all returns require approval
- **> $0:** Can self-approve up to limit; over limit requires approval

### Sales & Receivables Setup

**Table:** Sales & Receivables Setup
**Setup location:** Search → Sales & Receivables Setup

**Required number series:**
- **Return Order Nos.** — Must be configured (standard BC)

**Optional CLE fields:**
- **Return Journal Template** — For on-site disposal auto-journaling
- **Return Journal Batch** — Batch name for auto-created entries

---

## Database Schema and Fields

### Sales Header Extensions

**Extension:** 50021 "Tab-Ext.CLE.SalesHeader2"
**Location:** `app/2 Table Extensions/Sales/50021.Tab-Ext.CLE.SalesHeader2.al`

**Critical fields:**

| Field No. | Field Name | Type | Purpose |
|-----------|------------|------|---------|
| 50001 | CLE Same-Day Return | Boolean | Distinguishes return type; drives approval logic |
| 50002 | CLE Sales Approval Status | Enum 60116 | Current approval state |
| 50003 | CLE Inventory Status | Enum 60118 | Returned vs On-Site Disposal |
| 50010 | CLE Return-from Code | Code[10] | Original ship-to code |
| 50011 | CLE Return-from Name | Text[100] | Original ship-to name |
| 50012 | CLE Return-from Address | Text[100] | Original ship-to address |
| 50013 | CLE Return-from Address 2 | Text[50] | Additional address |
| 50014 | CLE Return-from City | Text[30] | City |
| 50015 | CLE Return-from Post Code | Code[20] | Postal code |
| 50016 | CLE Return-from Country Code | Code[10] | Country/region |
| 50017 | CLE Return-from State | Code[30] | State/county |

**Enum 60116: CLE Sales Doc. Approval Status**
```al
enum 60116 "CLE Sales Doc. Appr. Status"
{
    value(0; " ") { }
    value(1; "Approval required") { }
    value(2; "Approval requested") { }
    value(3; Approved) { }
    value(4; Rejected) { }
    value(5; "Ready to Approve") { }
    value(6; "Approved Inv. Posting awaiting") { }
    value(7; "Released for Invoicing") { }
    value(8; "Same-Day Return") { }  // ← Same-day only
    value(9; "Rejected - Post Zero $ Invoice") { }  // ← Same-day decline
}
```

**Enum 60118: CLE Inventory Return Status**
```al
enum 60118 "CLE Inventory Return Status"
{
    value(0; " ") { Caption = ' '; }
    value(1; Returned) { Caption = 'Product Return'; }
    value(2; "On-Site Disposal") { Caption = 'On-Site Disposal'; }
}
```

### Sales Line Extensions

**Extension:** 50015 "Tab-ExtCLE.SalesShipmentLine"

**Fields added to Sales Shipment Line:**

| Field No. | Field Name | Type | Purpose |
|-----------|------------|------|---------|
| 50000 | CLE Qty. To Return | Decimal | User input for quantity |
| 50001 | CLE Return Reason Code | Code[10] | Selected return reason |

---

## Code Objects Reference

### Primary Codeunits

| Object ID | Name | Purpose | Key Procedures |
|-----------|------|---------|----------------|
| **50037** | CLE Product Credit Management | Approval workflow, validation | `ProcessApproval()`, `SetApprovalStatusInSalesHeader()`, `CheckApprovalStatusBeforeCreditPosting()` |
| **50117** | CLE Create R-Order From Loadin | Same-day return creation | `CreateSalesReturnOrderFromLoadingTicket()`, `CreateSalesReturnOrderHeader()` |

### Pages

| Object ID | Name | Purpose | Used By |
|-----------|------|---------|---------|
| **50179** | CLE Loading Ticket | Loading ticket management | Warehouse staff (same-day entry point) |
| **50203** | CLE Sales Shipment Lines | Item selection for same-day returns | Called by Codeunit 50117 |
| **60115** | PageExtension CLE Sales Return Order | Extends standard return order page | Previous-day returns |
| **60618** | PageExtension CLE Return Reasons | Adds same-day eligible flag | Return reason setup |

### Event Subscribers

**Codeunit 50037 subscribers:**

1. **OnBeforeSalesReturnRcptPost** (Standard BC posting event)
   - Validates approval status before receipt posting
   - Checks return reason codes on all lines

2. **OnAfterCopySalesShptLinesToDoc** (Copy Document Mgt event)
   - Auto-captures return-from address from original shipment
   - Populates CLE Return-from fields

3. **OnAfterSalesReturnRcptHeaderInsert** (Post-receipt event)
   - Triggers journal creation for on-site disposal
   - Calls `CreateJournalAfterReturnPosting()`

### Inventory Journal Auto-Generation

**Procedure:** `CreateJournalAfterReturnPosting()`
**Location:** Codeunit 50037

**Logic:**
```al
procedure CreateJournalAfterReturnPosting(var SalesHeader: Record "Sales Header"; RetRcpHdrNo: Code[20])
var
    ItemJournal: Record "Item Journal Line";
    ReturnReceiptLine: Record "Return Receipt Line";
begin
    // Only for On-Site Disposal
    if SalesHeader."CLE Inventory Status" <> "On-Site Disposal" then
        exit;
    
    // Get return receipt lines
    ReturnReceiptLine.SetRange("Document No.", RetRcpHdrNo);
    if ReturnReceiptLine.FindSet() then
        repeat
            // Create negative adjustment for each inventory item
            ItemJournal.Init();
            ItemJournal."Entry Type" := "Negative Adjmt.";
            ItemJournal."Item No." := ReturnReceiptLine."No.";
            ItemJournal."Location Code" := ReturnReceiptLine."Location Code";
            ItemJournal.Validate(Quantity, ReturnReceiptLine.Quantity);
            ItemJournal.Insert(true);
        until ReturnReceiptLine.Next() = 0;
    
    // Auto-post journal
    Codeunit.Run(Codeunit::"Item Jnl.-Post Batch", ItemJournal);
end;
```

**Trigger:** OnAfterReturnRcptHeaderInsert event
**Effect:** Inventory is automatically removed (negative adjustment) for disposed items

---

## Approval Workflow Decision Tree

```
┌─────────────────────────────────────┐
│ Return Order Created                │
└────────────┬────────────────────────┘
             │
     ┌───────┴────────┐
     │                │
     ▼                ▼
┌──────────┐    ┌────────────────┐
│ Same-Day │    │ Previous-Day   │
│ Return?  │    │ Return?        │
│ (true)   │    │ (false)        │
└────┬─────┘    └───────┬────────┘
     │                  │
     ▼                  ▼
┌──────────────┐  ┌──────────────────────┐
│ Status =     │  │ Calculate Status     │
│ "Same-Day    │  │ Based on Limit       │
│  Return"     │  └────────┬─────────────┘
└────┬─────────┘           │
     │            ┌─────────┴──────────┐
     │            ▼                    ▼
     │    ┌──────────────┐     ┌─────────────┐
     │    │ Amount ≤     │     │ Amount >    │
     │    │ Limit        │     │ Limit       │
     │    └──────┬───────┘     └──────┬──────┘
     │           │                    │
     │           ▼                    ▼
     │    ┌──────────────┐     ┌─────────────┐
     │    │ Ready to     │     │ Approval    │
     │    │ Approve      │     │ Required    │
     │    └──────────────┘     └─────────────┘
     │
     └────────────────┐
                      │
                      ▼
              ┌───────────────┐
              │ User Posts    │
              │ Receipt       │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────────┐
              │ Approver Reviews  │
              │ ProcessApproval() │
              └────────┬──────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
┌────────────────┐         ┌─────────────────┐
│ APPROVE        │         │ DECLINE         │
└────────┬───────┘         └────────┬────────┘
         │                          │
         ▼                          ▼
If Same-Day:              If Same-Day:
┌────────────────┐        ┌──────────────────┐
│ Check Receipt  │        │ Set All Prices   │
│ Status         │        │ to $0            │
└────┬───────────┘        └────────┬─────────┘
     │                             │
     ▼                             ▼
All Received?             ┌──────────────────┐
┌────────────────┐        │ Status =         │
│ Yes: Released  │        │ "Rejected -      │
│ for Invoicing  │        │  Post Zero $"    │
└────────────────┘        └──────────────────┘
┌────────────────┐
│ No: Approved   │
│ Inv. Posting   │
│ awaiting       │
└────────────────┘

If Previous-Day:          If Previous-Day:
┌────────────────┐        ┌──────────────────┐
│ Status =       │        │ Status =         │
│ "Approved Inv. │        │ Rejected         │
│  Posting       │        └──────────────────┘
│  awaiting"     │
└────────────────┘
```

---

## Common IT Issues and Resolutions

### Issue 1: Same-day return button not appearing

**Symptoms:**
- "Create Same-Day Return Order" action missing from loading ticket
- User reports cannot create same-day returns

**Root causes:**
1. User lacks permissions to create return orders
2. Page 50179 not published correctly
3. Page customization hiding action

**Resolution:**
1. Check object existence and user permissions
2. Republish app if needed: `Publish-NAVApp -ServerInstance BC220 -Name "Clesen Horticulture"`
3. Verify user has:
   - TableData "Sales Header" = RIMD
   - Permission set "CLE CLESEN HORTICULTURE" assigned

### Issue 2: Return reason codes not appearing

**Symptoms:**
- Dropdown shows no values when creating same-day return
- Error: "No return reasons available"

**Root causes:**
1. No return reasons marked "Eligible for Same-Day Return"
2. Table relation filter not working
3. No return reasons exist in database

**Resolution:**
1. Verify return reasons exist and are configured:
   - Search → Return Reasons
   - Check **CLE Eligible for Same-Day Return** for appropriate codes
   - Minimum 2-3 codes recommended (DAMAGED-TRANSIT, QUALITY-ISSUE, WRONG-ITEM)

### Issue 3: Items not routing to quarantine location

**Symptoms:**
- Same-day return items go to main warehouse instead of quarantine
- Cannot find returned items for inspection

**Root causes:**
1. Location missing "CLE Quarantine Location" field value
2. Code issue: Field not properly applied during creation
3. User cannot modify location on sales lines

**Resolution:**
1. Search → Locations
2. Open primary warehouse location (e.g., MAIN)
3. Set **CLE Quarantine Location** = [your quarantine location code]
4. If quarantine location doesn't exist:
   - Create new location (Code = "QUARANTINE", Name = "Quarantine Inspection")
   - Configure as needed
   - Return to main location and set field

### Issue 4: Approval status stuck in "Approval Required"

**Symptoms:**
- Return order cannot be posted
- Status never changes from "Approval Required"
- No approver notifications sent

**Root causes:**
1. No users have "CLE Cr.Request Approver" flag
2. All approvers' limits are lower than return amount
3. Approval request not properly triggered

**Resolution:**
1. Search → User Setup
2. For manager users:
   - Check **CLE Cr.Request Approver**
   - Set **CLE Credit Request Limit** = appropriate amount (e.g., $10,000)
   - Or check **CLE Unlimited Credit Request** for unlimited approval
3. Ensure at least one user has unlimited or very high limit for escalations

### Issue 5: Zero-dollar posting fails after same-day decline

**Symptoms:**
- Declined same-day return cannot be posted
- Error: "Amount must not be zero"
- Status = "Rejected - Post Zero $ Invoice"

**Root causes:**
1. Standard BC validation blocking zero-amount posting
2. Unit prices not actually set to $0
3. User lacks permission to post zero-dollar transactions

**Resolution:**
1. Open the return order in question
2. Manually verify all lines show **Unit Price = 0**
3. If not $0:
   - Run ProcessApproval() again with Decline option
   - Or manually set each line's Unit Price to 0
4. Ensure status = "Rejected - Post Zero $ Invoice"
5. Post → Invoice (not Receipt, if already received)

### Issue 6: On-site disposal journal not auto-creating

**Symptoms:**
- Inventory not removed after posting return with "On-Site Disposal"
- Items still show in inventory after disposal

**Root causes:**
1. Return Journal Template/Batch not configured
2. Event subscriber not firing correctly
3. System lacks permission to create journal entries

**Resolution:**
1. Search → Sales & Receivables Setup
2. Navigate to CLE section
3. Set **Return Journal Template** = [your template, e.g., "ITEM"]
4. Set **Return Journal Batch** = [your batch, e.g., "RETURNS"]
5. Verify template/batch exist: Search → Item Journal Templates
6. Test by posting a disposal return and checking Item Journal Lines

### Issue 7: Cannot copy previous-day return from shipment

**Symptoms:**
- Copy Document function shows no results
- Posted shipment exists but won't copy

**Root causes:**
1. Shipment lines already have quantity returned = quantity shipped
2. Shipment is for different customer
3. User lacks permission to access posted shipments

**Resolution:**
1. Verify shipment number is correct
2. Check customer match between return order and shipment
3. Query `Sales Shipment Line` for remaining quantity to return
4. If fully returned, inform user to create new shipment return if needed
5. Check user has TableData "Sales Shipment Header/Line" = R permission

---

## Performance Considerations

### Query Optimization

**Issue:** Same-day return creation can be slow with large loading tickets

**Current code (N+1 pattern):**
```al
SalesShipmentHeader.SetRange("CLE Picking Ticket No.", TicketHeader."Ticket No.");
if SalesShipmentHeader.FindSet() then
    repeat
        SalesShipmentLine.SetRange("Document No.", SalesShipmentHeader."No.");
        // ... process lines
    until SalesShipmentHeader.Next() = 0;
```

**Optimized version (Single query with JOIN):**
```al
local procedure GetAllLinesFromTicket(TicketNo: Code[20]; var TempShipmentLine: Record "Sales Shipment Line" temporary)
var
    SalesShipmentLine: Record "Sales Shipment Line";
begin
    // Use SetLoadFields to reduce data transfer
    SalesShipmentLine.SetLoadFields("Document No.", "No.", Description, Quantity, "Item Shpt. Entry No.");
    
    // Filter by related shipments in one query
    SalesShipmentLine.SetFilter("Document No.", 
        GetShipmentNumberFilterForTicket(TicketNo));
    
    if SalesShipmentLine.FindSet() then
        repeat
            TempShipmentLine.Copy(SalesShipmentLine);
            TempShipmentLine.Insert();
        until SalesShipmentLine.Next() = 0;
end;
```

**Impact:** Reduces database round-trips from O(n) to O(1) where n = shipments per ticket

### Recommended Database Indexes

**On Sales Shipment Header:**
```sql
CREATE INDEX idx_shiphdr_picking_ticket ON "Sales Shipment Header" ("CLE Picking Ticket No.");
```

**On Sales Shipment Line:**
```sql
CREATE INDEX idx_shipline_return_qty ON "Sales Shipment Line" ("Document No.", "CLE Qty. Already Returned");
```

**Monitoring:**
- Use SQL Server Profiler to identify slow queries
- Check telemetry for long-running queries
- Monitor page load times for Page 50203 with large shipments

---

## Testing Procedures

### Test Case 1: Same-day return creation

**Pre-conditions:**
- Sales order exists and is shipped
- Loading ticket exists with shipments
- Return reasons marked eligible for same-day
- Quarantine location configured

**Steps:**
1. Open loading ticket (Page 50179)
2. Click "Create Same-Day Return Order"
3. Enter quantity to return: 10
4. Select return reason: DAMAGED-TRANSIT
5. Click OK

**Verify:**
- `CLE Same-Day Return = true`
- `CLE Sales Approval Status = "Same-Day Return"`
- Location = Quarantine
- Return reason code populated

### Test Case 2: Same-day return approval (approve path)

**Pre-conditions:**
- Same-day return created and received
- User has approver flag and sufficient limit

**Steps:**
1. Open return order
2. Post → Receive
3. Click "Process Approval"
4. Select "Approve"

**Verify:**
- Status changes to "Released for Invoicing" (if all received)

### Test Case 3: Same-day return approval (decline path)

**Pre-conditions:**
- Same-day return created and received

**Steps:**
1. Open return order
2. Click "Process Approval"
3. Select "Decline"
4. Verify all lines show Unit Price = 0
5. Verify status = "Rejected - Post Zero $ Invoice"
6. Post → Invoice
7. Check posted credit memo amount = $0

### Test Case 4: Previous-day return over limit

**Pre-conditions:**
- User with limited approval amount (e.g., $500)
- Return amount > $500

**Steps:**
1. Create new return order manually
2. Add items totaling > $500
3. Enter return reason codes
4. Request approval
5. Verify status = "Approval Required"
6. Have approver process approval

**Verify:**
- Status changes to "Approved Inv. Posting awaiting"

### Test Case 5: On-site disposal inventory removal

**Pre-conditions:**
- Return order with "On-Site Disposal" selected
- Return journal template/batch configured

**Steps:**
1. Create return order
2. Set CLE Inventory Status = "On-Site Disposal"
3. Get approval
4. Post → Receive
5. Check Item Ledger Entries for negative adjustment

**Verify:**
- Inventory automatically reduced by returned quantity

### Test Case 6: Return reason code filtering

**Pre-conditions:**
- Multiple return reasons exist
- Some marked eligible for same-day, some not

**Steps:**
1. Create same-day return from loading ticket (note which reasons appear)
2. Create previous-day return manually (note which reasons appear)

**Verify:**
- Same-day shows filtered list (eligible only)
- Previous-day shows all reasons

---

## Related Pages

- [[sales-return-process]] — User guide covering both same-day and previous-day returns
- [[same-day-return]] — Quick reference for same-day return process
- [[sales]] — Sales orders and order management overview
