import type { NextConfig } from "next";

// Avoid custom distDir on Vercel — it expects `.next/` to exist during build
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // Use a custom build output directory locally to avoid OneDrive locking .next/trace on Windows
  // On Vercel, keep default `.next/` so the platform can find routes-manifest.json
  ...(isVercel ? {} : { distDir: "build" }),
  // Do not fail production builds on ESLint errors (generated code may trigger rules)
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Local server uses http by default
        hostname: '127.0.0.1', // Localhost address (or you can use 'localhost')
        port: '8000', // Default port for local Django server
        pathname: '/media/**', // Assuming Django serves media files from '/media/'
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
        search: '',
      },
    ],
  },
  
  /* config options here */
};

export default nextConfig;
