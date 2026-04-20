---
title: Counting Exception Handling
type: howto
tags: [counting, manager, exceptions]
created: 2026-04-20
updated: 2026-04-20
sources: [counting-exception-handling.md]
---

# Counting Exception Handling

Phase 5 of counting. Supervisors resolve counts with status **Assistance Required** via page 50127 **Inventory Count Posting**.

## When a Count Becomes an Exception

- Deviation exceeds the recount range threshold
- Second recount still has high deviation
- High-value adjustment (>$ threshold)
- Max recount limit reached

## Review Steps

1. **Understand the numbers** — Expected, Counted, Recounted (if any), adjustment, deviation %, $ value.
2. **Check history** — Click Show History; look at counter, timing, previous notes, patterns (same counter/location/item recurring?).
3. **Investigate root cause:**
   - Was count accurate? (counter confidence, bin organization)
   - Was expected wrong? (unposted receiving/picking/production)
   - System issue? (bin content not maintained, integration)
4. **Contact counter** if needed; verify physically if high value.

## Three Decision Actions

### Approve Adjustment
Count is accurate — post it. Document root cause in notes.

### Reject and Recount
Possible counter error — resets status back through release. Add instructions. Don't loop infinitely.

### Adjust Acceptable Limits
Count is accurate but thresholds are wrong for this item/category. Modify threshold for this case or future counts, then re-evaluate.

## Special Scenarios

- **Negative inventory correction** — approve; investigate root cause (over-picking without receipts, unposted data)
- **Zero expected, items found** — check for unposted receipts or misplaced items
- **Production order discrepancy** — talk to production supervisor; may reflect overproduction or unrecorded scrap
- **High-value (> $ threshold)** — require physical verification, two-person count, manager sign-off

## KPIs

- Exception rate <1%
- Approval rate >80% (accuracy even for exceptions)
- Average resolution time <24h

## See Also

[[counting-overview]], [[counting-process]], [[counting-dashboard]]
