---
title: Production Order Management
type: howto
tags: [production, orders, management, manufacturing]
created: 2026-04-21
updated: 2026-04-21
sources: [prod-order-management-user-guide.md]
---

# Production Order Management

The Production Order system controls the entire lifecycle of plant production, from initial planning through finished goods output.

## Status Progression

Production orders move through five distinct statuses:

| Status | Purpose | Can Edit | Can Post |
|--------|---------|----------|----------|
| **Simulated** | Testing and planning scenarios | Yes | No |
| **Planned** | Approved for planning | Yes | No |
| **Firm Planned** | Committed production (safety calculated) | Yes | No |
| **Released** | Active production | Limited | Yes |
| **Finished** | Completed, historical reference | No | No |

**Key Point:** Safety quantity is only calculated when transitioning TO Firm Planned status.

## Creating Production Orders

### Method 1: Manual Creation
1. Navigate to **Manufacturing → Production Orders → Planned Production Orders**
2. Click **+ New**
3. Fill in:
   - **Source Type:** Item
   - **Source No.:** Item to produce
   - **CLE Requested Quantity:** Customer order quantity (without safety)
   - **Location Code:** Production facility
   - **Due Date:** Completion date
4. System auto-calculates components (BOM) and routing

### Method 2: Planning Worksheet
1. Navigate to **Manufacturing → Planning → Planning Worksheet**
2. Click **Actions → Calculate Regenerative Plan**
3. Set filters and options
4. Click **OK** to generate planning lines
5. Review suggestions
6. Click **Carry Out Action Message** to create orders

### Method 3: From Sales Order
1. Open **Sales Order**
2. Select sales line
3. Click **Line → Functions → Create Prod. Order**
4. Select initial status and click **OK**
5. System creates linked production order

## Understanding Quantity Management

### Requested Quantity vs. Safety Quantity

**Requested Quantity:** Customer order quantity (without any buffer)

**Safety Quantity (Overstart):** Calculated buffer for expected losses
```
Safety Qty = Requested Qty × Item's Overstart %

Example:
  Requested Qty: 1000 units
  Item Overstart %: 3%
  Safety Qty: 30 units (1000 × 3%)
  Total Production Qty: 1030 units
```

### When Safety is Calculated
- **Created in Planned status:** Only requested quantity
- **Changed TO Firm Planned:** Safety automatically calculated and added
- **During Production:** Safety reduces as scrap is posted
- **At Final Phase:** Remaining safety typically released as finished goods

### Manual Safety Adjustment
**Authorization Required:** Must be in Safety Adjustment Authorization Group

1. Open **Released Production Order**
2. Click **Actions → Adjust Safety Quantity**
3. Enter **New Safety Quantity**
4. Click **OK**

System validates that new safety % doesn't exceed reasonable thresholds.

## Production Order Fields

### Critical Header Fields
- **CLE Requested Quantity** — Original customer order quantity
- **Quantity** — Total production quantity (includes safety)
- **CLE Safety Qty.** (on line) — Current safety buffer
- **Remaining Quantity** — Not yet posted as output
- **Finished Quantity** — Total output posted
- **Current Routing Status** — Current production phase
- **CLE Blooming Stage** — Current plant blooming stage (if applicable)

### Routing and Operations

Routing defines the sequence of production steps:

**Routing Link Codes:** Group operations into phases
- **PREP** — Preparation
- **POT** — Potting/Planting
- **GROW** — Growing
- **QC** — Quality Control
- **FIN** — Finishing

Production tasks are tied to routing phases. **Current Routing Status** shows which phase is active.

## Common Workflows

### Task 1: Create and Release a Production Order
1. Create order in **Planned** status
2. Enter **CLE Requested Quantity**
3. Change status to **Firm Planned** (safety calculated)
4. Assign **CLE Prod. Order Task List** (if using tasks)
5. Change status to **Released** (begins production)

### Task 2: Split Order for Multiple Shipments
1. Open **Released Production Order**
2. Click **Actions → Split Production Order**
3. Enter **Split Quantity** and **New Shipment Date**
4. Click **OK**
5. System creates new order with portion, reduces original

**Important:** Check component availability for both orders after split.

### Task 3: Adjust Safety Mid-Production
1. Open **Released Production Order**
2. Click **Actions → Adjust Safety Quantity**
3. Enter new safety amount
4. **Check component availability** - may need additional components
5. Click **OK**

### Task 4: Complete and Finish Order
1. Verify **Remaining Quantity** = 0 or acceptable variance
2. Verify all tasks completed
3. Click **Actions → Functions → Change Status**
4. Select **Finished**
5. Click **OK**

**Warning:** Finishing is permanent. Cannot reopen.

## Blooming Stage Integration

Plants automatically assigned blooming stages when output posted based on:
- Current routing phase (GROW, QC, etc.)
- Item's blooming stage configuration
- Production output

**CLE Blooming Stage** field shows current stage. Updates automatically during output posting.

## Production Tasks

Production orders can have associated task checklists:

- **Headlines** — Section headers (automatically approved)
- **Tasks** — Actual work items requiring completion
- **Information** — Reference notes and instructions

Tasks are released/approved by managers before staff can complete them. See [[prod-order-tasks-staff]] for task completion details.

## Key Codeunits

- **Codeunit 50007** — CLE Production Management (main business logic)
- **Codeunit 50119** — CLE Post Scrap Capacity Entry (scrap posting)

## Best Practices

✓ Use Planning Worksheet for regular production (more efficient than manual)  
✓ Enter Requested Quantity first, let system calculate total with safety  
✓ Assign task templates when creating Firm Planned orders  
✓ Set realistic due dates accounting for routing time  
✓ Follow standard status progression (don't skip Firm Planned)  
✓ Release only when ready to start production  
✓ Verify component availability before releasing  
✓ Post output regularly during production  

## Related Pages

- [[prod-order-posting-staff]]
- [[prod-order-posting-manager]]
- [[prod-order-tasks-staff]]
