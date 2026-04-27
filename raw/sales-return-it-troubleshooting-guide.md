# Sales Return IT Troubleshooting & Process Guide

> **Version:** 1.0
> **Last Updated:** 2026-04-27
> **Author:** Clesen Horticulture IT Team
> **Audience:** IT Support, System Administrators, Developers

## Table of contents

- [Overview](#overview)
- [System architecture](#system-architecture)
- [Same-day return process flow](#same-day-return-process-flow)
- [Previous-day return process flow](#previous-day-return-process-flow)
- [Configuration requirements](#configuration-requirements)
- [Database schema and fields](#database-schema-and-fields)
- [Code objects reference](#code-objects-reference)
- [Approval workflow technical details](#approval-workflow-technical-details)
- [Common IT issues and resolutions](#common-it-issues-and-resolutions)
- [Testing procedures](#testing-procedures)
- [Performance considerations](#performance-considerations)
- [Related documentation](#related-documentation)

---

## Overview

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

**Key Technical Characteristic:**
The `CLE Same-Day Return` boolean field on Sales Header determines branching logic in approval processing, inventory handling, and posting workflows.

---

## System architecture

### Component overview

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

### Data flow

**Same-Day Return:**
1. Posted Shipment → Temp Sales Shipment Line (filtered for inventory items)
2. User input (Pag50203) → Qty To Return + Return Reason Code
3. Codeunit 50117 → Create Sales Return Order Header with flags
4. Copy Document Mgt → Copy lines with application entries
5. Apply return reason codes → Set quarantine location
6. Approval workflow (Cod50037) → Process based on `CLE Same-Day Return = true`
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

## Same-day return process flow

### Technical sequence diagram

```
User              Loading Ticket       Cod50117              Copy Doc Mgt        Cod50037
 |                     |                    |                      |                 |
 |──Click "Create"────>|                    |                      |                 |
 |                     |                    |                      |                 |
 |                     |──Call CreateSalesReturnOrderFromLoadingTicket()             |
 |                     |                    |                      |                 |
 |                     |                    |──Get Posted Shipments from Ticket     |
 |                     |                    |──Filter: Type=Inventory only           |
 |                     |                    |──Build TempShipmentLine                |
 |                     |                    |                      |                 |
 |                     |──Show Pag50203────>|                      |                 |
 |<────Enter Qty & Return Reasons──────────|                      |                 |
 |                     |                    |                      |                 |
 |                     |                    |──Validate: All lines have reason codes |
 |                     |                    |──CreateSalesReturnOrderHeader()        |
 |                     |                    |    - Set CLE Same-Day Return = true    |
 |                     |                    |    - Set Status = "Same-Day Return"    |
 |                     |                    |    - Set Inventory Status = Returned   |
 |                     |                    |                      |                 |
 |                     |                    |──CopySalesLinesToDoc()───────>         |
 |                     |                    |                      |                 |
 |                     |                    |<─Lines Copied────────|                 |
 |                     |                    |                      |                 |
 |                     |                    |──Apply Return Reason Codes             |
 |                     |                    |──Set Location = Quarantine             |
 |                     |                    |──Modify Lines                          |
 |                     |                    |                      |                 |
 |                     |<───Return Order Created──|               |                 |
 |<────"Return Order X Created"────────────|                      |                 |
 |                     |                    |                      |                 |
[Later: User Posts Receipt]                |                      |                 |
 |──Post Receipt──────>|                    |                      |                 |
 |                     |──OnBeforeSalesReturnRcptPost event───────────────────────>  |
 |                     |                    |                      |                 |
 |                     |                    |                      |    CheckReturnOrderApprovalStatusBeforePosting()
 |                     |                    |                      |    - Verify Status in allowed values
 |                     |                    |                      |    - Check all lines have reason codes
 |                     |                    |                      |                 |
 |                     |                    |                      |<────Validation OK
 |                     |<──Receipt Posted───|                      |                 |
 |                     |                    |                      |                 |
[Approver Processes]  |                    |                      |                 |
 |──Process Approval───────────────────────────────────────────────────────────────>|
 |                     |                    |                      |                 |
 |                     |                    |                      |    ProcessApproval()
 |                     |                    |                      |    IF CLE Same-Day Return:
 |                     |                    |                      |      - Check receipt status
 |                     |                    |                      |      - Approve: Release or Approved Inv. Posting awaiting
 |                     |                    |                      |      - Decline: Set prices to $0, status = Rejected Zero $
 |                     |                    |                      |                 |
 |<────Status Updated──────────────────────────────────────────────────────────────|
```

### Key code: Codeunit 50117

**Location:** `app/5 Codeunits/Picking/Cod50117.CLECreateROrderFromLoadin.al`

**Primary procedure:**
```al
procedure CreateSalesReturnOrderFromLoadingTicket(TicketHeader: Record "CLE Supermarket Picking Header")
```

**Logic flow:**
1. Query `Sales Shipment Header` filtered by `CLE Picking Ticket No.`
2. For each shipment, get `Sales Shipment Line` where Type = Item
3. Filter to only `Item.Type::Inventory` (exclude services)
4. Calculate `CLE Qty. To Return` = Quantity - Qty. Already Returned
5. Display Page 50203 "CLE Sales Shipment Lines" for user input
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

## Previous-day return process flow

### Technical sequence

```
User              Sales Return Order    Cod50037              User Setup
 |                       |                  |                      |
 |──Create New Return───>|                  |                      |
 |──Enter Customer───────>|                  |                      |
 |──Copy Document or Manual Entry────────>  |                      |
 |                       |                  |                      |
 |──Enter Return Reason Codes───────────>   |                      |
 |──Set Inventory Status─────────────────>  |                      |
 |                       |                  |                      |
 |──Request Approval─────>|                  |                      |
 |                       |──SetApprovalStatusInSalesHeader()       |
 |                       |                  |                      |
 |                       |                  |──GetSalespersonLimit()──────>
 |                       |                  |<──Credit Limit───────|
 |                       |                  |                      |
 |                       |                  |──CalcFields(Amount)  |
 |                       |                  |                      |
 |                       |                  |  IF Limit < 0:       |
 |                       |                  |    Status = Ready to Approve
 |                       |                  |  ELSE IF Amount > Limit:
 |                       |                  |    Status = Approval required
 |                       |                  |  ELSE:               |
 |                       |                  |    Status = Ready to Approve
 |                       |                  |                      |
 |<──Status Updated──────|<─────────────────|                      |
 |                       |                  |                      |
[Approver Reviews]       |                  |                      |
 |──Process Approval─────────────────────> |                      |
 |                       |                  |                      |
 |                       |                  |──Check User Setup: CLE Cr.Request Approver = true
 |                       |                  |──Check Amount vs. User's Approval Limit
 |                       |                  |                      |
 |<────Prompt Approve/Decline──────────────|                      |
 |──Select: Approve──────────────────────> |                      |
 |                       |                  |                      |
 |                       |                  |  IF NOT CLE Same-Day Return:
 |                       |                  |    Approve: Status = Approved Inv. Posting awaiting
 |                       |                  |    Decline: Status = Rejected
 |                       |                  |                      |
 |<──Status Updated──────|<─────────────────|                      |
 |                       |                  |                      |
 |──Post Receipt─────────>|                  |                      |
 |                       |──CheckReturnOrderApprovalStatusBeforePosting()
 |                       |    - Verify status in approved values   |
 |                       |    - Check all lines have return reasons|
 |                       |                  |                      |
 |<──Receipt Posted──────|                  |                      |
```

### Key code: Codeunit 50037

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

**Approval processing:**
```al
local procedure ProcessApproval(var SalesHeader: Record "Sales Header")
begin
    // Validate approver permissions and limits
    
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
    end else begin
        // SAME-DAY RETURN LOGIC (different handling)
        // ... see Same-Day section
    end;
end;
```

---

## Configuration requirements

### Return reason codes

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

### Location setup

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

### User setup for approvals

**Table:** User Setup (Standard BC)
**Extension:** Multiple CLE fields

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

### Sales & Receivables setup

**Table:** Sales & Receivables Setup
**Setup location:** Search → Sales & Receivables Setup

**Required number series:**
- **Return Order Nos.** — Must be configured (standard BC)

**Optional CLE fields:**
- **Return Journal Template** — For on-site disposal auto-journaling
- **Return Journal Batch** — Batch name for auto-created entries

---

## Database schema and fields

### Sales Header extensions

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

**Data types:**

**Enum 60116: CLE Sales Doc. Appr. Status**
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

### Sales Line extensions

**Extension:** 50015 "Tab-ExtCLE.SalesShipmentLine"

**Fields added to Sales Shipment Line:**

| Field No. | Field Name | Type | Purpose |
|-----------|------------|------|---------|
| 50000 | CLE Qty. To Return | Decimal | User input for quantity |
| 50001 | CLE Return Reason Code | Code[10] | Selected return reason |

**TableRelation on CLE Return Reason Code:**
```al
TableRelation = "Return Reason".Code where("CLE Eligible for Same-Day Return" = const(true));
```

### Return reason extension

**Extension:** 50059 "CLE Return Reason"
**Location:** `app/2 Table Extensions/Sales/50059.Tab-Ext.CLE.ReturnReason.al`

```al
tableextension 50059 "CLE Return Reason" extends "Return Reason"
{
    fields
    {
        field(50000; "CLE Eligible for Same-Day Return"; Boolean)
        {
            Caption = 'Eligible for Same-Day Return';
            DataClassification = CustomerContent;
        }
    }
}
```

---

## Code objects reference

### Primary codeunits

| Object ID | Name | Purpose | Key Procedures |
|-----------|------|---------|----------------|
| **50037** | CLE Product Credit Management | Approval workflow, validation | `ProcessApproval()`, `SetApprovalStatusInSalesHeader()`, `CheckApprovalStatusBeforeCreditPosting()` |
| **50117** | CLE Create R-Order From Loadin | Same-day return creation | `CreateSalesReturnOrderFromLoadingTicket()`, `CreateSalesReturnOrderHeader()` |

### Pages

| Object ID | Name | Purpose | Used By |
|-----------|------|---------|---------|
| **50179** | CLE Loading Ticket | Loading ticket management | Warehouse staff (same-day entry point) |
| **50203** | CLE Sales Shipment Lines | Item selection for same-day returns | Called by Cod50117 |
| **60115** | PageExtension CLE Sales Return Order | Extends standard return order page | Previous-day returns |
| **60618** | PageExtension CLE Return Reasons | Adds same-day eligible flag | Return reason setup |

### Event subscribers

**Codeunit 50037 subscribers:**

1. **OnBeforeSalesReturnRcptPost** (Standard BC posting event)
   ```al
   [EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 
                    'OnBeforeReturnRcptHeaderInsert', '', true, true)]
   ```
   - Validates approval status before receipt posting
   - Checks return reason codes on all lines

2. **OnAfterCopySalesShptLinesToDoc** (Copy Document Mgt event)
   ```al
   [EventSubscriber(ObjectType::Codeunit, Codeunit::"Copy Document Mgt.", 
                    'OnAfterCopySalesShptLinesToDoc', '', true, true)]
   ```
   - Auto-captures return-from address from original shipment
   - Populates CLE Return-from fields

3. **OnAfterSalesReturnRcptHeaderInsert** (Post-receipt event)
   ```al
   [EventSubscriber(ObjectType::Codeunit, Codeunit::"Sales-Post", 
                    'OnAfterReturnRcptHeaderInsert', '', true, true)]
   ```
   - Triggers journal creation for on-site disposal
   - Calls `CreateJournalAfterReturnPosting()`

### Inventory journal auto-generation

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

## Approval workflow technical details

### Decision tree

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

### Same-day return approval logic

**Code location:** Codeunit 50037 → `ProcessApproval()` → ELSE branch

```al
if SalesHeader."CLE Same-Day Return" then begin
    case Selection of
        1:  // Approve
            begin
                // Check if all lines are received
                SalesLine.SetRange("Document Type", SalesHeader."Document Type");
                SalesLine.SetRange("Document No.", SalesHeader."No.");
                SalesLine.CalcSums(Quantity, "Return Qty. Received");
                
                if SalesLine.Quantity = SalesLine."Return Qty. Received" then
                    SalesHeader."CLE Sales Approval Status" := "Released for Invoicing"
                else
                    SalesHeader."CLE Sales Approval Status" := "Approved Inv. Posting awaiting";
            end;
        2:  // Decline
            begin
                // Set all lines to $0 for zero-dollar posting
                SalesLine.SetRange("Document Type", SalesHeader."Document Type");
                SalesLine.SetRange("Document No.", SalesHeader."No.");
                if SalesLine.FindSet() then
                    repeat
                        SalesLine.Validate("Unit Price", 0);
                        SalesLine.Modify();
                    until SalesLine.Next() = 0;
                SalesHeader."CLE Sales Approval Status" := "Rejected - Post Zero $ Invoice";
            end;
    end;
end;
```

**Key behavior:**
- **Approve + All Received:** Goes directly to "Released for Invoicing" (skip intermediate state)
- **Approve + Not Fully Received:** "Approved Inv. Posting awaiting" (wait for full receipt)
- **Decline:** Sets all unit prices to zero, allowing posting without credit

### Previous-day return approval logic

**Code location:** Codeunit 50037 → `ProcessApproval()` → IF NOT branch

```al
if not SalesHeader."CLE Same-Day Return" then begin
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
```

**Key behavior:**
- **Approve:** Simple status change to "Approved Inv. Posting awaiting" (or "Released" for credit memos)
- **Decline:** Simple rejection; no price manipulation

---

## Common IT issues and resolutions

### Issue 1: Same-day return button not appearing

**Symptoms:**
- "Create Same-Day Return Order" action missing from loading ticket
- User reports cannot create same-day returns

**Root causes:**
1. **Permissions:** User lacks permissions to create return orders
2. **Object sync:** Page 50179 not published correctly
3. **Customization:** Page customization hiding action

**Resolution:**
```powershell
# Check object existence
Get-NAVAppInfo -ServerInstance BC220 | Where-Object {$_.Name -like "*Clesen*"}

# Republish app if needed
Publish-NAVApp -ServerInstance BC220 -Name "Clesen Horticulture" -Version X.X.X.X

# Check user permissions
# Navigate: User Setup → Permissions → Check table 37 (Sales Header) has RIMD
```

**Verify user has:**
- TableData "Sales Header" = RIMD (Read, Insert, Modify, Delete)
- Permission set "CLE CLESEN HORTICULTURE" assigned

### Issue 2: Return reason codes not appearing

**Symptoms:**
- Dropdown shows no values when creating same-day return
- Error: "No return reasons available"

**Root causes:**
1. **Configuration:** No return reasons marked "Eligible for Same-Day Return"
2. **TableRelation:** Table relation filter not working
3. **Data:** No return reasons exist in database

**Resolution:**
```al
// Run this in AL Console or create verification codeunit
local procedure VerifyReturnReasons()
var
    ReturnReason: Record "Return Reason";
begin
    ReturnReason.SetRange("CLE Eligible for Same-Day Return", true);
    if not ReturnReason.FindSet() then
        Error('No return reasons marked eligible for same-day returns.');
    
    // List eligible codes
    repeat
        Message('Code: %1, Description: %2', ReturnReason.Code, ReturnReason.Description);
    until ReturnReason.Next() = 0;
end;
```

**Fix in UI:**
1. Search → Return Reasons
2. For each appropriate reason:
   - Check **CLE Eligible for Same-Day Return**
   - Save
3. Minimum 2-3 codes recommended (DAMAGED-TRANSIT, QUALITY-ISSUE, WRONG-ITEM)

### Issue 3: Items not routing to quarantine location

**Symptoms:**
- Same-day return items go to main warehouse instead of quarantine
- Cannot find returned items for inspection

**Root causes:**
1. **Configuration:** Location missing "CLE Quarantine Location" field value
2. **Code issue:** Field not properly applied during creation
3. **Permissions:** User cannot modify location on sales lines

**Resolution:**
```al
// Verify location configuration
local procedure VerifyQuarantineSetup()
var
    Location: Record Location;
begin
    Location.SetFilter("CLE Quarantine Location", '<>%1', '');
    if not Location.FindSet() then
        Error('No locations have quarantine location configured.');
    
    repeat
        Message('Location: %1, Quarantine: %2', Location.Code, Location."CLE Quarantine Location");
    until Location.Next() = 0;
end;
```

**Fix:**
1. Search → Locations
2. Open primary warehouse location (e.g., MAIN)
3. Set **CLE Quarantine Location** = [your quarantine location code]
4. If quarantine location doesn't exist:
   - Create new location (Code = "QUARANTINE", Name = "Quarantine Inspection")
   - Configure as needed (no bins, simple setup)
   - Return to main location and set field

### Issue 4: Approval status stuck in "Approval Required"

**Symptoms:**
- Return order cannot be posted
- Status never changes from "Approval Required"
- No approver notifications sent

**Root causes:**
1. **No approvers configured:** No users have "CLE Cr.Request Approver" flag
2. **Limit exceeded:** All approvers' limits are lower than return amount
3. **Workflow issue:** Approval request not properly triggered

**Resolution:**
```al
// Check for approvers
local procedure ListApprovers()
var
    UserSetup: Record "User Setup";
begin
    UserSetup.SetRange("CLE Cr.Request Approver", true);
    if not UserSetup.FindSet() then
        Error('No users configured as credit request approvers.');
    
    repeat
        Message('User: %1, Limit: %2, Unlimited: %3', 
                UserSetup."User ID", 
                UserSetup."CLE Credit Request Limit",
                UserSetup."CLE Unlimited Credit Request");
    until UserSetup.Next() = 0;
end;
```

**Fix:**
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
1. **Validation issue:** Standard BC validation blocking zero-amount posting
2. **Code error:** Unit prices not actually set to $0
3. **Permission issue:** User lacks permission to post zero-dollar transactions

**Resolution:**
```al
// Verify lines are truly $0
local procedure CheckZeroDollarLines(SalesHeader: Record "Sales Header")
var
    SalesLine: Record "Sales Line";
begin
    SalesLine.SetRange("Document Type", SalesHeader."Document Type");
    SalesLine.SetRange("Document No.", SalesHeader."No.");
    SalesLine.SetFilter("Unit Price", '<>0');
    
    if SalesLine.FindFirst() then
        Error('Line %1 still has unit price %2. Expected $0.', 
              SalesLine."Line No.", SalesLine."Unit Price");
end;
```

**Fix:**
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
1. **Configuration:** Return Journal Template/Batch not configured
2. **Event subscriber:** Event not firing correctly
3. **Permission issue:** System lacks permission to create journal entries
4. **Posting error:** Journal auto-post failed silently

**Resolution:**
```al
// Manually trigger journal creation
procedure ManuallyCreateDisposalJournal(ReturnReceiptNo: Code[20])
var
    ReturnRcptHeader: Record "Return Receipt Header";
    SalesHeader: Record "Sales Header";
begin
    ReturnRcptHeader.Get(ReturnReceiptNo);
    
    // Get original sales header
    if not SalesHeader.Get(SalesHeader."Document Type"::"Return Order", 
                           ReturnRcptHeader."Return Order No.") then
        exit;
    
    // Call the procedure directly
    Codeunit50037.CreateJournalAfterReturnPosting(SalesHeader, ReturnReceiptNo);
end;
```

**Fix:**
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
1. **Already fully returned:** Shipment lines already have quantity returned = quantity shipped
2. **Different customer:** Shipment is for different customer
3. **Permissions:** User lacks permission to access posted shipments

**Resolution:**
```sql
-- Query to check shipment return status
SELECT 
    ssh."No." AS "Shipment No",
    ssl."Line No",
    ssl."No." AS "Item No",
    ssl.Quantity,
    ssl."CLE Qty. Already Returned",
    (ssl.Quantity - ssl."CLE Qty. Already Returned") AS "Available to Return"
FROM "Sales Shipment Header" ssh
JOIN "Sales Shipment Line" ssl ON ssh."No." = ssl."Document No."
WHERE ssh."No." = 'SHIP12345'
AND ssl.Type = 2  -- Item
ORDER BY ssl."Line No.";
```

**Fix:**
1. Verify shipment number is correct
2. Check customer match between return order and shipment
3. Query `Sales Shipment Line` for remaining quantity
4. If fully returned, inform user to create new shipment return if needed
5. Check user has TableData "Sales Shipment Header/Line" = R permission

---

## Testing procedures

### Test case 1: Same-day return creation

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
6. Verify return order created with:
   - `CLE Same-Day Return = true`
   - `CLE Sales Approval Status = "Same-Day Return"`
   - Location = Quarantine
   - Return reason code populated

**Expected result:** Return order created successfully with correct flags

### Test case 2: Same-day return approval (approve path)

**Pre-conditions:**
- Same-day return created and received
- User has approver flag and sufficient limit

**Steps:**
1. Open return order
2. Post → Receive
3. Click "Process Approval"
4. Select "Approve"
5. Verify status changes to "Released for Invoicing" (if all received)

**Expected result:** Status = "Released for Invoicing", ready for credit posting

### Test case 3: Same-day return approval (decline path)

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

**Expected result:** Zero-dollar credit memo posted, no credit issued

### Test case 4: Previous-day return over limit

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
7. Verify status changes to "Approved Inv. Posting awaiting"

**Expected result:** Approval workflow functions correctly for over-limit returns

### Test case 5: On-site disposal inventory removal

**Pre-conditions:**
- Return order with "On-Site Disposal" selected
- Return journal template/batch configured

**Steps:**
1. Create return order
2. Set CLE Inventory Status = "On-Site Disposal"
3. Get approval
4. Post → Receive
5. Check Item Ledger Entries for negative adjustment
6. Verify inventory quantity decreased

**Expected result:** Inventory automatically reduced by returned quantity

### Test case 6: Return reason code filtering

**Pre-conditions:**
- Multiple return reasons exist
- Some marked eligible for same-day, some not

**Steps:**
1. Create same-day return from loading ticket
2. Note which return reasons appear (should be only eligible ones)
3. Create previous-day return manually
4. Note which return reasons appear (should be all)

**Expected result:** Same-day shows filtered list, previous-day shows all

---

## Performance considerations

### Query optimization

**Issue:** Same-day return creation can be slow with large loading tickets

**Location:** Codeunit 50117 → `CreateSalesReturnOrderFromLoadingTicket()`

**Optimization:**
```al
// Current code queries shipments then lines (N+1 pattern)
SalesShipmentHeader.SetRange("CLE Picking Ticket No.", TicketHeader."Ticket No.");
if SalesShipmentHeader.FindSet() then
    repeat
        SalesShipmentLine.SetRange("Document No.", SalesShipmentHeader."No.");
        // ... process lines
    until SalesShipmentHeader.Next() = 0;

// Optimized version: Single query with JOIN
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

### Approval status calculation caching

**Issue:** `SetApprovalStatusInSalesHeader()` called repeatedly on same record

**Solution:** Add guard clause to skip recalculation if already calculated
```al
procedure SetApprovalStatusInSalesHeader(var SalesHeader: Record "Sales Header")
begin
    // Skip if already in terminal state
    if SalesHeader."CLE Sales Approval Status" in [
        "Approved", "Rejected", "Approved Inv. Posting awaiting",
        "Released for Invoicing", "Approval requested", "Same-Day Return"] then
        exit;
    
    // ... rest of logic
end;
```

### Index recommendations

**Recommended indexes on Sales Shipment Header:**
```sql
CREATE INDEX idx_shiphdr_picking_ticket ON "Sales Shipment Header" ("CLE Picking Ticket No.");
```

**Recommended indexes on Sales Shipment Line:**
```sql
CREATE INDEX idx_shipline_return_qty ON "Sales Shipment Line" ("Document No.", "CLE Qty. Already Returned");
```

**Monitoring:**
- Use SQL Server Profiler to identify slow queries
- Check "Dynamics 365 Business Central - Long Running SQL Queries" telemetry
- Monitor page load times for Page 50203 with large shipments

---

## Related documentation

### Internal guides
- [Sales Fee Management User Guide](sales-fee-management-user-guide.md) — Restocking fee calculation
- [Move Lines User Guide](staff/move-lines-user-guide.md) — Moving return lines between orders
- [CRM IT Troubleshooting Guide](crm-it-troubleshooting-guide.md) — Customer-related issues

### Standard BC documentation
- [Sales Returns in Business Central](https://learn.microsoft.com/en-us/dynamics365/business-central/sales-how-process-sales-returns-orders)
- [Posting Sales Documents](https://learn.microsoft.com/en-us/dynamics365/business-central/ui-post-sales)

### Configuration guides
- Location setup for quarantine
- User setup for approval limits
- Return reason code configuration

---

## Support and troubleshooting contacts

**For configuration issues:**
- IT Administrator: See User Setup for current admin

**For approval workflow problems:**
- Check User Setup → CLE Cr.Request Approver users

**For development questions:**
- Review code in Codeunits 50037 and 50117
- Check event subscribers for return posting

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/sales-return-process-technical.pdf)
