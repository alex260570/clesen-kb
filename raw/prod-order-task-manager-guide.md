# Production Order Tasks - Manager Guide

## Overview

The Production Order Task system allows you to create standardized checklists that automatically apply to production orders. This ensures consistent quality control and operational procedures across all production activities.

## Table of Contents

1. [Creating Task Templates](#creating-task-templates)
2. [Assigning Templates to Items](#assigning-templates-to-items)
3. [Managing Production Order Tasks](#managing-production-order-tasks)
4. [Approving Tasks](#approving-tasks)
5. [Monitoring and Reporting](#monitoring-and-reporting)
6. [Troubleshooting](#troubleshooting)

---

## Creating Task Templates

Task templates are reusable checklists that can be assigned to items. When a production order is created for an item with a template, the tasks are automatically copied to the production order.

### Step 1: Access Task Templates

1. Open **Prod. Order Task Templates** from the search
2. Click **New** to create a new template

### Step 2: Define Template Header

1. Enter a unique **Code** (e.g., "FLOWER-PREP", "POTTING-STD")
2. Enter a descriptive **Description** (e.g., "Standard Flower Preparation Tasks")
3. **Important:** You must enter the Code before you can add task lines

### Step 3: Add Task Lines

Once you've saved the template header with a Code, the Lines section becomes available.

#### Task Line Types

There are three types of task lines:

| Type | Purpose | Appearance | Auto-Approve |
|------|---------|------------|--------------|
| **Headline** | Section header to organize tasks | Bold, no indentation | Yes |
| **Task** | Actual work item requiring completion | Indented, normal text | No |
| **Information** | Reference information or notes | Indented, normal text | N/A |

#### Adding Lines

1. Click in the Lines section
2. Select **Line Type** (Headline, Task, or Information)
3. Enter **Description** (what needs to be done)
4. For Tasks requiring timing:
   - Set **Belongs to Routing Link** (if task relates to a routing step)
   - Set **Due Date Calc. Based on Field** (what date to calculate from)
   - Set **Due Date Calc. Formula** (e.g., "-2D" for 2 days before)
5. For Tasks that don't need approval, check **Auto Approve**

#### Due Date Calculation Options

| Option | Description | Example |
|--------|-------------|---------|
| Prod. Order Due Date | Based on production order due date | "-1D" = 1 day before due date |
| Prod. Order Line Start Date | Based on line starting date | "+0D" = same as start date |
| Prod. Order Line End Date | Based on line ending date | "-2D" = 2 days before end |
| Prod. Order Routing Start Date | Based on routing operation start | "-1D" = 1 day before routing starts |
| Prod. Order Routing End Date | Based on routing operation end | "+0D" = when routing ends |
| Before next Routing Start Date | Before the next routing operation | "-3D" = 3 days before next op |

#### Example Template Structure

```
[Headline] Preparation Phase
    [Task] Inspect raw materials - Auto Approve: No, Due: -2D before Line Start
    [Task] Prepare workstation - Auto Approve: Yes, Due: -1D before Line Start
    [Information] Quality standards document: QS-2024-01

[Headline] Production Phase
    [Task] Initial quality check - Auto Approve: No, Due: +0D at Routing Start
    [Task] Mid-process inspection - Auto Approve: No, Due: +1D after Routing Start
    
[Headline] Completion Phase
    [Task] Final inspection - Auto Approve: No, Due: -1D before Routing End
    [Task] Clean and sanitize area - Auto Approve: Yes, Due: +0D at Routing End
```

### Step 4: Copy from Existing Template (Optional)

If you want to base a template on an existing one:

1. Click **Copy From Template** action
2. Select the source template
3. All lines will be copied to your new template
4. Modify as needed

---

## Assigning Templates to Items

Once templates are created, assign them to items so production orders automatically receive the tasks.

### Assignment Steps

1. Open the **Item Card** for the product
2. Locate the **CLE Prod. Order Task Template** field
3. Select the appropriate template from the lookup
4. Save the item card

### Important Notes

- Only items with an assigned template will have tasks created
- If an item has no template assigned, production orders will have no tasks
- You can change the template on an item at any time (only affects new production orders)

---

## Managing Production Order Tasks

### Viewing Tasks on Production Orders

Production orders display task information in several locations:

#### On the Production Order Card

1. **General Tab**: The "Prod. Order Task List" field shows which template is assigned
2. **FactBox**: Shows released tasks with completion status
3. **Related Menu**: Click "Tasks" to open the full task list

#### Task List View

From Related > Tasks, you can see:
- All task lines (Headlines, Tasks, Information)
- Due dates for each task
- Released status
- Completion status
- Bold formatting for Headlines

### Changing or Removing Task Templates

You can change the task template on a production order:

#### To Change Templates

1. Open the Production Order
2. Change the **CLE Prod. Order Task List** field
3. Confirm to replace existing tasks with the new template

**Important:** You cannot change the template if any tasks are marked as completed. This protects historical data.

#### To Remove Tasks

1. Open the Production Order
2. Clear the **CLE Prod. Order Task List** field
3. All task lines will be deleted

**Important:** You cannot remove tasks if any are marked as completed.

### Adding Manual Tasks

If you need to add additional tasks not in the template:

#### From Task Card (Edit Mode)

1. Open the Production Order
2. Click the **Prod. Order Tasks** action
3. Click **Edit Mode**
4. The template field becomes editable (if needed)
5. Click **Insert Below Selected** on the task line where you want to add
6. Select the line type (Headline, Task, or Information)
7. A task card opens - enter the description and details
8. The new task is marked as "Manual Line"

Manual tasks:
- Are inserted between existing tasks
- Can be any line type (Headline, Task, Information)
- Are marked as modified
- Will not be replaced if you refresh the production order

### Refreshing Production Orders

When you click **Refresh Production Order**:
- **If no tasks exist**: Tasks are created from the item's template (if assigned)
- **If tasks exist**: Due dates are recalculated based on updated production dates
- **Manual tasks**: Are preserved and updated
- **Modified tasks**: Are preserved

### Dynamic Field Updates

The system automatically updates task fields when production order fields change:

| Production Order Field | Updates Task Field | When |
|----------------------|-------------------|------|
| Location Code | Location Code | On all uncompleted tasks |
| Shortcut Dimension 2 Code (Facility) | Facility Code | On all uncompleted tasks |
| Due Date | Task due dates | On tasks with calculated due dates |
| Routing dates | Task due dates | On tasks linked to routing |

This ensures tasks stay synchronized with production order changes.

---

## Approving Tasks

Tasks must be approved (released) before staff can work on them. This ensures proper sequencing and quality control.

### Accessing the Approval Page

1. Search for **Production Order Tasks to Approve**
2. This shows all unreleased tasks across all production orders

### Approval Page Columns

| Column | Description |
|--------|-------------|
| Location Code | Where the production order is located |
| Prod. Order No. | Production order reference |
| Item No. | Item being produced |
| Description | Task description |
| Due Date | When the task should be completed |
| Released | Checkbox to approve the task |

### Approving Tasks

#### Individual Task Approval

1. Find the task in the list
2. Check the **Released** box
3. The task is now visible to staff

#### Bulk Approval

1. Filter the list (e.g., by Location Code or Due Date)
2. Select multiple tasks
3. Use bulk actions if available, or approve individually

### Auto-Approved Tasks

Some tasks are automatically approved when created:
- Tasks marked with **Auto Approve** in the template
- All **Headline** lines (automatically set)

These tasks appear as Released immediately and don't require manager approval.

### Finishing Approval

When all tasks for a production order are released:
- The system will prompt: "All tasks released. Do you want to finish approval and hide this Order from the list?"
- Click **Yes** to remove from the approval list
- The production order tasks remain visible in the task list, but won't appear in "Tasks to Approve"

---

## Monitoring and Reporting

### Task Worksheet

Open **Production Order Task Worksheet** to see:
- All tasks across all production orders
- Filtered to show only Tasks (not Headlines or Information)
- Sortable by due date, production order, item, etc.
- Completion status

### Task FactBox

On Production Order pages, the Task FactBox shows:
- Quick summary of released tasks
- Completion status
- Due dates
- Click a task to drill down

### Viewing Task History

Completed tasks remain on production orders and can be reviewed:
1. Open the Production Order
2. View Related > Tasks
3. Filter by Completed = Yes
4. See completion dates and who completed them

---

## Troubleshooting

### Issue: Tasks Not Created on New Production Orders

**Possible Causes:**
- Item has no task template assigned
- Template has no lines
- Production order has no lines yet

**Solution:**
1. Check the Item Card for "CLE Prod. Order Task Template"
2. If blank, assign a template
3. For existing production orders, manually set "CLE Prod. Order Task List" field

### Issue: Cannot Change Task Template

**Error:** "Cannot change or delete the task list because completed tasks exist for this production order."

**Cause:** At least one task is marked as completed

**Solution:** 
- This is by design to protect historical data
- You can only change templates on production orders with no completed tasks
- Consider creating a new production order if major changes are needed

### Issue: Cannot Add Task Lines to Template

**Cause:** Template Code field is blank

**Solution:**
1. Enter a Code for the template first
2. Save the record
3. The Lines section will become editable

### Issue: Tasks Have Wrong Location Code

**Cause:** Location Code was changed after tasks were created

**Solution:** The system automatically updates Location Code on uncompleted tasks. If this didn't happen:
1. Check that tasks are not marked as Completed
2. Change the Production Order's Location Code again
3. System will update all uncompleted task lines

### Issue: Orphaned Template Lines (Blank Code)

**Cause:** Old bug where template lines could be created without Code

**Solution:**
- This has been fixed - templates now require Code before adding lines
- Existing orphaned lines: Contact system administrator for cleanup
- These will not affect new production orders

### Issue: Tasks Missing After Refresh

**Cause:** Modified tasks were overwritten

**Solution:**
- When refreshing, system asks: "Modified Tasks found. Please confirm if you want to overwrite them with the new template."
- Click **No** to preserve modified tasks
- Click **Yes** only if you want to reset to template

---

## Best Practices

### Template Design

1. **Use clear, action-oriented descriptions**
   - Good: "Inspect material for defects"
   - Bad: "Inspection"

2. **Group related tasks under Headlines**
   - Makes lists easier to scan
   - Provides logical workflow sections

3. **Set realistic due dates**
   - Consider actual work time required
   - Account for material availability
   - Buffer time for quality checks

4. **Mark routine tasks as Auto Approve**
   - Reduces approval overhead
   - Focus manager approval on critical tasks

5. **Use Information lines for references**
   - Link to quality standards
   - Note special handling requirements
   - Reference SOPs or work instructions

### Template Naming Conventions

Use consistent naming for easy identification:
- **Product-based**: "ROSE-STD", "LILY-PREP"
- **Process-based**: "POTTING-SM", "HARVEST-GEN"
- **Location-based**: "NORTH-GH", "SOUTH-PACK"

### Regular Template Reviews

1. Review templates quarterly
2. Update based on process improvements
3. Remove obsolete tasks
4. Add new quality requirements
5. Adjust due date formulas based on actual performance

### Staff Training

1. Train staff on task completion procedures
2. Emphasize importance of completing tasks on time
3. Show staff how to access their task lists
4. Explain the workflow from approval to completion

---

## Workflow Summary

```
1. Manager creates task template
   ↓
2. Manager assigns template to item
   ↓
3. Production order is created (manual or from planning)
   ↓
4. System copies template tasks to production order
   ↓
5. System auto-approves tasks marked with Auto Approve
   ↓
6. Manager reviews and approves remaining tasks
   ↓
7. Staff sees approved tasks and completes them
   ↓
8. Manager monitors completion via reports/worksheets
   ↓
9. Production order is finished with full task history
```

---

## Additional Features

### Task Card

When editing or creating individual tasks, the Task Card provides:
- Full description field
- Due date (editable for Tasks, not for Headlines)
- Routing link assignment
- Completion status
- Completion date (auto-filled when completed)

### Manual Line Indicator

Tasks added manually (not from templates) are marked:
- Allows tracking of ad-hoc work requirements
- Indicates tasks not part of standard procedure
- Useful for process improvement reviews

### Line Modified Flag

Tasks that have been modified are flagged:
- Prevents accidental overwrite during refresh
- Tracks customization from standard template
- Helps identify where standard procedures were adjusted

---

## Support

For questions or issues with the Production Order Task system:
1. Contact your system administrator
2. Reference this guide for standard procedures
3. Report bugs or enhancement requests through normal IT channels

---

**Document Version:** 1.0
**Last Updated:** February 2026
**System Version:** Clesen Horticulture Extension 26.4.0+

---

## Related documents

- [[prod-order-Posting-Documentation]]
- [[prod-order-posting-staff-guide]]
- [[prod-order-posting-manager-guide]]
- [[prod-order-posting-it-troubleshooting-guide]]
- [[prod-order-task-staff-guide]]
- [[prod-order-task-it-troubleshooting-guide]]
