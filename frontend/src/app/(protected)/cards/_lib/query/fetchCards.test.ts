import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchCards } from './fetchCards';

describe('fetchCards', () => {
  describe('成功時', () => {
    it('カードリストデータを正しく取得できる', async () => {
      const result = await fetchCards();

      expect(result).toHaveProperty('books');
      expect(result.books).toHaveLength(2);
      expect(result.books[0].book.title).toBe('テスト本A');
      expect(result.books[1].book.title).toBe('テスト本B');
    });

    it('データが存在しない場合、空配列を返す', async () => {
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.json({ books: [] });
        }),
      );

      const result = await fetchCards();

      expect(result.books).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カードの取得に失敗しました';
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchCards()).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchCards()).rejects.toThrow(errorMessage);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.json({ invalid: 'data' });
        }),
      );

      await expect(fetchCards()).rejects.toThrow();
    });
  });
});
