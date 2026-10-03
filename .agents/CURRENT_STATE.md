# Current state

Last updated: 2026-10-03

## Latest milestone: member import preflight

The workspace is back on `feat/members`; the temporary client-color preview remains isolated on `preview/about-colors-2026-09-30` at `d306099` and was not merged. The client workbook is kept local and ignored. A read-only preflight mapped 268 filled member rows to all 23 published 2026 organization units with no missing fields, duplicate names, or unmatched roles. Three blank separator rows were skipped. The ignored `outputs/member-import-preflight/dry-run.json` contains the proposed documents and source hash. See `.agents/tasks/2026-10-03-member-import-preparation.md`.

The configured Sanity dataset is named `production`; it contains term-2026 documents and one legacy document without a term. No member record was written. Explicit destination authority, client publication consent, a recoverable backup, and write access are needed before import.

## Previous milestone: backend and data remediation

On the local `feat/members` branch, the approved backend handoff fixes have been implemented: the unsafe local-IP image option was removed; Sanity Studio was upgraded to 6.16.0 with `@sanity/client` 8.7.0; four narrow pnpm overrides resolve the flagged CLI transitives; the article archive fetches all published 2026 posts; sitemap queries are typed and fetched fresh; the department settings query supplies the 2026 term; and a signed, server-only revalidation route supports content changes without an active Sanity Live visitor. Production webhook and secret configuration remain owned by the deployment/Sanity administrators and were not changed here. See `.agents/tasks/2026-09-26-backend-data-remediation.md` and `docs/SANITY_REVALIDATION.md`.

The working tree already contained a user change in `app/page.tsx` and untracked `to-do-backend.md`. They were preserved.

## Previous milestone (2026-09-16)

The headless CMS schema foundation and the official frontend implementation of the Homepage (Navbar, Footer, Hero, Mengapa Pendar Mentari, Mapres, and Publikasi) have been completed and merged into the `dev` branch.

## Repository baseline

- Local branch: `feat/members` (the prior `dev` milestone is historical).
- Stack currently installed: Next.js 16.3.4, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4.3.3, next-sanity 13.3.4, Sanity Studio 6.16.0.
- Runtime observed during discovery: Node.js 22.14.0 and pnpm 11.1.2.
- Brand tokens (Inter font, brand-blue, brand-yellow) have been implemented in `app/globals.css`.
- Sanity Studio configuration, 8 core schemas, GROQ query layer, and strict types are fully implemented.
- Production Homepage UI (`app/page.tsx`) replaces the old debug dashboard, utilizing real Sanity data.
- CI workflow passes tests.

## Workflow foundation

- Root agent dispatcher and compatibility pointer: complete.
- .agents context, approval, workflow, quality, task, decision, and handoff records: complete.
- Six project-specific skills: complete.
- Project-local Impeccable skill, Codex hook, product/design context, implicit UI routing, and quality-gate integration: complete.
- Path, frontmatter, whitespace, policy, lint, type, and production-build verification: passed.

## Historical workflow-foundation working-tree state

Before this task:

- AGENTS.md and CLAUDE.md were tracked and deleted.
- docs/2026_PREPARATION_AND_HANDOVER.md was untracked.
- docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md was untracked.
- .agents/ existed and was empty.
- .skills/ did not exist.

The approved workflow task intentionally recreates AGENTS.md and CLAUDE.md. It must not rewrite or relocate the two user-provided briefs.

## Earlier verification history (as of 2026-09-16)

- The Hima/Huria gallery now uses the supplied Instagram SVG, evenly distributed card spacing, and a compact mobile layout. Lint, direct TypeScript checking, and the Impeccable detector passed. The production build remains blocked by the existing inability to fetch the Google-hosted Inter font in this network environment.
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
- CI/test Sanity fallback is now hardened: missing public identifiers no longer fail module collection or trigger placeholder network requests; production remains strict.

## Open decisions and blockers

- Local Sanity integration hardening is complete. Deploying its term-scoped schemas still requires confirmation that the target dataset is isolated for 2026 and that a recoverable 2025 export exists; no Sanity service state was changed.
- The configured public dataset now includes published term-2026 documents. Published-only and term-scoped fetches remain required; no content was changed by this task.
- The homepage member data contract is now rendered as cards; the local Press Release model was removed. An Instagram integration remains an approved future direction, not an implemented service connection.
- Integration hardening remediation is complete locally: published-only Sanity Live, same-term references, generated image types, 2025-compatible route slices, CMS metadata/footer wiring, isolated dummy fixtures, and CI quality workflow are in place.
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

Review the member dry run and confirm the Sanity destination, publication consent, backup, and write access. After separate production-content authority, import the validated members with an ID-based rollback record. Review and merge the local backend remediation separately; production owners still need to configure and verify the revalidation webhook before release.
