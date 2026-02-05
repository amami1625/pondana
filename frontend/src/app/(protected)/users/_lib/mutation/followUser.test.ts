import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { followUser } from './followUser';

describe('followUser', () => {
  describe('成功時', () => {
    it('フォローリクエストが成功する', async () => {
      const result = await followUser('1');

      expect(result).toHaveProperty('message');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = '自分自身をフォローすることはできません';
      server.use(
        http.post('/api/users/:id/follow', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 422 });
        }),
      );

      await expect(followUser('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/users/:id/follow', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(followUser('1')).rejects.toThrow(errorMessage);
    });
  });
});
