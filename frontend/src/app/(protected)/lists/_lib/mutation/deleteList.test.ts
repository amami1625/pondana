import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { deleteList } from './deleteList';

describe('deleteList', () => {
  describe('成功時', () => {
    it('リストを削除できる', async () => {
      await expect(deleteList(createTestUuid(1))).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'リストの削除に失敗しました';
      server.use(
        http.delete('/api/lists/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(deleteList(createTestUuid(1))).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/lists/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(deleteList(createTestUuid(1))).rejects.toThrow(errorMessage);
    });
  });
});
