# Task: About page leadership showcase

- Status: implemented locally; verified
- Owner: Codex
- Reviewer: project maintainer
- Created: 2026-10-12
- Updated: 2026-10-12
- Related decision: None

## Objective and outcome

Replace the About page's all-member grid with a focused leadership showcase: Ketua and Wakil Ketua as the prominent top row, followed by a carousel containing Sekretariat Umum and Kepala/Wakil Kepala Departemen.

## Facts, assumptions, and questions

### Known facts

- `MEMBERS_QUERY` already returns the published 2026 member records used by the About page.
- The imported role values include `Ketua`, `Wakil Ketua`, `Sekretaris Umum`, and `(Wakil )?Kepala Departemen ...`.
- The user explicitly approved combining Sekretariat Umum with department heads in one carousel and asked for an initial simple implementation.

### Assumptions

- Exact role matching is sufficient for this first pass; no schema or query projection change is needed.
- The existing About page's dark brand treatment and Sanity image component remain the visual authority.

### Material questions

- None for the approved initial implementation.

## Scope

### In scope

- Add a server-rendered leadership section to `/about`.
- Show only `Ketua`, `Wakil Ketua`, `Sekretaris Umum`, and department head/deputy roles.
- Add a responsive, swipeable/keyboard-operable carousel for the latter group.
- Remove the existing all-member Fungsionaris grid from the public About page.

### Out of scope

- Sanity schema, content, dataset, query, or production changes.
- New member roles, copy corrections, image replacements, or CMS editorial work.
- Reworking the existing organization-unit overview or unrelated dirty working-tree changes.

## Expected impact

- `app/about/page.tsx`: compose the new section and stop rendering all members.
- `components/about/PetinggiSection.tsx`: filter and render the leadership hierarchy.
- `components/about/PetinggiCarousel.tsx`: provide the client-side carousel controls and native horizontal swipe behavior.
- `.agents/CURRENT_STATE.md` and this task record: record the material milestone and verification.

## Ordered plan

1. Create the approved task record and preserve the existing working-tree changes.
2. Implement the server/client section split using the existing member data contract and brand primitives.
3. Replace the About page's broad member grid with the focused leadership section.
4. Run lint, typecheck, the Impeccable detector, diff checks, and a production build where the environment permits.
5. Record results and remaining risks in this task record and `CURRENT_STATE.md`.

## Cross-cutting implications

- Design system: inherit the current About page's Inter, brand blue/yellow, dark surface, border, and typography treatment.
- Accessibility: use semantic headings/cards, named carousel controls, visible focus, native swipe scrolling, and reduced-motion-safe behavior.
- Content and Sanity: read-only reuse of the existing published 2026 member query; no CMS mutation.
- SEO: preserve the existing `/about` route and metadata; render meaningful leadership HTML on the server.
- Security and privacy: no new external links, credentials, or user data exposure.
- Performance: send only the filtered leadership records to the client carousel; use existing responsive Sanity image handling.
- Migration and compatibility: preserve the 2025/2026 route contract and leave unrelated page changes untouched.

## Risks and recovery

- Risk: a future CMS role spelling change can omit a person from the showcase.
  - Safeguard: keep the filter predicates centralized and use the known imported role vocabulary.
  - Rollback or recovery: restore the removed Fungsionaris block and delete the two new components.
- Risk: missing member photos can leave a visually incomplete card.
  - Safeguard: render an initials fallback when no image is available.
  - Rollback or recovery: content owners can add the missing photo without a code change.

## Verification

### Automated

- `pnpm lint`
- `pnpm exec tsc --noEmit --incremental false`
- `node .agents/skills/impeccable/scripts/detect.mjs app/about/page.tsx components/about/PetinggiSection.tsx components/about/PetinggiCarousel.tsx`
- `git diff --check`
- `pnpm build`

### Manual

- Inspect `/about` at mobile and desktop widths.
- Confirm only the approved leadership roles appear, with Ketua/Wakil above the carousel.
- Confirm carousel arrows, horizontal swipe/scroll, visible focus, missing-image fallback, and reduced-motion behavior.

## Authority and external changes

- Required credentials/access: None.
- External state changes: None; Sanity remains read-only.
- Cost implications: None.
- Additional client/institution approval: Already granted for the initial simple implementation.

## Approval

- Status: Approved
- Approved by: Project maintainer
- Approval wording: “yes, sekertariat umum digabungin sama kepala departemen. (ini bakal jadi carousel aja). buat dulu aja seadanya.”
- Approval date: 2026-10-12

## Implementation outcome

- Files changed: `app/about/page.tsx`, `components/about/PetinggiSection.tsx`, `components/InfiniteCarousel.tsx`, `app/globals.css`; the superseded `components/about/PetinggiCarousel.tsx` was removed.
- Systems changed: Local About page only; no Sanity or production state changed.
- Summary: Added a server-filtered leadership section, promoted Ketua/Wakil Ketua cards, combined Sekretaris Umum and department head/deputy roles into a responsive carousel, and removed the all-member Fungsionaris grid.
- Latest refinement: Renamed the top label to “Ketua dan Wakil Ketua BEM”, removed the department carousel's heading above the images, removed the visual image frame from the top leadership cards, and slowed only this carousel to an 80-second loop.
- Latest copy cleanup: Removed the role line beneath the Ketua/Wakil images and removed all name/role text overlays from carousel images.
- Latest copy cleanup: Removed the role line beneath the Ketua/Wakil images and removed all name/role text overlays from carousel images.
- Latest refinement (split + full-screen): Split `PetinggiSection` into two standalone sections, `KetuaWakilSection` and `PetinggiCarouselSection`, each filtering its own members and filling one viewport via `min-h-[100dvh]` with vertically centered headings. The shared card, helpers, and shared look constants moved to `components/about/LeadershipCard.tsx`; `PetinggiSection.tsx` was removed. Card heights switched from fixed rem to dvh-based values clamped by min/max rem so both groups fit one screen without clipping on short viewports.
- Latest refinement: Added a `gap` prop to `InfiniteCarousel` (default `gap-2`, used as `gap-6` here); fixed two pre-existing lint warnings in `components/ParallaxImage.tsx`.
- Latest correction (two carousels + scroll snap): The combined carousel was split into two carousels per the maintainer: `SekretariatBidangSection` (Sekretaris Umum + Kepala Bidang, matching the published data which has no Wakil Kepala Bidang) and `PimpinanDepartemenBiroSection` (Kepala/Wakil Kepala Departemen & Biro). Both render through one shared local `CarouselSection` in `components/about/PetinggiCarouselSections.tsx` so their style cannot drift; `PetinggiCarouselSection.tsx` was removed. All three leadership sections (Ketua/Wakil, and the two carousels) now snap into place: `html` gets `scroll-snap-type: y proximity` and each section gets `snap-start`. Proximity (not mandatory) so the remaining About sections can still rest freely; granularity is per-section only, as requested.
- Latest correction (2026-10-16, per maintainer): that page-level scroll snap was removed from `/about` everywhere except the Logo section. `html` no longer sets `scroll-snap-type` and the three leadership sections no longer use `snap-start`; the Logo section's own JS-driven card snapping is untouched. Typecheck, lint, detector, build, and built-HTML/CSS checks (no `snap-start`, no `scroll-snap-type`) passed.

## Verification results

- `pnpm lint`: passed with two pre-existing warnings in `components/ParallaxImage.tsx` (`CSSProperties` unused and missing `alt`); no errors.
- `pnpm exec tsc --noEmit --incremental false`: passed.
- Impeccable detector on the changed UI files: passed with no deterministic findings.
- `pnpm test`: passed after rerunning with process-spawn permission; 3 tests passed. The sandbox-only attempt failed before assertions with `spawn EPERM`.
- `pnpm build`: passed after rerunning with process-spawn permission; `/about` compiled, typechecked, and prerendered. The sandbox-only attempt failed at the worker step with `spawn EPERM`.
- `git diff --check`: passed.
- Built `/about` HTML smoke check: contains the Petinggi/Sekretaris/Kepala labels and does not contain the removed Fungsionaris label.
- A separate local server could not be started for browser inspection because port 3000 was already occupied; its response was not used as build evidence.
- Final refinement checks: typecheck, lint, Impeccable detector, and diff check passed. Lint retains only the same two pre-existing warnings in `components/ParallaxImage.tsx`; no new errors were introduced. The production build was not rerun after the user interrupted the previous build attempt.
- Latest copy cleanup checks: typecheck, lint, Impeccable detector, and diff check passed; the same two pre-existing `ParallaxImage.tsx` warnings remain.
- Latest copy cleanup checks: typecheck, lint, Impeccable detector, and diff check passed; the same two pre-existing `ParallaxImage.tsx` warnings remain.

## Deviations

- The initial plan called for a single section component; it was split into a server section and small client carousel so filtering stays server-side while scrolling remains interactive. This does not change the approved user-visible scope.

## Remaining work and risks

- Final visual review may refine spacing or card treatment after the initial implementation is inspected.
