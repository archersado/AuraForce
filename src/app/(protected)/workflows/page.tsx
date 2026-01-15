'use client';

import { useState } from 'react';
import WorkflowSpecUpload from '@/components/workflows/WorkflowSpecUpload';
import WorkflowSpecList from '@/components/workflows/WorkflowSpecList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function WorkflowsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleDelete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          工作流管理
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          上传和管理 BMAD 工作流规范文件，部署到 Claude Code 环境
        </p>
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
