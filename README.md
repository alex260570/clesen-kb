# Internal Knowledge Wiki

This repository publishes the `wiki` folder as a Quartz static site for internal readers. The Obsidian vault remains the source of truth, and Cloudflare Pages/Access provides hosting and SSO protection.

## Local Development

Requirements:

- Node.js 22 or newer
- npm 10.9.2 or newer

Install dependencies:

```sh
npm install
```

Run a local preview:

```sh
npm run dev
```

Build the production site:

```sh
npm run build
```

Preview using the production build command with a local server:

```sh
npm run preview
```

Quartz writes generated files to `public/`.

## Publishing Scope

The publishing rule is folder-based:

- Publish everything under `wiki/`.
- Exclude everything outside `wiki/`.
- Do not apply draft/private folder exclusions inside `wiki/` for the MVP.
- Treat `raw/`, root-level notes, Obsidian settings, and tool metadata as source-only material.

Safety checks run automatically before and after production builds:

```sh
npm run check:scope
npm run check:links
npm run check:fixtures
```

See `docs/publishing-policy.md` for the full policy.

Cloudflare Pages should use:

```text
Build command: npm run build
Output directory: public
```

## Smoke Test Checklist

After `npm run build`, verify:

- Home page builds from `wiki/index.md`.
- Folder navigation lists `business-processes` and `howto`.
- Search index is generated from `wiki` content.
- Wikilinks render on representative pages.
- Tags render on the home page.
- Graph, backlinks, and table of contents are present on note pages.
- Cloudflare preview deployments are protected with Cloudflare Access before any shared preview launch.
