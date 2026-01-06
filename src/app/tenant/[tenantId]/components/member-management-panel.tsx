'use client';

import { useEffect, useState } from 'react';
import { useTenantStore, TenantMember } from '@/stores/tenant-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, UserPlus, MoreVertical, Shield, Trash2 } from 'lucide-react';
import { TenantRole } from '@/lib/tenant/rbac.service';

interface MemberManagementPanelProps {
  tenantId: string;
}

export default function MemberManagementPanel({ tenantId }: MemberManagementPanelProps) {
  const { members, setMembers, isLoading, setLoading, error, setError, clearError } = useTenantStore();
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<TenantRole>(TenantRole.MEMBER);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [tenantId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tenant/${tenantId}/members`);
      const data = await response.json();

      if (data.success) {
        setMembers(data.members);
      } else {
        setError(data.message || '获取成员列表失败');
      }
    } catch (err) {
      setError('获取成员列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    clearError();

    try {
      const response = await fetch(`/api/tenant/${tenantId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(`邀请已发送至 ${inviteEmail}`);
        setInviteEmail('');
        setInviteDialogOpen(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || '邀请失败');
      }
    } catch (err) {
      setError('邀请失败，请稍后重试');
    } finally {
      setIsInviting(false);
    }
  };

  const updateMemberRole = async (memberId: string, newRole: TenantRole) => {
    try {
      const response = await fetch(`/api/tenant/${tenantId}/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
        setSuccessMessage('角色已更新');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || '更新角色失败');
      }
    } catch (err) {
      setError('更新角色失败');
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm('确定要移除这个成员吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/tenant/${tenantId}/members/${memberId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMembers(members.filter(m => m.id !== memberId));
        setSuccessMessage('成员已移除');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(data.message || '移除成员失败');
      }
    } catch (err) {
      setError('移除成员失败');
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const getRoleBadgeColor = (role: TenantRole) => {
    switch (role) {
      case TenantRole.ADMIN:
        return 'default';
      case TenantRole.EDITOR:
        return 'secondary';
      case TenantRole.MEMBER:
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getRoleLabel = (role: TenantRole) => {
    switch (role) {
      case TenantRole.ADMIN:
        return '管理员';
      case TenantRole.EDITOR:
        return '编辑者';
      case TenantRole.MEMBER:
        return '成员';
      default:
        return role;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>成员管理</CardTitle>
            <CardDescription>管理工作空间的成员和权限</CardDescription>
          </div>
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                邀请成员
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>邀请新成员</DialogTitle>
                <DialogDescription>
                  发送邀请链接给用户，他们将加入这个工作空间
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      邮箱地址
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role" className="text-sm font-medium">
                      角色
                    </label>
                    <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as TenantRole)}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TenantRole.MEMBER}>成员</SelectItem>
                        <SelectItem value={TenantRole.EDITOR}>编辑者</SelectItem>
                        <SelectItem value={TenantRole.ADMIN}>管理员</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setInviteDialogOpen(false)}>
                    取消
                  </Button>
                  <Button type="submit" disabled={isInviting}>
                    {isInviting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    发送邀请
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {successMessage && (
          <Alert className="mb-4">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            暂无成员，点击上方按钮邀请新成员
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-card"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar || undefined} />
                    <AvatarFallback>{getInitials(member.name, member.email)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name || member.email}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeColor(member.role)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {getRoleLabel(member.role)}
                  </Badge>
                  <Select
                    value={member.role}
                    onValueChange={(v) => updateMemberRole(member.id, v as TenantRole)}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={TenantRole.MEMBER}>成员</SelectItem>
                      <SelectItem value={TenantRole.EDITOR}>编辑者</SelectItem>
                      <SelectItem value={TenantRole.ADMIN}>管理员</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMember(member.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}