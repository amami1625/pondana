import { describe, it, expect, vi } from 'vitest';
import { createMockUserWithStats } from '@/test/factories';
import { fetchUser } from './fetchUser';

describe('fetchUser', () => {
  describe('成功時', () => {
    it('ユーザー情報と統計を正しく取得できる', async () => {
      const mockApiResponse = createMockUserWithStats({
        id: 1,
        name: 'テストユーザー',
        stats: {
          public_books: 10,
          public_lists: 5,
          following_count: 3,
          followers_count: 7,
        },
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchUser('1');

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストユーザー');
      expect(result.stats.public_books).toBe(10);
      expect(result.stats.public_lists).toBe(5);

      expect(fetch).toHaveBeenCalledWith('/api/users/1');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = createMockUserWithStats({ id: 42, name: '別のユーザー' });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchUser('42');

      expect(result.id).toBe(42);
      expect(result.name).toBe('別のユーザー');
      expect(fetch).toHaveBeenCalledWith('/api/users/42');
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({
            code: 'NOT_FOUND',
            error: 'ユーザー情報の取得に失敗しました',
          }),
        }),
      );

      await expect(fetchUser('1')).rejects.toThrow('ユーザー情報の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchUser('1')).rejects.toThrow('エラーが発生しました。もう一度お試しください');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchUser('1')).rejects.toThrow('Network error');
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

      await expect(fetchUser('1')).rejects.toThrow();
    });

    it('statsが欠落している場合、Zodエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            id: 1,
            supabase_uid: '1',
            name: 'テストユーザー',
            avatar_url: null,
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
          }),
        }),
      );

      await expect(fetchUser('1')).rejects.toThrow();
    });
  });
});
