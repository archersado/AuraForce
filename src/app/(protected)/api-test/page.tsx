/**
 * API Fetch 测试页
 * 使用 apiFetch 方法测试所有 Sprint 1 接口
 */

'use client'

import { apiFetch, apiGet, apiPost, buildApiUrl } from '@/lib/api-client'
import { useState } from 'react'

export default function ApiTestPage() {
  const [results, setResults] = useState<Array<{
    test: string
    status: 'loading' | 'success' | 'error'
    message: string
    details?: string
  }>>([])

  const addResult = (test: string, status: any, message: string, details?: string) => {
    setResults(prev => [...prev, { test, status, message, details }])
  }

  const runTests = async () => {
    setResults([])
    addResult('开始测试', 'loading', '正在测试所有接口...')

    try {
      // 测试 1: Auth Session
      addResult('Test 1: GET /api/auth/session', 'loading', '正在测试...')
      try {
        const response = await apiFetch('/api/auth/session')
        addResult('Test 1: GET /api/auth/session', 'success', `Status: ${response.status}`)
      } catch (error) {
        addResult('Test 1: GET /api/auth/session', 'error', `错误: ${(error as Error).message}`)
      }

      // 测试 2: Files List
      addResult('Test 2: GET /api/files/list', 'loading', '正在测试...')
      try {
        const response = await apiFetch('/api/files/list?path=/')
        const data = await response.json()
        addResult('Test 2: GET /api/files/list', 'success', `Status: ${response.status}`, JSON.stringify(data).substring(0, 100))
      } catch (error) {
        addResult('Test 2: GET /api/files/list', 'error', `错误: ${(error as Error).message}`)
      }

      // 测试 3: Files Read
      addResult('Test 3: GET /api/files/read', 'loading', '正在测试...')
      try {
        const response = await apiFetch('/api/files/read?path=/')
        const data = await response.json()
        addResult('Test 3: GET /api/files/read', 'success', `Status: ${response.status}`, JSON.stringify(data).substring(0, 100))
      } catch (error) {
        addResult('Test 3: GET /api/files/read', 'error', `错误: ${(error as Error).message}`)
      }

      // 测试 4: Workspace Upload (HEAD request)
      addResult('Test 4: HEAD /api/workspace/upload', 'loading', '正在测试...')
      try {
        const url = buildApiUrl('/api/workspace/upload')
        const response = await fetch(url, { method: 'HEAD', credentials: 'include' })
        addResult('Test 4: HEAD /api/workspace/upload', 'success', `Status: ${response.status}`)
      } catch (error) {
        addResult('Test 4: HEAD /api/workspace/upload', 'error', `错误: ${(error as Error).message}`)
      }

      // 测试 5: Claude Stream (HEAD request)
      addResult('Test 5: HEAD /api/claude/stream', 'loading', '正在测试...')
      try {
        const url = buildApiUrl('/api/claude/stream')
        const response = await fetch(url, { method: 'HEAD', credentials: 'include' })
        addResult('Test 5: HEAD /api/claude/stream', 'success', `Status: ${response.status}`)
      } catch (error) {
        addResult('Test 5: HEAD /api/claude/stream', 'error', `错误: ${(error as Error).message}`)
      }

      // 测试 6: Files Mkdir
      addResult('Test 6: POST /api/files/mkdir', 'loading', '正在测试...')
      try {
        const response = await apiFetch('/api/files/mkdir', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/tmp-test-folder-' + Date.now() }),
        })
        const data = await response.json()
        addResult('Test 6: POST /api/files/mkdir', 'success', `Status: ${response.status}`, JSON.stringify(data).substring(0, 100))
      } catch (error) {
        addResult('Test 6: POST /api/files/mkdir', 'error', `错误: ${(error as Error).message}`)
      }

      // 测试 7: Files Rename (with empty name, should fail validation)
      addResult('Test 7: POST /api/files/rename', 'loading', '正在测试...')
      try {
        const response = await apiFetch('/api/files/rename', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ oldPath: '/', newPath: '' }), // Invalid data
        })
        const data = await response.json()
        addResult('Test 7: POST /api/files/rename', 'warning', `Status: ${response.status} (expected validation error)`, JSON.stringify(data).substring(0, 100))
      } catch (error) {
        addResult('Test 7: POST /api/files/rename', 'warning', `验证错误（预期）: ${(error as Error).message}`)
      }

      addResult('测试完成', 'loading', '所有接口测试完成。')
    } catch (error) {
      addResult('测试失败', 'error', `严重错误: ${(error as Error).message}`)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Sprint 1 API 测试 (使用 apiFetch)</h1>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">测试说明：</p>
        <ul className="list-disc list-inside text-gray-600 mb-4">
          <li>使用 <code className="bg-gray-100 px-2 py-1 rounded">apiFetch</code> 方法测试所有接口</li>
          <li>自动包含 basePath 前缀 (NEXT_PUBLIC_API_PREFIX)</li>
          <li>包含凭证 (credentials: include)</li>
          <li>自动处理 401 重定向</li>
        </ul>
        <button
          onClick={runTests}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          开始测试
        </button>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold mb-4">测试结果</h2>
        {results.length === 0 && (
          <p className="text-gray-500">点击"开始测试"按钮运行测试</p>
        )}
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded border ${
              result.status === 'success'
                ? 'bg-green-50 border-green-200'
                : result.status === 'error'
                ? 'bg-red-50 border-red-200'
                : result.status === 'warning'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{result.test}</span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  result.status === 'success'
                    ? 'bg-green-200 text-green-800'
                    : result.status === 'error'
                    ? 'bg-red-200 text-red-800'
                    : result.status === 'warning'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-blue-200 text-blue-800'
                }`}
              >
                {result.status.toUpperCase()}
              </span>
            </div>
            <p className="mt-2 text-sm">{result.message}</p>
            {result.details && (
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {result.details}
              </pre>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">配置信息：</h3>
        <p>basePath: /auraforce</p>
        <p>NEXT_PUBLIC_API_PREFIX: /auraforce</p>
        <p>buildApiUrl('/api/test') = {buildApiUrl('/api/test')}</p>
      </div>
    </div>
  )
}
