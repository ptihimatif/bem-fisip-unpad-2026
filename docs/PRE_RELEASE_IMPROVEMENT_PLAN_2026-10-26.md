# Pre-release improvement plan

- Prepared: 2026-10-26
- Repository baseline: `dev`, commit `155854f`
- Status: local implementation complete; external configuration and reviewed content publication pending. See `.agents/tasks/2026-10-26-pre-release-improvements.md`.
- Audience: backend/deployment maintainer, frontend partner, and release approver
- Authority for this document: the maintainer requested a Markdown plan before approving fixes, including an `.ico` website logo.

## 1. Goal

Prepare the existing Next.js and Sanity application for a controlled staging review and an approved production release. Prioritize dependency security, predictable content updates, environment configuration, editor usability, and accurate handover documentation. Add the correct browser-tab favicon using an existing approved logo.

Retain the current full-stack architecture. A custom database, separate API service, or framework rewrite is not justified by the current public website requirements.

## 2. Evidence and unresolved decisions

### Verified on the audit baseline

| Area | Observed state |
| --- | --- |
| Git | Clean `dev` at `155854f`; the current GitHub Quality workflow passed. |
| Local checks | TypeScript, ESLint, four tests, and a production build passed. The first sandboxed build was blocked by process permissions, then passed with those permissions. |
| Route smoke tests | Home, About, articles, Hima/Huria, an existing post, an existing unit, Studio shell, sitemap, and robots returned successfully. This did not test Studio authentication or every browser interaction. |
| Dependencies | The audit reported 48 production dependency advisories: 4 critical, 13 high, 22 moderate, and 9 low. These are package advisory matches, not 48 proven exploitable application paths. Next.js is pinned to `16.3.4`; the lockfile includes Sharp `0.35.4`. |
| Sanity | Project `jcpcptq3` lists one dataset, `production`. Published content includes 10 Mapres, 86 programs, 268 members, 24 units, 9 associations, and 6 posts. |
| Data integrity | No broken member/program unit references or duplicate slugs within a document type were found. All checked published image fields with assets had alternative text. All 10 Mapres have image references; 3 members have no photo. |
| Programs | Only 5 programs have short descriptions and covers; none has a full description. There are 3 featured programs. Final featured-program approval is unresolved. |
| CMS integration | About institutional copy, profile video, and several footer/navigation links remain hardcoded despite related CMS fields. `Footer` accepts settings but does not use them. |
| Branches | The repository default branch is `main`. Its remote ref is still the initial scaffold, 42 commits behind `dev`; the deployment guide names `main` as production. |
| Favicons | `app/favicon.ico` is a valid ICO containing the Vercel triangle. `public/assets/favicon.ico` displays the institutional BEM logo, but its bytes are PNG, not ICO. Root metadata currently points to the latter. |

### Clarifications from the maintainer

- Hosting destinations, domains, deployment branches, release approver, rollback operator, and launch date are undecided.
- A deployed Sanity publish webhook is absent or unverified.
- Client approval of the content and UI is partial.
- Each annual website will use a new dataset. This plan focuses on the current 2026 release and its backup; it does not add 2025 recovery work.
- The maintainer says a 2026 backup exists. Its current coverage, storage location, and recovery procedure still need to be verified before release.

### Important interpretation of the audit

The installed Next.js guide states that `notFound()` returns HTTP 200 for an already-streamed response and 404 for a non-streamed response. The two missing dynamic URLs tested returned 200. That status alone is not proof of a routing bug. Check rendered not-found content and robots metadata before proposing a change that affects streaming or caching.

Security versions and advisory counts are a dated snapshot. Recheck the registry and maintainer advisories when implementation begins. Some reported Next.js critical issues require features not found in application source during the audit, such as `next/og` or the affected `use cache` pattern.

## 3. Scope and ownership

| Work | Proposed owner | Approval boundary |
| --- | --- | --- |
| Dependency upgrades, environment validation, cache/revalidation, CI, release procedures | Backend/deployment maintainer | Local implementation approval; separate authority for external service changes. |
| Favicon | Backend/deployment maintainer using the existing BEM asset | Included in the proposed local work; logo source is identified below. |
| CMS-to-component wiring and accessibility repairs | Backend maintainer with frontend partner review | Preserve approved layout and styling; identify every frontend file in the review. |
| Official copy, featured-program selection, portraits, and social URLs | Client/content owner | Changes to published Sanity data require an explicit reviewed field/document list. |
| Hosting, CORS, webhooks, domains, deployment, and branch settings | Named service/release owner | Explicit target, authority, and rollback required. |

The maintainer approved local implementation, including required package installations, on 2026-10-26. Commits, pushes, merges, deployments, and production content changes are not authorized by this local approval. External release approval will refer to a concrete selected target and verification results.

## 4. Recommended work order

### A. Fix the favicon — small, explicit website requirement

**Outcome:** browser tabs display the BEM logo consistently.

1. Use the existing institutional BEM artwork currently stored at `public/assets/favicon.ico` as the proposed source. It is the logo already intended by the root metadata. If the maintainer prefers the Pendar Mentari cabinet mark, select that source before conversion.
2. Convert the source into a real multi-resolution ICO with 16, 32, 48, and 256 pixel representations. Preserve the artwork and proportions; do not redraw or invent a logo.
3. Replace the Vercel icon at `app/favicon.ico`, following the installed Next.js file convention.
4. Resolve the redundant metadata/public-file setup so browsers receive the intended logo consistently. Search references before removing any old public path; keep compatibility if it is still used.
5. Inspect the result at actual tab sizes and verify it in a fresh browser session, where an older cached favicon will not mask the change.

**Expected files:** `app/favicon.ico`, `app/layout.tsx`, and possibly `public/assets/favicon.ico`.

**Acceptance:** a real ICO is served at `/favicon.ico`, the page icon links resolve, the BEM artwork is visible, and no Vercel icon or PNG masquerading as ICO remains in the active favicon setup. An Apple touch icon or installable PWA is not required for this request.

### B. Update vulnerable dependencies before public staging

**Outcome:** deploy a supported, patched framework and document the remaining applicable dependency risk.

1. Repeat `pnpm audit --prod` and inspect each critical/high package against actual usage and deployment conditions.
2. Select a compatible patched Next.js release and matching `eslint-config-next`; check React, Next Sanity, and Sanity peer requirements. The audited Next.js advisories identify `16.4.1` as a patched release for the October findings, but do not treat that as a permanent latest-version recommendation.
3. Ensure the resolved Sharp version includes the relevant fix; the audited image advisory specifies at least `0.35.5`.
4. Update Sanity/Studio or affected transitives where required. Prefer supported package upgrades. Use a narrow override only with an explanation, compatibility evidence, and a removal condition.
5. Review the package and lockfile diff. Do not use a forced audit fix, broadly disable image security, or suppress advisories without documenting applicability.
6. Re-run the quality gates and a production-mode smoke test, especially Studio and image loading.

**Expected files:** `package.json`, `pnpm-lock.yaml`, and compatibility changes only where the selected upgrades require them.

**Acceptance:** no unresolved applicable critical/high advisory in the public runtime; any residual report has a documented package path, exploit condition, applicability decision, owner, and follow-up. Frozen installation, lint, typecheck, tests, and build pass.

### C. Make environment and SEO behavior explicit

**Outcome:** the selected environment cannot silently publish the wrong origin or an empty CMS configuration.

1. Choose the staging and production hosting projects/domains and map their deployment branches. Recommended workflow: reviewed feature work into `dev`, staging from the agreed integration branch, then a reviewed release into the selected production branch. Do not merge 42 commits or change the default branch without review.
2. Centralize and validate the site origin used by metadata, canonical URLs, sitemap, robots, and JSON-LD. Use the selected origin rather than an unverified public-domain fallback in release builds.
3. Make staging non-indexable with appropriate robots metadata/headers and hosting access protection where available. Production should become indexable only on the approved canonical origin.
4. Keep Sanity public identifiers separate from server secrets. Validate the intended project/dataset in each environment and document every variable without its value.
5. Review the `CI=true` empty-content fallback. Keep isolated CI checks possible, but ensure a real deployment with missing Sanity configuration fails clearly instead of producing an empty site merely because the host sets `CI=true`.
6. Pin a supported runtime consistently across CI, local setup instructions, and hosting. Keep pnpm as the current package manager.
7. Wire the existing default/post social-preview image fields into metadata when approved assets exist. Validate canonical URLs for non-home pages; do not let every page inherit a home-page canonical.

**Expected files:** `.env.example`, `sanity/env.ts`, `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`, post/unit/page metadata, and CI/runtime configuration as needed.

**Acceptance:** missing release configuration fails clearly; staging is not indexable; production URLs and social previews use the selected domain; no secret is included in browser output, logs, or committed files.

### D. Verify reliable Sanity publishing and staging isolation

**Outcome:** an editor can publish while no visitor is connected and the next visitor sees current content.

1. Decide the staging content arrangement. Recommend an isolated 2026 staging dataset for publishing and migration rehearsals. A staging site reading production is an alternative for visual review, but it must not expose a convenient editing path that unintentionally writes to production.
2. Create or configure that arrangement only after the exact project/dataset and authority are approved. Annual dataset separation does not by itself provide a staging environment.
3. Configure the selected staging/production origins in Sanity CORS, with credentials only where the editor workflow requires them.
4. Configure the signed webhook for the selected dataset and deployed `/api/revalidate` endpoint. Keep the secret in the hosting secret store and the Sanity webhook configuration.
5. Test create, update, and delete using an isolated test record. Close active Live connections, publish, then request the page again and inspect both content and webhook attempts.
6. Verify authentication failure, malformed payload handling, and absence of drafts in public responses. Avoid changing the current published-only contract.

**Expected code:** `app/api/revalidate/route.ts`, `sanity/lib/live.ts`, `sanity/lib/cache.ts`, and tests only if verification reveals a defect. External configuration may be sufficient.

**Acceptance:** an approved publish reaches the website within the agreed freshness target without a redeploy or an already-open visitor; invalid signatures fail; drafts remain private; staging tests do not alter unrelated production data.

### E. Complete the CMS editor contract without redesigning the frontend

**Outcome:** editors can change the content documented as editable in Studio and see the corresponding website change.

1. Build a field-to-component mapping and compare current CMS content with rendered copy. Resolve differences with the content owner before changing what visitors read.
2. Start with compatible existing fields: Nilai title/description objects, the profile video URL, and approved site settings links. Pass validated data into the existing components while retaining their appearance and interactions.
3. Use the same approved social URLs in footer/navigation and Organization JSON-LD. Remove ignored props or wire them correctly.
4. Plan the remaining About sections carefully. Current vision includes highlighted phrases with explanations; missions and work culture have titles and bodies. Existing schema fields are plain text/string arrays, so direct substitution would lose structure. Propose additive object fields and explicit migration mappings for these sections; do not replace existing field types or parse sentences heuristically.
5. Keep logo-piece IDs, asset selection, and animation behavior as presentation configuration. Store editable explanation copy in Sanity only after a stable mapping to those pieces is agreed.
6. Reconcile and preview the exact affected content before any approved production migration. Back up and revision-check only the documents/fields being changed.

**Expected files:** `sanity/schemaTypes/cabinetProfile.ts` if approved additive fields are needed, `sanity/lib/queries.ts`, generated schema/types, `app/about/page.tsx`, `app/page.tsx`, `app/layout.tsx`, `components/about/*`, `components/Footer.tsx`, and `components/Navbar.tsx`.

**Acceptance:** approved CMS edits appear on the correct surface; existing approved wording, layout, logo behavior, and content order are preserved; missing optional data has a deliberate fallback; the client editor guide matches actual behavior.

### F. Fix verified accessibility and SEO issues; add focused browser coverage

**Outcome:** visitors can use the main flows with a keyboard, touch, and reduced motion, and missing content is represented correctly to crawlers.

1. Fix white text on yellow buttons in `app/not-found.tsx` and the post Instagram link using the approved blue/yellow palette. Verify contrast in default, hover, and focus states.
2. Honor reduced-motion preferences in the program modal and retain visible focus on its close/arrow controls. Verify focus containment, Escape, focus restoration, and layout at mobile/desktop sizes.
3. Check missing post/unit responses for not-found UI and `noindex` metadata, using the installed Next.js streaming rules. Fix genuine indexing/content errors. If strict HTTP 404 requires a rendering change, present that tradeoff before changing architecture.
4. Add a small browser suite for primary routes, mobile navigation, program modal, article filters, missing content, favicon/SEO output, and production CSP behavior. Use an isolated fixture/dataset strategy so routine CI does not depend on mutable production copy.
5. Perform one batched desktop/mobile review, including narrow width, 200% zoom, keyboard use, and reduced motion. Verify detector findings in context; do not treat stylistic detector warnings as launch failures without user impact.

**Expected files:** the affected pages/components, browser test configuration, focused tests, `package.json`/lockfile, and `.github/workflows/quality.yml`.

**Acceptance:** the tested flows work in production mode without relevant CSP/hydration errors; button contrast and keyboard focus pass; missing pages are non-indexable; browser tests run reproducibly.

### G. Finish content approval and client documentation

**Outcome:** the client knows what is live, what is editable, who operates it, and how to recover it.

1. Ask the client to confirm the featured-program selection, program wording, social URLs, remaining member photos, and final About copy. Do not invent missing program descriptions or silently correct source spellings.
2. Record whether title-only program lists are accepted for launch. Complete optional descriptions/covers only with client-supplied material and explicit publication approval.
3. Update `docs/panduan/` in Indonesian after implementation: environment setup, editor field visibility, staging/production workflow, favicon, publishing, webhook troubleshooting, backup, and rollback.
4. Correct stale facts: all Mapres now have image references; `@sanity/webhook` is a direct dev dependency; the October 25 work is committed; tests and typecheck scripts exist. Resolve the missing handover-document reference without fabricating the absent document.
5. Replace conflicting operational claims with the selected branch/hosting/domain/dataset arrangement. Add named roles, not secret values.
6. Have an intended editor follow the publishing instructions and record the result. Update the applicable task record and `.agents/CURRENT_STATE.md` after implementation milestones.

**Expected files:** `README.md`, `docs/panduan/*`, `.agents/QUALITY_GATES.md`, `.agents/CURRENT_STATE.md`, and the approved execution task record.

**Acceptance:** documentation describes the deployed behavior, dated counts are identifiable as snapshots, paths/links resolve, and an editor can complete the documented task.

### H. Rehearse staging, then request production approval

1. Select the release commit and run a frozen-lockfile install plus all required gates on that commit.
2. Verify a current 2026 dataset export, access to it, and the procedure for recovering the selected release. Rehearse restoration in an isolated target where feasible; do not restore over production as a test.
3. Deploy the approved staging target and test real origins, HTTPS, Studio login, CORS, signed publishing, metadata, favicon, official links, browser flows, and error behavior.
4. Resolve staging findings and obtain client acceptance of the release content/UI.
5. Prepare a concrete production change list: commit, hosting target, origin, dataset, variables, webhook/CORS changes, operator, rollback trigger, rollback steps, and known accepted exceptions.
6. Request explicit production approval against that concrete result. Domain/DNS changes and GitHub settings need their own identified authority if required.
7. After an approved release, check core routes and publishing again, monitor service logs, and record the deployed version and handover owner.

**Acceptance:** staging passed, release authority and rollback operator are named, production content is approved, the current backup is usable, and the post-deployment checks pass.

## 5. Verification strategy

| Check | Purpose | Required point |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` in a clean environment | Reproducible dependency resolution | After dependency changes and before staging. |
| `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` | Existing source and build gates | Each relevant implementation batch. |
| TypeGen and generated-file diff | Schema/query contract consistency | After schema or query changes. |
| Dependency audit plus applicability review | Confirm known public-runtime risk is resolved or explicitly assessed | After upgrades and before release. |
| Production HTTP/browser checks | Real CSP, hydration, navigation, modal, SEO, favicon, and missing-content behavior | Local build and selected staging origin. |
| Sanity publish/readback test | Verify freshness, published-only reads, and valid references | Isolated staging, then a separately approved production smoke test. |
| Documentation/path review and editor walkthrough | Validate the client handover | Before production acceptance. |
| `git diff --check` and scoped diff review | Catch whitespace issues and unrelated edits | Every completed batch. |

Tests should protect real behavior. Do not add tests that only repeat static fixture contents or implementation details. Stop repeating successful checks unless a later change or an unresolved risk justifies another run.

## 6. Data safety, rollback, and external authority

- Code rollback: retain the prior verified commit/deployment and revert the specific reviewed change if needed. Dependency rollback must restore both manifest and lockfile.
- Content rollback: back up the approved target documents/fields before mutation; use revision guards and an ID-based change manifest. Preserve unrelated fields and all other document types.
- Dataset rehearsal: use the approved isolated target. Do not overwrite or delete the existing production dataset.
- Hosting rollback: identify the prior healthy deployment, operator, and promotion/reversion procedure before production approval.
- Secret handling: no tokens or webhook secrets in Markdown, Git, client bundles, screenshots, or logs.
- Potential cost/access: staging hosting, an additional Sanity dataset, browser CI, and retained backups may consume service quotas. Check the actual account plans before provisioning; this document assumes no price or entitlement.
- No external service change is authorized by creating or approving only this planning document.

## 7. Improvements to defer unless separately requested

- A framework rewrite, microservices, a custom backend/database, or a separate content API.
- A site redesign, new brand elements, new navigation, or rewritten institutional copy.
- A new program detail page or program gallery schema before client requirements exist.
- Converting the three repeated cross-unit programs into a multiple-owner model before the client confirms they are shared programs rather than separate unit entries.
- A blanket switch to request-time rendering solely to tighten CSP or force all not-found statuses to 404. First establish the concrete benefit and hosting/performance tradeoff.
- Unmeasured performance rewrites. Profile the deployed staging build first; the About HTML was approximately 713 KB uncompressed in the audit, but no Core Web Vitals or traffic-capacity result was measured.
- Reimporting members, Mapres, or programs. Existing records are already published; future changes should be narrow patches to explicitly approved fields.

## 8. Suggested approval batches

| Batch | Work packages | Can begin without a chosen hosting destination? |
| --- | --- | --- |
| 1 | A: favicon, B: dependency remediation, local parts of C: configuration validation | Yes, after local implementation approval. |
| 2 | E: CMS integration, F: focused accessibility/browser tests, G: documentation | Yes, with the frontend/content scope approved and migrations reviewed separately. |
| 3 | External parts of C/D and H: staging provisioning and publishing rehearsal | No; exact destinations, dataset arrangement, service authority, and applicable costs must be decided. |
| 4 | H: production release | No; requires staging evidence, final client acceptance, a current 2026 backup, and named release/rollback authority. |

The strongest first implementation batch is favicon + dependency remediation + explicit environment validation. These address a requested branding defect and the highest verified release risks while the hosting decisions are being made.

## 9. Implementation status — 2026-10-26

| Package | Outcome |
| --- | --- |
| A | Complete: valid BEM ICO at root and legacy paths; source PNG preserved. |
| B | Complete: compatible upgrades, retained targeted overrides, peer/frozen-install checks, final production audit with zero advisories. |
| C | Local code complete: explicit environment/origin, staging noindex, per-page SEO and social images; hosting/branch/domain decisions pending. |
| D | Isolated checks and release procedure ready. Actual CORS, deployed webhook, and no-visitor publish test need an approved environment. |
| E | Local integration and additive schemas complete. Exact four-field manifest prepared with no conflicts/draft; production publication awaits field/content review. |
| F | Local fixes, production-mode build, 13 behavior tests, and 8 desktop/mobile browser tests pass. External-device, screen-reader, and final zoom acceptance remain release checks. |
| G | Indonesian docs updated; client content/UI acceptance and owner details pending. |
| H | Concrete checklist prepared; no staging or production service mutation performed. |

Verification detail: `.agents/tasks/2026-10-26-pre-release-improvements.md`. Security detail: `docs/DEPENDENCY_SECURITY_2026-10-26.md`. Client/operator procedures: `docs/panduan/08-checklist-rilis.md` and `09-konten-about-dan-favicon.md`.

## 10. References

- Audit baseline: `155854f`; Quality workflow run `40172869814`.
- [Current commit's Quality run](https://github.com/ptihimatif/bem-fisip-unpad-2026/actions/runs/40172869814).
- [Next.js image optimization advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw).
- [Next.js ImageResponse advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j).
- [Next.js use-cache advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
- Installed Next.js icon guide: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md`.
- Installed Next.js not-found guide: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md`.
- Repository procedures: `AGENTS.md`, `.agents/PLANNING_AND_APPROVAL.md`, `.skills/project-planning/SKILL.md`, `.skills/quality-review/SKILL.md`, and `.skills/release-handover/SKILL.md`.

**Local implementation complete. External staging and production actions await named targets and separate release approval.**
