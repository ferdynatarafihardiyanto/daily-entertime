/** @type {import('next').NextConfig} */
// Konfigurasi Next.js untuk produksi
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    scrollRestoration: true,
  },
  // Output configuration for static export if needed
  // output: 'export',
}

module.exports = nextConfig
