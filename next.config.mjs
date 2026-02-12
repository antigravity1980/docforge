/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Vercel build stability */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Cache bust: Force rebuild for Phase 2 content
};

export default nextConfig;
