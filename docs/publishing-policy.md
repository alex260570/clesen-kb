# Publishing Policy

## Rule

The MVP publishes by folder:

- Everything under `wiki/` is intended for the internal website.
- Everything outside `wiki/` is excluded from publishing and search.
- The `raw/` folder, root-level notes, `.obsidian/`, and local agent/tool metadata are never published.

## Published Content Examples

Published:

```text
wiki/index.md
wiki/business-processes/availability-system.md
wiki/howto/counting/counting-process.md
```

Excluded:

```text
raw/*.md
index.md
log.md
.obsidian/**
.claude/**
.claudian/**
.firecrawl/**
```

## Drafts And Private Notes

There are no draft/private folders inside `wiki/` for the MVP. If a future workflow needs drafts, keep them outside `wiki/` until Phase 1 checks are extended with a specific exclusion rule.

If a note inside `wiki/` has `publish: false` or `draft: true`, the build fails. This catches accidental contradictions in the publishing rule.

## Attachments

Published notes may link or embed local assets only when those assets are under `wiki/`.

Allowed:

```md
![Process screenshot](./images/process.png)
![[images/process.png]]
```

Blocked:

```md
![Private screenshot](../raw/screenshot.png)
![[../raw/screenshot.png]]
```

## Automated Checks

`npm run build` runs:

```text
prebuild  -> publish scope check + broken link warning report
build     -> Quartz build from wiki/
postbuild -> generated search index audit
```

The search index audit confirms generated entries map back to files under `wiki/`.

Broken links are warning-only for the MVP because the current content set contains known placeholder/renamed wikilinks. Use `npm run check:links:strict` when the broken-link policy is changed to strict.
