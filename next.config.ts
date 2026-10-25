import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    const baseHeaders = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];

    // Add CSP header for production security
    // Next.js inlines its bootstrap scripts, so without nonces script-src needs 'unsafe-inline' (Next CSP guide).
    if (process.env.NODE_ENV === "production") {
      baseHeaders.push({
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.instagram.com https://core.sanity-cdn.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io https://www.instagram.com; font-src 'self' https://design-system-static.sanity.io; connect-src 'self' https://*.sanity.io wss://*.api.sanity.io; frame-src 'self' https://www.youtube.com https://www.instagram.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';",
          },
        ],
      });
    }

    return baseHeaders;
  },
};

export default nextConfig;
