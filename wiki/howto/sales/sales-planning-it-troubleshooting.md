---
title: Sales Planning — IT Troubleshooting
type: howto
tags: [sales-planning, sales-targets, it-support, system-architecture, troubleshooting]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-planning-it-troubleshooting-guide.md]
---

# Sales Planning — IT Troubleshooting

Technical guide for IT staff supporting the Sales Planning module.

## System Overview

| Component | Details |
|-----------|---------|
| **Main Table** | `50006 "CLE Sales Target"` (hierarchical structure) |
| **Weekly Table** | `50022 "CLE Sales Target by Week"` |
| **History Table** | `50025 "CLE Sales Line History"` |
| **Main Page** | `50046 "CLE Salesperson Planning"` (tree view) |
| **Main Codeunit** | `50023 "CLE Sales Planning Mgt"` |

## Hierarchical Structure

**Headline Rows:**
- Blank Financial Season field
- Automatically aggregate detail rows
- `Headline` field = TRUE
- `Indention` field = 0

**Detail Rows:**
- Specific Financial Season (Spring/Summer/Fall/Winter)
- `Headline` field = FALSE
- `Indention` field = 1
- Changes propagate to headline via `AdjustValuesFromDetailLine()` procedure

## Common Issues & Troubleshooting

### Issue 1: Headline Totals Incorrect

**Symptoms:**
- Headline row shows wrong total
- Detail rows sum doesn't match headline
- Tree view displays stale data

**Root Causes:**
- `AdjustValuesFromDetailLine()` not triggered
- Orphaned headline (no detail rows)
- Database trigger disabled
- Concurrent modification conflict

**Resolution:**

**Method 1: Trigger Recalculation**
1. Open Sales Planning worksheet
2. Navigate to affected detail row
3. Change Sales Target value slightly (+$1)
4. Press Enter
5. Change back to correct value
6. Verify headline updates

**Method 2: Delete and Recreate Headline**
1. Delete headline row
2. Modify any detail row
3. System recreates headline with correct total

---

### Issue 2: Cannot Request Approval

**Symptoms:**
- Request Approval button disabled
- Error message: "No approval can be requested"
- Email not sent to manager

**Root Causes:**
- Sales Target (LCY) is zero or blank
- Approval Status not "Open"
- User lacks salesperson permission
- Manager email not configured

**Resolution:**

**For Zero Amounts:**
1. Update target amounts before requesting approval

**For Missing Manager Email:**
1. Open Salesperson/Purchaser card for salesperson
2. Verify "CLE Manager Code" is populated
3. Open manager's Salesperson/Purchaser card
4. Verify "E-Mail" field is populated
5. Test email connectivity

---

### Issue 3: Revenue Prev. Year Not Calculating

**Symptoms:**
- Revenue prev. Year shows $0.00
- Prior year data exists in Sales Line History
- "Insert My Customers" doesn't populate historical revenue

**Root Causes:**
- Sales Line History not populated for prior year
- Salesperson code mismatch
- Financial season not calculated correctly
- FlowField calculation error

**Resolution:**

**Method 1: Recalculate FlowFields**
1. Open Sales Planning worksheet
2. Close and reopen to force refresh
3. Press Shift+F9 to recalculate all FlowFields

**Method 2: Verify Historical Data Import**
1. Check Sales Line History population procedure
2. Verify procedure runs during sales order posting
3. Ensure historical data migration completed
4. Re-import if necessary

**Method 3: Fix Salesperson Mismatch**
```sql
-- Update historical records if salesperson changed
UPDATE "CLE Sales Line History"
SET "Salesperson Code" = '<NEW_SALESPERSON_CODE>'
WHERE "Customer No." = '<CUSTOMER_NO>'
  AND "Salesperson Code" = '<OLD_SALESPERSON_CODE>'
  AND YEAR("Booking Date") = 2025
```

---

### Issue 4: Weekly Breakdown Not Updating

**Symptoms:**
- Modified seasonal target, but weekly targets unchanged
- Week Target (LCY) doesn't sum to season total
- Cannot save weekly breakdown changes

**Root Causes:**
- `UpdateSalesTargetByWeek()` not triggered
- Weekly records not created
- Past week modification attempt
- Validation error on cumulative percentages

**Resolution:**

**Method 1: Delete and Recreate Weekly Records**
1. Delete all weekly records for affected season
2. Open Sales Planning worksheet
3. Modify seasonal target (even by $1)
4. Press Enter
5. System recreates weekly records with even distribution

**Method 2: Recalculate Weekly Distribution**
1. Run distribution procedure from AL code
2. Reset week targets to even percentages
3. Verify cumulative percentages are increasing

**Method 3: Fix Cumulative Percentage Errors**
1. Export weekly data to Excel
2. Recalculate cumulative percentages
3. Ensure each week ≥ previous week
4. Final week = 100%
5. Re-import corrected data

---

## Data Integrity Checks

### Check 1: Orphaned Headlines

Identify headline rows with no detail rows:

```sql
SELECT h."Year", h."Salesperson Code", h."Customer No."
FROM "CLE Sales Target" h
WHERE h.Headline = TRUE
  AND h."Financial Season" = ''
  AND NOT EXISTS (
      SELECT 1 
      FROM "CLE Sales Target" d
      WHERE d."Year" = h."Year"
        AND d."Salesperson Code" = h."Salesperson Code"
        AND d."Customer No." = h."Customer No."
        AND d.Headline = FALSE
  );
```

**Resolution:** Delete orphaned headlines or create corresponding detail rows.

### Check 2: Mismatched Indentation

```sql
SELECT "Year", "Salesperson Code", "Customer No.", Headline, Indention
FROM "CLE Sales Target"
WHERE (Headline = TRUE AND Indention <> 0)
   OR (Headline = FALSE AND Indention <> 1);
```

**Resolution:** Correct indentation values:
```sql
UPDATE "CLE Sales Target"
SET Indention = 0 WHERE Headline = TRUE AND Indention <> 0;

UPDATE "CLE Sales Target"
SET Indention = 1 WHERE Headline = FALSE AND Indention <> 1;
```

### Check 3: Inconsistent Totals

Find headlines where total doesn't match sum of details:

```sql
SELECT 
    h."Year", h."Salesperson Code", h."Customer No.",
    h."Sales Target (LCY)" AS "Headline Total",
    COALESCE(SUM(d."Sales Target (LCY)"), 0) AS "Detail Sum",
    h."Sales Target (LCY)" - COALESCE(SUM(d."Sales Target (LCY)"), 0) AS "Difference"
FROM "CLE Sales Target" h
LEFT JOIN "CLE Sales Target" d
    ON d."Year" = h."Year"
    AND d."Salesperson Code" = h."Salesperson Code"
    AND d."Customer No." = h."Customer No."
    AND d.Headline = FALSE
WHERE h.Headline = TRUE
GROUP BY h."Year", h."Salesperson Code", h."Customer No."
HAVING h."Sales Target (LCY)" <> COALESCE(SUM(d."Sales Target (LCY)"), 0);
```

---

## Performance Optimization

### Issue: Slow Tree View Loading

**Causes:**
- Large dataset (thousands of targets)
- Missing indexes
- FlowField calculation overhead
- No date range filter applied

**Optimization Steps:**

1. **Add Filters Before Opening:**
   - Apply year filter in code before opening page
   - Reduces initial load significantly

2. **Add Indexes:**
   ```sql
   CREATE INDEX IX_SalesTarget_Year_Salesperson_Customer 
   ON "CLE Sales Target" ("Year", "Salesperson Code", "Customer No.");
   ```

3. **Optimize FlowField Calculations:**
   - Add SIFT key in Sales Line History
   - Load FlowFields only when needed
   - Cache calculations where possible

4. **Implement Paging:**
   - Limit initial load to current year
   - Add year selector to filter data
   - Implement "Load More" functionality

### Issue: Bulk Update Takes Too Long

**Optimization Steps:**

1. **Add Progress Indicators:**
   - Show count progress during updates
   - Allow user to monitor long-running operations

2. **Batch Processing:**
   - Commit every 100 records to prevent locks
   - Process in smaller chunks (by customer/season)
   - Run during off-hours for large updates

3. **Disable Unnecessary Triggers:**
   - Use `Modify(false)` to skip validations where appropriate
   - Only recalculate when needed

---

## Approval Workflow Issues

### Issue: Email Notifications Not Sent

**Causes:**
- SMTP server not configured
- Manager email not populated
- Email queue issues

**Resolution:**

1. **Configure SMTP:**
   - Open Email Accounts page
   - Set up SMTP connector
   - Test email sending

2. **Fix Manager Assignment:**
   - Open Salesperson/Purchaser cards
   - Set "CLE Manager Code" field
   - Verify manager has valid email

3. **Review Email Template:**
   - Check email body construction
   - Verify all placeholders populated
   - Test with simple message first

---

## Weekly Breakdown Issues

### Issue: Cannot Modify Past Weeks

**Expected Behavior:**
- Weeks with end date in the past are locked
- Prevents retroactive target changes

**Workaround (use with caution):**
1. Temporarily comment out past-week check
2. Make correction
3. Document change reason
4. Re-enable lock

---

## Integration Problems

### Issue: Sales Line History Not Populating

**Symptoms:**
- New sales orders not appearing in history
- Booked amount not updating

**Resolution:**

1. **Re-register Event Subscriber:**
   - Recompile event subscriber codeunit
   - Verify subscriber in Event Subscriptions page
   - Test with new sales order

2. **Backfill Historical Data:**
   - Create history records for existing sales orders
   - Run backfill procedure during off-hours

---

## Database Maintenance

### Routine Maintenance Tasks

**Daily:**
- Monitor Sales Line History growth
- Check for approval request email failures
- Verify active user sessions

**Weekly:**
- Run data integrity checks
- Review orphaned records
- Analyze performance metrics

**Monthly:**
- Archive old year targets (keep current + 2 prior years)
- Rebuild indexes if fragmentation > 30%
- Review and optimize slow queries

### Backup Recommendations

- **Frequency:** Daily incremental, weekly full
- **Retention:** 30 days online, 7 years tape
- **Critical Tables:**
  - CLE Sales Target
  - CLE Sales Target by Week
  - CLE Sales Line History

---

## User Permission Issues

### Standard Permission Sets

**SALES-USER:**
- Read/Insert/Modify "CLE Sales Target"
- Read "CLE Sales Target by Week"
- Modify own targets only
- Request approval

**SALES-MANAGER:**
- Read/Insert/Modify all "CLE Sales Target"
- Approve/decline requests
- Reopen approved targets
- Bulk operations

**SALES-ADMIN:**
- Full access to all tables
- Database maintenance functions
- Historical data correction

---

## Related Pages

- [[sales-planning]] — User guide for sales planning
- [[sales-order-management]] — Sales order reference
