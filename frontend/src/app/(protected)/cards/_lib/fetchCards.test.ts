import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockCard } from '@/test/factories';
import { fetchCards } from './fetchCards';
import { toJapaneseLocaleString, createTestUuid } from '@/test/helpers';

describe('fetchCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('カードリストデータを正しく取得できる', async () => {
      const mockApiResponse = {
        books: [
          {
            book: { id: createTestUuid(1), title: 'テスト本A' },
            cards: [createMockCard({ id: createTestUuid(1), book_id: createTestUuid(1) })],
          },
          {
            book: { id: createTestUuid(2), title: 'テスト本B' },
            cards: [],
          },
        ],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchCards();

      expect(result).toHaveProperty('books');
      expect(result.books).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result.books[0]).toEqual({
        book: { id: createTestUuid(1), title: 'テスト本A' },
        cards: [
          {
            id: createTestUuid(1),
            title: 'テストカード',
            content: 'テスト本文',
            book_id: createTestUuid(1),
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
      });

      expect(result.books[1]).toEqual({
        book: { id: createTestUuid(2), title: 'テスト本B' },
        cards: [],
      });

      expect(fetch).toHaveBeenCalledWith('/api/cards');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('データが存在しない場合、空配列を返す', async () => {
      const emptyResponse = {
        books: [],
      };

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => emptyResponse,
        }),
      );

      const result = await fetchCards();

      expect(result.books).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/cards');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'カード一覧の取得に失敗しました' }),
        }),
      );

      await expect(fetchCards()).rejects.toThrow('カード一覧の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchCards()).rejects.toThrow('カード一覧の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchCards()).rejects.toThrow('Network error');
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ invalid: 'data' }),
        }),
      );

      await expect(fetchCards()).rejects.toThrow();
    });
  });
});
