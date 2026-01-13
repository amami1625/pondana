import { OverviewStats } from '@/schemas/dashboard';
import { BookOpen, Hash, Notebook, Tag } from 'lucide-react';

export function useOverviewStats(data: OverviewStats) {
  const stats = [
    {
      label: '総書籍数',
      value: data.total_books,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: '総カード数',
      value: data.total_cards,
      icon: Notebook,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'カテゴリー数',
      value: data.total_categories,
      icon: Tag,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      label: 'タグ数',
      value: data.total_tags,
      icon: Hash,
      color: 'bg-orange-50 text-orange-600',
    },
  ];

  return { stats };
}
