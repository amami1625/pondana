import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { ZodError } from 'zod';
import { fetchBooks } from './fetchBooks';

describe('fetchBooks', () => {
  describe('成功時', () => {
    it('書籍データを正しく取得できる', async () => {
      const result = await fetchBooks();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('テスト本A');
      expect(result[1].title).toBe('テスト本B');
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
