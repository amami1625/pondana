import { Dialog, DialogPanel, DialogTitle, DialogBackdrop } from '@headlessui/react';
import { ReactNode } from 'react';

interface BaseModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function BaseModal({ title, isOpen, onClose, children }: BaseModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景オーバーレイ */}
      <DialogBackdrop className="fixed inset-0 bg-black/30" />

      {/* モーダル配置 */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="mx-auto max-w-md w-full rounded-2xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-xl font-bold mb-4">{title}</DialogTitle>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
