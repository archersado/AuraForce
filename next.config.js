/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/auraforce', // Enable only for production nginx deployment
  assetPrefix: '/auraforce', // Enable only for production nginx deployment
  output: 'standalone',
  experimental: {
    esmExternals: true,
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  // PDF.js webpack configuration for react-pdf
  webpack: (config) => {
    // Ignore fs module for browser
    config.resolve.fallback = config.resolve.fallback || {};
    config.resolve.fallback.fs = false;
    config.resolve.fallback.net = false;
    config.resolve.fallback.tls = false;

    // Configure PDF.js worker
    config.resolve.alias = config.resolve.alias || {};
    config.resolve.alias.canvas = false;

    return config;
  },
}

module.exports = nextConfig
