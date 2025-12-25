import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { BookUpdateData } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { updateBook } from './updateBook';

describe('updateBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBook: BookUpdateData = {
    id: createTestUuid(1),
    reading_status: 'unread',
    public: false,
  };

  describe('成功時', () => {
    it('書籍データを更新できる', async () => {
      const result = await updateBook(mockBook);

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テスト本');
      expect(result.authors).toHaveLength(1);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(updateBook(mockBook)).rejects.toThrow(BOOKS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(updateBook(mockBook)).rejects.toThrow(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(updateBook(mockBook)).rejects.toThrow(BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(updateBook(mockBook)).rejects.toThrow();
    });
  });
});
