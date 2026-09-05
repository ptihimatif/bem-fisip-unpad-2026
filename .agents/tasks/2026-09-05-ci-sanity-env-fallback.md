# Task Record: CI Sanity Environment Fallback

- Status: completed locally
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-09-05
- Updated: 2026-09-05

## Approved objective

Allow CI/test builds to run when public Sanity identifiers are not configured, without weakening production configuration checks.

## Scope and outcome

- In scope: `sanity/env.ts` and `sanity/lib/live.ts` only.
- Out of scope: Sanity projects/datasets, credentials, deployments, content, and repository settings.
- CI/test-only placeholder configuration now returns empty published data instead of making network requests.
- Production without required variables still throws the existing explicit error.

## Approval

- Approved by: project maintainer
- Approval wording: “pls fix”
- Approval date: 2026-09-05

## Verification results

- `npm run lint`: passed.
- `npm run test`: 3 passed.
- `npm exec -- tsc --noEmit --incremental false` with CI and missing Sanity vars: passed.
- `npm exec -- next build` with CI and missing Sanity vars: passed.

## Remaining risks

- CI should still configure real public Sanity repository variables for content-backed previews; the fallback is intentionally empty-content only.
