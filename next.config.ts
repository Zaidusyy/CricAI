import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'me7aitdbxq.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: 'www.mumbaiindians.com',
      },
      {
        protocol: 'https',
        hostname: 'img.ipl.com',
      }
    ],
  },
};

export default nextConfig;
