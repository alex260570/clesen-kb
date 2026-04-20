# Clesen KB — Schema

## About This Wiki

This is an **LLM-maintained knowledge base** for Clesen Wholesale operations. The pattern: sources are added to `raw/`, the LLM builds and maintains structured wiki pages that compound over time.

- **Raw sources** (`raw/`) — source documents from SharePoint. Immutable. Never modified by the LLM.
- **Wiki** (`wiki/`) — LLM-written markdown pages. Structured, interlinked, always current.
- **This file** — tells the LLM how to operate the wiki.

The human's job: curate sources, direct the analysis.
The LLM's job: summarize, cross-reference, file, maintain consistency.

## Domain

Topics this wiki covers:

- **Picking Processes** — master picking, supermarket picking, single-order picks, cart transfer, delicate item handling
- **Warehouse Operations** — counting, bin management, receiving, shipment, escalations
- **Sales & Orders** — order entry, sales planning, availability, reservations, move lines
- **Business Central SOPs** — step-by-step processes for BC workflows (production orders, broker workspace, etc.)
- **IT Support** — troubleshooting guides, common issues and solutions
- **CRM** — lead management, activity tracking

## Wiki Structure

```
wiki/
├── howto/           # Step-by-step guides and numbered procedures
├── concepts/        # Background concepts, overviews, how-it-works explanations
├── issues/          # Known issues with Symptoms / Cause / Solution sections
└── overviews/       # Broad topic summaries spanning multiple processes
```

## Page Frontmatter

Every wiki page must have YAML frontmatter:

```yaml
---
title: Page Title
type: howto | concept | issue | overview
tags: []
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: []
---
```

`sources` lists filenames from `raw/` that contributed to this page (e.g., `supermarket-picking-process.md`).

## Session Start

At the start of every session:
1. Read `index.md` to orient yourself — understand what is already covered
2. Read the last 5–10 entries of `log.md` to see recent activity

## Workflows

### Ingest

When new files appear in `raw/` that are not yet reflected in `index.md`:

1. Read each new source document fully
2. Write focused wiki pages in the appropriate `wiki/` subfolder — one page per distinct process or concept
3. Update existing related pages — add `[[wikilinks]]`, update outdated claims, flag contradictions
4. Update `index.md` — add a row for every new or significantly updated page
5. Append to `log.md`: `## [YYYY-MM-DD] ingest | filename`

A single source typically produces 1–3 wiki pages. Prefer concise, scannable pages over long ones. Use `[[wikilinks]]` generously for cross-references.

### Lint

When asked for a health check:

1. Scan all wiki pages
2. Identify: contradictions between pages, orphan pages (no inbound links), missing cross-links, stale content superseded by newer sources
3. Report findings and fix approved issues
4. Append to `log.md`: `## [YYYY-MM-DD] lint | Health check — N issues found, M fixed`

## Conventions

- **File names**: `kebab-case.md` (e.g., `supermarket-picking-process.md`)
- **Prefer updating** existing pages over creating new ones when the topic is already covered
- **Wikilinks**: Add `[[wikilinks]]` generously — they power cross-referencing
- **Raw sources are immutable**: Never edit any file in `raw/`
- **Always** update `index.md` and `log.md` after every ingest
- **Issues pages**: Always include "Symptoms", "Cause", "Solution" sections
- **How-to pages**: Always include numbered steps
