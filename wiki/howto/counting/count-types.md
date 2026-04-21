---
title: Count Types — Staff Guide
type: howto
tags: [counting, inventory-counting, count-types, staff, prioritization]
created: 2026-04-21
updated: 2026-04-21
sources: [understanding-count-types.md]
---

# Count Types — Staff Guide

Overview of the 9 automatic count types that trigger throughout the day. Understanding the type helps you prioritize and recognize patterns.

---

## The 9 Count Types

### 1. Two Weeks Ship Count

**What it is:** Items that will ship to customers within the next 2 weeks.

**Why we count it:**
- Ensures we have inventory for upcoming orders
- Prevents surprising customers with stockouts
- Catches discrepancies before they affect shipments

**When it runs:**
- Automatically every 2 hours
- Looks at orders shipping in next 14 days
- Creates count line if item hasn't been counted recently

**What you'll see:**
- Items on upcoming sales orders
- Typically in picking zones
- Usually moderate to high quantity items

**Priority:** HIGH — These items are about to ship

---

### 2. Ready Count

**What it is:** Items on production orders that are finishing production soon (50% or more complete).

**Why we count it:**
- Production may have generated extra items (overproduction)
- Helps catch scrap/waste in production
- Verifies actual output vs planned output
- Updates inventory before production completes

**When it runs:**
- Automatically every 2 hours
- Only for production orders 50%+ complete
- Only if order due date is within 14 days

**What you'll see:**
- Items on production benches/lines
- May be partially finished
- Some complete, some still growing/processing

**How to count:**
- Count ALL items for that production order number
- Include finished AND unfinished
- Don't try to estimate completion percentage
- Just count physical quantity present

**Priority:** HIGH — Production is wrapping up

---

### 3. Sowing Check

**What it is:** Items on production orders immediately after sowing/planting.

**Why we count it:**
- Seeds may not germinate 100%
- Catches germination issues early
- Allows time to re-sow if needed
- Verifies actual started quantity

**When it runs:**
- Automatically 3 days after sowing date
- Only for production orders at start of process
- Checks if seed germination matches expectations

**What you'll see:**
- Recently seeded trays
- Small seedlings
- Items in germination area

**How to count:**
- Count trays with viable seedlings
- Don't count empty cells/trays
- System calculates germination rate

**Priority:** MEDIUM — Early intervention opportunity

---

### 4. Transplant Check

**What it is:** Items on production orders immediately after transplanting.

**Why we count it:**
- Transplant shock may cause losses
- Verifies plants survived transplant
- Catches issues before further investment
- Updates expected completion quantity

**When it runs:**
- Automatically 7 days after transplant date
- Only for production orders with transplant operation
- Checks transplant survival rate

**What you'll see:**
- Recently transplanted items
- Items in hardening/acclimation zones
- May show stress from transplant

**How to count:**
- Count viable plants only
- Don't count dead/dying plants
- Count what will realistically finish

**Priority:** MEDIUM — Helps adjust production expectations

---

### 5. Negative Availability Count

**What it is:** Items showing negative inventory or negative available quantity in system.

**Why we count it:**
- Negative inventory shouldn't exist
- Indicates picking/shipping happened without proper receiving
- Critical for data integrity
- May affect ordering/planning

**When it runs:**
- Automatically every 2 hours
- Triggered by negative inventory or negative available amounts
- Creates count line to verify actual inventory

**What you'll see:**
- System shows negative expected quantity
- Usually means over-picked or data entry error
- Physical count will correct the record

**How to count:**
- Count physical reality — ignore what system says
- If bin is empty, enter 0
- If items are there, enter actual count
- System will correct the negative

**Priority:** CRITICAL — Data integrity issue

**Special note:** Zero is likely the correct answer — negative means we "owe" inventory that doesn't exist

---

### 6. High Demand Count

**What it is:** Items with unusually high sales activity recently.

**Why we count it:**
- High turnover = more chance for errors
- Ensures we don't run out of popular items
- Verifies inventory before it becomes critical
- Prevents lost sales

**When it runs:**
- Automatically every 2 hours (when enabled)
- Triggered by high sales volume
- Looks at recent sales patterns

**What you'll see:**
- Fast-moving items
- Popular seasonal items
- Items with multiple recent sales orders

**Priority:** HIGH — High risk of stockout

---

### 7. Physical Inventory Count

**What it is:** Complete, comprehensive count of all inventory (typically quarterly or yearly).

**Why we count it:**
- Regulatory compliance
- Financial statement accuracy
- Complete audit of all inventory
- Resets system to physical reality

**When it runs:**
- Manually triggered by management
- Usually at fiscal period end
- May be scheduled annually/quarterly

**What you'll see:**
- EVERY item in EVERY location
- All bins assigned for counting
- Usually happens during slow period or shutdown
- Very large number of count lines

**How to count:**
- Same as regular counting
- Extra attention to accuracy
- Management may require supervisor verification
- May involve multiple counters per zone

**Priority:** CRITICAL — Used for financial reporting

**Special requirements:**
- May require warehouse freeze (no movement during count)
- Two-person counts for high-value items
- Supervisor sign-off may be required

---

### 8. Location Count

**What it is:** Count of all items in a specific warehouse location/zone.

**Why we count it:**
- Audit specific area
- Reorganization/cleanup verification
- Problem area investigation
- Zone-specific accuracy check

**When it runs:**
- Manually triggered by management
- On-demand as needed
- After major reorganization
- When location has known issues

**What you'll see:**
- All items in one location code
- All bins within that location
- May be focused count (one zone)

**Priority:** MEDIUM-HIGH (depends on reason for count)

---

### 9. Single Item Count

**What it is:** Count of one specific item across all locations, or specific item in specific location.

**Why we count it:**
- Investigate specific item discrepancy
- Customer complaint about availability
- Before large order shipment
- Spot check for accuracy

**When it runs:**
- Manually triggered by management
- On-demand as needed
- Usually investigative

**What you'll see:**
- One item number
- May be in one bin or multiple bins
- Often triggered by inventory question

**Priority:** VARIES — Depends on urgency of need

---

## Count Type Priority Summary

**Priority affects order on your count sheet:**

| Priority | Count Types |
|----------|------------|
| CRITICAL | Negative Availability, Physical Inventory |
| HIGH | 2 Weeks Ship, Ready Count, High Demand |
| MEDIUM | Sowing Check, Transplant Check, Location Count |
| VARIES | Single Item Count |

**Always count in priority order** — System sorts your count sheet automatically.

---

## Common Patterns You'll Notice

### Morning Count Lines
- Overnight automation runs
- 2 Weeks Ship items appear
- Ready Count items from production
- Negative Availability corrections

### Throughout the Day
- Single Item counts (as needed)
- Recount requests (if first count had issues)
- New production orders reaching 50% completion

### End of Week
- Location counts (scheduled maintenance)
- Physical inventory preparation (if scheduled)

---

## Count Frequency

**How often you count the same item:**
- System tracks last count date
- Won't create duplicate count if recently counted
- Minimum time between counts (configured by management)
- Exception: Manual counts can override

**Why you might count same item twice:**
1. Recount requested (first count had high deviation)
2. Different count source (Inventory AND Production Order)
3. Manual count triggered by supervisor
4. Multiple count types include same item

---

## What Count Type Means for You

### Fast Counts (2 Weeks Ship, High Demand)
- Picking zones
- Regular inventory
- Straightforward counting
- High volume

### Careful Counts (Ready Count, Checks)
- Production areas
- Requires judgment (viable vs non-viable)
- May need germination rate knowledge
- Quality assessment

### Investigation Counts (Negative Availability, Single Item)
- Problem-solving focus
- Report findings to supervisor
- May need to search multiple locations
- Document any observations

### Audit Counts (Physical Inventory, Location)
- Extra accuracy required
- May have special procedures
- Supervisor involvement
- Documentation important

---

## Tips for Different Count Types

**2 Weeks Ship & High Demand:**
- Count quickly but accurately
- These are urgent for customer orders
- Report shortages immediately

**Ready Count, Sowing Check, Transplant Check:**
- Assess quality, not just quantity
- Don't count dead/dying plants
- Count what will actually finish/sell

**Negative Availability:**
- Physical reality is the truth
- Zero is probably correct
- Don't be surprised by negative expected quantity

**Physical Inventory:**
- Take extra time
- Double-check counts
- This affects financial statements

**Single Item:**
- Someone is waiting for your answer
- Be thorough — check all possible locations
- Report findings to supervisor

---

## Need Help?

If you're unsure about a count type:
1. Check this guide
2. Ask your supervisor
3. Look at count history (what happened before)
4. Remember: Accuracy matters more than speed

---

## Related Pages

- [[counting-system-overview]] — Five-phase counting process architecture
- [[counting-process]] — Staff guide for physical counting
- [[counting-dashboard]] — Manager guide for monitoring
- [[count-preparation]] — Manager guide for Phase 1
- [[count-release]] — Manager guide for Phase 2
- [[count-processing]] — Manager guide for Phase 4
- [[counting-exceptions]] — Manager guide for Phase 5
