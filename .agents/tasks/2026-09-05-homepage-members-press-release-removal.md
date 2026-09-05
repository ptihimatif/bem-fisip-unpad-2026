# Task Record: Homepage Members and Press Release Removal

- Status: completed
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-09-05
- Related decision: Press Release is replaced by a future Instagram integration, which is not part of this task.

## Objective

Show member profiles on the homepage and remove the unused Press Release content model from the local 2026 codebase.

## Approved scope

- Render responsive, accessible member cards from the existing typed member query.
- Remove the homepage Press Release fetch and UI.
- Remove the local `pressRelease` schema and its query, then regenerate TypeGen outputs.
- Verify schema, type generation, lint, typecheck, build, and UI detector results.

## Exclusions and safeguards

- No Sanity dataset, document, schema deployment, Instagram API, credentials, or embedded-post integration is changed.
- The future Instagram implementation requires its own approved platform and credential plan.

## Approval

- Status: approved
- Approved by: project maintainer
- Approval wording: "remove press realease schema also, its okay, and yes i approve the plan"
- Approval date: 2026-09-05

## Implementation outcome

- The homepage now renders responsive member cards with photo fallback text, role, leadership label, organization unit, and a validated external social link.
- The Press Release homepage section, query, schema registration, schema file, and generated TypeGen entries were removed.
- No Sanity service state was changed.

## Verification results

- Sanity schema validation: 0 errors, 0 warnings.
- TypeGen: regenerated successfully with 11 queries and 21 schema types.
- Lint, strict typecheck, and URL tests: passed.
- Impeccable detector: passed with no findings.
- Production build: passed.

## Follow-up

- An Instagram embedding/API integration remains intentionally out of scope until its supported integration method, credentials, privacy implications, and approval are established.
