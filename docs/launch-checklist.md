# Launch Checklist

## Content Safety

- [ ] `npm run check:scope` passes.
- [ ] `npm run check:links` passes or known broken links are accepted for pilot.
- [ ] `npm run build` passes.
- [ ] Generated `public/static/contentIndex.json` contains only `wiki/` content.
- [ ] Published pages do not include `raw/`, root notes, `.obsidian/`, or tool metadata.
- [ ] Published attachments are stored under `wiki/`.

## Access

- [ ] Production `pages.dev` URL is protected by Cloudflare Access.
- [ ] Preview deployments are protected by Cloudflare Access.
- [ ] Allowed `clesen.com` user can access the site.
- [ ] Blocked or signed-out user is denied before content loads.

## Reader Smoke Test

- [ ] Home page loads.
- [ ] Folder explorer lists `business-processes` and `howto`.
- [ ] Search returns representative wiki pages.
- [ ] Wikilinks and backlinks work on representative pages.
- [ ] Graph view renders on the home page and note pages.
- [ ] Mobile navigation and search are usable.

## Rollback

- [ ] Previous successful Cloudflare Pages deployment is available.
- [ ] Deployment owner knows how to roll back in Cloudflare Pages.
- [ ] Access policy owner is documented before announcement.
