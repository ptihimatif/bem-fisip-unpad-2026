# Task: Client Mapres and proker import

- Status: complete locally and published in Sanity
- Owner: backend maintainer and Codex
- Created: 2026-10-22
- Updated: 2026-10-22

## Objective and outcome

Publish the ten client-listed Mahasiswa Berprestasi and the 86 unit/program associations from the client's `SITUS BEM FISIP 2026` Google Doc to `jcpcptq3/production` for term 2026.

## Facts and approval

- The user approved the previously presented Mapres schema/import plan and added: "remove delegasi fisip, i approve lets go, i upload the images manually right?, dont forget to input the program/ proker also please, AND DONT CHANGE ANY OTHER DATAS OTHER THAN what i told u to do".
- The source document revision is recorded in `scripts/mapres-proker-source.json`.
- The source contains ten Mapres and 86 proker entries grouped under 17 published units. Some program names appear under more than one unit.
- Before import, production had five published `program` documents, zero published `mapres` documents, and one unrelated unnamed Mapres draft. Four of the five existing program unit references were inconsistent with the client list.

## Scope and ordered plan

1. Add Mapres study program, cohort year, and optional rank fields; make photo and achievement details optional. No Delegasi FISIP field or value.
2. Project the new Mapres fields and safely render the existing homepage when the client has not yet uploaded portraits.
3. Preserve the source names verbatim, map all 17 groups to verified 2026 unit IDs, and dry run the import against production.
4. Back up the five existing program documents. In one transaction create ten Mapres and 81 missing program documents, and patch only name, unit reference, and order on the five existing programs. Preserve all other program fields and the unrelated draft.
5. Read back and verify all 10 Mapres, 86 programs, their unit links, rank/order, and untouched existing fields; record the created IDs for rollback.
6. Run typegen, typecheck, lint, tests, build, and inspect the final diff.

## Boundaries, risks, and recovery

- No photos/assets, other Sanity document types, environment settings, webhooks, deployment, GitHub, or 2025 content may be changed.
- Source typos remain verbatim until the client supplies corrected wording. Optional descriptions, images, dates, and links are left blank on new programs.
- Existing program descriptions and featured flags are preserved. This may leave old description copy that the client has not yet reviewed.
- Before publication the script saves exact existing program documents under the ignored `outputs/mapres-proker-2026-10-22/` directory. The import state lists only created IDs and the five patched IDs. Rollback is deletion of those created IDs plus revision-aware restoration of the five backed-up program documents; do not restore the whole dataset.
- Production writes use the signed-in Sanity CLI, with exact project/dataset checks and document revision guards. The import transaction is atomic.

## Verification and authority

- User approved production Mapres and proker publication in the target dataset and confirmed they will upload photos manually.
- The read-only dry run passed: 10 Mapres, 86 proker, 17 verified units, 5 existing program patches, 81 new programs.
- The unrelated unnamed Mapres draft must remain untouched.

## Implementation outcome

- Local files: `sanity/schemaTypes/mapres.ts`, `sanity/lib/queries.ts`, `sanity.types.ts`, `schema.json`, a one-line missing-image guard in `app/page.tsx`, `scripts/mapres-proker-source.json`, `scripts/import_mapres_proker.mjs`, `.gitignore`, this task record, and `.agents/CURRENT_STATE.md`.
- Production Sanity: ten Mapres documents and 81 program documents created; five existing program documents patched only in name, unit reference, and order. No image asset was uploaded. The one unrelated unnamed Mapres draft was preserved.
- The ignored `outputs/mapres-proker-2026-10-22/` directory contains the exact five-document pre-write backup and the created/patch ID manifest.

## Verification results

- Read-only production preflight passed. The transaction committed atomically and immediate readback passed.
- An independent authenticated verification passed: ten published Mapres and 86 published programs with source names, rank/order, and correct unit references. The five existing programs retained every field outside the three approved patch fields.
- Sanity TypeGen, TypeScript typecheck, ESLint, three tests, production build, Impeccable detector, and `git diff --check` passed. The first sandboxed test attempt failed with `spawn EPERM`; the same test suite passed with process permission.
- The built homepage HTML contains the newly published Mapres names and did not crash on missing images.

## Remaining work and risks

- The user will upload the portraits manually in Sanity Studio and provide alternative text. The embedded Studio needs the normal application deployment to expose the revised Mapres fields to editors; no deployment was performed here.
- The client document contains apparent spelling mistakes in some proker names. They were imported verbatim as requested, pending client correction.
- The five pre-existing program descriptions, images, dates, links, and featured flags were preserved. Some old description copy may need separate editorial review.
