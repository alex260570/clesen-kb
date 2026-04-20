# Sales price management guide

> **Version:** 1.0
> **Last Updated:** 2026-04-03
> **Author:** Documentation Team
> **Audience:** Sales managers, pricing administrators
> **Status:** Published

## Table of contents

- [Overview](#overview)
- [Working with price lists](#working-with-price-lists)
- [Importing prices](#importing-prices)
- [Exporting prices](#exporting-prices)
- [Historical price tracking](#historical-price-tracking)
- [Price change analysis](#price-change-analysis)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)

## Overview

The Sales Price Management system enables you to efficiently manage item pricing across customers and time periods. Key capabilities include:

- Import prices from Excel or CSV files
- Export price lists in multiple formats
- Track historical price changes by item and customer
- Analyze price variations and trends
- Review pricing audit trails

### Purpose and benefits

- **Centralized pricing control:** Manage all pricing from one location
- **Audit trail:** Complete history of all price changes with timestamps
- **Bulk operations:** Import multiple prices efficiently
- **Data-driven decisions:** Analyze pricing trends and customer-specific pricing

### Prerequisites

- Sales manager or administrator role with pricing permissions
- Access to the Clesen Horticulture system
- (Optional) Excel or CSV file with price data for import

## Working with price lists

### Creating a new price list

1. Open the **Sales Prices** page.
2. Click **New** to create a new price entry.
3. Enter the following information:
   - `Item No.`: Select the item for which to set the price
   - `Customer No.`: Select the customer (or leave blank for standard pricing)
   - `Effective Date`: The date when this price becomes active
   - `Price`: Enter the price amount
   - `Currency Code`: Select currency if applicable
4. Click **OK** to save the price entry.

> **Tip:** Leave `Customer No.` blank to set a standard price for all customers.

### Modifying existing prices

1. Open the **Sales Prices** page.
2. Locate the price entry you want to modify.
3. Click **Edit** to open the pricing record.
4. Update the `Price` field with the new amount.
5. Update the `Effective Date` if the change should take effect on a different date.
6. Click **OK** to save your changes.

The system automatically records the change with a timestamp for audit purposes.

### Deleting prices

1. Open the **Sales Prices** page.
2. Select the price entry you want to delete.
3. Click **Delete** to remove the entry.

> **Warning:** Deleted prices cannot be recovered. Consider archiving old prices instead of deleting for audit compliance.

## Importing prices

### Setting up an import file

Prepare your import file with the following columns:

| Column | Required | Format | Example |
|--------|----------|--------|---------|
| `Item No.` | Yes | Text | `PLANT-001` |
| `Customer No.` | No | Text | `CUST-123` |
| `Price` | Yes | Number | `15.50` |
| `Effective Date` | Yes | Date | `2026-04-01` |
| `Currency Code` | No | Text | `USD` |

### Performing a bulk import

1. Open the **Sales Prices** page.
2. Click **Import** > **From File**.
3. Select your prepared Excel or CSV file.
4. Click **Open** to begin the import process.
5. Review the preview of prices to be imported:
   - Check item numbers are correct
   - Verify prices match your file
   - Confirm effective dates are accurate
6. Click **Import All** to import all prices or **Import Selected** to import specific rows.

> **Note:** The system validates that `Item No.` values exist in your item master before importing. Prices with missing items will show validation errors.

### Handling import errors

Common import errors and solutions:

| Error | Cause | Solution |
|-------|-------|----------|
| Item not found | Item does not exist in system | Create the item first, then retry import |
| Invalid date format | Date not in required format | Use YYYY-MM-DD format (e.g., 2026-04-01) |
| Missing required field | Item No. or Price is blank | Verify all required columns are populated |
| Duplicate entry | Price entry already exists | Review existing prices to avoid duplicates |

## Exporting prices

### Exporting all prices

1. Open the **Sales Prices** page.
2. Click **Export** > **To File**.
3. Select the export format:
   - **Excel** (recommended for analysis and further editing)
   - **CSV** (for integration with external systems)
   - **PDF** (for printing or archiving)
4. Choose the file location and click **Save**.

### Exporting filtered prices

You can export a subset of prices:

1. Open the **Sales Prices** page.
2. Apply filters to show only the prices you want to export:
   - By `Item No.` (e.g., all prices for a specific item)
   - By `Customer No.` (e.g., all prices for a customer)
   - By `Effective Date` range
3. Click **Export** > **Filtered Results** > **To File**.
4. Select format and location, then click **Save**.

> **Tip:** Use filtered exports to share pricing with specific sales teams or verify pricing for particular customers.

## Historical price tracking

### Viewing price history

The system maintains a complete history of all prices ever set:

1. Open the **Sales Price History** page.
2. Enter filter criteria:
   - `Item No.`: Leave blank to see all items, or select a specific item
   - `Customer No.`: Leave blank for standard prices, or select a customer
   - `Start Date` and `End Date`: Select the date range
3. Click **Apply Filter** to view results.

The list shows:

- `Item No.` and `Customer No.` (or blank for standard pricing)
- `Price` (the amount in effect during that period)
- `Effective Date` (when the price went into effect)
- `Changed By` (user who made the change)
- `Changed Date` (timestamp of the change)

### Analyzing price changes over time

1. Open the **Sales Price History** page.
2. Select an item or customer to analyze.
3. Review the chronological list of prices:
   - Identify when price increases or decreases occurred
   - Check the frequency of price changes
   - Note seasonal pricing patterns
4. (Optional) Export the history for further analysis in Excel.

## Price change analysis

### Price variance reporting

The **Price Variance Report** shows how actual selling prices compare to listed prices:

1. Navigate to **Reports** > **Sales** > **Price Variance**.
2. Enter the reporting period:
   - `Start Date`: Beginning of the period to analyze
   - `End Date`: End of the period to analyze
3. (Optional) Filter by `Item No.` or `Customer No.`.
4. Click **Generate Report**.

The report shows:

- Items with the largest price variances
- Customers receiving special pricing
- Significant deviations from standard pricing
- Trends in pricing over the reporting period

### Best practices for pricing analysis

- Review price history monthly for trends
- Compare standard pricing vs. customer-specific pricing quarterly
- Monitor competitor pricing against your own
- Analyze sales volume by price points to identify demand elasticity

## Troubleshooting

### Prices not appearing in sales orders

**Problem:** A price is set in the system but does not apply to new sales orders.

**Causes:**
- Price `Effective Date` is in the future
- Price is set for specific customer, but order is for different customer
- Price setup is incomplete (missing `Price` field)

**Solutions:**
1. Verify the price `Effective Date` is today or earlier: Open **Sales Prices**, find the entry, check the date
2. Confirm the price applies to the correct customer: If `Customer No.` is blank, it applies to all customers
3. Check the price record is complete and saved properly

### Import file failing validation

**Problem:** Import fails with validation errors.

**Solutions:**
1. Verify column headers match exactly (capitalization matters)
2. Check that `Item No.` values exist in the system (create missing items first)
3. Ensure date values are in YYYY-MM-DD format
4. Remove any extra blank rows at the end of the file

### Cannot find historical price data

**Problem:** Price history is incomplete or missing.

**Solutions:**
1. Historical data is only available from the date of system implementation
2. Price changes made before the current date are not retained
3. Deleted prices cannot be recovered from history

## FAQ

**Q: How far back does price history go?**
A: Price history is maintained from the date of system implementation. All price changes made since then are retained in the history. Deleted prices cannot be recovered.

**Q: Can I set different prices for different customers?**
A: Yes. When entering a price, leave `Customer No.` blank for a standard price used by all customers, or enter a specific `Customer No.` to set a customer-specific price. Customer-specific prices override the standard price for that customer.

**Q: What is the difference between a price and a discount?**
A: Price is the base amount charged for an item. Discounts are reductions applied after the price is set (e.g., quantity discounts or customer volume discounts). They are managed separately.

**Q: Can I export prices for use in a spreadsheet?**
A: Yes. Use the **Export** > **To File** > **Excel** option to export all or filtered prices to an Excel file for further analysis or editing.

**Q: How long does a bulk import take?**
A: Import time depends on file size. Typically, importing 100-500 prices takes 1-5 minutes. Very large imports (1,000+ prices) may take 15-30 minutes. Progress is shown during the import process.

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/sales-price-management-guide.pdf)
