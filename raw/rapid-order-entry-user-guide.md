# Rapid Order Entry User Guide

## Overview

The Rapid Order Entry (also called Speed Entry) is a streamlined tool for quickly adding multiple items to sales orders, blanket orders, and quotes. It provides a single worksheet view of all available items for the season, with real-time availability information.

## Prerequisites

Before using Rapid Order Entry:

- A Sales Order, Blanket Order, or Quote must be created
- **Shipment Date must be set** on the header (this is required)

## Opening Rapid Order Entry

1. Open your Sales Order, Blanket Order, or Quote
2. Ensure the **Shipment Date** field is filled in
3. Click the **"Rapid Order Entry"** action from the ribbon
4. The worksheet will open showing available items

> **Note:** If you haven't set a Shipment Date, you'll see the message: "Please enter a Shipment Date."

## Understanding the Worksheet

### Columns

| Column | Description |
| -------- | ------------- |
| **Item No.** | The item number from your inventory |
| **Description** | Full item description (Description 2 field) |
| **Pot Size** | Container size code |
| **Season** | Item season (Spring/Summer/Fall/Winter) |
| **Unit of Measure** | Sales unit (e.g., FLAT, EACH) |
| **Current Qty.** | Quantity already on the order (if any) |
| **New Qty.** | Enter your desired quantity here |
| **Qty. Available** | Real-time availability across all active locations |
| **Availability Status** | Color-coded indicator (Green=Available, Red=Not Available) |
| **Unit Price** | Item price |

### Item Display

The worksheet shows:

1. **Existing items** already on your order (marked as "Sales Line" source)
2. **All available items** for the season(s) matching your shipment date

Items are automatically filtered by:

- Season appropriate for the shipment date
- Active inventory items only
- Non-blocked items only

### Availability Colors

- **Green (Available)**: Items with positive availability
- **Red (Not Available)**: Items with zero or negative availability
- You can still order items regardless of availability status

## Adding Items to Your Order

### Basic Steps

1. Browse or search for items in the worksheet
2. Enter quantities in the **"New Qty."** column
   - For existing items, this updates the quantity
   - For new items, this adds them to your order
3. Click **OK** when finished
4. The system will:
   - Update existing sales lines
   - Create new sales lines for newly added items
   - Recalculate freight charges (if auto-freight is enabled)
   - Add credit card fees (if auto-CC fees are enabled)

### Tips

**Filtering Items:**

- Use the filter pane to narrow by description, pot size, or season
- Press Ctrl+F to search

**Modifying Existing Items:**

- Items already on your order show their current quantity
- Change the "New Qty." to update
- The system will merge quantities if the same item appears multiple times

**Bulk Entry:**

- You can enter quantities for multiple items before clicking OK
- All changes are applied together

## Merged Lines

If your order has **multiple lines of the same item** (e.g., same item with different shipment dates), the system will:

- Combine them into a single entry in the worksheet
- Show the total quantity in "Current Qty."
- Mark the line as "Merged"
- **Block shipment date changes** on the header after saving

> **Warning:** When merged lines exist, you cannot change the shipment date on the order header after saving. This prevents date conflicts across multiple lines.

## Season Logic

The system automatically determines which items to show based on your shipment date:

| Shipment Date Range | Seasons Shown |
| --------------------- | --------------- |
| March 1 - May 31 | Spring |
| June 1 - August 31 | Summer |
| September 1 - November 30 | Fall |
| December 1 - February 28/29 | Winter |

**Transition Periods:**

- If your shipment date falls in a transition period, the system may show items from multiple seasons
- This ensures you see all relevant items for your delivery window

## Document Types

Rapid Order Entry works with:

- **Sales Orders** - Full functionality including auto-fees
- **Blanket Orders** - Item selection only, no fee calculations
- **Quotes** - Item selection only, no fee calculations

## Automatic Fee Handling

For **Sales Orders only**, if enabled in Clesen Setup:

**Auto Freight Charges:**

- System deletes existing freight lines before adding items
- Recalculates freight after all items are added
- Ensures accurate freight based on final order contents

**Auto Credit Card Fees:**

- System deletes existing CC fee lines before adding items
- Recalculates CC fees after all items are added
- Applies to orders with credit card payment method

## Canceling Changes

- Click **Cancel** or press Escape to exit without saving
- No changes will be made to your order
- You can reopen Rapid Order Entry at any time

## Troubleshooting

### "Please enter a Shipment Date"

- The shipment date field on the order header is empty
- Enter a shipment date before opening Rapid Order Entry

### No items appear in the worksheet

- Check that the shipment date is valid
- Verify that items exist for the selected season
- Ensure items are not sales-blocked
- Confirm items are set as inventory type

### Items I added don't appear on the order

- Make sure you clicked **OK** (not Cancel)
- Verify you entered a quantity in the "New Qty." column
- Check that the order number matches

### Availability shows zero but I know we have stock

- Availability calculates across all active locations only
- Check if the location is marked as active
- Verify the item has inventory in active locations
- Check the date - availability is calculated for the shipment date

### Cannot change shipment date after using Rapid Order Entry

- This happens when merged lines exist
- The system prevents date changes to avoid conflicts
- You must manually adjust individual line dates if needed

## Best Practices

1. **Set the shipment date first** - This ensures correct item filtering
2. **Review availability** - Green items are in stock, but you can order any item
3. **Use filters** - Narrow down large item lists by description or pot size
4. **Check merged lines** - Be aware when multiple lines combine
5. **Verify totals** - Review your order after saving to confirm quantities
6. **Save frequently** - For large orders, consider saving in batches

## Keyboard Shortcuts

| Shortcut | Action |
| ---------- | -------- |
| Ctrl+F | Search/filter |
| Tab | Move between columns |
| Enter | Move to next row |
| Ctrl+Home | Jump to first record |
| Ctrl+End | Jump to last record |
| Escape | Cancel and close |

## Related Documentation

- Item Availability System
- Sales Order Processing
- Season Management
- Fee Calculation Setup

---

*For technical support or system issues, contact your IT department.*

---

## Related documents

- [[rapid-order-entry-troubleshooting-guide]]
