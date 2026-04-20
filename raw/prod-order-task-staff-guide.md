# Production Order Tasks - Staff Guide

## Overview

This guide helps you understand and complete production order tasks. Tasks are checklists that ensure quality and consistency in production operations.

## Table of Contents

1. [Accessing Your Tasks](#accessing-your-tasks)
2. [Understanding Task Types](#understanding-task-types)
3. [Completing Tasks](#completing-tasks)
4. [Understanding Due Dates](#understanding-due-dates)
5. [Common Scenarios](#common-scenarios)
6. [Troubleshooting](#troubleshooting)

---

## Accessing Your Tasks

There are two main ways to view your production order tasks:

### Method 1: From the Production Order

1. Open the **Released Production Order** you're working on
2. Look for the **Tasks FactBox** on the right side
   - Shows quick summary of tasks
   - Shows completion status
3. Click **Related** → **Tasks** for the full list

### Method 2: Task Worksheet (All Orders)

1. Search for **Production Order Task Worksheet**
2. This shows ALL tasks across ALL production orders
3. Filter by:
   - Location Code (your facility)
   - Due Date (what's due today)
   - Production Order No. (specific order)
   - Completion status (show only incomplete tasks)

---

## Understanding Task Types

Tasks are organized into three types, each with a different purpose:

### Headlines (Bold Text)

```
✓ **Preparation Phase**
```

**Purpose:** Section headers that organize tasks into logical groups

**What to do:** Nothing - these are just headers. They're automatically "approved" and show in bold.

**Example:** "Preparation Phase", "Quality Checks", "Cleanup"

### Tasks (Indented)

```
  ☐ Inspect raw materials
  ☐ Prepare workstation
  ☑ Initial quality check (completed)
```

**Purpose:** Actual work items you need to complete

**What to do:** Complete the work described, then mark as completed

**Example:** "Inspect raw materials", "Clean work area", "Final quality check"

### Information (Indented)

```
  ℹ Quality standards document: QS-2024-01
```

**Purpose:** Reference information, notes, or special instructions

**What to do:** Read and follow the information, but no checkbox to complete

**Example:** "Refer to SOP-123 for procedures", "Material safety note: wear gloves"

---

## Completing Tasks

### Step-by-Step Process

1. **View Available Tasks**
   - Open the production order's task list
   - Only released tasks are shown by default
   - Released = approved for you to work on

2. **Check What's Due**
   - Look at the **Due Date** column
   - Focus on overdue tasks first (red/highlighted)
   - Then work on tasks due today
   - Plan ahead for upcoming tasks

3. **Complete the Work**
   - Read the task description carefully
   - Follow any special instructions
   - Perform the required work
   - Verify quality standards are met

4. **Mark as Completed**
   - Select the task line
   - Click **Mark as Completed** action
   - OR check the **Completed** box

5. **Confirmation Dialogs**

   You may see different messages:

   **If task is not due yet:**
   ```
   ***WARNING!***
   This task is not yet due.
   Do you really want to mark it as completed?
   ```
   - Click **Yes** only if you completed it early
   - Click **No** to leave it incomplete

   **If task is due or overdue:**
   ```
   Do you want to mark this task as completed?
   ```
   - Click **Yes** to confirm completion
   - Click **No** to cancel

   **If already completed:**
   ```
   This Task is already marked as completed. 
   Do you want to undo that?
   ```
   - Click **Yes** to reopen the task
   - Click **No** to leave it completed

6. **Verify Completion**
   - Completed tasks show checkmark (☑) or highlighted
   - **Completion Date** is automatically filled
   - Your user name may be recorded (system dependent)

### Important Notes

- **You cannot complete Headlines** - they're just section headers
- **You cannot complete Information lines** - they're reference only
- **Only complete a task when the work is actually done**
- **Don't mark tasks as complete before they're due** unless actually finished early

---

## Understanding Due Dates

### How Due Dates Work

Due dates tell you WHEN a task should be completed. They're automatically calculated based on:

- Production order due date
- Routing operation dates
- Production line start/end dates
- Time formulas set by managers

### Due Date Status

| Status | What It Means | What To Do |
|--------|---------------|------------|
| **Future Date** | Task not yet due | Can complete early if ready |
| **Today** | Due today | Complete today |
| **Past Date** | Overdue | Complete immediately, highest priority |

### Common Due Date Patterns

```
Preparation tasks:     2-3 days BEFORE production start
Quality checks:        DURING production (specific routing steps)
Completion tasks:      SAME DAY as production end
Cleanup tasks:         AFTER production complete
```

### What If I Can't Meet the Due Date?

1. **Notify your supervisor immediately**
2. **Don't mark the task as complete if it's not done**
3. **Supervisor may adjust due dates or priorities**
4. **Follow escalation procedures for critical delays**

---

## Common Scenarios

### Scenario 1: Starting a New Production Order

**What you see:**
- Task list with Headlines and Tasks
- Some tasks already have checkmarks (auto-approved)
- Due dates showing when each task needs completion

**What to do:**
1. Review all tasks to understand the full workflow
2. Start with the first uncompleted task due today or overdue
3. Work through tasks in order (top to bottom)
4. Mark each completed as you finish

### Scenario 2: Multiple Orders at Once

**What you see:**
- Task Worksheet showing tasks from several production orders
- Mixed due dates and priorities

**What to do:**
1. Filter by **Due Date** to see what's overdue
2. Complete all overdue tasks first
3. Then filter for today's due tasks
4. Organize by priority or location as needed

### Scenario 3: Task Completed Before Due Date

**Example:** Workstation preparation due tomorrow, but you have time today

**What to do:**
1. Complete the work
2. Click **Mark as Completed**
3. You'll get a warning: "This task is not yet due"
4. Click **Yes** to confirm early completion
5. This is okay - better to work ahead when possible

### Scenario 4: Cannot Complete Task on Time

**Example:** Equipment breakdown, material delay, or other issue

**What to do:**
1. **DO NOT mark as completed** if work isn't done
2. Report to supervisor immediately
3. Document the reason in your communication
4. Supervisor will reschedule or reassign
5. Complete when able, then mark completed

### Scenario 5: Accidentally Marked Task Complete

**What to do:**
1. Select the task that was incorrectly marked
2. Click **Mark as Completed** again
3. You'll see: "This Task is already marked as completed. Do you want to undo that?"
4. Click **Yes** to reopen the task
5. Complete it properly when the work is actually done

### Scenario 6: Task Description Unclear

**What to do:**
1. Read any Information lines nearby for context
2. Check if there's a document reference (e.g., "See SOP-123")
3. Ask your supervisor for clarification
4. Do not guess - better to ask than do incorrectly

### Scenario 7: Extra Work Required Not on List

**What to do:**
1. Complete the work as needed (safety first)
2. Report to supervisor that additional work was required
3. Supervisor can add a manual task to the list for documentation
4. This helps improve future task templates

---

## Task List Navigation

### Viewing Options

**Default View (Released Tasks Only):**
```
Shows only tasks that are approved for you to work on
```

**All Tasks View:**
```
Shows unreleased (pending approval) and released tasks
Usually accessed via Edit Mode or specific pages
```

### Filtering Tasks

Common filters to use:

| Filter | Purpose | How |
|--------|---------|-----|
| **Completed = No** | Show only incomplete tasks | Set Completed filter to No |
| **Due Date = Today** | Show today's work | Set Due Date filter to today |
| **Due Date < Today** | Show overdue tasks | Set Due Date filter to ..Today |
| **Location Code** | Show your facility only | Set Location filter to your code |

### Sorting Tasks

Useful sort orders:

| Sort By | Best For |
|---------|----------|
| **Due Date** | Prioritizing what's urgent |
| **Line No.** | Following task order |
| **Prod. Order No.** | Working one order at a time |
| **Description** | Finding specific task type |

---

## Task Completion Best Practices

### ✓ DO:

- **Read the entire task description** before starting
- **Check for Information lines** with special instructions
- **Complete tasks in order** unless instructed otherwise
- **Mark completed immediately** after finishing
- **Report issues** that prevent completion
- **Ask questions** if description is unclear
- **Work ahead** when time permits
- **Keep work area clean** as indicated in tasks

### ✗ DON'T:

- **Don't mark complete until work is done** - this is critical for quality
- **Don't skip tasks** unless supervisor approves
- **Don't ignore due dates** - they're set for a reason
- **Don't guess** if you're unsure about a task
- **Don't modify tasks** - report needed changes to supervisor
- **Don't mark Headlines or Information lines** - they can't be completed

---

## Task Indicators and Icons

| Indicator | Meaning |
|-----------|---------|
| **Bold text** | Headline (section header) |
| Regular text, indented | Task or Information line |
| ☐ or empty checkbox | Task not completed |
| ☑ or checked box | Task completed |
| Date in Due Date | When task should be done |
| Date in Completion Date | When task was marked complete |

---

## Troubleshooting

### Problem: Can't See Any Tasks

**Possible Causes:**
- No tasks have been released/approved yet
- Filter is hiding tasks
- Wrong production order selected

**Solution:**
1. Check with supervisor if tasks should exist
2. Clear any filters (reset the view)
3. Verify you're looking at the correct production order
4. Ask supervisor to release tasks if they exist but aren't visible

### Problem: Can't Mark Task as Complete

**Possible Causes:**
- Task is a Headline (can't be completed)
- Task is an Information line (can't be completed)
- System permissions issue

**Solution:**
1. Check the Line Type - only Tasks can be completed
2. If it's definitely a Task, contact supervisor
3. May need system administrator for permission issues

### Problem: Task Due Date Seems Wrong

**Cause:** Due dates are auto-calculated from production schedules

**Solution:**
1. Report to supervisor if date seems impossible
2. Supervisor can adjust due dates if needed
3. Due dates update automatically if production dates change

### Problem: Task List Changed or Disappeared

**Possible Causes:**
- Production order was refreshed
- Template was changed by manager
- Tasks were removed due to production order changes

**Solution:**
1. Contact supervisor immediately
2. Check with supervisor for new instructions
3. New tasks may have been added - check full list

### Problem: Accidentally Completed Wrong Task

**Solution:**
1. Select the wrong task
2. Click **Mark as Completed** again
3. Click **Yes** when asked if you want to undo
4. Task reopens and you can complete the correct one

---

## Safety Notes

### Task Safety Priorities

1. **If a task describes unsafe conditions:**
   - STOP work immediately
   - Report to supervisor
   - Do not mark task as complete
   - Follow safety procedures

2. **If you're unsure about safety:**
   - Ask supervisor or safety officer
   - Better safe than sorry
   - Safety always comes first

3. **If equipment is malfunctioning:**
   - Stop and report immediately
   - Do not attempt to complete task
   - Supervisor will address equipment issue

---

## Tips for Efficiency

### Planning Your Day

1. **Start by checking overdue tasks** - highest priority
2. **Review today's due tasks** - plan your sequence
3. **Look ahead to tomorrow** - prepare materials if needed
4. **Group similar tasks** - minimize equipment changes
5. **Update completion status regularly** - don't wait until end of day

### Working Through Task Lists

1. **Follow the sequence** - tasks are ordered logically
2. **Don't skip around** unless necessary - order matters for quality
3. **Complete one production order at a time** when possible
4. **Keep task list visible** while working
5. **Mark completed immediately** - don't rely on memory

### Communication

1. **Report problems early** - don't wait until task is overdue
2. **Update supervisor on progress** - especially for long tasks
3. **Ask questions** - there are no stupid questions about safety or quality
4. **Suggest improvements** - if you see a better way, share it

---

## Quick Reference Card

### My Daily Checklist

```
□ Open Production Order Task Worksheet
□ Filter to my Location Code
□ Check for overdue tasks (Due Date < Today)
□ Complete all overdue tasks first
□ Filter to today's due tasks (Due Date = Today)
□ Work through tasks in order
□ Mark each as completed after finishing
□ Check tomorrow's tasks before end of day
□ Report any issues to supervisor
```

### When in Doubt

```
1. Read the task description carefully
2. Check for Information lines with instructions
3. Ask your supervisor
4. Better to ask than to do it wrong
```

---

## Getting Help

**For Task Questions:**
- Your direct supervisor
- Production manager
- Reference Information lines in task list

**For System Issues:**
- IT support desk
- System administrator
- Your supervisor (they can escalate)

**For Safety Concerns:**
- Safety officer
- Your supervisor
- Emergency protocols (if immediate danger)

---

## Appendix: Task Status Flowchart

```
NEW TASK
    ↓
Awaiting Release (pending manager approval)
    ↓
RELEASED (appears in your task list)
    ↓
You complete the work
    ↓
You mark as completed
    ↓
System records completion date
    ↓
COMPLETED (checked off, shows in history)
```

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**System Version:** Clesen Horticulture Extension 26.4.0+

---

## Remember

✓ **Quality First** - Don't rush through tasks  
✓ **Safety Always** - Stop if unsafe  
✓ **Ask Questions** - Better to clarify than guess  
✓ **Mark Accurately** - Only complete when truly done  
✓ **Report Issues** - Help improve the system  

**Good work on production order tasks ensures quality products and efficient operations. Thank you for your attention to detail!**

---

## Related documents

- [[prod-order-Posting-Documentation]]
- [[prod-order-posting-staff-guide]]
- [[prod-order-posting-manager-guide]]
- [[prod-order-posting-it-troubleshooting-guide]]
- [[prod-order-task-manager-guide]]
- [[prod-order-task-it-troubleshooting-guide]]
