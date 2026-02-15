import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchTopPageData } from './fetchTopPageData';

describe('fetchTopPageData', () => {
  describe('成功時', () => {
    it('トップページデータを正しく取得できる', async () => {
      const result = await fetchTopPageData();

      expect(result).toHaveProperty('recent_books');
      expect(result).toHaveProperty('recent_lists');
      expect(result).toHaveProperty('recent_cards');
      expect(result.recent_books).toHaveLength(2);
      expect(result.recent_lists).toHaveLength(2);
      expect(result.recent_cards).toHaveLength(2);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'トップページデータの取得に失敗しました';
      server.use(
        http.get('/api/top', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchTopPageData()).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/top', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchTopPageData()).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/top', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchTopPageData()).rejects.toThrow();
    });
  });
});
