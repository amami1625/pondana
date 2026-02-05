import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchFollowStatus } from './fetchFollowStatus';

describe('fetchFollowStatus', () => {
  describe('成功時', () => {
    it('フォローの状態を取得できる', async () => {
      const result = await fetchFollowStatus('1');

      expect(result).toHaveProperty('is_following');
      expect(result).toHaveProperty('is_followed_by');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'フォロー状態の取得に失敗しました';
      server.use(
        http.get('/api/users/:id/follow-status', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchFollowStatus('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/users/:id/follow-status', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchFollowStatus('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/users/:id/follow-status', () => {
          return HttpResponse.json({ invalid: 'data' });
        }),
      );

      await expect(fetchFollowStatus('1')).rejects.toThrow();
    });
  });
});
