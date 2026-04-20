# CRM System - IT Troubleshooting Guide

## System Overview

The CRM extension provides lead management, activity tracking, and strategic planning capabilities integrated with Business Central's Contact and Customer systems.

### Core Objects

**Tables:**
- `50029 "CLE CRM Activity Entry"` - Main activity storage
- Contact (extended) - Lead status and tracking fields
- Customer (extended) - CRM integration fields

**Pages:**
- `50110 "CLE Leads"` - Lead list
- `50111 "CLE Lead Card"` - Lead details
- `50101 "CLE CRM Activity Entries"` - Activity list
- `50102 "CLE CRM Activity Page"` - Activity detail
- `50103 "CLE CRM Strategy Page"` - Strategy planning
- `50223 "CLE Salesperson Activities"` - Role center tiles

**Codeunits:**
- `50030 "CLE Lead Management"` - Lead creation and status changes
- `50031 "CLE Lead Management Subscribers"` - Event handlers
- `50025 "CLE CRM Management"` - Customer statistics and updates
- `50003 "CLE General Functions"` - Activity status management

**Enums:**
- `60113 "CLE Lead Status"` - Lead lifecycle states
- `60108 "CLE CRM Activity Entry Type"` - Activity categories
- `60110 "CLE CRM Activity Status"` - Activity states
- `60107 "CLE CRM Activity Record Type"` - Contact/Customer/Vendor

---

## Common Issues and Resolutions

### Issue 1: Role Center Tiles Not Showing Counts

**Symptoms:**
- Role center tiles display 0 or incorrect counts
- "My Leads", "My Activities", "My Opportunities" tiles blank

**Diagnosis:**

1. **Check User ID Assignment:**
```al
// Open SQL or AL to verify
Contact.SetRange("Salesperson Code", UserId);
// Should return user's leads
```

2. **Verify Filter Setup:**
```al
// In page 50223 - OnOpenPage trigger should show:
Rec.SetRange("Salesperson Code", UserId());
Rec.SetRange("Current User", UserId());
Rec.SetRange("Date Filter Less Today", 0D, Today() - 1);
Rec.SetRange("Date Filter More Equal Today", Today(), 99991231D);
```

3. **Check FlowFields Calculation:**
```al
// Table 50040 "CLE Activity Cue"
// Fields 60486-60491 must have correct CalcFormula
```

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
4. Ensure Salesperson Code filter is set for leads/customers

**Option C - Refresh CalcFields:**
1. Close and reopen role center page
2. Force recalculation with F5 refresh
3. Check if filters are being cleared by other code

---

### Issue 2: "Cannot change to this status" Error

**Symptoms:**
- Error when trying to change lead status
- Message: "No can do" or validation error

**Diagnosis:**

Check current status and requested status combination:

**Valid Transitions:**
```
Lead → Cust. Application ✓
Lead → Not Qualified ✓
Cust. Application → Converted ✓
Cust. Application → Not Qualified ✓
Not Qualified → Lead ✓
Converted → [Any] ✗ (LOCKED)
```

**Check Code:**
```al
// Codeunit 50030 - CheckLeadStatusToProceed procedure
case Companycontact."CLE Lead Status" of
    "CLE Lead Status"::Lead:
        if RequestedStatus in [RequestedStatus::"Cust. Application", 
                              RequestedStatus::"Not Qualified"] then
            CanProceed := true;
    // ... etc
```

**Resolution:**

**For Converted Status Lock:**
- Cannot change once Converted
- Must manually update if absolutely necessary (not recommended)
- Consider creating new contact if truly needed

**For Other Status Changes:**
1. Verify current status: `Contact.Get([No.]); Message(Format(Contact."CLE Lead Status"));`
2. Check requested status is valid for current status
3. If override needed, use OverRule parameter in code
4. Document reason for override

---

### Issue 3: Activities Not Appearing on Customer Card

**Symptoms:**
- Activities created for Contact don't show on Customer Card after conversion
- CRM factbox empty on Customer Card

**Diagnosis:**

1. **Check Record Type:**
```al
// CLE CRM Activity Entry table
CRMEntry.SetRange("Record Type", CRMEntry."Record Type"::Contact);
CRMEntry.SetRange("Record No.", ContactNo);
// Should find activities

CRMEntry.SetRange("Record Type", CRMEntry."Record Type"::Customer);
CRMEntry.SetRange("Record No.", CustomerNo);
// Should find same activities after conversion
```

2. **Verify Conversion Logic:**
```al
// Codeunit 50030 - CopyCRMActivitiesToCustomerAfterCreateCustomer
// Should update Record Type and Record No.
```

3. **Check Business Relation:**
```al
ContBusRelation.SetRange("Business Relation Code", 
    MarketingSetup."Bus. Rel. Code for Customers");
ContBusRelation.SetRange("Contact No.", ContactNo);
// Should exist after customer creation
```

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

**Option B - Manual Activity Update:**
```al
// For emergency fix - run as AL code
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
```al
// Codeunit 50031 - Ensure subscriber is active
// Check EventSubscriberInstance is set correctly
```

---

### Issue 4: Activity Status Not Updating

**Symptoms:**
- Activities stay "Planned" when date is past
- Status doesn't change to "Overdue"
- "Due" status not appearing

**Diagnosis:**

1. **Check Status Logic:**
```al
// Codeunit 50003 - SetActivityStatus procedure
if CRMActivity.Status in [CRMActivity.Status::Canceled, 
                          CRMActivity.Status::Finished] then
    exit; // Won't update if already finished

if CRMActivity."Activity Date" > Today then
    CRMActivity.Status := CRMActivity.Status::Planned;
if CRMActivity."Activity Date" = Today then
    CRMActivity.Status := CRMActivity.Status::Due;
if CRMActivity."Activity Date" < Today then
    CRMActivity.Status := CRMActivity.Status::Overdue;
```

2. **Verify Trigger Points:**
- OnAfterGetRecord on activity page
- OnValidate on Activity Date field
- Manual status update via Finish/Cancel

3. **Check for Blocking Code:**
- Modifications blocked by permissions
- Transaction scope issues
- Record locks

**Common Causes:**
- Status update logic not triggered
- Activity already marked Finished/Canceled
- Permissions prevent modification
- Activity Date not set (Notes)

**Resolution:**

**Option A - Trigger Manual Update:**
1. Open activity
2. Change Activity Date (if not today)
3. Validate field to trigger status update
4. Save

**Option B - Fix Permissions:**
1. Verify user has modify permission on CLE CRM Activity Entry table
2. Check TableData permissions in permission sets
3. Ensure no indirect permissions blocking

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

### Issue 5: "Please assign a Customer Type first" Error

**Symptoms:**
- Cannot request customer application
- Error when clicking "Request Customer Application"

**Diagnosis:**

1. **Check Field Value:**
```al
Contact.Get([ContactNo]);
if Contact."CLE Customer Type" = '' then
    Error('Field is empty');
```

2. **Verify Table Relation:**
```al
// Table Extension 50029 - Contact
field(50001; "CLE Customer Type"; Code[20])
{
    TableRelation = "Dimension Value".code 
        where("Dimension Code" = const('CUSTTYPE'));
}
```

3. **Check Dimension Setup:**
- Dimension CUSTTYPE must exist
- Dimension Values must be defined
- User has access to view dimensions

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
5. Retry

**Option C - Override Validation (Emergency Only):**
```al
// Comment out check in codeunit 50030
// procedure SendCustomerApplicationRequest
// NOT RECOMMENDED - Fix root cause instead
```

---

### Issue 6: Activities Not Filtering by User

**Symptoms:**
- User sees other users' activities
- "My Activities" shows all activities
- Cannot filter to specific user

**Diagnosis:**

1. **Check User Responsible Field:**
```al
CRMEntry.SetRange("User Responsible", UserId);
// Should filter to current user
```

2. **Verify UserId Function:**
```al
Message(UserId); 
// Should show current username
```

3. **Check Field Assignment:**
```al
// When creating activity
NewRecord."User Responsible" := CopyStr(UserId, 1, 50);
// Field is Text[50], may truncate long usernames
```

**Common Causes:**
- User Responsible field not set when creating activity
- Field length truncating username
- Filter not applied in page/factbox
- Multiple user responsible fields causing confusion

**Resolution:**

**Option A - Fix Activity Creation:**
1. Open codeunits 50029 table - NewActivity procedures
2. Verify "User Responsible" assignment
3. Ensure UserId is properly captured

**Option B - Fix Field Length:**
```al
// If usernames being truncated
// Field is Text[50] - may need extension if usernames longer
// Check actual username length: Message(Format(StrLen(UserId)));
```

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

**Diagnosis:**

1. **Check Control Add-in:**
```al
// Page 50102 - usercontrol(UserControlDesc; WebPageViewer)
// Verify WebPageViewer control add-in is installed
```

2. **Test BLOB Operations:**
```al
// Test write
OutStream: OutStream;
CRMEntry."Activity Description".CreateOutStream(OutStream);
OutStream.WriteText('Test');
CRMEntry.Modify();

// Test read
InStream: InStream;
CRMEntry.CalcFields("Activity Description");
CRMEntry."Activity Description".CreateInStream(InStream);
InStream.ReadText(Result);
Message(Result); // Should show 'Test'
```

3. **Check Character Encoding:**
```al
// Ensure UTF8 encoding for special characters
InStream: InStream;
"Activity Description".CreateInStream(InStream, TEXTENCODING::UTF8);
```

**Common Causes:**
- Control add-in not registered or installed
- BLOB field not calculated (CalcFields missing)
- Callback from control add-in not firing
- Browser/client compatibility issues

**Resolution:**

**Option A - Fix Control Add-in:**
1. Verify WebPageViewer is in Control Add-ins list
2. Download and reinstall if missing
3. Check page extension uses correct control add-in name

**Option B - Alternative Editor:**
```al
// Replace WebPageViewer with standard multi-line text
// Add regular text field on page instead
field(Description; ActivityDescriptionText)
{
    ApplicationArea = All;
    MultiLine = true;
    trigger OnValidate()
    begin
        Rec.SetDescription(ActivityDescriptionText);
    end;
}

trigger OnAfterGetRecord()
begin
    ActivityDescriptionText := Rec.GetDescription();
end;
```

**Option C - Browser Compatibility:**
1. Test in different browser
2. Clear browser cache
3. Update Business Central Web Client
4. Check console for JavaScript errors

---

## Data Integrity Checks

### Verify Lead Status Consistency

**Purpose:** Ensure company and person contacts have matching lead status

**Script:**
```al
// Check for mismatched status between company and persons
Contact.SetRange(Type, Contact.Type::Person);
if Contact.FindSet() then
    repeat
        if CompanyContact.Get(Contact."Company No.") then
            if Contact."CLE Lead Status" <> CompanyContact."CLE Lead Status" then
                // Log or fix mismatch
    until Contact.Next() = 0;
```

### Verify Activity User Assignment

**Purpose:** Ensure all activities have User Responsible assigned

**Script:**
```al
CRMEntry.SetRange("User Responsible", '');
if CRMEntry.FindSet(true) then
    repeat
        // Assign based on contact/customer salesperson or other logic
        if Contact.Get(CRMEntry."Record No.") then
            CRMEntry."User Responsible" := 
                CopyStr(Contact."Salesperson Code", 1, 50);
        CRMEntry.Modify();
    until CRMEntry.Next() = 0;
```

### Verify Business Relations After Conversion

**Purpose:** Ensure Contact-Customer links exist

**Script:**
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

**Check Index Usage:**
- Monitor SQL query plans
- Verify K2 used for factbox queries
- Verify K3 used for date-based filters

**Recommendations:**
- Consider additional index on User Responsible if large activity volume
- Consider composite index on Status + Activity Date for overdue queries

### FlowField Calculation Performance

**Issue:** Role center tiles slow to load

**Optimize:**
```al
// Use CalcFields only when needed
// Avoid recalculating on every page refresh
// Cache counts when possible

// Good
if NeedRefresh then begin
    Rec.CalcFields("My Leads", "My Overdue Activities");
    NeedRefresh := false;
end;

// Bad
Rec.CalcFields([All Fields]); // On every AfterGetRecord
```

### Large BLOB Field Handling

**Issue:** Slow page load with many activities

**Optimize:**
- Don't load BLOB in list views
- Use FlowField calculation only in detail view
- Limit description excerpt length in lists

```al
// In list page - don't show full description
// In card page - load only when opening
trigger OnAfterGetRecord()
begin
    if PageIsVisible then
        ActivityDescription := Rec.GetDescription();
end;
```

---

## Security and Permissions

### Required Permissions

**Tables:**
- `50029 "CLE CRM Activity Entry"` - Read, Insert, Modify
- Contact - Read, Modify (for lead status)
- Customer - Read (for statistics)
- "Contact Business Relation" - Read
- "Marketing Setup" - Read

**Pages:**
- All CRM pages - Execute permission
- Lead pages - Based on user role
- Activity pages - Based on user assignment

### Permission Set Setup

**Recommended Permission Sets:**

**CRM User:**
```
Table 50029 "CLE CRM Activity Entry" = RIMD
Table 5050 Contact = RM (no Insert/Delete)
Page 50101 "CLE CRM Activity Entries" = X
Page 50102 "CLE CRM Activity Page" = X
Page 50111 "CLE Lead Card" = X
```

**CRM Manager:**
```
All CRM User permissions +
Table 5050 Contact = RIMD (full access)
Codeunit 50030 "CLE Lead Management" = X
```

### Row-Level Security

**Scenario:** Users should only see their own activities

**Implementation:**
```al
// Use security filters on tables
Contact.SetRange("Salesperson Code", UserId);

// Or implement in page OnOpenPage
trigger OnOpenPage()
begin
    if not IsManager then
        Rec.FilterGroup(2);
        Rec.SetRange("User Responsible", UserId);
        Rec.FilterGroup(0);
end;
```

---

## Monitoring and Logging

### Activity Metrics to Monitor

**Key Metrics:**
- Activity creation rate (activities/day)
- Overdue activity count
- Average time to completion
- Activities by type distribution
- User activity volume
- Lead conversion rate
- Time from Lead to Converted

### Health Checks

**Daily Checks:**
1. Overdue activity count trending
2. Activities with no User Responsible
3. Leads stuck in statuses
4. Role center tile loading time

**Weekly Checks:**
1. Data quality metrics
2. User adoption rates
3. Lead conversion rates
4. Activity completion rates

**Monthly Checks:**
1. Performance review
2. Data integrity audit
3. User training needs
4. Feature usage analysis

### Logging Activity Changes

**Implement Change Log:**
```al
// Enable change log on critical fields
Table 50029 "CLE CRM Activity Entry":
- Status field
- Activity Date field
- User Responsible field

// Review change log for audit trail
```

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

**Restore All Activities for Contact:**
1. Filter backup by Record Type and Record No.
2. Export filtered set
3. Import into production
4. Verify Entry No. sequence doesn't conflict

**Rebuild CRM Data:**
If CRM data corrupted beyond recovery:
1. Restore from latest backup
2. Run data integrity checks (see above)
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
4. Verify table 50040 exists with all fields

**Temporary Workaround:**
1. Use CRM Entries list page directly (50101)
2. Use Leads page directly (50110)
3. Bypass role center tiles until fixed

### Issue: Mass Data Corruption

**Immediate Actions:**
1. Stop users from accessing CRM system
2. Identify scope of corruption
3. Restore from backup if available
4. Document what was lost since backup

**Prevention:**
- Regular backups (daily minimum)
- Transaction log backups
- Test restore procedures quarterly

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

## Development Best Practices

### Code Standards

**Activity Creation:**
```al
// Always use procedures, don't duplicate logic
// Good:
NewRecord."User Responsible" := CopyStr(UserId, 1, 50);

// Bad:
NewRecord."User Responsible" := UserId; // May truncate
```

**Status Management:**
```al
// Always use centralized status update
CLEGenFunctions.SetActivityStatus(CRMEntry);

// Don't:
CRMEntry.Status := CRMEntry.Status::Overdue; // Direct update
```

**BLOB Handling:**
```al
// Always use helper procedures
Rec.SetDescription(TextValue);
TextValue := Rec.GetDescription();

// Don't manipulate BLOB fields directly
```

### Testing Requirements

**Unit Tests:**
- Lead status transitions
- Activity status updates
- BLOB field operations
- FlowField calculations

**Integration Tests:**
- Contact to Customer conversion
- Activity transfer during conversion
- Role center tile calculations
- Business relation creation

**Performance Tests:**
- Large activity volume (10,000+ records)
- Multiple simultaneous users
- BLOB field with large content
- Complex FlowField calculations

---

## Troubleshooting Checklist

### Pre-Diagnosis Steps

- [ ] Identify affected users (single vs. multiple)
- [ ] Determine timing (always vs. specific scenario)
- [ ] Check for recent changes (code, data, config)
- [ ] Review error messages/logs
- [ ] Attempt to reproduce in test environment

### Common Diagnostic Commands

```al
// Check table exists and has data
CRMEntry.FindFirst();
Message('Entry No: %1', CRMEntry."Entry No.");

// Verify permissions
Message('Can Read: %1', CRMEntry.ReadPermission);
Message('Can Modify: %1', CRMEntry.ModifyPermission);

// Check filters
Message('GetFilters: %1', Rec.GetFilters);

// Verify UserId
Message('User: %1, Length: %2', UserId, StrLen(UserId));

// Check FlowField value
Rec.CalcFields("My Leads");
Message('My Leads: %1', Rec."My Leads");
```

---

## Support Contacts

**For Extension Issues:**
- Development Team: [Contact Info]
- System Administrator: [Contact Info]

**For Business Central Issues:**
- Microsoft Support
- Partner Support: [Partner Name/Contact]

**Escalation Path:**
1. IT Support (Level 1)
2. System Administrator (Level 2)
3. Development Team (Level 3)
4. Partner/Microsoft Support (Level 4)

---

## Document Version

**Last Updated:** February 13, 2026  
**Extension Version:** Based on current production code  
**Business Central Version:** Compatible with BC 26.x series

**Change Log:**
- Initial version created based on code analysis

---

## Related documents

- [[crm-lead-management-guide]]
- [[crm-activity-management-guide]]
