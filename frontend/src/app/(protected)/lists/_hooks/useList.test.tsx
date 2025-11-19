import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, toJapaneseLocaleString } from '@/test/helpers';
import { createMockAuthor, createMockBook, createMockList } from '@/test/factories';
import { useList } from './useList';

describe('useList', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('リストデータが正しく取得できる', async () => {
      // APIから返ってくる想定のデータ
      const mockApiResponse = createMockList({
        id: 1,
        name: 'テストリスト',
        books: [
          createMockBook({
            id: 1,
            title: 'テスト本',
            authors: [createMockAuthor({ id: 1, name: 'テスト著者' })],
          }),
        ],
        list_books: [{ id: 1, list_id: 1, book_id: 1 }],
      });

      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useList(1), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result.current.data).toEqual({
        id: 1,
        name: 'テストリスト',
        description: 'テスト説明',
        user_id: 1,
        public: true,
        books_count: 0,
        created_at: expectedDate,
        updated_at: expectedDate,
        books: [
          {
            id: 1,
            title: 'テスト本',
            description: 'テスト説明',
            user_id: 1,
            category_id: 1,
            rating: 5,
            reading_status: 'completed',
            public: true,
            authors: [
              {
                id: 1,
                name: 'テスト著者',
                user_id: 1,
                created_at: expectedDate,
                updated_at: expectedDate,
              },
            ],
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
        list_books: [{ id: 1, list_id: 1, book_id: 1 }],
      });

      expect(fetch).toBeCalledWith('/api/lists/1');
      expect(fetch).toBeCalledTimes(1);
    });

    it('idが0の時、クエリを実行しない', () => {
      // フックをレンダリング
      const { result } = renderHook(() => useList(0), {
        wrapper: createProvider(),
      });

      // クエリが無効化されているため、データ取得が行われない
      expect(result.current.isLoading).toBe(false);
      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.data).toBeUndefined();

      // fetchが呼ばれていないことを確認
      expect(fetch).not.toHaveBeenCalled();
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラー状態になる', async () => {
      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'リスト詳細の取得に失敗しました' }),
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useList(1), {
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
      expect(result.current.error?.message).toBe('リスト詳細の取得に失敗しました');
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      // fetchをモック
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      // フックをレンダリング
      const { result } = renderHook(() => useList(1), {
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
