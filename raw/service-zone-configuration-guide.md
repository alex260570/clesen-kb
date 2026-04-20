# Service Zone Configuration Guide

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Audience:** Operations Managers and Shipping Managers

## Table of Contents

- [Overview](#overview)
- [Service Zone Fundamentals](#service-zone-fundamentals)
- [Creating and Configuring Service Zones](#creating-and-configuring-service-zones)
- [Mapping Customers to Service Zones](#mapping-customers-to-service-zones)
- [Shipping Day Configuration](#shipping-day-configuration)
- [Shipment Method Integration](#shipment-method-integration)
- [How Service Zones Affect Sales Orders](#how-service-zones-affect-sales-orders)
- [How Service Zones Affect Shipping Worksheet](#how-service-zones-affect-shipping-worksheet)
- [Shipping Calendar and Holidays](#shipping-calendar-and-holidays)
- [Configuration Scenarios](#configuration-scenarios)
- [Testing Your Configuration](#testing-your-configuration)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Related Guides](#related-guides)
- [SOP Document](#sop-document)

---

## Overview

Service Zones provide geographic-based delivery scheduling control for the Clesen Horticulture extension. They define **which days of the week** customers in specific geographic areas can receive deliveries, ensuring efficient route planning and preventing invalid shipment dates from being entered on sales orders.

### What Service Zones Control

- **Available shipping days by geographic zone** — Monday through Saturday delivery schedule
- **Automatic shipment date validation** — System prevents invalid dates on sales orders
- **Customer-specific delivery windows** — Different zones support different delivery schedules
- **Shipping method compatibility** — Integration with shipment method scheduling
- **Route optimization support** — Feeds into OptimoRoute worksheet planning

### Key Benefits

- ✅ **Prevent scheduling errors** — Invalid shipment dates are caught immediately
- ✅ **Optimize delivery routes** — Group customers by geography and available days
- ✅ **Improve customer service** — Clear expectations for delivery availability
- ✅ **Reduce manual corrections** — Automated validation reduces order entry time
- ✅ **Support webshop integration** — Automatic adjustment of non-compliant web orders

### Prerequisites

- Access to **Service Zones** page (search for "Service Zones")
- Understanding of your delivery territory and route structure
- Knowledge of which days specific routes run
- Authorization to modify customer master data

---

## Service Zone Fundamentals

### What Is a Service Zone?

A **Service Zone** is a Business Central standard table that has been extended by Clesen Horticulture to include **day-of-week delivery flags**. The standard `Service Zone Code` field on customers and ship-to addresses is used to link customers to their zone's shipping schedule.

### Service Zone Components

Each service zone consists of:

| Component | Description | Usage |
|-----------|-------------|-------|
| **Code** | Unique identifier (e.g., "NORTH", "METRO-EAST") | Referenced on Customer and Ship-to Address records |
| **Description** | Human-readable name (e.g., "North Chicago & Suburbs") | Displayed in user interfaces |
| **Shipping Days** | Monday through Saturday checkboxes | Defines which days this zone receives deliveries |
| **Upon Request** | Special flag (not currently in use) | Reserved for future expansion |

### How Service Zones Integrate

```text
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

---

## Creating and Configuring Service Zones

### Step 1: Access Service Zones

1. Use the search function (Alt+Q) and type **"Service Zones"**
2. Click **Service Zones** to open the list page
3. You will see existing zones (if any) with standard BC fields

### Step 2: Create a New Service Zone

1. Click **+ New** to create a new service zone
2. Fill in the required fields:

   **Essential Fields:**
   - **Code** - Short identifier (10 characters max)
     - Examples: `NORTH`, `SOUTH`, `METRO-W`, `RURAL-1`
     - Use consistent naming convention across zones
   - **Description** - Full name of the zone
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
| `Upon Request` | Special handling flag | ⚠️ Not currently active in validation logic |

> **Important:** You **must check at least one day** for the zone to be functional. A service zone with no days checked will block all shipments for that customer.

### Step 4: Save and Verify

1. Close the Service Zone card to save changes
2. Verify the zone appears in the Service Zones list
3. Note the zone code for customer assignment

---

## Mapping Customers to Service Zones

### Customer-Level Assignment

Service zones are assigned at the **Customer** level using standard Business Central functionality.

#### To Assign a Service Zone to a Customer

1. Open the **Customer Card** (search for the customer or navigate from Customer List)
2. Navigate to the **Shipping** FastTab
3. Locate the `Service Zone Code` field
4. Click the lookup (dropdown) and select the appropriate zone code
5. Click **OK** to save

**The customer's primary shipping address will now follow this zone's delivery schedule.**

### Ship-To Address Assignment

For customers with **multiple ship-to addresses**, you can assign different service zones to each address.

#### To Assign a Service Zone to a Ship-To Address

1. From the **Customer Card**, click **Navigate → Ship-to Addresses**
2. Select the ship-to address you want to configure
3. Open the **Ship-to Address** card
4. Locate the `Service Zone Code` field
5. Select the appropriate zone for this address
6. Save and close

> **Priority Logic:** When a sales order uses a specific Ship-to Code, the system checks the **Ship-to Address service zone first**. If not found, it falls back to the **Customer service zone**.

### Coverage Planning

When assigning service zones, consider:

- **Geographic proximity** — Group customers by delivery route
- **Delivery frequency** — Align zones with actual route schedules
- **Customer expectations** — Ensure zones match promised delivery windows
- **Route capacity** — Balance customer distribution across available days

---

## Shipping Day Configuration

### Understanding Day-of-Week Validation

When a user enters or changes a **Shipment Date** on a sales order, the system:

1. Determines the day of the week for the requested date (e.g., "Wednesday")
2. Retrieves the customer's service zone (from customer or ship-to address)
3. Checks if the corresponding day checkbox is enabled on the service zone
4. If **not enabled**, prevents the date and suggests the next available day

### Multi-Day Service Zones

You can enable **multiple days** for zones that receive deliveries more than once per week.

**Example:** Metro area with Tuesday and Thursday routes

```text
Service Zone: METRO-CENTRAL
Description: Central Metro - High Volume
☑ Monday: No
☑ Tuesday: Yes ✓
☑ Wednesday: No
☑ Thursday: Yes ✓
☑ Friday: No
☑ Saturday: No
```

This configuration allows customers in `METRO-CENTRAL` to receive shipments on **either Tuesday or Thursday**. If a user selects Wednesday, the system will suggest Thursday (the next available day).

### Single-Day Service Zones

For **once-per-week** delivery routes, enable only one day.

**Example:** Rural area with Monday-only deliveries

```text
Service Zone: RURAL-NORTH
Description: Northern Rural Area
☑ Monday: Yes ✓
☑ Tuesday: No
☑ Wednesday: No
☑ Thursday: No
☑ Friday: No
☑ Saturday: No
```

Customers in `RURAL-NORTH` can **only ship on Mondays**. Any other day will be rejected and Monday will be suggested.

### Weekend and Special Schedules

Saturday deliveries can be configured for special zones:

```text
Service Zone: PREMIUM-SAT
Description: Premium Saturday Service
☑ Monday: No
☑ Tuesday: No
☑ Wednesday: No
☑ Thursday: No
☑ Friday: No
☑ Saturday: Yes ✓
```

> **Note:** Sunday deliveries are **not supported** by the Clesen Horticulture extension. The system automatically blocks Sunday shipments regardless of service zone configuration.

---

## Shipment Method Integration

### Shipment Method Scheduling Flag

Service zone validation **only applies** to shipment methods that have the **"Incl. in Shipping Schedule"** flag enabled.

#### To Configure Shipment Methods for Validation

1. Search for **"Shipment Methods"** and open the list
2. Select the shipment method you want to configure (e.g., "OWN TRUCK")
3. Open the **Shipment Method** card
4. Locate the Clesen Horticulture fields section:
   - **`CLE Incl. in Shipping Schedule`** — Check this box to enable service zone validation
5. Save and close

### When to Enable Service Zone Validation

| Shipment Method | Enable Validation? | Reason |
|-----------------|-------------------|--------|
| Own Truck | ✅ Yes | Runs on fixed routes and schedules |
| Scheduled Delivery | ✅ Yes | Follows zone-based routing |
| Common Carrier | ❌ No | Carrier handles scheduling, no route control |
| Customer Pickup | ❌ No | Customer decides when to pick up |
| Emergency Delivery | ❌ No | Override normal scheduling rules |
| UPS/FedEx | ❌ No | National carrier with daily service |

> **Important:** If a shipment method does **not** have "Incl. in Shipping Schedule" enabled, service zones are **ignored** for that order. Users can select any shipment date.

### Configuration Workflow

```text
1. Define Delivery Routes (Physical Planning)
       ↓
2. Create Service Zones (by Geographic Area)
       ↓
3. Configure Shipping Days (per Zone)
       ↓
4. Enable "Incl. in Shipping Schedule" on Shipment Methods
       ↓
5. Assign Service Zones to Customers
       ↓
6. Test with Sample Sales Orders
```

---

## How Service Zones Affect Sales Orders

### Validation During Order Entry

Service zone validation occurs at **multiple points** during sales order processing:

#### 1. Shipment Date Entry/Change

**Trigger:** User enters or modifies `Shipment Date` on sales header

**Validation Process:**
1. System retrieves customer's service zone
2. Determines day of week for requested date
3. Checks if that day is enabled on service zone
4. If invalid:
   - Displays confirmation dialog: *"You cannot ship to this customer on [Date]. The next available date would be [Proposed Date]. Do you want to change it to that date?"*
   - User can accept the proposed date or cancel and select a different date manually

#### 2. Shipment Method Change

**Trigger:** User changes `Shipment Method Code` on sales header

**Validation Process:**
1. Re-validates current shipment date against service zone
2. If the **new** shipment method has "Incl. in Shipping Schedule" enabled:
   - Checks if current shipment date is valid for the zone
   - If not, prompts to change date or cancel the shipment method change
3. If the **new** shipment method does **not** have scheduling enabled:
   - Allows any shipment date (no validation)

#### 3. Ship-To Code Change

**Trigger:** User selects a different ship-to address on sales order

**Validation Process:**
1. Retrieves service zone from the new ship-to address
2. Re-validates current shipment date
3. Prompts if the current date is not available for the new ship-to zone

### Authorization Override

Users in the **"ShipDate Override Auth"** authorization group (configured in **Clesen Setup**) can **bypass service zone validation** entirely. This is for supervisors who need to schedule emergency or special deliveries.

#### To Configure Override Authorization

1. Open **Clesen Setup** (search "Clesen Setup")
2. Locate **Activate Shipment Date Protection** — must be enabled
3. Set **ShipDate Override Auth New** to an authorization group
4. Add authorized users to that authorization group

> **Note:** If "Activate Shipment Date Protection" is **disabled**, service zone validation is **turned off globally** and all users can select any date.

### Webshop Integration

For orders created via **webshop integration** (SOAP/API):

- The system **automatically adjusts** non-compliant shipment dates
- Sets **`CLE Web ShipDate Not compliant`** = `true` on the sales header
- Stores the original requested date in **`CLE Web Req. Shipment Date`**
- Changes **`Shipment Date`** to the next available date per service zone
- Creates a notification for review

**No user prompt occurs for webshop orders** — the system adjusts silently and flags for follow-up.

---

## How Service Zones Affect Shipping Worksheet

### Worksheet Generation

Service zones **do not prevent orders from appearing** on the Shipping Worksheet. However, service zone validation ensures that only **valid shipment dates** are on orders in the first place.

### Grouping Logic

The Shipping Worksheet groups orders by:
- Shipment Date
- Customer No.
- Ship-To Code (or full address if manually overridden)
- Shipment Method Code
- Document Type

**Service zones do not directly affect grouping**, but because service zones enforce consistent shipment dates for customers in the same zone, they **indirectly improve grouping** by ensuring customers on the same route ship on the same day.

### OptimoRoute Export

Only orders with shipment methods that have **"Include in OptimoRoute"** enabled appear in the export. This is a **separate flag** from "Incl. in Shipping Schedule":

| Flag | Purpose | Location |
|------|---------|---------|
| `CLE Incl. in Shipping Schedule` | Enable service zone validation | Shipment Method card |
| `Include in OptimoRoute` | Include in routing worksheet export | Shipment Method card (standard BC field) |

Most shipment methods that use service zones **should also** be included in OptimoRoute, but these are **independent settings**.

---

## Shipping Calendar and Holidays

### Global Shipping Calendar

The **Shipping Calendar** (configured in **Clesen Setup**) defines **company-wide non-working days** such as holidays. Service zones work **in conjunction** with the shipping calendar:

1. **Service zone validation runs first** — checks if the day of the week is available
2. **Shipping calendar validation runs second** — checks if the specific date is a holiday

**Example:**
- Service Zone `NORTH` allows Tuesday deliveries
- Shipment date selected: Tuesday, December 25, 2026
- Service zone check: ✅ Pass (Tuesday is enabled)
- Shipping calendar check: ❌ Fail (Christmas is a holiday)
- Result: Date is rejected and next working Tuesday is proposed

### Configuring the Shipping Calendar

1. Open **Clesen Setup** (search "Clesen Setup")
2. Locate **Shipping Calendar Code**
3. Select or create a **Base Calendar** for shipping days
4. Navigate to **Base Calendar Changes** to define:
   - Holidays (Christmas, New Year, etc.)
   - Non-working days (e.g., closure for maintenance)
   - Special working days (e.g., Saturday special deliveries)

### Integration with Service Zones

```text
User Selects Date
      ↓
Day-of-Week Check (Service Zone)
      ↓
   Pass? → No → Suggest Next Valid Day of Week
      ↓
    Yes
      ↓
Specific Date Check (Shipping Calendar)
      ↓
   Pass? → No → Suggest Next Non-Holiday Date
      ↓
    Yes
      ↓
Date Accepted
```

---

## Configuration Scenarios

### Scenario 1: Simple Five-Zone Weekday Delivery

**Business Need:** Five delivery routes, Monday through Friday, each serving a distinct geographic area.

**Configuration:**

| Zone Code | Description | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
|-----------|-------------|--------|---------|-----------|----------|--------|----------|
| MON-ROUTE | Monday Route Customers | ✓ | | | | | |
| TUE-ROUTE | Tuesday Route Customers | | ✓ | | | | |
| WED-ROUTE | Wednesday Route Customers | | | ✓ | | | |
| THU-ROUTE | Thursday Route Customers | | | | ✓ | | |
| FRI-ROUTE | Friday Route Customers | | | | | ✓ | |

**Shipment Method Configuration:**
- `OWN TRUCK` → `CLE Incl. in Shipping Schedule` = ✓ Enabled

**Customer Assignment:**
- Assign each customer to the zone matching their route day
- All customers using `OWN TRUCK` will be validated against their zone

---

### Scenario 2: High-Volume Zone with Multiple Days

**Business Need:** Metro area receives deliveries on Tuesday, Thursday, and Saturday due to high order volume.

**Configuration:**

| Zone Code | Description | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
|-----------|-------------|--------|---------|-----------|----------|--------|----------|
| METRO-HV | Metro High Volume | | ✓ | | ✓ | | ✓ |

**Shipment Method Configuration:**
- `OWN TRUCK` → `CLE Incl. in Shipping Schedule` = ✓ Enabled

**Customer Assignment:**
- All metro-area customers assigned to `METRO-HV`
- Users can select Tuesday, Thursday, **or** Saturday
- System suggests the **nearest** available day if a non-delivery day is selected

---

### Scenario 3: Mixed Delivery Methods per Customer

**Business Need:** Customers can choose between own-truck delivery (scheduled) and customer pickup (any day).

**Configuration:**

Service Zone: `NORTH`
- Monday: ✓ Enabled
- Tuesday: Disabled
- (Other days as needed)

**Shipment Method Configuration:**
- `OWN TRUCK` → `CLE Incl. in Shipping Schedule` = ✓ Enabled
- `CUSTOMER PICKUP` → `CLE Incl. in Shipping Schedule` = ❌ Disabled

**Result:**
- Orders with `OWN TRUCK` → Validated against service zone (Monday only in this example)
- Orders with `CUSTOMER PICKUP` → No validation, any date allowed

---

### Scenario 4: Rural Once-Per-Week Delivery

**Business Need:** Rural customers receive delivery once per week on Wednesdays.

**Configuration:**

| Zone Code | Description | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
|-----------|-------------|--------|---------|-----------|----------|--------|----------|
| RURAL-W | Rural Wednesday | | | ✓ | | | |

**Shipment Method Configuration:**
- `OWN TRUCK` → `CLE Incl. in Shipping Schedule` = ✓ Enabled

**Customer Assignment:**
- All rural customers on this route assigned to `RURAL-W`
- **Only Wednesday shipments allowed**
- Any other day selected will propose the following Wednesday

---

### Scenario 5: Premium Saturday Service

**Business Need:** Premium customers can request Saturday delivery for urgent orders.

**Configuration:**

| Zone Code | Description | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday |
|-----------|-------------|--------|---------|-----------|----------|--------|----------|
| PREMIUM-SAT | Premium Saturday | | | | | | ✓ |
| STANDARD | Standard Weekday | ✓ | ✓ | ✓ | ✓ | ✓ | |

**Shipment Method Configuration:**
- `SATURDAY DELIVERY` → `CLE Incl. in Shipping Schedule` = ✓ Enabled
- `STANDARD DELIVERY` → `CLE Incl. in Shipping Schedule` = ✓ Enabled

**Customer Assignment:**
- Premium customers assigned to `PREMIUM-SAT`
- Standard customers assigned to `STANDARD`

**Order Processing:**
- Premium customers using `SATURDAY DELIVERY` can only ship Saturday
- Premium customers using `STANDARD DELIVERY` follow weekday schedule
- Standard customers cannot use `SATURDAY DELIVERY` shipment method (controlled via setup)

---

## Testing Your Configuration

### Pre-Go-Live Testing Checklist

Before rolling out service zone configuration to production, validate the following scenarios:

#### Test 1: Valid Day Selection

**Setup:**
- Service Zone: `TEST-ZONE` with Tuesday enabled
- Customer: Assigned to `TEST-ZONE`
- Shipment Method: `OWN TRUCK` with scheduling enabled

**Test Steps:**
1. Create a new sales order for the test customer
2. Select **Shipment Date = next Tuesday**
3. **Expected Result:** Date accepted without prompt

✅ **Pass Criteria:** No validation message appears

---

#### Test 2: Invalid Day Selection

**Setup:**
- Same as Test 1

**Test Steps:**
1. Create a new sales order for the test customer
2. Select **Shipment Date = next Wednesday** (not enabled on zone)
3. **Expected Result:** Confirmation dialog appears:
   - *"You cannot ship to this customer on [Wednesday Date]. The next available date would be [Next Tuesday]. Do you want to change it to that date?"*
4. Click **Yes**
5. **Expected Result:** Date changes to next Tuesday

✅ **Pass Criteria:** Correct date proposed and applied on confirmation

---

#### Test 3: Shipment Method Without Validation

**Setup:**
- Customer assigned to `TEST-ZONE` (Tuesday only)
- Shipment Method: `CUSTOMER PICKUP` (validation **disabled**)

**Test Steps:**
1. Create a sales order with `CUSTOMER PICKUP` shipment method
2. Select **Shipment Date = any day (even non-Tuesday)**
3. **Expected Result:** Date accepted without validation

✅ **Pass Criteria:** No validation occurs for this shipment method

---

#### Test 4: Ship-To Address Override

**Setup:**
- Customer primary zone: `NORTH` (Monday only)
- Ship-To Address: Assigned to `SOUTH` (Wednesday only)

**Test Steps:**
1. Create a sales order for the customer
2. Select the ship-to address with `SOUTH` zone
3. Select **Shipment Date = next Wednesday**
4. **Expected Result:** Date accepted (uses ship-to zone, not customer zone)
5. Now select **Shipment Date = next Monday**
6. **Expected Result:** Validation error, Wednesday proposed

✅ **Pass Criteria:** Ship-to zone takes priority over customer zone

---

#### Test 5: Holiday Blocking

**Setup:**
- Service Zone: Tuesday enabled
- Shipping Calendar: Next Tuesday marked as holiday

**Test Steps:**
1. Create sales order for customer in zone
2. Select **Shipment Date = next Tuesday** (the holiday)
3. **Expected Result:** Date rejected despite being a valid zone day
4. **Proposed Date:** Following Tuesday (first non-holiday Tuesday)

✅ **Pass Criteria:** Shipping calendar holiday blocks service zone valid day

---

### Testing Documentation

Record test results using this template:

```text
Test Date: _______________
Tester: _______________
Zone Tested: _______________
Test Scenario: _______________
Expected Result: _______________
Actual Result: _______________
Pass/Fail: _______________
Notes: _______________
```

---

## Troubleshooting

### Problem: Customer Can Select Any Date (No Validation)

**Possible Causes:**

1. **Shipment Method not configured for validation**
   - **Solution:** Open Shipment Method card → Enable `CLE Incl. in Shipping Schedule`

2. **Customer has no service zone assigned**
   - **Solution:** Open Customer card → Shipping FastTab → Assign `Service Zone Code`

3. **Global validation disabled**
   - **Solution:** Open Clesen Setup → Enable `Activate Shipment Date Protection`

4. **User has override authorization**
   - **Solution:** Verify user is not in the "ShipDate Override Auth" authorization group

---

### Problem: Wrong Date Proposed by System

**Possible Causes:**

1. **Service zone days configured incorrectly**
   - **Solution:** Open Service Zone → Verify correct days are checked

2. **Shipping calendar blocking valid days**
   - **Solution:** Check Shipping Calendar for unexpected holidays or non-working days

3. **Date calculation logic finding next occurrence**
   - **Expected Behavior:** System always proposes the **next** occurrence of a valid day
   - **Example:** If Tuesday is valid and user selects Thursday, system proposes **next Tuesday**, not the previous Tuesday

---

### Problem: Ship-To Address Validation Not Working

**Possible Causes:**

1. **Service zone not assigned to ship-to address**
   - **Solution:** Navigate to Ship-to Address card → Assign `Service Zone Code`

2. **Customer zone used instead**
   - **Expected Behavior:** If ship-to address has no zone, system falls back to customer zone

---

### Problem: Webshop Orders Bypass Validation

**Expected Behavior:**

Webshop orders (API/SOAP created) **automatically adjust** invalid dates without user prompt. This is intentional to prevent API integration failures.

**Verification:**
- Check sales order header for `CLE Web ShipDate Not compliant` = `true`
- Review `CLE Web Req. Shipment Date` for original requested date
- `Shipment Date` will contain the automatically adjusted valid date

**Action Required:**
- Follow up with customer if the adjusted date is significantly later than requested

---

### Problem: Cannot Save Service Zone (Error on Save)

**Possible Causes:**

1. **Code field left blank**
   - **Solution:** Enter a unique code (required field)

2. **Code already exists**
   - **Solution:** Use a different code or edit the existing zone

3. **No shipping days checked**
   - **Not an error:** System allows zones with no days, but they will block all shipments
   - **Recommendation:** Check at least one day

---

### Problem: All Orders Show Same Service Zone in Worksheet

**Expected Behavior:**

The Shipping Worksheet does **not display service zone information**. It groups by shipment date, customer, and address. Service zones affect **when orders can be created**, not how they appear in the worksheet.

---

## Best Practices

### Design Principles

1. **Align zones with physical routes**
   - Map service zones to actual delivery routes for operational efficiency
   - Zone boundaries should match driver territories

2. **Use consistent naming conventions**
   - Example: `MON-NORTH`, `TUE-NORTH` for day-based zones
   - Example: `METRO-1`, `METRO-2` for area-based zones

3. **Plan for growth**
   - Reserve zone codes for future expansion (e.g., `NORTH-1`, `NORTH-2`)
   - Document zone coverage in external reference materials

4. **Balance zone size**
   - Avoid creating too many single-customer zones (hard to maintain)
   - Avoid zones with hundreds of customers (inflexible scheduling)

### Operational Recommendations

5. **Review zones quarterly**
   - Adjust service zones as routes change
   - Re-assign customers who have moved or whose delivery patterns changed

6. **Document exceptions**
   - Track customers who require special scheduling outside their zone
   - Use authorization overrides sparingly and document reasons

7. **Train users thoroughly**
   - Ensure sales order entry staff understand validation prompts
   - Provide clear escalation path for date override requests

8. **Monitor webshop integration**
   - Review flagged web orders regularly (where `CLE Web ShipDate Not compliant` = true)
   - Communicate adjusted dates back to customers promptly

### Configuration Standards

9. **Enable validation on own-truck methods only**
   - Common carriers and customer pickup should bypass service zone validation
   - Document which shipment methods use validation

10. **Synchronize service zones with shipping calendar**
    - Ensure holidays are marked on the shipping calendar
    - Test service zone validation after adding new holidays

11. **Use ship-to zones for exceptions**
    - Assign primary service zone at customer level
    - Override with ship-to zones only when truly necessary (e.g., customer has locations in multiple zones)

12. **Test before production rollout**
    - Validate all service zone configurations with sample sales orders
    - Test each shipment method and zone combination

---

## Related Guides

- [Shipping Worksheet (Routing Worksheet) - Manager's Guide](shipping-worksheet-overview.md)
- [Shipping Worksheet - Staff Guide](../staff/shipping-worksheet-process.md)
- Sales Order Management User Guide (see sales documentation)

---

## SOP Document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/service-zone-configuration-guide.pdf)

---

**Document Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-03-17 | Taylor Docs | Initial comprehensive guide |

---

*For questions about service zone configuration, contact your Operations Manager or IT Support.*
