# Task Record: Sanity Integration Hardening

- Status: completed with external-data prerequisite
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-09-05
- Updated: 2026-09-05
- Related decision: dataset isolation remains an external prerequisite

## Objective and outcome

Turn the local Sanity foundation into a safe, typed, front-end-ready contract while preserving the recoverable 2025 archive and avoiding all Sanity service mutations.

## Facts, assumptions, and questions

### Known facts

- Local schemas validate, and lint, TypeScript, and the production build passed during the audit.
- The configured dataset has the generic name `production`; repository evidence does not prove that it is isolated from 2025 content.
- No verified 2025 export is available in the repository.

### Assumptions

- The current worktree changes are the approved schema-foundation work and may be refined within this task.
- Local fixtures may be changed because they are not imported into a Sanity dataset by this task.

### Material questions

- The exact isolated 2026 dataset and its ownership must be confirmed before any external Sanity operation.

## Scope

### In scope

- Harden local schemas, queries, fixtures, data helpers, routes, metadata, error states, tests, and scripts.
- Replace the destructive cleanup script with a safe local validation utility.
- Upgrade local dependencies only when required to resolve audit findings and verified by the full quality gate.

### Out of scope

- Creating, deleting, importing, exporting, or changing Sanity projects, datasets, documents, tokens, CORS, webhooks, or roles.
- Deployment, DNS, production content, and 2025 migrations.

## Expected impact

- `sanity/`, `app/`, `components/`, `scripts/`, `tests/`, package configuration, fixtures, and project state/task records.

## Ordered plan

1. Add explicit term and singleton conventions to the local content model and Studio structure.
2. Add validated schema fields, safe fixtures, and a non-destructive utility.
3. Build typed, bounded query contracts and safe URL/image helpers.
4. Add route-level data states, metadata, and public integration primitives.
5. Add type generation, test coverage, dependency remediation, and scripts.
6. Run schema, lint, type, test, build, audit, detector, and diff checks; record results.

## Cross-cutting implications

- Design system: preserve Inter and approved blue/yellow tokens; improve only safe states.
- Accessibility: editorial alternatives, semantic links, loading/error states, and image handling.
- Content and Sanity: no remote mutation; retain a mandatory 2026 term contract.
- SEO: default metadata and publication-ready content fields.
- Security and privacy: HTTPS URL allowlists, secure external links, and no client secrets.
- Performance: bounded projections, image transforms, and explicit cache behavior.
- Migration and compatibility: no 2025 data operation; live schema deployment requires a separate approved task.

## Risks and recovery

- Risk: a future schema deployment could hide or invalidate existing records.
  - Safeguard: this task modifies local source only and requires backup/isolation evidence before deployment.
  - Rollback or recovery: revert the focused commit; no external state is changed.

## Verification

### Automated

- Schema validation, TypeGen, lint, strict typecheck, URL unit tests, production build, production audit, detector, and diff check. End-to-end coverage remains a follow-up.

### Manual

- Verify fixture-backed normal, empty, missing-image, invalid-link, long-content, and not-found behavior.

## Authority and external changes

- Required credentials/access: none for local implementation.
- External state changes: none.
- Cost implications: dependency downloads and local browser test binaries only.
- Additional client/institution approval: required before any Sanity dataset/service operation.

## Approval

- Status: Approved
- Approved by: project maintainer
- Approval wording: "yes i approve"
- Approval date: 2026-09-05

## Implementation outcome

- Files changed: local schemas, queries, Studio structure, integration UI states, image/link helpers, safety script, generated TypeGen files, tests, package configuration, and lockfile.
- Systems changed: local repository only
- Summary: added the term-2026 contract, deterministic singleton IDs, bounded projections, Press Release model, schema validation, editor-facing image and URL safeguards, safe links, a disabled deletion script, TypeGen, local tests, and route-level recovery states.

## Verification results

- Sanity schema validation: passed with 0 errors and 0 warnings.
- TypeGen: generated `schema.json` and `sanity.types.ts`.
- Lint, strict TypeScript check, and URL tests: passed.
- Production build: passed after the supported Sanity package update.
- Impeccable detector: passed after correcting the one confirmed contrast/side-accent finding.
- Page TypeGen integration: passed after removing unsafe result casts and handling nullable Sanity image fields directly.
- Production audit: reduced from 3 high / 3 moderate to 2 high / 4 moderate; remaining advisories are transitive Sanity CLI/Vercel-framework dependencies.

## Deviations

- None.

## Remaining work and risks

- Confirm the isolated 2026 dataset and a verified 2025 backup before any external Sanity action or schema deployment.
- Read-only dataset checks found two legacy posts but no documents with `term: "2026"`, and no required 2026 singleton documents. Localhost therefore shows its intentional empty states until approved 2026 content is created and published.
- Add browser-based end-to-end coverage and an approved Studio topology/deployment plan in a follow-up task.
