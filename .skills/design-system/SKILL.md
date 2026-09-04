---
name: design-system
description: Implement or review BEM FISIP Unpad 2026 interface foundations and components. Use for Figma, branding, typography, colors, responsive states, interaction states, motion, or visual accessibility.
---

# Design system

Translate approved design inputs into reusable, accessible implementation without inventing a competing visual direction.

## Required context

Read Section 11 of docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md and the approved task. Load `.agents/skills/impeccable/SKILL.md`, run its context script once for the session, and follow the applicable Impeccable playbook for any frontend interface work. Inspect the supplied Figma/component states and source assets relevant to the change. If the required design is unavailable, identify the missing decision and continue only with unaffected primitives or fixtures.

`PRODUCT.md` records durable product truth and `DESIGN.md` records the current confirmed visual constraints. Neither overrides a newer explicit client decision or a more specific approved Figma state. Impeccable raises implementation and review quality but does not authorize a competing visual direction.

## Fixed foundations

- Inter is the default brand typeface.
- Brand blue is #003089.
- Brand yellow is #FFBA3A.
- White, black, neutrals, and semantic status colors support readability; they are not additional brand colors.
- White on yellow fails normal-text contrast. Prefer brand blue on yellow.
- Target WCAG 2.2 AA and preserve a useful reduced-motion experience.

## Procedure

1. Inventory the relevant Figma tokens, components, breakpoints, assets, and states.
2. Map repeated values to named semantic CSS or Tailwind tokens.
3. Define mobile, tablet, and desktop composition intentionally.
4. Define default, hover, focus, active, selected, disabled, loading, empty, error, and navigation-open states where applicable.
5. Use semantic HTML, visible focus, keyboard operation, meaningful alternatives, and non-color state cues.
6. Keep motion optional, scoped, and non-blocking; honor reduced motion.
7. Test long Indonesian text, missing images, narrow widths, touch, keyboard, and 200% zoom.
8. Resolve every applicable Impeccable hook/detector finding or record the narrowest evidence-backed sanctioned exception before handoff.

Use approved vector sources for logos and optimized raster formats for photographs. Never embed multi-megabyte base64 assets in components. Do not add a new font, brand color, gradient, or visual motif without explicit approval.

Report any Figma ambiguity, missing asset rights, or contrast conflict to the named reviewer rather than silently guessing.
