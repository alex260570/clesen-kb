---
title: Waste Recording
type: howto
tags: [warehouse, inventory, waste, loss, damage, compliance]
created: 2026-04-27
updated: 2026-04-27
sources: [waste-recording-guide.md]
---

# Waste Recording

System for tracking inventory loss, damage, and disposal to maintain accurate inventory records and identify waste reduction opportunities.

---

## What This Is

The Waste Recording system tracks inventory loss across the operation by:

1. **Recording losses** — All waste is logged to maintain accurate on-hand quantities
2. **Categorizing waste** — Reason codes identify source (production, warehouse, supplier damage, etc.)
3. **Linking to source** — Trace waste back to production orders or purchase documents
4. **Approval workflow** — Manager review and approval for waste records
5. **Analysis and reporting** — Identify patterns and cost reduction opportunities

**Key benefits:**

- Accurate inventory accuracy (on-hand reflects reality)
- Cost analysis for waste reduction
- Root cause tracking (production vs. warehouse vs. supplier)
- Regulatory compliance documentation
- Process improvement through pattern analysis

---

## When to Use It

### Record waste for these situations

| Situation | Category | Example |
|-----------|----------|---------|
| **Production error** | Production waste | Incorrect item mixed in batch; defective output |
| **Warehouse handling** | Warehouse waste | Dropped items; fork truck damage; handling error |
| **Damage on receipt** | Receiving damage | Damaged shipment from supplier; unsaleable returns |
| **Spoilage/expiration** | Expiration waste | Perishable item expired; natural plant decay |
| **Unknown loss** | Shrinkage | Inventory discrepancy with no identified cause |
| **Environmental disposal** | Environmental waste | Pruning waste; required regulatory disposal |
| **Quality rejection** | Quality waste | Items rejected by QC; deemed unsaleable |

### Do NOT use for these

- **Normal sales movements** → Use sales order processing
- **Transfers between facilities** → Use inventory transfer documents
- **Reclassification** → Use item journal reclassifications
- **Returns to supplier** → Record supplier return order
- **Items held for customer issues** → Don't record as waste until final decision

---

## How to Create a Waste Record

### Step 1: Start a waste entry

1. Navigate to **Inventory** > **Waste Transactions** or **Inventory** > **Waste Recording**
2. Click **New** to create a waste entry
3. Enter required information:
   - `Waste Date`: Today or date waste was discovered
   - `Item No.`: The item being wasted
   - `Quantity Wasted`: How many units in base unit of measure
   - `Unit of Measure`: Confirm the unit (Each, Packs, Cases, etc.)
   - `Waste Reason Code`: Select the waste category (see section below)
   - `Reported By`: Your name or username
   - `Facility/Location`: Where waste occurred (greenhouse, warehouse, shipping, etc.)
4. Click **OK** to create (status: **Draft**)

### Step 2: Add details

1. Click **Edit** to open full form
2. Fill in additional information:
   - `Description/Notes`: Explain what happened (e.g., "Dropped pallet of roses during transfer")
   - `Linked Document`: Link to production order or purchase receipt (if applicable)
   - `Quantity in Stock Before`: Inventory count before loss (for verification)
   - `Photo/Evidence` (optional): Attach image of damage if required

### Step 3: Submit for approval

1. Complete all required fields
2. Click **Submit** or **Post** (depends on configuration)
3. Status changes to **Pending Approval** (if manager approval required)
4. Manager receives notification

---

## Using Waste Reason Codes

### Common waste reason codes

| Code | Category | When to use | Example |
|------|----------|------------|---------|
| **PROD-ERR** | Production | Production process error | Wrong item in batch; mixing error |
| **PROD-DEF** | Production | Defective production output | Non-viable plants; quality fail |
| **WHSE-DROP** | Warehouse | Dropped or mishandled | Pallet dropped during transfer |
| **WHSE-COLL** | Warehouse | Collision or vehicle damage | Fork truck hit; equipment damage |
| **RCV-DAMAGE** | Receiving | Supplier shipment damage | Damaged upon arrival |
| **CUSTOMER-RETURN** | Quality | Customer return unsaleable | Item returned in poor condition |
| **EXPIRE** | Expiration | Item expired | Perishable past use date |
| **DECAY** | Spoilage | Natural spoilage | Plant material natural decay |
| **SHRINK** | Shrinkage | Unexplained loss | Inventory discrepancy |
| **ENVIRONMENTAL** | Disposal | Regulatory disposal | Pruning waste; regulated material |
| **QUALITY-REJECT** | Quality | QC rejection | Failed quality inspection |
| **UNKNOWN** | Other | Unknown cause | Can't determine root cause |

---

## Linking Waste to Source

### Why link to source documents

Linking traces waste back to:
- **Production order** — Identify if specific production run had quality issues
- **Purchase receipt** — Identify if supplier shipment was damaged
- **Sales order** — Trace customer-related losses

### How to link

1. On waste record, click **Link to Document**
2. Select document type:
   - **Production Order** — Link to production for output quality issues
   - **Purchase Receipt** — Link to receipt for supplier damage
   - **Sales Order** — Link to order for customer-related waste
3. System shows available documents
4. Select the relevant document
5. Link is established and saved

---

## Waste Approval Workflow

### When approval is required

Manager approval is required for:
- Large quantities (above threshold)
- High-value items
- Unusual waste reasons
- Recurring patterns

### Approval process

1. Waste record submitted
2. Manager receives notification
3. Manager reviews details:
   - Is quantity reasonable?
   - Is reason code appropriate?
   - Is linked document correct?
4. Manager approves or rejects
5. If approved → Posted to inventory ledger
6. If rejected → Returns to you with comments

### Reviewing rejected waste

1. Check manager's comments
2. Correct any errors (quantity, reason code, documentation)
3. Resubmit for approval

---

## Waste Reporting

### Waste report by type

1. Navigate to **Reports** > **Waste Report** or **Reports** > **Waste Analysis**
2. Select parameters:
   - **Date range** — Period to report on
   - **Facility** — Specific location (greenhouse, warehouse, etc.)
   - **Waste Reason** — Specific reason code or all
   - **Item** — Specific item or all
3. Report shows:
   - Total quantity wasted by category
   - Cost impact (quantity × unit cost)
   - Trend vs. previous period
   - Top waste items

### Waste trends analysis

1. Navigate to **Reports** > **Waste Trends**
2. View waste by:
   - **Over time** — Identify patterns (seasonal, increasing, etc.)
   - **By location** — Identify problem facilities
   - **By reason** — Top waste causes
   - **By item** — Problem items
3. Use for process improvement planning

---

## Troubleshooting

### "Item not found" error

**Problem:** Item number doesn't exist in system.

**Solutions:**
1. Verify item number is correct
2. Search for the item to find correct number
3. If item doesn't exist, add to system first
4. Try again with correct item number

### Cannot select waste reason code

**Problem:** Reason code dropdown is empty or limited.

**Solutions:**
1. Check with supervisor for available codes
2. Select "UNKNOWN" if unsure
3. Document reason in notes field
4. Report to IT if codes are missing

### Waste stuck in Pending Approval

**Problem:** Waste record not being reviewed by manager.

**Solutions:**
1. Check manager's availability (vacation, etc.)
2. Contact manager directly
3. Request escalation to backup manager
4. If urgent, reach out through management chain

---

## FAQ

**Q: Do I need approval for every waste entry?**
A: Only if your company requires it. Small quantities may post automatically; large quantities require approval.

**Q: Can I undo a posted waste entry?**
A: Generally no. Once posted, it affects inventory ledger. To correct, create an adjustment entry.

**Q: How do I know the cost impact of waste?**
A: Waste reports show quantity × standard cost. Check Waste Analysis report.

**Q: What if I discover waste days later?**
A: Record the waste with the date it actually occurred (not today). Manager will verify timing during approval.

**Q: Can I combine multiple waste items into one record?**
A: No. Each item type gets its own record so you can track by item.

**Q: Who can review waste reports?**
A: Typically managers and finance staff. Check with your supervisor for access.

---

## Related Pages

- [[purchase-receipt-overview]] — Receiving and initial quality checks
- [[crop-inspection]] — Formal quality assessment process
- [[bin-management]] — Inventory management to prevent damage
