import { User } from '@/schemas/profile';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';

interface SettingsViewProps {
  user: User;
}

export default function SettingsView({ user }: SettingsViewProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">プロフィール情報</h2>

      <div className="space-y-6">
        <SettingsItem label="名前" value={user.name} />
        <SettingsItem label="ユーザーID" value={`#${user.id}`} />
        <SettingsItem label="登録日" value={user.created_at} />
        <SettingsItem label="更新日" value={user.updated_at} isLast />
      </div>
    </div>
  );
}
