import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { addListBook } from './addListBook';
import { createTestUuid } from '@/test/helpers';
import { createMockListBook } from '@/test/factories';

describe('addListBook', () => {
  const listId = createTestUuid(1);
  const bookId = createTestUuid(2);

  describe('成功時', () => {
    it('リストに本を追加できる', async () => {
      const mockListBook = createMockListBook({ list_id: listId, book_id: bookId });

      server.use(
        http.post('/api/list_books', async () => {
          return HttpResponse.json(mockListBook, { status: 201 });
        }),
      );

      const result = await addListBook({ list_id: listId, book_id: bookId });

      expect(result).toEqual(mockListBook);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'リストへの本の追加に失敗しました';
      server.use(
        http.post('/api/list_books', async () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/list_books', async () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/list_books', async () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(addListBook({ list_id: listId, book_id: bookId })).rejects.toThrow();
    });
  });
});
