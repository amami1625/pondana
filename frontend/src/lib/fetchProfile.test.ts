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

      expect(fetch).toHaveBeenCalledWith('/api/profiles', { cache: 'default' });
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
          json: async () => ({ error: 'プロフィール情報の取得に失敗しました' }),
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('プロフィール情報の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchProfile()).rejects.toThrow('プロフィール情報の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchProfile()).rejects.toThrow('Network error');
    });
  });

  describe('環境による分岐', () => {
    it('クライアント側では相対URLを使用する', async () => {
      vi.stubGlobal('window', {});

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockUser(),
        }),
      );

      await fetchProfile();

      expect(fetch).toHaveBeenCalledWith('/api/profiles', { cache: 'default' });
    });

    it('サーバー側では絶対URLを使用する', async () => {
      vi.stubGlobal('window', undefined);
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockUser(),
        }),
      );

      await fetchProfile();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/profiles', {
        cache: 'no-store',
      });

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

      await expect(fetchProfile()).rejects.toThrow();
    });
  });
});
