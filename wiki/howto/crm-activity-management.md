---
title: CRM Activity Management
type: howto
tags: [crm, activities, customer-management, relationship]
created: 2026-04-21
updated: 2026-04-21
sources: [crm-activity-management-guide.md]
---

# CRM Activity Management

Comprehensive tracking of all interactions with contacts, customers, and vendors.

## Activity Types

### Daily Activities

| Activity Type | When to Use | Example |
|--------------|-------------|---------|
| **Business Review** | Formal quarterly or annual business reviews | Q1 Business Review Meeting — discussed volume commitments and pricing |
| **Visit** | In-person visits to customer location or trade shows | Visited greenhouse facility, toured growing operations |
| **Call** | Phone conversations | Called to discuss shipping delays on PO 12345 |
| **To Do** | Tasks that need completion | Prepare pricing proposal for spring season |
| **Note** | General information without time tracking | Customer prefers morning deliveries |

### Strategic Planning

| Entry Type | Purpose | Time Horizon |
|-----------|---------|--------------|
| **One Year Plan** | Annual strategic goals and initiatives | Current year |
| **3 Year Strategy** | Long-term vision and major objectives | 3-year outlook |

## Creating Activities

### From Contact or Customer Card

1. Open Contact/Customer/Vendor Card
2. Click "CRM" menu → Select activity type
3. Activity card opens pre-filled with:
   - **Record Type** — Contact/Customer/Vendor (automatic)
   - **Record No.** — The contact/customer number (automatic)
   - **User Responsible** — Your username (automatic)
4. Fill in activity details
5. Navigate back to save

### From CRM Entries List

1. Search for "CRM Entries" or "CRM Activity Entries"
2. Apply filter to your contact/customer (or leave blank for new)
3. Click appropriate activity button:
   - Business Review
   - Visit
   - Call
   - To Do
   - Note
4. Fill in details
5. Save

### Quick Entry Tips

✅ **Required Fields:**
- Entry Type (selected when creating)
- Activity Date (except for Notes)

✅ **Auto-Filled:**
- Record Type and Record No. (if created from card)
- User Responsible (your username)
- Entry No. (system generated)

## Activity Details

### Activity Date Field

**Purpose:** Tracks when activity occurred or should occur

**Behavior by Activity Type:**

**Business Review/Visit/Call/To Do:**
- **Past Date** — Historical activity
- **Today** — Due today
- **Future Date** — Scheduled activity (marked as Planned)

**Note:**
- Date not required
- Always shows current date but has no status

**Important Rules:**
- Cannot set future date in the past (validation error)
- Date determines automatic status updates

### Activity Description

**Rich Text Editor Features:**
- Multi-line text entry
- Stores detailed conversation notes
- Character limit: Based on field configuration
- Automatically saved when navigating away

**Best Practices:**
- Include date and time of interaction
- Document key discussion points
- Note any commitments made
- Include names of people involved
- Reference related documents (POs, quotes, etc.)

**Example Format:**
```
2/13/2026 10:30 AM — Call with John Smith

Topics Discussed:
- Spring order timing — wants delivery week of 3/15
- Pricing for new rose varieties 
- Shipping requirements — needs liftgate

Action Items:
- Send updated spring catalog by 2/20
- Quote on 500 units rose variety #1234
- Schedule delivery for 3/15 morning slot

Next Follow-up: 2/20/2026
```

## Activity Status

### Automatic Status Management

The system updates activity status **automatically each day** based on the activity date:

| Status | When Assigned | Visual Indicator |
|--------|---------------|------------------|
| **Blank** | Note (no date) | Grey |
| **Planned** | Date is in future | Blue |
| **Due** | Date is today | Yellow |
| **Overdue** | Date is past and not finished | Red |
| **Finished** | Manually marked complete | Green |
| **Canceled** | Manually marked canceled | Grey strikethrough |

### Status Transitions

```
[Created] → Planned → Due → Overdue
                ↓      ↓      ↓
                ↓      ↓      ↓
              Finished or Canceled (manual)
```

**Key Points:**
- Status updates happen overnight
- Finished/Canceled are permanent states
- Activities don't auto-complete
- Overdue activities stay overdue until manually resolved

### Manual Status Changes

**Mark as Finished:**
1. Open activity from CRM Entries list
2. Click "Finish" button
3. Confirm action
4. Status changes to Finished
5. Activity removed from overdue/due counts

**Mark as Canceled:**
1. Open activity from CRM Entries list
2. Click "Cancel" button
3. Confirm action
4. Status changes to Canceled
5. Activity removed from active counts

**Cannot Change:**
- Cannot revert from Finished to active
- Cannot revert from Canceled to active
- Must create new activity if needed

## Viewing Activities

### From Record Card (Contact/Customer/Vendor)

**Navigate Menu → CRM Entries**
- Shows all activities for that record
- Sorted by most recent first
- Filter to specific activity types using filters
- Edit any activity by clicking "Edit" button

### Factbox on Card Pages

**CRM Last Activity Factbox:**
- Shows most recent activity
- Displays activity type and date
- Shows first few lines of description
- Quick reference without opening list

**CRM Statistics Factbox:**
- Count of total activities
- Count of overdue activities
- Count of planned activities
- Visual indicators for issues

### CRM Entries List Page

**Search:** "CRM Entries" or "CRM Activity Entries"

**Features:**
- View all activities across all records
- Filter by Record Type (Contact/Customer/Vendor)
- Filter by Record No.
- Filter by User Responsible
- Filter by Activity Type
- Filter by Status
- Filter by date ranges

**Common Filters:**

**My Activities:**
```
User Responsible = [Your Username]
```

**Overdue Items:**
```
Status = Overdue
User Responsible = [Your Username]
```

**Specific Customer:**
```
Record Type = Customer
Record No. = [Customer No.]
```

### Role Center Tiles

**My Overdue Activities:**
- Count of past-due activities
- Assigned to you
- Not finished or canceled
- Click to view filtered list

**My Current Future Activities:**
- Count of today and future activities
- Assigned to you
- Not finished or canceled
- Click to view filtered list

## Strategy Planning

### Creating Strategy Entries

**Purpose:** Document long-term strategic planning for key accounts

**Types:**
- **One Year Plan** — Annual goals and initiatives
- **3 Year Strategy** — Multi-year vision

**Steps:**
1. From Contact/Customer Card → CRM → Strategy Entries
2. Click "New"
3. System creates entry with:
   - **Year** — Current year + 1 (auto-increments from last entry)
   - **Type** — Strategy (automatic)
   - **Record Type** — Contact/Customer (automatic)
4. Fill in strategy details using rich text editors:
   - One Year Plan field
   - 3 Year Strategy field
5. Save

### Viewing Strategy Entries

**From CRM Entries List:**
1. Search "CRM Entries"
2. Toggle view to "Strategy" (button at top)
3. Shows strategy entries only
4. Sorted by year descending

**Strategy View Columns:**
- Year
- One Year Plan (excerpt)
- 3 Year Strategy (excerpt)

**Edit Strategy:**
- Click "Edit" to open full editor
- Modify One Year Plan or 3 Year Strategy
- Save changes

### Strategy Planning Best Practices

✅ **Include in Strategy:**
- Volume commitments and targets
- Pricing strategies
- Product mix goals
- Market expansion plans
- Relationship development objectives
- Investment requirements
- Risk mitigation plans

✅ **Review Schedule:**
- Update annually during business review meetings
- Reference during quarterly check-ins
- Compare actual performance against plan
- Document lessons learned

## Activity Management Best Practices

### When to Create Activities

**Always Create Activity For:**
- Customer phone calls (except quick confirmations)
- In-person visits
- Business review meetings
- Commitments made or received
- Pricing discussions
- Order issues or complaints
- Strategic planning sessions

**Consider Creating Activity For:**
- Email conversations (major topics)
- Trade show interactions
- Competitive intelligence gathered
- Market feedback

**Don't Create Activity For:**
- Routine order entry (system tracks orders)
- Standard confirmations
- Internal team discussions
- Administrative tasks

### Activity Type Selection Guide

**Use Business Review When:**
- Formal scheduled review meeting
- Annual or quarterly review
- Discussing performance metrics
- Strategic planning discussion

**Use Visit When:**
- Physical visit to customer location
- Customer visits your facility
- Meeting at trade show
- Face-to-face interaction

**Use Call When:**
- Phone conversation
- Video call
- Any remote voice communication

**Use To Do When:**
- Action item for yourself
- Task needs completion
- Deadline-driven work
- Follow-up required

**Use Note When:**
- General information
- No time component
- Reference data
- Preferences or special instructions

### Writing Effective Activity Descriptions

**Include:**
✅ Date and time of interaction  
✅ Names of people involved  
✅ Purpose of activity  
✅ Key discussion points  
✅ Decisions made  
✅ Action items (who, what, when)  
✅ Next steps or follow-up needed  
✅ References (PO numbers, quote numbers, etc.)  

**Avoid:**
❌ Vague descriptions ("called customer")  
❌ Missing context or details  
❌ No action items  
❌ Unclear next steps  

## Activity Workflow Examples

### Scenario 1: Scheduled Customer Call

**Day 1 — Schedule:**
1. Create To Do activity
2. Set Activity Date to next Monday
3. Description: "Call John Smith to discuss spring orders"
4. Status automatically set to Planned

**Day 7 — Monday Morning:**
- Activity appears in "My Current Future Activities" as Due
- Shows up in overdue if not completed by end of day

**Day 7 — After Call:**
1. Open the To Do activity
2. Click "Finish"
3. Create new Call activity documenting the conversation
4. If follow-up needed, create new To Do with future date

### Scenario 2: Trade Show Follow-up

**At Trade Show:**
1. Collect business card
2. Create Visit activity on phone
3. Document conversation while fresh
4. Note product interests

**Next Day:**
1. Review Visit activities from show
2. Create To Do for each promising lead
3. Schedule calls for follow-up
4. Assign appropriate dates

**Follow-up Week:**
1. Calls show as Due on scheduled days
2. Complete calls, mark as Finished
3. Create additional activities based on conversation
4. Progress promising leads through qualification

### Scenario 3: Annual Planning

**Before Business Review:**
1. Review previous year's Strategy entry
2. Prepare performance analysis
3. Create To Do for each preparation item

**During Business Review:**
1. Create Business Review activity
2. Document entire meeting discussion
3. Note all commitments and goals

**After Business Review:**
1. Create new Strategy entry for coming year
2. Document One Year Plan based on meeting
3. Update 3 Year Strategy as discussed
4. Create To Do activities for each action item
5. Schedule next review

## Filtering and Searching

### Quick Filters

**My Open Activities:**
```
User Responsible: [Your Username]
Status: <> Finished & <> Canceled
```

**This Week's Activities:**
```
Activity Date: [Start of Week]..[End of Week]
```

**Customer History:**
```
Record Type: Customer
Record No.: [Customer No.]
Sort: Activity Date descending
```

**Overdue by Type:**
```
Status: Overdue
Activity Type: [specific type]
```

## Related Pages

- [[crm-lead-management]] — Lead qualification and conversion
