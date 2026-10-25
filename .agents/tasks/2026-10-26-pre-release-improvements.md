# Task: Approved pre-release improvements

- Status: local implementation complete; external release and content migration pending
- Created: 2026-10-26
- Baseline: `155854f` on `dev`
- Plan: `docs/PRE_RELEASE_IMPROVEMENT_PLAN_2026-10-26.md`
- Approval: maintainer, "okey i approve, execute!"

## Approved implementation

Execute the local work in the approved plan: a valid BEM favicon, dependency security upgrades, explicit environment/SEO configuration, compatible CMS integration, accessibility and browser checks, and Indonesian handover documentation. Preserve the frontend's established design and existing approved copy. Additive schema preparation may be implemented; production content migrations require a reviewed document/field list.

## External boundaries

Hosting/domain/dataset arrangements and release/rollback ownership remain undecided. No deployment, CORS/webhook change, production content mutation, GitHub setting change, commit, push, or merge is part of this local execution. Prepare concrete release procedures and report the remaining decisions.

## Recovery and verification

Code changes remain reviewable in the working tree. Restore individual baseline files to undo local changes; restore package manifest and lockfile together. Run frozen installation, TypeGen when applicable, lint, typecheck, unit tests, production build, dependency audit, focused browser checks, and scoped diff review. Record meaningful results and limitations below.

## Results

### Implemented locally

- Replaced the Vercel favicon with a real four-size BEM ICO. Preserved the source PNG and kept the legacy public path compatible.
- Upgraded Next.js 16.4.3, React 19.3.1, Sanity 6.20.0, Next Sanity 13.4.0, Sanity client 8.11.0, matching lint tooling, and TypeScript 6.0.3. Retained existing targeted CLI overrides/build permissions, updated TOML, added a narrow Undici patch override, and refreshed vulnerable compatible transitives. Final production audit: zero advisories.
- Added explicit environment/origin validation, non-indexable staging/development, per-page canonicals, social-preview fields, and shared footer/JSON-LD social URLs. Removed guessed domain fallbacks and the generic CI empty-CMS bypass.
- Wired Nilai, video, Care Center, social settings, and vision to CMS. Added optional structured vision/mission/work-culture/logo-copy fields and component props with current-copy fallbacks. No production data changed.
- Fixed button contrast and program modal reduced motion, focus visibility, portal stacking, and rich-text color on the light modal. Preserved established layouts, assets, logo behavior, and fallback copy.
- Added deterministic production-mode browser fixtures, Chromium desktop/mobile coverage, behavior tests, CI artifacts/audit gate, and Indonesian release/editor documentation.
- Prepared `outputs/pre-release-cms/about-content-plan.json` with the read-only `scripts/prepare_about_content.mjs`: one document, four additive fields, exact current copy, source hashes, revision, no existing-field conflicts, and no draft. The script has no publish mode.

### Verification

- Frozen-lockfile installation, peer compatibility, TypeGen, final TypeScript check, ESLint, and 13 behavior tests passed.
- Fixture production-mode build and 8 Chromium desktop/mobile tests passed: hydration, navigation, CMS rendering, filters/routes, missing content/noindex, staging protection, ICO signature, modal Escape/Tab/focus restoration/reduced motion, and rich-text readability.
- Desktop/mobile screenshots inspected. One confirmation pass fixed missing-cover close-button contrast and light rich-text colors.
- A separate actual-content production-mode build with an explicit non-indexable local origin passed. Built HTML contains current Mapres/Nilai and no fixture names.
- Both ICO paths have valid headers, four entries, and identical hashes. Documentation relative-link check passed (39 links).
- Production audit: zero advisories on 2026-10-26. Direct TypeID generation with the retained UUID override passed.
- The Impeccable detector retains the existing `border-l-4` warning on semantic Portable Text blockquotes. It is not a card accent; retained approved quotation styling is documented instead of reporting a detector pass.
- The initial canonical test was corrected to accept Next.js's equivalent normalized root URL. Next Sanity's promise-params type required awaiting fixture query params. Both were resolved before final verification.

### Remaining work and limits

- No commits, pushes, merges, deployments, GitHub settings, CORS/webhook changes, or Sanity content mutations occurred.
- Hosting targets, branches, owners, release/rollback authority, and launch date remain undecided. See `docs/panduan/08-checklist-rilis.md`.
- Client acceptance, current backup recovery, real-domain metadata, physical-device/screen-reader/200% zoom review, Studio login, and actual publish-to-site freshness remain release gates. Fixtures do not establish those results.
- Review the four-field manifest before separately authorizing publication. Existing legacy arrays and unrelated cabinet fields remain unchanged.
- Real-content builds use `.next`; fixture browser checks now build into `.next-check` and cannot replace that output.

### Follow-up: stale dev runtime and missing preview manifest

- The maintainer reported `ENOENT` for `.next/dev/server/preview-props.json` with Next.js 16.3.4 after the approved upgrade. Read-only process inspection confirmed port 3000 was owned by a server loaded from the old 16.3.4 package, while the installed package was 16.4.3. The dev manifest was absent. The precise event that removed it was not established.
- Stopped only the verified workspace dev launcher/server and restarted `pnpm dev`. Next.js 16.4.3 regenerated the manifest automatically; no cache deletion, handwritten manifest, UI change, or Sanity mutation was needed.
- Added `.next-check` as the explicit fixture-only `distDir`, updated the runner's build marker, generated-type includes, Git/ESLint ignores, and setup/troubleshooting documentation. Normal dev/build/start retain their default `.next` location. The installed Next.js build implementation already preserves its `dev` subdirectory during normal build cleanup.
- Verification: home, About, and ICO returned 200 before and after the concurrent fixture build; real-content pages contained no fixture names and the dev preview manifest remained present. All 8 browser tests, lint, TypeScript, and diff checks passed. The dev server remains available at `http://localhost:3000`.
