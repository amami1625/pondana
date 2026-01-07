import { describe, it, expect } from 'vitest';
import { toJapaneseLocaleString, createTestUuid } from '@/test/helpers';
import { fetchBooks } from './fetchBooks';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { BOOKS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { ZodError } from 'zod';

describe('fetchBooks', () => {
  describe('成功時', () => {
    it('書籍データを正しく取得できる', async () => {
      const result = await fetchBooks();

      expect(result).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: createTestUuid(1),
        title: 'テスト本A',
        description: 'テスト説明',
        user_id: 1,
        category: expect.any(Object),
        tags: expect.any(Array),
        rating: 5,
        reading_status: 'completed',
        public: true,
        created_at: expectedDate,
        updated_at: expectedDate,
        google_books_id: 'aaaaaaaaaa',
        isbn: '999999999',
        subtitle: null,
        thumbnail: null,
        authors: ['テスト著者A'],
      });

      expect(result[1]).toEqual({
        id: createTestUuid(2),
        title: 'テスト本B',
        description: 'テスト説明',
        user_id: 1,
        category: expect.any(Object),
        tags: expect.any(Array),
        rating: 5,
        reading_status: 'completed',
        public: true,
        created_at: expectedDate,
        updated_at: expectedDate,
        google_books_id: 'aaaaaaaaaa',
        isbn: '999999999',
        subtitle: null,
        thumbnail: null,
        authors: ['テスト著者B'],
      });
    });

    it('データが存在しない場合、空配列を返す', async () => {
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await fetchBooks();

      expect(result).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(fetchBooks()).rejects.toThrow(BOOKS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchBooks()).rejects.toThrow(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchBooks()).rejects.toThrow(BOOKS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(fetchBooks()).rejects.toThrow(ZodError);
    });
  });
});
