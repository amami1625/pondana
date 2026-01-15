'use client';

import { User } from '@/schemas/user';
import { useModal } from '@/hooks/useModal';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
import AvatarUpload from '@/app/(protected)/settings/_components/display/AvatarUpload';
import UserFormModal from '@/app/(protected)/settings/_components/modal/UserFormModal';
import PasswordChangeModal from '@/app/(protected)/settings/_components/modal/PasswordChangeModal';
import EmailChangeModal from '@/app/(protected)/settings/_components/modal/EmailChangeModal';

interface SettingsViewProps {
  email: string;
  user: User;
}

export default function SettingsView({ email, user }: SettingsViewProps) {
  const updateNameModal = useModal();
  const passwordChangeModal = useModal();
  const emailChangeModal = useModal();

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">プロフィール情報</h2>

      {/* アバター */}
      <AvatarUpload user={user} />

      <div className="space-y-6">
        <SettingsItem label="名前" value={user.name} onEdit={updateNameModal.open} />
        <SettingsItem label="メールアドレス" value={email} onEdit={emailChangeModal.open} />
        <SettingsItem label="パスワード" value="••••••••" onEdit={passwordChangeModal.open} />
        <SettingsItem label="登録日" value={user.created_at} />
        <SettingsItem label="更新日" value={user.updated_at} isLast />
      </div>

      <UserFormModal user={user} isOpen={updateNameModal.isOpen} onClose={updateNameModal.close} />
      <PasswordChangeModal
        email={email}
        isOpen={passwordChangeModal.isOpen}
        onClose={passwordChangeModal.close}
      />
      <EmailChangeModal
        currentEmail={email}
        isOpen={emailChangeModal.isOpen}
        onClose={emailChangeModal.close}
      />
    </div>
  );
}
