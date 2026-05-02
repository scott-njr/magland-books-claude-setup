import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Square Web Payments SDK is loaded from these CDN origins.
// Sandbox uses sandbox.web.squarecdn.com; production uses web.squarecdn.com.
const SQUARE_SCRIPT_HOSTS = "https://sandbox.web.squarecdn.com https://web.squarecdn.com";
const SQUARE_FRAME_HOSTS = "https://sandbox.web.squarecdn.com https://web.squarecdn.com https://connect.squareupsandbox.com https://connect.squareup.com";
const SQUARE_API_HOSTS = "https://connect.squareupsandbox.com https://connect.squareup.com https://pci-connect.squareupsandbox.com https://pci-connect.squareup.com";

const scriptSrc = isDev
  ? `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${SQUARE_SCRIPT_HOSTS}`
  : `script-src 'self' 'unsafe-inline' ${SQUARE_SCRIPT_HOSTS}`;

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(), microphone=(), camera=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              scriptSrc,
              // 'unsafe-inline' on style-src is required by the Square Web Payments iframe styling.
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              `connect-src 'self' ${SQUARE_API_HOSTS}`,
              `frame-src 'self' ${SQUARE_FRAME_HOSTS}`,
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
