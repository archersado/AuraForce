/**
 * API Client
 *
 * 统一的 API 请求客户端，自动为所有请求添加前缀。
 * 使用环境变量 NEXT_PUBLIC_API_PREFIX 配置 API 前缀。
 *
 * 所有请求都会自动处理 401 响应，重定向到登录页。
 */

/**
 * 获取 API 前缀
 * 默认为空，通过 NEXT_PUBLIC_API_PREFIX 环境变量配置
 * 服务器部署时设置 .env 中 NEXT_PUBLIC_API_PREFIX=/auraforce
 * 本地开发时不需要设置，直接使用相对路径
 */
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || ''

/**
 * 构建 API URL
 * 自动添加 API 前缀
 *
 * @param path - API 路径，如 '/api/auth/signin'
 * @returns 完整的 API URL
 */
export function buildApiUrl(path: string): string {
  // 移除路径开头的斜杠，避免重复
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return `${API_PREFIX}/${normalizedPath}`
}

/**
 * 处理 401 未授权响应，重定向到登录页
 *
 * @param currentPath - 当前页面路径（用于登录后重定向回来）
 */
function handleUnauthorized(currentPath?: string): never {
  // 获取当前页面路径或使用 API 前缀作为默认
  const redirectPath = currentPath || '/'

  // 构建登录 URL，带重定向参数
  const loginPath = API_PREFIX ? `${API_PREFIX}/login` : '/login'
  const loginUrl = new URL(loginPath, window.location.origin)
  loginUrl.searchParams.set('redirect', redirectPath)

  // 重定向到登录页
  window.location.href = loginUrl.toString()

  // 抛出错误以确保函数不会继续执行（TypeScript 需要这个）
  throw new Error('Redirecting to login page')
}

/**
 * 获取请求选项的辅助函数
 * 注意：不设置默认 Content-Type，让 fetch 自动处理（如 FormData 会自动设置 multipart/form-data）
 */
export function getRequestOptions(options?: RequestInit): RequestInit {
  // 如果 options 中已经有 headers，直接使用
  // 不要设置默认的 Content-Type，因为 FormData 等需要浏览器自动设置
  return options || {}
}

/**
 * 封装的 fetch 函数，自动使用 API 前缀并处理 401 重定向
 *
 * @param path - API 路径，如 '/api/auth/signin'
 * @param options - fetch 选项
 * @returns fetch Response
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = buildApiUrl(path)

  // 如果已经在开发环境且需要使用相对路径（避免代理问题），可以直接处理
  // 但由于你已经配置了反向代理，这里统一使用前缀

  const response = await fetch(url, getRequestOptions(options))

  // 处理 401 未授权响应
  if (response.status === 401) {
    // 获取当前页面路径用于登录后重定向
    const currentPath = window.location.pathname + window.location.search
    handleUnauthorized(currentPath)
  }

  return response
}

/**
 * GET 请求
 */
export async function apiGet(path: string, options?: RequestInit): Promise<Response> {
  return apiFetch(path, {
    ...options,
    method: 'GET',
  })
}

/**
 * POST 请求
 */
export async function apiPost(path: string, data?: unknown, options?: RequestInit): Promise<Response> {
  return apiFetch(path, {
    ...options,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * PUT 请求
 */
export async function apiPut(path: string, data?: unknown, options?: RequestInit): Promise<Response> {
  return apiFetch(path, {
    ...options,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * DELETE 请求
 */
export async function apiDelete(path: string, options?: RequestInit): Promise<Response> {
  return apiFetch(path, {
    ...options,
    method: 'DELETE',
  })
}

/**
 * PATCH 请求
 */
export async function apiPatch(path: string, data?: unknown, options?: RequestInit): Promise<Response> {
  return apiFetch(path, {
    ...options,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  })
}

/**
 * 导出前缀配置（用于 WebSocket 等场景）
 */
export { API_PREFIX }
