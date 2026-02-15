import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchUser } from './fetchUser';

describe('fetchUser', () => {
  describe('成功時', () => {
    it('ユーザー情報と統計を正しく取得できる', async () => {
      const result = await fetchUser('1');

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('stats');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'ユーザー情報の取得に失敗しました';
      server.use(
        http.get('/api/users/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchUser('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/users/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchUser('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/users/:id', () => {
          return HttpResponse.json({ invalid: 'data' });
        }),
      );

      await expect(fetchUser('1')).rejects.toThrow();
    });
  });
});
