import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchTags } from './fetchTags';

describe('fetchTags', () => {
  describe('成功時', () => {
    it('タグ一覧を正しく取得できる', async () => {
      const result = await fetchTags();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('テストタグA');
      expect(result[1].name).toBe('テストタグB');
    });

    it('データが存在しない場合、空配列を取得する', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await fetchTags();

      expect(result).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'タグの取得に失敗しました';
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchTags()).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchTags()).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchTags()).rejects.toThrow();
    });
  });
});
