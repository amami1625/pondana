import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { ZodError } from 'zod';
import { createTestUuid } from '@/test/helpers';
import { fetchList } from './fetchList';

describe('fetchList', () => {
  describe('成功時', () => {
    it('リスト詳細データを正しく取得できる', async () => {
      const result = await fetchList('1');

      expect(result.id).toBe(createTestUuid(1));
      expect(result.name).toBe('テストリスト');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'リストの取得に失敗しました';
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchList('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchList('1')).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/lists/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchList('1')).rejects.toThrow(ZodError);
    });
  });
});
