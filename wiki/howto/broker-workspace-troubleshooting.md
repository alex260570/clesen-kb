---
title: Broker Workspace - IT Troubleshooting
type: howto
tags: [broker-workspace, troubleshooting, IT, system-architecture]
created: 2026-04-21
updated: 2026-04-21
sources: [broker-workspace-it-troubleshooting-guide.md]
---

# Broker Workspace - IT Troubleshooting

Technical reference for Broker Workspace system issues and diagnostics.

## System Architecture

### Component Layers

**Presentation Layer:**
- Page 50086: Main workspace interface
- Page 50087: New PO line dialog
- Page 50088: Vendor change dialog
- Page 50094: Copy PO dialog

**Business Logic Layer:**
- Codeunit 50017: CLE Purchase Management
  - CreateWorksheet
  - ApplyWorksheetLineChange
  - UpdateDemand / UpdateSupply
  - Change vendor/date/quantity logic
  - Availability calculations

**Data Access Layer:**
- Table 50020: CLE Purch. Worksheet Line (temp planning)
- Table 50021: CLE Purch. Wrksht Log Entry (audit)
- Standard BC tables: Purchase Line, Sales Line, Item, Vendor

**Integration Layer:**
- CLE Availability Calculation (Codeunit) — Forecasting engine
- CLE Availability Management — Location filtering
- Standard BC Purch.-Post codeunit — Order creation

### Data Tables

**Table 50020: CLE Purch. Worksheet Line**

Purpose: Temporary storage for planning session

Key Fields:
- Entry No. — Auto-increment primary key
- Vendor No. — Vendor link
- Item No. — Item link
- Purchase Order No. — Linked PO (blank if new)
- Purch. Order Line No. — PO line number
- Purch. Line Quantity — Current PO quantity
- Purch. Line Quantity New — **Editable - Planned quantity**
- Purch. Line Quantity Adj. — Difference (New - Current)
- Demand Qty. — Sales order demand
- Qty. Available — Projected inventory
- Cum. Availability — Running total
- Requested Receipt Date — **Editable - Delivery date**
- User ID — Session isolation
- Line Modified — **Change flag**

Indexes:
- PK: Entry No.
- K2: User ID, Item No., Exp. Receipt Date

**Table 50021: CLE Purch. Wrksht Log Entry**

Purpose: Audit trail of all worksheet modifications

Fields:
- Entry No. — Auto-increment
- Worksheet Entry No. — FK to Table 50020
- User ID — Who made change
- Change — Change type (0-4)
- Item Description — Display
- Old Value — Before
- New Value — After
- Change Applied — Applied to PO?

Change Enum Values:
```
0 = New Order
1 = Quantity Change
2 = Date Change
3 = Vendor Change
4 = Move Line
```

## Common Issues and Solutions

### Issue 1: Slow Get Data Performance

**Symptoms:**
- Takes >2 minutes to load
- Browser timeout
- Incomplete data load

**Root Causes:**

1. **Too many items in filter**
   - Solution: Narrow item filter, use vendor filter

2. **Wide date range (>90 days)**
   - Solution: Limit to 60 days for routine planning

3. **Large transaction volume**
   - Check sales lines and purchase lines volume in date range

4. **Missing indexes**
   - Check:
     - Sales Line: Document Type, Shipment Date, Outstanding Qty
     - Purchase Line: Document Type, Expected Receipt Date, No.
     - Item Ledger Entry: Item No., Posting Date

**Performance Tuning:**

Create missing indexes:
```sql
CREATE NONCLUSTERED INDEX [IX_SalesLine_ShipmentDate_OutstandingQty]
ON [Sales Line] ([Shipment Date], [Outstanding Quantity])
INCLUDE ([No_], [Quantity])

CREATE NONCLUSTERED INDEX [IX_PurchLine_ExpectedReceipt_Item]
ON [Purchase Line] ([Expected Receipt Date], [No_])
INCLUDE ([Quantity], [Quantity Received])
```

### Issue 2: Availability Always Shows Zero

**Diagnostic Steps:**

1. **Check location filter in availability calculation**
   ```
   Debug: CLEAvailMgt.CreateActiveLocationFilter()
   Expected: Returns pipe-separated list like "LOC1|LOC2|LOC3"
   ```

2. **Verify inventory exists**
   ```sql
   SELECT [Item No_], [Location Code], SUM(Quantity) AS [Qty]
   FROM [Item Ledger Entry]
   WHERE [Item No_] = 'TESTITEM'
   GROUP BY [Item No_], [Location Code]
   ```

3. **Check CLE Availability Calculation codeunit**
   - Set breakpoint in CalculateItemAvailabilityForDate
   - Verify parameters: ItemNo, UOM, LocationFilter, Date
   - Step through supply/demand calculation

**Common Fixes:**
- Location marked inactive (check Location table setup)
- Item UOM conversion issue
- No purchase/sales orders in date range
- Availability calculation returning error

### Issue 3: Lines Not Appearing in Worksheet

**Symptoms:** Workspace opens but shows no lines or fewer lines than expected

**Diagnostic Steps:**

1. Check sales line filters:
   - Document Type = Order
   - Shipment Date in range
   - Outstanding Quantity > 0

2. Verify SQL query returns expected records

3. Check Item Type:
   ```
   Only Inventory items appear (not Service, Non-Inventory)
   ```

**Common Causes:**
- Line Type is not Item (could be G/L Account, Resource, etc.)
- Item Type is Service or Non-Inventory
- Outstanding Quantity = 0 (fully shipped/invoiced)
- Line has been deleted or archived

**Solution:** Verify sales lines meet all filter criteria. Review item card to ensure Type = Inventory.

### Issue 4: Apply Changes Fails

**Symptoms:**
- Apply button does nothing
- Error message appears
- Changes not reflected in POs

**Diagnostic Steps:**

1. Check if PO has been modified externally
   ```
   Verify hash of current PO vs. stored hash
   IF changed: User has external change alert
   ```

2. Verify purchase order still exists and isn't deleted

3. Check for validation errors by reviewing event log

**Common Causes:**
- PO was modified after worksheet created
- PO was deleted
- Quantity exceeds vendor limits
- Date violates business rules
- Permission issues

**Solution:**
- Refresh worksheet data and try again
- Resolve external changes first
- Review error message for specific issue

## Performance Optimization

### Large Orders (100+ Lines)

**Issue:** Get Data slow or move operations timeout

**Optimization Strategies:**

1. **Limit date range** to 30-45 days
2. **Filter by vendor** instead of showing all
3. **Use Supply Only filter** to reduce displayed lines
4. **Archive old worksheet data** periodically
5. **Create indexes** on key date fields

### Batch Processing

For bulk changes:
- Apply changes in batches of 50-100 lines
- Don't apply entire worksheet at once if very large
- Check each batch completed before proceeding

## Database Diagnostics

### Find Pending Changes

```sql
SELECT [User ID] AS Buyer,
       COUNT(*) AS [Pending Lines],
       SUM([Purch_ Line Quantity Adj_]) AS [Total Qty Change]
FROM [CLE Purch_ Worksheet Line]
WHERE [Line Modified] = 1
GROUP BY [User ID]
ORDER BY [Total Qty Change] DESC
```

### Find Stale Changes (>24 hours pending)

```sql
SELECT ws.[User ID], ws.[Item No_], ws.[Vendor No_],
       log.[Created DateTime] AS [Pending Since]
FROM [CLE Purch_ Worksheet Line] ws
INNER JOIN [CLE Purch_ Wrksht Log Entry] log
    ON ws.[Entry No_] = log.[Worksheet Entry No_]
WHERE ws.[Line Modified] = 1
    AND log.[Change Applied] = 0
    AND log.[Created DateTime] < DATEADD(hour, -24, GETDATE())
ORDER BY log.[Created DateTime]
```

### Find Large Order Changes

```sql
SELECT log.[User ID] AS Buyer,
       log.[Item Description],
       CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT) AS [Qty Increase]
FROM [CLE Purch_ Wrksht Log Entry] log
WHERE log.[Change] = 1  -- Quantity Change
    AND CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT) > 0
    AND (CAST(log.[New Value] AS INT) - CAST(log.[Old Value] AS INT)) * 100 > 10000
ORDER BY [Qty Increase] DESC
```

## Configuration Requirements

### User Setup

Each purchasing agent needs:
- **User ID** — BC login
- **Salesperson/Purchaser Code** — Links to items/vendors
- **Purchasing Agent** checkbox — Enabled

### Vendor Configuration

For vendor to appear in buyer's filters:
- Vendor Card: Purchaser Code = Buyer's Code
- Vendor not blocked
- Vendor has active purchase items

### Item Configuration

For item to appear in buyer's filters:
- Item Type = Inventory
- Item Card: Purchasing Code = Buyer's Code
- Item Replenishment = Purchase (if "Brokered Items only" checked)

## Related Pages

- [[broker-workspace]] — Buyer workflow guide
- [[broker-workspace-manager]] — Manager oversight guide
- [[availability-troubleshooting]] — Availability calculation troubleshooting
