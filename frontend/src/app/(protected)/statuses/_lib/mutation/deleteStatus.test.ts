import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { deleteStatus } from './deleteStatus';

describe('deleteStatus', () => {
  describe('成功時', () => {
    it('ステータスを削除できる', async () => {
      await expect(deleteStatus(1)).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'ステータスの削除に失敗しました';
      server.use(
        http.delete('/api/statuses/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(deleteStatus(1)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/statuses/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(deleteStatus(1)).rejects.toThrow(errorMessage);
    });
  });
});
