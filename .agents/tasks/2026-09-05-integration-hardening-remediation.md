# Task Record: Sanity/Frontend Integration Hardening Remediation

- Status: completed locally
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-09-05
- Related decision: client editorial data is not yet available; dummy content remains the expected integration input.

## Approved objective

Apply the approved local remediation plan so a frontend developer can consume the 2026 Sanity contract safely and predictably, while using the 2025 public site only as a feature-parity reference.

## Implementation outcome

- Enforced published-only Sanity Live behavior with explicit fetch perspectives and no implicit preview tokens.
- Added same-term Studio reference filters and same-term dereference guards for organization-unit relationships.
- Replaced the hand-maintained image interface with a generated TypeGen query contract and removed the stale manual type module.
- Added server-rendered `/about`, `/article`, `/post/[slug]`, `/hima`, and `/penjelasan/[birdep]` route slices with loading/error/not-found compatibility, metadata, bounded queries, safe links, and responsive content states.
- Added shared site navigation/footer, CMS-driven metadata/contact/Care Center wiring, an isolated dummy contract fixture, and fixture validation tests.
- Added a pnpm/Node quality workflow and `.env.example`; no Sanity service, dataset, deployment, credential, or production content changed.

## Verification

- Sanity schema validation: 0 errors, 0 warnings.
- TypeGen: regenerated successfully with 13 queries and 21 schema types.
- Lint: passed.
- Strict typecheck: passed.
- Tests: 3 passed.
- Production build with network access: passed; routes generated: `/`, `/about`, `/article`, `/hima`, `/penjelasan/[birdep]`, `/post/[slug]`, and Studio.
- Impeccable detector: no findings.
- `git diff --check`: passed.
- Production smoke checks against dummy content: `/about`, `/article`, `/hima`, and `/penjelasan/biro-administrasi` returned 200; an unknown post rendered the localized no-index not-found boundary. Next.js streaming reports that fallback response with a 200 shell status, so a later SEO/HTTP-status pass should verify crawler behavior under the final hosting configuration.

## Remaining external prerequisites

- Confirm the institution-owned 2026 dataset and recoverable 2025 export before any deployment or remote schema/content operation.
- Configure repository variables for `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` before relying on CI build results.
- Resolve the previously observed transitive dependency audit findings through a compatible Sanity upgrade plan.
- Add browser end-to-end and accessibility automation in a follow-up quality task.
