import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockTag } from '@/test/factories/tag';
import { useTags } from './useTags';
import { fetchTags } from '@/app/(protected)/tags/_lib/query/fetchTags';

// fetchTagsをモック化
vi.mock('@/app/(protected)/tags/_lib/query/fetchTags');

describe('useTags', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  // APIから返ってくる想定のデータ
  const mockTags = [
    createMockTag({ id: 1, name: 'テストタグA' }),
    createMockTag({ id: 2, name: 'テストタグB' }),
  ];

  describe('成功時', () => {
    it('fetchTags を呼び出してデータを取得する', async () => {
      vi.mocked(fetchTags).mockResolvedValue(mockTags);

      // フックをレンダリング
      const { result } = renderHook(() => useTags(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockTags);

      // fetchTags が正しく呼ばれたことを確認
      expect(fetchTags).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchTags).mockResolvedValue([]);

      // フックをレンダリング
      const { result } = renderHook(() => useTags(), {
        wrapper: createProvider(),
      });

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchTags がエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchTags).mockRejectedValue(new Error('タグの取得に失敗しました'));

      // フックをレンダリング
      const { result } = renderHook(() => useTags(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('タグの取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('キャッシュが有効に機能する', async () => {
      vi.mocked(fetchTags).mockResolvedValue(mockTags);

      const { result, rerender } = renderHook(() => useTags(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);

      // 再レンダリング時にキャッシュから即座にデータが返される
      rerender();
      expect(result.current.data).toBeDefined();
    });
  });
});
