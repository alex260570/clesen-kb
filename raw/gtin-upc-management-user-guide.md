# GTIN / UPC management

> **Version:** 1.0
> **Last Updated:** 2026-03-10
> **Author:** Alexander Thiel
> **Audience:** Operations Staff

## Table of contents

- [Overview](#overview)
- [When to use this process](#when-to-use-this-process)
- [Prerequisites](#prerequisites)
- [How to assign a GTIN to an item](#how-to-assign-a-gtin-to-an-item)
- [How to insert a third-party GTIN](#how-to-insert-a-third-party-gtin)
- [How to release a GTIN from an item](#how-to-release-a-gtin-from-an-item)
- [How to regenerate a barcode image](#how-to-regenerate-a-barcode-image)
- [How to import GTINs from Excel](#how-to-import-gtins-from-excel)
- [How to view all GTIN assignments](#how-to-view-all-gtin-assignments)
- [Field reference](#field-reference)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [SOP document](#sop-document)

---

## Overview

The GTIN (Global Trade Item Number) management system assigns and tracks UPC barcodes for inventory items in Business Central. Each item can hold one GTIN, which is stored as an 11-digit code (the 12th digit is the check digit, calculated automatically).

When a GTIN is assigned, the system:

- Records the assignment in the **CLE UPC Code Assignment** table
- Generates a UPC-A barcode image and stores it on the item card

GTINs are pooled and reused. When an item is discontinued, its GTIN is released back into the pool after a configurable blocking period, then made available for reassignment.

There are two types of GTINs:

- **Company GTINs** — drawn from Clesen's internal code pool; managed by the blocking period and reuse rules
- **Third-party GTINs** — codes owned by a vendor or external party; entered manually and deleted immediately when released (no blocking period)

---

## When to use this process

- A new item is being set up and needs a barcode
- An item's GTIN needs to be replaced (release old, assign new)
- A vendor-supplied item comes with its own UPC and that code needs to be recorded
- You need to bulk-load a batch of GTIN codes from a spreadsheet

---

## Prerequisites

- The **GTIN Assignment** module must be active in Clesen Setup (`GTIN Assignment active` = Yes)
- To assign a company GTIN, at least one unassigned code must exist in the pool (or a released code whose blocking period has expired)
- To release a GTIN, the item must be **Sales Blocked** first
- To insert a third-party GTIN, the item must not already have a GTIN assigned

---

## How to assign a GTIN to an item

1. Open the **Item Card** for the item.
2. In the action bar, navigate to **GTIN Management** > **Assign GTIN**.
3. The system automatically selects the next available code from the pool and assigns it.
4. A barcode image is generated and saved to the item.
5. A confirmation message appears: *New GTIN assigned.*

The `GTIN` field and barcode image on the item card update immediately.

> **Note:** If the item previously had a GTIN that was later released, the system attempts to restore the same code. If that code has since been assigned to another item, a new code is assigned instead and the system shows a message indicating the previous code's current owner.

---

## How to insert a third-party GTIN

Use this when a vendor or supplier provides their own UPC code and you need to record it on the item.

1. Open the **Item Card** for the item.
2. In the action bar, navigate to **GTIN Management** > **Insert 3rd Party GTIN**.
3. A dialog box appears. Enter the full 12-digit UPC code (including the check digit).
4. Click **OK**.

The system validates:

- The code is exactly 12 digits long
- The check digit (last digit) is mathematically correct

If both checks pass, the code is saved to the item. Third-party GTINs are flagged separately and are deleted outright when released — they are not subject to the blocking period.

> **Warning:** You cannot insert a third-party GTIN if the item already has a GTIN assigned. Release the existing GTIN first.

---

## How to release a GTIN from an item

Releasing a GTIN removes it from the item and returns it to the pool after a blocking period.

1. On the **Item Card**, set `Sales Blocked` to **Yes** before releasing. The system requires this to prevent GTINs from being released on active items.
2. In the action bar, navigate to **GTIN Management** > **Release assigned GTIN**.
3. Confirm the prompt: *Do you really want to unassign the item's GTIN?*
4. Click **Yes**.

For **company GTINs**: the code is marked as released and cannot be reassigned until the blocking period (configured in Clesen Setup) expires.

For **third-party GTINs**: the code is deleted from the system immediately.

The `GTIN` field and barcode image on the item card are cleared.

---

## How to regenerate a barcode image

If the barcode image is missing or corrupted, you can regenerate it without changing the GTIN.

1. Open the **Item Card** for the item.
2. In the action bar, navigate to **GTIN Management** > **Create Barcode**.
3. The system fetches a new UPC-A barcode image from the barcode service and saves it to the item.

> **Note:** This requires an internet connection. The system calls an external barcode generation service at `barcodeapi.org`.

---

## How to import GTINs from Excel

Use the bulk import to load new GTIN codes into the pool or to pre-assign codes to items in one operation.

### Step 1: Download the import template

1. Search for **CLE GTIN Assignments** in the Business Central search bar.
2. Click **Export Excel Template** in the action bar.
3. An Excel file downloads with two columns: `GTIN` and `Item No.`

### Step 2: Fill in the spreadsheet

The template has a header row (row 1) that is skipped during import. Enter data starting from row 2.

Two use cases:

- **Add codes to the pool only** — fill in `GTIN`, leave `Item No.` blank
- **Add codes and assign to items** — fill in both `GTIN` and `Item No.`

> **Note:** Enter the 11-digit GTIN code (without the check digit) in the `GTIN` column. The required length is configured in Clesen Setup.

### Step 3: Import the file

1. On the **CLE GTIN Assignments** page, click **Import Excel file**.
2. Select your filled-in spreadsheet.
3. The system processes each row and validates it.

If all rows import successfully, the system shows: *All records were imported successfully.*

If some rows fail, the **Bad GTIN Assignments** page opens automatically showing the rows that could not be imported and the reason for each failure. See [Troubleshooting](#troubleshooting) for how to resolve each error.

---

## How to view all GTIN assignments

1. Search for **CLE GTIN Assignments** in the Business Central search bar.

The list shows every GTIN in the pool with its current status:

- **GTIN** — the code
- **Item No.** — the item currently holding this code (blank = available)
- **Date assigned** — when the code was last assigned
- **Code released** — whether the code is in a blocking period after being unassigned
- **Code released after** — the date when the code becomes eligible for reuse
- **Prev. Item Assignment** — the last item that held this code before release

This page is read-only. Records are managed through the item card actions and the Excel import.

---

## Field reference

### Item card GTIN fields

| Field            | Description                                                      |
|------------------|------------------------------------------------------------------|
| `GTIN`           | The assigned GTIN code (read-only; managed through actions)      |
| `UPC Barcode`    | The barcode image generated from the GTIN                        |
| `Rollup Item No.`| Links a sales-blocked item as a component of a rollup bundle item |

### GTIN Assignment list columns

| Column                    | Description                                                                    |
|---------------------------|--------------------------------------------------------------------------------|
| `GTIN`                    | The 11-digit code stored in the system                                         |
| `Item No.`                | Item currently assigned to this code; blank means the code is available        |
| `Date assigned`           | Date the code was most recently assigned to an item                            |
| `Code released`           | `Yes` if the code was unassigned and is in the blocking period                 |
| `Code released after`     | Date after which the code can be reassigned to a new item                      |
| `Prev. Item Assignment`   | Item number that last held this code, for historical reference                 |

---

## Troubleshooting

### Error: "No free codes available"

**Cause:** The GTIN pool has no unassigned codes and no released codes whose blocking period has expired.

**Solution:** Import additional GTIN codes using the Excel import, or wait until the blocking period on released codes expires. Check the **CLE GTIN Assignments** list for codes with `Code released = Yes` and their `Code released after` dates.

---

### Error: "You cannot assign a GTIN to a roll-up component"

**Cause:** The item is linked to a rollup bundle item via the `Rollup Item No.` field. Components of rollup items do not get their own GTIN.

**Solution:** GTINs are assigned to the rollup bundle item, not to its components. Open the rollup item and assign the GTIN there.

---

### Error: "This item has no GTIN assigned"

**Cause:** You clicked **Release assigned GTIN** on an item that does not have a GTIN.

**Solution:** Nothing to release. No action needed.

---

### Error: "GTIN already assigned"

**Cause:** You tried to insert a third-party GTIN on an item that already has a GTIN.

**Solution:** Release the existing GTIN first using **Release assigned GTIN**, then insert the third-party code.

---

### Error: "The inserted Code does not have the correct length. GTIN Codes need to have a length of exactly 12 digits."

**Cause:** You entered fewer or more than 12 digits in the third-party GTIN dialog.

**Solution:** Enter the full 12-digit UPC-A code including the check digit.

---

### Error: "Check digit not correct. Please check the entered code."

**Cause:** The 12th digit of the third-party GTIN you entered does not match the calculated check digit.

**Solution:** Verify the code against the physical barcode or vendor documentation. The last digit of a UPC-A code is always a mathematically derived check digit.

---

### Error: "This Code already exists. It is fixed assigned to item X"

**Cause:** You tried to insert a third-party GTIN that is already recorded in the system and assigned to another item.

**Solution:** The same UPC cannot be assigned to two items. Verify you have the correct code.

---

### Import error: "GTIN has the wrong length. It must contain X numbers"

**Cause:** A GTIN value in the import spreadsheet does not match the required length configured in Clesen Setup.

**Solution:** Correct the GTIN in the spreadsheet to the required number of digits and re-import.

---

### Import error: "Number already exists"

**Cause:** A GTIN-only row (no item number) in the import spreadsheet contains a code that is already in the pool.

**Solution:** The code is already available — no action needed. Remove the duplicate row from your spreadsheet if you want a clean re-import.

---

### Import error: "GTIN is already assigned to Item No. X"

**Cause:** A GTIN+item row in the import specifies a GTIN that is currently assigned to a different item.

**Solution:** Release the GTIN from item X first, then re-import. Or verify you have the correct GTIN code.

---

### Import error: "GTIN is blocked until [date] and cannot be used"

**Cause:** The GTIN was recently released from another item and is still in the blocking period.

**Solution:** Wait until the date shown, then re-import the row.

---

### Import error: "Item No. does not exist"

**Cause:** The item number in the import spreadsheet does not exist in Business Central.

**Solution:** Correct the item number in the spreadsheet and re-import.

---

### Import error: "Item does already have a GTIN, or numbering is handled by Business Central"

**Cause:** The item in the import row already has a GTIN assigned, either from a previous import or from the item card.

**Solution:** If the item needs a different GTIN, release the current one from the item card first. If the current assignment is correct, remove the row from the import file.

---

### Release blocked: item is not Sales Blocked

**Cause:** The system requires the item to be sales blocked before releasing its GTIN.

**Solution:** On the item card, set `Sales Blocked` to **Yes**, then try **Release assigned GTIN** again.

---

## FAQ

**What is the difference between a GTIN and a UPC?**

They refer to the same thing in this context. UPC-A (Universal Product Code) is a 12-digit format that is a subset of GTIN (Global Trade Item Number). The system stores the 11-digit body of the code; the 12th digit (check digit) is calculated and appended when generating the barcode.

**Why is there a blocking period after releasing a GTIN?**

GS1 (the standards body) recommends not reusing a GTIN on a different product within a certain time window. This prevents confusion in supply chains, retailer systems, and databases that may have cached the previous product's information under that code.

**What happens if I release a third-party GTIN?**

Third-party GTINs are deleted immediately with no blocking period, since the code is owned by the external party and not part of Clesen's pool.

**Can an item have more than one GTIN?**

No. Each item holds one GTIN at a time. If you need to change a GTIN, release the existing one and assign a new one.

**Why does the barcode image disappear when I release the GTIN?**

The barcode image is generated from the GTIN code. When the GTIN is removed, the image is cleared along with it. Regenerate a new barcode after assigning a new GTIN.

**What is a rollup item?**

A rollup item is a sales-blocked bundle item whose GTIN represents a combination of component items (for example, a flat of plants sold as a single barcode). Component items linked via `Rollup Item No.` are not assigned their own GTINs — only the rollup item gets one.

---

## Related documents

- [[bin-reclassification-user-guide]]
- [[variant-reclassification-user-guide]]
- [[item-substitution-user-guide]]

---

## SOP document

The full SOP for this process is available on SharePoint:
[View SOP PDF](https://clesenwholesale.sharepoint.com/sites/SOP/Company_Knowledge_Base/Scribe/SOP/gtin-upc-management-user-guide.pdf)
