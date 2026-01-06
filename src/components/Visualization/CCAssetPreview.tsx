/**
 * CC资产预览组件
 *
 * 功能：展示生成的Claude Code扩展资产，支持代码预览和下载
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Code, Bot, Cog, Download, Eye, Copy,
  Check, ExternalLink, Play, Folder, ChevronRight,
  ChevronDown
} from 'lucide-react';

interface CCAsset {
  id: string;
  name: string;
  type: 'workflow' | 'subagent' | 'skill' | 'script';
  description: string;
  content: string;
  metadata: {
    usage: {
      command?: string;
      examples: string[];
    };
  };
}

interface CCAssetPreviewProps {
  assets: CCAsset[];
}

/**
 * CC资产预览主组件
 */
export default function CCAssetPreview({ assets }: CCAssetPreviewProps) {
  const [selectedAsset, setSelectedAsset] = useState<CCAsset | null>(null);
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set(['workflow']));

  // 按类型分组资产
  const assetsByType = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) acc[asset.type] = [];
    acc[asset.type].push(asset);
    return acc;
  }, {} as Record<string, CCAsset[]>);

  // 资产类型配置
  const typeConfig = {
    workflow: {
      name: 'Workflows',
      icon: FileText,
      color: 'purple',
      description: '自动化工作流程'
    },
    subagent: {
      name: 'Subagents',
      icon: Bot,
      color: 'blue',
      description: '智能决策助手'
    },
    skill: {
      name: 'Skills',
      icon: Code,
      color: 'green',
      description: '技能模块'
    },
    script: {
      name: 'Scripts',
      icon: Cog,
      color: 'orange',
      description: '自动化脚本'
    }
  };

  const toggleTypeExpansion = (type: string) => {
    const newExpanded = new Set(expandedTypes);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedTypes(newExpanded);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 资产列表 */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Folder className="w-5 h-5 mr-2 text-purple-600" />
          生成的资产包 ({assets.length})
        </h3>

        <div className="space-y-2">
          {Object.entries(typeConfig).map(([type, config]) => {
            const typeAssets = assetsByType[type] || [];
            if (typeAssets.length === 0) return null;

            const IconComponent = config.icon;
            const isExpanded = expandedTypes.has(type);

            return (
              <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* 类型标题 */}
                <button
                  onClick={() => toggleTypeExpansion(type)}
                  className={`
                    w-full px-4 py-3 flex items-center justify-between
                    bg-${config.color}-50 hover:bg-${config.color}-100 transition-colors
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-5 h-5 text-${config.color}-600`} />
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{config.name}</div>
                      <div className="text-sm text-gray-600">{typeAssets.length} 个文件</div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {/* 资产列表 */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200"
                    >
                      {typeAssets.map((asset) => (
                        <AssetListItem
                          key={asset.id}
                          asset={asset}
                          isSelected={selectedAsset?.id === asset.id}
                          onSelect={() => setSelectedAsset(asset)}
                          config={config}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* 整体下载按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
        >
          <Download className="w-5 h-5" />
          <span>下载完整资产包</span>
        </motion.button>
      </div>

      {/* 资产详情预览 */}
      <div className="lg:col-span-2">
        {selectedAsset ? (
          <AssetDetailView asset={selectedAsset} />
        ) : (
          <EmptyPreview totalAssets={assets.length} />
        )}
      </div>
    </div>
  );
}

/**
 * 资产列表项组件
 */
function AssetListItem({
  asset,
  isSelected,
  onSelect,
  config
}: {
  asset: CCAsset;
  isSelected: boolean;
  onSelect: () => void;
  config: any;
}) {
  const IconComponent = config.icon;

  return (
    <motion.button
      onClick={onSelect}
      className={`
        w-full px-4 py-3 flex items-center space-x-3 text-left transition-colors
        ${isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : 'hover:bg-gray-50'}
      `}
      whileHover={{ x: 4 }}
    >
      <IconComponent className={`w-4 h-4 text-${config.color}-600 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{asset.name}</div>
        <div className="text-sm text-gray-600 truncate">{asset.description}</div>
      </div>
      <Eye className="w-4 h-4 text-gray-400" />
    </motion.button>
  );
}

/**
 * 资产详情视图组件
 */
function AssetDetailView({ asset }: { asset: CCAsset }) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'usage'>('preview');
  const [copiedContent, setCopiedContent] = useState(false);

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const tabs = [
    { id: 'preview', name: '预览', icon: Eye },
    { id: 'code', name: '代码', icon: Code },
    { id: 'usage', name: '使用方法', icon: Play }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full">
      {/* 头部 */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
            <p className="text-sm text-gray-600">{asset.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(asset.content)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
              title="复制代码"
            >
              {copiedContent ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 标签页 */}
        <div className="mt-4 flex space-x-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors
                  ${activeTab === tab.id
                    ? 'bg-white text-purple-700 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容区域 */}
      <div className="p-6 h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AssetPreviewContent asset={asset} />
            </motion.div>
          )}

          {activeTab === 'code' && (
            <motion.div
              key="code"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <pre className="text-sm text-gray-800 bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <code>{asset.content}</code>
              </pre>
            </motion.div>
          )}

          {activeTab === 'usage' && (
            <motion.div
              key="usage"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AssetUsageGuide asset={asset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * 资产预览内容组件
 */
function AssetPreviewContent({ asset }: { asset: CCAsset }) {
  const getPreviewContent = () => {
    switch (asset.type) {
      case 'workflow':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">🔄 工作流概述</h4>
              <p className="text-purple-800 text-sm">{asset.description}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">主要功能：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 自动化工作流程执行</li>
                <li>• 步骤间的智能衔接</li>
                <li>• 质量检查点设置</li>
                <li>• 可定制化的执行参数</li>
              </ul>
            </div>
          </div>
        );

      case 'subagent':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🤖 智能助手概述</h4>
              <p className="text-blue-800 text-sm">{asset.description}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">核心能力：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 专业决策支持</li>
                <li>• 智能问题分析</li>
                <li>• 情景化建议生成</li>
                <li>• 经验知识应用</li>
              </ul>
            </div>
          </div>
        );

      case 'skill':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">⚡ 技能模块概述</h4>
              <p className="text-green-800 text-sm">{asset.description}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">模块特性：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 可编程化的技能逻辑</li>
                <li>• 标准化的输入输出接口</li>
                <li>• 错误处理和重试机制</li>
                <li>• 性能监控和日志记录</li>
              </ul>
            </div>
          </div>
        );

      case 'script':
        return (
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">🔧 自动化脚本概述</h4>
              <p className="text-orange-800 text-sm">{asset.description}</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">脚本功能：</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 批量任务自动化执行</li>
                <li>• 系统集成和数据同步</li>
                <li>• 定时任务和监控</li>
                <li>• 报告生成和通知</li>
              </ul>
            </div>
          </div>
        );

      default:
        return <div>预览内容加载中...</div>;
    }
  };

  return getPreviewContent();
}

/**
 * 资产使用指南组件
 */
function AssetUsageGuide({ asset }: { asset: CCAsset }) {
  return (
    <div className="space-y-6">
      {/* 安装说明 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">📦 安装方法</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <pre className="text-sm text-gray-800">
            <code>{`# 下载并安装到Claude Code\nclaude-code install ${asset.name}\n\n# 或手动复制到扩展目录\ncp ${asset.name}.${asset.type === 'workflow' || asset.type === 'subagent' ? 'md' : 'js'} ~/.claude-code/extensions/`}</code>
          </pre>
        </div>
      </div>

      {/* 使用命令 */}
      {asset.metadata.usage.command && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">💻 使用命令</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <code className="text-sm text-blue-800">{asset.metadata.usage.command}</code>
          </div>
        </div>
      )}

      {/* 使用示例 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">🚀 使用示例</h4>
        <div className="space-y-3">
          {asset.metadata.usage.examples.map((example, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <code className="text-sm text-gray-800">{example}</code>
            </div>
          ))}
        </div>
      </div>

      {/* 注意事项 */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">⚠️ 注意事项</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 确保Claude Code版本为最新</li>
          <li>• 首次使用建议在测试环境验证</li>
          <li>• 根据实际情况调整配置参数</li>
          <li>• 如遇问题请查看详细日志</li>
        </ul>
      </div>
    </div>
  );
}

/**
 * 空预览状态组件
 */
function EmptyPreview({ totalAssets }: { totalAssets: number }) {
  return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          选择资产查看详情
        </h3>
        <p className="text-gray-600 max-w-sm mx-auto">
          从左侧列表选择任意一个生成的资产，查看代码预览和使用方法
        </p>
        <div className="mt-4 text-sm text-gray-500">
          共 {totalAssets} 个可用资产
        </div>
      </div>
    </div>
  );
}