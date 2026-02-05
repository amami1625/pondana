import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { deleteCard } from './deleteCard';

describe('deleteCard', () => {
  const bookId = createTestUuid(1);
  const cardId = createTestUuid(2);

  describe('成功時', () => {
    it('カードを削除できる', async () => {
      await expect(deleteCard({ bookId, cardId })).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カードの削除に失敗しました';
      server.use(
        http.delete('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(deleteCard({ bookId, cardId })).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(deleteCard({ bookId, cardId })).rejects.toThrow(errorMessage);
    });
  });
});
