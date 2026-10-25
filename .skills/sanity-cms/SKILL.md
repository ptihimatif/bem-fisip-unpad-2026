---
name: sanity-cms
description: Design, implement, migrate, or review Sanity CMS work for BEM FISIP Unpad 2026. Use for schemas, datasets, content contracts, GROQ, image handling, previews, webhooks, or revalidation.
---

# Sanity CMS

Build an editor-friendly, typed content layer while protecting the recoverable 2025 archive.

## Required context

Read Sections 6, 10, 14, 16, and 19 of docs/AGENTIC_DEVELOPMENT_BRIEF_2026.md, the approved task, and applicable decision records. The historical preparation/handover document is absent; use docs/panduan/ for current 2026 operations and obtain the original only when inherited-system mapping requires it.

## Non-negotiable safety

- Never mix 2026 records into the inherited unfiltered 2025 dataset.
- Do not create or change projects, datasets, members, roles, tokens, CORS, webhooks, deployments, or production content without explicit authority for that exact external change.
- Verify a recoverable 2025 export before any approved migration or schema operation that could affect old content.
- Never place a secret in Git or a browser-visible environment variable.
- Studio-prefixed and NEXT_PUBLIC_ variables are not secret storage.

## Content model

- Use term/year 2026 even when dataset isolation also exists.
- Use deterministic singleton IDs.
- Use stable unique slugs and explicit ordering.
- Use one source of truth for publication category.
- Model relationships with references rather than duplicated display names.
- Define required and optional fields, publishing validation, image alt text, URL validation, and representative previews.
- Keep schemas and migrations versioned with the owned Studio source.

## Application data

1. Centralize Sanity clients, parameterized GROQ, result types, and image helpers.
2. Fetch public content on the server by default.
3. Give every query an explicit cache and revalidation policy.
4. Select only fields needed by the view; do not fetch Portable Text bodies for cards.
5. Use paginated queries for growing archives.
6. Validate external URLs and embed origins before rendering.
7. Define loading, empty, partial, error, missing-image, draft, and not-found behavior.
8. Test mappings with fixtures independently of live production content.

Stop and request direction when dataset ownership, schema source, backup evidence, plan limits, or production authority is unresolved for the requested action. Safe fixture-based local work may continue when it does not depend on that decision.
