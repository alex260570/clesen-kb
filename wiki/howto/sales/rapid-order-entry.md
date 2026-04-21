---
title: Rapid Order Entry
type: howto
tags: [sales-orders, order-entry, efficiency, speed-entry]
created: 2026-04-21
updated: 2026-04-21
sources: [rapid-order-entry-user-guide.md]
---

# Rapid Order Entry

Streamlined tool for quickly adding multiple items to sales orders in a single worksheet view.

## What Is Rapid Order Entry?

**Rapid Order Entry** (also called Speed Entry) provides a single-page worksheet showing all available items for your shipment season with **real-time availability information**. Instead of entering items one-by-one, you browse the worksheet, enter quantities, and add multiple items at once.

**Key benefits:**
- ✓ Fast multi-item entry
- ✓ Real-time availability visibility  
- ✓ Automatic season filtering
- ✓ Auto-recalculation of freight and credit card fees (for sales orders only)

## Prerequisites

Before using Rapid Order Entry:

1. A Sales Order, Blanket Order, or Quote must already be created
2. **Shipment Date must be set** on the order header (required)

**If shipment date is blank,** you'll see the message: "Please enter a Shipment Date."

## Opening Rapid Order Entry

1. Open your Sales Order, Blanket Order, or Quote
2. Ensure the **Shipment Date** field is filled in
3. Click the **"Rapid Order Entry"** action in the ribbon
4. The worksheet opens showing available items

## Understanding the Worksheet

### Columns

| Column | Description |
|--------|---|
| **Item No.** | Item number from inventory |
| **Description** | Full item description |
| **Pot Size** | Container size code |
| **Season** | Item season (Spring/Summer/Fall/Winter) |
| **Unit of Measure** | Sales unit (FLAT, EACH, etc.) |
| **Current Qty.** | Quantity already on the order (if any) |
| **New Qty.** | Enter your desired quantity here |
| **Qty. Available** | Real-time availability across active locations |
| **Availability Status** | Color-coded: Green=Available, Red=Not Available |
| **Unit Price** | Item price |

### Item Display & Filtering

The worksheet automatically shows:

1. **Existing items** already on your order
2. **All available items** for the season(s) matching your shipment date

**Auto-filtered by:**
- Season appropriate for shipment date
- Active inventory items only
- Non-blocked items only

**You can further filter:**
- Description (use Ctrl+F to search)
- Pot size
- Season

### Availability Colors

- **Green (Available):** Items with positive availability
- **Red (Not Available):** Items with zero or negative availability

**Note:** You can order any item regardless of availability status.

## Adding Items to Your Order

### Basic Steps

1. Browse or search for items in the worksheet
2. Enter quantities in the **"New Qty."** column:
   - For existing items: updates the quantity
   - For new items: adds them to your order
3. Click **OK** when finished
4. The system will:
   - Update existing sales lines
   - Create new sales lines for new items
   - Recalculate freight charges (if enabled)
   - Add credit card fees (if enabled)

### Tips

**Filtering Items:**
- Use filter pane to narrow by description, pot size, or season
- Press Ctrl+F to search

**Modifying Existing Items:**
- Items already on your order show Current Qty
- Change "New Qty." to update
- System merges quantities if same item appears multiple times

**Bulk Entry:**
- Enter quantities for multiple items before clicking OK
- All changes applied together when you click OK

## Merged Lines

If your order has **multiple lines of the same item** (e.g., same item with different dates):

- System combines them into a single entry in the worksheet
- Shows total quantity in "Current Qty."
- Marks line as "Merged"
- **Blocks shipment date changes** on the header after saving

⚠️ **When merged lines exist, you cannot change the shipment date on the order header after saving.** This prevents date conflicts.

## Season Logic

System automatically determines which items to show based on shipment date:

| Shipment Date Range | Seasons Shown |
|---|---|
| March 1 - May 31 | Spring |
| June 1 - August 31 | Summer |
| Sept 1 - Nov 30 | Fall |
| Dec 1 - Feb 28/29 | Winter |

**Transition periods** may show items from multiple seasons to ensure you see all relevant items.

## Document Types

Rapid Order Entry works with:

| Type | Features |
|---|---|
| **Sales Orders** | Full functionality including auto-fees |
| **Blanket Orders** | Item selection only (no fee calculations) |
| **Quotes** | Item selection only (no fee calculations) |

## Automatic Fee Handling

**For Sales Orders only**, if enabled in Clesen Setup:

### Auto Freight Charges

- System deletes existing freight lines before adding items
- Recalculates freight after all items are added
- Ensures accurate freight based on final order

### Auto Credit Card Fees

- System deletes existing CC fee lines before adding items
- Recalculates CC fees after all items are added
- Applies to orders with credit card payment method

## Common Actions

### Canceling Changes

- Click **Cancel** or press Escape to exit without saving
- No changes made to your order
- You can reopen Rapid Order Entry at any time

## Best Practices

✅ **DO:**
- Set the shipment date first (ensures correct filtering)
- Review availability (green items are in stock)
- Use filters to narrow large item lists
- Check merged lines when combining items
- Verify totals after saving
- Save large orders in batches

❌ **DON'T:**
- Open without setting shipment date first
- Assume red items are unavailable (you can still order them)
- Forget about merged lines and their effects
- Make large quantity changes without reviewing

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+F | Search/filter |
| Tab | Move between columns |
| Enter | Move to next row |
| Ctrl+Home | Jump to first record |
| Ctrl+End | Jump to last record |
| Escape | Cancel and close |

## Troubleshooting

### "Please enter a Shipment Date"

**Cause:** Shipment date field on order header is empty

**Solution:** Enter a shipment date before opening Rapid Order Entry

### No items appear in worksheet

**Cause:** Possible reasons:
- Shipment date invalid
- No items exist for selected season
- Items are sales-blocked
- Items not set as inventory type

**Solution:** Check item setup and season flags

### Items I added don't appear on the order

**Cause:** Didn't click OK, or didn't enter quantity, or wrong order

**Solution:**
1. Make sure you clicked **OK** (not Cancel)
2. Verify you entered a quantity in "New Qty." column
3. Check that you're viewing the right order

### Availability shows zero but we have stock

**Cause:** Availability calculated for shipment date only, active locations only

**Solution:**
1. Check if location is marked as active
2. Verify item has inventory in active locations
3. Check the date — availability is for shipment date

### Cannot change shipment date after using Rapid Order Entry

**Cause:** Merged lines exist on the order

**Solution:**
1. Manually adjust individual line dates if needed
2. Or delete merged lines and re-enter separately

## Related Pages

- [[sales-order-management]] — Sales order field reference
- [[sales-fees]] — Fee calculation and management
- [[rapid-order-entry-it-troubleshooting]] — IT technical guide
