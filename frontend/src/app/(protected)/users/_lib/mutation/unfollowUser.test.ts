import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { unfollowUser } from './unfollowUser';

describe('unfollowUser', () => {
  describe('成功時', () => {
    it('アンフォローリクエストが成功する', async () => {
      const result = await unfollowUser('1');

      expect(result).toHaveProperty('message');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'このユーザーをフォローしていません';
      server.use(
        http.delete('/api/users/:id/follow', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(unfollowUser('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/users/:id/follow', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(unfollowUser('1')).rejects.toThrow(errorMessage);
    });
  });
});
