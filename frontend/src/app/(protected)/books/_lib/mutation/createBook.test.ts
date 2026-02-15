import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { BookCreateData } from '@/app/(protected)/books/_types';
import { createBook } from './createBook';

describe('createBook', () => {
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
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = '本の作成に失敗しました';
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(createBook(mockBook)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(createBook(mockBook)).rejects.toThrow(errorMessage);
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
