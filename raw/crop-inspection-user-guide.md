# Crop inspection user guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Growers, greenhouse managers, quality control
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Creating inspection records](#creating-inspection-records)
- [Recording findings](#recording-findings)
- [Triggering corrective actions](#triggering-corrective-actions)
- [Linking to production orders](#linking-to-production-orders)
- [Inspection scheduling](#inspection-scheduling)
- [Quality issue logging](#quality-issue-logging)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Crop Inspection system enables greenhouse and field staff to systematically document crop condition, quality issues, and corrective actions. This creates a comprehensive quality control audit trail and ensures issues are tracked and resolved.

### Purpose and benefits

- **Quality assurance:** Document findings for every crop inspection
- **Issue tracking:** Create and track corrective actions from initial observation to resolution
- **Compliance:** Maintain inspection records for regulatory and customer audits
- **Traceability:** Link inspections directly to production orders
- **Scheduling:** Organize inspections by date and location

### Prerequisites

- Grower, greenhouse manager, or quality control role
- Access to the Clesen Horticulture system
- Production orders created for the crops being inspected
- Understanding of crop condition codes for your operation

## Creating inspection records

### Starting a new inspection

1. Navigate to **Production** > **Crop Inspections**.
2. Click **New** to create a new inspection record.
3. Enter the following information:
   - `Inspection Date`: Today's date or the inspection date
   - `Facility/Location`: The greenhouse or field location where inspection occurred
   - `Inspector Name`: Your name or the person conducting the inspection
   - `Production Order No.` (optional): Link to a specific production order if inspecting a particular batch
   - `Crop/Item`: Select the primary crop being inspected
4. Click **OK** to create the inspection record.

### Setting the inspection scope

After creating the inspection:

1. Click **Edit** to open the inspection record.
2. Complete the scope section:
   - `Inspection Type`: Select from predefined types (e.g., General Health, Pest/Disease, Environmental)
   - `Area Inspected`: Describe the area covered (e.g., "Section A, Rows 1-5")
   - `Total Plants Inspected`: Number of plants examined
3. Click **Save**.

## Recording findings

### Documenting crop conditions

1. On the inspection record, click **Add Finding**.
2. In the findings section, record:
   - `Finding Date`: Date of this specific observation
   - `Condition Code`: Select from available codes (e.g., "Healthy", "Wilting", "Yellowing", "Pest Damage")
   - `Severity`: Rate the finding:
     - **Minor:** Isolated instances, <5% of plants affected
     - **Moderate:** 5-20% of affected plants
     - **Major:** 20-50% of affected plants
     - **Critical:** >50% of plants affected
   - `Description`: Provide details about what was observed
   - `Affected Area/Quantity`: Estimate the area or number of plants affected
3. (Optional) Attach a photo for visual documentation.
4. Click **Save Finding**.

### Multiple findings per inspection

You can record multiple findings on a single inspection:

1. For each finding, click **Add Finding** again.
2. Enter the condition, severity, and description.
3. Click **Save Finding** after each entry.

The inspection maintains a chronological list of all findings recorded.

## Triggering corrective actions

### Creating corrective actions from findings

1. On the inspection record, select a finding that requires action.
2. Click **Create Corrective Action**.
3. In the corrective action form, enter:
   - `Action Type`: Select the type of action needed (e.g., "Pesticide Application", "Irrigation Adjustment", "Plant Removal", "Environmental Correction")
   - `Priority`: Set urgency level (Urgent, High, Normal, Low)
   - `Assigned To`: Select the staff member responsible
   - `Due Date`: Set the deadline for completing the action
   - `Description`: Provide clear instructions for the corrective action
4. Click **Save Action**.

### Tracking corrective action status

1. Navigate to **Production** > **Corrective Actions**.
2. View the list of all active corrective actions.
3. Click on a specific action to view:
   - Current status (Open, In Progress, Completed, Cancelled)
   - Assigned staff member
   - Due date and priority
   - Linked crop inspection

### Completing corrective actions

1. Open the corrective action record.
2. Update the `Status` to **In Progress** when work begins.
3. Schedule the completion:
   - Note any blockers or issues that delay completion
   - Reschedule if needed
4. When complete, update `Status` to **Completed**.
5. Add a completion note describing what was done (optional but recommended).
6. Click **Save**.

## Linking to production orders

### Associating inspections with production orders

1. When creating an inspection, if you know the production order number, enter it in the `Production Order No.` field.
2. This creates a link between the inspection and the order for complete traceability.

### Viewing inspections by production order

1. Open a **Production Order**.
2. Click **Related** > **Inspections** to see all inspections for this order.
3. Click on any inspection to view details and findings.

### Bulk inspections across multiple orders

If conducting a general crop inspection that covers multiple production orders:

1. Create the inspection without selecting a specific `Production Order No.`.
2. In the findings, note which orders are affected.
3. You can link the inspection to multiple orders manually if needed.

## Inspection scheduling

### Creating inspection schedules

1. Navigate to **Production** > **Inspection Schedules**.
2. Click **New** to create a schedule.
3. Enter:
   - `Crop/Item`: The item to be inspected regularly
   - `Inspection Frequency`: Select daily, weekly, or bi-weekly
   - `Day(s) of Week`: Select which days inspections should occur
   - `Preferred Time`: Suggest a time for consistency
   - `Assigned Inspector`: Primary staff member responsible
   - `Facility/Location`: Where inspections occur
4. Click **OK** to save the schedule.

### Following inspection schedules

1. The system creates inspection reminders based on the schedule.
2. On scheduled days, open the inspection reminder notification.
3. Click **Create Inspection** to generate a new inspection record for the day.
4. Conduct the inspection and record findings as normal.

## Quality issue logging

### Logging unexpected quality issues

Outside of scheduled inspections, you can immediately log quality issues:

1. Navigate to **Production** > **Quality Issues**.
2. Click **New** to create an issue record.
3. Enter:
   - `Issue Date`: Date the issue was discovered
   - `Issue Type`: Select from predefined types (Pest, Disease, Environmental, Equipment, Other)
   - `Crop/Item`: The affected crop
   - `Production Order No.`: Link to affected order if known
   - `Severity`: Rate as Minor, Moderate, Major, or Critical
   - `Description`: Provide detailed description
   - `Reported By`: Your name
4. Click **OK**.
5. The system may automatically create a corrective action if the severity is high.

### Escalating quality issues

If an issue is critical:

1. Open the quality issue record.
2. Click **Escalate** to notify management.
3. Select recipients from a predefined list (Greenhouse manager, Quality director, etc.).
4. Provide escalation notes explaining the urgency.
5. Click **Send Notification**.

## Troubleshooting

### Issue: Inspection record not saving

**Problem:** When attempting to save an inspection, an error occurs.

**Solutions:**
1. Verify required fields are completed (Inspection Date, Facility/Location, Inspector Name)
2. Try refreshing the page and saving again
3. Check your internet connection for timeout issues
4. Contact IT support if the problem persists

### Issue: Cannot link to production order

**Problem:** The `Production Order No.` field is blank or not accepting input.

**Solutions:**
1. Verify the production order exists and is not deleted
2. Ensure the order is for the same crop/item being inspected
3. Type the exact order number (partial matches may not work)
4. Manually link the inspection afterward by editing the production order

### Issue: Corrective action not appearing in action list

**Problem:** A corrective action was created but doesn't appear in the main list.

**Solutions:**
1. Check if the action status is "Cancelled" (cancelled actions may be hidden by default)
2. Verify the action was actually saved (confirmation message should appear)
3. Refresh the page or clear browser cache
4. Apply filters to see all actions (including completed and cancelled)

### Issue: Photos not attaching to findings

**Problem:** Photo attachment fails when adding crop images.

**Solutions:**
1. Verify the file is under 5MB in size
2. Use supported formats: JPG, PNG, or GIF
3. Try uploading directly rather than drag-and-drop if available
4. Contact IT support if photos still won't attach

## FAQ

**Q: How do I correct a finding I recorded incorrectly?**
A: Open the inspection record, locate the incorrect finding, click **Edit Finding**, make your corrections, and click **Save**. The system maintains an edit timestamp for audit purposes.

**Q: Can I modify an inspection after marking it complete?**
A: Yes. Inspections can be reopened for editing even after completion. Click **Edit** on the completed inspection to make changes. Consider adding a note explaining why the inspection was modified.

**Q: What condition codes should I use?**
A: Condition codes are configured by your organization. Common examples include: Healthy, Wilting, Yellowing, Yellowing with Spotting, Pest Damage, Disease Symptoms, Stunted Growth. Ask your greenhouse manager or quality director for the approved list.

**Q: How long does inspection data stay in the system?**
A: Inspection records are retained indefinitely for traceability and compliance. Historical data can be archived if needed to improve system performance.

**Q: Can multiple people contribute findings to one inspection?**
A: Yes. Multiple inspectors can add findings to the same inspection record. Each finding records who entered it and when.

**Q: What's the difference between a Crop Inspection and a Scouting Report?**
A: Crop Inspections are formal, scheduled quality assessments. Scouting Reports are field-based observations that can trigger immediate action (like stage advancement). Contact your greenhouse manager if you're unsure which to use.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/crop-inspection-user-guide.pdf)
