# Product Vision - Clesen Knowledge Base

## 1. Vision & Mission

### Vision Statement

Internal knowledge should be available to the right people the moment they need it, without exposing source repositories or forcing readers into tools meant for authors.

### Mission Statement

Clesen Knowledge Base turns a private Obsidian vault into a secure, searchable, SSO-protected static website that preserves the vault as the source of truth.

### Founder's Why

The core insight is pragmatic: the knowledge already exists, but the access model is wrong. A private GitHub-backed Obsidian vault is excellent for authoring and version control, but it is a poor reader experience for broad internal audiences. Most readers do not need repository access, and granting it creates unnecessary operational and security friction.

This product is not trying to replace Obsidian, GitHub, or the company's identity provider. It respects the current system and adds a publishing layer around it. That is the right scope: keep writing where writing already works, publish only approved content, and let internal readers arrive through a familiar browser and SSO flow.

### Core Values

**Source of truth stays intact.** The Obsidian vault remains the canonical content store. Publishing should not create a second place where content has to be edited or reconciled.

**Reader access is not author access.** Readers should never need GitHub permissions merely to consume documentation. The publishing architecture must keep read access to the website separate from access to the private repo.

**Security is boring on purpose.** The site should use existing SSO and simple access policies rather than shared passwords, manual user lists, or custom authentication code.

**Publishing is reversible and inspectable.** Every build should make it clear what content was included. Drafts, private folders, and unpublished notes must be excluded before deployment and search indexing.

### Strategic Pillars

**Static first.** A static site is simpler, faster, cheaper, and easier to secure than a custom web application. Avoid a runtime backend unless a future workflow clearly requires it.

**SSO at the edge.** Let Cloudflare Access own admission to the site. Do not build custom login logic into the wiki.

**Pilot before migration.** Start with 10-20 notes and prove the build, access, and reader experience before broadening content.

**DNS optionality.** The launch path must work with the default `pages.dev` domain and can later support a single CNAME such as `wiki.company.com` without moving the whole DNS zone.

### Success Looks Like

In 12 months, the internal wiki is the trusted read-only destination for approved vault content. Internal users reach it through SSO, search finds the right note quickly, and the vault owner publishes by editing Obsidian and pushing to GitHub. The security team is comfortable because GitHub remains private, Cloudflare Access owns authentication, and unpublished notes never enter the built site or search index.

## 2. User Research

### Primary Persona

Jordan is an internal employee who needs context quickly: a decision record, a technical note, a process explanation, or a reference page. Jordan is comfortable with normal web search and navigation but does not want to learn GitHub, clone a repo, or request repository access. Their emotional state is usually task-driven: "I need the answer now." They will switch to this wiki if it is faster than asking someone, searching Slack, or waiting for access.

### Secondary Personas

The vault owner curates content and cares about protecting unpublished or sensitive notes. They need a workflow that fits Obsidian and GitHub rather than forcing manual reposting into a separate knowledge base.

The IT or security administrator cares about SSO, access scope, auditability, and avoiding unnecessary permissions. They need confidence that the public URL does not mean public content.

Internal contributors may suggest edits or new notes through existing repo or review workflows. They need clear publishing rules so they know what becomes visible.

### Jobs To Be Done

Functionally, readers need to search, browse, follow links, and trust that they are viewing the current approved version of internal knowledge. Emotionally, they want to feel unblocked and confident that the answer is official enough to use. Socially, they want to avoid asking repeated questions in public channels when the information already exists.

The vault owner needs to publish without duplicating work. They want the site to feel like an extension of the vault, not a new CMS. Security stakeholders need a clear boundary between the private source repository and the internal reader surface.

### Pain Points

The most severe pain is access mismatch: GitHub repository permissions are too powerful and too technical for simple readers. This happens every time a non-GitHub user needs the content and creates avoidable delays.

The second pain is content drift. If notes are copied manually to another system, the published version becomes stale or incomplete. The workaround looks easy once, then quietly turns into maintenance debt.

The third pain is weak access control. A shared password or informal link sharing may work for a tiny group but is not a durable internal publishing model.

### Current Alternatives & Competitive Landscape

GitHub access solves source visibility but grants the wrong kind of access to the wrong audience. Confluence or SharePoint can work as internal knowledge bases, but migration and duplication weaken the Obsidian source-of-truth model. Obsidian Publish is easy for Obsidian authors, but password-based access is not the right SSO posture for this use case. Doing nothing keeps the vault clean but leaves readers dependent on the vault owner.

### Key Assumptions to Validate

We assume internal readers will accept a `pages.dev` URL for the pilot because it avoids DNS work. Validate by testing with pilot users and stakeholders before asking for a custom subdomain.

We assume Cloudflare Access can integrate with the company's IdP under existing policy. Validate with IT before building the final deployment workflow.

We assume Quartz handles the vault's Obsidian syntax well enough for the first content set. Validate with notes that include wikilinks, images, callouts, tags, and backlinks.

We assume published content can be identified reliably with folders or frontmatter. Validate by running a private-content audit against the pilot notes.

We assume readers primarily need search and linked navigation rather than comments, permissions per page, or rich collaboration. Validate during the pilot.

### User Journey Map

Awareness begins when an internal user hears that the wiki exists or receives a link. Consideration is nearly instant: they click and either pass through SSO or are prompted by the company identity provider. First use should land them on a useful index or search surface, not a marketing page. The magic moment happens when they search a term, open the right note, and follow at least one related link without needing help. Habit formation happens when the wiki becomes faster than asking in chat. Advocacy happens when users start linking wiki pages in internal discussions.

## 3. Product Strategy

### Product Principles

The website is for reading, not authoring. Editing belongs in Obsidian and GitHub.

The first release should prove the access model before it tries to publish everything. Security and workflow confidence matter more than breadth.

Search must exclude anything unpublished. A beautiful site with a leaky index fails the product.

Configuration should be explicit. Publishing rules belong in folders, frontmatter, or build scripts that can be reviewed.

### Market Differentiation

The differentiated value is the combination of Obsidian-native publishing and enterprise-friendly access. GitHub Pages private visibility couples readers to GitHub permissions. Obsidian Publish can be convenient, but password access is not the same as internal SSO. A custom knowledge base would add complexity. This approach keeps the authoring system intact while adding a secure reader layer.

### Magic Moment Design

The magic moment requires three things to work perfectly: the user must pass SSO without confusion, search must return a relevant note quickly, and internal links must make the content feel connected. For the MVP, do not spend energy on advanced collaboration or custom design until this path works reliably.

### MVP Definition

The MVP includes Quartz configured for the vault, a small approved content set, attachment handling, search, backlinks or graph support, Cloudflare Pages deployment, Cloudflare Access protection, and a documented publishing rule. Done means a pilot user without GitHub access can reach the site through SSO and find approved notes.

### Explicitly Out of Scope

Per-page permissions are out of scope for v1 because they complicate a static-site model. Use one audience boundary first.

In-browser editing is out of scope because the source of truth is Obsidian and GitHub.

A full corporate design system is out of scope. Use a clean documentation theme and only customize enough for readability and trust.

Migrating content to another CMS is out of scope because it undermines the main advantage of the project.

### Feature Priority (MoSCoW)

**Must Have:** Quartz build, approved-note filtering, attachment support, search, Cloudflare Pages deployment, Cloudflare Access SSO, pilot URL, and launch checklist.

**Should Have:** Custom subdomain CNAME, broken-link checks, preview deployment protection, and basic analytics.

**Could Have:** Enhanced navigation, content freshness indicators, contribution guidance, and branded styling.

**Won't Have This Time:** Per-page permissions, comments, live editing, payments, public SEO strategy, or a custom backend.

### Core User Flows

The publishing flow starts with editing notes in Obsidian, marking approved notes for publish, pushing to GitHub, and letting Cloudflare Pages build the static site. Success means the deploy includes only approved content.

The reader flow starts with opening the wiki URL, passing Cloudflare Access, searching or browsing, and opening a note. Success means the reader finds the answer without GitHub access.

The audit flow starts with a build check that scans for draft/private content and broken links. Success means risky content is caught before deployment.

### Success Metrics

The primary metric is successful pilot access: at least 90% of pilot users can reach the wiki without GitHub access or manual account setup. Secondary metrics include median time to find a target note under 30 seconds, zero private-note leaks in build output, and fewer than 5% broken internal links in the pilot set. Great looks like pilot users linking wiki pages back into normal internal work within the first two weeks.

### Risks

The biggest risk is accidentally publishing private content. Mitigate with explicit `publish: true` rules and build-time checks.

SSO integration may require IT involvement or policy approval. Mitigate by validating Cloudflare Access setup before deep site customization.

Quartz may not perfectly support every vault convention. Mitigate with a representative pilot content set.

DNS constraints may block a polished internal URL. Mitigate by launching on `pages.dev` first and adding a CNAME later.

Reader adoption may lag if navigation is weak. Mitigate with a clear home page, search, tags, and pilot feedback.

## 4. Brand Strategy

### Positioning Statement

For internal employees who need approved vault knowledge without GitHub access, Clesen Knowledge Base is the secure publishing layer that turns Obsidian notes into an SSO-protected website. Unlike GitHub access, manual copying, or shared-password publishing, it preserves the private vault while giving readers a simple browser experience.

### Brand Personality

The product should feel like a precise internal reference desk. It is calm, direct, and organized. It does not perform or sell; it helps people find the thing they came for.

### Voice & Tone Guide

| Context | Do | Don't |
| --- | --- | --- |
| Onboarding | "Search the wiki or browse by topic." | "Unlock the power of knowledge." |
| Error states | "You do not have access to this wiki. Contact IT if this seems wrong." | "Oops, something magical happened." |
| Empty states | "No published notes match this search." | "Nothing here yet!" |
| Success messages | "Deployment complete. 18 notes published." | "Your content journey has begun." |
| Internal announcements | "The pilot wiki is available to the Internal Wiki Readers group." | "We are thrilled to unveil a revolutionary knowledge experience." |

### Messaging Framework

Tagline: "Private vault, internal website."

Homepage headline: "Search approved Obsidian knowledge without GitHub access."

Value propositions: keep Obsidian as the source of truth, protect access with company SSO, and publish automatically from a private repo.

Objection handler: if someone worries that a public URL exposes content, explain that Cloudflare Access gates the site before content loads.

### Elevator Pitches

Five seconds: "It turns a private Obsidian vault into an SSO-protected internal website."

Thirty seconds: "Our knowledge already lives in Obsidian and GitHub, but most readers should not need repo access. Clesen Knowledge Base builds approved notes into a static site, hosts it on Cloudflare Pages, and protects it with Cloudflare Access using company SSO."

Two minutes: "The problem is not that we lack documentation. The problem is that the documentation lives in an authoring environment. Granting GitHub access to every reader is too much, copying notes into another system creates stale content, and shared passwords are weak. This project keeps the private vault as the source of truth and adds a secure publishing layer. We start with a pilot set of notes, prove SSO access and content filtering, then expand once the workflow is trusted."

### Competitive Differentiation Narrative

This approach wins by refusing to migrate the knowledge. It treats Obsidian and GitHub as strengths for authors while giving readers a simple internal website. The security boundary is handled by Cloudflare Access, not by custom app code or broad repository permissions.

### Brand Anti-Patterns

Do not build a marketing landing page. Do not use vague enterprise language like "leverage knowledge synergies." Do not hide the content behind decorative cards or oversized hero sections. Do not make readers understand GitHub, Cloudflare, Quartz, or Obsidian to use the site.

## 5. Design Direction

### Design Philosophy

Prioritize scanability, dense but readable information, and predictable documentation patterns. Navigation should be obvious. Search should be prominent. Visual design should support trust and speed rather than trying to impress.

### Visual Mood

The mood should be closer to high-quality technical documentation than a SaaS homepage: crisp typography, calm surfaces, restrained color, clear headings, and compact navigation. Quartz defaults are acceptable as a baseline if customized for readability and internal tone.

### Color Palette

| Token | CSS Variable | Tailwind Name | Value | Use |
| --- | --- | --- | --- | --- |
| Background | `--color-background` | `background` | `#FAFAF7` | Page background |
| Surface | `--color-surface` | `surface` | `#FFFFFF` | Content surfaces |
| Text | `--color-text` | `text` | `#1E2528` | Primary copy |
| Muted Text | `--color-text-muted` | `muted` | `#667075` | Metadata and secondary labels |
| Primary | `--color-primary` | `primary` | `#1F6F78` | Links and active states |
| Accent | `--color-accent` | `accent` | `#C26A3A` | Sparse highlights |
| Border | `--color-border` | `border` | `#D8DEDC` | Rules and dividers |
| Success | `--color-success` | `success` | `#2F7D4F` | Build success |
| Warning | `--color-warning` | `warning` | `#A76600` | Caution |
| Error | `--color-error` | `error` | `#B33434` | Failures |

### Typography

Use Inter for body and heading text, with `font-weight` 400, 500, 600, and 700. Use JetBrains Mono for code. Body text should default to 16px with a 1.65 line height. Keep headings compact and hierarchical: 30px for H1, 24px for H2, 20px for H3, and 16px for navigation labels.

### Spacing & Layout

Use a 4px spacing base with tokens at 4, 8, 12, 16, 24, 32, 48, and 64px. Main content should cap around 78ch for long-form reading. Side navigation should remain stable between pages. Mobile layouts should collapse navigation cleanly without hiding search.

### Component Philosophy

Components should be plain and durable: low-radius controls, clear borders, minimal shadows, obvious focus states, and consistent spacing. Cards should be reserved for repeated items or callouts, not for wrapping whole page sections.

### Iconography & Imagery

Use simple outline icons where useful for search, external links, tags, and folders. Avoid decorative illustrations, stock photos, and visual metaphors. The content is the product.

### Accessibility Commitments

Target WCAG 2.1 AA. Maintain at least 4.5:1 contrast for body text, visible keyboard focus on every link/control, meaningful headings, descriptive link text, and minimum 44px touch targets for mobile navigation controls.

### Motion & Interaction

Keep motion subtle: 120-180ms transitions for hover, focus, and navigation disclosure. Avoid animated decoration. Loading states should be skeletal or text-based and never block content that is already available.

### Design Tokens

| Name | CSS Variable | Tailwind Class | Value |
| --- | --- | --- | --- |
| Background | `--color-background` | `bg-background` | `#FAFAF7` |
| Surface | `--color-surface` | `bg-surface` | `#FFFFFF` |
| Text | `--color-text` | `text-text` | `#1E2528` |
| Muted | `--color-text-muted` | `text-muted` | `#667075` |
| Primary | `--color-primary` | `text-primary` | `#1F6F78` |
| Accent | `--color-accent` | `text-accent` | `#C26A3A` |
| Border | `--color-border` | `border-border` | `#D8DEDC` |
| Radius Small | `--radius-sm` | `rounded-sm` | `4px` |
| Radius Medium | `--radius-md` | `rounded-md` | `6px` |
| Space 4 | `--space-4` | `p-4` | `16px` |
| Space 6 | `--space-6` | `p-6` | `24px` |
| Transition Fast | `--transition-fast` | `duration-150` | `150ms` |
