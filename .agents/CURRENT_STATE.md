# Current state

Last updated: 2026-10-26

## Latest milestone: approved local pre-release improvements

The approved plan in `docs/PRE_RELEASE_IMPROVEMENT_PLAN_2026-10-26.md` is implemented locally for the available scope. The BEM favicon is a valid multi-size ICO; framework/CMS dependencies are patched and the final production audit reports zero advisories. Environment/origin validation, non-indexable staging, CMS/SEO integration, additive About fields with current-copy fallbacks, modal accessibility, deterministic browser fixtures, CI checks, and Indonesian handover documentation are in place. Frozen install, TypeGen, peers, lint, typecheck, 13 behavior tests, 8 browser tests, and fixture/actual-content builds passed. One existing stylistic blockquote detector warning is documented. No production content or service settings changed, and no commit/push/merge/deployment occurred. A read-only four-field About manifest is ready under ignored `outputs/pre-release-cms/`. Targets/owners, client acceptance, webhook/CORS setup, real-domain tests, backup recovery, and publishing the manifest remain pending. See `.agents/tasks/2026-10-26-pre-release-improvements.md` and `docs/panduan/08-checklist-rilis.md`.

### Follow-up: local Next.js runtime recovered

The reported missing `.next/dev/server/preview-props.json` occurred while port 3000 was still running Next.js 16.3.4 after installation of 16.4.3. Restarting only this workspace's stale dev server regenerated the manifest without deleting files. Fixture browser builds now use `.next-check`, with matching runner/type/ignore configuration, while regular dev/build/start retain `.next`. The real-content dev server remained healthy through the concurrent fixture build; all 8 browser checks, lint, TypeScript, and diff checks passed. Restart dev after dependency upgrades. Recovery instructions are in `docs/panduan/07-pemeliharaan-dan-troubleshooting.md`.

## Previous milestone: audit fixes and website documentation

Merged into `dev` at `155854f` (historical milestone): Sanity images now load directly from the Sanity CDN (`unoptimized`), Mapres cards render study program/cohort/optional achievement with a silhouette placeholder, and a whole-repo audit was fixed. The production CSP previously blocked Next.js inline scripts (no hydration); it now follows the Next.js "without nonces" policy and allows the Studio's Sanity CDN script/font and realtime socket. Fake placeholder programs were removed from unit pages, post dates use `Asia/Jakarta`, `ProgramList` re-measures on resize, the revalidate webhook has tests, and dead code/`build.log` were removed. Complete Indonesian documentation now lives in `docs/panduan/` and the root README points to it. Typecheck, lint, tests (4/4), build, and a headless-Chrome production smoke test passed. No Sanity, deployment, or GitHub state changed. See `.agents/tasks/2026-10-25-audit-fixes-and-website-docs.md`.

## Previous milestone: Mapres and proker imported from client document

The maintainer approved publishing client-provided Mapres and program data to `jcpcptq3/production`, excluding "Delegasi FISIP" and leaving images for manual upload. The Mapres schema now models study program, cohort year, and optional rank; portrait and achievement/event details are optional. The query and generated types were updated, and the homepage has a one-line guard for missing portraits. Ten Mapres and 81 new program documents were created. Five existing program documents were patched only in name, owning unit, and order, giving 86 published proker entries across 17 units. Existing descriptions and other fields, other document types, and the one unrelated unnamed Mapres draft were preserved. A targeted pre-write backup and created-ID manifest are kept locally under the ignored `outputs/mapres-proker-2026-10-22/` directory. Independent readback, TypeGen, typecheck, lint, tests, build, and diff checks passed. No photos, deployment, webhook, or other service settings were changed. See `.agents/tasks/2026-10-22-mapres-proker-import.md`.

## Latest milestone: `/penjelasan/[birdep]` restyled to the house style

The department/bureau detail page — the last page still on the old light theme — now matches the shared dark house style: `bg-brand-gradient` root, a "Kembali ke Departemen dan Biro" link to `/about#departemen-biro-heading`, `text-depth` h1 with the full-bleed white divider, a black-on-yellow unit-kind tag (labels mapped for all four `unitKind` values) plus abbreviation, a bordered cover image (`max-w-3xl`, still `priority`), the description, and yellow sub-headings with `border-white/15 bg-white/5` cards for Program Kerja and Meet the Team; empty states are dark now too. No query, schema, content, metadata, or external state changed. Typecheck, lint, 3/3 tests, Impeccable detector, production build, and built-server fetches (`biro-keuangan`, `departemen-akademik-dan-keprofesian`, `ekonomi-kreatif`: 200 + all key classes; old light-theme markers absent) passed. The About grid heading also got `scroll-mt-24` so the back-link anchor lands below the fixed navbar. Known pre-existing behavior: an unknown slug's streaming shell reports HTTP 200 while rendering the not-found content (documented in `2026-09-05-integration-hardening-remediation.md`). See `.agents/tasks/2026-10-17-penjelasan-detail-restyle.md`.

## Previous milestone: About "Departemen dan Biro" button section

The About page's last section was replaced. The 23-unit "Bidang dan Departemen" cover-image grid is gone; `components/about/DepartemenBiroSection.tsx` now renders one container with a centered yellow heading (same style as the leadership sections) and 17 buttons — one per published Departemen (13) and Biro (4) — each a `next/link` card to `/penjelasan/[slug]` with a unique mesh background from `public/assets/about/depbir` (19 supplied frames, fixed shuffle, no repeats), the unit name only, a `bg-brand-blue/75` contrast wash, hover/focus states, and reduced-motion safety. `app/about/page.tsx` renders the component inside the existing `<main>`; its superseded `SectionHeading`/`EmptyState` helpers and unused imports were removed. No Sanity schema, content, query, deployment, or production state changed. Typecheck, lint, tests, Impeccable detector, production build, and a built `/about` HTML smoke check (17 distinct links, 17 unique backgrounds, old copy absent) passed. See `.agents/tasks/2026-10-16-about-departemen-biro.md`.

Latest correction, same day: per the maintainer, page-level scroll snap was removed from `/about` everywhere except section 1 (Logo). `html` no longer sets `scroll-snap-type`, and `KetuaWakilSection`/`PetinggiCarouselSections` no longer use `snap-start`; the Logo section's own JS-driven card snapping is untouched because it never relied on CSS snap. Typecheck, lint, Impeccable detector, production build, and a built `/about` HTML/CSS smoke check (no `snap-start`, no `scroll-snap-type`) passed.

## Previous milestone: About leadership split into full-screen sections

The About-page leadership showcase was split into two standalone full-screen sections. `components/about/KetuaWakilSection.tsx` (Ketua/Wakil Ketua) and `components/about/PetinggiCarouselSection.tsx` (Sekretaris Umum + Pimpinan Departemen & Biro) each filter their own members, keep a null guard, and fill one viewport via `min-h-[100dvh]` with vertically centered headings (`py-16`). The shared card, helpers, and shared-look constants moved to `components/about/LeadershipCard.tsx`; card heights are now dvh-based (`34/42/52dvh`) clamped by min/max rem so neither group clips on short viewports. `components/about/PetinggiSection.tsx` was removed and `app/about/page.tsx` renders the two sections directly. `InfiniteCarousel` gained an optional `gap` prop (default `gap-2`, `gap-6` here). Separately, the homepage "Mengapa Pendar Mentari?" description now renders the full `cabinetProfile.overview` PortableText from Sanity via `SanityPortableText` (no hardcoded copy), and two pre-existing `ParallaxImage.tsx` lint warnings were fixed. No Sanity schema, content, query result shape, deployment, or production state changed. Final typecheck, lint, Impeccable detector, production build, and a built `/about` HTML smoke check (both headings present, `100dvh` present, no stale references) passed. See `.agents/tasks/2026-10-12-about-petinggi-carousel.md`.

Latest correction, same milestone: the combined carousel was split into two identically styled carousels — `SekretariatBidangSection` (Sekretaris Umum + Kepala Bidang; the published 2026 data has no Wakil Kepala Bidang) and `PimpinanDepartemenBiroSection` (Kepala/Wakil Kepala Departemen & Biro). Both render through one shared local `CarouselSection` in `components/about/PetinggiCarouselSections.tsx` so their style cannot drift. All three leadership sections snap per section: `html` has `scroll-snap-type: y proximity` and each leadership section uses `snap-start`; proximity (not mandatory) keeps the remaining About sections freely scrollable. Typecheck, lint, Impeccable detector, production build, and a built `/about` HTML/CSS smoke check (three headings, `snap-start`, and `scroll-snap-type` present) passed. A read-only Sanity GROQ query confirmed the exact 2026 role inventory used by the two filters. (This page-level snap was removed again on 2026-10-16 — see the latest milestone correction above.)

## Previous milestone: About leadership showcase

The approved About-page leadership follow-up is implemented locally. The page now shows `Ketua dan Wakil Ketua BEM` without an image frame or role line, followed by a full-width, slower Home-style carousel containing clean images for `Sekretaris Umum` and `Kepala`/`Wakil Kepala Departemen`, with no heading or text overlay above/on the images. The prior all-member Fungsionaris grid is no longer rendered. No Sanity schema, content, query, deployment, or production state changed. Final typecheck, lint, Impeccable detector, and diff checks passed; the last production build was interrupted by the user and was not rerun after this final styling refinement. See `.agents/tasks/2026-10-12-about-petinggi-carousel.md`.

## Latest milestone: cabinet values with explanations

The maintainer supplied four client-approved Nilai descriptions and requested publication. The `cabinetProfile` schema now models each value as a title/description object; its GROQ projection and generated types were updated. The existing `cabinetProfile-2026` document in `jcpcptq3/production` was backed up, revision-checked, and patched only in `values`. Authenticated readback and a published GROQ query verified all four exact entries. Lint, typecheck, tests, build, and TypeGen passed. The About page does not render this field yet; the frontend partner can use the new query shape, and the embedded Studio needs the normal code deployment to expose the new fields. See `.agents/tasks/2026-10-08-cabinet-values.md`.

## Previous milestone: About colors for frontend handoff

The maintainer requested a minimal local About-page color fix before personally merging to `dev` and handing final UI work to the frontend partner. On `feat/members`, `app/about/page.tsx` now has the same class-only blue/yellow treatment as the previously reviewed client-preview commit `d306099`. Content, layout, data fetching, and other pages remain unchanged. Lint, typecheck, all three tests, production build, and the Impeccable detector passed; the fresh About build includes all 268 imported member names. No merge, push, or deployment occurred. See `.agents/tasks/2026-10-06-about-colors-handoff.md`.

## Previous milestone: published member import

The project maintainer approved publishing names and images to Sanity project `jcpcptq3`, dataset `production`. A full pre-import export with 57 content documents and 52 assets was created and verified locally. All 268 workbook members were imported and published with exact Excel names, roles, 2026 terms, display order, and references to the 23 existing units. Of 268 supplied card PNGs, 265 were mapped, uploaded, and attached by OCR-assisted name/role verification; three member records intentionally have no photo. Authenticated read-back verified all 268 documents and 265 exact image assets. Source images, workbook, backup, photo map, and ID-based rollback state are ignored by Git. See `.agents/tasks/2026-10-05-member-import.md`.

Client card-copy corrections and missing photos remain follow-up content work. The existing production revalidation webhook configuration remains outside this task; site visibility may lag the published Content Lake until cache invalidation is configured or the live client refreshes.

A clean local production build after import included all 268 workbook names on the About page. The earlier empty local build output was stale; no frontend change was needed. The deployed site's cache state has not been checked.

## Previous milestone: member import preflight

The workspace is back on `feat/members`; the temporary client-color preview remains isolated on `preview/about-colors-2026-09-30` at `d306099` and was not merged. The client workbook is kept local and ignored. A read-only preflight mapped 268 filled member rows to all 23 published 2026 organization units with no missing fields, duplicate names, or unmatched roles. Three blank separator rows were skipped. The ignored `outputs/member-import-preflight/dry-run.json` contains the proposed documents and source hash. See `.agents/tasks/2026-10-03-member-import-preparation.md`.

At that time, no member record had been written, and destination authority, publication consent, backup, and write access were still pending. Those import prerequisites were satisfied for the 2026-10-05 member import described above.

## Previous milestone: backend and data remediation

On the local `feat/members` branch, the approved backend handoff fixes have been implemented: the unsafe local-IP image option was removed; Sanity Studio was upgraded to 6.16.0 with `@sanity/client` 8.7.0; four narrow pnpm overrides resolve the flagged CLI transitives; the article archive fetches all published 2026 posts; sitemap queries are typed and fetched fresh; the department settings query supplies the 2026 term; and a signed, server-only revalidation route supports content changes without an active Sanity Live visitor. Production webhook and secret configuration remain owned by the deployment/Sanity administrators and were not changed here. See `.agents/tasks/2026-09-26-backend-data-remediation.md` and `docs/SANITY_REVALIDATION.md`.

The working tree already contained a user change in `app/page.tsx` and untracked `to-do-backend.md`. They were preserved.

## Previous milestone (2026-09-16)

The headless CMS schema foundation and the official frontend implementation of the Homepage (Navbar, Footer, Hero, Mengapa Pendar Mentari, Mapres, and Publikasi) have been completed and merged into the `dev` branch.

## Repository baseline

- Local branch: `feat/members` (the prior `dev` milestone is historical).
- Stack currently installed: Next.js 16.3.4, React 19.2.8, TypeScript 5.9.3, Tailwind CSS 4.3.3, next-sanity 13.3.4, Sanity Studio 6.16.0.
- Runtime observed during discovery: Node.js 22.14.0 and pnpm 11.1.2.
- Brand tokens (Inter font, brand-blue, brand-yellow) have been implemented in `app/globals.css`.
- Sanity Studio configuration, 8 core schemas, GROQ query layer, and strict types are fully implemented.
- Production Homepage UI (`app/page.tsx`) replaces the old debug dashboard, utilizing real Sanity data.
- CI workflow passes tests.

## Workflow foundation

- Root agent dispatcher and compatibility pointer: complete.
- .agents context, approval, workflow, quality, task, decision, and handoff records: complete.
- Six project-specific skills: complete.
- Project-local Impeccable skill, Codex hook, product/design context, implicit UI routing, and quality-gate integration: complete.
- Path, frontmatter, whitespace, policy, lint, type, and production-build verification: passed.

## Historical workflow-foundation working-tree state

Before this task:

- AGENTS.md and CLAUDE.md were tracked and deleted.
- docs/2026_PREPARATION_AND_HANDOVER.md was untracked.
- docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md was untracked.
- .agents/ existed and was empty.
- .skills/ did not exist.

The approved workflow task intentionally recreates AGENTS.md and CLAUDE.md. It must not rewrite or relocate the two user-provided briefs.

## Earlier verification history (as of 2026-09-16)

- The Hima/Huria gallery now uses the supplied Instagram SVG, evenly distributed card spacing, and a compact mobile layout. Lint, direct TypeScript checking, and the Impeccable detector passed. The production build remains blocked by the existing inability to fetch the Google-hosted Inter font in this network environment.
- pnpm lint passed after the workflow changes.
- Direct TypeScript checking passed with pnpm exec tsc --noEmit --incremental false.
- The production build passed after network access was permitted for the unchanged starter's Google Fonts.
- All 22 required workflow paths exist.
- All six skills passed equivalent frontmatter, naming, description, and placeholder validation.
- The bundled quick validator could not start because PyYAML is absent from its Python environment; no dependency was installed for this documentation-only task.
- Unit/component and end-to-end test scripts do not exist.
- Impeccable doctor reports no context/config/hook drift, and the hook passed simulated Codex PostToolUse and Stop events.
- The manual Impeccable detector reports one existing warning for Arial in the unchanged starter's `app/globals.css`; no application change was authorized in the integration task.
- The pinned Impeccable installer declares Node `>=22.18.0`; its local tools passed under the current Node `22.14.0`, but the future runtime pin should meet the declared minimum.
- CI/test Sanity fallback is now hardened: missing public identifiers no longer fail module collection or trigger placeholder network requests; production remains strict.

## Open decisions and blockers

- Local Sanity integration hardening is complete. Deploying its term-scoped schemas still requires confirmation that the target dataset is isolated for 2026 and that a recoverable 2025 export exists; no Sanity service state was changed.
- The configured public dataset now includes published term-2026 documents. Published-only and term-scoped fetches remain required; no content was changed by this task.
- The homepage member data contract is now rendered as cards; the local Press Release model was removed. An Instagram integration remains an approved future direction, not an implemented service connection.
- Integration hardening remediation is complete locally: published-only Sanity Live, same-term references, generated image types, 2025-compatible route slices, CMS metadata/footer wiring, isolated dummy fixtures, and CI quality workflow are in place.
- Final institutional repository owner and branch protection.
- npm versus pnpm and the associated lockfile/CI strategy.
- Supported Node runtime pin (`>=22.18.0` is required by the installed Impeccable release).
- Final web plus Studio workspace topology.
- Sanity administrator access, recovered 2025 schemas, verified backup, and isolated 2026 dataset approval.
- Whether a separate development-2026 dataset will be maintained.
- Canonical route names and redirect strategy.
- Figma inspect access and complete responsive/interaction states.
- Impeccable's comp-first versus code-first default; ask once during the first applicable new-surface workflow.
- Per-developer Codex trust for `.codex/hooks.json` through `/hooks` or Settings.
- Vercel, domain, DNS, analytics, launch date, reviewers, and long-term owners.

These block affected production or architectural actions, but not approved local documentation or fixture-based planning.

## Next planned milestone

Obtain corrected client card copy and the three missing member photos, then patch only those affected member records after review. Review and merge the local backend remediation separately; production owners still need to configure and verify the revalidation webhook before release.
