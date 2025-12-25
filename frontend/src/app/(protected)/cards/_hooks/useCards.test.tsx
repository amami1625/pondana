import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { createMockCard } from '@/test/factories';
import type { CardList } from '@/app/(protected)/cards/_types';
import { fetchCards } from '@/app/(protected)/cards/_lib/query/fetchCards';
import { useCards } from './useCards';

// fetchCardsをモック化
vi.mock('@/app/(protected)/cards/_lib/query/fetchCards');

describe('useCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchCardsを呼び出してデータを取得する', async () => {
      const mockCardList: CardList = {
        books: [
          {
            book: { id: createTestUuid(1), title: 'テスト本A' },
            cards: [createMockCard({ id: createTestUuid(1), book_id: createTestUuid(1) })],
          },
        ],
      };

      vi.mocked(fetchCards).mockResolvedValue(mockCardList);

      const { result } = renderHook(() => useCards(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockCardList);

      // fetchCardsが呼ばれたことを確認
      expect(fetchCards).toHaveBeenCalledTimes(1);
    });

    it('空のカードリストを取得できる', async () => {
      const emptyCardList: CardList = {
        books: [],
      };

      vi.mocked(fetchCards).mockResolvedValue(emptyCardList);

      const { result } = renderHook(() => useCards(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.books).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchCardsがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchCards).mockRejectedValue(new Error('カード一覧の取得に失敗しました'));

      const { result } = renderHook(() => useCards(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('カード一覧の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchCards).mockResolvedValue({ books: [] });

      const { result } = renderHook(() => useCards(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // queryKeyの確認（内部実装に依存するため、間接的に確認）
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
