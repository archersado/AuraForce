/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/auraforce', // Commented out for local development
  assetPrefix: '/auraforce', // Commented out for local development
  output: 'standalone',
  experimental: {
    esmExternals: true,
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig
