import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Using default .next output directory.
   * The build artifacts will be copied to /dist/website by a post-build script.
   * 
   * For full functionality (OAuth, SSR, API routes), deploy to:
   * - Vercel (recommended)
   * - Node.js server
   * - Docker container
   */

  /**
   * Generate trailing slashes for cleaner URLs.
   */
  trailingSlash: true,

  /**
   * Image optimization settings.
   */
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
