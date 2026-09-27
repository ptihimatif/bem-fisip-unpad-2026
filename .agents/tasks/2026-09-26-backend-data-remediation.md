# Task: Backend data remediation

- Status: completed locally
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-09-26
- Updated: 2026-09-26
- Related decision: user-approved backend handoff remediation

## Objective and outcome

Fix the backend and Sanity data issues in `to-do-backend.md`, so public content, the article archive, and sitemap stay accurate, and remove the identified security and dependency risks.

## Facts, assumptions, and questions

### Known facts

- The article archive fetches only 12 posts while paginating the result.
- The site uses published-only `defineLive` with a public dataset.
- No revalidation route or `.env.example` exists, despite the handoff's claim.
- `app/page.tsx` has a pre-existing user change; `to-do-backend.md` is untracked.
- Baseline lint, typecheck, and 3 tests passed.

### Assumptions

- The public 2026 content contract remains unchanged.
- The deployment owner will separately configure the webhook and secret.

### Material questions

- None for local code changes. Production configuration remains outside this task.

## Scope

### In scope

- Local backend query, fetching, sitemap, revalidation, configuration, dependency, test, and documentation changes from the approved plan.
- Correct the newly identified department settings parameter bug.

### Out of scope

- Visual redesign and unrelated frontend work.
- Production Sanity, webhooks, credentials, deployments, and content changes.

## Expected impact

`next.config.ts`, `sanity/lib`, article and department page data fetching, sitemap, a revalidation API route, environment template, `package.json`, `pnpm-lock.yaml`, generated Sanity types, tests, and agent records. No schemas or CMS documents change.

## Ordered plan

1. Remove unsafe image configuration and correct data queries and route parameters.
2. Add a signed webhook route and explicit cache invalidation policy for published content.
3. Upgrade compatible Sanity packages and patched transitives; regenerate types.
4. Run quality gates, audit, and manual route checks; inspect the diff.
5. Update this record and `CURRENT_STATE.md`.

## Cross-cutting implications

- Design system and accessibility: no planned visual or interaction changes.
- Content and Sanity: published-only, term-scoped queries remain; no CMS mutation.
- SEO: sitemap query and freshness corrected.
- Security and privacy: remove local-IP image access; validate webhook signatures; keep secrets server-only.
- Performance: archive fetches all current posts; revisit server pagination if volume grows.
- Migration and compatibility: preserve 2025 content and verify Sanity package compatibility.

## Risks and recovery

- Package upgrades may expose compatibility problems: verify build and typegen; revert only task-owned package and lock changes if needed.
- Revalidation configuration depends on the deployment owner: leave external state untouched and document exact setup.
- Preserve the pre-existing `app/page.tsx` diff and root handoff file.

## Verification

### Automated

- `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm audit`, `git diff --check`.

### Manual

- Inspect archive pagination, sitemap, department footer, signed and unsigned webhook responses, and working-tree preservation.

## Authority and external changes

- Required credentials/access: none for local implementation.
- External state changes: none.
- Cost implications: no new paid service; all-post archive and on-demand invalidation may increase Sanity reads.
- Additional client/institution approval: required before configuring production webhook, deployment secret, or content.

## Approval

- Status: Approved
- Approved by: user/project maintainer
- Approval wording: "sure i approve, lets go"
- Approval date: 2026-09-26

## Implementation outcome

- Removed `dangerouslyAllowLocalIP` from image configuration.
- Upgraded Sanity Studio and Vision to 6.16.0 and `@sanity/client` to 8.7.0. Added four narrow pnpm 11 overrides for vulnerable CLI transitives while preserving existing native-build policy.
- Removed the article archive's 12-item query cap, unused count fetch, and unused interpolated query builder. Invalid page parameters now fall back to page one.
- Added typed sitemap queries and request-time, non-CDN sitemap fetching; removed fabricated current timestamps from static routes.
- Corrected the department page's site settings query params.
- Added one published-content cache tag and a signed webhook route, plus a trackable environment template and deployment instructions. No external service was configured.
- Regenerated `sanity.types.ts`; schema content did not change.

## Verification results

- Baseline lint, typecheck, and 3 tests passed before edits.
- Final frozen-lockfile install, lint, typecheck, 3 tests, and production build passed.
- Final `pnpm audit --json`: zero advisories (baseline: five high and five moderate).
- Production smoke: article, sitemap, and department routes returned HTTP 200; invalid article page matched page one; sitemap included six published posts and 23 units at test time.
- Webhook smoke with a disposable local secret: unsigned request HTTP 401 and correctly signed request HTTP 200. Without a configured secret, the route returned HTTP 503.
- `git diff --check` passed; the pre-existing `app/page.tsx` change and untracked root handoff were preserved.

## Deviations

- The installed pnpm 11 ignores `package.json#pnpm.overrides`, so overrides were placed in the already tracked `pnpm-workspace.yaml` instead. This is within the approved dependency-fix scope.

## Remaining work and risks

- The deployment owner must configure the production secret and signed Sanity webhook, then verify a real publish event. This requires separate authority and a rollback plan.
- The archive now fetches all current posts; if its volume grows substantially, replace the in-memory approach with server-side pagination.
