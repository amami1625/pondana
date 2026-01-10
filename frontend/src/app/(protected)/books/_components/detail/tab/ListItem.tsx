import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { BookDetail } from '@/app/(protected)/books/_types';

interface ListItemProps {
  items: BookDetail['lists'] | BookDetail['cards'];
  variant: 'list' | 'card';
}

export default function ListItem({ items, variant }: ListItemProps) {
  const emptyMessage =
    variant === 'list'
      ? 'この本はまだリストに追加されていません'
      : 'この本のカードはまだ作成されていません';

  if (items.length === 0) {
    return <p className="text-slate-500 text-center py-8">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const title = 'name' in item ? item.name : item.title;
        const href = variant === 'list' ? `/lists/${item.id}` : `/cards/${item.id}`;

        return (
          <Link
            key={item.id}
            href={href}
            className="flex items-center justify-between gap-3 p-4 rounded-lg bg-white hover:bg-slate-100/50 border border-slate-200 transition-colors min-w-0"
          >
            <span className="font-medium text-slate-800 truncate flex-1 min-w-0">{title}</span>
            <ChevronRight size={20} className="text-slate-400 flex-shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}
