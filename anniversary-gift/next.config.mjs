/** @type {import('next').NextConfig} */
const nextConfig = {
  // Essential configuration
  reactStrictMode: true,
  swcMinify: true,
  
  // Your existing configurations
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // Optional: Add this if you're having issues with Vercel detecting the correct output
  distDir: '.next',
  
  // Optional: Explicitly set the target (not usually needed with newer Next.js)
  // target: 'server',
}

export default nextConfig;