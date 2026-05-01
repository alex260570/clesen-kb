# Pilot Notes

## Pilot Goal

Validate the magic moment: an internal user opens the wiki URL, passes Cloudflare Access, searches for a topic, and reaches a useful linked note in under 30 seconds.

## Pilot Users

Add 5-10 internal users before launch:

```text
TBD
```

## Test Script

Ask each pilot user to complete:

1. Open `https://clesen-wiki.pages.dev`.
2. Sign in through Microsoft Entra ID if prompted.
3. Search for one assigned topic.
4. Open the best matching result.
5. Follow one related link or backlink.
6. Report whether they found the target information in under 30 seconds.

## Suggested Topics

- invoice approval workflow
- counting process
- availability system
- CRM lead management
- shipping worksheet

## Results

| User            | Access result | Search topic               | Found in under 30s? | Notes                                                                                   |
| --------------- | ------------- | -------------------------- | ------------------- | --------------------------------------------------------------------------------------- |
| Alexander Thiel | Passed        | Initial login/deploy check | TBD                 | Confirmed Microsoft SSO login on 2026-05-01 after Entra Graph permissions were granted. |
