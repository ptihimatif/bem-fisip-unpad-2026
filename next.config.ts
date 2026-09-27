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
    if (process.env.NODE_ENV === "production") {
      baseHeaders.push({
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' https://www.instagram.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.sanity.io https://www.instagram.com; connect-src 'self' https://*.sanity.io; font-src 'self';",
          },
        ],
      });
    }

    return baseHeaders;
  },
};

export default nextConfig;
