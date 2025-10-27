import { ReactNode } from 'react';
import SettingsSidebar from '@/app/(protected)/settings/_components/layout/SettingsSidebar';

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">設定</h1>
      <div className="flex gap-8">
        {/* サイドバー */}
        <aside className="w-64 flex-shrink-0">
          <SettingsSidebar />
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
