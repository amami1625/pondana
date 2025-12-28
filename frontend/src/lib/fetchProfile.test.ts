import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockUser } from '@/test/factories';
import { fetchProfile } from './fetchProfile';

describe('fetchProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('プロフィールデータを正しく取得できる', async () => {
      const mockApiResponse = createMockUser();

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchProfile();

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストユーザー');
      expect(result.supabase_uid).toBe('1');

      expect(fetch).toHaveBeenCalledWith('/api/profiles');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('avatar_urlがnullでも正しく取得できる', async () => {
      const mockApiResponse = createMockUser({ avatar_url: null });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchProfile();

      expect(result.avatar_url).toBeNull();
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ code: 'NOT_FOUND', error: 'プロフィール情報の取得に失敗しました' }),
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('プロフィール情報の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({}),
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('エラーが発生しました。もう一度お試しください');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Network error')));

      await expect(fetchProfile()).rejects.toThrow('ネットワークエラーが発生しました');
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

      await expect(fetchProfile()).rejects.toThrow();
    });
  });
});
