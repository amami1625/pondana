import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { deleteBook } from './deleteBook';

describe('deleteBook', () => {
  const bookId = createTestUuid(1);

  describe('成功時', () => {
    it('書籍データを削除できる', async () => {
      await expect(deleteBook({ id: bookId })).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = '本の削除に失敗しました';
      server.use(
        http.delete('/api/books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(deleteBook({ id: bookId })).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(deleteBook({ id: bookId })).rejects.toThrow(errorMessage);
    });
  });
});
