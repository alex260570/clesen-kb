---
title: Service Zone Configuration
type: howto
tags: [warehouse, shipping, route-planning, configuration]
created: 2026-04-21
updated: 2026-04-21
sources: [service-zone-configuration-guide.md]
---

# Service Zone Configuration

Defining geographic service zones with delivery day schedules for shipping validation.

## Overview

**Purpose:** Define geographic-based delivery schedules to control which days of the week customers in specific areas can receive deliveries

**What Service Zones Control:**
- **Available shipping days by geographic zone** — Monday through Saturday delivery schedule
- **Automatic shipment date validation** — System prevents invalid dates on sales orders
- **Customer-specific delivery windows** — Different zones support different delivery schedules
- **Shipping method compatibility** — Integration with shipment method scheduling
- **Route optimization support** — Feeds into OptimoRoute worksheet planning

**Key Benefits:**
- ✅ **Prevent scheduling errors** — Invalid shipment dates are caught immediately
- ✅ **Optimize delivery routes** — Group customers by geography and available days
- ✅ **Improve customer service** — Clear expectations for delivery availability
- ✅ **Reduce manual corrections** — Automated validation reduces order entry time
- ✅ **Support webshop integration** — Automatic adjustment of non-compliant web orders

## Service Zone Fundamentals

### What Is a Service Zone?

A **Service Zone** is a Business Central standard table that has been extended by Clesen Horticulture to include **day-of-week delivery flags**. The standard `Service Zone Code` field on customers and ship-to addresses is used to link customers to their zone's shipping schedule.

### Service Zone Components

Each service zone consists of:

| Component | Description | Usage |
|-----------|-------------|-------|
| **Code** | Unique identifier | Referenced on Customer and Ship-to Address records |
| **Description** | Human-readable name | Displayed in user interfaces |
| **Shipping Days** | Monday through Saturday checkboxes | Defines which days this zone receives deliveries |
| **Upon Request** | Special flag | Reserved for future expansion |

### How Service Zones Integrate

```
Customer Record
      ↓
Service Zone Code → Service Zone Definition
      ↓                     ↓
Sales Order Entry    Shipping Days (Mon-Sat)
      ↓                     ↓
Shipment Date   →   Validation Check
      ↓                     ↓
Shipping Worksheet ← Route Planning
```

## Creating and Configuring Service Zones

### Step 1: Access Service Zones

1. Use the search function (Alt+Q) and type **"Service Zones"**
2. Click **Service Zones** to open the list page
3. You will see existing zones (if any) with standard BC fields

### Step 2: Create a New Service Zone

1. Click **+ New** to create a new service zone
2. Fill in the required fields:

   **Essential Fields:**
   - **Code** — Short identifier (10 characters max)
     - Examples: `NORTH`, `SOUTH`, `METRO-W`, `RURAL-1`
     - Use consistent naming convention across zones
   - **Description** — Full name of the zone
     - Examples: "North Chicago & Suburbs", "Downtown Metro West"

3. Click into the repeater area to save the header

### Step 3: Configure Shipping Days

In the Clesen Horticulture fields section, check the days when this zone receives deliveries:

| Field | Purpose | Example |
|-------|---------|---------|
| `Monday` | Enable Monday deliveries | ✓ Checked for zones on Monday routes |
| `Tuesday` | Enable Tuesday deliveries | ✓ Checked for zones on Tuesday routes |
| `Wednesday` | Enable Wednesday deliveries | ✓ Checked for zones on Wednesday routes |
| `Thursday` | Enable Thursday deliveries | ✓ Checked for zones on Thursday routes |
| `Friday` | Enable Friday deliveries | ✓ Checked for zones on Friday routes |
| `Saturday` | Enable Saturday deliveries | ✓ Checked for Saturday delivery zones |
| `Upon Request` | Special handling flag | ⚠️ Not currently active |

**⚠️ IMPORTANT:** You **must check at least one day** for the zone to be functional. A service zone with no days checked will block all shipments for that customer.

### Step 4: Save and Verify

1. Close the Service Zone card to save changes
2. Verify the zone appears in the Service Zones list
3. Note the zone code for customer assignment

## Mapping Customers to Service Zones

### Customer-Level Assignment

Service zones are assigned at the **Customer** level using standard Business Central functionality.

**To Assign a Service Zone to a Customer:**

1. Open the **Customer Card** (search for the customer)
2. Navigate to the **Shipping** FastTab
3. Locate the `Service Zone Code` field
4. Click the lookup (dropdown) and select the appropriate zone code
5. Click **OK** to save

**The customer's primary shipping address will now follow this zone's delivery schedule.**

### Ship-To Address Assignment

For customers with **multiple ship-to addresses**, you can assign different service zones to each address.

**To Assign a Service Zone to a Ship-To Address:**

1. From the **Customer Card**, click **Navigate → Ship-to Addresses**
2. Select the ship-to address you want to configure
3. Open the **Ship-to Address** card
4. Locate the `Service Zone Code` field
5. Select the appropriate zone for this address
6. Save and close

**Priority Logic:** When a sales order uses a specific Ship-to Code, the system checks the **Ship-to Address service zone first**. If not found, it falls back to the **Customer service zone**.

### Coverage Planning

When assigning service zones, consider:

- **Geographic proximity** — Group customers by delivery route
- **Delivery frequency** — Align zones with actual route schedules
- **Customer expectations** — Ensure zones match promised delivery windows
- **Route capacity** — Balance customer distribution across available days

## Shipping Day Validation

### Understanding Day-of-Week Validation

When a user enters or changes a **Shipment Date** on a sales order, the system:

1. Determines the day of the week for the requested date (e.g., "Wednesday")
2. Retrieves the customer's service zone (from customer or ship-to address)
3. Checks if the corresponding day checkbox is enabled on the service zone
4. If **not enabled**, prevents the date and suggests the next available day

### Multi-Day Service Zones

You can enable **multiple days** for zones that receive deliveries more than once per week.

**Example:** Metro area with Tuesday and Thursday routes

```
Service Zone: METRO-CENTRAL
Description: Central Metro - High Volume
☐ Monday: No
☑ Tuesday: Yes ✓
☐ Wednesday: No
☑ Thursday: Yes ✓
☐ Friday: No
☐ Saturday: No
```

**Result:** Customers in this zone can only ship on Tuesday or Thursday. Requesting Monday, Wednesday, Friday, or Saturday will be rejected.

### Single-Day Service Zones

**Example:** Rural area with Friday-only delivery

```
Service Zone: RURAL-SOUTH
Description: Southern Rural Areas
☐ Monday-Thursday: No
☑ Friday: Yes ✓
☐ Saturday: No
```

**Result:** Customers can only ship Friday. All other days blocked.

## Configuration Scenarios

### Scenario 1: Regional Multi-Day Zone

**Situation:** Chicago metro area with Monday, Wednesday, Friday deliveries

**Configuration:**
1. Create zone code: `CHICAGO-METRO`
2. Check **Monday**, **Wednesday**, **Friday**
3. Leave other days unchecked
4. Assign to 50+ customers in Chicago area
5. Result: Sales order dates validate against these 3 days

### Scenario 2: Rural Single-Day Zone

**Situation:** Rural accounts 200+ miles away, only ship Thursday

**Configuration:**
1. Create zone code: `RURAL-FAR`
2. Check **Thursday** only
3. Assign to 10-15 remote customers
4. Result: All shipments must be Thursday; other dates blocked

### Scenario 3: Premium Customer With Flexible Scheduling

**Situation:** VIP customer gets Monday or Friday delivery

**Configuration:**
1. Create zone code: `PREMIUM-FLEX`
2. Check **Monday** and **Friday**
3. Assign to 3-5 high-volume customers
4. Result: These customers can choose either day

## Best Practices

✅ **DO:**
- Group geographically similar customers into zones
- Align zones with actual delivery routes
- Use consistent zone naming (REGION-TYPE pattern)
- Assign all customers to a service zone
- Test zone configurations before going live
- Review and adjust zones quarterly based on route changes
- Document which routes serve which zones
- Enable at least one day per zone

❌ **DON'T:**
- Create zones with no days enabled (blocks all shipments)
- Assign customers to wrong zones (damages customer relationships)
- Change zones without confirming delivery capability
- Create excessive zones (simplify to ~5-10)
- Leave customers without zone assignment
- Ignore validation errors (fix shipment dates properly)
- Enable days that aren't actually serviced (creates fulfillment failures)

## Testing Your Configuration

### Test Case 1: Valid Shipment Date

1. Assign customer to METRO-CENTRAL zone (Tue/Thu)
2. Create sales order with Shipment Date = Tuesday
3. **Expected:** Date accepted, no error

### Test Case 2: Invalid Shipment Date

1. Assign customer to METRO-CENTRAL zone (Tue/Thu)
2. Create sales order with Shipment Date = Monday
3. **Expected:** Error message, suggestion to use Tuesday

### Test Case 3: Multiple Ship-To Addresses

1. Customer has 2 ship-to addresses
2. Ship-to #1 = CHICAGO-METRO (Mon/Wed/Fri)
3. Ship-to #2 = DALLAS-ZONE (Tue/Thu)
4. Create order to #1 with Friday date
5. **Expected:** Accepted
6. Create order to #2 with Friday date
7. **Expected:** Rejected, suggest Tuesday or Thursday

## Troubleshooting

### Issue: Shipment Date Always Rejected

**Cause:** Service zone has no days enabled OR customer not assigned to zone

**Solution:**
1. Check customer's service zone code
2. If blank, assign appropriate zone
3. If assigned, open the zone and verify days are checked
4. Check at least one day and save

### Issue: Customer Can't Ship on Day They Need

**Cause:** Zone doesn't include that day in configuration

**Solution:**
1. Verify actual delivery route for that day
2. If route exists, edit zone and enable that day
3. Test configuration
4. Communicate new available day to customer

### Issue: Webshop Orders Have Invalid Dates

**Cause:** Webshop system doesn't validate against service zones

**Solution:**
1. Verify `AddServiceZoneValidation` is enabled for webshop
2. Check zone assignments are current
3. Consider automatic date adjustment in webshop if offered
4. Monitor and manually correct as needed

## Related Pages

- [[bin-management]] — Moving inventory between bins
- [[cart-exchange]] — Container tracking
- [[shipping-worksheet-overview]] — Shipping route planning
