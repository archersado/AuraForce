/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/auraforce',
  assetPrefix: '/auraforce',
  output: 'standalone',
  experimental: {
    esmExternals: true,
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig
