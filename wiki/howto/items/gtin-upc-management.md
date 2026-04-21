---
title: GTIN/UPC Barcode Management
type: howto
tags: [items, gtin, upc, barcodes, receiving, scanning]
created: 2026-04-21
updated: 2026-04-21
sources: [gtin-upc-management-user-guide.md]
---

# GTIN/UPC Barcode Management

Assigning 12-digit UPC barcodes to items for scanning and inventory tracking.

## What Is GTIN/UPC?

**GTIN** (Global Trade Item Number) is a 12-digit barcode standard used globally for product identification. In retail and warehousing, it's also called **UPC** (Universal Product Code).

**Key components:**

- **Barcode value** — 12-digit number (e.g., 123456789012)
- **Barcode image** — UPC-A barcode that can be scanned
- **Company GTIN** — Barcode from Clesen's own pool (reusable with blocking period)
- **Third-party GTIN** — Barcode assigned by vendor (deleted immediately when released)

**Use cases:**
- ✅ Receiving — Scan GTIN to verify shipment items
- ✅ Picking — Scan GTIN to confirm picked quantity
- ✅ POS/Customer scanning — Customer scans barcode at checkout
- ✅ Reports — Track sales by GTIN for analysis

## Company GTIN vs. Third-Party GTIN

### Company GTINs (Reusable)

**What they are:** Barcodes from Clesen's own numbering pool

**Lifecycle:**
1. Assign GTIN from pool to item
2. Use for scanning/transactions
3. **Release GTIN** when item discontinues
4. System enters **blocking period** (fixed duration, e.g., 30 days)
5. After blocking period, GTIN returns to available pool (can be reused)

**Use when:** Clesen owns the product or controls the barcode

**Example:** Private-label roses that Clesen grows or brands

### Third-Party GTINs (Deleted)

**What they are:** Barcodes assigned by vendors/suppliers

**Lifecycle:**
1. Assign vendor's GTIN to item (e.g., vendor provided barcode)
2. Use for receiving/identification
3. **Release GTIN** when relationship ends
4. System **immediately deletes** the barcode (non-reusable)
5. Cannot be reassigned

**Use when:** Vendor provides the barcode, or reselling vendor's product

**Example:** Roses from supplier ABC that come with their UPC 987654321098

**Why immediate deletion?** Vendor's barcode is their intellectual property. We cannot reuse it for our products.

## Assigning a GTIN

### Method 1: Assign Clesen Company GTIN

Use this for items you own/brand.

1. Open **Item Card** for the item
2. Navigate to **Supply** FastTab (or **Barcodes** section)
3. Click **Assign GTIN** or **New GTIN**
4. In the dialog:
   - **GTIN Type** — Select "Company" (Clesen-owned)
   - **GTIN Number** — Leave blank (system auto-assigns from pool)
   - Click **OK**

**Result:**
- Next available GTIN from Clesen's pool is assigned
- Item now has a unique barcode
- Barcode image generates automatically
- Ready to use for scanning

### Method 2: Assign Vendor's Third-Party GTIN

Use this when vendor provides a barcode.

1. Open **Item Card**
2. Click **Assign GTIN** or **New GTIN**
3. In the dialog:
   - **GTIN Type** — Select "Third-Party" (Vendor-owned)
   - **GTIN Number** — Enter the 12-digit barcode from vendor
   - Validate: System checks 12 digits + correct check digit
   - Click **OK**

**Result:**
- Vendor's barcode assigned to item
- Barcode image generates
- Item linked to vendor's GTIN
- Ready to use (will be deleted when released)

### Method 3: Bulk Import from Excel

Import multiple GTINs at once.

1. Prepare Excel file with columns:
   - Item No.
   - GTIN Number (12-digit)
   - GTIN Type (Company or Third-Party)
2. Open **Item List**
3. Click **Import GTINs** (or navigate to GTIN import tool)
4. Select the Excel file
5. Review import preview
6. Click **Import**

**With pre-assignment option:**
- Check **Pre-assign GTINs** box
- Assigns GTINs from your available pool automatically
- Useful for setting up new items quickly

**Result:** All items in Excel file now have GTINs assigned

## Managing GTINs

### View Assigned GTINs

1. Open **Item Card**
2. Navigate to **Barcodes** or **GTIN** section
3. See current GTIN:
   - Barcode value (number)
   - Barcode image (UPC-A graphic)
   - Barcode type (Company or Third-Party)
   - Date assigned

### Regenerate Barcode Image

If the barcode image needs to be reprinted or is missing:

1. Open **Item Card**
2. Click **Barcode Actions** → **Regenerate Barcode**
3. System fetches current barcode and regenerates UPC-A image
4. Click **Print** to print the barcode label
5. Attach label to item/packaging

### Release a GTIN

When an item is discontinued and GTIN is no longer needed:

1. Open **Item Card**
2. Click **Release GTIN** (or **GTIN Actions** → **Release**)
3. In the dialog:
   - **Company GTIN?** — If yes: Enter blocking period (e.g., 30 days), GTIN returns to pool after
   - **Third-Party GTIN?** — System immediately deletes (cannot be recovered)
4. Confirm

**For Company GTINs:**
- Released → Enters blocking period (protected)
- After blocking period → Automatically available in pool
- Can be assigned to new items

**For Third-Party GTINs:**
- Released → Deleted immediately (no recovery)
- Cannot be reassigned

## Barcode Printing and Usage

### Print Barcode Labels

1. Open **Item Card** with assigned GTIN
2. Click **Print Barcode** or **Print Label**
3. Select printer and format (Zebra, Avery, etc.)
4. Print label
5. Attach to product or packaging

### Scanning in Receiving

During purchase receipt:

1. Open **Purchase Receipt** page
2. Click **Barcode Lookup** or press Alt+B
3. Scan the item's GTIN
4. System looks up item by barcode
5. Auto-fills item no. and description
6. Continue with quantity entry

**Benefit:** Faster receiving, reduces data entry errors

### Scanning in Picking

During order picking:

1. On **Picking Worksheet** or list
2. Scan the item's GTIN from the carton/bin
3. System verifies it matches the order
4. Confirms picked quantity
5. Moves to next item

### Scanning at Dispatch

When loading trucks for delivery:

1. Scan manifest barcodes
2. System matches to delivery route
3. Confirms items in correct load
4. Verifies all orders for that stop loaded

## GTIN Configuration

### Clesen GTIN Pool Setup

**Administrator only:**

1. Open **Clesen Setup** (configuration page)
2. Locate **GTIN Management** section
3. Set:
   - **Pool Start** — First GTIN number in available range (e.g., 600000000001)
   - **Pool End** — Last GTIN number (e.g., 699999999999)
   - **Blocking Period (days)** — How long released GTINs are protected (e.g., 30)
   - **Next Available GTIN** — Current pointer in pool (auto-maintained)

**Result:** System tracks available GTINs and prevents duplicates

### Barcode Format Configuration

1. Open **Clesen Setup**
2. Set:
   - **Barcode Type** — UPC-A (standard), Code 128, EAN-13, etc.
   - **Check Digit Validation** — Enable/disable automatic validation
   - **Barcode Image Generator** — Which service/font for image generation

## Best Practices

✅ **DO:**
- Assign GTINs to all sellable items (enables scanning workflows)
- Use Company GTINs for items you own/brand
- Use Third-Party GTINs only for vendor-owned products
- Print and attach barcode labels during receiving
- Test barcodes with scanners before full deployment
- Document GTIN assignment policy (Company vs Third-Party rules)
- Review pool configuration quarterly
- Track released GTINs in blocking period
- Use bulk import for large item setups
- Include GTIN in item master data export

❌ **DON'T:**
- Manually enter GTINs for Company items (use auto-assign from pool)
- Reuse a GTIN before blocking period expires
- Release and immediately reassign same GTIN (violates blocking period)
- Assign third-party barcode as Company GTIN (licensing issue)
- Skip GTIN assignment (breaks scanning workflows)
- Use invalid 12-digit numbers (fails check digit validation)
- Delete GTIN records manually (use Release function)

## Common Scenarios

### Scenario 1: New Item Assignment

**Goal:** Set up 50 new rose varieties with barcodes

**Process:**
1. Create items in Item Master
2. Open Item List, select all 50 items
3. Bulk action: **Assign GTIN**
4. Type: Company (auto-assign from pool)
5. System assigns 50 sequential GTINs
6. Print barcode labels
7. Apply labels to items/packaging

**Result:** All items ready for scanning

### Scenario 2: Vendor Transition

**Goal:** Replace vendor ABC's barcodes with Company GTINs

**Process:**
1. Items currently have Third-Party GTINs from ABC
2. Select all items from vendor ABC
3. For each item:
   - Release Third-Party GTIN (deletes immediately)
   - Assign Company GTIN (new barcode from pool)
4. Reprint labels with new barcodes
5. Update packaging/labeling

**Result:** All items now use Clesen's GTIN pool (reusable barcodes)

### Scenario 3: GTIN Expiration/Blocking Period

**Goal:** GTINs released on 2026-03-15 become available again

**Process:**
1. Blocking period configured as 30 days
2. On 2026-04-14 (30 days later):
   - Released GTINs automatically return to available pool
   - Next new assignment draws from available pool
   - Blocking period automatically cleared in system
3. New items can be assigned these GTINs

**Result:** GTIN pool optimized for reuse

## Troubleshooting

### Issue: "GTIN Pool Exhausted"

**Cause:** All GTINs in configured pool range assigned or blocked

**Solution:**
1. Contact admin to expand pool range
2. Or reduce blocking period to free up GTINs faster
3. Or delete items with unused GTINs

### Issue: Barcode Scan Not Recognizing Item

**Cause:** GTIN not assigned, or barcode image corrupted

**Solution:**
1. Verify item has GTIN assigned
2. Regenerate barcode image
3. Reprint label
4. Test scan with barcode scanner

### Issue: Third-Party GTIN Shows as Deleted

**Cause:** Intended behavior — third-party GTINs delete immediately on release

**Solution:**
1. If GTIN needed, assign Company GTIN instead
2. Third-party GTINs cannot be recovered
3. Document GTIN before releasing if needed for records

### Issue: Check Digit Validation Failed

**Cause:** 12-digit GTIN entered is invalid

**Solution:**
1. Verify 12-digit number from vendor
2. Calculate correct check digit (online calculator or vendor confirmation)
3. Re-enter with correct digits
4. Or let system auto-generate Company GTIN

## Related Pages

- [[item-attributes]] — Bulk attribute assignment to items
- [[variant-templates]] — Variant template creation
