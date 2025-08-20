import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
