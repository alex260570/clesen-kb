---
title: Crop Inspection
type: howto
tags: [items, quality-control, grower-operations, compliance]
created: 2026-04-21
updated: 2026-04-21
sources: [crop-inspection-user-guide.md]
---

# Crop Inspection

Formal quality assessment and corrective action tracking for crops in production.

## What Is Crop Inspection?

**Crop Inspection** is a scheduled quality control process where greenhouse and field staff systematically document crop condition, identify issues, and track corrective actions to resolution.

**Key purpose:** Maintain a comprehensive quality control audit trail linked to production orders for compliance, traceability, and issue resolution.

**Differs from Scouting Reports:** Inspections are for quality observation and grading (field-based); Scouting Reports are for inventory location visibility (picking planning).

## Creating Inspection Records

### Starting a New Inspection

1. Navigate to **Production** → **Crop Inspections**
2. Click **+ New** to create a new inspection record
3. Fill in the header:
   - **Inspection Date** — Today or the inspection date
   - **Facility/Location** — The greenhouse or field location
   - **Inspector Name** — Your name or conducting staff member
   - **Production Order No.** (optional) — Link to specific production order if inspecting a batch
   - **Crop/Item** — Select the primary crop being inspected
4. Click **OK** to create

### Setting the Inspection Scope

After creating the inspection:

1. Click **Edit** to open the record
2. Complete the scope section:
   - **Inspection Type** — Select from predefined types (General Health, Pest/Disease, Environmental, etc.)
   - **Area Inspected** — Describe the coverage (e.g., "Section A, Rows 1-5")
   - **Total Plants Inspected** — Number of plants examined
3. Click **Save**

## Recording Findings

### Documenting Crop Conditions

1. On the inspection record, click **Add Finding**
2. In the findings section, record:

| Field | Description | Format |
|-------|-------------|--------|
| **Finding Date** | Date of observation | Today or past date |
| **Condition Code** | What was observed | Healthy, Wilting, Yellowing, Yellowing with Spotting, Pest Damage, Disease Symptoms, Stunted Growth |
| **Severity** | Impact level | Minor (<5%), Moderate (5-20%), Major (20-50%), Critical (>50%) |
| **Description** | Detailed observation | Free text, any length |
| **Affected Area/Qty.** | How many plants | Estimate area or count |
| **Photo** (optional) | Visual documentation | JPG, PNG, GIF (max 5MB) |

3. Click **Save Finding** to record

### Multiple Findings per Inspection

You can record multiple findings on one inspection:

1. For each finding, click **Add Finding** again
2. Enter the condition, severity, and description
3. Click **Save Finding** after each entry
4. Inspection maintains chronological list

**Example:** One inspection could find both "Yellowing (Moderate)" and "Pest Damage (Minor)" on different plant areas.

## Triggering Corrective Actions

### Creating Corrective Actions from Findings

1. On the inspection record, select a finding that requires action
2. Click **Create Corrective Action**
3. In the corrective action form, enter:

| Field | Description | Example |
|-------|-------------|---------|
| **Action Type** | What intervention needed | Pesticide Application, Irrigation Adjustment, Plant Removal, Environmental Correction |
| **Priority** | Urgency level | Urgent, High, Normal, Low |
| **Assigned To** | Responsible staff member | Name from dropdown |
| **Due Date** | Completion deadline | 2-5 days out, depending on priority |
| **Description** | Clear instructions | "Apply fungicide spray to Section A, Rows 1-5" |

4. Click **Save Action**

### Tracking Corrective Action Status

1. Navigate to **Production** → **Corrective Actions**
2. View all active corrective actions with:
   - Current status (Open, In Progress, Completed, Cancelled)
   - Assigned staff member
   - Due date and priority
   - Linked crop inspection

3. Click on a specific action to view details

### Completing Corrective Actions

1. Open the corrective action record
2. Update **Status** to **In Progress** when work begins
3. Note any blockers or reschedule if needed
4. When complete, update **Status** to **Completed**
5. Add a completion note describing what was done (recommended)
6. Click **Save**

## Linking to Production Orders

### Associating Inspections with Orders

When creating an inspection, if you know the production order number:

1. Enter it in the **Production Order No.** field
2. This creates a complete traceability link between inspection and order

### Viewing Inspections by Production Order

1. Open a **Production Order**
2. Click **Related** → **Inspections**
3. See all inspections for this order
4. Click any inspection to view findings and actions

### Bulk Inspections Across Multiple Orders

If conducting a general inspection covering multiple orders:

1. Create the inspection without selecting a specific **Production Order No.**
2. In the findings, note which orders are affected
3. You can link the inspection to multiple orders manually if needed

## Inspection Scheduling

### Creating Inspection Schedules

1. Navigate to **Production** → **Inspection Schedules**
2. Click **+ New** to create a schedule
3. Fill in:
   - **Crop/Item** — The item to inspect regularly
   - **Inspection Frequency** — Daily, weekly, or bi-weekly
   - **Day(s) of Week** — Which days inspections occur
   - **Preferred Time** — Time of day for consistency
   - **Assigned Inspector** — Primary staff member
   - **Facility/Location** — Where inspections occur
4. Click **OK** to save

### Following Inspection Schedules

1. System creates inspection reminders based on the schedule
2. On scheduled days, you receive an inspection reminder notification
3. Click **Create Inspection** to generate a new inspection record
4. Conduct the inspection and record findings as normal

**Benefit:** Consistent quality tracking on a predictable schedule.

## Quality Issue Logging

### Logging Unexpected Quality Issues

Outside of scheduled inspections, immediately log urgent quality issues:

1. Navigate to **Production** → **Quality Issues**
2. Click **+ New** to create an issue record
3. Enter:
   - **Issue Date** — Date discovered
   - **Issue Type** — Pest, Disease, Environmental, Equipment, Other
   - **Crop/Item** — The affected crop
   - **Production Order No.** — Link to affected order if known
   - **Severity** — Minor, Moderate, Major, or Critical
   - **Description** — Detailed description
   - **Reported By** — Your name
4. Click **OK**
5. System may automatically create a corrective action if severity is high

### Escalating Quality Issues

If an issue is critical:

1. Open the quality issue record
2. Click **Escalate** to notify management
3. Select recipients (Greenhouse Manager, Quality Director, etc.)
4. Provide escalation notes explaining urgency
5. Click **Send Notification**

**Use for:** Equipment failures, widespread disease outbreaks, safety concerns, customer complaints.

## Best Practices

✅ **DO:**
- Conduct scheduled inspections on a consistent basis
- Record detailed descriptions of findings (not just codes)
- Link inspections to production orders for traceability
- Follow corrective actions through to completion
- Document photo evidence for critical findings
- Communicate critical issues immediately (escalate)
- Review inspection history to identify patterns
- Train staff on condition codes and severity rating criteria

❌ **DON'T:**
- Skip scheduled inspections or record generic findings
- Leave corrective actions incomplete
- Inspect without linking to production orders (loses traceability)
- Record findings without descriptions
- Delay escalating critical issues
- Modify completed inspections without documentation
- Create duplicate inspections for same date/location/crop

## Common Inspection Scenarios

### Scenario 1: Routine Health Check

**Goal:** Daily general health inspection of roses in Greenhouse A

**Process:**
1. Create inspection: Inspection Type = "General Health", Area = "Greenhouse A"
2. Record findings: Healthy, Minor pest spotting in Section B, Normal irrigation
3. No corrective actions needed
4. Save

**Result:** Health check documented for audit trail

### Scenario 2: Responding to Pest Infestation

**Goal:** Roses in Section C show spider mite damage (15% of plants)

**Process:**
1. Create inspection: Area = "Section C", Inspector = Grower
2. Record finding: Condition = "Pest Damage", Severity = Major (15% affected)
3. Create corrective action: Type = "Pesticide Application", Priority = High, Due = Tomorrow
4. Assign to IPM specialist, provide detailed spray instructions

**Result:** Issue tracked and action assigned to responsible person

### Scenario 3: Environmental Issue

**Goal:** HVAC failure caused excessive humidity overnight

**Process:**
1. Create quality issue immediately: Type = "Equipment", Severity = Critical
2. Escalate to Facility Manager
3. Later inspect affected crop areas
4. Document findings by section
5. Create corrective actions for affected plants

**Result:** Emergency documented, repairs initiated, damage assessed

## Troubleshooting

### Issue: Inspection Record Not Saving

**Cause:** Required fields incomplete, internet timeout, or system error

**Solution:**
1. Verify all required fields are filled (Inspection Date, Facility/Location, Inspector Name)
2. Try refreshing the page and saving again
3. Check internet connection
4. Contact IT support if problem persists

### Issue: Cannot Link to Production Order

**Cause:** Order doesn't exist, order is wrong crop, or field not accepting input

**Solution:**
1. Verify production order exists and is not deleted
2. Ensure order is for same crop/item being inspected
3. Type exact order number (partial matches may not work)
4. Manually link the inspection afterward by editing the production order

### Issue: Corrective Action Not Appearing in List

**Cause:** Action status is "Cancelled", action wasn't saved, or browser cache issue

**Solution:**
1. Check if action status is "Cancelled" (hidden by default)
2. Verify action was actually saved (confirmation message should appear)
3. Refresh page or clear browser cache
4. Apply filters to see all actions including completed/cancelled

### Issue: Photos Not Attaching

**Cause:** File too large, unsupported format, or upload issue

**Solution:**
1. Verify file is under 5MB
2. Use supported formats: JPG, PNG, or GIF
3. Try direct upload instead of drag-and-drop
4. Contact IT support if photos still won't attach

## Related Pages

- [[scouting-reports]] — Inventory visibility tool for picking planning
- [[blooming-stages]] — Plant lifecycle tracking system
- [[blooming-stages-it-troubleshooting]] — Technical architecture for blooming stages
