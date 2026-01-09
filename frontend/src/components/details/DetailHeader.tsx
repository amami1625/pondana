import { Star } from 'lucide-react';

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  authors?: string[];
  rating?: number;
  badges?: React.ReactNode;
}

export default function DetailHeader({
  title,
  subtitle,
  authors,
  rating,
  badges,
}: DetailHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4 min-w-0">
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-lg font-medium truncate">{subtitle ?? ''}</p>
        )}
        {authors && (
          <p className="text-slate-500 text-lg font-medium truncate">{`著者: ${authors.map((author) => author).join(', ')}`}</p>
        )}
        {rating && (
          <div className="flex items-center gap-1 text-primary mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < (rating ?? 0) ? 'fill-current' : ''}`} />
            ))}
          </div>
        )}
      </div>
      {badges && <div className="flex items-center gap-3">{badges}</div>}
    </div>
  );
}
