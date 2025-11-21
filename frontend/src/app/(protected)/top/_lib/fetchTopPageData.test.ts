import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createMockBook,
  createMockList,
  createMockCard,
  createMockTopPageData,
} from '@/test/factories';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchTopPageData } from './fetchTopPageData';

describe('fetchTopPageData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('トップページデータを正しく取得できる', async () => {
      const mockApiResponse = createMockTopPageData({
        recent_books: [createMockBook({ id: 1, title: 'テスト本' })],
        recent_lists: [createMockList({ id: 1, name: 'テストリスト' })],
        recent_cards: [
          {
            ...createMockCard({ id: 1 }),
            book: { title: 'テスト本' },
          },
        ],
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchTopPageData();

      expect(result).toHaveProperty('recent_books');
      expect(result).toHaveProperty('recent_lists');
      expect(result).toHaveProperty('recent_cards');
      expect(result.recent_books).toHaveLength(1);
      expect(result.recent_lists).toHaveLength(1);
      expect(result.recent_cards).toHaveLength(1);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result.recent_books[0]).toEqual({
        id: 1,
        title: 'テスト本',
        description: 'テスト説明',
        user_id: 1,
        category_id: 1,
        rating: 5,
        reading_status: 'completed',
        public: true,
        created_at: expectedDate,
        updated_at: expectedDate,
        authors: expect.any(Array),
      });

      expect(fetch).toHaveBeenCalledWith('/api/top', { cache: 'default' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('データが存在しない場合、空配列を返す', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockTopPageData(),
        }),
      );

      const result = await fetchTopPageData();

      expect(result.recent_books).toEqual([]);
      expect(result.recent_lists).toEqual([]);
      expect(result.recent_cards).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/top', { cache: 'default' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'トップページデータの取得に失敗しました' }),
        }),
      );

      await expect(fetchTopPageData()).rejects.toThrow('トップページデータの取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchTopPageData()).rejects.toThrow('トップページデータの取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchTopPageData()).rejects.toThrow('Network error');
    });
  });

  describe('環境による分岐', () => {
    it('クライアント側では相対URLを使用する', async () => {
      vi.stubGlobal('window', {});

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockTopPageData(),
        }),
      );

      await fetchTopPageData();

      expect(fetch).toHaveBeenCalledWith('/api/top', { cache: 'default' });
    });

    it('サーバー側では絶対URLを使用する', async () => {
      vi.stubGlobal('window', undefined);
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockTopPageData(),
        }),
      );

      await fetchTopPageData();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/top', { cache: 'no-store' });

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

      await expect(fetchTopPageData()).rejects.toThrow();
    });
  });
});
