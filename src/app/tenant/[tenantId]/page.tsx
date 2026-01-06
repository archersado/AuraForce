'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenantStore } from '@/stores/tenant-store';
import { useUserStore } from '@/stores/user-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Settings, BarChart3, Plus, Shield } from 'lucide-react';
import MemberManagementPanel from './components/member-management-panel';
import TenantSettingsPanel from './components/tenant-settings-panel';

export default function TenantDashboard({ params }: { params: { tenantId: string } }) {
  const router = useRouter();
  const { user } = useUserStore();
  const { currentTenant, userRole, members, usage, isLoading } = useTenantStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (!currentTenant || currentTenant.id !== params.tenantId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{currentTenant.name}</h1>
          <p className="text-muted-foreground">
            {currentTenant.description || '工作空间'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={currentTenant.isActive ? 'default' : 'secondary'}>
              {currentTenant.isActive ? '活跃' : '未激活'}
            </Badge>
            <Badge variant="outline">{currentTenant.plan}</Badge>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">我的角色</p>
          <Badge variant={userRole === 'ADMIN' ? 'default' : 'secondary'} className="mt-1">
            <Shield className="w-3 h-3 mr-1" />
            {userRole === 'ADMIN' ? '管理员' : userRole === 'EDITOR' ? '编辑者' : '成员'}
          </Badge>
        </div>
      </div>

      {/* Usage Cards */}
      {usage && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">成员使用</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.memberCount ?? usage.members} / {usage.maxMembers ?? 10}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                已使用 {usage.maxMembers ? Math.round(((usage.memberCount ?? usage.members) / usage.maxMembers) * 100) : 0}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">资源使用</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usage.projectCount ?? usage.skills ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                项目数量
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">存储使用</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.storageUsedMB ? (usage.storageUsedMB / 1024).toFixed(1) : '0.0'} GB
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                / {usage.storageLimitMB ? (usage.storageLimitMB / 1024).toFixed(1) : '10.0'} GB
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            成员管理
          </TabsTrigger>
          {userRole === 'ADMIN' && (
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              工作空间设置
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <MemberManagementPanel tenantId={params.tenantId} />
        </TabsContent>

        {userRole === 'ADMIN' && (
          <TabsContent value="settings" className="mt-6">
            <TenantSettingsPanel tenantId={params.tenantId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
