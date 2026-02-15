import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createStatus } from './createStatus';

describe('createStatus', () => {
  const mockStatusData = {
    name: 'テストステータス',
  };

  describe('成功時', () => {
    it('ステータスを作成できる', async () => {
      const result = await createStatus(mockStatusData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストステータス');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'ステータスの作成に失敗しました';
      server.use(
        http.post('/api/statuses', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(createStatus(mockStatusData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/statuses', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(createStatus(mockStatusData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/statuses', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(createStatus(mockStatusData)).rejects.toThrow();
    });
  });
});
