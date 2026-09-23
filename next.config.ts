import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    //dont forget to remove this when its ready for production
    dangerouslyAllowLocalIP: true,
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
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
// Add CSP header for production security
if (process.env.NODE_ENV === "production") {
  const originalHeaders = nextConfig.headers;
  // Monkey‑patch headers to inject CSP
  nextConfig.headers = async () => {
    const base = (await (originalHeaders ? originalHeaders() : [])) as Awaited<
      ReturnType<NonNullable<typeof nextConfig.headers>>
    >;
    return [
      ...base,
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' https://www.instagram.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io https://www.instagram.com; connect-src 'self' https://*.sanity.io; font-src 'self';",
          },
        ],
      },
    ];
  };
}
