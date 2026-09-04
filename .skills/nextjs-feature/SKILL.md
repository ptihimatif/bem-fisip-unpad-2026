---
name: nextjs-feature
description: Implement or revise a Next.js route or vertical feature slice for BEM FISIP Unpad 2026. Use for layouts, pages, route handlers, components, metadata, navigation, or application rendering behavior.
---

# Next.js feature

Deliver a complete, testable user outcome with minimal client JavaScript.

## Required context

Read the approved task, .agents/PROJECT_CONTEXT.md, and .agents/QUALITY_GATES.md. Before coding against the installed Next.js version, read the relevant guide in node_modules/next/dist/docs/ and heed current deprecations.

Also load:

- design-system for visual, responsive, or interactive UI.
- sanity-cms for CMS-backed content or revalidation.
- quality-review when the task includes a formal audit or review.

## Implementation approach

1. Implement a vertical route or feature slice rather than disconnected layers.
2. Use Server Components and server-side content fetching by default.
3. Add small client boundaries only for genuine browser interaction.
4. Centralize data contracts outside presentation components.
5. Preserve stable route and slug behavior; add approved redirects when contracts change.
6. Provide meaningful initial HTML, route metadata, and real not-found behavior.
7. Define loading, empty, partial, error, long-content, and missing-media behavior.
8. Keep interactive elements semantic, keyboard operable, focus visible, and reduced-motion safe.
9. Size and lazy-load media appropriately; do not make decorative animation block content or input.
10. Add behavior-focused tests and run the applicable quality gates.

Avoid page-wide client components, duplicate browser fetches, dynamically constructed Tailwind class names, global animation cleanup, and display names as route identifiers.

If a task depends on unresolved canonical routes, package architecture, Sanity isolation, Figma states, or external configuration, stop only the affected work and request the necessary decision.
