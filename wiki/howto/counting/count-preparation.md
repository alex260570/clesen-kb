---
title: Count Preparation — Manager Guide
type: howto
tags: [counting, manager, warehouse]
created: 2026-04-21
updated: 2026-04-21
sources: [count-preparation.md]
---

# Count Preparation — Manager's Guide

## Overview

Count Preparation is **Phase 1** of the counting system - where the system (or you manually) creates count lines that will later be released to warehouse staff for counting.

## Automated Preparation

### How It Works

**Codeunit:** 50108 CLE Prepare Auto Item Count  
**Job Queue:** Every 2 hours  
**Configuration:** Counting Setup (Page 50202)

The system automatically runs every 2 hours and evaluates all enabled count types, creating count lines as needed.

### What Gets Prepared

Each enabled count type has its own business logic:

**2 Weeks Ship Count:**
- Queries sales orders with shipment date in next 14 days
- For each item, checks if already counted recently
- Creates count line for warehouse bin containing item
- Links to sales order line for reference

**Ready Count:**
- Queries production orders 50%+ complete
- Due date within 14 days
- Creates count line for remaining quantity to produce
- Links to production order for reference
- Source: Production Order (not warehouse bin)

**Sowing Check:**
- Queries production orders with sowing date
- 3 days after sowing date
- Creates count line if not already counted
- Checks germination rate

**Transplant Check:**
- Queries production orders with transplant operation
- 7 days after transplant date
- Creates count line if not already counted
- Checks survival rate

**Negative Availability:**
- Queries items with negative inventory or available quantity
- Creates count lines for all affected bins
- High priority - data integrity issue

**High Demand:** *(Optional - configurable)*
- Queries items with high recent sales volume
- Configurable sales threshold
- Creates count lines for main warehouse bins

### Preparation Schedule

**Normal Operation:**
- Job runs at: 00:00, 02:00, 04:00, 06:00, 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00, 22:00
- Each run evaluates all enabled count types
- Creates lines with status "Prepared"
- Lines wait for release validation

**What You'll See:**
- Morning: Overnight counts prepared (2 Weeks Ship, Ready Counts)
- Throughout day: New counts as production progresses
- Lines appear on Inventory Count Preparation page

## Manual Preparation

### When to Use Manual Preparation

Use manual preparation for:
- **Physical Inventory:** Full count of all inventory
- **Location Count:** Complete count of specific zone
- **Single Item Count:** Investigate specific item discrepancy
- **Ad-hoc investigations:** Problem-solving, audits
- **Override automation:** Force count outside normal schedule

### Manual Count Types

#### Physical Inventory Count

**Purpose:** Complete count of ALL inventory across all locations

**How to trigger:**
1. Open Inventory Count Preparation page
2. Click **"Prepare Physical Inventory"** action
3. Set filters (optional): Location codes, Item category, Date filter
4. Click OK
5. System creates count lines for every item in inventory

**Best practices:**
- Schedule during slow periods (evening, weekend)
- May require warehouse freeze (no movement)
- Inform picking/receiving staff in advance
- Plan for multiple days if large inventory

#### Location Count

**Purpose:** Count all items in specific warehouse location/zone

**How to trigger:**
1. Open Inventory Count Preparation page
2. Click **"Prepare Location Count"** action
3. **Select location code** (required)
4. Set filters (optional): Bin code range, Item category, Zone code
5. System creates count lines for specified location

**Use cases:**
- Zone reorganization verification
- Problem area investigation
- Periodic zone audits
- After major inventory movement

#### Single Item Count

**Purpose:** Count specific item across locations or in specific bin

**How to trigger:**
1. Open Inventory Count Preparation page
2. Click **"Prepare Single Item Count"** action
3. **Enter item number** (required)
4. Set filters (optional): Location code, Bin code, Variant code
5. System creates count lines for item

**Use cases:**
- Customer complaint about availability
- Before large order shipment
- Investigate specific discrepancy
- Spot check for accuracy
- After found/lost inventory report

### Reviewing Prepared Lines

**Before Release:**
1. Open Inventory Count Preparation page
2. Filter to Status = Prepared
3. Review count lines: Item number, Location, Bin, Expected quantity, Count type, Priority

**You can:**
- Edit expected quantity if needed
- Change priority
- Delete lines (if preparation error)
- Add notes/comments
- Set specific counter assignment

## Count Priority System

### How Priority Works

**Priority values (1-5):**
- 1 = Highest priority (count first)
- 5 = Lowest priority (count last)

**Default priorities by count type:**
- Negative Availability: 1 (critical)
- Physical Inventory: 1 (critical)
- 2 Weeks Ship: 2 (high)
- Ready Count: 2 (high)
- High Demand: 2 (high)
- Sowing Check: 3 (medium)
- Transplant Check: 3 (medium)
- Location Count: 3 (medium)
- Single Item: 4 (varies based on need)

### Adjusting Priority

**When to change:**
- Urgent customer need (increase priority)
- Item not urgent (decrease priority)
- Balance workload across staff
- Coordinate with picking schedule

**How to change:**
1. Open Inventory Count Preparation
2. Find the count line
3. Edit Priority field (1-5)
4. Save

## Monitoring Preparation

### Key Questions to Monitor

**Daily:**
- How many lines prepared overnight?
- Any negative availability counts (urgent)?
- Lines stuck in Prepared status?
- Job queue ran successfully?

**Weekly:**
- Count type distribution
- Preparation vs release rate (bottleneck)?

### Checking Job Queue

**Job Queue Entry:** CLE Prepare Auto Item Count

**How to check:**
1. Open Job Queue Entries
2. Find "CLE Prepare Auto Item Count"
3. Check: Status = Ready, Last run date/time, Error message, Next run date/time

**If job not running:**
1. Check status - must be "Ready"
2. Restart job if needed
3. Review error log if failures

## Best Practices

### Configuration

✓ **Enable only needed count types** - Don't create unnecessary work  
✓ **Set realistic minimum days between counts** - Prevent over-counting  
✓ **Configure priorities appropriately** - Match business needs  
✓ **Review thresholds seasonally** - Adjust for busy/slow periods  

### Operations

✓ **Review prepared lines daily** - Catch issues before release  
✓ **Coordinate with other departments** - Picking, production, receiving  
✓ **Schedule physical inventory carefully** - Requires planning  
✓ **Use manual counts strategically** - Investigation and audits  
✓ **Monitor job queue health** - Automation dependency  

### Timing

✓ **Physical inventory:** Evening/weekend when warehouse quiet  
✓ **Location counts:** Between picking runs  
✓ **Single item counts:** As needed, coordinate with staff  
✓ **Production counts:** During production hours  

## Related Pages

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-release]]
- [[count-processing]]
- [[counting-exceptions]]
- [[understanding-count-types]]
