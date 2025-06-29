import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration
  images: {
    domains: [
      // Add domains for external images if needed
      'example.com',
      'images.unsplash.com',
      'via.placeholder.com',
    ],
    // Image optimization settings
    formats: ['image/avif', 'image/webp'],
    // Disable image optimization in development for faster builds
    unoptimized: process.env.NODE_ENV === 'development',
  },

  // Enable static exports if needed
  // output: 'export',

  // SASS configuration is automatically handled by Next.js when the sass package is installed

  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Configure headers for security
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configure redirects if needed
  redirects: async () => {
    return [];
  },

  // Configure rewrites if needed
  rewrites: async () => {
    return [];
  },

  // SWC minification is enabled by default in Next.js 15

  // Configure webpack if needed
  webpack: (config, { isServer }) => {
    // Custom webpack configuration
    return config;
  },

  // Configure environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com',
  },

  // Configure the build directory
  distDir: 'build',

  // Configure the base path if the app is not hosted at the root
  // basePath: '',

  // Configure the trailing slash behavior
  trailingSlash: false,

  // Configure the powered by header
  poweredByHeader: false,

  // Configure the compression
  compress: true,

  // Configure the asset prefix for CDN support
  // assetPrefix: '',

  // Configure the pageExtensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],

  // Configure the experimental features
  experimental: {
    // Server Components and App Router are enabled by default in Next.js 15
  },
};

export default nextConfig;
