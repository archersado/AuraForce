'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user-store';
import { useTenantStore } from '@/stores/tenant-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Users, Settings, ArrowRight, Shield, Plus } from 'lucide-react';
import { apiFetch } from '@/lib/api-client';

export default function TenantSection() {
  const router = useRouter();
  const { user } = useUserStore();
  const { currentTenant, userRole, isLoading } = useTenantStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTenantInfo();
  }, []);

  const fetchTenantInfo = async () => {
    if (!user?.id) return;

    try {
      const response = await apiFetch('/api/tenant');
      const data = await response.json();

      if (data.success) {
        // Update tenant store
      }
    } catch (err) {
      setError('获取工作空间信息失败');
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '管理员';
      case 'EDITOR':
        return '编辑者';
      case 'MEMBER':
        return '成员';
      case 'VIEWER':
        return '查看者';
      default:
        return role;
    }
  };

  const getSubscriptionRequired = () => {
    return user?.subscriptionLevel !== 'ENTERPRISE';
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">工作空间</h2>
        <p className="text-gray-600 text-sm">
          管理您的企业工作空间和团队协作
        </p>
      </div>

      {currentTenant ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {currentTenant.name}
                </CardTitle>
                <CardDescription className="mt-2">
                  {currentTenant.description || '您的工作空间'}
                </CardDescription>
              </div>
              <Badge variant="default">{currentTenant.plan}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* User Role */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">您的角色</p>
                  <p className="text-xs text-muted-foreground">
                    在这个工作空间中的权限级别
                  </p>
                </div>
              </div>
              <Badge variant={userRole === 'ADMIN' ? 'default' : 'outline'}>
                {getRoleLabel(userRole || 'MEMBER')}
              </Badge>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => router.push(`/tenant/${currentTenant.id}`)}
                className="flex-1"
              >
                <Settings className="w-4 h-4 mr-2" />
                管理工作空间
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/tenant/${currentTenant.id}`)}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : getSubscriptionRequired() ? (
        <Card>
          <CardHeader>
            <CardTitle>升级到企业版</CardTitle>
            <CardDescription>
              企业版支持创建工作空间，邀请团队成员协作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/subscription')}>
              查看订阅方案
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>创建工作空间</CardTitle>
            <CardDescription>
              您有企业版订阅，可以创建自己的工作空间
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button onClick={() => router.push('/tenant/create')}>
                <Plus className="w-4 h-4 mr-2" />
                创建工作空间
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
