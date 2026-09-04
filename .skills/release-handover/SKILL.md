---
name: release-handover
description: Prepare or execute an authorized preview, production release, rollback, or operational handover for BEM FISIP Unpad 2026. Use when deployment state, production content, backups, domains, or long-term ownership is in scope.
---

# Release and handover

Release only a verified, recoverable system with named authority and ownership.

## Authorization gate

An approved code task does not authorize deployment or client-owned changes. Before any mutation, confirm explicit scope and authority for each affected item:

- Vercel project or environment variables.
- Sanity dataset, content, CORS, token, webhook, or Studio deployment.
- GitHub repository or protection settings.
- Domain, DNS, analytics, or Search Console.

Do not proceed with a production mutation when the owner, backup, rollback, target, or approval is ambiguous.

## Preflight

1. Read the approved release task, .agents/CURRENT_STATE.md, .agents/QUALITY_GATES.md, and applicable decision records.
2. Confirm the intended commit/tag, environment, domain, dataset, and deployment target.
3. Confirm required automated and manual checks passed or have an explicit accepted exception.
4. Verify 2025 preservation and current CMS/application backups.
5. Record the rollback trigger, procedure, operator, and recovery owner.
6. Confirm at least two recoverable institutional administrators where required.

## Release

- Prefer an approved preview before production.
- Apply only the authorized changes and avoid printing secret values.
- Verify routes, metadata, redirects, 404/error behavior, official links, HTTPS, sitemap, robots, social previews, and Sanity publish-to-site revalidation.
- Monitor visible errors and content behavior immediately after release.
- Roll back when a defined stop condition is met; do not improvise destructive recovery.

## Handover

Record the deployed version, services and owners, environment contract without values, backup locations, rollback steps, known risks, maintenance cadence, and next owner. Update the task, CURRENT_STATE.md, release documentation, and tag only within approved scope.
