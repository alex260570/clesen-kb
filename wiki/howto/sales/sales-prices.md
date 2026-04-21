---
title: Sales Prices
type: howto
tags: [sales-orders, pricing, price-management, analysis]
created: 2026-04-21
updated: 2026-04-21
sources: [sales-price-management-guide.md]
---

# Sales Prices

Managing item pricing across customers and time periods with import, export, and historical tracking.

## Overview

The **Sales Price Management** system enables centralized pricing control with:

- ✓ Import prices from Excel or CSV
- ✓ Export price lists in multiple formats
- ✓ Track complete historical price changes
- ✓ Analyze price variations and trends
- ✓ Maintain full audit trail

## Working with Price Lists

### Creating a New Price

1. Open **Sales Prices** page
2. Click **+ New** to create entry
3. Fill in:
   - **Item No.** — The item
   - **Customer No.** — Specific customer (leave blank for standard pricing)
   - **Effective Date** — When price becomes active
   - **Price** — The amount
   - **Currency Code** — Currency if applicable
4. Click **OK** to save

**Tip:** Leave **Customer No.** blank to set standard price for all customers.

### Modifying Existing Prices

1. Open **Sales Prices**
2. Locate the price to modify
3. Click **Edit**
4. Update **Price** and/or **Effective Date**
5. Click **OK** to save

System automatically records change with timestamp for audit.

### Deleting Prices

1. Open **Sales Prices**
2. Select the price entry
3. Click **Delete**

⚠️ **Deleted prices cannot be recovered.** Consider archiving instead for audit compliance.

## Importing Prices

### Prepare Import File

Format with these columns:

| Column | Required | Format | Example |
|--------|----------|--------|---------|
| **Item No.** | Yes | Text | PLANT-001 |
| **Customer No.** | No | Text | CUST-123 |
| **Price** | Yes | Number | 15.50 |
| **Effective Date** | Yes | Date | 2026-04-01 |
| **Currency Code** | No | Text | USD |

### Perform Bulk Import

1. Open **Sales Prices**
2. Click **Import** → **From File**
3. Select prepared Excel or CSV file
4. Review preview:
   - Check item numbers
   - Verify prices match file
   - Confirm effective dates
5. Click **Import All** (all) or **Import Selected** (specific rows)

**Note:** System validates Item No. values exist before importing.

### Handling Import Errors

| Error | Cause | Solution |
|-------|-------|----------|
| Item not found | Item doesn't exist | Create item first, retry |
| Invalid date format | Date not in required format | Use YYYY-MM-DD format |
| Missing required field | Item No. or Price blank | Verify columns populated |
| Duplicate entry | Price already exists | Review existing prices |

## Exporting Prices

### Export All Prices

1. Open **Sales Prices**
2. Click **Export** → **To File**
3. Select format:
   - **Excel** (recommended for analysis)
   - **CSV** (for external systems)
   - **PDF** (for printing/archiving)
4. Choose location, click **Save**

### Export Filtered Prices

1. Open **Sales Prices**
2. Apply filters:
   - By Item No.
   - By Customer No.
   - By Effective Date range
3. Click **Export** → **Filtered Results** → **To File**
4. Select format and location

**Tip:** Use filtered exports to share pricing with sales teams or verify customer pricing.

## Historical Price Tracking

### Viewing Price History

1. Open **Sales Price History**
2. Enter filter criteria:
   - **Item No.** — Blank for all, or specific item
   - **Customer No.** — Blank for standard, or specific customer
   - **Start Date / End Date** — Date range
3. Click **Apply Filter**

**Shows:**
- Item No. and Customer No. (blank = standard pricing)
- **Price** — Amount in effect during period
- **Effective Date** — When price went into effect
- **Changed By** — User who made change
- **Changed Date** — Timestamp of change

### Analyzing Price Changes Over Time

1. Open **Sales Price History**
2. Select item or customer to analyze
3. Review chronological list:
   - Identify when increases/decreases occurred
   - Check frequency of changes
   - Note seasonal patterns
4. (Optional) Export history for Excel analysis

## Price Change Analysis

### Price Variance Report

1. Navigate to **Reports** → **Sales** → **Price Variance**
2. Enter reporting period:
   - **Start Date** — Beginning
   - **End Date** — End
3. (Optional) Filter by Item No. or Customer No.
4. Click **Generate Report**

**Report shows:**
- Items with largest variances
- Customers with special pricing
- Significant deviations from standard
- Pricing trends

### Best Practices for Analysis

- Review price history monthly for trends
- Compare standard vs customer pricing quarterly
- Monitor competitor pricing vs yours
- Analyze sales volume by price points for demand elasticity

## Best Practices

✅ **DO:**
- Set effective dates ahead when planning changes
- Archive old prices instead of deleting
- Document reasons for major price changes
- Review price history regularly
- Use filtered exports for team sharing
- Bulk import for efficiency
- Track customer-specific pricing separately

❌ **DON'T:**
- Delete prices without archiving
- Set conflicting effective dates
- Ignore price history for audit
- Assume all customers have same pricing
- Forget to update prices seasonally
- Leave outdated prices active

## Troubleshooting

### Prices Not Appearing on Sales Orders

**Cause:** Effective Date in future, wrong customer, or incomplete entry

**Solution:**
1. Verify Effective Date is today or earlier
2. Confirm price applies to correct customer (blank = all)
3. Check price record is complete and saved

### Import File Failing Validation

**Cause:** Format issues or missing items

**Solution:**
1. Verify column headers match exactly
2. Check Item No. values exist in system
3. Ensure dates in YYYY-MM-DD format
4. Remove blank rows at end of file

### Cannot Find Historical Price Data

**Cause:** Data only available from system implementation

**Solution:**
1. History starts from implementation date
2. Deleted prices cannot be recovered
3. Earlier prices not retained

## FAQ

**How far back does price history go?**
From system implementation date. All changes since then retained. Deleted prices not recoverable.

**Can I set different prices for different customers?**
Yes. Leave Customer No. blank for standard price, or enter specific customer for customer-specific price. Customer-specific overrides standard.

**What's the difference between price and discount?**
Price = base amount charged. Discounts = reductions applied after (quantity, volume, etc.). Managed separately.

**Can I export prices for Excel analysis?**
Yes. Use Export → To File → Excel option for all or filtered prices.

**How long does bulk import take?**
Depends on size. 100-500 prices = 1-5 minutes. 1,000+ = 15-30 minutes. Progress shown during import.

## Related Pages

- [[sales-order-management]] — Sales order reference
- [[sales-fees]] — Fee management
- [[rapid-order-entry]] — Fast order entry
