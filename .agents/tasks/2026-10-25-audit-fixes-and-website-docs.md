# Task: Image loading, Mapres cards, audit fixes, and website documentation

- Status: complete locally (uncommitted)
- Owner: maintainer with Claude Code
- Reviewer: pending
- Created: 2026-10-25
- Updated: 2026-10-25
- Related decision: none

## Objective and outcome

Make member photos load quickly, render the new Mapres data, fix the findings of a whole-repository audit, and write complete Indonesian website documentation under `docs/panduan/`.

## Approval

- Image fix: "okay go" after the `unoptimized` plan was presented.
- Mapres: "kalo mapres nya gapunya gambar dikasih image placeholder aja", "update data … sesuai data baru di sanity", "mapres 1 mapres 2 hapus aja … siapin juga text prestasi … kalo gaada mah hilangin aja".
- Audit: "coba fix, semua audit", then "ya benerin semua nya" and "go cek" for the CSP change and browser verification.
- Documentation: "buat dokumentasi lengkap", with answers "Dokumentasi website" and "Markdown di repo, Indonesia".
- Standing instruction: never commit or push.

## Implementation outcome

- `components/SanityImage.tsx`: `unoptimized`; Sanity CDN already serves resized WebP (~35 KB per member photo vs a ~1.1 MB PNG original), so the second `/_next/image` pass was removed.
- `app/page.tsx`: Mapres cards show study program + cohort, optional achievement (+ year), a silhouette placeholder when no portrait; no rank badge.
- `next.config.ts`: production CSP now allows `'unsafe-inline'` scripts (required by Next.js without nonces; the previous policy blocked hydration in production), `https://core.sanity-cdn.com` scripts, `https://design-system-static.sanity.io` fonts, and `wss://*.api.sanity.io` connections for Studio.
- `app/penjelasan/[birdep]/page.tsx`: removed `PLACEHOLDER_PROGRAMS`; units without programs show the existing empty state instead of fake names.
- `components/ArticleCard.tsx`, `app/post/[slug]/page.tsx`: dates formatted in `Asia/Jakarta`.
- `components/ProgramList.tsx`: re-measures rows on width change; a lone over-long name may wrap.
- `tests/revalidate.test.ts`: covers 503 / 401 (missing, forged) / accepted signature. Removed `tests/content-contract.test.ts` and `sanity/fixtures/2026-content-contract.json` (they only tested the fixture against itself).
- Removed unused `components/SiteChrome.tsx`, `components/LoadingSpinner.tsx`, `safeMailto`; untracked `build.log` and ignored it.
- `app/layout.tsx`: skip-link typo "Lewkati" → "Lewati".
- Documentation: `docs/panduan/` (README + 7 chapters) and a real root `README.md`.
- No Sanity content, schema, deployment, webhook, CORS, or GitHub state changed. All Sanity access was read-only.

## Verification results

- `pnpm typecheck`, `pnpm lint`, `pnpm test` (4/4), `pnpm build` passed.
- Production server (`pnpm start`) + headless Chrome at 390px: `/` and `/about` mobile menu opens (hydrated), `/hima` detail opens, unit page program rows do not overflow, `/penjelasan/bidang-kemahasiswaan` shows the empty state, `/studio` renders. No CSP violations after the final build.
- Remaining console errors were CORS from the unregistered test origin `http://localhost:3123` (Sanity project setting, not code).
- Documentation: links between chapters and referenced paths checked against the tree.

## Remaining work and risks

- Not browser-tested: rotation/resize behavior, homepage program modal, Instagram embed, Studio login/editing.
- `@sanity/webhook` is imported by the new test but is only a transitive dependency.
- Content gaps and hardcoded About copy are listed in `docs/panduan/07-pemeliharaan-dan-troubleshooting.md`.
