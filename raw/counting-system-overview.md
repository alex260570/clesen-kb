# Inventory Counting System - Manager Overview

## System Architecture

The Clesen Horticulture counting system is a fully automated, five-phase process that maintains inventory accuracy through intelligent, business-driven cycle counting.

**Last Updated:** February 10, 2026

## Five-Phase Process

### Phase 1: Preparation (Automated)
**Codeunit:** 50108 CLE Prepare Auto Item Count  
**Job Queue:** Every 2 hours  
**What happens:**
- Evaluates 9 count type rules
- Creates count lines based on business logic
- Sets status to "Prepared"
- Assigns to appropriate locations/users
- Calculates priority scores

### Phase 2: Release (Automated)
**Codeunit:** 50115 CLE Release Count  
**Job Queue:** Every 1 minute  
**What happens:**
- Validates count lines can be released
- Checks bin existence
- Prevents duplicate counts
- Delays release if zone is being picked
- Delays release if purchase receipts expected
- Changes status from "Prepared" to "Released"
- Makes visible to warehouse staff

### Phase 3: Counting (Manual)
**Page:** 50125 Inventory Count Lines  
**Performed by:** Warehouse Staff  
**What happens:**
- Staff see released lines on count sheet
- Physical counting performed
- Quantity entered in system
- "Finish & Submit" changes status to "Counted"
- Deviation warnings trigger if count far from expected

### Phase 4: Processing (Automated)
**Codeunit:** 50111 CLE Process Incoming Counts  
**Job Queue:** Every 1 minute  
**What happens:**
- Calculates quantity adjustment needed
- Evaluates deviation thresholds
- **Small deviation:** Posts adjustment automatically, archives line
- **Medium deviation:** Requests recount (status back to "Prepared")
- **Large deviation:** Requests supervisor assistance

### Phase 5: Exception Handling (Manual)
**Page:** 50127 Inventory Count Posting  
**Performed by:** Supervisors/Managers  
**What happens:**
- Review high-deviation counts
- Approve adjustment posting
- Request additional recount
- Adjust acceptable limits
- Resolve assistance requests

## Status Lifecycle

```
Prepared → Released → Counted → Archived
              ↑           ↓
              └─ Recount Request (if medium deviation)
              ↓
              Assistance Required (if large deviation)
```

**Status Definitions:**

- **Prepared:** Count line created, waiting for release validation
- **Released:** Available to warehouse staff for counting
- **Counted:** First count submitted, awaiting processing
- **Recount Request:** Medium deviation, needs second count
- **Recounted:** Second count submitted
- **Assistance Required:** Large deviation, needs supervisor approval
- **Archived:** Complete, adjustment posted, history preserved

## Count Type Matrix

| Count Type | Trigger | Frequency | Business Purpose |
|------------|---------|-----------|------------------|
| 2 Weeks Ship | Sales orders due in 14 days | Every 2 hours | Prevent shipment surprises |
| Ready Count | Production orders 50%+ complete | Every 2 hours | Catch overproduction/scrap |
| Sowing Check | 3 days after sowing | One-time per order | Verify germination rates |
| Transplant Check | 7 days after transplant | One-time per order | Verify transplant survival |
| Negative Availability | Negative inventory/available | Every 2 hours | Fix data integrity issues |
| High Demand | High sales volume | Every 2 hours (optional) | Prevent popular item stockouts |
| Physical Inventory | Manual trigger | On-demand | Full audit, financial compliance |
| Location Count | Manual trigger | On-demand | Zone audit, reorganization verification |
| Single Item | Manual trigger | On-demand | Investigate specific discrepancies |

## Line Source Types

Count lines can come from three sources:

### 1. Inventory (Bin Content)
- Physical warehouse bins
- Expected quantity from bin content records
- Most common source
- Adjustment posts to Item Journal

### 2. Production Order
- Items currently in production
- Expected quantity = Remaining Qty to Produce
- For Ready Counts, Sowing Checks, Transplant Checks
- Adjustment posts to Consumption Journal

### 3. Physical Inventory Journal
- Full physical inventory counts
- Expected quantity from calculated inventory
- For comprehensive audits
- Adjustment posts to Physical Inventory Journal

## Automation Schedule

**Job Queue Configuration:**

1. **CLE Prepare Auto Item Count**
   - Every 2 hours
   - Suggests all enabled count types
   - Parameter: "" (empty = all types)

2. **CLE Release Count**
   - Every 1 minute
   - Releases prepared lines
   - High frequency for responsive release

3. **CLE Process Incoming Counts**
   - Every 1 minute
   - Processes counted lines
   - Posts adjustments or requests recounts

**Configuration:** Counting Setup page (Page 50202)

## Deviation Thresholds

System uses three threshold levels to handle count accuracy:

### Acceptable Range (Auto-Post)
- Count is close to expected
- Adjustment posted automatically
- No human intervention needed
- Line archived immediately

### Recount Range (First Recount)
- Count differs moderately from expected
- System requests second count
- Status changes to "Recount Request"
- Line appears again for counting

### Assistance Range (Supervisor Required)
- Count differs significantly from expected
- Supervisor approval required
- Appears on Inventory Count Posting page
- Can approve, reject, or request additional recount

**Thresholds configured by:** Count Type, Item Category

## Key Codeunits

### 50045: CLE Inventory Counting (Main Engine)
**Key Procedures:**
- `Suggest2WeeksCount()` - Creates count lines for items shipping soon
- `SuggestReadyCount()` - Creates count lines for production orders
- `SuggestNegativeAvailCount()` - Creates count lines for negative inventory
- `AddSingleItemToCount()` - Manual single item counts
- `FinishCount()` - Submit count from UI
- `ProcessCountAdjustment()` - Post adjustment or request recount
- `CreateAdjustmentJournal()` - Generate adjustment entries

### 50108: CLE Prepare Auto Item Count (Orchestrator)
**Purpose:** Runs all automated count suggestions  
**Job Queue:** Every 2 hours  
**What it does:**
- Calls each count type suggestion procedure
- Handles enabled/disabled count types
- Coordinates timing
- Manages preparation phase

### 50111: CLE Process Incoming Counts (Processor)
**Purpose:** Process submitted counts  
**Job Queue:** Every 1 minute  
**What it does:**
- Evaluates deviation from expected
- Posts acceptable adjustments
- Requests recounts for medium deviations
- Escalates large deviations to supervisor
- Archives completed lines
- Creates history records

### 50115: CLE Release Count (Release Manager)
**Purpose:** Release prepared counts  
**Job Queue:** Every 1 minute  
**What it does:**
- Validates bin codes exist
- Checks for duplicate active counts
- Excludes supermarket locations
- Delays if zone is being picked (waits 4 hours after pick)
- Delays if purchase receipts expected (waits for receipt)
- Changes status to Released

### 50116: CLE Count Line Reset (Pick Integration)
**Purpose:** Reset counts when picking occurs  
**Integration:** Called from picking codeunits  
**What it does:**
- When zone starts picking, reset Released lines to Prepared
- Prevents counting while picking active
- Lines will re-release after picking complete + 4 hours
- Ensures counting doesn't interfere with picking

## Integration Points

### With Picking System
- Codeunit 50116 resets Released lines when picking starts
- Lines won't release if zone picked within last 4 hours
- Prevents inventory movement during counting
- Coordinated with order lock calendar

### With Production Orders
- Ready Count monitors 50%+ complete orders
- Sowing Check triggered by sowing date
- Transplant Check triggered by transplant date
- Counts update remaining quantity to produce
- Adjusts for scrap/waste/overproduction

### With Sales Orders
- 2 Weeks Ship monitors upcoming shipments
- Links to sales lines for demand visibility
- Prevents stockouts before shipping
- Integrated with availability checking

### With Purchasing
- Release delayed if purchase receipt expected
- Waits for receipts to post before releasing count
- Prevents counting items in-transit
- Coordinated with receipt posting

### With Warehouse Management
- Bin validation before release
- Location-specific count assignments
- Zone filtering for count sheets
- Supermarket exclusion (separate handling)

## Tables

### 50031: CLE Inventory Count Line (Main Transaction)
**Records:** Individual count lines  
**Key Fields:**
- Entry No (primary key)
- Item No, Variant Code, Location, Bin
- Count Type, Line Source
- Status (Prepared, Released, Counted, etc.)
- Expected Quantity, Counted Quantity
- Quantity Adjustment
- Counter User ID, Count DateTime
- Production Order No (if applicable)

### 50069: CLE Count Line History (Audit Trail)
**Records:** All activities on count lines  
**Key Fields:**
- Entry No (linked to count line)
- Action Type (Created, Released, Counted, Recounted, Posted, etc.)
- User ID, DateTime
- Old Status, New Status
- Notes

### 50071: CLE Counting Setup (Configuration)
**Records:** System-wide counting settings  
**Key Fields:**
- Job Queue Entry GUIDs (3 jobs)
- Enable flags for each count type
- Default limits per count type
- Deviation thresholds
- Days between counts

### 50074: CLE Counting Priority (Priority Configuration)
**Records:** Priority values by count type  
**Purpose:** Determines sort order on count sheets  
**Used for:** Ensuring critical counts happen first

## Pages

### 50125: Inventory Count Lines (Staff Interface)
**Used by:** Warehouse Staff  
**Purpose:** Counting sheet  
**Features:**
- Filters to user's location/zone
- Sorted by priority, location, bin
- Quantity entry
- Finish & Submit action
- Barcode scanning *(Planned)*

### 50126: Inventory Count Preparation (Manager Interface)
**Used by:** Managers/Supervisors  
**Purpose:** Review and manual count preparation  
**Features:**
- View all prepared lines
- Manual count type triggers
- Line editing before release
- Preview counts before release

### 50127: Inventory Count Posting (Exception Interface)
**Used by:** Supervisors/Managers  
**Purpose:** Exception handling and approval  
**Features:**
- High-deviation counts
- Approve/reject adjustments
- Request additional recounts
- Adjust acceptable limits
- Assistance request handling

### 50199: CLE Counting Dashboard (Monitoring)
**Used by:** Managers  
**Purpose:** System monitoring and statistics  
**Features:**
- Count lines by status
- Accuracy metrics
- Job queue status
- Manual run triggers
- Performance statistics

### 50202: CLE Counting Setup (Configuration)
**Used by:** System Administrator  
**Purpose:** System configuration  
**Features:**
- Enable/disable count types
- Job queue setup
- Deviation threshold configuration
- Default limits
- Integration settings

## Performance Monitoring

**Key Metrics:**

1. **Count Accuracy Rate**
   - % of first counts within acceptable range
   - Target: >95%

2. **Recount Rate**
   - % of counts requiring recount
   - Target: <5%

3. **Supervisor Intervention Rate**
   - % of counts requiring assistance
   - Target: <1%

4. **Average Time to Count**
   - Minutes from release to counted
   - Benchmark: <30 minutes per line

5. **Lines Pending**
   - Count of unreleased prepared lines
   - Watch for bottlenecks

6. **Job Queue Health**
   - All 3 jobs running on schedule
   - No errors in execution

**Dashboard:** CLE Counting Dashboard (Page 50199)

## Troubleshooting

### Lines Not Releasing
**Check:**
- Job queue running (50115)?
- Bin codes exist?
- Zone picked recently (<4 hours ago)?
- Purchase receipts expected?
- Duplicate active count exists?

### Lines Not Processing
**Check:**
- Job queue running (50111)?
- Counted status set correctly?
- User has counted quantity entered?

### High Recount Rate
**Possible causes:**
- Thresholds too tight
- Counting errors (staff training needed)
- Inventory movement during counting
- Bin content data inaccurate

### Lines Stuck in Prepared
**Possible causes:**
- Release job queue not running
- Validation failures (check bin codes)
- Picking activity in zone
- Expected receipts blocking release

## Best Practices

✓ **Monitor dashboard daily** - Catch issues early  
✓ **Review accuracy metrics weekly** - Identify training needs  
✓ **Adjust thresholds seasonally** - Different volatility in busy seasons  
✓ **Enable count types strategically** - Don't create unnecessary work  
✓ **Review exception counts promptly** - Don't let queue build up  
✓ **Coordinate with picking schedule** - Plan counts during slow periods  
✓ **Maintain job queue health** - Critical for automation  
✓ **Archive old history periodically** - Keep system performant  

## Security

**Permissions Required:**

- **Counting (Staff):** Read/Write Count Lines, Execute Finish Count
- **Preparation (Manager):** All Count Line permissions, Manual triggers
- **Posting (Supervisor):** Approval permissions, Adjustment posting
- **Setup (Admin):** Full counting setup, Job queue configuration

**Configured in:** Permission Set 50000 CLE Clesen Horticulture

---

## Related documents

- [[counting-process]]
- [[counting-dashboard]]
- [[count-preparation]]
- [[count-release]]
- [[understanding-count-types]]
- [[count-processing]]
- [[counting-exception-handling]]

---

*For detailed count type explanations, see understanding-count-types.md. For daily counting procedures, see counting-process.md.*
