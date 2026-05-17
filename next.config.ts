import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // We handle type checking in CI, skip during build for speed
    // Remove this once all type issues are resolved
    ignoreBuildErrors: false,
  },
  eslint: {
    // Skip ESLint during build — run separately in CI
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
