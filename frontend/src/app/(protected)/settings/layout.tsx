import PageTitle from '@/components/layout/PageTitle';
import SettingsSidebar from '@/app/(protected)/settings/_components/layout/SettingsSidebar';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl sm:px-4 py-10">
      <PageTitle title="設定" />
      <SettingsSidebar />
      {children}
    </div>
  );
}
