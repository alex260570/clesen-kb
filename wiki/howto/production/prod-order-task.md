---
title: Production Order Tasks
type: howto
tags: [production, tasks, quality-control, task-management]
created: 2026-04-21
updated: 2026-05-01
sources: [prod-order-task-staff-guide.md, prod-order-task-manager-guide.md]
---

# Production Order Tasks

Template-based checklist system for ensuring consistent quality control and operational procedures on all production orders.

## Overview

Tasks are checklists that ensure quality and consistency in production operations. Each production order can have tasks assigned by your manager to guide the work process. This guide covers both staff task completion and manager task template management.

## For Warehouse/Production Staff

### Accessing Your Tasks

#### Method 1: From the Production Order

1. Open the **Released Production Order** you're working on
2. Look for the **Tasks FactBox** on the right side
   - Shows quick summary of tasks
   - Shows completion status
3. Click **Related** → **Tasks** for the full list

#### Method 2: Task Worksheet (All Orders)

1. Search for **Production Order Task Worksheet**
2. Shows ALL tasks across ALL production orders
3. Filter by:
   - Location Code (your facility)
   - Due Date (what's due today)
   - Production Order No. (specific order)
   - Completion status (show only incomplete tasks)

### Understanding Task Types

Tasks are organized into three types, each with a different purpose:

#### Headlines (Bold Text)

**Appearance:** Bold section headers

**Purpose:** Section headers that organize tasks into logical groups

**What to do:** Nothing - these are just headers. They're automatically "approved" and show in bold.

**Example:** "Preparation Phase", "Quality Checks", "Cleanup"

#### Tasks (Indented)

**Appearance:** Indented with checkbox

**Purpose:** Actual work items you need to complete

**What to do:** Complete the work described, then mark as completed

**Example:** "Inspect raw materials", "Clean work area", "Final quality check"

#### Information (Indented)

**Appearance:** Indented, no checkbox

**Purpose:** Reference information, notes, or special instructions

**What to do:** Read and follow the information, but no checkbox to complete

**Example:** "Refer to SOP-123 for procedures", "Material safety note: wear gloves"

### Completing Tasks

#### Step-by-Step Process

1. **View Available Tasks**
   - Open the production order's task list
   - Only released tasks are shown
   - Released = approved for you to work on

2. **Check What's Due**
   - Look at the **Due Date** column
   - Focus on overdue tasks first (red/highlighted)
   - Then work on tasks due today
   - Plan ahead for upcoming tasks

3. **Understand Each Task**
   - Read the task description
   - Check any Information lines for special instructions
   - Understand what work is required

4. **Complete the Work**
   - Perform the task as described
   - Follow any SOPs or instructions referenced
   - Ensure quality standards are met

5. **Mark Task as Completed**
   - Open the task card
   - Check the **Completed** checkbox
   - The system records completion date and time
   - Save the task

### Understanding Due Dates

Due dates tell you WHEN a task should be completed relative to the production order timeline.

#### How Due Dates Work

Due dates are calculated from:
- **Production Order Due Date** — when the order is due to finish
- **Line Start/End Dates** — when that production line will run
- **Routing Operation Dates** — when specific operations will run

#### Common Due Date Patterns

**2 days BEFORE production starts** = "-2D"
- Task due on 2/15 if production starts 2/17
- Gives time to prepare before work begins

**DAY OF production start** = "+0D"
- Task due same day production starts
- Initial quality check before work

**1 day AFTER production ends** = "+1D from end"
- Final inspection after work completes
- Time to verify quality before shipping

### Common Task Scenarios

#### Scenario 1: Preparation Phase Tasks

**Typical tasks:**
- Inspect raw materials
- Prepare workstation
- Check equipment

**Timeline:** 1-2 days before production starts

**What to do:**
1. Gather materials listed
2. Perform inspection/checks
3. Prepare workspace
4. Mark complete when done

#### Scenario 2: Production Quality Checks

**Typical tasks:**
- Initial quality check at start
- Mid-process inspection
- Final inspection at end

**Timeline:** Throughout production run

**What to do:**
1. Perform inspection per SOP
2. Document any issues
3. Report problems immediately
4. Mark complete when done

#### Scenario 3: Cleanup and Finishing

**Typical tasks:**
- Clean and sanitize area
- Return equipment
- Organize for next order

**Timeline:** Last day of production

**What to do:**
1. Clean workspace
2. Return materials
3. Prepare for next order
4. Mark complete when done

### Overdue Tasks

**If a task is overdue (due date is in the past):**

1. **Don't ignore it** — talk to your supervisor
2. **Complete it anyway** if it's still relevant
3. **Explain the delay** if you couldn't complete it
4. **Document the reason** in any notes field

Overdue tasks may indicate:
- Something was overlooked
- Timeline got compressed
- Unexpected issue occurred

Let your manager know if you see a pattern of overdue tasks.

### Task Completion Best Practices

✅ **DO:**
- Check task list at start of shift
- Complete tasks in order when possible
- Mark tasks complete as soon as you finish them
- Ask if you don't understand a task
- Document any issues you find
- Report problems immediately
- Review new tasks regularly

❌ **DON'T:**
- Skip tasks because they seem unimportant
- Mark tasks complete without actually doing them
- Let tasks become overdue without notifying supervisor
- Ignore Information lines or special instructions
- Guess what a task means — ask for clarification
- Delay reporting quality issues

### Asking for Help

**If you don't understand a task:**
1. Open the task card
2. Look for Information lines with references/instructions
3. Read any linked SOPs or work instructions
4. Ask your supervisor or team lead

**If you find a quality issue:**
1. Stop work on that task
2. Notify your supervisor immediately
3. Document what you found
4. Don't mark the task complete until resolved

**If you can't meet a due date:**
1. Tell your supervisor early (don't wait until due date)
2. Explain the reason
3. Get guidance on priorities
4. Work on alternative approach if needed

### Task Worksheet View

The **Production Order Task Worksheet** page shows:

| Column | What It Means |
|--------|--------------|
| Production Order No. | Which order this task belongs to |
| Item No. | What you're producing |
| Description | What the task is |
| Due Date | When it should be done |
| Status | Released (do it), Completed (done), etc. |
| Released | Only shown if you have approval |
| Completed | Check this when you finish |
| Completion Date | Auto-filled when you mark complete |

**Tips:**
- Filter by Location Code to see only your facility's tasks
- Filter by Due Date to see what's due today/overdue
- Sort by Due Date to tackle priorities in order
- Use "Show only incomplete" to focus on remaining work

### Performance & Recognition

Your task completion:
- Is tracked by management
- Reflects on quality metrics
- Helps managers understand productivity
- May be recognized for consistency and accuracy
- Helps identify training needs if problems occur

## For Managers

### Creating Task Templates

Task templates are reusable checklists that get automatically copied to production orders when created.

#### Step 1: Access Task Templates

1. Search for **Prod. Order Task Templates**
2. Click **New** to create new template

#### Step 2: Define Template Header

1. Enter unique **Code** (e.g., "FLOWER-PREP", "POTTING-STD")
2. Enter **Description** (e.g., "Standard Flower Preparation Tasks")
3. **Important:** Save the record before adding lines

#### Step 3: Add Task Lines

Once template header is saved, the Lines section becomes available.

##### Task Line Types

| Type | Purpose | Auto-Approve |
|------|---------|--------------|
| **Headline** | Section header to organize tasks | Yes |
| **Task** | Actual work item requiring completion | No |
| **Information** | Reference information or notes | N/A |

##### Adding Lines

1. Click in the Lines section
2. Select **Line Type** (Headline, Task, or Information)
3. Enter **Description** (what needs to be done)
4. For tasks with timing:
   - Set **Belongs to Routing Link** (if task relates to routing step)
   - Set **Due Date Calc. Based on Field** (date to calculate from)
   - Set **Due Date Calc. Formula** (e.g., "-2D" for 2 days before)
5. For routine tasks, check **Auto Approve**

##### Due Date Calculation Options

| Option | Example |
|--------|---------|
| Prod. Order Due Date | "-1D" = 1 day before due date |
| Prod. Order Line Start Date | "+0D" = same as start date |
| Prod. Order Line End Date | "-2D" = 2 days before end |
| Prod. Order Routing Start Date | "-1D" = 1 day before routing starts |
| Prod. Order Routing End Date | "+0D" = when routing ends |

##### Example Template Structure

```
[Headline] Preparation Phase
    [Task] Inspect raw materials - No Auto Approve, Due: -2D before Line Start
    [Task] Prepare workstation - Auto Approve: Yes, Due: -1D before Line Start
    [Information] Quality standards document: QS-2024-01

[Headline] Production Phase
    [Task] Initial quality check - No Auto Approve, Due: +0D at Routing Start
    [Task] Mid-process inspection - No Auto Approve, Due: +1D after Routing Start
    
[Headline] Completion Phase
    [Task] Final inspection - No Auto Approve, Due: -1D before Routing End
    [Task] Clean and sanitize area - Auto Approve: Yes, Due: +0D at Routing End
```

#### Step 4: Copy from Existing Template (Optional)

1. Click **Copy From Template** action
2. Select source template
3. All lines copied to new template
4. Modify as needed

### Assigning Templates to Items

Once templates are created, assign them to items so production orders automatically receive the tasks.

#### Assignment Steps

1. Open **Item Card**
2. Locate **CLE Prod. Order Task Template** field
3. Select appropriate template from lookup
4. Save item card

#### Important Notes

- Only items with assigned templates will have tasks created
- You can change template on item at any time (affects new production orders only)

### Managing Production Order Tasks

#### Viewing Tasks

Production orders display task information in several locations:

**On Production Order Card:**
- General Tab: "Prod. Order Task List" field shows which template is assigned
- FactBox: Shows released tasks with completion status
- Related Menu: Click "Tasks" to open full task list

**Task List View:**
- All task lines (Headlines, Tasks, Information)
- Due dates for each task
- Released status
- Completion status

#### Changing or Removing Task Templates

##### To Change Templates

1. Open Production Order
2. Change **CLE Prod. Order Task List** field
3. Confirm to replace existing tasks

**Important:** You cannot change the template if any tasks are marked as completed (protects historical data)

##### To Remove Tasks

1. Open Production Order
2. Clear **CLE Prod. Order Task List** field
3. All task lines will be deleted

**Important:** Cannot remove if any tasks are marked as completed

#### Adding Manual Tasks

If you need additional tasks not in the template:

1. Open Production Order
2. Click **Prod. Order Tasks** action
3. Click **Edit Mode**
4. Click **Insert Below Selected** on target task line
5. Select line type (Headline, Task, or Information)
6. Task card opens - enter description and details
7. New task marked as "Manual Line"

Manual tasks:
- Inserted between existing tasks
- Can be any line type
- Marked as modified
- Preserved if you refresh the production order

#### Refreshing Production Orders

When you click **Refresh Production Order**:
- **If no tasks exist:** Tasks created from item's template
- **If tasks exist:** Due dates recalculated based on updated production dates
- **Manual tasks:** Preserved and updated
- **Modified tasks:** Preserved

#### Dynamic Field Updates

The system automatically updates task fields when production order fields change:

| Production Order Field | Updates Task Field | Affected |
|----------------------|-------------------|----------|
| Location Code | Location Code | All uncompleted tasks |
| Shortcut Dimension 2 Code | Facility Code | All uncompleted tasks |
| Due Date | Task due dates | Tasks with calculated due dates |
| Routing dates | Task due dates | Tasks linked to routing |

### Approving Tasks

Tasks must be approved (released) before staff can work on them.

#### Accessing the Approval Page

1. Search for **Production Order Tasks to Approve**
2. Shows all unreleased tasks across all production orders

#### Approval Process

##### Individual Task Approval

1. Find task in list
2. Check **Released** box
3. Task now visible to staff

##### Bulk Approval

1. Filter list (e.g., by Location Code or Due Date)
2. Select multiple tasks
3. Use bulk actions or approve individually

#### Auto-Approved Tasks

Some tasks automatically approved when created:
- Tasks marked with **Auto Approve** in template
- All **Headline** lines

### Monitoring and Reporting

#### Task Worksheet

Open **Production Order Task Worksheet** to see:
- All tasks across all production orders
- Filtered to show only Tasks (not Headlines/Information)
- Completion status
- Sortable by due date, production order, item

#### Task FactBox

On Production Order pages, Task FactBox shows:
- Quick summary of released tasks
- Completion status
- Due dates

#### Viewing Task History

Completed tasks remain on production orders for review:
1. Open Production Order
2. View Related > Tasks
3. Filter by Completed = Yes
4. See completion dates and who completed them

### Best Practices

#### Template Design

1. **Use clear, action-oriented descriptions:**
   - Good: "Inspect material for defects"
   - Bad: "Inspection"

2. **Group related tasks under Headlines:**
   - Makes lists easier to scan
   - Provides logical workflow sections

3. **Set realistic due dates:**
   - Consider actual work time required
   - Account for material availability
   - Buffer time for quality checks

4. **Mark routine tasks as Auto Approve:**
   - Reduces approval overhead
   - Focus manager approval on critical tasks

5. **Use Information lines for references:**
   - Link to quality standards
   - Note special handling requirements
   - Reference SOPs

#### Template Naming Conventions

Use consistent naming:
- **Product-based:** "ROSE-STD", "LILY-PREP"
- **Process-based:** "POTTING-SM", "HARVEST-GEN"
- **Location-based:** "NORTH-GH", "SOUTH-PACK"

#### Regular Template Reviews

1. Review templates quarterly
2. Update based on process improvements
3. Remove obsolete tasks
4. Add new quality requirements
5. Adjust due date formulas based on performance

#### Staff Training

1. Train staff on task completion procedures
2. Emphasize importance of completing tasks on time
3. Show staff how to access their task lists
4. Explain workflow from approval to completion

### Troubleshooting

#### Issue: Tasks Not Created on New Production Orders

**Possible Causes:**
- Item has no task template assigned
- Template has no lines
- Production order has no lines yet

**Solution:**
1. Check Item Card for "CLE Prod. Order Task Template"
2. If blank, assign a template
3. For existing production orders, manually set "CLE Prod. Order Task List" field

#### Issue: Cannot Change Task Template

**Error:** "Cannot change or delete the task list because completed tasks exist for this production order."

**Cause:** At least one task is marked as completed

**Solution:** 
- This is by design to protect historical data
- Can only change templates on production orders with no completed tasks
- Create new production order if major changes needed

#### Issue: Cannot Add Task Lines to Template

**Cause:** Template Code field is blank

**Solution:**
1. Enter a Code for the template first
2. Save the record
3. Lines section will become editable

#### Issue: Tasks Have Wrong Location Code

**Cause:** Location Code changed after tasks created

**Solution:** The system automatically updates Location Code on uncompleted tasks

#### Issue: Tasks Missing After Refresh

**Cause:** Modified tasks were overwritten

**Solution:**
- System asks: "Modified Tasks found. Please confirm if you want to overwrite them?"
- Click **No** to preserve modified tasks
- Click **Yes** only if you want to reset to template

## Workflow Summary

```
1. Manager creates task template
   ↓
2. Manager assigns template to item
   ↓
3. Production order is created
   ↓
4. System copies template tasks to production order
   ↓
5. System auto-approves Auto Approve tasks
   ↓
6. Manager reviews and approves remaining tasks
   ↓
7. Staff sees approved tasks and completes them
   ↓
8. Manager monitors completion via reports
   ↓
9. Production order finished with full task history
```

## Related Pages

- [[prod-order-overview]]
- [[prod-order-posting]]
- [[production-order-task-it-troubleshooting]]
