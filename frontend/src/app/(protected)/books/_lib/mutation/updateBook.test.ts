import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { BookUpdateData } from '@/app/(protected)/books/_types';
import { updateBook } from './updateBook';

describe('updateBook', () => {
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
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = '本の更新に失敗しました';
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateBook(mockBook)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateBook(mockBook)).rejects.toThrow(errorMessage);
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
