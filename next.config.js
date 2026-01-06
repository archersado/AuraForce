/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript strict mode is enforced - errors will fail builds
  // This ensures type safety across the entire AuraForce project
  // Note: Typescript checking is handled by tsc, `ignoreBuildErrors` is NOT set
  experimental: {
    esmExternals: true,
  },
}

module.exports = nextConfig