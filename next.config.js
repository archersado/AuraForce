/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript strict mode is enforced - errors will fail builds
  // This ensures type safety across the entire AuraForce project
  // Note: Typescript checking is handled by tsc, `ignoreBuildErrors` is NOT set
  // 关键配置: 部署到 /auraforce 子路径,避免与其他 Next.js 项目冲突
  basePath: '/auraforce',
  // 静态资源前缀,确保所有资源路径包含 /auraforce
  assetPrefix: '/auraforce',
  experimental: {
    esmExternals: true,
    // Increase body size limit for file uploads (default is 10MB)
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig