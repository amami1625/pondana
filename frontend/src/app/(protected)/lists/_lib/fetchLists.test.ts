import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockList } from '@/test/factories';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchLists } from './fetchLists';

describe('fetchLists', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('リストデータを正しく取得できる', async () => {
      const mockApiResponse = [
        createMockList({ id: 1, name: 'テストリストA' }),
        createMockList({ id: 2, name: 'テストリストB' }),
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchLists();

      expect(result).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: 1,
        name: 'テストリストA',
        description: 'テスト説明',
        user_id: 1,
        public: true,
        books_count: 0,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result[1]).toEqual({
        id: 2,
        name: 'テストリストB',
        description: 'テスト説明',
        user_id: 1,
        public: true,
        books_count: 0,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(fetch).toHaveBeenCalledWith('/api/lists');
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

      const result = await fetchLists();

      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/lists');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'リスト一覧の取得に失敗しました' }),
        }),
      );

      await expect(fetchLists()).rejects.toThrow('リスト一覧の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchLists()).rejects.toThrow('リスト一覧の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchLists()).rejects.toThrow('Network error');
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

      await expect(fetchLists()).rejects.toThrow();
    });
  });
});
