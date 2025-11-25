import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockAuthor } from '@/test/factories';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchAuthors } from './fetchAuthors';

describe('fetchAuthors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('著者データを正しく取得できる', async () => {
      const mockApiResponse = [
        createMockAuthor({ id: 1, name: 'テスト著者A' }),
        createMockAuthor({ id: 2, name: 'テスト著者B' }),
      ];

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchAuthors();

      expect(result).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: 1,
        name: 'テスト著者A',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result[1]).toEqual({
        id: 2,
        name: 'テスト著者B',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(fetch).toHaveBeenCalledWith('/api/authors');
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

      const result = await fetchAuthors();

      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith('/api/authors');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: '著者一覧の取得に失敗しました' }),
        }),
      );

      await expect(fetchAuthors()).rejects.toThrow('著者一覧の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchAuthors()).rejects.toThrow('著者一覧の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchAuthors()).rejects.toThrow('Network error');
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

      await expect(fetchAuthors()).rejects.toThrow();
    });
  });
});
