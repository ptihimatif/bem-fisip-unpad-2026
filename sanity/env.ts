import { isIsolatedTestMode } from '../lib/site-config'

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-04'

export const isSanityTestMode = isIsolatedTestMode()
const allowBuildFallback = isSanityTestMode || process.env.NODE_ENV === 'test'

export const isSanityConfigured = !isSanityTestMode && Boolean(
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
)

export const dataset = isSanityConfigured
  ? process.env.NEXT_PUBLIC_SANITY_DATASET!
  : allowBuildFallback
    ? 'ci-placeholder'
    : assertValue(undefined, 'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET')

export const projectId = isSanityConfigured
  ? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
  : allowBuildFallback
    ? 'ci-placeholder'
    : assertValue(undefined, 'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID')

function assertValue(v: string | undefined, errorMessage: string): string {
  if (!v || v.trim().length === 0) {
    throw new Error(errorMessage)
  }

  return v
}
