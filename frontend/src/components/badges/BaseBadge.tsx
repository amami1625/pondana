import { ReactNode } from 'react';

interface BaseBadgeProps {
  icon: ReactNode;
  label: string;
  variant: 'category' | 'public' | 'private';
}

const BADGE_STYLES = {
  category: 'bg-primary/10 text-primary',
  public: 'bg-green-500/10 text-green-600',
  private: 'bg-slate-200 text-slate-700',
};

export default function BaseBadge({ icon, label, variant }: BaseBadgeProps) {
  return (
    <div
      className={`flex h-8 items-center justify-center gap-x-2 rounded-lg px-3 ${BADGE_STYLES[variant]}`}
    >
      {icon}
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
