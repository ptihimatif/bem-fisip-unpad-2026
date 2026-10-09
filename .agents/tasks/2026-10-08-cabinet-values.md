# Task: Add explanations to 2026 cabinet values

- Status: implemented locally and published in Sanity; Studio deployment pending normal release
- Owner: Codex
- Reviewer: project maintainer
- Date: 2026-10-08

## Authority and outcome

The maintainer requested a schema revision so each Nilai has its own explanation and explicitly asked to submit the four client-supplied entries to the Sanity database. The selected target is project `jcpcptq3`, dataset `production`, singleton `cabinetProfile-2026`, consistent with the repository's public configuration and earlier approved 2026 content work. The published document originally had the same four names as plain strings and no draft.

The four approved title/description pairs are now published in the existing `values` field in the supplied order: Empati, Resilien, Kolaboratif, Meritokrasi. Only this field was patched. No frontend page, other content, deployment, webhook, or Git remote was changed.

## Implementation

- `sanity/schemaTypes/cabinetProfile.ts`: `values` is now an array of `cabinetValue` objects with required `title` and `description` fields and an editor preview.
- `sanity/lib/queries.ts`: projects each value's `_key`, `title`, and `description`.
- `schema.json` and `sanity.types.ts`: regenerated with `pnpm typegen`.
- `scripts/update_cabinet_values.mjs`: exact-target, draft-aware, revision-checked update and readback utility. It is idempotent and saves the full pre-update document before writing.
- `.gitignore`: excludes the local value-update backup.

## Backup and rollback

The pre-update document is stored at `outputs/cabinet-values-2026-10-08/cabinetProfile-2026-before.json`, SHA-256 `6599a1729b029b8ff062313e458cd325753e8325a235c493254bd5317e13a704`. Its original revision was `HMKVaNiXEa4jwBNlMbSMRX`; the post-update revision observed was `BX08da2vhd5iaLE1mjThiQ`. The file is ignored by Git and must be retained until accepted.

If rollback is requested, first read the current singleton and ensure no later editor changes need preserving. Patch only `values` from the backup using the *current* `_rev` as an `ifRevisionId` guard; do not replace the full document or restore a dataset export over newer content. The schema/query rollback must be coordinated with the content shape if the new Studio code has been deployed.

## Verification and handoff

- Authenticated dry run confirmed the target, old names, and absence of a draft.
- Authenticated write and independent readback confirmed all four exact titles/descriptions. A published GROQ projection returned the same four entries.
- `pnpm typegen`, `pnpm lint`, `pnpm typecheck`, `pnpm test` (3 tests), `pnpm build`, and `git diff --check` passed.
- The About page currently does not render `values`; the frontend partner can use `CABINET_PROFILE_QUERY`'s new `values[]{_key,title,description}` shape when building that section. The embedded Studio will expose the new editor fields after the updated application code is deployed through the normal release workflow.
