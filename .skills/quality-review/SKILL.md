---
name: quality-review
description: Review or validate BEM FISIP Unpad 2026 changes for correctness and release readiness. Use for code review, regression analysis, testing, accessibility, SEO, performance, security, responsive behavior, or workflow integrity.
---

# Quality review

Produce evidence-backed findings and distinguish inherited failures from regressions introduced by the reviewed task.

Review is read-only unless the approved scope explicitly includes fixes.

## Prepare

1. Read the approved task, its acceptance criteria, and .agents/QUALITY_GATES.md.
2. Inspect the working tree and relevant diff before running checks.
3. Select checks based on the risk and files changed.
4. Use the package manager currently approved by repository decision; do not silently rewrite locks or dependencies.

## Review order

Prioritize:

1. Scope and approval violations.
2. Data loss, secret exposure, production mutation, and 2025/2026 content mixing.
3. User-visible correctness, route contracts, and error/not-found behavior.
4. Accessibility and keyboard operation.
5. Sanity query/model correctness and content edge states.
6. Security, external URLs, embeds, and privacy/consent.
7. Performance, server rendering, caching, images, and client bundle impact.
8. Responsive behavior, design tokens, metadata, SEO, and maintainability.
9. Agent-workflow integrity and documentation accuracy.

Run applicable lint, type, test, end-to-end, and build commands. If a check is missing, blocked, or skipped, state that explicitly.

Findings should identify the affected path, concrete impact, evidence, and severity. Do not inflate speculative concerns. When no defect is found, state residual risks and coverage gaps rather than claiming exhaustive correctness.

Before completion, inspect the final diff, run git diff --check, and confirm unrelated user changes were preserved.
