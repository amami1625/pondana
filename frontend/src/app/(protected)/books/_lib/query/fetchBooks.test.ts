import { describe, it, expect } from 'vitest';
import { toJapaneseLocaleString, createTestUuid } from '@/test/helpers';
import { fetchBooks } from './fetchBooks';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
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
        user_id: '550e8400-e29b-41d4-a716-446655440000',
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
        user_id: '550e8400-e29b-41d4-a716-446655440000',
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
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = '本の取得に失敗しました';
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchBooks()).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/books', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchBooks()).rejects.toThrow(errorMessage);
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
