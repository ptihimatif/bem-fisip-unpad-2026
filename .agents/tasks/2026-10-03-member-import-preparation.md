# Task: Member import preparation

- Status: local preflight complete; CMS import pending authority
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-10-03
- Updated: 2026-10-03
- Related decision: keep client-preview styling separate from member data work

## Objective and outcome

Return to `feat/members`, validate the client workbook against the existing Sanity member and organization-unit model, and prepare a reviewable dry run before any CMS write.

## Facts, assumptions, and questions

### Known facts

- `preview/about-colors-2026-09-30` remains committed separately at `d306099`.
- The client workbook is untracked at `docs/data fungsionaris.xlsx`; its Excel lock file is also untracked.
- The workbook has 268 filled name/role rows and three empty separator rows, but no explicit organization-unit column.
- The configured public Sanity dataset is named `production`. It has 23 published term-2026 organization units, no published members, and one legacy document without a term in addition to unscoped assets.
- The member schema requires name, role, a same-term organization-unit reference, and term. Photograph and display order are optional.

### Assumptions

- The workbook's role label identifies each member's organization unit after approved spelling aliases are applied.
- Workbook row order is suitable for optional display order.

### Material questions

- Is `jcpcptq3` / `production` the authorized destination for these 2026 members, despite the legacy record in the dataset?
- Has the client approved publishing every listed name and role, and is there a recoverable pre-import dataset export?
- What write-capable Sanity access will be supplied for the eventual import? `.env.local` currently contains only public identifiers.

## Scope

### In scope

- Switch to `feat/members` while preserving the preview branch and client workbook.
- Read the workbook and published 2026 organization units.
- Build a local, read-only mapping validator and ignored dry-run output.
- Record discrepancies, unit counts, and the proposed import and rollback steps.

### Out of scope

- Sanity document creation, patching, deletion, publication, or credential changes.
- Frontend styling, preview branch edits, schema changes, package installation, Git merge, push, or deployment.

## Expected impact

`.gitignore`, `scripts/preflight_members.py`, this task record, `.agents/CURRENT_STATE.md`, and an ignored `outputs/member-import-preflight/` artifact. No external service changes.

## Ordered plan

1. Switch to `feat/members` and verify the workbook remains untouched.
2. Inspect workbook structure and profile missing, duplicate, and ambiguous rows.
3. Resolve each role label against the published term-2026 organization-unit list and produce a dry-run document plan without IDs or credentials.
4. Review counts and mapping aliases, then document the target, consent, backup, and rollback requirements for an authorized import.

## Cross-cutting implications

- Design system, accessibility, SEO: not affected; no page changes.
- Content and Sanity: member documents would reference existing 2026 units; no new units or schema changes are planned.
- Security and privacy: keep the workbook and generated names out of Git; do not print or store write tokens.
- Performance and cost: 268 potential new documents may affect dataset usage and page size; confirm the target plan before import.
- Migration and compatibility: preserve the legacy document and all existing 2026 content in the shared dataset.

## Risks and recovery

- A role-to-unit alias may be wrong. Fail the dry run on unmatched or duplicate mappings and review counts before any write.
- A future import could duplicate members. Query existing members first; use created document IDs for a bounded rollback if the later authorized import fails.
- A production write could affect inherited content. Require a recoverable dataset export and explicit target authority before applying.

## Verification

### Automated

- Workbook row count, required fields, duplicate names, mapping coverage, and existing-member overlap.
- `python scripts/preflight_members.py` and `git diff --check`.

### Manual

- Review the per-unit counts and alias list against the client's structure.
- Confirm the preview branch is unchanged and the workbook is not staged.

## Authority and external changes

- Required credentials/access for this task: public Sanity read access only.
- External state changes: none.
- Cost implications: no new service or package during preparation.
- Additional client/institution approval: required before writing member records into `production`.

## Approval

- Status: Approved for Git workflow and local import preparation
- Approved by: user/project maintainer
- Approval wording: "okey could you do that, i approve"
- Approval date: 2026-10-03

## Implementation outcome

- Switched from the temporary preview branch to `feat/members`; `d306099` remains on the preview branch.
- Added narrow ignore rules for the original workbook, Excel lock file, and generated local plan; no client names were committed.
- Added a standard-library Python preflight that reads the workbook, checks required fields and duplicates, fetches published 2026 units and members, and prepares records with Sanity-generated IDs and real unit references.
- Generated `outputs/member-import-preflight/dry-run.json` locally. It includes 268 proposed documents and is ignored by Git. No Sanity mutation occurred.

## Verification results

- `python scripts/preflight_members.py --write-plan` passed: 268 records mapped to all 23 published units; three empty separator rows; zero missing fields, duplicate names, unmatched roles, or existing published member overlaps.
- Two explicit name aliases were used: the longer Kaderisasi department name (14 rows) and Advokasi Kesejahteraan without `dan` (18 rows). Punctuation and `&` versus `dan` normalize automatically.
- An independent check confirmed the generated plan's 268 unique names, workbook SHA-256 match, schema-shaped fields, references, and absence of explicit document `_id` values.
- The workbook has no hidden rows, formulas, or merged cells. `git check-ignore` confirmed the workbook, lock file, and dry-run plan are excluded from Git; `git diff --check` passed.

## Deviations

- The configured `production` dataset is shared with one legacy unscoped document and assets. Preparation remained local and read-only; the import target needs explicit review before a write.

## Remaining work and risks

- Target authority, client publication consent, recoverable backup, and write access remain to be confirmed before any CMS mutation. No write-capable Sanity credential is present in `.env.local`.
- The dry-run plan includes public names and roles and must stay local until the client approves publication.
