import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Development configuration
  experimental: {
    // Add other experimental features here if needed
  },
  
  // Allow cross-origin requests from network IP
  allowedDevOrigins: ['192.168.1.36'],
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/v1/api/images/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4000',
        pathname: '/v1/api/images/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.36',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.36',
        port: '4000',
        pathname: '/v1/api/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1/api',
  },
  
  // Add headers for CORS in development
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;