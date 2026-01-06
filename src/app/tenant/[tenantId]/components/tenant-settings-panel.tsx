'use client';

import { useEffect, useState } from 'react';
import { useTenantStore } from '@/stores/tenant-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save } from 'lucide-react';

interface TenantSettingsPanelProps {
  tenantId: string;
}

export default function TenantSettingsPanel({ tenantId }: TenantSettingsPanelProps) {
  const { currentTenant, setUsage, isLoading, error, setError, clearError } = useTenantStore();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    name: currentTenant?.name || '',
    description: currentTenant?.description || '',
    allowRegistration: false,
    requireEmailVerification: true,
    maxProjectsPerUser: 10,
  });

  useEffect(() => {
    if (currentTenant) {
      setSettings({
        name: currentTenant.name,
        description: currentTenant.description || '',
        allowRegistration: currentTenant.settings.allowRegistration ?? false,
        requireEmailVerification: currentTenant.settings.requireEmailVerification ?? true,
        maxProjectsPerUser: currentTenant.settings.maxProjectsPerUser ?? 10,
      });
    }
  }, [currentTenant]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    clearError();

    try {
      const response = await fetch(`/api/tenant/${tenantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('设置已保存');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || '保存设置失败');
      }
    } catch (err) {
      setError('保存设置失败，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>工作空间设置</CardTitle>
        <CardDescription>管理工作空间的配置和偏好</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-6">
          {successMessage && (
            <Alert>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">工作空间名称</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              placeholder="描述这个工作空间的用途..."
              value={settings.description}
              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">权限设置</h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>允许注册</Label>
                <p className="text-sm text-muted-foreground">
                  允许用户自行注册加入工作空间
                </p>
              </div>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>邮箱验证</Label>
                <p className="text-sm text-muted-foreground">
                  要求新用户验证邮箱地址
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">资源限制</h3>

            <div className="space-y-2">
              <Label htmlFor="maxProjects">每用户最大项目数</Label>
              <Input
                id="maxProjects"
                type="number"
                min={1}
                value={settings.maxProjectsPerUser}
                onChange={(e) => setSettings({ ...settings, maxProjectsPerUser: parseInt(e.target.value) || 10 })}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              保存设置
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}