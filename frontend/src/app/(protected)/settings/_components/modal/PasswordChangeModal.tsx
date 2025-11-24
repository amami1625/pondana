'use client';

import BaseModal from '@/components/BaseModal';
import PasswordChangeForm from '@/app/(protected)/settings/_components/forms/PasswordChangeForm';

interface PasswordChangeModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordChangeModal({ email, isOpen, onClose }: PasswordChangeModalProps) {
  return (
    <BaseModal title="パスワードを変更" isOpen={isOpen} onClose={onClose}>
      <PasswordChangeForm email={email} onClose={onClose} />
    </BaseModal>
  );
}
