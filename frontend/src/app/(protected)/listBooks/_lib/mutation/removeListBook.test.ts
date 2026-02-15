import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { removeListBook } from './removeListBook';

describe('removeListBook', () => {
  describe('成功時', () => {
    it('リストから本を削除できる', async () => {
      server.use(
        http.delete('/api/list_books/:id', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      await expect(removeListBook({ id: 1 })).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'リストからの本の削除に失敗しました';
      server.use(
        http.delete('/api/list_books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(removeListBook({ id: 1 })).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/list_books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(removeListBook({ id: 1 })).rejects.toThrow(errorMessage);
    });
  });
});
