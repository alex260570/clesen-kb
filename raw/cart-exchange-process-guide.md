# Cart exchange process guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Shipping staff, customer service
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Understanding cart exchanges](#understanding-cart-exchanges)
- [Recording cart exchanges](#recording-cart-exchanges)
- [Tracking cart balances](#tracking-cart-balances)
- [Scheduling cart returns](#scheduling-cart-returns)
- [Reconciling cart inventory](#reconciling-cart-inventory)
- [Managing overdue carts](#managing-overdue-carts)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Cart Exchange system tracks reusable containers (carts, bins, trays) exchanged with customers during shipments. This ensures accountability, prevents loss, and supports billing for unreturned containers.

### Purpose and benefits

- **Container accountability:** Track all carts and bins checked out to customers
- **Billing accuracy:** Bill customers for unreturned containers or overdue returns
- **Inventory management:** Ensure adequate carts are available for ongoing operations
- **Customer service:** Monitor return status and contact customers about overdue containers
- **Cost control:** Identify lost or damaged containers that need replacement

### Prerequisites

- Shipping staff or customer service role
- Understanding of container types used (standard pallets, bushel bins, etc.)
- Customer information and contact details
- Shipping documentation

## Understanding cart exchanges

### Types of exchanges

The cart exchange system handles several exchange models:

| Model | Description | Example |
|-------|-------------|---------|
| Exchange on delivery | Customer returns empty cart when receiving full shipment | Deliver 50 plants in cart, customer returns empty cart |
| Swap program | Maintain equal number of carts at customer location | Customer holds 10 carts; when we deliver 5, they return 5 |
| Deposit | Customer holds cart until scheduled return date | Deliver in reusable cart, customer returns on date X |
| Free trial | Customer holds container for limited time free | Give new customer 1 demo cart; they return after trying |
| Loan | Long-term container loan for regular customers | Customer may hold cart indefinitely; we track for reconciliation |

### Standard cart types

Common container types tracked:

- **Standard Pallet:** 48"×40" wooden pallet for bulk shipments
- **Bushel Bin:** Collapsible plastic bin (~1.3 cu ft) for lighter items
- **Rolling Cart:** Mobile cart with wheels for easier unloading
- **Specialty Bin:** Custom-sized bin for specific customer needs
- **Plant Tray:** Lightweight plastic tray for small plants

Each type has different return expectations (some disposable, some must return).

## Recording cart exchanges

### Recording carts shipped to customer

1. During shipment preparation, note the carts/bins being used.
2. After loading shipment, record in the system:
   - Navigate to **Shipping** > **Cart Exchange** or **Shipping** > **Shipment Details**.
   - Click **Record Carts Shipped**.
3. Enter:
   - `Customer No.`: The destination customer
   - `Shipment No.`: Link to the specific shipment
   - `Cart Type`: Select from predefined types
   - `Quantity`: Number of carts shipped
   - `Expected Return Date`: Calculate based on cart type and agreement
   - `Shipped Date`: Today's date
4. Click **OK** to record the shipment.

### Automatic cart tracking

For customers with standing arrangements:

1. The system may automatically create cart exchange records when shipments are processed.
2. Review automatically created exchange records for accuracy.
3. Adjust return dates if the shipment timing is unusual.

### Recording carts returned by customer

1. When a customer returns carts, open the **Cart Exchange** page.
2. Click **Record Return**.
3. Enter:
   - `Customer No.`: The returning customer
   - `Cart Type`: Type of cart being returned
   - `Returned Quantity`: Number of carts received back
   - `Return Date`: Date carts were received back
   - `Condition`: Rate cart condition (Excellent, Good, Fair, Poor/Damaged)
4. (Optional) Note any damage details.
5. Click **OK** to record the return.

### Manual entry for historical exchanges

For carts shipped before system implementation or to add historical data:

1. Navigate to **Cart Exchange** > **Manual Entry** or **Historical Adjustments**.
2. Enter:
   - `Customer No.`
   - `Cart Type` and `Quantity`
   - `Transaction Type`: "Shipped" or "Returned"
   - `Transaction Date`
   - Notes describing the exchange
3. Click **OK**.

These entries create audit trail for historical cart tracking.

## Tracking cart balances

### Understanding cart balance

A customer's cart balance represents:

- **Positive balance** (e.g., +5 carts): We have shipped 5 more carts to the customer than they've returned
- **Negative balance** (e.g., -2 carts): Customer has returned 2 more carts than we've shipped (we owe them carts)
- **Zero balance**: Carts shipped = carts returned; no outstanding exchange

### Viewing customer cart balances

1. Navigate to **Shipping** > **Cart Exchange Dashboard** or **Customer Cart Balance**.
2. Select or search for the customer.
3. System displays current balance by cart type:

```
Customer: ABC Growers
Cart Type        Shipped  Returned  Outstanding
Standard Pallet    15       12         3
Bushel Bin         50       48         2
Rolling Cart        8        8         0
TOTAL OUTSTANDING              5 carts
```

### Generating balance reports

1. Navigate to **Reports** > **Shipping** > **Cart Exchange Summary**.
2. Choose report period (current month, year-to-date, all-time).
3. Report shows by customer:
   - Carts currently in circulation
   - Overdue/overdue carts
   - Estimated value of unreturned carts
4. Use for billing and collection purposes.

## Scheduling cart returns

### Setting return dates

Return dates depend on cart type and customer agreement:

| Cart Type | Typical Return Window | Notes |
|-----------|----------------------|-------|
| Standard Pallet | Next scheduled delivery (3-7 days) | Customer should return with next order |
| Bushel Bin | 2-3 days | Fast turnover; needed for next shipment |
| Rolling Cart | Next delivery or 14 days | Slower turnover; some customers hold longer |
| Specialty Bin | Per customer agreement | May be longer rental period |
| Plant Tray | Can be disposable or 1-2 day return | Confirm with customer |

### Creating return reminders

For carts with scheduled returns:

1. The system can automatically create return reminders as the due date approaches.
2. Reminders are sent to customers:
   - 3 days before due date
   - On due date
   - 2 days after due date (if not returned)
3. To manually create a reminder:
   - Navigate to **Cart Exchange** > **Create Return Reminder**
   - Select customer(s) with outstanding carts
   - Click **Send Reminders**

### Arranging pickup from customer

For customers who cannot return carts themselves:

1. Open the **Cart Exchange** > **Cart Exchange Detail** for the customer.
2. Click **Arrange Pickup**.
3. Enter:
   - `Pickup Date`: Proposed date to pick up carts
   - `Contact Person`: Who at customer location to coordinate with
   - `Carrier`: Who will pick up (your shipper or customer arranges)
   - `Special Instructions`: Any access requirements, etc.
4. Click **Schedule Pickup**.
5. Pickup notification is sent to customer; shipper is notified of pickup appointment.

## Reconciling cart inventory

### Monthly cart count

To verify actual carts match system records:

1. Navigate to **Inventory** > **Cart Inventory** or **Physical Count**.
2. Select `Cart Type` and `Facility` to count.
3. Record actual number of carts physically present:
   - On hand in warehouse
   - At each facility
   - (Carts with customers are tracked separately)
4. Enter the count and click **Complete Count**.

### Resolving discrepancies

If actual count doesn't match system:

| Situation | System Balance | Actual Count | Action |
|-----------|-----------------|-------------|--------|
| More than expected | System shows 10 carts | We have 12 | Adjust system up 2; investigate where extra came from |
| Fewer than expected | System shows 10 carts | We have 8 | Adjust system down 2; customers may have unreturned carts |
| Match | System shows 10 carts | We have 10 | No action; reconciliation complete |

### Creating adjustment entries

To correct cart inventory discrepancies:

1. Navigate to **Cart Exchange** > **Adjustments** or **Inventory Adjustment**.
2. Click **New**.
3. Enter:
   - `Cart Type`: The cart type being adjusted
   - `Adjustment Quantity`: Positive (add) or negative (remove)
   - `Reason Code`: Select reason (e.g., "Physical Count Adjustment", "Damaged & Scrapped", "Found in Storage")
   - `Notes`: Explain the discrepancy
4. Click **OK**.

This creates an audit entry documenting the adjustment.

## Managing overdue carts

### Identifying overdue carts

Carts are considered overdue when:

- Return date has passed
- Customer still shows outstanding balance
- Return hasn't been recorded

### Viewing overdue carts by customer

1. Navigate to **Shipping** > **Overdue Carts** or **Cart Exchange Dashboard**.
2. Filter to show only:
   - Overdue = Yes
   - Sort by days overdue (longest overdue first)

### Following up on overdue carts

1. For each overdue cart record:
   - Click to open customer details
   - Note the number of carts and how many days late
   - See customer contact person and phone
2. Click **Send Overdue Notice** to email the customer.
3. Manually call customer if more than 5 days overdue:
   - Friendly reminder of outstanding carts
   - Ask about return timing
   - Offer to arrange pickup if needed

### Billing for unreturned carts

If carts remain unreturned beyond billing threshold (typically 30-60 days):

1. Navigate to **Billing** > **Cart Exchange Billing**.
2. View customers with outstanding carts ready to bill:
   - Days overdue ≥ threshold (e.g., 60 days)
   - Assessed value = Quantity × cart value
3. Select customers to invoice.
4. Click **Create Invoices** to generate billing documents.
5. Invoices are sent to customer for payment of unreturned containers.

## Troubleshooting

### Issue: System shows carts we don't have

**Problem:** Cart balance shows positive balance but we don't have carts in inventory.

**Causes:**
- Carts in transit between locations
- Physical count hasn't been reconciled
- Manual entry error
- Carts damaged/lost but not recorded

**Solutions:**
1. Check if carts are in transit/other facilities
2. Conduct physical count and reconcile discrepancies
3. Create adjustment entry if carts are confirmed lost or damaged
4. Contact customer if you believe they kept carts longer than expected

### Issue: Customer disputes cart count

**Problem:** Customer claims they don't have the carts we say we shipped.

**Solutions:**
1. Review **Shipment Details** for the shipment in question
2. Check shipping documentation and photos if available
3. Review customer's receiving records if they can provide
4. Create a **Cart Dispute** record documenting the disagreement
5. Contact the customer directly to verify actual cart location
6. May require manual adjustment if clear error

### Issue: Cannot record cart return for older shipment

**Problem:** When trying to record a return, system won't accept it because shipment is very old.

**Solutions:**
1. Use **Manual Entry** or **Historical Adjustment** for old returns
2. Contact IT support if there's a date range restriction
3. Document reason for late return entry

### Issue: Pickup arrangement didn't happen

**Problem:** Scheduled pickup was missed; carts still with customer.

**Solutions:**
1. Check pickup notification was sent (contact shipper to verify)
2. Verify date with customer (may have requested different date)
3. Reschedule pickup for different date
4. May transition to customer returning carts with next order instead

## FAQ

**Q: How do we bill for unreturned carts?**
A: After carts are overdue for the threshold period (typically 30-60 days), the system generates invoices for cart value. Customers receive invoice and can return carts to credit their account, or pay for them.

**Q: What if a cart is damaged when customer returns it?**
A: Record the return but note the condition as "Damaged". You may charge for repair or replacement depending on the damage severity and customer agreement. Damaged carts can be sent for repair or scrapped depending on economic value.

**Q: Can customers see their cart balance?**
A: Depending on system configuration, customers may have access to a portal showing their current cart balance. Contact your customer service manager about customer access.

**Q: What's the difference between a cart and inventory items?**
A: Carts are reusable containers that go back and forth with customers. Inventory items (plants, flowers, etc.) are sold to customers. Carts are tracked separately.

**Q: How do we know if a cart is lost or just taking a long time to return?**
A: Overdue carts are flagged after return date. Follow-up messages are sent. If carts remain outstanding beyond a set threshold (typically 30-60 days), they're considered lost and billed to the customer. Customer can still return them later to receive credit.

**Q: Can I print a cart label or barcode for tracking?**
A: Yes. When recording carts shipped, you can print labels to apply to physical carts if your system supports it. Ask your IT administrator about barcode/RFID capability.

**Q: What about carts that need repair?**
A: Damaged carts should be recorded as returned "in poor condition". They can be sent for repair or scrapped depending on damage severity. Work with your warehouse manager on repair vs. replacement decisions.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/cart-exchange-process-guide.pdf)
