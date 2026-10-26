# Dependency security review — 2026-10-26

## Changes

The pre-release work upgrades Next.js and its lint config to 16.4.3, React/React DOM to 19.3.1, Sanity/Studio Vision to 6.20.0, Next Sanity to 13.4.0, and the Sanity client to 8.11.0. TypeScript 6.0.3 satisfies the updated Sanity toolchain peer requirement. The project keeps pnpm 11.1.2; `.node-version` and CI select Node 22.18.0.

Compatible transitive updates resolve the reported DOMPurify, Zod, Vite, source-map, brace-expansion, and related findings. Existing project-specific CLI overrides are retained, the TOML patch is updated, and an Undici selector is added in `pnpm-workspace.yaml`:

| Selector | Resolved patch | Why retained |
| --- | --- | --- |
| Undici 7.x below 7.30.1 | 7.30.1 | Pinned toolchain paths retained vulnerable HTTP/WebSocket versions. |
| `@vercel/frameworks > smol-toml` | 1.9.1 | Update the existing framework-detection override; 1.8.1 is not published. |
| `@vercel/frameworks > js-yaml` | 3.15.2 | Retain the existing same-major parser fix. |
| `@module-federation/dts-plugin > adm-zip` | 0.6.1 | Retain the existing patch-level ZIP fix. |
| `typeid-js > uuid` | 11.1.1 | Retain the existing project override; generation compatibility was checked after the upgrade. |

Each override should be removed after upstream resolves a safe version without it and the frozen install, audit, Studio, TypeGen, and build checks still pass. Existing build permissions are preserved: esbuild is allowed; Sharp and unrs-resolver scripts remain denied. Approval is not granted to all package scripts.

## Audit result

`pnpm audit --prod` on 2026-10-26 reports **zero advisories** after remediation. Audit counts are snapshots and should be checked again before release; this is not a guarantee that no unknown vulnerability exists.

The intermediate lockfile reported [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) through `sanity -> @sanity/cli -> typeid-js -> uuid`. The final lockfile retains the repository's prior targeted UUID 11.1.1 override, which resolves that report.

The installed TypeID source imports UUID `v7` and `stringify`. A direct TypeID generation smoke check passed with the retained override. Application source does not import UUID. TypeGen and the application build also passed with the upgraded graph.

Owner: backend maintainer. Recheck on Sanity/TypeID updates and before release. Prefer an upstream TypeID release that declares the patched UUID major so the existing override can be removed.

## Sources

- [Next.js image optimization advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw).
- [Next.js ImageResponse advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j).
- [Next.js use-cache advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr).
- [pnpm 11 build-script permissions](https://pnpm.io/11.x/cli/approve-builds).

Current release checks and operating status are recorded in `docs/HANDOVER_DEPLOYMENT_HEMAT_2026.md`. Earlier task records were archived during the maintainer-approved repository cleanup; Git history preserves committed records.
