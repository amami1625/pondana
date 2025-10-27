'use client';

import { User } from '@/schemas/profile';
import SettingsLayout from '@/app/(protected)/settings/_components/layout/SettingsLayout';
import SettingsSidebar from '@/app/(protected)/settings/_components/layout/SettingsSidebar';

interface SettingsViewProps {
  user: User;
}

export default function SettingsView({ user }: SettingsViewProps) {
  return (
    <SettingsLayout sidebar={<SettingsSidebar />}>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-gray-900">プロフィール情報</h2>

        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <dt className="mb-1 text-sm font-medium text-gray-500">名前</dt>
            <dd className="text-base text-gray-900">{user.name}</dd>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <dt className="mb-1 text-sm font-medium text-gray-500">ユーザーID</dt>
            <dd className="text-base text-gray-900">#{user.id}</dd>
          </div>

          <div className="border-b border-gray-100 pb-4">
            <dt className="mb-1 text-sm font-medium text-gray-500">登録日</dt>
            <dd className="text-base text-gray-900">{user.created_at}</dd>
          </div>

          <div>
            <dt className="mb-1 text-sm font-medium text-gray-500">更新日</dt>
            <dd className="text-base text-gray-900">{user.updated_at}</dd>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
