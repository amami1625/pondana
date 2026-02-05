import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchFollowing } from './fetchFollowing';

describe('fetchFollowing', () => {
  describe('成功時', () => {
    it('フォロー中のユーザーを取得できる', async () => {
      const result = await fetchFollowing('1');

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'フォロー中一覧の取得に失敗しました';
      server.use(
        http.get('/api/users/:id/following', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchFollowing('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/users/:id/following', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchFollowing('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/users/:id/following', () => {
          return HttpResponse.json([{ invalid: 'data' }]);
        }),
      );

      await expect(fetchFollowing('1')).rejects.toThrow();
    });
  });
});
