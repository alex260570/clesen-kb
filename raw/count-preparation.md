# Count Preparation - Manager Guide

## Overview

Count Preparation is **Phase 1** of the counting system - where the system (or you manually) creates count lines that will later be released to warehouse staff for counting.

**Last Updated:** February 10, 2026

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

### Page 50126: Inventory Count Preparation

**Access:** Inventory → Inventory Count Preparation

### Manual Count Types

#### Physical Inventory Count

**Purpose:** Complete count of ALL inventory across all locations

**How to trigger:**

1. Open Inventory Count Preparation page
2. Click **"Prepare Physical Inventory"** action
3. Set filters (optional):
   - Location codes (leave blank for all)
   - Item category (leave blank for all)
   - Date filter
4. Click OK
5. System creates count lines for every item in inventory

**What happens:**

- Queries all bin content records
- Creates one line per item per bin
- Source: Inventory (bin content)
- Expected quantity from bin content
- Status: Prepared
- Very large number of lines (hundreds to thousands)

**Best practices:**

- Schedule during slow periods (evening, weekend)
- May require warehouse freeze (no movement)
- Inform picking/receiving staff in advance
- Plan for multiple days if large inventory

---

#### Location Count

**Purpose:** Count all items in specific warehouse location/zone

**How to trigger:**

1. Open Inventory Count Preparation page
2. Click **"Prepare Location Count"** action
3. **Select location code** (required)
4. Set filters (optional):
   - Bin code range
   - Item category
   - Zone code
5. Click OK
6. System creates count lines for specified location

**What happens:**

- Queries bin content for selected location
- One line per item per bin
- Source: Inventory
- Expected quantity from bin content
- Status: Prepared

**Use cases:**

- Zone reorganization verification
- Problem area investigation
- Periodic zone audits
- After major inventory movement

---

#### Single Item Count

**Purpose:** Count specific item across locations or in specific bin

**How to trigger:**

1. Open Inventory Count Preparation page
2. Click **"Prepare Single Item Count"** action
3. **Enter item number** (required)
4. Set filters (optional):
   - Location code (blank = all locations)
   - Bin code (blank = all bins)
   - Variant code
5. Click OK
6. System creates count lines for item

**What happens:**
- Queries bin content for specified item
- One line per bin containing item
- If location/bin specified: One line only
- Source: Inventory
- Expected quantity from bin content
- Status: Prepared

**Use cases:**
- Customer complaint about availability
- Before large order shipment
- Investigate specific discrepancy
- Spot check for accuracy
- After found/lost inventory report

---

### Reviewing Prepared Lines

**Before Release:**

1. Open Inventory Count Preparation page
2. Filter to Status = Prepared
3. Review count lines:
   - Item number and description
   - Location and bin code
   - Expected quantity
   - Count type
   - Priority

**You can:**
- Edit expected quantity if needed
- Change priority
- Delete lines (if preparation error)
- Add notes/comments
- Set specific counter assignment

**Common edits:**
- Adjust priority for urgent counts
- Delete duplicate lines
- Correct bin codes if moved
- Add notes for special handling

## Count Line Details

### Key Fields on Prepared Lines

**Item Information:**
- Item No
- Description
- Variant Code
- Item Category

**Location:**
- Location Code
- Bin Code
- Zone Code

**Count Details:**
- Count Type (2 Weeks Ship, Ready Count, etc.)
- Line Source (Inventory, Production Order, Physical Inventory)
- Expected Quantity
- Unit of Measure
- Priority

**References:**
- Sales Order No (for 2 Weeks Ship)
- Production Order No (for Ready Count, Checks)
- Last Count Date (when last counted)
- Days Since Last Count

**Status:**
- Current Status (should be "Prepared")
- Next Action (will be Released)

### Understanding Expected Quantity

**Source: Inventory**
- Expected = Current bin content quantity
- From warehouse management records
- What system thinks is physically in bin

**Source: Production Order**
- Expected = Remaining Qty to Produce
- Not yet finished production quantity
- Accounts for output already posted

**Source: Physical Inventory Journal**
- Expected = Calculated inventory
- From physical inventory calculation
- Includes all transactions

## Duplicate Prevention

System prevents duplicate counts automatically:

### Duplicate Rules

**Won't create line if:**
1. Same item + location + bin already has active count (status: Prepared, Released, or Counted)
2. Item counted within minimum days threshold (configured in setup)
3. Same source (e.g., two production orders for same item) - consolidates into one line

**Will create line even if similar exists:**
- Different source (Inventory count AND Production Order count for same item)
- Manual count overrides automatic count
- Different bin (same item in multiple bins = multiple lines)

### Checking for Duplicates

**Before manual preparation:**
1. Open Inventory Count Preparation
2. Filter by Item No
3. Check for existing Prepared/Released lines
4. If exists, don't create duplicate

**If duplicate created accidentally:**
1. Delete one of the lines
2. Or combine into single line
3. Release only one

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

**Configuration:** Table 50074 CLE Counting Priority

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

**Effect:**
- Changes sort order on count sheets
- Higher priority counts appear first
- Staff count in priority order

## Integration with Other Systems

### Picking Integration

**Coordination needed:**
- Don't release counts if zone is being picked
- System checks last pick date/time
- Delays release if picked within 4 hours
- See count-release.md for details

**What to do:**
- Review picking schedule before manual counts
- Coordinate location counts with picking manager
- Physical inventory requires picking freeze

### Production Integration

**Automatic coordination:**
- Ready Count triggered by production progress
- Sowing/Transplant checks triggered by dates
- Production order completion removes count lines

**Manual coordination:**
- Check production schedule before location counts
- Inform production manager of counts
- Count production areas during slow times

### Purchasing Integration

**Automatic coordination:**
- System checks for expected receipts
- Delays release if receipts due soon
- Prevents counting items in-transit

**Manual coordination:**
- Check receiving schedule before counts
- Inform receiving staff of counts
- Delay counts if major receipts expected

## Monitoring Preparation

### Key Questions to Monitor

**Daily:**
- How many lines prepared overnight?
- Any negative availability counts (urgent)?
- Lines stuck in Prepared status?
- Job queue ran successfully?

**Weekly:**
- Count type distribution (which types most common)?
- Any count types creating too many lines?
- Preparation vs release rate (bottleneck)?

**Monthly:**
- Count volume trends
- Seasonal patterns
- Automation effectiveness

### Checking Job Queue

**Job Queue Entry:** CLE Prepare Auto Item Count

**How to check:**
1. Open Job Queue Entries
2. Find "CLE Prepare Auto Item Count"
3. Check:
   - Status = Ready (or In Process)
   - Last run date/time (should be within 2 hours)
   - Error message (should be blank)
   - Next run date/time (should be ~2 hours away)

**If job not running:**
1. Check status - must be "Ready"
2. Check "Inactivity Timeout Period" - should have value
3. Restart job if needed
4. Review error log if failures

### Dashboard View

**Page 50199:** CLE Counting Dashboard

**Shows:**
- Count of lines by status
- Prepared lines waiting for release
- Released lines waiting for counting
- Counted lines waiting for processing
- Job queue status

**Use for:**
- Quick system health check
- Identify bottlenecks
- Monitor workload
- Trigger manual runs if needed

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

## Common Issues and Solutions

### Too Many Lines Prepared

**Problem:** Automation creating excessive count lines

**Causes:**
- All count types enabled
- Days between counts too short
- High inventory turnover

**Solutions:**
- Disable unneeded count types (e.g., High Demand if not useful)
- Increase days between counts
- Tighten filters on count types
- Review count type logic with administrator

---

### Lines Not Preparing

**Problem:** Expected count lines not appearing

**Causes:**
- Job queue not running
- Count type disabled in setup
- Item already counted recently
- No items meet criteria

**Solutions:**
- Check job queue status (must be Ready and running)
- Verify count type enabled in Counting Setup
- Check last count date on items
- Review count type logic criteria
- Use manual preparation as workaround

---

### Wrong Expected Quantities

**Problem:** Expected quantities don't match reality

**Causes:**
- Bin content not updated
- Recent movements not posted
- Production output not posted
- Receiving not posted

**Solutions:**
- Post pending transactions first
- Update bin content if needed
- Manually adjust expected quantity before release
- Investigate root cause of discrepancy

---

### Duplicate Lines Created

**Problem:** Same item has multiple prepared lines

**Causes:**
- Different sources (Inventory + Production Order)
- Manual count added to automated count
- Duplicate prevention not working

**Solutions:**
- If different sources: Both needed (Inventory and Production are separate)
- If same source: Delete duplicate, keep one
- Check duplicate prevention logic

## Security and Permissions

**Permissions needed for preparation:**

- **View Prepared Lines:** Read permission on Count Lines
- **Edit Prepared Lines:** Write permission on Count Lines
- **Manual Preparation:** Execute permission on preparation functions
- **Job Queue Management:** Job Queue administration rights

**Typical roles:**
- Warehouse Manager: Full preparation access
- Supervisor: View and manual single item counts
- Administrator: Job queue configuration

---

## Related documents

- [[counting-system-overview]]
- [[counting-process]]
- [[counting-dashboard]]
- [[count-release]]
- [[understanding-count-types]]
- [[count-processing]]
- [[counting-exception-handling]]

---

*For next phase (releasing counts), see count-release.md. For system overview, see counting-system-overview.md.*
