# Deployment

## Status

Phase 2 repository setup is ready, but Cloudflare deployment is pending Cloudflare API credentials in GitHub.

Current status:

| Area                       | Status  | Notes                                           |
| -------------------------- | ------- | ----------------------------------------------- |
| Pages project              | Pending | Create `clesen-wiki` in Cloudflare Pages.       |
| Build command              | Ready   | `npm run build`                                 |
| Output directory           | Ready   | `public`                                        |
| Production branch          | Ready   | `main`                                          |
| GitHub deployment workflow | Ready   | `.github/workflows/deploy-cloudflare-pages.yml` |
| Production Access app      | Pending | Protect `https://clesen-wiki.pages.dev/*`.      |
| Preview Access app         | Pending | Protect `https://*.clesen-wiki.pages.dev/*`.    |
| SSO policy                 | Pending | Allow `clesen.com` email domain for pilot.      |

## GitHub Secrets

Add these repository secrets before the deployment workflow can publish:

```text
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_API_TOKEN
```

The API token should be scoped to the Cloudflare account that owns the `clesen` team and should allow Cloudflare Pages deployment management for the `clesen-wiki` project.

## Cloudflare Pages

Project:

```text
Name: clesen-wiki
Production branch: main
Build command: npm run build
Output directory: public
Production URL: https://clesen-wiki.pages.dev
```

Recommended setup path:

1. Create the Pages project in Cloudflare Workers & Pages.
2. Use Direct Upload through the GitHub Actions workflow in this repo.
3. Add the two GitHub secrets listed above.
4. Push or rerun the deployment workflow.
5. Confirm the first production deployment succeeds.

The workflow runs the same safety checks as local builds because `npm run build` includes `prebuild` and `postbuild`.

## Cloudflare Access

Protect the entire site before sharing the URL.

Production application:

```text
Application name: Internal Knowledge Wiki
Application domain: clesen-wiki.pages.dev
Path: /*
Session duration: company default
```

Preview application:

```text
Application name: Internal Knowledge Wiki Previews
Application domain: *.clesen-wiki.pages.dev
Path: /*
Session duration: company default
```

Pilot policy:

```text
Action: Allow
Selector: Emails ending in
Value: clesen.com
```

Preferred later policy:

```text
Action: Allow
Selector: IdP group
Value: Internal Wiki Readers
```

## Verification

After deployment and Access configuration:

1. Open `https://clesen-wiki.pages.dev` in a signed-out/private browser.
2. Confirm Cloudflare Access redirects to Microsoft Entra ID before content loads.
3. Sign in with an allowed `clesen.com` account and confirm the wiki loads.
4. Test a blocked/non-company account and confirm access is denied.
5. Open a preview deployment URL and confirm it also requires Cloudflare Access.
6. Search for a representative term and open one linked note in under 30 seconds.

## Inspecting Deployments

GitHub:

```text
Actions > Deploy Wiki to Cloudflare Pages
```

Cloudflare:

```text
Workers & Pages > clesen-wiki > Deployments
```

Rollback:

```text
Workers & Pages > clesen-wiki > Deployments > View details > Rollback to this deployment
```

## Known Blocker

This local environment does not currently expose `CLOUDFLARE_API_TOKEN`, so Codex cannot create the Pages project or Access applications directly from the shell. Once the token and account ID are added to GitHub secrets, the workflow can deploy the site.
