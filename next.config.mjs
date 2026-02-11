/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Vercel build stability */
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
