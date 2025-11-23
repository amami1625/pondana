import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockCard } from '@/test/factories';
import { fetchCards } from './fetchCards';
import { toJapaneseLocaleString } from '@/test/helpers';

describe('fetchCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('カードリストデータを正しく取得できる', async () => {
      const mockApiResponse = {
        books: [
          {
            book: { id: 1, title: 'テスト本A' },
            cards: [createMockCard({ id: 1, book_id: 1 })],
          },
          {
            book: { id: 2, title: 'テスト本B' },
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
        book: { id: 1, title: 'テスト本A' },
        cards: [
          {
            id: 1,
            title: 'テストカード',
            content: 'テスト本文',
            book_id: 1,
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
      });

      expect(result.books[1]).toEqual({
        book: { id: 2, title: 'テスト本B' },
        cards: [],
      });

      expect(fetch).toHaveBeenCalledWith('/api/cards', { cache: 'default' });
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
      expect(fetch).toHaveBeenCalledWith('/api/cards', { cache: 'default' });
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

  describe('環境による分岐', () => {
    it('クライアント側では相対URLを使用する', async () => {
      vi.stubGlobal('window', {});

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ books: [] }),
        }),
      );

      await fetchCards();

      expect(fetch).toHaveBeenCalledWith('/api/cards', { cache: 'default' });
    });

    it('サーバー側では絶対URLを使用する', async () => {
      vi.stubGlobal('window', undefined);
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ books: [] }),
        }),
      );

      await fetchCards();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/cards', { cache: 'no-store' });

      delete process.env.NEXT_PUBLIC_API_URL;
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
