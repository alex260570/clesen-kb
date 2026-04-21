---
title: CRM Lead Management
type: howto
tags: [crm, leads, sales, qualification]
created: 2026-04-21
updated: 2026-04-21
sources: [crm-lead-management-guide.md]
---

# CRM Lead Management

Manage the lead lifecycle from initial contact through conversion to active customer.

## Lead Status Lifecycle

### Status Definitions

| Status | Description | Next Steps Available |
|--------|-------------|---------------------|
| **Lead** | Initial prospect/contact | → Cust. Application or Not Qualified |
| **Cust. Application** | Customer application submitted | → Converted or Not Qualified |
| **Converted** | Successfully converted to customer | None (final status) |
| **Not Qualified** | Determined not viable | → Lead (can restart process) |

### Status Flow Diagram

```
Lead → Cust. Application → Converted ✓
  ↓            ↓
  ↓            ↓
  └──→ Not Qualified ←──┘
         ↓
      Lead (restart)
```

## Creating a New Lead

### Starting the Process

**Navigation:** Search for "My Leads" or "CLE Leads"

**Action:** Click "New" → "Create Lead"

### Company Information (Required)

1. **Name** — Company legal name
2. **Name 2** — DBA or additional name (optional)
3. **Address** — Street address
4. **Address 2** — Suite/Building (optional)
5. **City** — City name
6. **Post Code** — ZIP code
7. **County** — State abbreviation (e.g., CA, TX)
8. **Phone No.** — Main business phone
9. **E-Mail** — Primary business email
10. **Home Page** — Company website (optional)
11. **Salesperson Code** — Assigned salesperson

### Contact Person Information (Optional)

You can add contact persons when creating the lead or later:

1. **Name** — Contact first and last name
2. **Name 2** — Middle name or suffix (optional)
3. **Job Title** — Contact's role
4. **Phone No.** — Direct phone line
5. **Mobile Phone No.** — Cell phone
6. **E-Mail** — Contact's email

**Note:** Contact person inherits company address unless you specify different address fields.

### After Creation

- Lead Card opens automatically
- Lead Status is set to "Lead"
- Salesperson assigned (defaults to your user if specified)
- System tracks data quality and shows warnings for missing critical information

## Working with Leads

### Lead Card Overview

The Lead Card displays all lead information organized into sections:

#### General Section
- **No.** — System-generated lead number (read-only)
- **Name/Address** — Company information with red warning if incomplete
- **Salesperson Code** — Who owns this lead
- **Customer Type** — Required before customer application
- **Status** — Current lead status (read-only)
- **No. of Open Opportunities** — Click to view/manage opportunities
- **Data Quality** — Visual indicator of information completeness

#### Communication Section
- Phone, mobile, email, website
- Links to open email client or dial phone (if integrated)

#### Contacts Section
- Shows all contact persons for this company
- Add new contacts: Click "New Contact"
- Edit contacts: Double-click line

### Data Quality Indicators

**Red Warning Fields** indicate missing required information:
- Name must be filled
- Address is incomplete
- Phone number missing
- Salesperson not assigned
- Customer Type not specified

**Fix:** Fill in the highlighted fields to remove warnings

## Adding Contact Persons

### For Existing Leads

1. Open the Lead Card
2. Navigate to "Contacts" section (bottom of page)
3. Click "Process" → "New Contact"
4. Fill in contact information
5. Click OK

**Tip:** Contact persons automatically inherit the company's lead status

### Multiple Contacts

- Add as many contacts as needed for the company
- Each contact can have different contact information
- All contacts share the same lead status as the company

## Activity Tracking

### Creating Activities

**From Lead Card:**
1. Click "CRM" → Choose activity type:
   - **Business Review** — Formal business review meetings
   - **Visit** — In-person customer visits
   - **Call** — Phone conversations
   - **To Do** — Tasks to complete
   - **Note** — General notes (no date tracking)

2. Fill in Activity Details:
   - **Activity Date** — When activity occurred or is scheduled
   - **Description** — Detailed notes (rich text editor)
   - **User Responsible** — Auto-filled with your username

3. Click back button to save

### Activity Status (Automatic)

The system automatically updates activity status based on the activity date:

| Status | Condition | What It Means |
|--------|-----------|---------------|
| **Planned** | Date is in future | Scheduled activity |
| **Due** | Date is today | Activity should happen today |
| **Overdue** | Date is in past | Activity not completed |
| **Finished** | Manually marked | Activity completed |
| **Canceled** | Manually marked | Activity canceled |

**Notes:** Notes have no status since they're not date-based.

### Viewing Activities

**On Lead Card:**
- Click "Navigate" → "CRM Entries"
- Shows all activities for this lead
- Most recent activities at top

**On Role Center:**
- "My Overdue Activities" tile — Past-due items
- "My Current Future Activities" tile — Today and future items

### Completing Activities

1. Open the activity from CRM Entries list
2. Click "Finish" or "Cancel" button
3. Confirm the action
4. Activity status updates and is removed from overdue counts

**Important:** You cannot change activity date to the past if marked as "Planned"

## Qualifying Leads

### Assigning Customer Type

Before requesting customer application, you must assign a Customer Type:

1. Open Lead Card
2. Locate "CLE Customer Type" field
3. Click dropdown and select appropriate type
4. Save the record

**Common Customer Types:**
- RETAIL — Retail customers
- WHOLESALE — Wholesale buyers
- DIRECT — Direct to consumer
- (Others based on your company's dimension setup)

### Requesting Customer Application

**When to Use:** Lead is qualified and ready to become a customer

**Steps:**
1. Ensure Customer Type is assigned
2. Click "Process" → "Request Customer Application"
3. Lead Status changes to "Cust. Application"

**What Happens:**
- Status locked to "Cust. Application"
- Lead submitted for approval/processing
- Cannot be modified back to "Lead" status
- Can still add activities and notes

## Converting to Customer

### Conversion Process

**Who Performs:** Typically accounting or sales management

**Steps:**
1. Open Lead Card (Status = "Cust. Application")
2. Verify all information is correct
3. Create customer in Business Central (standard process)
4. System automatically:
   - Changes lead status to "Converted"
   - Transfers all CRM activities to customer record
   - Adds Customer Type dimension (CUSTTYPE)
   - Adds Customer Class dimension (CUSTCLASS = C)
   - Links contact to customer

**After Conversion:**
- Lead status is "Converted" (permanent)
- All activities now appear on Customer Card
- Contact remains in system linked to customer
- Can continue tracking activities on customer record

## Managing Not Qualified Leads

### Marking as Not Qualified

**When to Use:**
- Lead doesn't meet qualification criteria
- Contact is no longer interested
- Duplicate lead or bad data
- Company went out of business

**Steps:**
1. Open Lead Card
2. Click "Process" → "Change Status" → "Not Qualified"
3. Confirm the action
4. Lead Status changes to "Not Qualified"

**Options After:**
- Can change back to "Lead" status if circumstances change
- Cannot convert directly to customer
- Can still view history and activities

## Managing Opportunities

### Creating Opportunities

Opportunities track potential sales and are linked to leads:

1. From Lead Card, click "Contact" → "Opportunities"
2. Click "New"
3. Fill in opportunity details:
   - Description
   - Sales cycle code
   - Estimated value
   - Estimated close date
   - Salesperson code
4. Save

### Viewing Open Opportunities

**On Lead Card:**
- "No. of Open Opportunities" field shows count
- Click the number to open Opportunities list
- Shows opportunities with Status = "Not Started" or "In Progress"

**On Role Center:**
- "My Overdue Opportunities" tile shows opportunities needing attention

## Best Practices

### Lead Data Quality

✅ **Do:**
- Fill in all required fields immediately
- Verify phone numbers and email addresses
- Assign proper Customer Type before application
- Keep contact information updated
- Log all significant interactions as activities

❌ **Don't:**
- Leave critical fields blank
- Create duplicate leads (search first)
- Skip salesperson assignment
- Forget to log activities and conversations

### Activity Management

✅ **Do:**
- Create activities for all customer interactions
- Use appropriate activity types
- Schedule follow-ups with future dates
- Mark activities as finished when complete
- Include detailed notes in descriptions

❌ **Don't:**
- Use Notes for time-sensitive tasks (use To Do instead)
- Forget to mark activities as finished
- Schedule activities in the past
- Leave activities overdue indefinitely

### Lead Qualification

✅ **Do:**
- Research company before creating lead
- Verify company is legitimate business
- Assign correct Customer Type
- Ensure all required data is complete
- Get approval before requesting customer application

❌ **Don't:**
- Rush through qualification process
- Create customer application without Customer Type
- Skip data validation steps
- Convert unqualified leads

## Searching and Filtering

### Finding Leads

**Search Options:**
1. Use global search bar — Type lead name or number
2. Navigate to "CLE Leads" page for full list
3. Use "My Leads" for your assigned leads only

### Common Filters

**By Status:**
- Click Status column header → Filter by value

**By Salesperson:**
- Click Salesperson Code column → Filter by your code

**By Data Quality:**
- Incomplete leads show with warning indicators

**By Date:**
- Last Modified date helps find recent changes

## Role Center Tiles

### My Leads
Shows count of leads and customer applications assigned to you.

**Click to:**
- View full list of your leads
- Filtered to Lead and Cust. Application statuses
- Filtered to your Salesperson Code

### My Customers
Shows count of customers assigned to you.

**Click to:**
- View customer list
- Filtered to your Salesperson Code

### My Overdue Activities
Shows count of activities past due.

**Click to:**
- View overdue activities list
- Filtered to your username
- Filtered to activities not Finished or Canceled
- Date filters to past dates only

### My Current Future Activities
Shows count of activities for today and future.

**Click to:**
- View current and upcoming activities
- Filtered to your username
- Filtered to activities not Finished or Canceled
- Date filters to today and future dates

### My Overdue Opportunities
Shows count of open opportunities needing attention.

**Click to:**
- View opportunity list
- Filtered to your Salesperson Code
- Filtered to Not Started or In Progress status

## Common Scenarios

### Scenario 1: New Lead from Phone Call

1. Prospect calls expressing interest
2. Create new lead with basic information gathered
3. Assign Customer Type based on conversation
4. Create "Call" activity with conversation notes
5. Create "To Do" activity for follow-up call next week
6. If qualified, request customer application

### Scenario 2: Trade Show Lead Follow-up

1. Create lead from business card information
2. Create "Visit" activity documenting trade show interaction
3. Create "Call" activity scheduled for 2 days out
4. When call complete, mark activity as finished
5. Create additional activities based on call outcome
6. Progress through qualification as appropriate

### Scenario 3: Lead Not Interested

1. Receive notification lead is not interested
2. Create "Note" activity documenting reason
3. Mark as "Not Qualified"
4. Lead remains in system for historical reference
5. Can be reactivated later if circumstances change

### Scenario 4: Converting High-Value Lead

1. Lead has been qualified through multiple activities
2. Ensure Customer Type is assigned
3. Request customer application
4. Accounting receives notification
5. Accounting creates customer in Business Central
6. System automatically converts lead to customer
7. All activities transfer to customer record
8. Continue relationship management on customer card

## Troubleshooting

### "Cannot change to this status"
**Cause:** Trying to make invalid status transition  
**Solution:** Review status flow diagram — may need to mark as Not Qualified first

### "Please assign a Customer Type first"
**Cause:** Attempting customer application without Customer Type  
**Solution:** Select Customer Type from dropdown before requesting application

### "You can't plan activities in the past"
**Cause:** Setting future activity date to past date  
**Solution:** Use current or future date, or create as Note instead

### Activities not showing on role center
**Cause:** Activities may be assigned to different user  
**Solution:** Check "User Responsible" field on activities — should be your username

### Lead showing red warnings
**Cause:** Missing required information  
**Solution:** Fill in fields highlighted in red (Name, Address, Phone, Salesperson, Customer Type)

## Related Pages

- [[crm-activity-management]] — Activity tracking and workflow
