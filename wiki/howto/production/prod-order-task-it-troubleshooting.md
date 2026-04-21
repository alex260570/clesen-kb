---
title: Production Order Tasks — IT Troubleshooting
type: howto
tags: [production, production-order-tasks, it-support, system-architecture, troubleshooting]
created: 2026-04-21
updated: 2026-04-21
sources: [prod-order-task-it-troubleshooting-guide.md]
---

# Production Order Tasks — IT Troubleshooting

Technical guide for IT staff supporting the Production Order Task template system.

## System Overview

The Production Order Task system is a template-based checklist system that integrates with Business Central Production Orders.

| Component | Details |
|-----------|---------|
| **Main Codeunit** | `50058 "CLE Prod. Order Task Mgt."` |
| **Event Subscribers** | `50057 "CLE Prod. Order Task Subscr."` |
| **Template Table** | `50038 "CLE Prod. Order Task Header"` |
| **Task Line Table** | `50039 "CLE Prod. Order Task Line"` |
| **Extension: Item** | Field 60516 - Default task template |
| **Extension: Production Order** | Field 60100 - Links to task template |

## Workflow Architecture

```
Item Master Data (Template Assignment)
    ↓
Production Order Creation
    ↓ [Event: OnAfterValidateEvent 'Source No.']
Template Code Assignment (from Item)
    ↓ [OnValidate 'CLE Prod. Order Task List']
Task Line Creation (copy from template)
    ↓
Task Approval (Manager)
    ↓
Task Execution (Staff)
    ↓
Task Completion Tracking
```

## Common Issues & Troubleshooting

### Issue 1: Tasks Not Created on Production Order

**Symptoms:** Production order created but no tasks appear

**Root Causes:**
- Item has no template assigned
- Template has no lines
- Production order has no lines yet

**Diagnosis:**
1. Check Item Card field "CLE Prod. Order Task Template" (60516)
2. Verify template exists in "Prod. Order Task Templates" list
3. Verify template has lines in the Lines section
4. Check production order has at least 1 line

**Resolution:**
1. Assign template to Item Card (field 60516)
2. Ensure template code matches item assignment
3. Manually set "CLE Prod. Order Task List" field on production order if needed
4. Field validation will trigger CreateTaskLines

---

### Issue 2: Tasks Created Multiple Times (Duplicates)

**Symptoms:** Multiple identical task lines appear with different Line No.

**Root Causes:**
- CreateTaskLines called multiple times
- Event subscribers firing repeatedly
- Refresh clicked multiple times rapidly

**Resolution:**
1. Delete duplicate lines from task list page
2. Clear "CLE Prod. Order Task List" field (deletes all tasks)
3. Re-assign template to recreate tasks correctly
4. Verify only one event subscriber registered

---

### Issue 3: Generic Tasks on Orders Without Templates

**Symptoms:** Tasks appear on production orders where item has no template

**Root Cause:** Orphaned template lines with blank Code field

**Resolution:**
1. Contact Microsoft Partner for database cleanup
2. Use Configuration Packages to export, clean, and reimport data
3. Verify all templates have Code values (required)

---

### Issue 4: Cannot Change Task Template

**Symptoms:** Error "Cannot change or delete the task list because completed tasks exist"

**Expected Behavior:** By design - protects historical data

**Workaround:**
1. Open completed tasks
2. Mark as Completed again to reopen them
3. After reopening, template can be changed
4. Alternative: Create new production order with correct template

---

### Issue 5: Due Dates Not Calculating

**Symptoms:** Due Date field blank or doesn't update when production dates change

**Root Causes:**
- "Due Date Calc. Based on Field" not set in template
- "Due Date Calc. Formula" blank or invalid
- Base date field on production order blank

**Resolution:**
1. Verify template has due date calculation fields set
2. Check formula syntax: use format like `<-2D>` for 2 days before
3. Ensure production order has due date/routing dates
4. Change production order Due Date to trigger recalculation

---

### Issue 6: Tasks Not Visible to Staff

**Symptoms:** Tasks exist in database but don't show in task list

**Root Causes:**
- Tasks not marked as Released
- User lacking proper permissions
- Filter applied in page view

**Resolution:**
1. Open "Production Order Tasks to Approve"
2. Verify tasks are Released (checkbox marked)
3. Check user permissions on table 50039
4. Clear any filters applied to page

---

### Issue 7: Task Line Number Conflicts

**Symptoms:** Error on insert "Duplicate primary key"

**Root Cause:** CreateTask split-key algorithm failed or concurrent inserts

**Resolution:**
1. Delete duplicate task lines from UI
2. Clear "CLE Prod. Order Task List" field
3. Re-assign template to recreate all tasks correctly

---

## Data Integrity Issues

### Orphaned Task Lines

**Detection:**
```sql
SELECT t."Prod. Order No.", t."Prod. Order Status", COUNT(*) AS LineCount
FROM "CLE Prod. Order Task Line" t
LEFT JOIN "Production Order" p 
    ON t."Prod. Order No." = p."No." 
    AND t."Prod. Order Status" = p.Status
WHERE t.Template = 0
  AND p."No." IS NULL
```

**Cleanup:** Contact Microsoft Partner for database cleanup or use Configuration Packages

### Template Lines Without Code

**Detection:** Open "Prod. Order Task Templates" and look for blank Code fields

**Prevention:** Page 50143 now requires Code before allowing lines

### Task Lines with Invalid Status

**Detection:** Compare "Prod. Order Status" on task line with actual production order status

**Cleanup:** Run CleanupFinishedTasks procedure or manually recreate tasks

---

## Performance Optimization

### Slow Template Loading

**Causes:**
- Large templates (100+ lines)
- Missing indexes
- FlowField calculations

**Optimization:**
1. Add index on Code field:
   ```sql
   CREATE INDEX IX_ProdOrderTaskHeader_Code
   ON "CLE Prod. Order Task Header"(Code)
   WHERE Template = 1;
   ```
2. Use LoadFields to load only needed columns
3. Limit FlowField calculations to detail view only

### Bulk Approval Performance

**Issue:** Approval page slow with many tasks

**Optimization:**
1. Add index:
   ```sql
   CREATE INDEX IX_ProdOrderTaskLine_Released
   ON "CLE Prod. Order Task Line"(Released)
   WHERE Template = 0 AND Released = 0;
   ```
2. Implement paging in approval page
3. Use batch approval actions

---

## Testing Procedures

### Test Case 1: Template Creation and Assignment

1. Create new template with Code "TEST-001"
2. Add 3 task lines (1 Headline, 2 Tasks)
3. Set due date calculation on tasks
4. Assign template to test item
5. Create production order for item
6. Verify 3 task lines copied with correct Line Type and due dates

### Test Case 2: Refresh Production Order

1. Create production order with tasks
2. Click Refresh Production Order
3. Complete some tasks, leave others uncompleted
4. Verify tasks updated correctly

### Test Case 3: Status Change Migration

1. Create Firm Planned production order with tasks
2. Change status to Released
3. Verify tasks migrated correctly

### Test Case 4: Large Template Performance

1. Create template with 100+ lines
2. Create production order
3. Measure copy time (should be < 5 seconds)
4. Verify no timeouts

---

## Database Maintenance

### Monthly Tasks

1. **Cleanup Finished Production Order Tasks:**
   - Move tasks from Released status to Finished when prod order finishes
   - Run CleanupFinishedTasks procedure

2. **Remove Orphaned Template Lines:**
   ```sql
   DELETE FROM "CLE Prod. Order Task Line"
   WHERE Template = 1
     AND Code NOT IN (SELECT Code FROM "CLE Prod. Order Task Header" WHERE Template = 1)
   ```

3. **Verify Data Consistency:**
   - Check for orphaned task lines
   - Check for template lines without headers
   - Verify status consistency

---

## Debugging Guide

### Enable Debug Logging

Add temporary logging in CreateTaskLines procedure:
```al
DebugMsg := 'Items loaded: ' + Format(RapidOrderEntryLine.Count);
Message(DebugMsg);
```

### Key Breakpoint Locations

1. Codeunit 50058, CreateTaskLines procedure (line 44)
2. Codeunit 50058, CreateTask procedure (line 190)
3. Codeunit 50057, SourceNoOnAfterValidateEvent (line 10)
4. Table 50047 (Production Order), OnValidate CLE Prod. Order Task List (line 13)

### Inspect Session Variables

```al
// In OrderEntryVariables codeunit
procedure GetStoredHeader(): Record "Sales Header"
procedure GetLastLineNo(): Integer
procedure GetShipmentDateBlocked(): Boolean
```

---

## Related Pages

- [[prod-order-overview]] — Production order lifecycle overview
- [[prod-order-posting-staff]] — Staff guide for posting production output
- [[prod-order-posting-manager]] — Manager guide for production orders
- [[prod-order-task-manager]] — Manager guide for task templates
