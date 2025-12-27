import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockBook } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { fetchUserBooks } from './fetchUserBooks';

describe('fetchUserBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('ユーザーの公開本一覧を正しく取得できる', async () => {
      const mockApiResponse = [
        createMockBook({
          id: createTestUuid(1),
          title: 'テスト本1',
          public: true,
        }),
        createMockBook({
          id: createTestUuid(2),
          title: 'テスト本2',
          public: true,
        }),
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchUserBooks('1');

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('テスト本1');
      expect(result[1].title).toBe('テスト本2');

      expect(fetch).toHaveBeenCalledWith('/api/users/1/books');
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

      const result = await fetchUserBooks('1');

      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/users/1/books');
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = [createMockBook({ id: createTestUuid(1) })];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchUserBooks('42');

      expect(result).toHaveLength(1);
      expect(fetch).toHaveBeenCalledWith('/api/users/42/books');
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({
            code: 'FETCH_USER_BOOKS_FAILED',
            error: 'ユーザーの公開本一覧の取得に失敗しました',
          }),
        }),
      );

      await expect(fetchUserBooks('1')).rejects.toThrow('ユーザーの公開本一覧の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchUserBooks('1')).rejects.toThrow(
        'エラーが発生しました。もう一度お試しください',
      );
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchUserBooks('1')).rejects.toThrow('Network error');
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

      await expect(fetchUserBooks('1')).rejects.toThrow();
    });
  });
});
