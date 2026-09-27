// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from "next-sanity/live";
import { client } from './client'
import { isSanityConfigured } from '../env'
import { CONTENT_CACHE_TAG } from './cache'

const live = defineLive({
  client,
  // Public routes must never resolve drafts or depend on an accidentally
  // exposed preview token. Preview can be added explicitly in a later task.
  serverToken: false,
  browserToken: false,
  strict: true,
});

export const SanityLive = live.SanityLive

// CI and isolated tests intentionally run without a Sanity project. Return
// empty published data there so Next can collect pages without network access.
export const sanityFetch: typeof live.sanityFetch = async (options) => {
  if (!isSanityConfigured) {
    return { data: null } as Awaited<ReturnType<typeof live.sanityFetch>>
  }

  return live.sanityFetch({
    ...options,
    tags: [...(options.tags ?? []), CONTENT_CACHE_TAG],
  })
}
