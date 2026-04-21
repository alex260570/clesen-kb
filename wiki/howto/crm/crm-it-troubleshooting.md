---
title: CRM System — IT Troubleshooting
type: howto
tags: [crm, lead-management, activity-tracking, it-support, system-architecture]
created: 2026-04-21
updated: 2026-04-21
sources: [crm-it-troubleshooting-guide.md]
---

# CRM System — IT Troubleshooting

Technical guide for IT staff supporting the CRM extension (lead management, activity tracking, strategic planning).

## System Overview

**Core Objects:**

| Component | Details |
|-----------|---------|
| **Main Table** | `50029 "CLE CRM Activity Entry"` - Activity storage |
| **Contact Extension** | Lead status and tracking fields |
| **Customer Extension** | CRM integration fields |
| **Lead Status Enum** | `60113 "CLE Lead Status"` - Lead lifecycle states |
| **Activity Entry Type** | `60108 "CLE CRM Activity Entry Type"` - Activity categories |

**Key Codeunits:**
- `50030 "CLE Lead Management"` - Lead creation and status changes
- `50031 "CLE Lead Management Subscribers"` - Event handlers
- `50025 "CLE CRM Management"` - Customer statistics and updates
- `50003 "CLE General Functions"` - Activity status management

---

## Common Issues & Troubleshooting

### Issue 1: Role Center Tiles Not Showing Counts

**Symptoms:**
- Role center tiles display 0 or incorrect counts
- "My Leads", "My Activities" tiles blank

**Diagnosis:**
1. Check User ID Assignment — user should be assigned as Salesperson Code on records
2. Verify Filter Setup — page should filter by Current User and Salesperson Code
3. Check FlowFields Calculation — CalcFormula must reference correct field names

**Common Causes:**
- User not assigned as Salesperson Code on records
- FlowFilter not properly set in OnOpenPage trigger
- CalcFormula referencing wrong field names
- User Responsible vs Salesperson Code confusion

**Resolution:**

**Option A - Fix User Assignment:**
1. Open Contact/Customer records
2. Ensure Salesperson Code = User's salesperson code
3. Ensure CRM Activities have User Responsible = UserId

**Option B - Fix Page Filters:**
1. Open page 50223 in AL code
2. Verify OnOpenPage trigger sets all required filters
3. Ensure Current User filter is set for activity counts
4. Ensure Salesperson Code filter is set for leads

**Option C - Refresh CalcFields:**
1. Close and reopen role center page
2. Force recalculation with F5 refresh
3. Check if filters are being cleared by other code

---

### Issue 2: "Cannot Change to This Status" Error

**Symptoms:**
- Error when trying to change lead status
- Message: "No can do" or validation error

**Valid Transitions:**
```
Lead → Cust. Application ✓
Lead → Not Qualified ✓
Cust. Application → Converted ✓
Cust. Application → Not Qualified ✓
Not Qualified → Lead ✓
Converted → [Any] ✗ (LOCKED)
```

**Resolution:**

**For Converted Status Lock:**
- Cannot change once Converted (by design)
- Consider creating new contact if truly needed

**For Other Status Changes:**
1. Verify current status of Contact
2. Check requested status is valid for current status
3. If override needed, use OverRule parameter in code
4. Document reason for override

---

### Issue 3: Activities Not Appearing on Customer Card

**Symptoms:**
- Activities created for Contact don't show on Customer Card after conversion
- CRM factbox empty on Customer Card

**Common Causes:**
- Business relation not created between Contact and Customer
- Conversion subscriber not firing
- Record Type not updated during conversion
- Marketing Setup incomplete

**Resolution:**

**Option A - Fix Marketing Setup:**
1. Open Marketing Setup
2. Verify "Bus. Rel. Code for Customers" is set (typically "CUST")
3. Save and retry customer creation

**Option B - Manual Activity Update (emergency fix):**
```al
// Run as AL code
CRMEntry.SetRange("Record Type", CRMEntry."Record Type"::Contact);
CRMEntry.SetRange("Record No.", '[Contact No.]');
if CRMEntry.FindSet(true) then
    repeat
        CRMEntry."Record Type" := CRMEntry."Record Type"::Customer;
        CRMEntry."Record No." := '[Customer No.]';
        CRMEntry.Modify();
    until CRMEntry.Next() = 0;
```

**Option C - Verify Subscriber:**
- Ensure event subscriber is active in Codeunit 50031

---

### Issue 4: Activity Status Not Updating

**Symptoms:**
- Activities stay "Planned" when date is past
- Status doesn't change to "Overdue"
- "Due" status not appearing

**Status Logic:**
```
Activity Date > Today  →  "Planned"
Activity Date = Today  →  "Due"
Activity Date < Today  →  "Overdue"
(Already Finished/Canceled → No change)
```

**Common Causes:**
- Status update logic not triggered
- Activity already marked Finished/Canceled
- Permissions prevent modification
- Activity Date not set (Notes-type activities)

**Resolution:**

**Option A - Trigger Manual Update:**
1. Open activity
2. Change Activity Date (if not today)
3. Validate field to trigger status update
4. Save

**Option B - Fix Permissions:**
1. Verify user has modify permission on CLE CRM Activity Entry table
2. Check TableData permissions in permission sets

**Option C - Batch Update Status:**
```al
// Create codeunit to batch update statuses
CRMEntry.SetFilter(Status, '<>%1&<>%2', 
    CRMEntry.Status::Finished, CRMEntry.Status::Canceled);
if CRMEntry.FindSet(true) then
    repeat
        CLEGenFunctions.SetActivityStatus(CRMEntry);
    until CRMEntry.Next() = 0;
```

---

### Issue 5: "Please Assign a Customer Type First" Error

**Symptoms:**
- Cannot request customer application
- Error when clicking "Request Customer Application"

**Root Cause:**
- "CLE Customer Type" field is empty
- Dimension CUSTTYPE not set up or user lacks access

**Resolution:**

**Option A - Add Customer Type:**
1. Open Lead Card
2. Click "CLE Customer Type" field
3. Select from dropdown
4. Save record
5. Retry customer application

**Option B - Fix Dimension Setup:**
1. Open Dimensions page
2. Verify CUSTTYPE dimension exists
3. Add dimension if missing
4. Create dimension values (RETAIL, WHOLESALE, etc.)

---

### Issue 6: Activities Not Filtering by User

**Symptoms:**
- User sees other users' activities
- "My Activities" shows all activities
- Cannot filter to specific user

**Common Causes:**
- User Responsible field not set when creating activity
- Field length truncating username
- Filter not applied in page/factbox
- Multiple user responsible fields causing confusion

**Resolution:**

**Option A - Fix Activity Creation:**
1. Verify "User Responsible" is assigned when creating activity
2. Ensure UserId is properly captured
3. Check field assignment code

**Option B - Fix Field Length:**
- Field is Text[50] — check if usernames are being truncated
- Verify actual username length: `Message(Format(StrLen(UserId)));`

**Option C - Update Existing Records:**
```al
// Fix activities with blank User Responsible
CRMEntry.SetRange("User Responsible", '');
if CRMEntry.FindSet(true) then
    repeat
        // Set to appropriate user based on Record No. or other logic
        CRMEntry.Modify();
    until CRMEntry.Next() = 0;
```

---

### Issue 7: BLOB Field Not Saving Description

**Symptoms:**
- Activity description appears blank after saving
- Text not persisting in description field
- Control add-in errors

**Common Causes:**
- Control add-in not registered or installed
- BLOB field not calculated (CalcFields missing)
- Callback from control add-in not firing

**Resolution:**

**Option A - Fix Control Add-in:**
1. Verify WebPageViewer is in Control Add-ins list
2. Download and reinstall if missing
3. Check page extension uses correct control add-in name

**Option B - Alternative Editor:**
```al
// Replace WebPageViewer with standard multi-line text
field(Description; ActivityDescriptionText)
{
    ApplicationArea = All;
    MultiLine = true;
}
```

**Option C - Browser Compatibility:**
1. Test in different browser
2. Clear browser cache
3. Update Business Central Web Client
4. Check console for JavaScript errors

---

## Data Integrity Checks

### Verify Lead Status Consistency

Ensure company and person contacts have matching lead status:

```al
Contact.SetRange(Type, Contact.Type::Person);
if Contact.FindSet() then
    repeat
        if CompanyContact.Get(Contact."Company No.") then
            if Contact."CLE Lead Status" <> CompanyContact."CLE Lead Status" then
                // Log or fix mismatch
    until Contact.Next() = 0;
```

### Verify Activity User Assignment

Ensure all activities have User Responsible assigned:

```al
CRMEntry.SetRange("User Responsible", '');
if CRMEntry.FindSet(true) then
    repeat
        // Assign based on contact/customer salesperson or other logic
        if Contact.Get(CRMEntry."Record No.") then
            CRMEntry."User Responsible" := CopyStr(Contact."Salesperson Code", 1, 50);
        CRMEntry.Modify();
    until CRMEntry.Next() = 0;
```

### Verify Business Relations After Conversion

Ensure Contact-Customer links exist:

```al
Contact.SetRange("CLE Lead Status", Contact."CLE Lead Status"::Converted);
if Contact.FindSet() then
    repeat
        MarketingSetup.Get();
        if not ContBusRelation.Get(Contact."No.", 
            MarketingSetup."Bus. Rel. Code for Customers") then
            // Log missing business relation
    until Contact.Next() = 0;
```

---

## Performance Optimization

### Activity Entry Table Indexes

**Critical Indexes:**
```al
key(K2; "Record Type", "Record No.", "Entry No.") { }
key(K3; "Activity Date") { }
```

**Additional Recommended:**
```al
key(K4; "User Responsible") { }
key(K5; Status, "Activity Date") { }
```

### FlowField Calculation Performance

**Issue:** Role center tiles slow to load

**Optimize:**
- Use CalcFields only when needed
- Cache counts when possible
- Avoid recalculating on every page refresh

---

## Security and Permissions

### Required Permissions

**Tables:**
- `50029 "CLE CRM Activity Entry"` - Read, Insert, Modify
- Contact - Read, Modify (for lead status)
- Customer - Read (for statistics)

**Recommended Permission Sets:**

**CRM User:**
- Table 50029 = RIMD
- Table 5050 Contact = RM (no Insert/Delete)

**CRM Manager:**
- All CRM User permissions +
- Table 5050 Contact = RIMD (full access)

---

## Monitoring and Logging

### Key Metrics to Monitor

- Activity creation rate (activities/day)
- Overdue activity count
- Lead conversion rate
- Time from Lead to Converted
- User activity volume

### Health Checks

**Daily:**
1. Overdue activity count trending
2. Activities with no User Responsible
3. Leads stuck in statuses

**Weekly:**
1. Data quality metrics
2. User adoption rates
3. Activity completion rates

**Monthly:**
1. Performance review
2. Data integrity audit
3. Feature usage analysis

---

## Backup and Recovery

### Critical Data to Backup

**Tables:**
- `50029 "CLE CRM Activity Entry"` - All activity data
- Contact - Lead status and tracking fields
- `50040 "CLE Activity Cue"` - Role center configuration

### Recovery Procedures

**Restore Single Activity:**
1. Identify Entry No. from backup
2. Export record from backup database
3. Import into production with matching Entry No.
4. Verify links to Contact/Customer still valid

**Rebuild CRM Data (if corrupted):**
1. Restore from latest backup
2. Run data integrity checks
3. Fix any inconsistencies
4. Recalculate FlowFields
5. Verify role center tiles working

---

## Emergency Procedures

### Issue: Role Center Completely Non-Functional

**Immediate Actions:**
1. Check if other users affected (system-wide vs. user-specific)
2. Verify extension is installed and enabled
3. Check page 50223 exists and has correct object ID

**Temporary Workaround:**
1. Use CRM Entries list page directly (50101)
2. Use Leads page directly (50110)
3. Bypass role center tiles until fixed

### Issue: Performance Degradation

**Immediate Actions:**
1. Check table record counts (growth trends)
2. Review recent code changes
3. Check for missing indexes
4. Monitor SQL query performance

**Mitigation:**
1. Archive old activities if needed
2. Optimize indexes
3. Add caching for role center tiles
4. Batch update operations during off-hours

---

## Related Pages

- [[crm-lead-management]] — Lead management user guide
- [[crm-activity-management]] — Activity tracking user guide
