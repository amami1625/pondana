import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { createMockOverview } from '@/test/factories/dashboard';
import { useOverviewStats } from './useOverviewStats';
import { BookOpen, Hash, Notebook, Tag } from 'lucide-react';

describe('useOverviewStats', () => {
  it('OverviewStatsデータを統計項目を表示する配列に変換する', () => {
    const mockData = createMockOverview({
      total_books: 10,
      total_cards: 25,
      total_categories: 3,
      total_tags: 8,
    });

    const { result } = renderHook(() => useOverviewStats(mockData));

    expect(result.current.stats).toHaveLength(4);

    // 各項目の内容を検証
    expect(result.current.stats[0]).toMatchObject({
      label: '総書籍数',
      value: 10,
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
    });

    expect(result.current.stats[1]).toMatchObject({
      label: '総カード数',
      value: 25,
      icon: Notebook,
      color: 'bg-green-50 text-green-600',
    });

    expect(result.current.stats[2]).toMatchObject({
      label: 'カテゴリー数',
      value: 3,
      icon: Tag,
      color: 'bg-purple-50 text-purple-600',
    });

    expect(result.current.stats[3]).toMatchObject({
      label: 'タグ数',
      value: 8,
      icon: Hash,
      color: 'bg-orange-50 text-orange-600',
    });
  });

  it('値が0の場合も正しく表示される', () => {
    const zeroData = createMockOverview({
      total_books: 0,
      total_cards: 0,
      total_categories: 0,
      total_tags: 0,
    });

    const { result } = renderHook(() => useOverviewStats(zeroData));

    expect(result.current.stats[0].value).toBe(0);
    expect(result.current.stats).toHaveLength(4);
  });
});
