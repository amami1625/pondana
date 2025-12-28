import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { deleteCard } from './deleteCard';

describe('deleteCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const bookId = createTestUuid(1);
  const cardId = createTestUuid(2);

  describe('成功時', () => {
    it('カードを削除できる', async () => {
      await expect(deleteCard({ bookId, cardId })).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(deleteCard({ bookId, cardId })).rejects.toThrow(CARDS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(deleteCard({ bookId, cardId })).rejects.toThrow(
        CARDS_ERROR_MESSAGES.UNKNOWN_ERROR,
      );
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.error();
        }),
      );

      await expect(deleteCard({ bookId, cardId })).rejects.toThrow(
        CARDS_ERROR_MESSAGES.NETWORK_ERROR,
      );
    });
  });
});
