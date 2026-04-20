# Broker Workspace Documentation

**System:** Clesen Horticulture Purchasing  
**Module:** Broker Workspace (Purchase Worksheet)  
**Page ID:** 50086  
**Version:** 1.0

---

## Overview

The **Broker Workspace** (technically "CLE Purchase Worksheet") is a demand-driven Material Requirements Planning (MRP) tool that allows buyers to plan and manage purchase orders before committing changes to actual documents.

### Key Features

- **Demand-Driven Planning**: Automatically calculates requirements from sales orders
- **Availability Forecasting**: Shows projected inventory with cumulative calculations
- **Temporary Workspace**: User-specific planning environment with session persistence
- **Change Preview**: Model quantity, date, and vendor changes before applying
- **Audit Trail**: Complete change log for all modifications
- **Cart Calculations**: Transportation planning with cart quantity projections
- **Forecast Comparison**: Compare production forecasts vs. actual orders

---

## Quick Start

### For Buyers (Daily Users)

**5-Minute Quick Start:**

1. **Open Broker Workspace**: Search "Broker Workspace" → Page 50086
2. **Clear Old Data**: Click "Clear Page" button
3. **Set Filters**:
   - Start Date: Tomorrow
   - End Date: 30 days out
   - Item Filter: %my (your assigned items)
4. **Get Data**: Click "Get Data" → Wait 30-60 seconds
5. **Review Supply vs. Demand**: Red = shortage, Yellow = partial coverage, Green = fully supplied
6. **Make Changes**: Edit "Purch. Line Quantity New" or "Requested Receipt Date"
7. **Apply**: Click "Apply Selected" or "Apply All"

**Full Guide:** [Broker Workspace Staff Guide](broker-workspace-staff-guide.md)

---

### For Managers (Oversight)

**Daily Checklist:**

1. **Monitor Pending Changes**:
   ```sql
   SELECT COUNT(*) FROM [CLE Purch_ Worksheet Line] WHERE [Line Modified] = 1
   ```

2. **Check for Stale Worksheets** (>24 hours old):
   ```sql
   SELECT [User ID], COUNT(*) 
   FROM [CLE Purch_ Worksheet Line]
   WHERE [timestamp] < DATEADD(hour, -24, GETDATE())
   GROUP BY [User ID]
   ```

3. **Review High-Value Changes**:
   ```sql
   SELECT * FROM [CLE Purch_ Wrksht Log Entry]
   WHERE [Change] IN (0, 1) -- New Order or Qty Change
       AND [New Value] > 50000
       AND [Change Applied] = 0
   ```

**Full Guide:** [Broker Workspace Manager Guide](broker-workspace-manager-guide.md)

---

### For IT Support

**Common Support Issues:**

| Issue | Quick Solution | Guide Link |
|-------|---------------|-----------|
| Slow performance | Narrow filters, reduce date range | [IT Guide - Performance](broker-workspace-it-troubleshooting-guide.md#performance-optimization) |
| Changes not applying | Run "Update Supply" to refresh | [IT Guide - Issue 3](broker-workspace-it-troubleshooting-guide.md#issue-3-changes-not-applying) |
| Availability shows zero | Check location filters | [IT Guide - Issue 2](broker-workspace-it-troubleshooting-guide.md#issue-2-availability-always-shows-zero) |
| Duplicate lines | Run cleanup script | [IT Guide - Issue 4](broker-workspace-it-troubleshooting-guide.md#issue-4-duplicate-demand-lines) |

**Full Guide:** [Broker Workspace IT Troubleshooting Guide](broker-workspace-it-troubleshooting-guide.md)

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  BROKER WORKSPACE                        │
│              (Page 50086 - Main Interface)               │
└────────────────────┬────────────────────────────────────┘
                     │
     ┌───────────────┴─────────────┐
     │                             │
┌────▼────────┐            ┌──────▼──────────┐
│ Data Sources│            │ Business Logic  │
│             │            │                 │
│ • Sales     │            │ CLE Purchase    │
│ • Purchase  │            │ Management      │
│ • Inventory │            │ (CU 50017)      │
│ • Forecast  │            │                 │
└────┬────────┘            └──────┬──────────┘
     │                            │
     └──────────┬─────────────────┘
                │
     ┌──────────▼────────────┐
     │  Worksheet Lines      │
     │  (Table 50020)        │
     │  Temp planning data   │
     └──────────┬────────────┘
                │
     ┌──────────▼────────────┐
     │  Change Log           │
     │  (Table 50021)        │
     │  Audit trail          │
     └──────────┬────────────┘
                │
     ┌──────────▼─────────────┐
     │  Apply to POs          │
     │  (Purchase Orders)     │
     └────────────────────────┘
```

---

## Process Flow

### Standard Planning Workflow

```
1. CLEAR PAGE
   ↓
2. SET FILTERS
   • Date range (Start/End)
   • Item filter (%my, %Spring, etc.)
   • Vendor filter (optional)
   ↓
3. GET DATA
   • Scans purchase orders (supply)
   • Scans sales orders (demand)
   • Calculates availability
   • Loads worksheet
   ↓
4. REVIEW DATA
   • Red lines = shortages
   • Yellow = partial supply
   • Green = fully covered
   ↓
5. PLAN CHANGES
   • Edit quantities
   • Change dates
   • Add new lines
   • Switch vendors
   ↓
6. APPLY CHANGES
   • System determines change type
   • Creates/modifies POs
   • Logs all changes
   • Updates availability
```

---

## Component Reference

### Pages

| Page ID | Name | Purpose |
|---------|------|---------|
| 50086 | CLE Purchase Worksheet | Main workspace interface |
| 50087 | CLE Purch. Worksheet New PO Line | Dialog for creating new purchase line |
| 50088 | CLE Purch. Worksheet Vendor Change | Dialog for changing vendor/PO |
| 50089 | CLE Purch. Worksheet Vendor Change Subpage | Shows existing POs for vendor |
| 50094 | CLE Copy Purch. Worksheet Line | Dialog for copying PO lines to new date |

### Tables

| Table ID | Name | Purpose |
|----------|------|---------|
| 50020 | CLE Purch. Worksheet Line | Temporary planning data (user-specific) |
| 50021 | CLE Purch. Wrksht Log Entry | Change audit trail |

### Codeunits

| Codeunit ID | Name | Key Procedures |
|-------------|------|---------------|
| 50017 | CLE Purchase Management | CreateWorksheet, ApplyWorksheetLineChange, UpdateDemand/Supply |

### Supporting Systems

- **CLE Availability Calculation**: Inventory forecasting engine
- **CLE Availability Management**: Location filtering logic
- **Standard BC Purchase**: PO creation/modification

---

## Common Scenarios

### Scenario 1: Address Shortage

**Situation:** Item shows negative availability (red)

**Steps:**
1. Locate red line in worksheet
2. Check "Demand Qty." column → See sales order requirement
3. Check "Purch. Line Quantity" → See current supply (may be 0)
4. Edit "Purch. Line Quantity New" → Enter required quantity
5. Verify "Cum. Avail. (simulated)" turns positive
6. Click "Apply Selected"
7. Result: New PO line created or existing line increased

**Guide:** [Staff Guide - Scenario 1](broker-workspace-staff-guide.md#scenario-1-reviewing-and-addressing-shortages)

---

### Scenario 2: Rush Order (Expedite Date)

**Situation:** Customer calls requesting earlier delivery

**Steps:**
1. Filter to item: Set "Item Filter" to item number
2. Find relevant PO line
3. Change "Requested Receipt Date" to earlier date
4. Check if vendor can deliver (external verification)
5. Click "Apply Selected"
6. Result: PO header date updated

**Guide:** [Staff Guide - Scenario 2](broker-workspace-staff-guide.md#scenario-2-rush-order---expediting-a-purchase)

---

### Scenario 3: Vendor Switch

**Situation:** Primary vendor out of stock, switch to alternate

**Steps:**
1. Select line to move
2. Click "Change Vendor on Selected Line"
3. Choose alternate vendor
4. Select existing PO or create new
5. Click OK
6. Result: New line created on alternate vendor PO, old line deleted

**Guide:** [Staff Guide - Scenario 3](broker-workspace-staff-guide.md#scenario-3-vendor-switch-due-to-availability-issue)

---

## Best Practices

### Do's ✅

- **Clear page before each session** - Ensures fresh data
- **Use narrow filters** - Improves performance (items, dates, vendors)
- **Check availability before applying** - Review "Cum. Avail. (simulated)"
- **Apply changes promptly** - Don't leave modified lines overnight
- **Use "Check Changes" periodically** - Validates PO lines unchanged
- **Review change log** - Audit your modifications

### Don'ts ❌

- **Don't keep worksheets >24 hours** - Data becomes stale
- **Don't apply without reviewing** - Changes are immediate
- **Don't modify POs outside workspace** - Causes hash mismatch errors
- **Don't use excessively wide date ranges** - Slows performance (>90 days)
- **Don't skip vendor assignment** - Can't apply without vendor
- **Don't ignore red warnings** - Address shortages proactively

---

## Filter Syntax

### Special Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `%my` | Your assigned items | Item Filter: %my |
| `%Spring` | Spring season items | Item Filter: %Spring |
| `%Summer` | Summer season items | Item Filter: %Summer |
| `%Fall` | Fall season items | Item Filter: %Fall |
| `%Winter` | Winter season items | Item Filter: %Winter |
| `VENDOR01` | Specific vendor | Vendor Filter: VENDOR01 |
| `ITEM001..ITEM100` | Range | Item Filter: ITEM001..ITEM100 |
| `*Rose*` | Contains text | Item Filter: *Rose* |

---

## Change Types

| Change Type | When | Action | Example |
|-------------|------|--------|---------|
| **New Order** | No vendor/PO assigned | Creates new PO line | Add line for new item |
| **Change Quantity** | Only quantity differs | Updates existing PO line qty | Increase from 100 to 150 |
| **Change Date** | Only date differs | Updates PO header date | Move from 3/1 to 3/8 |
| **Move Line** | Vendor or PO changed | Deletes old, creates new | Switch to alternate vendor |
| **Change Date and Qty** | Both differ | Updates both | Increase qty + expedite |

---

## Field Reference

### Key Worksheet Columns

| Field Name | Editable | Purpose |
|------------|----------|---------|
| Item No. | No | Item identifier |
| Description | No | Item description |
| Vendor No. | Yes* | Current vendor (*via Change Vendor action) |
| Purchase Order No. | No | Linked PO number |
| Purch. Line Quantity | No | Current PO quantity |
| **Purch. Line Quantity New** | **Yes** | **Planned quantity (edit this)** |
| Purch. Line Quantity Adj. | No | Difference (New - Current) |
| **Requested Receipt Date** | **Yes** | **Planned delivery date (edit this)** |
| Demand Qty. | No | Sales order requirement |
| Qty. Available | No | Projected inventory |
| Cum. Availability | No | Running total |
| Cum. Avail. (simulated) | No | With pending changes |
| Cart Quantity Line | No | Carts for this line |
| Cart Total Purch. Order | No | Total carts for PO |

---

## Color Coding

| Color | Meaning | Action Required |
|-------|---------|-----------------|
| 🔴 Red | Negative availability (shortage) | Create or increase PO |
| 🟡 Yellow | Partial supply (demand > supply) | Review and adjust |
| 🟢 Green | Fully supplied (supply >= demand) | No action needed |
| ⚪ White | No demand (supply only) | Review if overstock |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` | New Purchase Line dialog |
| `Ctrl+Alt+F7` | Filter pane |
| `F5` | Refresh page |
| `Ctrl+A` | Select all lines |
| `Space` | Toggle line selection |
| `Enter` | Edit cell / Confirm |
| `Esc` | Cancel edit |
| `Ctrl+F` | Find in page |

---

## Button Reference

### Main Actions

| Button | Purpose | Shortcut |
|--------|---------|----------|
| **Get Data** | Load worksheet from sales/purchase orders | - |
| **Clear Page** | Delete all worksheet lines | - |
| **Apply Selected** | Apply changes to selected lines | - |
| **Apply All** | Apply all modified lines | - |
| **New Purchase Line** | Create new PO line dialog | Ctrl+N |
| **Change Vendor on Selected Line** | Move line to different vendor/PO | - |
| **Copy Purch. Order to New Date** | Duplicate PO lines | - |
| **Update Demand** | Refresh sales order requirements | - |
| **Update Supply** | Refresh purchase order data | - |
| **Check Changes** | Validate PO lines unchanged | - |

### Filter Actions

| Button | Purpose |
|--------|---------|
| **Filter on Supply Lines** | Show only lines with POs |
| **Filter on Unavailable Items** | Show only shortages |
| **Reset Filter and Sorting** | Clear all filters |

---

## Training Resources

### New User Onboarding

**Week 1-2: Basic Operations**
- Read Staff Guide sections 1-4 (Overview through Daily Workflow)
- Practice: Load worksheet, review data, understand columns
- Shadow experienced buyer for 1 day

**Week 3-4: Making Changes**
- Read Staff Guide sections 5-7 (Planning through Applying)
- Practice: Modify quantities, change dates, apply changes
- Complete 5 practice scenarios

**Week 5: Advanced Features**
- Read Staff Guide section 8 (Advanced Features)
- Practice: Change vendor, copy PO, update demand/supply
- Review change log analysis

**Week 6: Troubleshooting**
- Read Staff Guide sections 9-10 (Troubleshooting and Quick Reference)
- Learn error resolution
- Independent operation with manager oversight

### Ongoing Training

- **Monthly:** Review new features, best practices
- **Quarterly:** Vendor performance analysis, forecast accuracy
- **Annual:** Refresher on advanced features, system updates

---

## Reporting

### Standard Reports

**Pending Changes Report:**
```sql
SELECT 
    ws.[User ID],
    COUNT(*) AS [Modified Lines],
    SUM(ws.[Purch_ Line Quantity Adj_] * i.[Unit Cost]) AS [Total Value]
FROM [CLE Purch_ Worksheet Line] ws
INNER JOIN [Item] i ON ws.[Item No_] = i.[No_]
WHERE ws.[Line Modified] = 1
GROUP BY ws.[User ID]
ORDER BY [Total Value] DESC
```

**Shortage Summary:**
```sql
SELECT 
    ws.[Item No_],
    ws.Description,
    SUM(ws.[Demand Qty_]) AS [Total Demand],
    SUM(ws.[Purch_ Line Quantity]) AS [Current Supply],
    SUM(ws.[Demand Qty_] - ws.[Purch_ Line Quantity]) AS [Shortage]
FROM [CLE Purch_ Worksheet Line] ws
WHERE ws.[Demand Qty_] > ws.[Purch_ Line Quantity]
GROUP BY ws.[Item No_], ws.Description
ORDER BY [Shortage] DESC
```

**Change Log Summary:**
```sql
SELECT 
    log.[Change],
    COUNT(*) AS [Count],
    COUNT(CASE WHEN [Change Applied] = 1 THEN 1 END) AS [Applied],
    COUNT(CASE WHEN [Change Applied] = 0 THEN 1 END) AS [Pending]
FROM [CLE Purch_ Wrksht Log Entry] log
WHERE log.[timestamp] >= DATEADD(day, -7, GETDATE())
GROUP BY log.[Change]
```

More reports: [Manager Guide - Reporting](broker-workspace-manager-guide.md#reporting-and-analytics)

---

## System Requirements

**Permissions Required:**
- Read access: Sales Line, Purchase Line, Item, Vendor
- Write access: CLE Purch. Worksheet Line, CLE Purch. Wrksht Log Entry
- Execute access: Codeunit 50017 (CLE Purchase Management)
- Modify access: Purchase Header, Purchase Line (for Apply function)

**Browser Compatibility:**
- Microsoft Edge (recommended)
- Google Chrome
- Not tested: Firefox, Safari

**Performance Recommendations:**
- Date range: ≤60 days for daily use
- Item filter: ≤100 items per session
- Clear worksheet daily
- Close other browser tabs during Get Data

---

## Support

### Escalation Path

| Level | Contact | Response Time |
|-------|---------|---------------|
| **L1: Self-Service** | Staff Guide Troubleshooting | Immediate |
| **L2: Manager** | Your manager | 1 hour |
| **L3: IT Support** | it.support@clesenhoriculture.com | 4 hours |
| **L4: Developer** | development.team@clesenhoriculture.com | 1 business day |

### When to Escalate

**To Manager:**
- Over-budget purchase decisions
- Vendor performance issues
- Training questions
- Policy clarifications

**To IT:**
- System errors
- Performance issues
- Data integrity problems
- Permission issues

**To Developer:**
- Feature requests
- Bug reports
- Integration issues

---

## Document Index

### Complete Documentation Set

1. **[README.md](README.md)** (This document)  
   Overview, quick starts, navigation

2. **[Broker Workspace Staff Guide](broker-workspace-staff-guide.md)**  
   Audience: Buyers, Daily Users  
   Content: Daily workflows, planning procedures, common scenarios, troubleshooting

3. **[Broker Workspace Manager Guide](broker-workspace-manager-guide.md)**  
   Audience: Purchasing Managers, Team Leads  
   Content: Monitoring SQL queries, vendor performance tracking, KPIs, training, exception handling

4. **[Broker Workspace IT Troubleshooting Guide](broker-workspace-it-troubleshooting-guide.md)**  
   Audience: IT Support, System Administrators, Developers  
   Content: Architecture, debugging procedures, data integrity checks, performance optimization

5. **[Test Procedures](../../test/5%20Codeunits/50206.Codeunit.CLE.BrokerWorkspaceTests.al)**  
   Audience: QA, Developers  
   Content: Automated tests for GitHub pipeline

---

## Version Information

**Current Version:** 1.0  
**Release Date:** February 13, 2026  
**Compatible BC Version:** 26.4+  
**Module Version:** Clesen Horticulture 26.4.1.4+

**Changelog:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 02/13/2026 | Initial documentation release |

---

## Feedback

We welcome feedback on this documentation and the Broker Workspace system.

**Documentation Feedback:**  
documentation@clesenhoriculture.com

**Feature Requests:**  
Submit via IT Service Desk or email development.team@clesenhoriculture.com

**Bug Reports:**  
Submit via IT Service Desk with:
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots
- Error messages

---

*Last Updated: February 13, 2026*
*Documentation maintained by Clesen Horticulture IT Department*

---

## Related documents

- [[broker-workspace-staff-guide]]
- [[broker-workspace-manager-guide]]
- [[broker-workspace-it-troubleshooting-guide]]
