# Handoff: Backend / Sanity work

- Date: 2026-09-23
- From: frontend agent
- To: backend/Sanity colleague
- Branch: `home-page`
- Working-tree status: modified; no commits yet
- Unsafe to proceed: `dangerouslyAllowLocalIP` remains in `next.config.ts:6`

## Approved scope

- Frontend fixes completed and verified: lint, typecheck, build all pass
- Backend / CMS / config changes deferred pending explicit approval
- No production Sanity data, GitHub settings, or live CMS content modified

## Remaining / Pending (backend / Sanity)

### P0 - Critical

**S1 — `dangerouslyAllowLocalIP: true` in production config**

- File: `next.config.ts:6`
- Action: **Remove before deployment**
- Authority: explicit approval required (production SSRF mitigation)

**S4 — Dependency vulnerabilities (transitive)**

```
npm audit severity:
  HIGH: js-yaml (GHSA-52cp-r559-cp3m, GHSA-p4m-2wfm-xmqj)
        → @sanity/cli → @vercel/frameworks → js-yaml
  HIGH: adm-zip (GHSA-7q85-xj36-vmfc)
        → @sanity/cli, @sanity/workbench-cli → adm-zip
  MODERATE: smol-toml (GHSA-7w5x-hrqm-74c2)
        → @sanity/cli → smol-toml
```

Command: `pnpm why <package>` to trace all 12 paths
Recommendation: wait for Sanity CLI patch; `npm audit` shows these are dev/CLI tooling vulns, not runtime in web app

**Sanity deprecation warning**

Package `sanity@6.12.0` at `package.json:24` prints:
> "This version of Sanity Studio has a potential data-loss bug when working with Portable Text fields"

Action: upgrade to `sanity@>=6.14.1` when feasible

### P1 - Medium

**S7 — Sanity client has no read token**

File: `sanity/lib/client.ts:5`

```ts
export const client = createClient({
  projectId, dataset, apiVersion, useCdn: true
})
```

Analysis: Current public dataset via CDN is safe. If private/draft content is ever added, add server-only token:
```
SANITY_API_READ_TOKEN  # in .env.local, NOT NEXT_PUBLIC_
```
And create `sanity/lib/server.ts` for server-only queries. Decision: keep as-is until private data required.

**P3 — GROQ bounds use string interpolation, not params**

File: `sanity/lib/queries.ts:59–77`

Current:
```ts
export function publicationPageQuery(start: number, end: number) {
  return defineQuery(`...[${start}...${end}]{...}`)
}
```

Issue: New query string each call → CDN cache miss.

Recommendation:
```ts
export const PUBLICATION_PAGE_QUERY = defineQuery(`
  *[_type=="post" && term==$term][${start}...${end}]{...}
`)
// usage: sanityFetch({ query: PUBLICATION_PAGE_QUERY, params: { term, start, end } })
```

**Article pagination source of truth divergence**

File: `app/article/page.tsx:36`

- `PUBLICATION_PAGE_QUERY` fetches `[0...12]`
- `PUBLICATION_COUNT_QUERY` counts all matching posts
- If total > 12, count/list diverge silently

Current behavior: filtered 12 items, frontend paginate to 5/page. Articles beyond rank 12 never reachable.

Two options:
1. Fetch all posts in query (no bounds) — acceptable for current ~few dozen articles
2. Real offset query (`$from` params) with sync count — scales but requires extra work

User approved: "fetch all aja gapapa". Frontend already filtered paginate all `rawPosts`. Ensure query bounds removed or increased before content grows.

### P2 - Low

**Q10 — Inline GROQ in sitemap**

File: `app/sitemap.ts:11–27`

```ts
*[_type == "post" && term == $term && defined(slug.current)]{...}
```

Recommendation: Move to `sanity/lib/queries.ts` as typed export for consistency with other queries.

**S6 — Verify `SANITY_REVALIDATE_SECRET` deployment**

- Added to `.env.example`
- Required for CMS webhook revalidation in production
- Verify Vercel/Netlify secret stores match

## Decisions made during frontend pass

- `styled-components` removed (unused, adds client bundle)
- `Navbar` render-phase state mutation **removed** (not moved to `useEffect` per React 19 rules)
- `bg-brand-gradient` extracted but only applied to article page (others use unique gradients)
- OG/Twitter metadata uses `NEXT_PUBLIC_SITE_URL` env var; fallback `bemfisipunpad.com` present

## Known failures or risks

1. **S1 intentionally unresolved** — awaiting production deployment approval
2. **pnpm audit high vulnerabilities** persist; transitives through Sanity CLI, not exploitable at runtime; still flagged by security tooling
3. **No credentials in this document**
4. `.agents/handoffs/to-do-backend.md` untracked; Git will prompt on checkout
5. Sanity preview/draft mode: if enabled, ensure `SANITY_API_READ_TOKEN` exists and **never** bundled client-side

## Safest next action

1. Review and commit/merge frontend changes
2. Get explicit approval to remove `dangerouslyAllowLocalIP: true` (or document risk acceptance)
3. Run `pnpm why <package>` for detailed attack path analysis if strict security posture required
4. Verify `.env.local` is gitignored (run `git log --all -- .env.local`)
5. When ready for production: set `NEXT_PUBLIC_SITE_URL` in deployment env, configure `SANITY_REVALIDATE_SECRET`
6. Schedule Sanity CLI upgrade plan for data-loss bug fix

## Files to review

```
next.config.ts           # CSP + dangerouslyAllowLocalIP
sanity/lib/client.ts     # no token (confirm public dataset OK)
sanity/lib/queries.ts    # consider $start/$end params for caching
app/sitemap.ts           # inline GROQ can move to queries.ts
package.json             # sanity@>=6.14.1 upgrade target
.env.example             # contains public URL + revalidation secret placeholder
```