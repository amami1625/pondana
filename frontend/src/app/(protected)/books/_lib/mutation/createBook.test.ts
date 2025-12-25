import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { BookCreateData } from '@/app/(protected)/books/_types';
import { BOOKS_ERROR_MESSAGES } from '../constants/errorMessages';
import { createBook } from './createBook';

describe('createBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockBook: BookCreateData = {
    title: 'テスト本',
    reading_status: 'unread',
    public: false,
    google_books_id: 'aaaaaaaaaa',
    isbn: '999999999',
    authors: ['テスト著者'],
  };

  describe('成功時', () => {
    it('書籍データを作成できる', async () => {
      const result = await createBook(mockBook);

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テスト本');
      expect(result.authors).toHaveLength(1);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(createBook(mockBook)).rejects.toThrow(BOOKS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(createBook(mockBook)).rejects.toThrow(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.error();
        }),
      );

      await expect(createBook(mockBook)).rejects.toThrow(BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(createBook(mockBook)).rejects.toThrow();
    });
  });
});
