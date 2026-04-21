---
title: Availability Reserves
type: howto
tags: [availability, reserves, inventory]
created: 2026-04-21
updated: 2026-04-21
sources: [availability-reserves-user-guide.md]
---

# Availability Reserves

Temporarily hold or reserve inventory quantities for specific purposes, removing them from availability calculations until a specified release date.

## When to Use Reserves

**Good use cases:**
- Committed inventory for special projects (customer project pending formal order)
- Quality control holds (pending inspection/testing)
- Trade show or event inventory (set aside for upcoming events)
- Planned promotions (reserve stock before formal orders)
- Temporary holds (waiting for customer confirmation)

**Do NOT use for:**
- Normal sales orders (use standard reservations)
- Production component allocation (handled automatically)
- Transfer orders between locations (use standard processes)
- Permanent inventory allocation

## Prerequisites

Before using reserves, verify:

1. **Feature is enabled** in Clesen Setup
   - Navigate to Clesen Setup page
   - Check `Use Availability Reserves` field
   - Contact administrator if not enabled

2. **Item type must be Inventory** (Service items cannot be reserved)

3. **Location must be Standard type** (Transit, Warehouse types not supported)

## Access Availability Reserves

### From Item Card

1. Open the Item Card for the item you want to reserve
2. Click **Actions** → **Functions** → **Availability Reserves**
3. The list shows existing reserves for this item

### View All Reserves System-Wide

1. Use search (`Ctrl+K`) and search for "Availability Reserves"
2. Click **CLE Availability Reserves** list page

## Creating a Reserve — Step by Step

### Step 1: Navigate to Availability Reserves

- Open Item Card
- Actions → Functions → Availability Reserves
- Click **New** to create a new reserve record

### Step 2: Enter Required Information

**Location Code** (Required)
- Click the lookup to select a location
- Only Standard locations with inventory appear
- Example: `EVANSTON`, `GRAYSLAKE`

**Item No.** (Required)
- Auto-filled if accessed from Item Card
- Item Description appears automatically

**Reserve Quantity** (Required)
- Enter the quantity to reserve (in base unit of measure)
- Must be positive
- Cannot exceed "Available to Reserve" amount
- System validates against current inventory minus existing reserves

**Release at Date** (Required)
- Select when this reserve should be released
- Must be today or a future date (not past)
- On this date, reserved quantity becomes available again

### Step 3: Enter Optional Details

**Reason Code** (Recommended)
- Helps categorize and track reserves
- Examples: `QC HOLD`, `EVENT`, `SPECIAL PROJECT`

**Comment** (Recommended)
- Document why reserve was created
- Include customer name, project, or purpose
- Example: "Reserved for ABC Corp spring installation"

### Step 4: Review Calculated Fields

**Available to Reserve**
- Shows remaining quantity you can reserve
- Calculation: Current Inventory - Other Existing Reserves
- If zero or negative, you cannot create the reserve

**Created By / Created Date Time**
- Automatically populated when you save

### Step 5: Save the Reserve

- Click **OK** or close the card
- Reserve is now active and affects availability calculations

## Managing Existing Reserves

### View Reserves for a Specific Item

1. Open Item Card
2. Actions → Functions → Availability Reserves
3. View all reserves across all locations

### Edit a Reserve

1. Open the Availability Reserves list
2. Select the reserve to modify
3. Edit fields as needed (same validation rules apply)

**Common modifications:**
- Extend hold period (change Release at Date)
- Reduce quantity (if some became available)
- Update location (move reserve to different location)
- Add documentation (update comment field)

### Delete a Reserve

1. Open Availability Reserves list
2. Select reserve to delete
3. Click **Delete** or press `Ctrl+Delete`
4. Confirm deletion
5. Quantity immediately becomes available again

**Warning:** Deleting a reserve immediately affects availability calculations and sales planning.

### Expired Reserves

Reserves automatically become inactive when:
- Current date equals or exceeds the Release at Date
- Quantity is included in availability calculations again
- Record remains in system for historical tracking

**Best Practice:** Periodically delete old expired reserves to keep list manageable.

## How Reserves Affect Availability

### The Calculation

When availability is calculated:

1. System calculates normal availability (Inventory + Supply - Demand)
2. System finds all active reserves for that item/location
3. Active reserves = reserves where `Release at Date > Calculation Date`
4. Total active reserves subtracted from availability
5. Result shown in availability forecasts and sales planning

### Example Scenario

**Situation:**
- Item: `PLANT-001`, Location: `EVANSTON`
- Current Inventory: 1,000 units
- Today: March 5, 2026

**Without Reserves:**
- Availability = 1,000 units every day

**With Reserve:**
- Reserve of 200 units created March 5
- Release at Date: March 12, 2026

**Resulting Availability:**

| Date | Calculation | Available |
|------|-------------|-----------|
| March 5-11 | 1,000 - 200 | 800 units |
| March 12+ | 1,000 - 0 | 1,000 units |

### Multiple Reserves

If multiple reserves exist for same item/location:
- All active reserves summed
- Total subtracted from availability
- Each reserve can have different Release at Date

**Example:**
- Reserve 1: 100 units until March 10
- Reserve 2: 150 units until March 15
- Inventory: 1,000 units

**Availability:**
- March 5-9: 1,000 - 250 = 750 units
- March 10-14: 1,000 - 150 = 850 units
- March 15+: 1,000 - 0 = 1,000 units

## Common Use Cases

### Quality Control Hold

**Scenario:** 500 units arrive but need QC inspection before sale.

**Solution:**
1. Receive inventory (increases inventory by 500)
2. Create reserve: 500 units until inspection date
3. Availability shows units as unavailable
4. After inspection passes, delete the reserve
5. Availability immediately reflects 500 units

### Trade Show Inventory

**Scenario:** Need 200 units for trade show on March 20.

**Solution:**
1. Create reserve: 200 units
2. Release at Date: March 21 (day after show)
3. Comment: "Reserved for Spring Trade Show - Chicago"
4. Availability planning won't sell these units
5. After show, let reserve expire or create sales order and delete reserve

### VIP Customer Hold

**Scenario:** Best customer wants to hold 300 units while finalizing order next week.

**Solution:**
1. Create reserve: 300 units
2. Release at Date: One week from today
3. Reason Code: `CUSTOMER HOLD`
4. Comment: "Reserved for ABC Corp - pending order confirmation"
5. When order placed, delete reserve and create sales order
6. If customer cancels, delete reserve to release inventory

### Seasonal Promotion Planning

**Scenario:** Need to ensure 1,000 units available for spring promotion starting April 1.

**Solution:**
1. Create reserve: 1,000 units
2. Release at Date: April 1
3. Comment: "Spring Promotion 2026 - Do not sell before April 1"
4. Sales planning shows reduced availability until April 1
5. On April 1, reserve expires and promotion sales proceed

## Validation Rules

The system enforces these rules when creating/modifying reserves:

| Validation | Reason |
|------------|--------|
| Reserve Quantity > 0 | Must reserve a positive amount |
| Location Code required | Must specify where inventory is reserved |
| Release at Date >= Today | Cannot set release date in past |
| Item Type = Inventory | Only physical inventory items can be reserved |
| Item not Sales Blocked | Cannot reserve blocked items |
| Location Type = Standard | Only standard locations support reserves |
| Quantity <= Available | Cannot reserve more than available inventory |

## Troubleshooting

### Error: Location Code Required Before Entering Quantity

**Cause:** Trying to enter quantity without selecting location.

**Solution:**
1. Click Location Code lookup
2. Select a valid Standard location
3. Then enter Reserve Quantity

### Error: Reserve Quantity Exceeds Available Inventory

**Cause:** Trying to reserve more than currently available.

**Solution:**
1. Check "Available to Reserve" field (shows maximum)
2. Either:
   - Reduce Reserve Quantity to fit available inventory
   - Delete or reduce other existing reserves first
   - Wait for more inventory to arrive

**Example:**
- Current Inventory: 500 units
- Existing Reserves: 300 units
- Available to Reserve: 200 units
- You try to reserve: 250 units (error—exceeds 200)

### Error: Availability Reserves Only for Inventory Items

**Cause:** Trying to create reserve for Service item or other non-inventory type.

**Solution:**
- Reserves only work for physical inventory items
- Verify Item Card Type field shows "Inventory"
- Service items and other types cannot use this feature

### Error: Availability Reserves Only for Standard Locations

**Cause:** Selected location with type other than Standard.

**Solution:**
1. Open Location Card for selected location
2. Check `CLE Location Type` field
3. Only locations set to "Standard" support reserves
4. Select different location or contact administrator

### Error: Release at Date Cannot Be in Past

**Cause:** Trying to set Release at Date before today.

**Solution:**
- Release at Date must be today or future date
- Change date to today or later
- If tracking a past hold, set Release at Date to today

### Warning: Availability Reserves Action Not Visible

**Cause:** Feature disabled or item doesn't support reserves.

**Solution:**

**Option 1: Verify feature is enabled**
- Open Clesen Setup
- Check `Use Availability Reserves` field is enabled
- If not, contact administrator

**Option 2: Verify item is eligible**
- Item Type must be "Inventory"
- Item must not be sales-blocked

### Issue: Reserve Doesn't Affect Availability

**Cause:** May be looking at availability before reserve created or after it expired.

**Solution:**

1. Verify reserve is active:
   - Check Release at Date is in the future
   - Confirm Reserve Quantity > zero

2. Refresh availability calculation:
   - Close and reopen availability page
   - Select different date and return

3. Verify correct location:
   - Reserves only affect specific location where created
   - Check availability page location filter

## FAQ

**How long do reserves last?**
Reserves are active from creation until Release at Date. On release date, they automatically become inactive. Record remains for historical tracking.

**Can I reserve across multiple locations in one reserve?**
No, each reserve applies to single location. Create separate reserves for each location.

**What happens if inventory drops below reserved quantity?**
System validates reserves when created/modified. If inventory decreases after creation (due to sales, adjustments, etc.), reserve remains active. This can result in negative availability, alerting you to shortage.

**Can I reserve partial quantities?**
Yes, reserve any quantity from 1 up to available inventory. Multiple reserves can exist for same item; you don't need to reserve all available inventory.

**Do reserves create actual Business Central reservations?**
No, Availability Reserves are separate from standard BC Reservation system. They only affect availability calculations, not actual inventory reservations or allocations.

**Who can see my reserves?**
All users with permission to view Availability Reserves page can see all reserves. No per-user or per-department filtering. Use Comment field if you need to note ownership/responsibility.

**What's the difference between a reserve and a sales order?**

| Feature | Availability Reserve | Sales Order |
|---------|---------------------|-------------|
| Purpose | Temporary hold | Customer commitment |
| Inventory | No movement | Reserved when posted |
| Financial | No impact | Creates receivables |
| Automatic Release | Yes (on date) | No |
| Customer Link | None | Linked to customer |
| Best For | Planning, holds | Actual sales |

**Can I create reserves for items with no inventory?**
No, system validates that you can only reserve up to available inventory quantity. If no inventory at location, you cannot create reserve.

**How do I report on reserves?**
Use Availability Reserves list page with filters and views:
- Filter by Item No., Location Code, Release at Date, Reason Code
- Export to Excel for reporting
- Sort by Created Date Time to see recent reserves
- Filter by Created By to see who created reserves

**Do reserves affect cost calculations or financial reports?**
No, reserves are purely for availability planning. They don't affect inventory valuation, cost of goods sold, or financial calculations.

## Related Pages

- [[availability-system]] — Understanding how availability works
- [[move-lines]] — Transferring sales order lines based on availability
- [[availability-troubleshooting]] — IT troubleshooting for availability system
