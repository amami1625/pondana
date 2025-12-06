import Link from 'next/link';
import { getCategoryColor } from '@/lib/utils';

interface BookCardProps {
  id: string;
  title: string;
  authors?: { name: string }[];
  category?: { name: string };
}

export default function BookCard({ id, title, authors, category }: BookCardProps) {
  const colorClass = getCategoryColor(category?.name);

  return (
    <Link href={`/books/${id}`} className="flex flex-col gap-3 pb-3 group">
      {/* 表紙のプレースホルダー */}
      <div
        className={`w-full aspect-[3/4] rounded-lg shadow-sm transition-shadow duration-300 group-hover:shadow-xl flex items-center justify-center ${colorClass}`}
      >
        <div className="text-white text-center p-4">
          <div className="text-5xl font-black mb-2">{title.charAt(0).toUpperCase()}</div>
          {category && (
            <div className="text-xs font-medium bg-white/20 rounded px-2 py-1 backdrop-blur-sm">
              {category.name}
            </div>
          )}
        </div>
      </div>

      {/* 本の情報 */}
      <div>
        <p className="text-slate-900 text-base font-medium leading-normal truncate">{title}</p>
        {authors && authors.length > 0 && (
          <p className="text-slate-500 text-sm font-normal leading-normal truncate">
            {authors.map((a) => a.name).join(', ')}
          </p>
        )}
      </div>
    </Link>
  );
}
