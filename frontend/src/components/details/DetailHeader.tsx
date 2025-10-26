interface Badge {
  label: string;
  variant: 'status' | 'category';
}

interface DetailHeaderProps {
  title: string;
  badges?: Badge[];
}

const BADGE_STYLES = {
  status:
    'rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700',
  category: 'rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600',
};

export default function DetailHeader({ title, badges }: DetailHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {badges.map((badge, index) => (
            <span key={index} className={BADGE_STYLES[badge.variant]}>
              {badge.label}
            </span>
          ))}
        </div>
      )}
      <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">{title}</h1>
    </header>
  );
}
