'use client';

import { useState } from 'react';
import { User as UserIcon, Camera, Save } from 'lucide-react';
import { useRequireAuth } from '@/hooks/useSession';
import { apiFetch } from '@/lib/api-client';

interface ProfileFormData {
  name: string;
}

export default function ProfileForm() {
  const { session, user, refetch } = useRequireAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: user?.name || '',
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('头像文件大小不能超过 5MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('只支持 JPG、PNG、WebP 和 GIF 格式的图片');
      return;
    }

    setAvatarFile(file);
    setError('');

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (avatarFile) {
        formDataToSend.append('avatar', avatarFile);
      }

      const response = await apiFetch('/api/user/profile', {
        method: 'PATCH',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || '更新失败');
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Refetch session to get updated user data
      await refetch();
      setTimeout(() => setSuccess(false), 3000);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error('Profile update error:', err);
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const displayAvatar = avatarPreview || user?.image || null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">个人资料</h2>
        <p className="text-gray-600 mt-1">管理您的个人信息和头像</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">个人资料更新成功</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-start space-x-6">
          <div className="relative">
            {displayAvatar ? (
              <img
                src={displayAvatar}
                alt="头像"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            )}
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-white border-2 border-gray-300 rounded-full p-1 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={loading}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">头像</h3>
            <p className="text-sm text-gray-600 mt-1 mb-3">
              点击相机图标上传新头像。支持 JPG、PNG、WebP、GIF 格式，最大 5MB。
            </p>
            {avatarPreview && (
              <button
                type="button"
                onClick={() => {
                  setAvatarFile(null);
                  setAvatarPreview(null);
                }}
                className="text-sm text-red-600 hover:text-red-700"
                disabled={loading}
              >
                取消更改
              </button>
            )}
          </div>
        </div>

        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            显示名称
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            placeholder="您的显示名称"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            这个名称会在您的资料和评论中显示
          </p>
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            邮箱地址
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={user?.email || ''}
            readOnly
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500 mt-1">
            邮箱地址不可更改
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
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
              保存中...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              保存更改
            </>
          )}
        </button>
      </form>
    </div>
  );
}
