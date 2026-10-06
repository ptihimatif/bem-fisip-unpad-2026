# Sanity content freshness

The public site uses `defineLive` for published 2026 content. Connected visitors receive live updates. Each `sanityFetch` also carries the shared `sanity-content` cache tag so a signed webhook can invalidate cached data when a publish happens without a connected visitor. The sitemap fetches the published Content Lake directly on each request.

## Production setup for the deployment owner

1. Set the public `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, and canonical `NEXT_PUBLIC_SITE_URL` for the deployment. Use the approved 2026 content source; do not change the dataset as part of this setup.
2. Generate a strong random value and set it as the **server-only** `SANITY_REVALIDATE_SECRET` in the deployment environment. Do not use a `NEXT_PUBLIC_` prefix or commit the value.
3. In the Sanity project dashboard, configure a signed webhook to `https://<deployed-site>/api/revalidate` using the same secret. Use POST, create/update/delete events, and the GROQ projection `{_type}`. Limit events to published content where the dashboard supports that filter.
4. Publish an approved 2026 document and verify that the webhook delivery succeeds, the affected page updates, and `/sitemap.xml` includes the correct published routes. Review the hosting logs if delivery fails. A missing secret returns HTTP 503; an invalid signature returns HTTP 401.

The repository change does not configure Sanity or the hosting platform. The deployment owner must authorize and complete those external steps and keep a rollback path for the webhook and secret.

## If content looks old locally

1. Confirm that the document is **published** and has `term: "2026"`; drafts and other terms are intentionally excluded.
2. Compare the local public project/dataset values with the intended Sanity project and dataset. Never print or share secret values.
3. Check the published Content Lake response. If it is current but only localhost is stale, restart `next dev`. If its generated cache remains stale, stop the server and clear only the local `.next` build directory before restarting.
4. In production, check the webhook delivery and deployment secret before changing application code. Sanity's CDN and Next.js cache are separate layers.
