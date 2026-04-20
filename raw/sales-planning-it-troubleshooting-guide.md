# Sales Planning IT Troubleshooting Guide

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Common Issues](#common-issues)
4. [Data Integrity Checks](#data-integrity-checks)
5. [Performance Optimization](#performance-optimization)
6. [Approval Workflow Issues](#approval-workflow-issues)
7. [Calculation Problems](#calculation-problems)
8. [Weekly Breakdown Issues](#weekly-breakdown-issues)
9. [Integration Problems](#integration-problems)
10. [Database Maintenance](#database-maintenance)
11. [User Permission Issues](#user-permission-issues)

---

## Overview

This guide provides IT staff and system administrators with detailed troubleshooting procedures for the Sales Planning module. It covers common issues, diagnostic queries, and resolution steps.

### Key Tables

- **50006 "CLE Sales Target"**: Main sales planning table with hierarchical structure
- **50022 "CLE Sales Target by Week"**: Weekly breakdown of seasonal targets
- **50025 "CLE Sales Line History"**: Historical sales tracking for performance comparison

### Key Pages

- **50046 "CLE Salesperson Planning"**: Main worksheet interface with tree view

### Key Codeunits

- **50023 "CLE Sales Planning Mgt"**: Calculation and bulk update logic
- **50009 "CLE Sales Management"**: Sales order integration

### Key Enums

- **60106 "CLE Season"**: Financial seasons (Spring, Summer, Fall, Winter)
- **60130 "CLE Sales Approval Status"**: Open, Approval requested, Approved, Declined

---

## System Architecture

### Hierarchical Structure

**Headline Rows:**
- Identified by blank Financial Season field
- Automatically aggregate detail rows for same customer/year
- `Headline` field = TRUE
- `Indention` field = 0

**Detail Rows:**
- Have specific Financial Season (Spring/Summer/Fall/Winter)
- `Headline` field = FALSE
- `Indention` field = 1
- Changes propagate to headline via `AdjustValuesFromDetailLine()` procedure

### Tree View Display

Page 50046 uses these properties:
```al
ShowAsTree = true;
IndentationColumn = Indention;
IndentationControls = "Customer No.", "Customer Name";
```

### Calculation Chain

1. User modifies detail row (e.g., Spring Sales Target)
2. `OnValidate` trigger fires on Sales Target (LCY) field
3. `UpdateSalesTargetByWeek()` procedure called → updates weekly breakdown table
4. `AdjustValuesFromDetailLine()` procedure called → updates headline row
5. Headline row recalculates totals from all detail rows
6. Tree view refreshes to show updated values

---

## Common Issues

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

**Diagnostic Steps:**

1. **Verify detail rows exist:**
```sql
SELECT 
    "Year",
    "Salesperson Code",
    "Customer No.",
    "Financial Season",
    "Sales Target (LCY)",
    Headline,
    Indention
FROM "CLE Sales Target"
WHERE "Customer No." = '<CUSTOMER_NO>' 
  AND "Year" = 2026
ORDER BY Headline DESC, "Financial Season";
```

Expected result: 1 headline row (Season = '') + 4 detail rows (Spring/Summer/Fall/Winter)

2. **Calculate expected headline total:**
```sql
SELECT 
    SUM("Sales Target (LCY)") AS "Expected Headline Total"
FROM "CLE Sales Target"
WHERE "Customer No." = '<CUSTOMER_NO>' 
  AND "Year" = 2026
  AND "Financial Season" <> ''
  AND Headline = FALSE;
```

3. **Compare to actual headline:**
```sql
SELECT 
    "Sales Target (LCY)" AS "Actual Headline Total"
FROM "CLE Sales Target"
WHERE "Customer No." = '<CUSTOMER_NO>' 
  AND "Year" = 2026
  AND "Financial Season" = ''
  AND Headline = TRUE;
```

**Resolution:**

**Method 1: Trigger Recalculation**
1. Open Sales Planning worksheet
2. Navigate to affected detail row
3. Change Sales Target value slightly (e.g., +$1)
4. Press Enter
5. Change back to correct value
6. Press Enter
7. Verify headline updates

**Method 2: Delete and Recreate Headline**
1. Delete headline row
2. Modify any detail row
3. System automatically recreates headline with correct total

**Method 3: Run Recalculation Procedure (if available)**
```al
// Run from AL code
SalesTarget.SetRange("Customer No.", '<CUSTOMER_NO>');
SalesTarget.SetRange("Year", 2026);
SalesTarget.SetRange(Headline, false);
if SalesTarget.FindSet() then
    repeat
        SalesTarget.Validate("Sales Target (LCY)");
        SalesTarget.Modify(true);
    until SalesTarget.Next() = 0;
```

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

**Diagnostic Steps:**

1. **Check target amounts:**
```sql
SELECT 
    "Customer No.",
    "Financial Season",
    "Sales Target (LCY)",
    "Approval Status"
FROM "CLE Sales Target"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND ("Sales Target (LCY)" = 0 OR "Sales Target (LCY)" IS NULL);
```

2. **Check approval status:**
```sql
SELECT 
    "Customer No.",
    "Financial Season",
    "Approval Status"
FROM "CLE Sales Target"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Approval Status" <> 0; -- 0 = Open
```

3. **Verify salesperson setup:**
```sql
SELECT 
    "Code",
    "Name",
    "E-Mail",
    "CLE Manager Code"
FROM "Salesperson/Purchaser"
WHERE "Code" = '<SALESPERSON_CODE>';
```

4. **Verify manager setup:**
```sql
SELECT 
    "Code",
    "Name",
    "E-Mail"
FROM "Salesperson/Purchaser"
WHERE "Code" = '<MANAGER_CODE>';
```

**Resolution:**

**For Zero Amounts:**
1. Update target amounts before requesting approval
2. Verify calculations are correct

**For Status Issues:**
1. Reopen previously approved/declined targets
2. Reset status to "Open" if needed:
```sql
UPDATE "CLE Sales Target"
SET "Approval Status" = 0 -- 0 = Open
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Approval Status" IN (2, 3); -- 2=Approved, 3=Declined
```

**For Missing Manager Email:**
1. Open Salesperson/Purchaser card for the salesperson
2. Verify "CLE Manager Code" is populated
3. Open manager's Salesperson/Purchaser card
4. Verify "E-Mail" field is populated
5. Test email connectivity

### Issue 3: Revenue prev. Year Not Calculating

**Symptoms:**
- Revenue prev. Year shows $0.00
- Prior year data exists in Sales Line History
- "Insert My Customers" doesn't populate historical revenue

**Root Causes:**
- Sales Line History not populated for prior year
- Salesperson code mismatch
- Financial season not calculated correctly
- Booking date vs shipment date confusion
- FlowField calculation error

**Diagnostic Steps:**

1. **Verify Sales Line History exists:**
```sql
SELECT 
    "Salesperson Code",
    "Customer No.",
    "Fin. Season",
    "Booking Date",
    "Shipment Date",
    "Line Amount (LCY)",
    "Document Type",
    "Document No."
FROM "CLE Sales Line History"
WHERE "Customer No." = '<CUSTOMER_NO>'
  AND YEAR("Booking Date") = 2025
ORDER BY "Booking Date" DESC;
```

2. **Check salesperson code:**
```sql
SELECT DISTINCT "Salesperson Code"
FROM "CLE Sales Line History"
WHERE "Customer No." = '<CUSTOMER_NO>'
  AND YEAR("Booking Date") = 2025;
```

3. **Verify season calculation:**
```sql
SELECT 
    "Fin. Season",
    COUNT(*) AS "Line Count",
    SUM("Line Amount (LCY)") AS "Total Amount"
FROM "CLE Sales Line History"
WHERE "Customer No." = '<CUSTOMER_NO>'
  AND YEAR("Booking Date") = 2025
GROUP BY "Fin. Season";
```

4. **Check FlowField definition:**
```al
// In Table 50006 "CLE Sales Target"
field(50008; "Revenue prev. Year (LCY)"; Decimal)
{
    CalcFormula = Sum("CLE Sales Line History"."Line Amount (LCY)" 
                      WHERE("Year" = FIELD("Year" - 1),
                            "Customer No." = FIELD("Customer No."),
                            "Salesperson Code" = FIELD("Salesperson Code"),
                            "Fin. Season" = FIELD("Financial Season")));
    FieldClass = FlowField;
}
```

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
  AND YEAR("Booking Date") = 2025;
```

**Method 4: Recalculate Financial Seasons**
```al
// Run from AL code to recalculate Fin. Season
SalesLineHistory.SetRange("Customer No.", '<CUSTOMER_NO>');
SalesLineHistory.SetRange("Year", 2025);
if SalesLineHistory.FindSet() then
    repeat
        // Recalculate Fin. Season based on Booking Date
        SalesLineHistory."Fin. Season" := GetFinancialSeason(SalesLineHistory."Booking Date");
        SalesLineHistory.Modify(false);
    until SalesLineHistory.Next() = 0;
```

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

**Diagnostic Steps:**

1. **Verify weekly records exist:**
```sql
SELECT 
    "Week No.",
    "Week Start Date",
    "Week End Date",
    "Season Target",
    "Week Target (LCY)",
    "Week Target %",
    "Current Week Target"
FROM "CLE Sales Target by Week"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Customer No." = '<CUSTOMER_NO>'
  AND "Season" = 1 -- 1=Spring
ORDER BY "Week No.";
```

2. **Check sum of weekly targets:**
```sql
SELECT 
    SUM("Week Target (LCY)") AS "Total Weekly",
    MAX("Season Target") AS "Season Target",
    SUM("Week Target (LCY)") - MAX("Season Target") AS "Difference"
FROM "CLE Sales Target by Week"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Customer No." = '<CUSTOMER_NO>'
  AND "Season" = 1; -- 1=Spring
```

3. **Verify cumulative percentages:**
```sql
SELECT 
    "Week No.",
    "Week Target %",
    "Current Week Target",
    LAG("Current Week Target") OVER (ORDER BY "Week No.") AS "Previous Cumulative",
    CASE 
        WHEN "Current Week Target" >= LAG("Current Week Target") OVER (ORDER BY "Week No.") THEN 'OK'
        ELSE 'ERROR: Decreasing'
    END AS "Validation"
FROM "CLE Sales Target by Week"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Customer No." = '<CUSTOMER_NO>'
  AND "Season" = 1
ORDER BY "Week No.";
```

**Resolution:**

**Method 1: Delete and Recreate Weekly Records**
1. Delete all weekly records for affected season:
```sql
DELETE FROM "CLE Sales Target by Week"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Customer No." = '<CUSTOMER_NO>'
  AND "Season" = 1;
```
2. Open Sales Planning worksheet
3. Modify seasonal target (even by $1)
4. Press Enter
5. System recreates weekly records with even distribution

**Method 2: Recalculate Weekly Distribution**
```al
// Run from AL code
SalesTargetByWeek.SetRange("Year", 2026);
SalesTargetByWeek.SetRange("Salesperson Code", '<SALESPERSON_CODE>');
SalesTargetByWeek.SetRange("Customer No.", '<CUSTOMER_NO>');
SalesTargetByWeek.SetRange(Season, SalesTargetByWeek.Season::Spring);

if SalesTargetByWeek.FindSet() then begin
    WeekCount := SalesTargetByWeek.Count;
    SeasonTarget := SalesTargetByWeek."Season Target";
    WeeklyAmount := SeasonTarget / WeekCount;
    
    repeat
        SalesTargetByWeek."Week Target (LCY)" := WeeklyAmount;
        SalesTargetByWeek."Week Target %" := (WeeklyAmount / SeasonTarget) * 100;
        // Calculate cumulative
        SalesTargetByWeek.Modify(false);
    until SalesTargetByWeek.Next() = 0;
end;
```

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
SELECT h."Year", h."Salesperson Code", h."Customer No.", h."Sales Target (LCY)"
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
        AND d."Financial Season" <> ''
  );
```

**Resolution**: Delete orphaned headlines or create corresponding detail rows.

### Check 2: Detail Rows Without Headlines

Identify detail rows with no headline:

```sql
SELECT d."Year", d."Salesperson Code", d."Customer No.", d."Financial Season"
FROM "CLE Sales Target" d
WHERE d.Headline = FALSE
  AND d."Financial Season" <> ''
  AND NOT EXISTS (
      SELECT 1 
      FROM "CLE Sales Target" h
      WHERE h."Year" = d."Year"
        AND h."Salesperson Code" = d."Salesperson Code"
        AND h."Customer No." = d."Customer No."
        AND h.Headline = TRUE
        AND h."Financial Season" = ''
  );
```

**Resolution**: Create headline rows or trigger recalculation.

### Check 3: Mismatched Indentation

Verify indentation is correct:

```sql
SELECT "Year", "Salesperson Code", "Customer No.", "Financial Season", Headline, Indention
FROM "CLE Sales Target"
WHERE (Headline = TRUE AND Indention <> 0)
   OR (Headline = FALSE AND Indention <> 1)
ORDER BY "Year", "Salesperson Code", "Customer No.", Headline DESC;
```

**Resolution**: Correct indentation values.

```sql
-- Fix headlines
UPDATE "CLE Sales Target"
SET Indention = 0
WHERE Headline = TRUE AND Indention <> 0;

-- Fix details
UPDATE "CLE Sales Target"
SET Indention = 1
WHERE Headline = FALSE AND Indention <> 1;
```

### Check 4: Inconsistent Totals

Find headlines where total doesn't match sum of details:

```sql
SELECT 
    h."Year",
    h."Salesperson Code",
    h."Customer No.",
    h."Sales Target (LCY)" AS "Headline Total",
    COALESCE(SUM(d."Sales Target (LCY)"), 0) AS "Detail Sum",
    h."Sales Target (LCY)" - COALESCE(SUM(d."Sales Target (LCY)"), 0) AS "Difference"
FROM "CLE Sales Target" h
LEFT JOIN "CLE Sales Target" d
    ON d."Year" = h."Year"
    AND d."Salesperson Code" = h."Salesperson Code"
    AND d."Customer No." = h."Customer No."
    AND d.Headline = FALSE
    AND d."Financial Season" <> ''
WHERE h.Headline = TRUE
  AND h."Financial Season" = ''
GROUP BY h."Year", h."Salesperson Code", h."Customer No.", h."Sales Target (LCY)"
HAVING h."Sales Target (LCY)" <> COALESCE(SUM(d."Sales Target (LCY)"), 0);
```

**Resolution**: Trigger recalculation procedure.

### Check 5: Weekly Totals Mismatch

Find seasons where weekly sum doesn't match season target:

```sql
SELECT 
    "Year",
    "Salesperson Code",
    "Customer No.",
    "Season",
    MAX("Season Target") AS "Season Target",
    SUM("Week Target (LCY)") AS "Weekly Sum",
    MAX("Season Target") - SUM("Week Target (LCY)") AS "Difference"
FROM "CLE Sales Target by Week"
GROUP BY "Year", "Salesperson Code", "Customer No.", "Season"
HAVING ABS(MAX("Season Target") - SUM("Week Target (LCY)")) > 0.01; -- Allow rounding
```

**Resolution**: Recalculate weekly distribution.

### Check 6: Missing Approved Target Values

Find approved targets without "Approved Target" populated:

```sql
SELECT 
    "Year",
    "Salesperson Code",
    "Customer No.",
    "Financial Season",
    "Sales Target (LCY)",
    "Approval Status",
    "Approved Target"
FROM "CLE Sales Target"
WHERE "Approval Status" = 2 -- Approved
  AND ("Approved Target" = 0 OR "Approved Target" IS NULL);
```

**Resolution**: Populate "Approved Target" field:

```sql
UPDATE "CLE Sales Target"
SET "Approved Target" = "Sales Target (LCY)"
WHERE "Approval Status" = 2 -- Approved
  AND ("Approved Target" = 0 OR "Approved Target" IS NULL);
```

---

## Performance Optimization

### Issue: Slow Tree View Loading

**Symptoms:**
- Sales Planning page takes >10 seconds to load
- Scrolling is sluggish
- Filtering is slow

**Causes:**
- Large dataset (thousands of targets)
- Missing indexes
- FlowField calculation overhead
- No date range filter applied

**Optimization Steps:**

1. **Add Filters Before Opening:**
```al
// Apply year filter before opening page
SalesTarget.SetRange("Year", CurrentYear);
Page.Run(Page::"CLE Salesperson Planning", SalesTarget);
```

2. **Add Indexes:**
```sql
-- Composite index for common filter combinations
CREATE INDEX IX_SalesTarget_Year_Salesperson_Customer 
ON "CLE Sales Target" ("Year", "Salesperson Code", "Customer No.");

-- Index for tree view sorting
CREATE INDEX IX_SalesTarget_Year_Customer_Headline_Season
ON "CLE Sales Target" ("Year", "Customer No.", Headline, "Financial Season");
```

3. **Optimize FlowField Calculations:**
```al
// In Table 50006, add SumIndexFields
field(50008; "Revenue prev. Year (LCY)"; Decimal)
{
    CalcFormula = Sum("CLE Sales Line History"."Line Amount (LCY)" 
                      WHERE("Year" = FIELD("Year" - 1),
                            "Customer No." = FIELD("Customer No."),
                            "Salesperson Code" = FIELD("Salesperson Code"),
                            "Fin. Season" = FIELD("Financial Season")));
    FieldClass = FlowField;
}

// Add SIFT key in Sales Line History
key(SalesTarget; "Year", "Customer No.", "Salesperson Code", "Fin. Season")
{
    SumIndexFields = "Line Amount (LCY)";
}
```

4. **Implement Paging:**
- Limit initial load to current year only
- Add year selector to filter data before display
- Implement "Load More" functionality for historical years

### Issue: Bulk Update Takes Too Long

**Symptoms:**
- Bulk update operation times out
- Progress dialog freezes
- Database locks occur

**Optimization Steps:**

1. **Add Progress Indicators:**
```al
// In Codeunit 50023
procedure BulkUpdateSalesTargetLines(var SalesTarget: Record "CLE Sales Target"; IncreasePercentage: Decimal)
var
    Window: Dialog;
    Counter: Integer;
    TotalRecords: Integer;
begin
    TotalRecords := SalesTarget.Count;
    Window.Open('Processing #1####### of #2#######');
    
    if SalesTarget.FindSet() then
        repeat
            Counter += 1;
            Window.Update(1, Counter);
            Window.Update(2, TotalRecords);
            
            // Update logic
            SalesTarget.Validate("Sales Target (LCY)", 
                SalesTarget."Sales Target (LCY)" * (1 + IncreasePercentage / 100));
            SalesTarget.Modify(true);
            
            // Commit every 100 records to prevent locks
            if Counter mod 100 = 0 then
                Commit();
        until SalesTarget.Next() = 0;
    
    Window.Close();
end;
```

2. **Disable Unnecessary Triggers:**
```al
// Skip unnecessary validations during bulk operations
SalesTarget.Modify(false); // Skip OnValidate triggers where appropriate
```

3. **Batch Processing:**
- Process in smaller chunks (e.g., by customer or season)
- Run during off-hours for large updates
- Use background tasks for non-urgent bulk operations

---

## Approval Workflow Issues

### Issue: Email Notifications Not Sent

**Symptoms:**
- Manager doesn't receive approval request email
- No email log entry
- Request Approval succeeds but silent failure

**Diagnostic Steps:**

1. **Check SMTP configuration:**
```al
// Verify SMTP setup
SMTPMailSetup.Get();
if SMTPMailSetup."SMTP Server" = '' then
    Error('SMTP server not configured');
```

2. **Verify manager email:**
```sql
SELECT 
    sp."Code" AS "Salesperson",
    sp."CLE Manager Code" AS "Manager Code",
    mgr."E-Mail" AS "Manager Email"
FROM "Salesperson/Purchaser" sp
LEFT JOIN "Salesperson/Purchaser" mgr ON mgr."Code" = sp."CLE Manager Code"
WHERE sp."Code" = '<SALESPERSON_CODE>';
```

3. **Check email queue:**
```sql
SELECT * FROM "Email Outbox"
WHERE "User Security ID" = '<USER_GUID>'
ORDER BY "Date Created" DESC;
```

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
   - Check email body construction in code
   - Verify all placeholders are populated
   - Test with simple message first

### Issue: Cannot Approve (Permission Denied)

**Symptoms:**
- Approve button disabled for manager
- Error: "You do not have permission to approve"
- Manager role assigned but approval fails

**Diagnostic Steps:**

1. **Verify permission set:**
```sql
SELECT 
    aps."Role ID",
    aps."App ID",
    p."Object Type",
    p."Object ID",
    p."Read Permission",
    p."Insert Permission",
    p."Modify Permission",
    p."Delete Permission"
FROM "Access Control" ac
JOIN "Aggregate Permission Set" aps ON aps."Role ID" = ac."Role ID" AND aps."Scope" = ac."Scope"
JOIN "Permission" p ON p."Role ID" = aps."Role ID"
WHERE ac."User Security ID" = '<USER_GUID>'
  AND p."Object Type" = 1 -- Table Data
  AND p."Object ID" = 50006; -- CLE Sales Target
```

2. **Check manager relationship:**
```sql
SELECT 
    st."Salesperson Code",
    st."Customer No.",
    sp."CLE Manager Code",
    usr."User Name"
FROM "CLE Sales Target" st
JOIN "Salesperson/Purchaser" sp ON sp."Code" = st."Salesperson Code"
JOIN "User" usr ON usr."User Security ID" = '<MANAGER_USER_GUID>'
WHERE st."Year" = 2026
  AND st."Approval Status" = 1; -- Approval Requested
```

**Resolution:**

1. **Grant Table Permissions:**
   - Add modify permission to "CLE Sales Target" table
   - Include in manager permission set

2. **Verify Manager Code:**
```al
// In approval procedure
Salesperson.Get(SalesTarget."Salesperson Code");
if Salesperson."CLE Manager Code" <> CurrentManagerCode then
    Error('You are not the manager for this salesperson');
```

3. **Create Manager Permission Set:**
```al
// Permission Set: SALES-MGR
TableData 50006 = RIMD; // CLE Sales Target
TableData 50022 = R;    // CLE Sales Target by Week (read-only)
```

---

## Calculation Problems

### Issue: GAP Calculation Incorrect

**Symptoms:**
- GAP shows wrong value
- GAP = 0 when it should show difference
- Negative GAP when should be positive

**Root Cause:**
- FlowField "Booked" not calculating correctly
- Sales Line History missing current year data
- Booking vs shipment date confusion

**Diagnostic Steps:**

1. **Manual GAP calculation:**
```sql
SELECT 
    st."Year",
    st."Customer No.",
    st."Financial Season",
    st."Sales Target (LCY)" AS "Target",
    COALESCE(SUM(slh."Line Amount (LCY)"), 0) AS "Actual Booked",
    st."Sales Target (LCY)" - COALESCE(SUM(slh."Line Amount (LCY)"), 0) AS "Expected GAP",
    -- Compare to displayed GAP
    st."Sales Target (LCY)" - st.Booked AS "Current GAP"
FROM "CLE Sales Target" st
LEFT JOIN "CLE Sales Line History" slh
    ON slh."Year" = st."Year"
    AND slh."Customer No." = st."Customer No."
    AND slh."Salesperson Code" = st."Salesperson Code"
    AND slh."Fin. Season" = st."Financial Season"
WHERE st."Year" = 2026
  AND st."Customer No." = '<CUSTOMER_NO>'
GROUP BY st."Year", st."Customer No.", st."Financial Season", st."Sales Target (LCY)", st.Booked;
```

2. **Verify Booked FlowField:**
```al
// Check FlowField definition
field(50012; Booked; Decimal)
{
    CalcFormula = Sum("CLE Sales Line History"."Line Amount (LCY)" 
                      WHERE("Year" = FIELD("Year"),
                            "Customer No." = FIELD("Customer No."),
                            "Salesperson Code" = FIELD("Salesperson Code"),
                            "Fin. Season" = FIELD("Financial Season")));
    FieldClass = FlowField;
}
```

**Resolution:**

1. **Recalculate FlowField:**
   - Close and reopen page
   - Press Shift+F9 to refresh
   - Run `CalcFields()` in code

2. **Fix Sales Line History:**
   - Verify current year records exist
   - Check Fin. Season assignment
   - Reprocess if necessary

3. **Clarify Booking Date:**
   - Determine if using booking date or shipment date
   - Document business rule
   - Update filter in FlowField if needed

### Issue: Increase % Calculation Wrong

**Symptoms:**
- Increase % shows incorrect percentage
- Manual calculation doesn't match displayed value
- Percentage becomes very large or very small

**Diagnostic Steps:**

```sql
SELECT 
    "Year",
    "Customer No.",
    "Financial Season",
    "Sales Target (LCY)" AS "Target",
    "Revenue prev. Year (LCY)" AS "Prior Year",
    "Increase %" AS "Displayed Increase",
    CASE 
        WHEN "Revenue prev. Year (LCY)" = 0 THEN NULL
        ELSE (("Sales Target (LCY)" - "Revenue prev. Year (LCY)") / "Revenue prev. Year (LCY)") * 100
    END AS "Calculated Increase"
FROM "CLE Sales Target"
WHERE "Year" = 2026
  AND "Customer No." = '<CUSTOMER_NO>';
```

**Resolution:**

1. **Handle Division by Zero:**
```al
if "Revenue prev. Year (LCY)" <> 0 then
    "Increase %" := (("Sales Target (LCY)" - "Revenue prev. Year (LCY)") / "Revenue prev. Year (LCY)") * 100
else
    "Increase %" := 0;
```

2. **Round to Reasonable Precision:**
```al
"Increase %" := Round("Increase %", 0.1); // Round to 1 decimal place
```

---

## Weekly Breakdown Issues

### Issue: Cannot Modify Past Weeks

**Symptoms:**
- Week Target % field is read-only
- Error: "Cannot modify past weeks"
- User needs to correct historical data

**Expected Behavior:**
- Weeks with end date in the past are locked
- Prevents retroactive target changes

**Workaround (if correction needed):**

1. **Temporary unlock (use with caution):**
```al
// In Table 50022, modify OnValidate trigger
trigger OnValidate()
begin
    // Comment out this check temporarily
    // if "Week End Date" < Today then
    //     Error('Cannot modify past weeks');
    
    // Your validation logic
end;
```

2. **Make correction:**
   - Modify the past week data
   - Document the change reason
   - Notify manager

3. **Re-enable lock:**
   - Uncomment the validation code
   - Recompile

**Better Solution:**
- Create audit log of changes
- Implement override permission for managers
- Add "Correction Reason" field

### Issue: Cumulative Percentage Validation Fails

**Symptoms:**
- Cannot save weekly breakdown
- Error: "Week Target % must be greater than or equal to previous week"
- Percentages appear correct

**Diagnostic Steps:**

```sql
SELECT 
    "Week No.",
    "Current Week Target" AS "Cumulative %",
    LAG("Current Week Target") OVER (ORDER BY "Week No.") AS "Previous Week %",
    "Current Week Target" - LAG("Current Week Target") OVER (ORDER BY "Week No.") AS "Change"
FROM "CLE Sales Target by Week"
WHERE "Year" = 2026
  AND "Salesperson Code" = '<SALESPERSON_CODE>'
  AND "Customer No." = '<CUSTOMER_NO>'
  AND "Season" = 1
ORDER BY "Week No.";
```

**Resolution:**

1. **Fix Decreasing Percentages:**
   - Adjust percentages to be non-decreasing
   - Ensure smooth progression

2. **Recalculate from Scratch:**
```al
// Reset to even distribution
WeekCount := 12; // Weeks in season
CumulativePct := 0;
WeeklyPct := 100 / WeekCount;

SalesTargetByWeek.FindSet();
repeat
    CumulativePct += WeeklyPct;
    SalesTargetByWeek."Current Week Target" := CumulativePct;
    SalesTargetByWeek.Modify();
until SalesTargetByWeek.Next() = 0;
```

---

## Integration Problems

### Issue: Blanket Order Quantities Incorrect

**Symptoms:**
- CLE Blanket Qty.Used doesn't match actual orders
- Remaining quantity negative
- Orders created but quantity not tracked

**Diagnostic Steps:**

1. **Compare blanket vs actual:**
```sql
SELECT 
    bsl."Document No." AS "Blanket No.",
    bsl."Line No.",
    bsl."No." AS "Item No.",
    bsl."Quantity" AS "Blanket Qty",
    bsl."CLE Blanket Qty.Used" AS "Qty Used",
    bsl."Quantity" - bsl."CLE Blanket Qty.Used" AS "Remaining",
    COALESCE(SUM(sl."Quantity"), 0) AS "Actual Order Qty"
FROM "Sales Line" bsl
LEFT JOIN "Sales Line" sl
    ON sl."Blanket Order Type" = bsl."Document Type"
    AND sl."Blanket Order No." = bsl."Document No."
    AND sl."Blanket Order Line No." = bsl."Line No."
    AND sl."Document Type" = 1 -- Order
WHERE bsl."Document Type" = 4 -- Blanket Order
  AND bsl."Document No." = '<BLANKET_NO>'
GROUP BY bsl."Document No.", bsl."Line No.", bsl."No.", bsl."Quantity", bsl."CLE Blanket Qty.Used";
```

**Resolution:**

1. **Run Correct Remaining Quantity Report:**
   - Open Blanket Order
   - Click Actions → Reports → Correct Remaining Quantity
   - Review discrepancies
   - Apply corrections

2. **Manual Recalculation:**
```al
// Recalculate blanket quantity used
SalesLine.SetRange("Document Type", SalesLine."Document Type"::"Blanket Order");
SalesLine.SetRange("Document No.", '<BLANKET_NO>');
if SalesLine.FindSet() then
    repeat
        // Sum orders created from this blanket line
        OrderLines.SetRange("Blanket Order Type", SalesLine."Document Type");
        OrderLines.SetRange("Blanket Order No.", SalesLine."Document No.");
        OrderLines.SetRange("Blanket Order Line No.", SalesLine."Line No.");
        OrderLines.SetRange("Document Type", OrderLines."Document Type"::Order);
        
        OrderLines.CalcSums(Quantity);
        SalesLine."CLE Blanket Qty.Used" := OrderLines.Quantity;
        SalesLine.Modify();
    until SalesLine.Next() = 0;
```

### Issue: Sales Line History Not Populating

**Symptoms:**
- New sales orders not appearing in history
- Booked amount not updating
- Performance tracking broken

**Diagnostic Steps:**

1. **Check subscriber registration:**
```al
// Verify event subscriber is registered
// In Codeunit 50009 "CLE Sales Management"
[EventSubscriber(ObjectType::Table, Database::"Sales Line", 'OnAfterModifyEvent', '', false, false)]
local procedure OnAfterSalesLineModify(var Rec: Record "Sales Line"; var xRec: Record "Sales Line")
begin
    // Insert/update Sales Line History
end;
```

2. **Verify history records:**
```sql
SELECT TOP 100 *
FROM "CLE Sales Line History"
WHERE "Date of Change" >= DATEADD(day, -7, GETDATE())
ORDER BY "Date of Change" DESC;
```

**Resolution:**

1. **Re-register Event Subscriber:**
   - Recompile Codeunit 50009
   - Verify subscriber in Event Subscriptions page
   - Test with new sales order

2. **Backfill Historical Data:**
```al
// Create history records for existing sales orders
SalesLine.SetFilter("Document Type", '%1|%2', SalesLine."Document Type"::Order, SalesLine."Document Type"::Invoice);
if SalesLine.FindSet() then
    repeat
        // Create history record if not exists
        SalesLineHistory.SetRange("Sales Line Set ID", SalesLine.SystemId);
        if not SalesLineHistory.FindFirst() then begin
            SalesLineHistory.Init();
            SalesLineHistory."Sales Line Set ID" := SalesLine.SystemId;
            SalesLineHistory."Document Type" := SalesLine."Document Type";
            SalesLineHistory."Document No." := SalesLine."Document No.";
            // ... populate other fields
            SalesLineHistory.Insert();
        end;
    until SalesLine.Next() = 0;
```

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

**Annually:**
- Year-end rollover procedure
- Historical data migration to archive
- Cleanup abandoned targets

### Archiving Old Data

**Archive Targets:**
```sql
-- Move targets older than 2 years to archive table
INSERT INTO "CLE Sales Target Archive"
SELECT * FROM "CLE Sales Target"
WHERE "Year" < YEAR(GETDATE()) - 2;

DELETE FROM "CLE Sales Target"
WHERE "Year" < YEAR(GETDATE()) - 2;
```

**Archive Weekly Breakdown:**
```sql
INSERT INTO "CLE Sales Target by Week Archive"
SELECT * FROM "CLE Sales Target by Week"
WHERE "Year" < YEAR(GETDATE()) - 2;

DELETE FROM "CLE Sales Target by Week"
WHERE "Year" < YEAR(GETDATE()) - 2;
```

### Backup Recommendations

- **Frequency**: Daily incremental, weekly full
- **Retention**: 30 days online, 7 years tape
- **Test Restore**: Monthly validation
- **Critical Tables**:
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
- Cannot approve

**SALES-MANAGER:**
- Read/Insert/Modify all "CLE Sales Target"
- Approve/decline requests
- Reopen approved targets
- Bulk operations
- Access all salespeople

**SALES-ADMIN:**
- Full access to all tables
- Database maintenance functions
- Historical data correction
- System configuration

### Granting Permissions

```al
// Assign permission set to user
UserPermission.Init();
UserPermission."User Security ID" := UserSecurityId();
UserPermission."Role ID" := 'SALES-USER';
UserPermission.Scope := UserPermission.Scope::System;
UserPermission."App ID" := AppId;
UserPermission.Insert();
```

---

## Summary

This guide provides comprehensive troubleshooting procedures for the Sales Planning module. Key areas covered:

- Hierarchical target structure and tree view issues
- Approval workflow and email notifications
- Weekly breakdown calculations and validations
- Performance optimization techniques
- Data integrity checks and maintenance procedures
- Integration with Sales Line History and Blanket Orders

For issues not covered in this guide, contact the development team or open a support ticket with detailed diagnostic information.

---

## Related documents

- [[sales-planning-user-guide]]
