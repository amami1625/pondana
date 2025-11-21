import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockAuthor, createMockBook } from '@/test/factories';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchBooks } from './fetchBooks';

describe('fetchBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('書籍データを正しく取得できる', async () => {
      const mockApiResponse = [
        createMockBook({ id: 1, title: 'テスト本A', authors: [createMockAuthor()] }),
        createMockBook({ id: 2, title: 'テスト本B', authors: [createMockAuthor()] }),
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchBooks();

      expect(result).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
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
            name: 'テスト著者',
            user_id: 1,
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
      });

      expect(result[1]).toEqual({
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
            name: 'テスト著者',
            user_id: 1,
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
      });

      expect(fetch).toHaveBeenCalledWith('/api/books', { cache: 'default' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('データが存在しない場合、空配列を返す', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [],
        }),
      );

      const result = await fetchBooks();

      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/books', { cache: 'default' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: '書籍一覧の取得に失敗しました' }),
        }),
      );

      await expect(fetchBooks()).rejects.toThrow('書籍一覧の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchBooks()).rejects.toThrow('書籍一覧の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchBooks()).rejects.toThrow('Network error');
    });
  });

  describe('環境による分岐', () => {
    it('クライアント側では相対URLを使用する', async () => {
      // windowが存在する場合（クライアント側）
      vi.stubGlobal('window', {});

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [],
        }),
      );

      await fetchBooks();

      expect(fetch).toHaveBeenCalledWith('/api/books', { cache: 'default' });
    });

    it('サーバー側では絶対URLを使用する', async () => {
      // windowが存在しない場合（サーバー側）
      vi.stubGlobal('window', undefined);
      // 環境変数を設定
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [],
        }),
      );

      await fetchBooks();

      // サーバー側ではno-storeキャッシュを使用
      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/books', { cache: 'no-store' });

      // クリーンアップ
      delete process.env.NEXT_PUBLIC_API_URL;
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [{ invalid: 'data' }],
        }),
      );

      await expect(fetchBooks()).rejects.toThrow();
    });
  });
});
