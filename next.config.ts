import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    'localhost:3000',
    '127.0.0.1:3000',
    'localhost:3001',
    '127.0.0.1:3001',
  ],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://*.clarity.ms",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://www.clarity.ms https://*.clarity.ms https://*.google-analytics.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "media-src 'self' blob: https://res.cloudinary.com",
              "connect-src 'self' https://*.onrender.com http://localhost:3001 http://127.0.0.1:3001 https://www.google-analytics.com https://*.google-analytics.com https://analytics.google.com https://www.clarity.ms https://*.clarity.ms https://res.cloudinary.com",
              "frame-ancestors 'self'",
              "form-action 'self'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
