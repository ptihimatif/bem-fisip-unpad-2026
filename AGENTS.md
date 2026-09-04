<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# BEM FISIP Unpad 2026 agent instructions

This repository uses a plan-first workflow. Approval for one task does not authorize unrelated work or external changes.

## Required reading order

Before planning or changing the repository, read:

1. docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md
2. .agents/PLANNING_AND_APPROVAL.md
3. .agents/CURRENT_STATE.md
4. The relevant approved record under .agents/tasks/, when one exists
5. Only the project skills relevant to the task, selected from .skills/README.md

For frontend or UI work, also load the repository-local Impeccable skill at `.agents/skills/impeccable/SKILL.md`. Its broad UI-focused description enables implicit Codex discovery; explicit `$impeccable` commands remain available when a particular playbook is wanted.

Use docs/2026_PREPARATION_AND_HANDOVER.md when work depends on the inherited 2025 implementation, migration risks, or CMS history.

## Operating rules

- Perform read-only discovery and present a written task breakdown before making changes.
- Wait for explicit human approval before editing files, installing packages, or mutating any service.
- Implement only the approved scope. Re-plan when a discovery materially changes architecture, scope, data, cost, security, external state, or the approved steps.
- Preserve unrelated working-tree changes and report existing failures separately from failures introduced by the task.
- Never expose credentials or mutate production Sanity, GitHub settings, deployments, domains, DNS, or production content without the relevant explicit authority and a rollback plan.
- Treat the 2025 application and content as recoverable reference material. Never overwrite them as part of the 2026 migration.
- Update the applicable task record and .agents/CURRENT_STATE.md after material milestones.

## Project skill routing

- Planning or scoping repository work: .skills/project-planning/SKILL.md
- UI, Figma, branding, or design tokens: .skills/design-system/SKILL.md plus .agents/skills/impeccable/SKILL.md
- Sanity schemas, content, queries, preview, or revalidation: .skills/sanity-cms/SKILL.md
- Next.js routes, components, or feature slices: .skills/nextjs-feature/SKILL.md
- Verification, audit, or review: .skills/quality-review/SKILL.md
- Preview, production release, rollback, or handover: .skills/release-handover/SKILL.md

Load the smallest applicable set. A skill is a procedure, not permission to bypass the approval gate.

## Impeccable UI workflow

- Apply Impeccable automatically whenever a task creates, changes, redesigns, critiques, audits, polishes, or otherwise evaluates frontend UI. Do not invoke it for backend-only or documentation-only work.
- Run `node .agents/skills/impeccable/scripts/context.mjs` once at the start of each applicable session and follow the routed playbook before editing UI.
- The product brief, client-approved Figma/assets, `PRODUCT.md`, `DESIGN.md`, and the project design-system skill remain authoritative. Impeccable may raise the craft bar but may not replace approved brand or product truth.
- The project-local hook scans relevant UI edits and runs a deeper Stop pass after the user trusts `.codex/hooks.json` through Codex `/hooks` or Settings. Hook output is a quality signal, not permission to bypass review or the plan-first gate.
