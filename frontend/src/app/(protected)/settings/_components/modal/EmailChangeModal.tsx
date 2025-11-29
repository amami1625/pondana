'use client';

import BaseModal from '@/components/modals/BaseModal';
import EmailChangeForm from '@/app/(protected)/settings/_components/forms/EmailChangeForm';

interface EmailChangeModalProps {
  currentEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailChangeModal({ currentEmail, isOpen, onClose }: EmailChangeModalProps) {
  return (
    <BaseModal title="メールアドレスを変更" isOpen={isOpen} onClose={onClose}>
      <EmailChangeForm currentEmail={currentEmail} onClose={onClose} />
    </BaseModal>
  );
}
