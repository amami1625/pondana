import { describe, it, expect, vi } from 'vitest';
import { createTestUuid } from '@/test/helpers';
import { fetchUserLists } from './fetchUserLists';

describe('fetchUserLists', () => {
  describe('成功時', () => {
    it('ユーザーの公開リスト一覧を正しく取得できる', async () => {
      const mockApiResponse = [
        {
          id: createTestUuid(1),
          name: 'テストリスト1',
          description: 'テスト説明1',
          user_id: 1,
          public: true,
          books_count: 3,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
        {
          id: createTestUuid(2),
          name: 'テストリスト2',
          description: 'テスト説明2',
          user_id: 1,
          public: true,
          books_count: 5,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchUserLists('1');

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('テストリスト1');
      expect(result[1].name).toBe('テストリスト2');

      expect(fetch).toHaveBeenCalledWith('/api/users/1/lists');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('空配列が返ってきた場合、空配列を返す', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [],
        }),
      );

      const result = await fetchUserLists('1');

      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/users/1/lists');
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = [
        {
          id: createTestUuid(1),
          name: 'テストリスト',
          description: 'テスト説明',
          user_id: 42,
          public: true,
          books_count: 0,
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
        },
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchUserLists('42');

      expect(result).toHaveLength(1);
      expect(fetch).toHaveBeenCalledWith('/api/users/42/lists');
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({
            code: 'FETCH_USER_LISTS_FAILED',
            error: 'ユーザーの公開リスト一覧の取得に失敗しました',
          }),
        }),
      );

      await expect(fetchUserLists('1')).rejects.toThrow(
        'ユーザーの公開リスト一覧の取得に失敗しました',
      );
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchUserLists('1')).rejects.toThrow(
        'エラーが発生しました。もう一度お試しください',
      );
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchUserLists('1')).rejects.toThrow('Network error');
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

      await expect(fetchUserLists('1')).rejects.toThrow();
    });
  });
});
