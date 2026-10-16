# Task: About page "Departemen dan Biro" button section

- Status: implemented locally; verified (maintainer visual review pending)
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-10-16
- Updated: 2026-10-16
- Related decision: None

## Objective and outcome

Replace the About page's last section (the 23-unit "Bidang dan Departemen" card grid) with a single container of 17 image-backed buttons — one per Departemen (13) and Biro (4). Each button shows only the unit name over a mesh background from `public/assets/about/depbir/` and navigates to that unit's `/penjelasan/[slug]` page.

## Facts, assumptions, and questions

### Known facts

- `app/about/page.tsx` already fetches every published 2026 unit via `ORGANIZATION_UNITS_QUERY` ordered by `displayOrder asc, officialName asc`; no query change is needed.
- A read-only GROQ query to `jcpcptq3/production` confirmed 13 `departemen` + 4 `biro` units (17 buttons) plus 5 bidang and pengurus-inti/sekum units.
- `public/assets/about/depbir` now holds 19 mesh PNGs (Frame 4–13 and Frame 25–28, 30–34), all 960×540 (16:9).
- `/penjelasan/[birdep]` resolves any unit slug and 404s for unknown slugs.
- No other component, test, or anchor references the removed "Bidang dan Departemen" heading or its `#units` id.

### Assumptions

- The incumbent dark About-page treatment (brand blue/yellow, `text-depth`, full-bleed divider, `max-w-6xl` container) remains the visual authority for this section.
- Long Indonesian unit names may wrap up to three lines on narrow cards; the 16:9 card height can absorb that.

### Material questions

- Resolved with the maintainer before approval: replace the whole last section (not append); label = unit name only (no arrow icon); 19 supplied assets mean no background may repeat.

## Scope

### In scope

- New server component `components/about/DepartemenBiroSection.tsx` rendering the heading, one container, and 17 linked buttons.
- Replace the last `<section>` inside `app/about/page.tsx` with that component and remove the now-unused `SectionHeading`/`EmptyState` helpers plus unused imports.
- Deterministic, random-looking, non-repeating assignment of the 19 backgrounds to the 17 buttons.

### Out of scope

- Sanity schema, content, queries, datasets, or production state (read-only throughout).
- All other About sections, `/penjelasan`, header/footer, and any unrelated working-tree changes.
- Changing or renaming any supplied asset.

## Expected impact

- `components/about/DepartemenBiroSection.tsx` (new).
- `app/about/page.tsx` (edited: import, section swap, dead-helper removal).
- `.agents/tasks/2026-10-16-about-departemen-biro.md` and `.agents/CURRENT_STATE.md` (records).

## Ordered plan

1. Create this task record.
2. Implement `DepartemenBiroSection.tsx` (server component; filter `unitKind`, fixed background shuffle, `next/link` + `next/image` cards).
3. Swap the last section in `app/about/page.tsx`; delete superseded helpers/imports.
4. Run lint, typecheck, tests, Impeccable detector, diff check, production build, and a built-HTML smoke check.
5. Record results here and in `.agents/CURRENT_STATE.md`.

## Cross-cutting implications

- Design system: reuse Inter, brand blue/yellow, existing heading/divider/container styles; overlay keeps white labels ≥ 4.5:1 over the lightest asset pixels; no new fonts/colors.
- Accessibility: `section` + `h2` landmark/heading, link accessible name = visible unit name, decorative images `alt=""`, visible yellow focus ring, hover-only nothing, reduced-motion-safe transitions, long-name wrapping.
- Content and Sanity: read-only reuse of the existing published query; heading copy is provisional and localized in one constant.
- SEO: `/about` metadata unchanged; server-rendered links keep the depbir pages crawlable.
- Security and privacy: internal links only; no new external URLs, credentials, or user data.
- Performance: `next/image` lazy loading with sized renditions instead of raw 250–300 KB PNGs; no client JavaScript added (server component).
- Migration and compatibility: `/penjelasan/[birdep]` contract untouched; no 2025 route or content affected.

## Risks and recovery

- Risk: a background file is renamed/removed later.
  - Safeguard: the path list is one constant in the component; unused frames stay harmless.
  - Rollback or recovery: point the constant at the new filenames.
- Risk: `Math.random` assignment would cause hydration mismatch between SSR and client.
  - Safeguard: fixed permutation constant; identical output every render.
  - Rollback or recovery: adjust the permutation order.
- Risk: editor adds units beyond 19 in a future term.
  - Safeguard: modulo fallback keeps every button background valid (repeats only past 19).
  - Rollback or recovery: add more background frames.

## Verification

### Automated

- `pnpm lint`
- `pnpm exec tsc --noEmit --incremental false`
- `pnpm test`
- `node .agents/skills/impeccable/scripts/detect.mjs app/about/page.tsx components/about/DepartemenBiroSection.tsx`
- `git diff --check`
- `pnpm build`
- Built `/about` HTML smoke check: 17 `/penjelasan/` links, heading present, 17 distinct background URLs, old grid copy gone.

### Manual

- Maintainer visual review of `/about` at mobile/tablet/desktop, keyboard tab order, and a few button destinations.

## Authority and external changes

- Required credentials/access: None.
- External state changes: None; Sanity and production remain untouched.
- Cost implications: None.
- Additional client/institution approval: Section copy ("Departemen dan Biro") is provisional UI copy within approved scope.

## Approval

- Status: Approved
- Approved by: Project maintainer
- Approval wording: “Ganti total section terakhir (Recommended)”, “Nama saja”, then “gas, kerjain”.
- Approval date: 2026-10-16

## Implementation outcome

- Files changed: `components/about/DepartemenBiroSection.tsx` (new), `app/about/page.tsx` (section swap + helper/import cleanup).
- Systems changed: Local About page only; no Sanity, deployment, or production state changed.
- Summary: The last `/about` section now renders one container with 17 buttons — each published departemen/biro gets a 16:9 `next/link` card, a unique mesh background from `public/assets/about/depbir` (fixed 19-frame shuffle, no repeats), a white `text-depth` label over a `bg-brand-blue/75` wash, and a yellow focus ring; removed the old 23-unit cover-image grid and its helpers.
- Refinement (same day, per maintainer): the heading switched to the leadership-section style — centered `text-brand-yellow`, `text-depth text-balance text-3xl sm:text-4xl lg:text-5xl`, tracking `-0.03em`, `mb-10` — and the full-bleed white divider was dropped.
- Refinement (same day, per maintainer): the button label grew from `text-base sm:text-lg` to `text-lg sm:text-xl lg:text-2xl`.

## Verification results

- Permutation check: `BACKGROUND_ORDER` covers 0–18 exactly once; first 17 assignments unique (unused: Frame 25, Frame 28).
- `pnpm exec tsc --noEmit --incremental false`: passed.
- `pnpm lint`: passed, no warnings.
- `pnpm test`: passed, 3 tests.
- Impeccable detector on both changed files: no findings. `git diff --check`: no whitespace errors (only a pre-existing CRLF notice on `components/SanityPortableText.tsx`).
- `pnpm build`: passed; `/about` prerendered.
- Built `/about` HTML smoke check: 17 distinct `/penjelasan/` hrefs (13 departemen + 4 biro), 17 unique `Frame` background URLs, heading `Departemen dan Biro` + `departemen-biro-heading` present, `bg-brand-blue/75` present, old `Bidang dan Departemen` grid and empty-state copy absent.
- Manual visual review by the maintainer: pending.
- Heading refinement re-verification: typecheck, lint, Impeccable detector, and production build passed again; built HTML shows `h2 id="departemen-biro-heading"` with the exact leadership-heading classes (`text-depth text-balance text-3xl font-bold leading-snug text-brand-yellow sm:text-4xl lg:text-5xl`, tracking `-0.03em`), 17 `/penjelasan/` links, and 17 unique frame backgrounds.

## Deviations

- None.

## Remaining work and risks

- Maintainer visual check of `/about` (desktop/mobile), keyboard focus, and a few button destinations.
- If a future term adds more than 19 depbir units, backgrounds repeat past the 19th button (modulo fallback).
