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
      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <DialogPanel className="w-full max-w-[calc(100vw-16px)] sm:max-w-md rounded-2xl bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="text-lg sm:text-xl font-bold mb-4">{title}</DialogTitle>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
