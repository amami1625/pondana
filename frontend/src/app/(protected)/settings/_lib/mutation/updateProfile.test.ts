import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateProfile } from './updateProfile';

describe('updateProfile', () => {
  const mockProfileData = {
    name: '更新後ユーザー',
    avatar_url: 'https://example.com/avatar.png',
  };

  describe('成功時', () => {
    it('プロフィールを更新できる', async () => {
      const result = await updateProfile(mockProfileData);

      expect(result.name).toBe('更新後ユーザー');
      expect(result.avatar_url).toBe('https://example.com/avatar.png');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'プロフィールの更新に失敗しました';
      server.use(
        http.put('/api/profiles', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateProfile(mockProfileData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/profiles', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateProfile(mockProfileData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/profiles', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(updateProfile(mockProfileData)).rejects.toThrow();
    });
  });
});
