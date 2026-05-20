---
title: Return Reason Codes
type: business-process
tags: [sales, returns, concepts]
created: 2026-05-20
updated: 2026-05-20
sources: [return-reason-adjustment-user-guide.md]
---

# Return Reason Codes

## What they are

A **Return Reason Code** is the code that explains why a customer returned goods (for example, `DAMAGED`, `WRONG-ITEM`). Reason codes are used for reporting, analysis, and understanding return patterns.

## Key records and fields

### Sales Return Order Line

When you receive a return, the `Return Reason Code` is recorded on the sales return order line. For lines that have not yet been received, you can edit this code directly on the document.

For lines that **have** been received, the reason code is locked into posted records and cannot be changed from the document. Use the [[adjust-return-reason-code|Adjust Return Reason Code (Posted)]] function to correct it.

### Posted Return Receipt Line

When a return order line is received into inventory, the system creates a **Posted Return Receipt Line** — a permanent record of that receipt. The reason code at the time of receipt is recorded here.

### Value Entry

The system also creates a **Value Entry** — the financial/inventory ledger record tied to the posted receipt. The reason code is stored here as well for reporting and analysis.

## Maintaining accuracy

Because reason codes drive returns analysis and business decisions (such as customer credits or vendor claims), it is important they are accurate.

If a return is received with the wrong reason code:
- Use [[adjust-return-reason-code|Adjust Return Reason Code (Posted)]] to correct the posted records
- This updates the sales line, posted receipt line, and value entry all at once
- No quantities, amounts, or inventory are affected — only the reason code is changed

If you need to change anything other than the reason code (e.g., quantity or amount), reverse the receipt instead.
