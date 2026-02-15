import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchStatuses } from './fetchStatuses';

describe('fetchStatuses', () => {
  describe('成功時', () => {
    it('ステータス一覧を正しく取得できる', async () => {
      const result = await fetchStatuses();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('テストステータスA');
      expect(result[1].name).toBe('テストステータスB');
    });

    it('データが存在しない場合、空配列を取得する', async () => {
      server.use(
        http.get('/api/statuses', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await fetchStatuses();

      expect(result).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'ステータスの取得に失敗しました';
      server.use(
        http.get('/api/statuses', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchStatuses()).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/statuses', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchStatuses()).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/statuses', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchStatuses()).rejects.toThrow();
    });
  });
});
