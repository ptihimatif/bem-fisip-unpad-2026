# Task: Restyle `/penjelasan/[birdep]` to the house style

- Status: approved
- Owner: maintainer (approval) + agent (implementation)
- Reviewer: maintainer (visual review pending)
- Created: 2026-10-17
- Updated: 2026-10-17
- Related decision: none

## Objective and outcome

The department/bureau detail page `/penjelasan/[birdep]` is the last page still using the old light theme (`bg-gray-50`, dark text, white cards). Restyle it to the same visual language as `/`, `/about`, `/article`, `/hima`, and `/post/[slug]`: `bg-brand-gradient` dark background, white text, `text-depth` headings, full-bleed white divider, yellow meta tag, `border-white/15 bg-white/5` cards with brand-yellow accents. Structure and data stay identical — styling only.

## Facts, assumptions, and questions

### Known facts

- House style facts taken from existing pages: root `relative min-h-screen overflow-x-hidden pt-24` + `bg-brand-gradient` (article pattern), h1 `text-depth text-4xl sm:text-6xl font-extrabold` tracking `-0.05em`, full-bleed white divider, black-on-yellow meta tag (post pattern), dark cards `border-white/15 bg-white/5 shadow-md`.
- `ORGANIZATION_UNIT_BY_SLUG_QUERY` already provides `unitKind`, `abbreviation`, `coverImage`, `description`, `programs`, `members` — no query, schema, or content change is needed.
- The route serves four unit kinds (`bidang`, `biro`, `departemen`, `pengurus_inti`), so the meta-tag label is mapped for all four.
- Working tree was clean at discovery; the previous `/about` work is committed as `3e0921c`.

### Assumptions

- "Page lain" means the existing dark house style shared by the other public pages.
- Small decision accepted by silence in the plan: sub-headings ("Program Kerja", "Meet the Team") use the About-style yellow `text-brand-yellow`; the "Meet the Team" copy is not changed.

### Material questions

- None.

## Scope

### In scope

- Restyle `app/penjelasan/[birdep]/page.tsx` only.
- Add `scroll-mt-24` to `h2#departemen-biro-heading` in `components/about/DepartemenBiroSection.tsx` so the new back link `/about#departemen-biro-heading` lands below the fixed navbar.
- Create this task record and update `.agents/CURRENT_STATE.md` after completion.

### Out of scope

- Sanity schema, content, or query changes; rendering `gallery`; member `socialLink` display; program `slug` detail pages.
- Metadata/SEO changes (canonical, OpenGraph).
- Copy changes (including "Meet the Team").
- Other pages; commits, pushes, deployments.

## Expected impact

- `app/penjelasan/[birdep]/page.tsx` — restyled.
- `components/about/DepartemenBiroSection.tsx` — one utility class on the anchor heading.
- `.agents/tasks/2026-10-17-penjelasan-detail-restyle.md`, `.agents/CURRENT_STATE.md` — records.

## Ordered plan

1. Create this task record from `.agents/TASK_TEMPLATE.md`.
2. Restyle the page: root/background → back link → header (h1 → divider → unit-kind tag + abbreviation) → cover image (`mx-auto max-w-3xl`, bordered) → description → Program Kerja → "Meet the Team".
3. Add `scroll-mt-24` to the About anchor heading.
4. Run verification (below), then update the records.

## Cross-cutting implications

- Design system: existing tokens only (`brand-blue`, `brand-yellow`, `text-depth`, `bg-brand-gradient`); no new colors, fonts, or motifs.
- Accessibility: tag is black on yellow (contrast-safe); program links are yellow with underline (same as `/post`); yellow `focus-visible` ring on every interactive element; `aria-labelledby` + `programs`/`members` ids kept; no new animation (reduced-motion safe); cover stays `priority` for LCP.
- Content and Sanity: Not applicable — no schema/query/content changes; only rendering order/style of already-fetched fields.
- SEO: Not applicable — `generateMetadata` untouched; the h1 stays the unit name.
- Security and privacy: Not applicable — no new external calls or secrets.
- Performance: same or better (dark CSS-only background, same image sizes, cover still `priority`).
- Migration and compatibility: Not applicable — route contract and 2025 isolation untouched.

## Risks and recovery

- Risk: styling regression on units with missing cover/programs/members.
  - Safeguard: `SanityImage` is null-safe, existing empty states are kept (restyled).
  - Rollback or recovery: `git checkout -- app/penjelasan/[birdep]/page.tsx components/about/DepartemenBiroSection.tsx`.
- Risk: back-link anchor lands under the fixed navbar.
  - Safeguard: `scroll-mt-24` on the anchor heading.

## Verification

### Automated

- `pnpm exec tsc --noEmit --incremental false`.
- `pnpm lint`.
- `pnpm test`.
- Impeccable detector on the changed files.
- `pnpm build`.
- Local built-server fetch of real slugs (one departemen, one biro): expect 200 + key classes (`bg-brand-gradient`, yellow tag, back link) present; unknown slug → 404.

### Manual

- Maintainer: open `/penjelasan/*` from the `/about` grid on `pnpm dev`; check desktop/mobile layout, keyboard focus, and link destinations.

## Authority and external changes

- Required credentials/access: none beyond existing local `.env.local` (Sanity published read).
- External state changes: none.
- Cost implications: none.
- Additional client/institution approval: none.

## Approval

- Status: Approved
- Approved by: maintainer
- Approval wording: "Gas, kerjakan (Recommended)" (structured approval of the plan in chat)
- Approval date: 2026-10-17

## Implementation outcome

- Files changed: `app/penjelasan/[birdep]/page.tsx` (restyle), `components/about/DepartemenBiroSection.tsx` (`scroll-mt-24` on the anchor heading).
- Systems changed: none (no Sanity, deployment, or external state changes).
- Summary: The page now uses the shared dark house style — `bg-brand-gradient` root, back link to `/about#departemen-biro-heading`, `text-depth` h1 with full-bleed white divider, black-on-yellow unit-kind tag (label mapped for all four kinds) plus abbreviation, bordered cover image (`mx-auto max-w-3xl`), description, and yellow sub-headings with dark cards (`border-white/15 bg-white/5`) for Program Kerja and Meet the Team; empty states restyled to the dark surface.

## Verification results

- `pnpm exec tsc --noEmit --incremental false` — passed (no output).
- `pnpm lint` — passed (clean).
- `pnpm test` — 3/3 passed.
- Impeccable detector on changed files — no findings.
- `pnpm build` — passed (Next.js 16.3.4, `/penjelasan/[birdep]` still dynamic).
- Local built-server fetches (`next start`, port 3100): `/penjelasan/biro-keuangan`, `/penjelasan/departemen-akademik-dan-keprofesian`, and `/penjelasan/ekonomi-kreatif` all returned 200 with `bg-brand-gradient`, `text-depth`, the back link, the yellow tag (labels "Biro"/"Departemen" correct), "Program Kerja", and "Meet the Team" present, and the old light-theme markers (`bg-gray-50`) absent. An unknown slug renders the localized not-found content; the streaming shell still reports HTTP 200 — the same pre-existing behavior recorded in `2026-09-05-integration-hardening-remediation.md`, not introduced by this change.

## Deviations

- None.

## Remaining work and risks

- Maintainer visual review on desktop/mobile/keyboard (manual check above).
