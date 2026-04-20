# Availability Reserves

> **Version:** 1.0  
> **Last Updated:** 2026-03-05  
> **Audience:** Staff, Managers  
> **Feature Status:** Optional (must be enabled in setup)

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Accessing Availability Reserves](#accessing-availability-reserves)
- [Creating a Reserve](#creating-a-reserve)
- [Managing Existing Reserves](#managing-existing-reserves)
- [Understanding How Reserves Affect Availability](#understanding-how-reserves-affect-availability)
- [Common Use Cases](#common-use-cases)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Related Resources](#related-resources)

---

## Overview

The Availability Reserves feature allows you to temporarily "hold" or "reserve" inventory quantities for specific purposes, removing them from the normal availability calculations until a specified date. This helps prevent overselling when you know inventory is committed but hasn't yet been formally allocated through sales orders.

### What Availability Reserves Do

When you create an availability reserve:

- The reserved quantity is **subtracted** from calculated availability
- The reduction applies from the creation date until the **Release at Date**
- On the release date, the quantity becomes available again automatically
- Sales planning and availability forecasts reflect the reduced availability
- The reserve doesn't create actual inventory movements or reservations in Business Central

### When to Use Availability Reserves

Common scenarios include:

- **Committed inventory for special projects** - Hold inventory for a customer project that hasn't been ordered yet
- **Quality control holds** - Reserve quantities pending inspection or testing
- **Trade show or event inventory** - Set aside items for upcoming events
- **Planned promotions** - Reserve stock for a future promotion before formal orders are placed
- **Temporary holds for pending decisions** - Hold inventory while awaiting customer confirmation

### When NOT to Use Availability Reserves

Do **not** use reserves for:

- Normal sales orders (use standard reservations)
- Production component allocation (handled automatically)
- Transfer orders between locations (use standard processes)
- Permanent inventory allocation

---

## Prerequisites

### System Requirements

Before using Availability Reserves, verify that:

1. **Feature is enabled** in Clesen Setup
   - Navigate to **Clesen Setup** page
   - Verify `Use Availability Reserves` field is checked
   - Contact your system administrator if not enabled

2. **Items must be Inventory type**
   - Only items with Type = "Inventory" can have reserves
   - Service items cannot be reserved

3. **Locations must be Standard type**
   - Only Standard locations support reserves
   - Other location types (Transit, Warehouse, etc.) cannot be used

### User Permissions

You need appropriate permissions to:

- Create and modify Availability Reserve records
- Access Item Cards
- View availability calculations

---

## Accessing Availability Reserves

### From the Item Card

The primary way to access reserves is through the Item Card:

1. Open the **Item Card** for the item you want to reserve
2. Click **Actions** in the ribbon
3. Navigate to **Functions**
4. Click **Availability Reserves**

**Note:** The "Availability Reserves" action is only visible when:

- The feature is enabled in Clesen Setup
- The item Type is "Inventory"
- The item is not sales-blocked

### Direct Access to All Reserves

You can also view all reserves across all items:

1. Use the search function (`Ctrl+K` or click the search icon)
2. Search for "Availability Reserves"
3. Click **CLE Availability Reserves** list page

---

## Creating a Reserve

### Step-by-Step Instructions

1. **Navigate to Availability Reserves**
   - Open the Item Card for your item
   - Actions → Functions → Availability Reserves
   - The list shows existing reserves for this item

2. **Create New Reserve**
   - Click **New** to create a new reserve record
   - The Availability Reserve Card opens

3. **Enter Required Information**

   **Location Code** (Required)
   - Click the lookup (dropdown) to select a location
   - Only Standard locations with inventory for this item appear
   - Example: `EVANSTON`, `GRAYSLAKE`

   **Item No.** (Required - usually pre-filled)
   - If accessed from Item Card, this is automatically filled
   - The Item Description appears automatically

   **Reserve Quantity** (Required)
   - Enter the quantity to reserve (in base unit of measure)
   - Must be a positive number
   - Cannot exceed the "Available to Reserve" amount
   - The system validates against current inventory minus existing reserves

   **Release at Date** (Required)
   - Select the date when this reserve should be released
   - Must be today or a future date (cannot be in the past)
   - On this date, the reserved quantity becomes available again

4. **Enter Optional Details**

   **Reason Code** (Recommended)
   - Select a reason code to categorize the reserve
   - Helps with reporting and tracking
   - Examples: `QC HOLD`, `EVENT`, `SPECIAL PROJECT`

   **Comment**
   - Add notes explaining why this reserve was created
   - Best practice: Include the customer name, project name, or purpose
   - Example: "Reserved for ABC Corp spring installation project"

5. **Review Calculated Fields**

   **Available to Reserve**
   - Shows remaining quantity that can be reserved
   - Calculation: `Current Inventory - Other Existing Reserves`
   - Updates automatically as you enter information
   - If this shows zero or negative, you cannot create the reserve

   **Created By** and **Created Date Time**
   - Automatically populated when you save
   - Shows who created the reserve and when

6. **Save the Reserve**
   - Click **OK** or close the card to save
   - The reserve is now active and affects availability calculations

### Validation Rules

The system enforces these rules when creating reserves:

| Validation | Reason |
|------------|--------|
| Reserve Quantity > 0 | Must reserve a positive amount |
| Location Code required | Must specify where inventory is reserved |
| Release at Date >= Today | Cannot set release date in the past |
| Item Type = Inventory | Only physical inventory items can be reserved |
| Item not Sales Blocked | Cannot reserve inventory for blocked items |
| Location Type = Standard | Only standard locations support reserves |
| Quantity <= Available | Cannot reserve more than available inventory |

---

## Managing Existing Reserves

### Viewing Reserves

**For a Specific Item:**

1. Open the Item Card
2. Actions → Functions → Availability Reserves
3. View all reserves for this item across all locations

**All Reserves System-Wide:**

1. Search for "Availability Reserves"
2. Open the list page
3. View all reserves for all items
4. Use filters to find specific reserves

### Editing a Reserve

You can modify any field on an existing reserve:

1. Open the Availability Reserves list
2. Select the reserve to modify
3. Edit the fields as needed
4. The same validation rules apply when modifying

**Common modifications:**

- **Extend the hold period** - Change the Release at Date to a later date
- **Reduce reserve quantity** - Lower the quantity if some became available
- **Update location** - Move the reserve to a different location
- **Add documentation** - Update the comment field with new information

### Deleting a Reserve

To remove a reserve entirely:

1. Open the Availability Reserves list
2. Select the reserve to delete
3. Click **Delete** or press `Ctrl+Delete`
4. Confirm the deletion
5. The quantity immediately becomes available again

**Warning:** Deleting a reserve immediately affects availability calculations. Sales planning and forecasts will show the increased availability.

### Expired Reserves

Reserves automatically become inactive when:

- The current date equals or exceeds the Release at Date
- The quantity is included in availability calculations again
- The record remains in the system for historical tracking

**Best Practice:** Periodically review and delete old expired reserves to keep the list manageable.

---

## Understanding How Reserves Affect Availability

### The Calculation

When availability is calculated for an item and date:

1. System calculates normal availability (Inventory + Supply - Demand)
2. System finds all active reserves for that item/location
3. Active reserves = reserves where `Release at Date > Calculation Date`
4. Total active reserves are subtracted from availability
5. Result shows in availability forecasts, sales planning, and all availability pages

### Example Scenario

**Situation:**

- Item: `PLANT-001`, Location: `EVANSTON`
- Current Inventory: 1,000 units
- No supply or demand for the week
- Today is March 5, 2026

**Without Reserves:**

- Availability = 1,000 units (every day)

**With a Reserve:**

- Reserve of 200 units created on March 5
- Release at Date: March 12, 2026

**Resulting Availability:**

| Date | Calculation | Available |
|------|-------------|-----------|
| March 5-11 | 1,000 - 200 | 800 units |
| March 12+ | 1,000 - 0 | 1,000 units |

### Where Reserves Impact Availability

Reserves affect these areas:

- **Availability Forecast** page
- **Sales Speed Entry** - availability shown while entering orders
- **Sales Planning** pages
- **Availability Matrix**
- **Daily Availability** overview
- All availability calculations via the `CLE Availability Calculation` codeunit

### Multiple Reserves

If multiple reserves exist for the same item/location:

- All active reserves are summed
- Total is subtracted from availability
- Each reserve can have a different Release at Date

**Example:**

- Reserve 1: 100 units until March 10
- Reserve 2: 150 units until March 15
- Current inventory: 1,000 units

**Availability:**

- March 5-9: 1,000 - 250 = 750 units
- March 10-14: 1,000 - 150 = 850 units
- March 15+: 1,000 - 0 = 1,000 units

---

## Common Use Cases

### Use Case 1: Quality Control Hold

**Scenario:** A shipment of 500 units arrives but needs quality inspection before being sold.

**Solution:**

1. Receive the inventory (1 Inventory increases by 500)
2. Create reserve: 500 units until inspection date
3. Availability shows these units as unavailable
4. After inspection passes, delete the reserve
5. Availability immediately reflects the 500 units

### Use Case 2: Trade Show Inventory

**Scenario:** You need 200 units for a trade show on March 20, but don't want to create a sales order yet.

**Solution:**

1. Create reserve: 200 units
2. Release at Date: March 21 (day after show)
3. Comment: "Reserved for Spring Trade Show - Chicago"
4. Availability planning won't sell these units
5. After the show, either:
   - Let reserve expire automatically on March 21, OR
   - Create actual sales order and delete reserve early

### Use Case 3: VIP Customer Hold

**Scenario:** Your best customer calls and asks you to hold 300 units while they finalize their order next week.

**Solution:**

1. Create reserve: 300 units
2. Release at Date: One week from today
3. Reason Code: `CUSTOMER HOLD`
4. Comment: "Reserved for ABC Corp - pending order confirmation"
5. When order is placed, delete reserve and create sales order
6. If customer cancels, delete reserve to release inventory

### Use Case 4: Seasonal Promotion Planning

**Scenario:** Planning a spring promotion starting April 1, need to ensure 1,000 units available.

**Solution:**

1. Create reserve: 1,000 units
2. Release at Date: April 1
3. Comment: "Spring Promotion 2026 - Do not sell before April 1"
4. Sales planning will show reduced availability until April 1
5. On April 1, reserve expires and promotion sales can proceed

---

## Troubleshooting

### Error: "You must select a Location Code before entering a Reserve Quantity"

**Cause:** Attempting to enter a quantity without selecting a location.

**Solution:**

1. Click the Location Code lookup
2. Select a valid Standard location
3. Then enter the Reserve Quantity

### Error: "Reserve quantity exceeds available inventory"

**Cause:** Trying to reserve more than is currently available at the selected location.

**Solution:**

1. Check the "Available to Reserve" field - this shows maximum you can reserve
2. Either:
   - Reduce the Reserve Quantity to fit available inventory, OR
   - Delete or reduce other existing reserves first, OR
   - Wait for more inventory to arrive

**Example Error:**

- Current Inventory: 500 units
- Existing Reserves: 300 units
- Available to Reserve: 200 units
- You try to reserve: 250 units (exceeds available 200)

### Error: "Availability reserves can only be created for Inventory items"

**Cause:** Attempting to create a reserve for a Service item or other non-inventory type.

**Solution:**

- Reserves only work for physical inventory items
- Verify the Item Card Type field shows "Inventory"
- Service items and other types cannot use this feature

### Error: "Availability reserves can only be created for Standard locations"

**Cause:** Selected a location with a type other than Standard.

**Solution:**

1. Open the Location Card for the selected location
2. Check the `CLE Location Type` field
3. Only locations set to "Standard" support reserves
4. Select a different location or contact your administrator

### Error: "Release at Date cannot be in the past"

**Cause:** Trying to set a Release at Date before today.

**Solution:**

- Release at Date must be today or a future date
- Change the date to today or later
- If you need to track a past hold, use the Comment field and set Release at Date to today

### Warning: Availability Reserves Action Not Visible on Item Card

**Cause:** Either the feature is disabled, or the item doesn't support reserves.

**Solution:**

1. Verify feature is enabled:
   - Open **Clesen Setup**
   - Check `Use Availability Reserves` field is enabled
   - If not, contact your administrator

2. Verify item is eligible:
   - Item Type must be "Inventory"
   - Item must not be sales-blocked

### Issue: Reserve Doesn't Seem to Affect Availability

**Cause:** May be looking at availability before the reserve was created, or after it expired.

**Solution:**

1. Verify the reserve is active:
   - Check Release at Date is in the future
   - Confirm Reserve Quantity is greater than zero

2. Refresh the availability calculation:
   - Close and reopen the availability page
   - Select a different date and return

3. Verify you're looking at the correct location:
   - Reserves only affect the specific location where they're created
   - Check availability page location filter

---

## FAQ

### How long do reserves last?

Reserves are active from creation until the Release at Date. On the release date, they automatically become inactive and no longer affect availability calculations. The record remains in the system for historical tracking.

### Can I reserve inventory across multiple locations in one reserve?

No, each reserve applies to a single location. To reserve inventory across multiple locations, create separate reserve records for each location.

### What happens if inventory drops below the reserved quantity?

The system validates reserves when created and modified. However, if inventory decreases after creation (due to sales, adjustments, etc.), the reserve remains active. This can result in negative availability calculations, alerting you to the shortage.

### Can I reserve partial quantities from inventory?

Yes, you can reserve any quantity from 1 up to the available inventory. Multiple reserves can exist for the same item, and you don't need to reserve all available inventory.

### Do reserves create actual Business Central reservations?

No, Availability Reserves are separate from Business Central's standard Reservation system. They only affect availability calculations, not actual inventory reservations or allocations.

### Who can see my reserves?

All users with permission to view the Availability Reserves page can see all reserves. There's no per-user or per-department filtering. Use the Comment field if you need to note ownership or responsibility.

### What's the difference between a reserve and a sales order?

| Feature | Availability Reserve | Sales Order |
|---------|---------------------|-------------|
| Purpose | Temporary hold | Customer commitment |
| Inventory | No movement | Reserved when posted |
| Financial | No impact | Creates receivables |
| Automatic Release | Yes (on date) | No |
| Customer Link | None | Linked to customer |
| Best For | Planning, holds | Actual sales |

### Can I create reserves for items with no inventory?

No, the system validates that you can only reserve up to the available inventory quantity. If there's no inventory at the selected location, you cannot create a reserve.

### How do I report on reserves?

Currently, use the Availability Reserves list page with filters and views. You can:

- Filter by Item No., Location Code, Release at Date, Reason Code
- Export to Excel for reporting
- Sort by Created Date Time to see recent reserves
- Filter by Created By to see who created reserves

### Do reserves affect cost calculations or financial reports?

No, reserves are purely for availability planning. They don't affect inventory valuation, cost of goods sold, or any financial calculations.

---

## Related Resources

### Related Documentation

- [Availability System User Guide](availability-user-guide.md) - Understanding the availability calculation system
- [Availability Troubleshooting Guide](availability-troubleshooting-guide.md) - Diagnosing availability calculation issues

### Related Pages in Business Central

- **Item Card** - Main item management
- **Availability Forecast** - View availability over time with reserves applied
- **Sales Speed Entry** - Order entry with availability visibility
- **Clesen Setup** - Enable/disable the reserves feature

### Setup and Administration

Contact your system administrator to:

- Enable or disable the Availability Reserves feature
- Configure Reason Codes for reserve categorization
- Set up user permissions for reserve management

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-05 | Initial documentation created |

---

> **Need Help?** Contact your system administrator or IT support team for assistance with Availability Reserves.

---

## Related documents

- [[availability-user-guide]]
- [[availability-troubleshooting-guide]]
