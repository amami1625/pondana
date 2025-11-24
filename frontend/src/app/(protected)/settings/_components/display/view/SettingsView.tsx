'use client';

import Image from 'next/image';
import { User as UserIcon } from 'lucide-react';
import { User } from '@/schemas/user';
import { useModal } from '@/hooks/useModal';
import SettingsItem from '@/app/(protected)/settings/_components/display/SettingsItem';
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
      <div className="mb-8 flex justify-center">
        <div className="relative h-24 w-24 flex-shrink-0">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.name}
              fill
              className="rounded-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100">
              <UserIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
      </div>

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
