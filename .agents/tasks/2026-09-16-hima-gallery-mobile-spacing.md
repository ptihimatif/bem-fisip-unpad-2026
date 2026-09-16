# Task: Hima gallery mobile spacing

- Status: complete
- Owner: Codex
- Reviewer: User
- Created: 2026-09-16
- Updated: 2026-09-16
- Related decision: None

## Objective and outcome

Use the supplied Instagram asset, distribute the available horizontal space between Hima/Huria cards, and make the gallery/detail panel more usable on small screens.

## Facts, assumptions, and questions

### Known facts

- `public/assets/logo/ig.svg` is a white 28 by 28 Instagram icon.
- `HimaGallery` is an interactive client component and is rendered by `/hima`.

### Assumptions

- The user-approved `Proceed` authorizes the plan presented in chat on 2026-09-16.

### Material questions

- None.

## Scope

### In scope

- Replace the inline Instagram icon with the supplied public SVG asset.
- Use evenly distributed flex spacing while retaining identical card dimensions at each breakpoint.
- Improve compact-screen sizing, spacing, text wrapping, and social-link touch targets.

### Out of scope

- Sanity schemas/content, routes, dependencies, and unrelated working-tree changes.

## Expected impact

- `components/HimaGallery.tsx`
- `app/hima/page.tsx`
- `.agents/CURRENT_STATE.md`

## Ordered plan

1. Record approval and update the gallery/mobile layout.
2. Verify static-asset use, type safety, linting, and UI detector output.
3. Record results and current state.

## Cross-cutting implications

- Design system: Retains existing page colors and approved supplied asset.
- Accessibility: Preserves labelled links/focus and improves touch targets.
- Content and Sanity: Not applicable; presentation only.
- SEO: Not applicable; no route or metadata change.
- Security and privacy: Existing URL sanitization remains in place.
- Performance: Uses a local static SVG; no dependency added.
- Migration and compatibility: No content or route migration.

## Risks and recovery

- Risk: Existing untracked gallery work may be overwritten.
  - Safeguard: Limit changes to the approved presentation areas.
  - Rollback or recovery: Revert only the edited class/icon lines.

## Verification

### Automated

- `pnpm lint`
- `pnpm exec tsc --noEmit --incremental false`
- Impeccable detector for changed UI files.

### Manual

- Check 320px mobile, tablet, and desktop card spacing, selected state, wrapping, detail panel, and social links.

## Authority and external changes

- Required credentials/access: None.
- External state changes: None.
- Cost implications: None.
- Additional client/institution approval: None beyond recorded implementation approval.

## Approval

- Status: Approved
- Approved by: User
- Approval wording: `proceed`
- Approval date: 2026-09-16

## Implementation outcome

- Files changed: `components/HimaGallery.tsx`, `app/hima/page.tsx`, and this task record.
- Systems changed: None.
- Summary: Replaced the inline Instagram glyph with the supplied local SVG, applied evenly distributed wrapping card rows, and tightened mobile card/detail-panel spacing and touch targets.

## Verification results

- `pnpm lint`: passed with one pre-existing unrelated `Footer.tsx` unused-variable warning.
- `node_modules/.bin/tsc.cmd --noEmit --incremental false`: passed.
- `node .agents/skills/impeccable/scripts/detect.mjs components/HimaGallery.tsx app/hima/page.tsx`: passed with no output.
- `pnpm build`: blocked before route compilation because `next/font` could not fetch Inter from Google Fonts in the current network environment. This is unrelated to the gallery changes.
- Manual browser/device testing: not run in this environment.

## Deviations

- None.

## Remaining work and risks

- Visual confirmation at 320px, tablet, and desktop remains recommended before release.
