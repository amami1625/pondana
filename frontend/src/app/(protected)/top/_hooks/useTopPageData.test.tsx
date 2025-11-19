import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, toJapaneseLocaleString } from '@/test/helpers';
import {
  createMockAuthor,
  createMockBook,
  createMockList,
  createMockTopPageData,
} from '@/test/factories';
import { useTopPageData } from './useTopPageData';

describe('useTopPageData', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('トップページ用のデータを正しく取得できる', async () => {
      // APIから返ってくる想定のデータ
      const mockApiResponse = createMockTopPageData({
        recent_books: [
          createMockBook({
            id: 1,
            title: 'テスト本A',
            authors: [createMockAuthor({ id: 1, name: '著者A' })],
          }),
          createMockBook({
            id: 2,
            title: 'テスト本B',
            authors: [createMockAuthor({ id: 1, name: '著者A' })],
          }),
        ],
        recent_lists: [createMockList({ id: 1, name: 'テストリスト' })],
        recent_cards: [],
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
      const { result } = renderHook(() => useTopPageData(), {
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
        recent_books: [
          {
            id: 1,
            title: 'テスト本A',
            description: 'テスト説明',
            user_id: 1,
            category_id: 1,
            rating: 5,
            reading_status: 'completed',
            public: true,
            created_at: expectedDate,
            updated_at: expectedDate,
            authors: [
              {
                id: 1,
                name: '著者A',
                user_id: 1,
                created_at: expectedDate,
                updated_at: expectedDate,
              },
            ],
          },
          {
            id: 2,
            title: 'テスト本B',
            description: 'テスト説明',
            user_id: 1,
            category_id: 1,
            rating: 5,
            reading_status: 'completed',
            public: true,
            created_at: expectedDate,
            updated_at: expectedDate,
            authors: [
              {
                id: 1,
                name: '著者A',
                user_id: 1,
                created_at: expectedDate,
                updated_at: expectedDate,
              },
            ],
          },
        ],
        recent_lists: [
          {
            id: 1,
            name: 'テストリスト',
            description: 'テスト説明',
            user_id: 1,
            public: true,
            books_count: 0,
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
        recent_cards: [],
      });

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/top');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラー状態になる', async () => {
      // fetchをモック（エラーレスポンス）
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'トップページデータの取得に失敗しました' }),
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useTopPageData(), {
        wrapper: createProvider(),
      });

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('トップページデータの取得に失敗しました');
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      // fetchをモック（ネットワークエラー）
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      // フックをレンダリング
      const { result } = renderHook(() => useTopPageData(), {
        wrapper: createProvider(),
      });

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });
  });
});
