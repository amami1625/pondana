import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { updateCard } from './updateCard';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('updateCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCard = {
    book_id: createTestUuid(1),
    title: 'テストカード',
    content: 'テスト詳細',
    id: createTestUuid(2),
  };

  describe('成功時', () => {
    it('カードを更新できる', async () => {
      const result = await updateCard(mockCard);

      expect(result.id).toBe(createTestUuid(2));
      expect(result.title).toBe('テストカード');
      expect(result.content).toBe('テスト詳細');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(updateCard(mockCard)).rejects.toThrow(CARDS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(updateCard(mockCard)).rejects.toThrow(CARDS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.error();
        }),
      );

      await expect(updateCard(mockCard)).rejects.toThrow(CARDS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(updateCard(mockCard)).rejects.toThrow();
    });
  });
});
