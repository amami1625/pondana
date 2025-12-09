import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockBook } from '@/test/factories';
import { toJapaneseLocaleString, createTestUuid } from '@/test/helpers';
import { fetchBooks } from './fetchBooks';

describe('fetchBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('書籍データを正しく取得できる', async () => {
      const mockApiResponse = [
        createMockBook({ id: createTestUuid(1), title: 'テスト本A' }),
        createMockBook({ id: createTestUuid(2), title: 'テスト本B', authors: ['テスト著者'] }),
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
        id: createTestUuid(1),
        title: 'テスト本A',
        description: 'テスト説明',
        user_id: 1,
        category: expect.any(Object),
        tags: expect.any(Array),
        rating: 5,
        reading_status: 'completed',
        public: true,
        created_at: expectedDate,
        updated_at: expectedDate,
        google_books_id: 'aaaaaaaaaa',
        isbn: '999999999',
        subtitle: null,
        thumbnail: null,
        authors: [],
      });

      expect(result[1]).toEqual({
        id: createTestUuid(2),
        title: 'テスト本B',
        description: 'テスト説明',
        user_id: 1,
        category: expect.any(Object),
        tags: expect.any(Array),
        rating: 5,
        reading_status: 'completed',
        public: true,
        created_at: expectedDate,
        updated_at: expectedDate,
        google_books_id: 'aaaaaaaaaa',
        isbn: '999999999',
        subtitle: null,
        thumbnail: null,
        authors: ['テスト著者'],
      });

      expect(fetch).toHaveBeenCalledWith('/api/books');
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
      expect(fetch).toHaveBeenCalledWith('/api/books');
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
