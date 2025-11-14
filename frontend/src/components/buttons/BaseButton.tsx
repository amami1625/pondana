import { ReactNode } from 'react';

interface BaseButtonProps {
  type?: 'button' | 'submit';
  variant: 'update' | 'delete' | 'add' | 'remove' | 'create' | 'cancel' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

const BUTTON_STYLES = {
  create: 'bg-primary hover:bg-primary/90',
  delete: 'bg-red-600 hover:bg-red-700',
  add: 'bg-pink-600 hover:bg-pink-700',
  remove: 'bg-gray-600 hover:bg-gray-700',
  update: 'bg-green-600 hover:bg-green-700',
  submit: 'bg-primary hover:bg-primary/90',
  cancel: 'bg-red-600 hover:bg-red-700',
};

const BASE_STYLES =
  'flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-medium text-white transition-colors cursor-pointer gap-2';

const DISABLED_STYLES =
  'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300';

export default function BaseButton({
  type = 'button',
  variant,
  onClick,
  disabled,
  children,
  icon,
}: BaseButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE_STYLES} ${BUTTON_STYLES[variant]} ${DISABLED_STYLES}`}
    >
      {icon}
      {children}
    </button>
  );
}
