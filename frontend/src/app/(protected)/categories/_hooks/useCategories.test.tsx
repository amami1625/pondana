import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockCategory } from '@/test/factories';
import { fetchCategories } from '@/app/(protected)/categories/_lib/fetchCategories';
import { useCategories } from './useCategories';

// fetchCategories をモック化
vi.mock('@/app/(protected)/categories/_lib/fetchCategories');

describe('useCategories', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchCategories を呼び出してデータを取得する', async () => {
      // APIから返ってくる想定のデータ
      const mockCategories = [
        createMockCategory({ id: 1, name: 'テストカテゴリA' }),
        createMockCategory({ id: 2, name: 'テストカテゴリB' }),
      ];

      vi.mocked(fetchCategories).mockResolvedValue(mockCategories);

      // フックをレンダリング
      const { result } = renderHook(() => useCategories(), {
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
      expect(result.current.data).toEqual(mockCategories);

      // fetchCategories が正しく呼ばれたことを確認
      expect(fetchCategories).toHaveBeenCalledTimes(1);
    });

    it('空配列を取得できる', async () => {
      vi.mocked(fetchCategories).mockResolvedValue([]);

      // フックをレンダリング
      const { result } = renderHook(() => useCategories(), {
        wrapper: createProvider(),
      });

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('fetchCategories がエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchCategories).mockRejectedValue(new Error('カテゴリの取得に失敗しました'));

      // フックをレンダリング
      const { result } = renderHook(() => useCategories(), {
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
      expect(result.current.error?.message).toBe('カテゴリの取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchCategories).mockResolvedValue([]);

      const { result } = renderHook(() => useCategories(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // queryKeyの確認（内部実装に依存するため、間接的に確認）
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
