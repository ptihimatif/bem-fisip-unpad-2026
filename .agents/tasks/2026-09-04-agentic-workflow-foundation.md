# Task: Agentic workflow foundation

- Status: complete
- Owner: Codex
- Reviewer: Project maintainer
- Created: 2026-09-04
- Updated: 2026-09-04
- Related decision: None

## Objective and outcome

Initialize a durable agentic workflow so future agents read the correct context, plan before changes, use focused project skills, verify their work, and leave useful task, decision, state, and handoff records.

## Facts, assumptions, and questions

### Known facts

- .agents/ existed but was empty.
- .skills/ did not exist.
- AGENTS.md and CLAUDE.md were tracked but deleted before this task.
- Both authoritative briefs under docs/ were untracked.
- The application is an unchanged Next.js starter.

### Assumptions

- The approved scope includes the root dispatcher, .agents/ records, and .skills/ procedures.
- Existing briefs remain in docs/ and are referenced at their actual paths.
- No package-manager decision is needed to create documentation-only workflow files.

### Material questions

- None for this task. Package manager, monorepo, Sanity, hosting, and production ownership remain open decisions for later plans.

## Scope

### In scope

- Recreate AGENTS.md as a concise dispatcher while retaining the Next.js managed rules.
- Restore CLAUDE.md as a compatibility pointer.
- Create the approved .agents/ documentation, templates, and indexes.
- Create six approved project skills under .skills/.
- Validate paths, skills, Markdown consistency, lint, types, and build as applicable.

### Out of scope

- Application or design implementation.
- Package, lockfile, or package-manager changes.
- Sanity Studio, schema, dataset, content, or account changes.
- CI, Vercel, GitHub, domain, DNS, or other external mutations.
- Moving or rewriting the user-provided briefs.
- Commits, pushes, branches, or pull requests.

## Expected impact

- AGENTS.md
- CLAUDE.md
- .agents/
- .skills/

No application, package, schema, content, or external service changes.

## Ordered plan

1. Preserve and record the discovered working-tree baseline.
2. Create the root instruction dispatcher and compatibility pointer.
3. Create .agents/ context, policies, quality gates, templates, indexes, and this approved task record.
4. Create six focused project skill entrypoints.
5. Validate referenced paths and skill structure.
6. Run repository checks and inspect the final diff.
7. Mark this task and CURRENT_STATE.md complete with evidence.

## Cross-cutting implications

- Design system: Captures the approved Inter and blue/yellow foundations; no UI changes.
- Accessibility: Captures WCAG 2.2 AA and reduced-motion expectations; no UI changes.
- Content and Sanity: Captures dataset isolation and authority boundaries; no CMS changes.
- SEO: Captures future route requirements; no metadata changes.
- Security and privacy: Prohibits secrets and unauthorized external/production mutations.
- Performance: Captures future budgets and review expectations; no runtime change.
- Migration and compatibility: Preserves the 2025 site/data as recoverable reference and restores the prior CLAUDE.md pointer.

## Risks and recovery

- Risk: Recreating files that were already deleted could overwrite an intentional direction.
  - Safeguard: Their replacement was explicitly listed in the approved plan.
  - Rollback: Revert the documentation diff without touching application state.
- Risk: Repeated policy text could drift.
  - Safeguard: Keep the brief authoritative and use links plus concise summaries.
  - Rollback: Consolidate duplicated text in a later approved documentation task.
- Risk: The Next.js agent block may be regenerated.
  - Safeguard: Preserve the managed markers and rules in the new dispatcher.
  - Rollback: Regenerate or restore the managed block.

## Verification

### Automated

- Validate all six skills with the bundled quick validator.
- Verify required paths exist.
- Run git diff --check.
- Run pnpm lint.
- Run direct TypeScript checking.
- Run pnpm build if the environment permits it.

### Manual

- Review reading order, skill routing, approval consistency, current-state accuracy, and final diff.
- Confirm no application, package, lockfile, Sanity, or external state changed.

## Authority and external changes

- Required credentials/access: None.
- External state changes: None.
- Cost implications: None.
- Additional client/institution approval: None for local documentation; future production actions retain their own authority requirements.

## Approval

- Status: Approved
- Approved by: Project maintainer
- Approval wording: “okey i approve all of that, pls work on it”
- Approval date: 2026-09-04

## Implementation outcome

- Files changed: AGENTS.md, CLAUDE.md, 13 files under .agents/, and 7 files under .skills/.
- Systems changed: None.
- Summary: Created the approved root dispatcher, workflow context and policies, task/decision/handoff templates, current-state record, skill index, and six focused project skills.

## Verification results

- All 22 required workflow paths exist.
- All six skills passed equivalent frontmatter, name, description, and unfinished-placeholder validation.
- The bundled quick validator was attempted but could not start because PyYAML is missing from its Python environment. No dependency was installed; an equivalent read-only validation was used.
- Workflow files contain final newlines and no trailing whitespace.
- Approval and production-safety policy search found the expected safeguards.
- git diff --check passed for tracked changes.
- pnpm lint passed.
- Direct TypeScript checking passed with pnpm exec tsc --noEmit --incremental false.
- The first production build attempt was blocked while fetching the unchanged starter's Google Fonts. The approved network-enabled rerun passed and generated / and /_not-found.
- Final review confirmed no application source, package, lockfile, Sanity, deployment, or other external state was changed.

## Deviations

- None.

## Remaining work and risks

- The external quick validator will remain unavailable until its owning Python environment provides PyYAML; the project does not need that dependency at runtime.
- Package manager, repository topology, Sanity isolation, Figma detail, hosting, domain, launch, and long-term ownership decisions remain for future approved tasks.
