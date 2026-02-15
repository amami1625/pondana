import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createMockUser } from '@/test/factories';
import { fetchProfile } from './fetchProfile';

describe('fetchProfile', () => {
  describe('成功時', () => {
    it('プロフィールデータを正しく取得できる', async () => {
      const result = await fetchProfile();

      expect(result.name).toBe('テストユーザー');
    });

    it('avatar_urlがnullでも正しく取得できる', async () => {
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json(createMockUser({ avatar_url: null }));
        }),
      );

      const result = await fetchProfile();

      expect(result.avatar_url).toBeNull();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'プロフィール情報の取得に失敗しました';
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchProfile()).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchProfile()).rejects.toThrow(errorMessage);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/profiles', () => {
          return HttpResponse.json({ invalid: 'data' });
        }),
      );

      await expect(fetchProfile()).rejects.toThrow();
    });
  });
});
