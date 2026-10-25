type Environment = Record<string, string | undefined>;

/** Explicit fixtures are allowed locally/inside test CI, never on a hosting build. */
export function isIsolatedTestMode(env: Environment = process.env) {
  const enabled = env.SANITY_TEST_MODE === "true";
  if (enabled && (env.VERCEL || env.NETLIFY)) {
    throw new Error("SANITY_TEST_MODE must not be enabled on a deployed hosting environment");
  }
  return enabled;
}

export function resolveSiteConfig(env: Environment = process.env) {
  const testMode = isIsolatedTestMode(env) || env.NODE_ENV === "test";
  if (env.NODE_ENV === "production" && !testMode && !env.NEXT_PUBLIC_SITE_ENV?.trim()) {
    throw new Error("NEXT_PUBLIC_SITE_ENV is required for release builds");
  }
  const environment = env.NEXT_PUBLIC_SITE_ENV?.trim() ||
    (env.NODE_ENV === "production" ? (testMode ? "staging" : "production") : "development");
  if (!["development", "staging", "production"].includes(environment)) {
    throw new Error("NEXT_PUBLIC_SITE_ENV must be development, staging, or production");
  }
  if (environment === "development" && (env.VERCEL || env.NETLIFY)) {
    throw new Error("Hosting builds must explicitly use staging or production");
  }
  const rawUrl = env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (environment === "development" || testMode ? "http://localhost:3000" : undefined);
  if (!rawUrl) throw new Error("NEXT_PUBLIC_SITE_URL is required for staging and production");
  let url: URL;
  try { url = new URL(rawUrl); } catch { throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL"); }
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only an origin, without credentials, path, query, or fragment");
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (testMode && !local) throw new Error("Isolated fixture checks must use a loopback site origin");
  if (url.protocol !== "https:" && !(url.protocol === "http:" && local && (environment === "development" || testMode))) {
    throw new Error("Staging and production require an HTTPS site origin");
  }
  if (environment === "production" && local) throw new Error("Production must use a public HTTPS origin");
  return { origin: url.origin, environment, indexable: environment === "production" && !testMode };
}
