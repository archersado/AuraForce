'use client';

import { useState } from 'react';
import { Download, FileText, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useSession';

type ExportFormat = 'json' | 'csv';

export default function DataExportForm() {
  const { user } = useRequireAuth();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('json');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formats = [
    {
      id: 'json' as ExportFormat,
      name: 'JSON 格式',
      description: '完整的账户数据，适合备份和数据迁移',
      icon: Database,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      id: 'csv' as ExportFormat,
      name: 'CSV 格式',
      description: '表格格式，适合分析和电子表格导入',
      icon: FileText,
      color: 'bg-green-50 text-green-600 border-green-200',
    },
  ];

  const handleExport = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(`/api/user/export?format=${selectedFormat}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || '导出失败');
        setLoading(false);
        return;
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'auraforce-export.json';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="([^"]+)"/);
        if (match) {
          filename = match[1];
        }
      }

      // Download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setError('导出失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">导出我的数据</h3>
        <p className="text-sm text-gray-600">
          下载您的账户数据，包括个人资料、技能和对话记录
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mr-2 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
          <p className="text-sm text-green-800">数据导出成功！</p>
        </div>
      )}

      {/* Format Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          选择导出格式
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format) => {
            const Icon = format.icon;
            const isSelected = selectedFormat === format.id;

            return (
              <button
                key={format.id}
                type="button"
                onClick={() => {
                  setSelectedFormat(format.id);
                  setError('');
                }}
                className={`relative flex items-start p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? `${format.color} border-current`
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                disabled={loading}
              >
                <div
                  className={`p-2 rounded-lg mb-3 ${
                    isSelected
                      ? 'bg-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-current' : 'text-gray-600'}`} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{format.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{format.description}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Database className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">包含的数据</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 个人资料信息</li>
              <li>• 您创建的所有技能</li>
              <li>• Claude Code 对话记录</li>
              <li>• 账户设置</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2" />
          重要提示
        </h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 导出的数据包含您的个人信息，请妥善保管</li>
          <li>• 每小时最多导出 3 次</li>
          <li>• 密码和令牌不会包含在导出数据中</li>
        </ul>
      </div>

      {/* Export Button */}
      <button
        type="button"
        onClick={handleExport}
        disabled={loading}
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02]"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            正在导出...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            导出数据
          </>
        )}
      </button>
    </div>
  );
}
