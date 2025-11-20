import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, toJapaneseLocaleString } from '@/test/helpers';
import { createMockList } from '@/test/factories';
import { useLists } from './useLists';

describe('useLists', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('リスト一覧データを正しく取得できる', async () => {
      // APIから返ってくる想定のデータ
      const mockApiResponse = [
        createMockList({ id: 1, name: 'テストリストA', books_count: 1 }),
        createMockList({ id: 2, name: 'テストリストB', books_count: 0 }),
      ];

      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useLists(), {
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

      // Zodで変換された後のデータを確認
      expect(result.current.data).toHaveLength(2);

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result.current.data?.[0]).toEqual({
        id: 1,
        name: 'テストリストA',
        description: 'テスト説明',
        user_id: 1,
        public: true,
        books_count: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result.current.data?.[1]).toEqual({
        id: 2,
        name: 'テストリストB',
        description: 'テスト説明',
        user_id: 1,
        public: true,
        books_count: 0,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/lists');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('データが存在しない場合、空配列を取得する', async () => {
      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [],
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useLists(), {
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

      // Zodで変換された後のデータを確認
      expect(result.current.data).toEqual([]);

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/lists');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラー状態になる', async () => {
      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'リスト一覧の取得に失敗しました' }),
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useLists(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('リスト一覧の取得に失敗しました');
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      // fetchをモック
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      // フックをレンダリング
      const { result } = renderHook(() => useLists(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });
  });
});
