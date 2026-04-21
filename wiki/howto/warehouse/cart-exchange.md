---
title: Cart Exchange — Container Tracking
type: howto
tags: [warehouse, shipping, container-management, customer-service]
created: 2026-04-21
updated: 2026-04-21
sources: [cart-exchange-process-guide.md]
---

# Cart Exchange — Container Tracking

Tracking reusable containers (carts, bins, trays) exchanged with customers during shipments.

## Overview

**Purpose:** Track reusable containers exchanged with customers to ensure accountability, prevent loss, and support billing for unreturned containers

**Key Features:**
- **Container accountability:** Track all carts and bins checked out to customers
- **Billing accuracy:** Bill customers for unreturned containers or overdue returns
- **Inventory management:** Ensure adequate carts are available for ongoing operations
- **Customer service:** Monitor return status and contact customers about overdue containers
- **Cost control:** Identify lost or damaged containers that need replacement

## Understanding Cart Exchange Models

| Model | Description | Example |
|-------|-------------|---------|
| **Exchange on Delivery** | Customer returns empty cart when receiving full shipment | Deliver 50 plants in cart, customer returns empty cart |
| **Swap Program** | Maintain equal number of carts at customer location | Customer holds 10 carts; when we deliver 5, they return 5 |
| **Deposit** | Customer holds cart until scheduled return date | Deliver in reusable cart, customer returns on date X |
| **Free Trial** | Customer holds container for limited time free | Give new customer 1 demo cart; they return after trying |
| **Loan** | Long-term container loan for regular customers | Customer may hold cart indefinitely; we track for reconciliation |

## Standard Cart Types

Common container types tracked:

| Type | Description | Return Window |
|------|-------------|----------------|
| **Standard Pallet** | 48"×40" wooden pallet for bulk shipments | Next scheduled delivery (3-7 days) |
| **Bushel Bin** | Collapsible plastic bin (~1.3 cu ft) for lighter items | 2-3 days (fast turnover) |
| **Rolling Cart** | Mobile cart with wheels for easier unloading | Next delivery or 14 days |
| **Specialty Bin** | Custom-sized bin for specific customer needs | Per customer agreement |
| **Plant Tray** | Lightweight plastic tray for small plants | Can be disposable or 1-2 day return |

## Recording Cart Exchanges

### Recording Carts Shipped to Customer

1. During shipment preparation, note the carts/bins being used
2. After loading shipment, record in the system:
   - Navigate to **Shipping** → **Cart Exchange** or **Shipping** → **Shipment Details**
   - Click **Record Carts Shipped**
3. Enter:
   - **Customer No.:** The destination customer
   - **Shipment No.:** Link to the specific shipment
   - **Cart Type:** Select from predefined types
   - **Quantity:** Number of carts shipped
   - **Expected Return Date:** Calculate based on cart type and agreement
   - **Shipped Date:** Today's date
4. Click **OK** to record the shipment

### Automatic Cart Tracking

For customers with standing arrangements:

1. The system may automatically create cart exchange records when shipments are processed
2. Review automatically created exchange records for accuracy
3. Adjust return dates if the shipment timing is unusual

### Recording Carts Returned by Customer

1. When a customer returns carts, open the **Cart Exchange** page
2. Click **Record Return**
3. Enter:
   - **Customer No.:** The returning customer
   - **Cart Type:** Type of cart being returned
   - **Returned Quantity:** Number of carts received back
   - **Return Date:** Date carts were received back
   - **Condition:** Rate cart condition (Excellent, Good, Fair, Poor/Damaged)
4. (Optional) Note any damage details
5. Click **OK** to record the return

### Manual Entry for Historical Exchanges

For carts shipped before system implementation or to add historical data:

1. Navigate to **Cart Exchange** → **Manual Entry** or **Historical Adjustments**
2. Enter:
   - **Customer No.**
   - **Cart Type** and **Quantity**
   - **Transaction Type:** "Shipped" or "Returned"
   - **Transaction Date**
   - Notes describing the exchange
3. Click **OK**

These entries create audit trail for historical cart tracking.

## Tracking Cart Balances

### Understanding Cart Balance

A customer's cart balance represents:

- **Positive balance** (e.g., +5 carts): We have shipped 5 more carts to the customer than they've returned
- **Negative balance** (e.g., -2 carts): Customer has returned 2 more carts than we've shipped (we owe them carts)
- **Zero balance**: Carts shipped = carts returned; no outstanding exchange

### Viewing Customer Cart Balances

1. Navigate to **Shipping** → **Cart Exchange Dashboard** or **Customer Cart Balance**
2. Select or search for the customer
3. System displays current balance by cart type:

```
Customer: ABC Growers
Cart Type        Shipped  Returned  Outstanding
Standard Pallet    15       12         3
Bushel Bin         50       48         2
Rolling Cart        8        8         0
TOTAL OUTSTANDING              5 carts
```

### Generating Balance Reports

1. Navigate to **Reports** → **Shipping** → **Cart Exchange Summary**
2. Choose report period (current month, year-to-date, all-time)
3. Report shows by customer:
   - Carts currently in circulation
   - Overdue/overdue carts
   - Estimated value of unreturned carts
4. Use for billing and collection purposes

## Scheduling Cart Returns

### Setting Return Dates

Return dates depend on cart type and customer agreement:

| Cart Type | Typical Return Window | Notes |
|-----------|----------------------|-------|
| Standard Pallet | Next scheduled delivery (3-7 days) | Customer should return with next order |
| Bushel Bin | 2-3 days | Fast turnover; needed for next shipment |
| Rolling Cart | Next delivery or 14 days | Slower turnover; some customers hold longer |
| Specialty Bin | Per customer agreement | May be longer rental period |
| Plant Tray | Can be disposable or 1-2 day return | Confirm with customer |

### Creating Return Reminders

For carts with scheduled returns:

1. The system can automatically create return reminders as the due date approaches
2. Reminders are sent to customers:
   - 3 days before due date
   - On due date
   - 2 days after due date (if not returned)
3. To manually create a reminder:
   - Navigate to **Cart Exchange** → **Create Return Reminder**
   - Select customer(s) with outstanding carts
   - Click **Send Reminders**

### Arranging Pickup from Customer

For customers who cannot return carts themselves:

1. Open the **Cart Exchange** → **Cart Exchange Detail** for the customer
2. Click **Arrange Pickup**
3. Enter:
   - **Pickup Date:** Proposed date to pick up carts
   - **Contact Person:** Who at customer location to coordinate with
   - **Carrier:** Who will pick up (your shipper or customer arranges)
   - **Special Instructions:** Any access requirements, etc.
4. Click **Schedule Pickup**
5. Pickup notification is sent to customer; shipper is notified of pickup appointment

## Reconciling Cart Inventory

### Monthly Cart Count

To verify actual carts match system records:

1. Physically count all carts at each location
2. Navigate to **Cart Exchange** → **Physical Count**
3. Enter actual counts by cart type
4. System compares to expected balances
5. Investigate discrepancies
6. Post adjustments for lost/damaged carts

## Best Practices

✅ **DO:**
- Record carts shipped immediately when loading
- Set realistic return dates based on cart type
- Send reminders 3 days before return due date
- Conduct monthly physical counts
- Track damaged carts for replacement budgeting
- Update customer agreements when terms change
- Review cart balances quarterly with customer service

❌ **DON'T:**
- Forget to record cart shipments
- Extend return dates indefinitely without follow-up
- Ignore overdue carts (pursue collection promptly)
- Skip physical counts (leads to unaccounted loss)
- Accept damaged carts without documenting condition
- Let balances grow without customer communication
- Send carts without recording transaction

## Troubleshooting

### Issue: Cart Balance Shows Negative (We Owe Carts)

**Cause:** More carts returned than shipped (data entry error or customer kept carts beyond expectation)

**Solution:**
1. Verify actual cart count at that location
2. Check if customer agreement allows extended holds
3. If data error, correct transaction
4. If legitimate hold, confirm extended rental terms

### Issue: Customer Claims They Returned Carts But System Shows Different

**Cause:** Return not recorded in system or recorded incorrectly

**Solution:**
1. Check Cart Exchange history for return entries
2. If missing, add manual entry with date/quantity
3. If recorded, verify quantity matches what customer provided
4. Update if needed

### Issue: Cannot Generate Return Reminder

**Cause:** Customer contact information missing or not set up for notifications

**Solution:**
1. Verify customer has email or phone on file
2. Check that notification preferences are configured
3. Consider manual follow-up call or email
4. Add contact information and retry

## Related Pages

- [[bin-management]] — Moving inventory between bins
- [[service-zone-configuration]] — Geographic delivery zones
- [[shipping-worksheet-overview]] — Shipping route planning
