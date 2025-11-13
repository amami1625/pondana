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
  update: 'bg-blue-600 hover:bg-blue-700',
  delete: 'bg-red-600 hover:bg-red-700',
  add: 'bg-pink-600 hover:bg-pink-700',
  remove: 'bg-gray-600 hover:bg-gray-700',
  create: 'bg-green-600 hover:bg-green-700',
  submit: 'bg-blue-600 hover:bg-blue-700',
  cancel: 'bg-red-600 hover:bg-red-700',
};

const BASE_STYLES =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition cursor-pointer';

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
