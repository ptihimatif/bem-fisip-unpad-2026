# Current state

Last updated: 2026-09-04

## Current milestone

Agentic workflow foundation and the project-local Impeccable integration are complete on the local dev branch. The application remains the default Create Next App scaffold; feature migration and Sanity setup have not begun.

## Repository baseline

- Local branch: dev at initial commit f8fa341.
- main and origin/main point to the same initial commit.
- No remote dev branch was observed during discovery.
- Stack currently installed: Next.js 16.3.4, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4.3.3.
- Runtime observed during discovery: Node.js 22.14.0 and pnpm 11.1.2.
- The package declares pnpm, while the brief recommends npm; no package-manager decision has been approved.
- The application, README, metadata, fonts, styling, and public assets remain starter defaults.
- There is no Sanity Studio, schema source, query layer, CI workflow, test suite, environment example, or runtime pin.

## Workflow foundation

- Root agent dispatcher and compatibility pointer: complete.
- .agents context, approval, workflow, quality, task, decision, and handoff records: complete.
- Six project-specific skills: complete.
- Project-local Impeccable skill, Codex hook, product/design context, implicit UI routing, and quality-gate integration: complete.
- Path, frontmatter, whitespace, policy, lint, type, and production-build verification: passed.

## Pre-existing working-tree state

Before this task:

- AGENTS.md and CLAUDE.md were tracked and deleted.
- docs/2026_PREPARATION_AND_HANDOVER.md was untracked.
- docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md was untracked.
- .agents/ existed and was empty.
- .skills/ did not exist.

The approved workflow task intentionally recreates AGENTS.md and CLAUDE.md. It must not rewrite or relocate the two user-provided briefs.

## Known verification baseline

- pnpm lint passed after the workflow changes.
- Direct TypeScript checking passed with pnpm exec tsc --noEmit --incremental false.
- The production build passed after network access was permitted for the unchanged starter's Google Fonts.
- All 22 required workflow paths exist.
- All six skills passed equivalent frontmatter, naming, description, and placeholder validation.
- The bundled quick validator could not start because PyYAML is absent from its Python environment; no dependency was installed for this documentation-only task.
- Unit/component and end-to-end test scripts do not exist.
- Impeccable doctor reports no context/config/hook drift, and the hook passed simulated Codex PostToolUse and Stop events.
- The manual Impeccable detector reports one existing warning for Arial in the unchanged starter's `app/globals.css`; no application change was authorized in the integration task.
- The pinned Impeccable installer declares Node `>=22.18.0`; its local tools passed under the current Node `22.14.0`, but the future runtime pin should meet the declared minimum.

## Open decisions and blockers

- Final institutional repository owner and branch protection.
- npm versus pnpm and the associated lockfile/CI strategy.
- Supported Node runtime pin (`>=22.18.0` is required by the installed Impeccable release).
- Final web plus Studio workspace topology.
- Sanity administrator access, recovered 2025 schemas, verified backup, and isolated 2026 dataset approval.
- Whether a separate development-2026 dataset will be maintained.
- Canonical route names and redirect strategy.
- Figma inspect access and complete responsive/interaction states.
- Impeccable's comp-first versus code-first default; ask once during the first applicable new-surface workflow.
- Per-developer Codex trust for `.codex/hooks.json` through `/hooks` or Settings.
- Vercel, domain, DNS, analytics, launch date, reviewers, and long-term owners.

These block affected production or architectural actions, but not approved local documentation or fixture-based planning.

## Next planned milestone

Present a separate plan for the application and Sanity repository scaffold. Do not scaffold either without explicit approval.
