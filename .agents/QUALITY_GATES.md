# Quality gates

Apply checks in proportion to the approved change. Documentation-only work does not need browser testing, but it still requires path, consistency, and diff validation.

## Current baseline

The repository currently declares pnpm 11.1.2 and contains a pnpm lockfile, while the development brief recommends npm. Do not switch package managers without a recorded decision and approved migration.

Currently available:

| Gate | Command or state |
| --- | --- |
| Lint | pnpm lint |
| TypeScript | pnpm exec tsc --noEmit --incremental false; no dedicated script yet |
| Production build | pnpm build |
| Impeccable UI detector | `node .agents/skills/impeccable/scripts/detect.mjs <changed-ui-paths>`; the trusted hook also runs after UI edits and at Stop |
| Unit/component tests | Not configured |
| End-to-end tests | Not configured |
| Workflow integrity | Manual until automation is approved |

Missing gates must be reported honestly; absence is not a passing result.

## Target pull-request gates

After the foundation is approved and implemented, every applicable pull request should have stable scripts for:

1. Frozen-lockfile install.
2. Lint.
3. Type checking.
4. Unit/component tests.
5. End-to-end tests.
6. Production build.
7. Agent-workflow integrity.

Use the package manager chosen in the repository decision record.

## Feature review

Check as applicable:

- Expected route status, metadata, loading, empty, error, and not-found behavior.
- Typed and parameterized Sanity queries with fixtures for normal and edge cases.
- Keyboard operation, visible focus, semantic structure, meaningful alternatives, 200% zoom, and reduced motion.
- Mobile, tablet, laptop, and wide-screen behavior.
- Long Indonesian content and missing-image behavior.
- Safe external links and embeds.
- Server-rendered content, cache/revalidation behavior, image sizing, bundle impact, and Core Web Vitals risk.
- No secrets, unsafe tokens, accidental production writes, or mixing of 2025 and 2026 content.
- Inter and the approved blue/yellow brand foundations remain consistent.
- The applicable Impeccable detector pass has no unresolved material findings; any sanctioned exception is narrow, evidence-backed, and stored through `hook-admin.mjs` rather than handwritten config.

## Workflow integrity

Verify that:

- Every path referenced by AGENTS.md and .agents/README.md exists.
- Every skill indexed by .skills/README.md contains SKILL.md.
- Each SKILL.md has valid name and description frontmatter.
- Task records contain approval and verification results.
- CURRENT_STATE.md reflects material milestones and blockers.
- No project instruction grants permission to bypass human approval.

## Release-only checks

Before an authorized production release, also verify supported browsers/devices, screen-reader basics, social previews, sitemap, robots, redirects, content revalidation, official links, HTTPS, dependency risk, backups, rollback readiness, and named production authority.
