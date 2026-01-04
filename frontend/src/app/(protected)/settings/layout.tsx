import SettingsSidebar from '@/app/(protected)/settings/_components/layout/SettingsSidebar';
import PageTitle from '@/components/layout/PageTitle';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageTitle title="設定" />
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
