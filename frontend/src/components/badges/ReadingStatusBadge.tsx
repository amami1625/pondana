import { BookOpen, BookMarked, CircleCheckBig } from 'lucide-react';

type ReadingStatus = 'unread' | 'reading' | 'completed';

interface ReadingStatusBudgeProps {
  label: ReadingStatus;
}

const READING_STATUS_STYLES = {
  unread: {
    className: 'bg-slate-100 text-slate-600',
    icon: <BookOpen size={16} />,
    displayLabel: '未読',
  },
  reading: {
    className: 'bg-amber-100 text-amber-700',
    icon: <BookMarked size={16} />,
    displayLabel: '読書中',
  },
  completed: {
    className: 'bg-green-100 text-green-700',
    icon: <CircleCheckBig size={16} />,
    displayLabel: '読了',
  },
};

export default function ReadingStatusBudge({ label }: ReadingStatusBudgeProps) {
  const { className, icon, displayLabel } = READING_STATUS_STYLES[label];

  return (
    <div className={`flex h-8 items-center justify-center gap-x-2 rounded-lg px-3 ${className}`}>
      {icon}
      <p className="text-sm font-medium">{displayLabel}</p>
    </div>
  );
}