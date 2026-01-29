/**
 * API Client
 *
 * 统一的 API 请求客户端，自动为所有请求添加前缀。
 * 使用环境变量 NEXT_PUBLIC_API_PREFIX 配置 API 前缀。
 */

/**
 * 获取 API 前缀
 * 默认为空，通过 NEXT_PUBLIC_API_PREFIX 环境变量配置
 */
const API_PREFIX = process.env.NEXT_PUBLIC_API_PREFIX || '/auraforce'

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
 * 获取请求选项的辅助函数
 * 注意：不设置默认 Content-Type，让 fetch 自动处理（如 FormData 会自动设置 multipart/form-data）
 */
export function getRequestOptions(options?: RequestInit): RequestInit {
  // 如果 options 中已经有 headers，直接使用
  // 不要设置默认的 Content-Type，因为 FormData 等需要浏览器自动设置
  return options || {}
}

/**
 * 封装的 fetch 函数，自动使用 API 前缀
 *
 * @param path - API 路径，如 '/api/auth/signin'
 * @param options - fetch 选项
 * @returns fetch Response
 */
export async function apiFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = buildApiUrl(path)

  // 如果已经在开发环境且需要使用相对路径（避免代理问题），可以直接处理
  // 但由于你已经配置了反向代理，这里统一使用前缀

  return fetch(url, getRequestOptions(options))
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
