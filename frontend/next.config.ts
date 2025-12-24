import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['msw'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'books.google.com',
        port: '',
        pathname: '/books/content/**',
      },
    ],
  },
};

export default nextConfig;
