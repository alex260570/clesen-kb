# Production Order Tasks - IT Troubleshooting Guide

## Overview

This guide provides technical information for IT staff to troubleshoot, maintain, and support the Production Order Task system in the Clesen Horticulture Business Central extension.

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Database Structure](#database-structure)
3. [Code Components](#code-components)
4. [Event Subscribers and Triggers](#event-subscribers-and-triggers)
5. [Common Issues and Solutions](#common-issues-and-solutions)
6. [Data Integrity Problems](#data-integrity-problems)
7. [Performance Optimization](#performance-optimization)
8. [Database Maintenance](#database-maintenance)
9. [Testing Procedures](#testing-procedures)
10. [Known Issues and Workarounds](#known-issues-and-workarounds)

---

## System Architecture

### Overview

The Production Order Task system is a template-based checklist system that integrates with Business Central Production Orders.

### Workflow Architecture

```
Item Master Data (Template Assignment)
    ↓
Production Order Creation
    ↓ (Event: OnAfterValidateEvent 'Source No.')
Template Code Assignment (from Item)
    ↓ (OnValidate 'CLE Prod. Order Task List')
Task Line Creation (copy from template)
    ↓
Task Approval (Manager)
    ↓
Task Execution (Staff)
    ↓
Task Completion Tracking
```

### Integration Points

| Component | Integration Type | Purpose |
|-----------|-----------------|---------|
| Item Master | Field Extension | Stores default template assignment |
| Production Order | Table Extension | Links to task template |
| Manufacturing Setup | Optional | Future configuration settings |
| Production Order Pages | Page Extensions | UI for task access |
| Routing Lines | Event Subscribers | Due date calculations |
| Status Management | Event Subscribers | Task migration on status change |

---

## Database Structure

### Tables

#### Table 50038: CLE Prod. Order Task Header

**Purpose:** Template header records

**Primary Key:** Code, Prod. Order No., Template

| Field No. | Field Name | Type | Purpose |
|-----------|-----------|------|---------|
| 1 | Code | Code[20] | Template identifier |
| 2 | Description | Text[100] | Template description |
| 3 | Prod. Order No. | Code[20] | (Blank for templates) |
| 4 | Template | Boolean | True for templates, False for prod order instances |
| 5 | Prod. Order Status | Enum | Production order status |

**File Location:** `app/1 Tables/Production/50038.Table.CLE.ProdOrderTaskHeader.al`

**Triggers:**
- `OnDelete`: Cascade deletes related lines

#### Table 50039: CLE Prod. Order Task Line

**Purpose:** Task line records (both templates and production order tasks)

**Primary Key:** Code, Prod. Order No., Prod. Order Status, Template, Line No.

| Field No. | Field Name | Type | Purpose |
|-----------|-----------|------|---------|
| 1 | Code | Code[20] | Template/Task list code |
| 2 | Prod. Order No. | Code[20] | Production order reference |
| 3 | Line No. | Integer | Sequence number |
| 4 | Template | Boolean | True if template line |
| 5 | Line Type | Enum 60125 | Headline/Task/Information |
| 6 | Description | Text[100] | Task description |
| 7 | Belongs to Routing Link | Code[20] | Links to routing operation |
| 8 | Due Date Calc. Formula | Text[10] | Date formula (e.g., "-2D") |
| 9 | Due Date Calc. Based on Field | Enum | Calculation basis |
| 10 | Due Date | Date | Calculated due date |
| 11 | Released | Boolean | Approved for execution |
| 12 | Completed | Boolean | Task completion flag |
| 13 | Completion Date | Date | When marked complete |
| 14 | Indention | Integer | Display indentation (0 or 1) |
| 15 | Template Name | Text[100] | Template description |
| 16 | Auto Approve | Boolean | Auto-release on creation |
| 17 | Prod. Order Status | Enum | Production order status |
| 18 | Line is Modified | Boolean | Modified from template |
| 19 | All Tasks Released | Boolean | Approval complete flag |
| 20 | Location Code | Code[20] | Production location |
| 21 | Shortcut Dimension 2 Code | Code[20] | Facility code |
| 22 | Item No. | Code[20] | FlowField from prod order |
| 23 | Prod. Order Description | Text[100] | FlowField from prod order |
| 24 | Manual Line | Boolean | Manually added (not from template) |

**File Location:** `app/1 Tables/Production/50039.Table.CLE.ProdOrderTaskLine.al`

**Triggers:**
- `OnValidate "Line Type"`: Sets Indention and Auto Approve based on type
- `OnValidate "Completed"`: Sets/clears Completion Date
- `OnValidate "Due Date Calc. Formula"`: Validates formula syntax
- `OnValidate "Due Date Calc. Based on Field"`: Validates routing link requirements

#### Table Extension 50047: CLE Production Order

**Extends:** Production Order (Table 5405)

**New Fields:**

| Field No. | Field Name | Type | Purpose |
|-----------|-----------|------|---------|
| 60100 | CLE Prod. Order Task List | Code[20] | Links to task template |
| 60101 | CLE Last Date Counted | Date | FlowField (inventory) |

**File Location:** `app/2 Table Extensions/Production/50047.Tab-Ext.CLE.ProductionOrder.al`

**OnValidate Logic (Field 60100):**
1. Checks for completed tasks (prevents change if any exist)
2. If clearing field: Deletes all task lines
3. If setting field: Calls CreateTaskLines to copy template

#### Table Extension 50020: CLE Item

**Extends:** Item (Table 27)

**New Field:**

| Field No. | Field Name | Type | Purpose |
|-----------|-----------|------|---------|
| 60516 | CLE Prod. Order Task Template | Code[20] | Default template for item |

**File Location:** `app/2 Table Extensions/Item/50020.Tab-Ext.CLE.Item.al`

### Enum 60125: CLE Prod. Order Task Type

**Values:**
- 0: Headline
- 1: Task
- 3: Information (Note: 2 is skipped)

**File Location:** `app/6 Enums/60125.Enum.CLE.ProdOrderTaskType.al`

---

## Code Components

### Codeunit 50058: CLE Prod. Order Task Mgt.

**Purpose:** Main business logic for task management

**File Location:** `app/5 Codeunits/Production/50058.Codeunit.CLE.ProdOrderTaskMgt.al`

#### Key Procedures

| Procedure | Purpose | Called By |
|-----------|---------|-----------|
| `AddTaskCodeToProdOrder` | Assigns item's template to prod order | Event subscribers on Source No. change |
| `UpdateProdOrderTasksOnRefreshOrder` | Updates/creates tasks on refresh | Event subscribers on Refresh action |
| `CreateTaskLines` | Copies template lines to prod order | OnValidate of Task List field, Refresh |
| `GetTaskDueDate` | Calculates due date from formula | CreateTaskLines, UpdateTaskLineDates |
| `CompleteTask` | Marks task complete with validation | Page actions |
| `ModifyTask` | Opens task card for editing | Page actions |
| `CreateTask` | Creates manual task with type selection | Page actions (Insert Below Selected) |
| `AdjustLocationCodeAfterChangeInProdOrder` | Updates location on tasks | Event subscriber on Location Code change |
| `AdjustFacilityCodeAfterChangeInProdOrder` | Updates facility on tasks | Event subscriber on Dim 2 change |
| `FinishApproval` | Completes approval process | Manual from approval page |
| `UpdateTaskLineDates` | Recalculates due dates | Event subscribers on date field changes |
| `CreateCopyFromTemplate` | Duplicates template | Page action |
| `MoveTasksOnStatusChange` | Migrates tasks on status change | Event subscriber |
| `CleanupFinishedTasks` | Moves tasks to finished orders | Manual maintenance |

#### Critical Logic Details

**CreateTaskLines:**
- Checks for modified tasks, prompts for confirmation
- Deletes existing task lines
- Filters templates by Code (from prod order)
- Copies all template fields
- Sets Production Order fields
- Calculates initial due dates
- Applies auto-approval

**CreateTask (Line Type Selection):**
- Shows StrMenu dialog: "Headline,Task,Information"
- Calculates Line No. between existing lines (split-key algorithm)
- Validates Line Type (calls OnValidate trigger)
- Sets Manual Line flag
- Opens task card for description entry

**UpdateProdOrderTasksOnRefreshOrder:**
- Checks for existing released tasks
- If none exist AND item has template: Creates tasks
- If tasks exist: Recalculates due dates only
- Does NOT create tasks if item has no template (Issue 3 fix)

### Codeunit 50057: CLE Prod. Order Task Subscr.

**Purpose:** Event subscribers for automatic task management

**File Location:** `app/5 Codeunits/Production/50057.Codeunit.CLE.ProdOrderTaskSubscr.al`

#### Event Subscribers

| Event | Object | Field/Action | Calls | Purpose |
|-------|--------|--------------|-------|---------|
| OnAfterValidateEvent | Production Order | Source No. | AddTaskCodeToProdOrder | Auto-assign template when item changes |
| OnAfterActionEvent | Planned Prod. Order Page | Refresh Production Order | UpdateProdOrderTasksOnRefreshOrder | Update tasks on refresh |
| OnAfterActionEvent | Firm Planned Prod. Order Page | Refresh Production Order | UpdateProdOrderTasksOnRefreshOrder | Update tasks on refresh |
| OnAfterActionEvent | Released Prod. Order Page | RefreshProductionOrder | UpdateProdOrderTasksOnRefreshOrder | Update tasks on refresh |
| OnAfterValidateEvent | Production Order | Location Code | AdjustLocationCodeAfterChangeInProdOrder | Sync location to tasks |
| OnAfterValidateEvent | Production Order | Shortcut Dimension 2 Code | AdjustFacilityCodeAfterChangeInProdOrder | Sync facility to tasks |
| OnAfterValidateEvent | Production Order | Due Date | UpdateTaskLineDates | Recalc task due dates |
| OnAfterValidateEvent | Prod. Order Routing Line | Starting Date-Time | UpdateTaskLineDates | Recalc task due dates |
| OnAfterValidateEvent | Prod. Order Routing Line | Ending Date-Time | UpdateTaskLineDates | Recalc task due dates |
| OnAfterValidateEvent | Prod. Order Line | Starting Date-Time | UpdateTaskLineDates | Recalc task due dates |
| OnAfterValidateEvent | Prod. Order Line | Ending Date-Time | UpdateTaskLineDates | Recalc task due dates |
| OnInsertProdOrderWithReqLine | Carry Out Action Codeunit | N/A | AddTaskCodeToProdOrder | Assign template from planning |
| OnAfterInsertProdOrderLine | Carry Out Action Codeunit | N/A | CreateTaskLines | Create tasks from planning |
| OnAfterChangeStatusOnProdOrder | Prod. Order Status Mgmt | N/A | MoveTasksOnStatusChange | Migrate tasks on status change |

---

## Event Subscribers and Triggers

### Task Creation Flow

```
User creates Production Order
    ↓
Validates Source No. (Item)
    ↓
EVENT: OnAfterValidateEvent 'Source No.'
    ↓
Calls: AddTaskCodeToProdOrder(ProdOrder)
    ↓
Gets Item."CLE Prod. Order Task Template"
    ↓
If template <> '': Sets ProdOrder."CLE Prod. Order Task List"
    ↓
TRIGGER: OnValidate 'CLE Prod. Order Task List'
    ↓
If ProdOrderLineExist(): Calls CreateTaskLines(ProdOrder)
    ↓
Template lines copied to production order
```

### Refresh Production Order Flow

```
User clicks Refresh Production Order
    ↓
EVENT: OnAfterActionEvent 'Refresh Production Order'
    ↓
Calls: UpdateProdOrderTasksOnRefreshOrder(ProdOrder)
    ↓
Checks if released tasks exist
    ↓
IF NO TASKS EXIST:
    Gets Item."CLE Prod. Order Task Template"
    If template exists: Calls CreateTaskLines(ProdOrder)
IF TASKS EXIST:
    Recalculates due dates for all released tasks
```

### Location Code Change Flow

```
User changes Location Code on Production Order
    ↓
EVENT: OnAfterValidateEvent 'Location Code'
    ↓
Checks if Location Code changed (Rec <> xRec)
    ↓
Calls: AdjustLocationCodeAfterChangeInProdOrder(ProdOrder)
    ↓
Updates Location Code on ALL UNCOMPLETED task lines
```

### Status Change Flow

```
User changes Production Order status (e.g., Firm → Released)
    ↓
EVENT: OnAfterChangeStatusOnProdOrder
    ↓
Calls: MoveTasksOnStatusChange(FromProdOrder, ToProdOrder)
    ↓
Copies all task lines to new status
    ↓
If status = Finished: Only copies released tasks
    ↓
Deletes tasks from old status
```

---

## Common Issues and Solutions

### Issue 1: Tasks Not Created on Production Order

**Symptoms:**
- Production order created but no tasks appear
- Expected tasks based on item template

**Diagnostic Steps:**

1. **Check Item Template Assignment**
   - Open Item Card for the item
   - Check field "CLE Prod. Order Task Template"
   - If blank: Item has no template assigned

2. **Check Template Exists**
   - Search for "Prod. Order Task Templates"
   - Find the template code
   - Open the template card
   - Verify it has lines in the Lines section
   - Should have at least 1 line

3. **Check Production Order Field**
   - Open Production Order
   - Check field "CLE Prod. Order Task List"
   - Should match item template code

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Item has no template assigned | Assign template to Item Card field 60516 |
| Template has no lines | Create lines in template |
| Production order has no lines yet | CreateTaskLines only runs if ProdOrderLineExist() returns true |
| Event subscriber not firing | Check if customization blocked subscriber |

**Resolution:**

Manual task creation:
1. Open Production Order
2. Manually set "CLE Prod. Order Task List" field to template code
3. Field validation will trigger CreateTaskLines

### Issue 2: Tasks Created Multiple Times (Duplicates)

**Symptoms:**
- Multiple identical task lines appear
- Each task has different Line No. but same description

**Diagnostic Steps:**

- Open Production Order's task list (Related > Tasks)
- Look for identical descriptions with different Line No.
- Count how many times each task appears

**Common Causes:**

| Cause | Solution |
|-------|----------|
| CreateTaskLines called multiple times | Check event subscriber logic |
| Refresh clicked multiple times rapidly | Add commit/transaction handling |
| Template changed repeatedly | Working as designed (replaces tasks) |

**Resolution:**

Cleanup duplicates:
- Manually delete duplicate lines from the task list page
- Or clear the "CLE Prod. Order Task List" field on production order (deletes all tasks)
- Then re-assign the template to recreate tasks correctly

Prevention: Issue is typically resolved by recent code fixes. Ensure using latest version.

### Issue 3: "Generic" Tasks Appearing on Orders Without Templates

**Symptoms:**
- Tasks appear on production orders where item has no template
- Tasks have minimal or generic descriptions
- Often have blank Code field

**Root Cause:** Orphaned template lines with Code = '' (blank)

**Diagnostic Steps:**

```sql
-- Find orphaned template lines
SELECT *
FROM "CLE Prod. Order Task Line"
WHERE Template = 1 AND Code = ''
```

- Search for "Prod. Order Task Templates"
- Look for templates with blank Code field
- Open each template and check if it has lines without Code

**Resolution:**

1. **Delete orphaned lines:**
   - Cannot be done directly from UI
   - Contact Microsoft Partner for database cleanup
   - Or use configuration packages to export, clean, and reimport

2. **Verify templates have Code:**
   - Open "Prod. Order Task Templates" list
   - Verify all templates have a Code value
   - Check that template cards require Code before allowing line entry
### Issue 4: Cannot Change or Delete Task Template

**Symptoms:**
- Error: "Cannot change or delete the task list because completed tasks exist for this production order."
- User trying to change template assignment

**Root Cause:** By design - protects historical data

**Diagnostic Steps:**

```sql
-- Check for completed tasks
SELECT COUNT(*) AS CompletedTaskCount
FROM "CLE Prod. Order Task Line"
WHERE "Prod. Order No." = '<PROD_ORDER_NO>'
  AND "Prod. Order Status" = <STATUS>
  AND Completed = 1
- Open Production Order's task list (Related > Tasks)
- Filter by Completed = Yes
- Count how many tasks are completed
- If any exist, template cannot be changed

**Resolution Options:**

1. **If tasks should NOT be completed:**
   - Open each completed task
   - Click "Mark as Completed" again
   - System will prompt to reopen the task
   - Click Yes to reopenxpected Behavior:**
   - This is working as designed
   - Explain to user that completed tasks cannot be changed
   - Protects audit trail and quality records

### Issue 5: Due Dates Not Calculating

**Symptoms:**
- Due Date field is blank
- Due Date doesn't update when production dates change

**Diagnostic Steps:**

1. **Check calculation setup:**
   ```sql
   SELECT "Line No.", Description, 
          "Due Date Calc. Based on Field", 
          "Due Date Calc. Formula",
          "Due Date"
   FROM "CLE Prod. Order Task Line"
   WHERE "Prod. Order No." = '<PROD_ORDER_NO>'
   - Open Production Order's task list (Related > Tasks)
   - Filter to Line Type = Task
   - Check each task for:
     - "Due Date Calc. Based on Field" (should not be blank)
     - "Due Date Calc. Formula" (should have value like "<-2D>")
     - "Due Date" (should be populated)heck base date exists:**
   - Production Order Due Date
   - Production Order Line dates
   - Routing Line dates

**Common Causes:**

| Cause | Solution |
|-------|----------|
| Calc. Based on Field not set | Set in template |
| Calc. Formula blank | Set in template (e.g., "-2D") |
| Formula syntax invalid | Correct format: `<-2D>` |
| Base date field blank | Ensure prod order has due date/routing dates |
| Routing Link missing | Set routing link if calculating from routing |

**Resolution:**

Manual recalculation:
1. Open Codeunit 50058
2. Call `UpdateTaskLineDates(ProdOrder)`
3. Or change production order Due Date (triggers recalc)

### Issue 6: Tasks Not Visible to Staff

**Symptoms:**
- Tasks exist in database but don't show in task list
- User can't see any tasks

**Diagnostic Steps:**

```sql
-- Check if tasks exist
SELECT "Line No.", Description, Released, Completed, Template
FROM "CLE Prod. Order Task Line"
WHERE "Prod. Order No." = '<PROD_ORDER_NO>'
  AND "Prod. Order Status" = <STATUS>
ORDER BY "Line No."
```

**Common Causes:**
- Open Production Order
- Click Related > Tasks (or open Task Card)
- If in Edit Mode, check if you can see unreleased tasks
- View the Released and Template columns
- Verify Template = No (not template lines)
- Check Released status
**Resolution:**

1. **Release tasks:**
   ```sql
   UPDATE "CLE Prod. Order Task Line"
   SET Released = 1
   WHERE "Prod. Order No." = '<PROD_ORDER_NO>'
     AND "Prod. Order Status" = <STATUS>
   - Open "Production Order Tasks to Approve" page
   - Filter to the specific production order
   - Check the Released box for each task
   - Or open Production Order Task Card in Edit Mode
   - Check Released box for tasks that should be visible
### Issue 7: Task Line Numbers Conflicting

**Symptoms:**
- Error on insert: Duplicate primary key
- Line No. already exists

**Diagnostic Steps:**

```sql
-- Find duplicate line numbers
SELECT "Prod. Order No.", Code, "Line No.", COUNT(*) AS Count
FROM "CLE Prod. Order Task Line"
WHERE Template = 0
- Open Production Order's task list
- Look for error message about duplicate keys
- Check if multiple lines have the same Line No.
- Review recent manual task additions

**Root Cause:** CreateTask split-key algorithm failed or concurrent inserts

**Resolution:**

Manual cleanup:
- Delete the duplicate task lines from the UI
- Or clear and recreate all tasks:
  - Clear "CLE Prod. Order Task List" field
  - Re-assign the template
## Data Integrity Problems

### Orphaned Task Lines

**Problem:** Task lines exist for production orders that no longer exist

**Detection:**
```sql
-- Find orphaned task lines
SELECT t."Prod. Order No.", t."Prod. Order Status", COUNT(*) AS LineCount
FROM "CLE Prod. Order Task Line" t
LEFT JOIN "Production Order" p 
    ON t."Prod. Order No." = p."No." 
    AND t."Prod. Order Status" = p.Status
WHERE t.Template = 0
  AND p."No." IS NULL
- Open "Production Order Task Worksheet"
- Try to drill down to production orders
- If order doesn't exist, task is orphaned

**Cleanup:**
- Contact Microsoft Partner for database cleanup
- Or use Configuration Packages to export, clean, and reimport data
- No direct UI method to clean orphaned records

### Template Lines Without Code

**Problem:** Template lines with blank Code field

**Detection:**
- Open "Prod. Order Task Templates" list
- Look for blank Code fields
- Check if orphaned lines appear in task lists

**Cleanup:**
- Cannot be done directly from UI in SaaS
- Contact Microsoft Partner for database cleanup
- Or use Configuration Packages

**Prevention:** Page 50143 now prevents this (Code required before adding lines)

### Task Lines with Invalid Status

**Problem:** Task lines reference production order but status doesn't match

**Detection:**
- Open production order
- Note the Status
- Open Related > Tasks
- Check if "Prod. Order Status" matches
- Mismatches indicate data inconsistency

**Cleanup:**
- Run CleanupFinishedTasks procedure from AL code
- Or manually recreate tasks:
  - Clear "CLE Prod. Order Task List" field
  - Re-assign template

### Missing Template Headers

**Problem:** Task lines reference templates that don't have headers

**Detection:**
- Open "Prod. Order Task Templates" list
- Note all template codes
- Check items or production orders referencing non-existent templates
- Errors may occur when trying to access template details

**Resolution:**
- Create missing template headers manually
- Or update items/prod orders to use valid templates
- Contact partner for database cleanup if needed
Table 50039 (Task Line):
- PK: Code, Prod. Order No., Prod. Order Status, Template, Line No.
- K2: Due Date, Prod. Order No.

**Recommended Additional Indexes:**

```al
// For approval page performance
key(K3; Template, "All Tasks Released", Released, "Line Type")
{
}

// For task worksheet performance
key(K4; "Prod. Order No.", "Prod. Order Status", Released, Completed)
{
}

// For location-based filtering
key(K5; "Location Code", "Due Date", Released)
{
}
```

### Query Optimization

**Slow Query Pattern:**
```al
TaskLine.SetRange("Prod. Order No.", ProdOrder."No.");
// Missing status filter - searches all statuses
if TaskLine.FindSet() then
```

**Optimized:**
```al
TaskLine.SetRange("Prod. Order No.", ProdOrder."No.");
TaskLine.SetRange("Prod. Order Status", ProdOrder.Status);  // Add status filter
if TaskLine.FindSet() then
```

### Batch Operations

**Poor Performance:**
```al
// Updates one at a time
repeat
    TaskLine."Location Code" := NewLocation;
    TaskLine.Modify(true);
until TaskLine.Next() = 0;
```

**Better:**
```al
// Batch update
TaskLine.ModifyAll("Location Code", NewLocation);
```

### FlowField Performance

Fields 22 (Item No.) and 23 (Prod. Order Description) are FlowFields that query Production Order table. Consider:

1. Only display when needed (not in list views)
2. Use CalcFields explicitly rather than relying on auto-calc
3. Consider denormalizing if performance is critical

---

## Database Maintenance

### Regular Maintenance Tasks

#### 1. Cleanup Finished Production Order Tasks

**Frequency:** Monthly

**Purpose:** Move tasks from Released status to Finished status when prod order is finished

**Procedure:**
```al
// Run Codeunit 50058 procedure
CleanupFinishedTasks()
```

Or SQL:
```sql
-- Find mismatched status
SELECT t."Prod. Order No.", t."Prod. Order Status" AS TaskStatus, 
       p.Status AS ProdOrderStatus
FROM "CLE Prod. Order Task Line" t
JOIN "Production Order" p ON t."Prod. Order No." = p."No."
WHERE t."Prod. Order Status" <> p.Status
  AND t.Template = 0
```

#### 2. Remove Orphaned Template Lines

**Frequency:** After template deletions or quarterly

**Procedure:**
```sql
-- Check for orphaned template lines (Code with no header)
SELECT DISTINCT Code
FROM "CLE Prod. Order Task Line"
WHERE Template = 1
  AND Code NOT IN (SELECT Code FROM "CLE Prod. Order Task Header" WHERE Template = 1)

-- Delete if confirmed orphaned
DELETE FROM "CLE Prod. Order Task Line"
WHERE Template = 1
  AND Code NOT IN (SELECT Code FROM "CLE Prod. Order Task Header" WHERE Template = 1)
```

#### 3. Archive Completed Tasks

**Frequency:** Annually

**Purpose:** Move old completed tasks to archive table for history
 from AL code
CleanupFinishedTasks()
```

Or manual check:
- Open "Production Order Task Worksheet"
- Check production orders with Status = Finished
- Verify tasks show correct status
- If mismatched, run cleanup procedure
**Checks:**
- No orphaned task lines
- No template lines with blank Code
- All production order references valid
- Status consistency between task lines and production orders

**Script:**
```sql
-- Integrity check query
SELECT 'Orphaned Tasks' AS Issue, COUNT(*) AS Count
FROM "CLE Prod. Order Task Line" t
- Open "Prod. Order Task Templates" list
- Note all valid template codes
- Check for tasks referencing missing templates
- Use Configuration Packages to export and clean data
- Or contact Microsoft Partner for database cleanup
- Cannot be done directly via UION ALL

SELECT 'Mismatched Status', COUNT(*)
FROM "CLE Prod. Order Task Line" t
JOIN "Production Order" p ON t."Prod. Order No." = p."No."
WHERE t.Template = 0 AND t."Prod. Order Status" <> p.Status
```

---

## Testing Procedures

### Unit Test Scenarios

#### Test 1: Template Creation and Assignment

**Steps:**
1. Create new template with Code "TEST-001"
2. Add 3 task lines (1 Headline, 2 Tasks)
3. Set due date calculation on tasks
4. Assign template to test item
5. Create production order for item
6. Verify 3 task lines copied to production order

**Expected:**
- Tasks created with correct Line Type
- Due dates calculated
- Location/Facility copied from prod order
- Auto-approved tasks have Released = true

##Manual Checks:**

1. **Orphaned Tasks:**
   - Open "Production Order Task Worksheet"
   - Try to navigate to each production order
   - Note any that fail to open (orphaned)

2. **Template Lines Without Code:**
   - Open "Prod. Order Task Templates"
   - Filter to blank Code
   - Should find none

3. **Mismatched Status:**
   - Open production orders with tasks
   - Compare Status field with task list "Prod. Order Status"
   - Run CleanupFinishedTasks if mismatches found

**Alternative:** Create custom report page in AL to perform these checkseadline: Bold, Indention = 0, Auto Approve = true
- Task: Indented, Indention = 1
- Information: Indented, Indention = 1

#### Test 4: Completed Task Protection

**Steps:**
1. Create production order with tasks
2. Complete one task
3. Try to change "CLE Prod. Order Task List" field
4. Try to clear field

**Expected:**
- Error: "Cannot change or delete the task list because completed tasks exist"

#### Test 5: Refresh Without Template

**Steps:**
1. Create production order for item with NO template
2. Click Refresh Production Order
3. Verify no tasks created

**Expected:**
- No tasks created
- No errors
- UpdateProdOrderTasksOnRefreshOrder checks item template first

### Integration Test Scenarios

#### Test 6: Status Change Task Migration

**Steps:**
1. Create Firm Planned prod order with tasks
2. Complete some tasks, leave others incomplete
3. Change status to Released
4. Verify tasks migrated correctly

**Expected:**
- All tasks moved to Released status
- Completed and uncompleted both migrated
- Original tasks deleted from Firm Planned

#### Test 7: Routing Date Changes

**Steps:**
1. Create production order with routing
2. Create tasks with routing-based due dates
3. Change routing operation dates
4. Verify task due dates recalculated

**Expected:**
- Tasks with routing-based calculations updated
- Other tasks unchanged

### Performance Test Scenarios

#### Test 8: Large Template Performance

**Steps:**
1. Create template with 100+ lines
2. Create production order
3. Measure time to copy tasks
4. Verify no timeouts

**Expected:**
- Completion in < 5 seconds
- No blocking locks

#### Test 9: Bulk Approval Performance

**Steps:**
1. Create 50 production orders with tasks (500+ total tasks)
2. Open approval page
3. Filter and approve multiple tasks
4. Measure response time

**Expected:**
- Page loads in < 3 seconds
- Filtering responsive
- Batch approval efficient

---

## Known Issues and Workarounds

### Issue: Enum Value 2 Skipped

**Description:** Enum 60125 has values 0, 1, 3 (skips 2)

**Impact:** Minor - no functional impact

**Workaround:** None needed - working as designed

**Future:** Could renumber to 0, 1, 2 but requires data migration

### Issue: Cannot Modify Template Lines When Used

**Description:** No protection against modifying template while in use by production orders

**Impact:** Changes to template don't affect existing production orders (by design)

**Workaround:** 
- Document that template changes only affect new production orders
- Use "Copy From Template" to create new versions

**Future:** Consider template versioning system

### Issue: Manual Tasks Not in Reports

**Description:** Manually added tasks may not appear in standard reports

**Impact:** Manual tasks documented in system but may not show in all reports

**Workaround:**
- Filter reports to include "Manual Line" = true
- Create custom reports including manual tasks

### Issue: No Task Template History

**Description:** No audit trail of template changes over time

**Impact:** Cannot see what template looked like when production order was created

**Workaround:**
- Export templates regularly for archival
- Consider implementing template versioning

**Future Enhancement:** Template version control system

### Issue: Date Calculation Requires Manual Refresh

**Description:** If routing dates change outside normal validation events, due dates may not update automatically

**Impact:** Due dates may become stale if external changes made to routing

**Workaround:**
- Click Refresh Production Order to force recalculation
- Or change Production Order Due Date (triggers recalc)

---

## Debugging Tips

### Enable Debug Logging

Add to procedures for troubleshooting:

```al
local procedure DebugLog(Message: Text)
var
    TempFile: File;
begin
    TempFile.WriteMode(true);
    TempFile.TextMode(true);
    TempFile.Create('C:\Temp\TaskDebug.log', TextEncoding::UTF8);
    TempFile.Write(Format(CurrentDateTime) + ': ' + Message);
    TempFile.Close();
end;
```

### Trace Event Subscriber Execution

Add breakpoints in:
- `Codeunit 50057.OnAfterValidateEvent` (Source No.)
- `Codeunit 50058.CreateTaskLines`
- `Codeunit 50058.UpdateProdOrderTasksOnRefreshOrder`

### SQL Profiler Queries

Monitor these table operations:
- `CLE Prod. Order Task Line` - INSERT, UPDATE, DELETE
- `Production Order` - UPDATE on fields 60100, Location Code, Dim 2

### Common Breakpoint Locations

| File | Procedure | Line Purpose |
|------|-----------|-------------|
| 50058 | CreateTaskLines | Line 44 - Start of procedure |
| 50058 | CreateTaskLines | Line 57 - Template filter check |
| 50058 | CreateTaskLines | Line 69 - Insert task line |
| 50058 | CreateTask | Line 190 - Line type selection |
| 50057 | SourceNoOnAfterValidateEvent | Line 10 - Check if should call AddTaskCode |
| 50047 | OnValidate CLE Prod. Order Task List | Line 13 - Check for completed tasks |

---

## Support Escalation

### Level 1 Support (Help Desk)

**Can Handle:**
- Task not visible to users (check Released flag)
- How to create templates
- How to complete tasks
- Basic filtering and viewing

**Escalate If:**
- Data corruption suspected
- Performance issues
- System errors/crashes
- Tasks not creating at all

### Level 2 Support (IT Staff)

**Can Handle:**
- Data integrity issues
- Performance optimization
- Complex configuration
- Event subscriber problems
- Database cleanup

**Escalate If:**
- Code changes required
- Database schema changes needed
- MaTelemetry Monitoring

**For SaaS:**
- Use Application Insights (if configured)
- Monitor table operations via telemetry
- Track custom events for task operations
- Review session logs for errors

**Tables to Monitor:**
### Level 3 Support (Developers)

**Required For:**
- AL code modifications
- New feature development
- Database schema changes
- Complex event subscriber issues
- Performance architecture changes

---

## Quick Reference: Common SQL Queries

### Find All Templates
```sql
SELECT Code, Description, COUNT(Lines) AS LineCount
FROM "CLE Prod. Order Task Header" h
LEFT JOIN (
    SELECT Code, COUNT(*) AS Lines
    FROM "CLE Prod. Order Task Line"
    WHERE Template = 1
    GROUP BY CodeData Queries

### Find All Templates
**Method:**
- Search for "Prod. Order Task Templates"
- Shows all templates with Code and Description
- Open each to see line count in Lines section

### Find Production Orders With Tasks
**Method:**
- Open "Released Production Orders" (or other status)
- Add column "CLE Prod. Order Task List" to view
- Filter where "CLE Prod. Order Task List" is not blank
- Open Related > Tasks to see task count
- Use FactBox to see completion summary

### Find Overdue Tasks
**Method:**
- Open "Production Order Task Worksheet"
- Filter: Due Date = ..Today (through yesterday)
- Filter: Completed = No
- Filter: Released = Yes
- Filter: Line Type = Task
- Sort by Due Date ascending
- Shows all overdue uncompleted tasks

### Find Templates Used by Items
**Method:**
- Open Item List
- Add column "CLE Prod. Order Task Template" to view
- Filter where "CLE Prod. Order Task Template" is not blank
- Shows which items use which templates
- Or use Configuration Packages to export Items table with template field ] Enum 60125 published
- [ ] Codeunits 50057, 50058 published
- [ ] Pages 50143-50151, 50209, 50210 published
- [ ] Page Extensions for production order pages published
- [ ] Permissions added to permission sets
- [ ] Test template created
- [ ] Test item with template assigned
- [ ] Test production order with tasks
- [ ] Event subscribers firing (verify in debugger)
- [ ] Performance acceptable (< 3 second page loads)

---

## Contact Information

**System:** Clesen Horticulture Business Central Extension  
**Version:** 26.4.0+  
**Last Updated:** February 2026

**For Support:**
- Internal IT Help Desk: [Contact Info]
- Developer Team: [Contact Info]
- Business Central Administrator: [Contact Info]

**Documentation:**
- Manager Guide: `docs/production-order-tasks/manager-guide.md`
- Staff Guide: `docs/production-order-tasks/staff-guide.md`
- This IT Guide: `docs/production-order-tasks/it-troubleshooting-guide.md`

---

## Related documents

- [[prod-order-Posting-Documentation]]
- [[prod-order-posting-staff-guide]]
- [[prod-order-posting-manager-guide]]
- [[prod-order-posting-it-troubleshooting-guide]]
- [[prod-order-task-staff-guide]]
- [[prod-order-task-manager-guide]]

---

**Document Version:** 1.0
**Last Updated:** February 11, 2026
