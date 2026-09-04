# Task: Impeccable integration

- Status: complete
- Owner: Codex
- Reviewer: Project maintainer
- Created: 2026-09-04
- Updated: 2026-09-04
- Related decision: None

## Objective and outcome

Install Impeccable as a project-local Codex skill and hook so relevant frontend and UI work automatically receives its design guidance and edited UI files receive an automated quality check.

## Facts, assumptions, and questions

### Known facts

- The project already routes UI work through `.skills/design-system/SKILL.md`.
- Codex discovers repository-local skills under `.agents/skills/`.
- Impeccable supports a project-scoped Codex installation and provides a Codex hook.
- The project brief requires Inter and the brand colors `#003089` and `#FFBA3A`.
- The current application remains the default Create Next App scaffold.

### Assumptions

- The approved scope includes installer-generated project files and concise workflow integration documentation.
- The Impeccable detector may flag Inter by default, so a narrow documented exception is appropriate because the client brief explicitly requires it.
- Hook trust must remain a user-controlled Codex action.

### Material questions

- None for this local workflow integration. Complete Figma states remain an open design input for later implementation.

## Scope

### In scope

- Install pinned `impeccable@3.6.1` for Codex at project scope.
- Audit all installer-generated files before enabling the hook configuration.
- Configure implicit Impeccable routing for relevant UI and design work.
- Add the Impeccable Codex hook and a narrow shared Inter exception.
- Create concise `PRODUCT.md` and starter `DESIGN.md` context from the authoritative project briefs.
- Integrate Impeccable into the existing agent workflow documentation.
- Verify the installation, hook, workflow paths, lint, types, and production build.

### Out of scope

- Redesigning or editing the current starter page.
- Running a UI critique or polish pass on the application.
- Application source, dependency, or lockfile changes.
- CI detector enforcement or a global Impeccable installation.
- Trusting the Codex hook on the user's behalf.
- Inventing responsive or interaction states not present in the briefs or Figma.

## Expected impact

- `.agents/skills/impeccable/`
- `.codex/hooks.json`
- `.impeccable/`
- `.gitignore`
- `PRODUCT.md`
- `DESIGN.md`
- `AGENTS.md`
- `.skills/README.md`
- `.skills/design-system/SKILL.md`
- `.agents/README.md`
- `.agents/QUALITY_GATES.md`
- `.agents/CURRENT_STATE.md`
- This task record

No application source, package manifest, lockfile, CMS, deployment, or production content changes are expected.

## Ordered plan

1. Record the approved task and working-tree baseline.
2. Run the pinned project-scoped Codex installer.
3. Inspect every generated path, script, skill, hook, and configuration file.
4. Add the client-required Inter exception with the installed administration script and verify hook status.
5. Add product/design context and connect Impeccable to the existing routing and quality gates.
6. Validate the generated skill, hook, documentation paths, diff, lint, types, and build.
7. Record results and remaining user-only hook trust action.

## Cross-cutting implications

- Design system: Adds reusable design-quality guidance while preserving the client-approved typography and colors.
- Accessibility: Adds automated and procedural review prompts; WCAG 2.2 AA remains authoritative.
- Content and Sanity: Product context documents public company-profile goals; no CMS changes.
- SEO: No route or metadata changes; existing SEO requirements remain in the briefs.
- Security and privacy: Installer output and scripts are inspected before activation; no credentials are required.
- Performance: No runtime dependency is added; UI guidance includes performance-conscious implementation checks.
- Migration and compatibility: Project-local files avoid a global installation and do not modify the 2025 source or data.

## Risks and recovery

- Risk: The installer writes outside the approved project-local paths.
  - Safeguard: Use explicit Codex and project-scope flags, then inspect the working tree before activation.
  - Rollback or recovery: Remove only the audited installer-generated paths after confirming their exact locations.
- Risk: Generic Impeccable guidance conflicts with the client brief.
  - Safeguard: State the source-of-truth order and add only the documented Inter exception.
  - Rollback or recovery: Remove the exception or integration wording while retaining the underlying approved brief.
- Risk: A hook runs without informed user trust.
  - Safeguard: Leave final trust to the user through Codex `/hooks` or Settings.
  - Rollback or recovery: Disable the hook with the installed administration command or Codex hook controls.

## Verification

### Automated

- Run Impeccable installation diagnostics and detector where supported.
- Validate the installed skill frontmatter and referenced paths.
- Validate `.codex/hooks.json` as JSON and inspect referenced scripts.
- Run `git diff --check`.
- Run `pnpm lint`.
- Run direct TypeScript checking.
- Run `pnpm build` if the environment permits it.

### Manual

- Inspect all generated files and the final diff.
- Confirm client/Figma authority, Inter, and brand colors remain explicit.
- Confirm no application source, package, lockfile, Sanity, production, or external state changed.
- Confirm hook trust remains a user action.

## Authority and external changes

- Required credentials/access: Network access to download the pinned public npm package; no account credentials.
- External state changes: Public package download only; repository-local files are changed.
- Cost implications: None expected.
- Additional client/institution approval: None for the approved local integration; production actions remain separately gated.

## Approval

- Status: Approved
- Approved by: Project maintainer
- Approval wording: “sure i approve”
- Approval date: 2026-09-04

## Implementation outcome

- Files changed: Installed 169 vendored files under `.agents/skills/impeccable/`; added `.codex/hooks.json`, shared `.impeccable/config.json`, ignored local hook state, `PRODUCT.md`, `DESIGN.md`, and this task's workflow integrations in `AGENTS.md`, `.skills/`, `.agents/`, `.gitignore`, and `eslint.config.mjs`.
- Systems changed: Repository-local files and Git's local exclude list only. The pinned public npm installer was downloaded ephemerally; no dependency, lockfile, application source, CMS, deployment, or production state changed.
- Summary: Codex can implicitly discover Impeccable for frontend/UI work, the BEM-specific design procedure explicitly pairs with it, and the enabled project hook performs post-edit and Stop detection after each user trusts the manifest. The client-required Inter choice is preserved through a narrow shared detector exception.

## Verification results

- `impeccable@3.6.1` installed successfully with explicit Codex/project flags; the downloaded skill reports metadata version 4.1.3.
- All 169 installed files were inventoried; all 120 generated JavaScript files passed `node --check`.
- The Codex hook manifest and shared config parse as valid JSON and reference only the project-local hook entrypoint.
- `hook-admin.mjs status` reports the hook enabled, no ignored rules/files, and only `overused-font=inter` in ignored values.
- `doctor.mjs --json` resolved `PRODUCT.md`, `DESIGN.md`, and platform `web`, found the rule registry, and returned no findings.
- A simulated Codex PostToolUse event returned the expected clean acknowledgment; the matching Stop event returned the expected blocking review payload.
- The manual detector found one existing warning in the unchanged starter: Arial in `app/globals.css`. It remains standing because redesigning the starter is out of scope.
- Required workflow paths, all seven skill frontmatters, JSON files, final newlines, whitespace, hook targets, and local ignore rules passed validation.
- `git diff --check` passed.
- `pnpm lint` passed cleanly after excluding the vendored Impeccable bundle from application lint.
- Direct TypeScript checking passed with the repository's local TypeScript binary.
- `pnpm build` passed and generated `/` and `/_not-found`.
- Final status/diff checks confirmed no application source, package manifest, lockfile, Sanity, deployment, or production changes.

## Deviations

- The installer declared Node `>=22.18.0`, while the observed runtime is `22.14.0`. The installed context, hook administration, detector, doctor, syntax checks, and hook simulation all ran successfully; the runtime was not changed because runtime pinning is outside this task.
- The installed package downloaded an Impeccable skill whose metadata version is 4.1.3, newer than the pinned installer package version 3.6.1. The installed bundle was audited and tested as delivered.
- The hook administrator added its documented local exclusions to `.git/info/exclude`; equivalent entries were added to tracked `.gitignore` so collaborators receive the same protection.
- ESLint initially reported 164 warnings inside the vendored Impeccable scripts. `eslint.config.mjs` now excludes only `.agents/skills/impeccable/**`, restoring a clean application lint signal.
- `rtk pnpm exec tsc` could not resolve `tsc` on this Windows shell, so the same local compiler was run directly with `node_modules/typescript/bin/tsc`; it passed.

## Remaining work and risks

- Each developer must review and trust `.codex/hooks.json` through Codex `/hooks` or Settings before Codex will execute it automatically.
- The project runtime should be raised to a supported pinned Node version in the future application-scaffold task before Impeccable becomes a CI dependency.
- Impeccable's comp-first versus code-first default remains intentionally unset because the user has not selected one; the first applicable new-surface workflow should ask once and record the answer.
- The unchanged starter's Arial detector warning will remain until an approved UI/scaffold task replaces the starter styling.
