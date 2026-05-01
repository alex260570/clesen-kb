# Deployment

## Status

Phase 2 deployment is active on Cloudflare Pages and protected by Cloudflare Access.

Current status:

| Area                       | Status   | Notes                                           |
| -------------------------- | -------- | ----------------------------------------------- |
| Pages project              | Complete | `clesen-wiki`                                   |
| Build command              | Ready    | `npm run build`                                 |
| Output directory           | Ready    | `public`                                        |
| Production branch          | Ready    | `main`                                          |
| GitHub deployment workflow | Ready    | `.github/workflows/deploy-cloudflare-pages.yml` |
| Production Access app      | Complete | `https://clesen-wiki.pages.dev/*` is protected. |
| Preview Access app         | Complete | Preview deployments are protected with Access.  |
| SSO policy                 | Complete | Pilot access allows `clesen.com`.               |

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

### Microsoft Entra ID Setup Notes

The Cloudflare Access identity provider uses a Microsoft Entra ID app registration. The app registration must include the Cloudflare Access callback URL as a **Web** redirect URI:

```text
https://<cloudflare-team-name>.cloudflareaccess.com/cdn-cgi/access/callback
```

The Entra app also needs Microsoft Graph delegated permissions with admin consent granted. Confirm these permissions are present if SSO testing fails:

```text
email
offline_access
openid
profile
User.Read
Directory.Read.All
GroupMember.Read.All
```

When creating the client secret, copy the secret **Value**, not the Secret ID. If Access policies use Entra groups, enable **Support groups** in the Cloudflare identity provider and use the Entra group Object ID when entering a group manually.

## Verification

Verified on 2026-05-01:

- GitHub secrets `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` are configured.
- GitHub Actions workflow `Deploy Wiki to Cloudflare Pages` completed successfully on `main`.
- `https://clesen-wiki.pages.dev` returned `200` after Cloudflare Access login and included `Internal Knowledge Wiki`.
- Microsoft Entra ID SSO was confirmed after adding the required delegated Graph permissions and granting admin consent.

For future deployment/access checks:

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

## Known Follow-Up

Run the pilot test with 5-10 internal users and record feedback in `docs/pilot-notes.md`.
