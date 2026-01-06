'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useUserStore } from '@/stores/user-store';

type Step = 1 | 2 | 3;

export default function TenantSetupWizard() {
  const router = useRouter();
  const { user } = useUserStore();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);

  // Step 1: Basic Info
  const [tenantName, setTenantName] = useState('');
  const [tenantDescription, setTenantDescription] = useState('');

  // Step 2: Settings
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);

  // Step 3: Confirmation
  const [confirmation, setConfirmation] = useState(false);

  const isStep1Valid = tenantName.trim().length >= 2;
  const isStep2Valid = true; // No required fields
  const isStep3Valid = confirmation;

  const handleStep1Next = () => {
    if (!isStep1Valid) {
      setError('工作空间名称至少需要2个字符');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleStep2Next = () => {
    setError(null);
    setStep(3);
  };

  const handleStep3Submit = async () => {
    if (!confirmation) {
      setError('请确认创建工作空间');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tenant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: tenantName.trim(),
          description: tenantDescription.trim(),
          settings: {
            allowRegistration,
            requireEmailVerification,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTenantId(data.tenant.id);

        // Redirect to tenant dashboard after a brief delay
        setTimeout(() => {
          router.push(`/tenant/${data.tenant.id}`);
        }, 500);
      } else {
        setError(data.message || '创建工作空间失败');
      }
    } catch (err) {
      setError('创建工作空间失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setError(null);
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'border-input text-muted-foreground'
                }`}
              >
                {step > s ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="font-medium">{s}</span>
                )}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded ${
                    step > s ? 'bg-primary' : 'bg-input'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Titles */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">创建工作空间</h1>
          <p className="text-muted-foreground">
            {step === 1 && '输入工作空间的基本信息'}
            {step === 2 && '配置工作空间设置'}
            {step === 3 && '确认信息并创建'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    工作空间名称 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="例如：我的团队"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    至少2个字符，最多50个字符
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    placeholder="描述这个工作空间的用途..."
                    value={tenantDescription}
                    onChange={(e) => setTenantDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleStep1Next} size="lg">
                    下一步
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Settings */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">权限设置</h3>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label>允许注册</Label>
                        <p className="text-sm text-muted-foreground">
                          允许用户通过邀请链接自行注册
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={allowRegistration}
                        onChange={(e) => setAllowRegistration(e.target.checked)}
                        className="w-4 h-4 rounded border-input"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="space-y-0.5">
                        <Label>邮箱验证</Label>
                        <p className="text-sm text-muted-foreground">
                          要求新成员验证邮箱地址
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireEmailVerification}
                        onChange={(e) => setRequireEmailVerification(e.target.checked)}
                        className="w-4 h-4 rounded border-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={goBack} size="lg">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    上一步
                  </Button>
                  <Button onClick={handleStep2Next} size="lg">
                    下一步
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">确认信息</h3>

                  <div className="space-y-3">
                    <div className="p-3 rounded-lg border space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">名称</Label>
                        <p className="font-medium">{tenantName}</p>
                      </div>
                      {tenantDescription && (
                        <div>
                          <Label className="text-xs text-muted-foreground">描述</Label>
                          <p className="text-sm">{tenantDescription}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-3 rounded-lg border space-y-2">
                      <Label className="text-xs text-muted-foreground">设置</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant={allowRegistration ? 'default' : 'outline'}>
                          注册: {allowRegistration ? '允许' : '不允许'}
                        </Badge>
                        <Badge variant={requireEmailVerification ? 'default' : 'outline'}>
                          邮箱验证: {requireEmailVerification ? '必需' : '可选'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg border">
                  <input
                    type="checkbox"
                    id="confirm"
                    checked={confirmation}
                    onChange={(e) => setConfirmation(e.target.checked)}
                    className="w-4 h-4 rounded border-input"
                  />
                  <Label htmlFor="confirm" className="cursor-pointer">
                    我了解创建后可以随时修改这些设置
                  </Label>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={goBack} disabled={isLoading} size="lg">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    上一步
                  </Button>
                  <Button
                    onClick={handleStep3Submit}
                    disabled={isLoading || !confirmation}
                    size="lg"
                  >
                    {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                    创建工作空间
                    <Check className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          创建工作空间后，您将成为管理员
        </div>
      </div>
    </div>
  );
}