/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/auraforce',
  experimental: {
    esmExternals: true,
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig
