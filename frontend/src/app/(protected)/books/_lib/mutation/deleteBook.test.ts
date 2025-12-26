import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { deleteBook } from './deleteBook';

describe('deleteBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const bookId = createTestUuid(1);

  describe('成功時', () => {
    it('書籍データを削除できる', async () => {
      await expect(deleteBook({ id: bookId })).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(deleteBook({ id: bookId })).rejects.toThrow(BOOKS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(deleteBook({ id: bookId })).rejects.toThrow(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/books/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(deleteBook({ id: bookId })).rejects.toThrow(BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });
});
