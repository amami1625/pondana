interface ButtonProps {
  type?: 'button' | 'submit';
  variant: 'update' | 'delete' | 'add' | 'remove' | 'create' | 'cancel' | 'submit' | 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  loadingLabel?: string;
}

const BUTTON_STYLES = {
  // TODO ボタンの必要な種類が出揃ったらリファクタリングする
  create: 'bg-primary text-white hover:bg-primary/90',
  delete: 'bg-red-600 text-white hover:bg-red-700',
  add: 'bg-pink-600 text-white hover:bg-pink-700',
  remove: 'bg-gray-600 text-white hover:bg-gray-700',
  update: 'bg-green-600 text-white hover:bg-green-700',
  submit: 'bg-primary text-white hover:bg-primary/90',
  cancel: 'bg-red-600 text-white hover:bg-red-700',
  // 仮の共通スタイル
  primary: 'bg-primary text-white hover:bg-primary/90',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  danger: 'text-red-600 hover:bg-red-500/10',
};

const BASE_STYLES =
  'flex min-w-[84px] items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-sm font-bold transition-colors cursor-pointer gap-2';

const DISABLED_STYLES =
  'disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300';

export default function Button({
  type = 'button',
  variant,
  onClick,
  disabled,
  children,
  icon,
  loadingLabel,
}: ButtonProps) {
  const label = disabled && loadingLabel ? loadingLabel : children;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE_STYLES} ${BUTTON_STYLES[variant]} ${DISABLED_STYLES}`}
    >
      {icon}
      {label}
    </button>
  );
}
