/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript strict mode is enforced - errors will fail builds
  // This ensures type safety across the entire AuraForce project
  // Note: Typescript checking is handled by tsc, `ignoreBuildErrors` is NOT set
  // 关键配置：部署到 /auraforce 子路径，避免与其他 Next.js 项目冲突
  // 注释掉 basePath 以在宿主机上正常访问
  basePath: '/auraforce',
  // assetPrefix: '/auraforce',
  experimental: {
    esmExternals: true,
    // Increase body size limit for file uploads (default is 10MB)
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
}

module.exports = nextConfig
