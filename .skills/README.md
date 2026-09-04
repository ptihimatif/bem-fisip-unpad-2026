# Project skills

These skills are reusable project-specific procedures. They do not replace the development brief, an approved task plan, or human authority.

## Selection

Load only the smallest set that matches the task:

| Skill | Use for |
| --- | --- |
| project-planning | Repository-changing requests that need discovery, scope, risks, verification, and approval |
| design-system | UI, Figma, brand tokens, responsive states, motion, and visual accessibility |
| sanity-cms | Sanity schemas, datasets, content contracts, GROQ, images, preview, and revalidation |
| nextjs-feature | Next.js routes, layouts, components, metadata, and vertical feature slices |
| quality-review | Evidence-based review, testing, accessibility, security, performance, and regression checks |
| release-handover | Approved previews/releases, backups, rollback, smoke tests, and operational handover |

For any frontend interface task, pair `design-system` with the installed Codex-native `.agents/skills/impeccable/SKILL.md`. Impeccable is intentionally broad and implicitly discoverable for UI design, implementation, critique, accessibility, responsive behavior, motion, and polish; the project skill supplies the BEM-specific non-negotiables.

## Rules

- Read AGENTS.md and the required .agents/ files before loading a skill.
- Read the complete SKILL.md for every selected skill before acting.
- A skill may tighten a process but cannot authorize work, expand scope, or bypass production safeguards.
- Temporary plans and results belong in .agents/tasks/, not in skills.
- Architectural decisions belong in .agents/decisions/.
- Add supporting references, scripts, or assets only after repeated use demonstrates a concrete need.
- Do not edit the vendored Impeccable skill or hook scripts to encode project rules. Keep BEM-specific authority in this library, `PRODUCT.md`, `DESIGN.md`, and the approved brief.
