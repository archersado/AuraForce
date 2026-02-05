'use client';

import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import NextDynamic from 'next/dynamic';
import WorkflowSpecUpload from '@/components/workflows/WorkflowSpecUpload';
import WorkflowSpecList from '@/components/workflows/WorkflowSpecList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Dynamically import WorkspacePanel to avoid SSR issues
const WorkspacePanel = NextDynamic(() => import('@/components/workspace').then(mod => ({ default: mod.WorkspacePanel })), {
  ssr: false,
  loading: () => null,
});

export const dynamic = 'force-dynamic';

export default function WorkflowsPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Workspace Panel Modal */}
      <WorkspacePanel
        isOpen={workspaceOpen}
        onClose={() => setWorkspaceOpen(false)}
      />

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            工作流管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            上传和管理 BMAD 工作流规范文件，部署到 Claude Code 环境
          </p>
        </div>
        <button
          onClick={() => setWorkspaceOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <FolderOpen className="w-4 h-4" />
          Open Workspace Files
        </button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">已部署工作流</TabsTrigger>
          <TabsTrigger value="upload">上传新的工作流</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <WorkflowSpecList
            key={refreshKey}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="upload" className="mt-6">
          <WorkflowSpecUpload onUploadComplete={handleUploadComplete} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
