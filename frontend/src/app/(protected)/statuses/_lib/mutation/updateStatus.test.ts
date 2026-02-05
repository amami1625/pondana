import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateStatus } from './updateStatus';

describe('updateStatus', () => {
  const mockStatusData = {
    id: 1,
    name: '更新後ステータス',
  };

  describe('成功時', () => {
    it('ステータスを更新できる', async () => {
      const result = await updateStatus(mockStatusData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('更新後ステータス');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'ステータスの更新に失敗しました';
      server.use(
        http.put('/api/statuses/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateStatus(mockStatusData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/statuses/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateStatus(mockStatusData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/statuses/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(updateStatus(mockStatusData)).rejects.toThrow();
    });
  });
});
