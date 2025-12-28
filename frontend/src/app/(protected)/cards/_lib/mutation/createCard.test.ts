import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { CardFormData } from '@/app/(protected)/cards/_types';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { createCard } from './createCard';

describe('createCard', () => {
  const mockCard: CardFormData = {
    book_id: createTestUuid(1),
    title: 'テストカード',
    content: 'テスト詳細',
  };

  describe('成功時', () => {
    it('カードを作成できる', async () => {
      const result = await createCard(mockCard);

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テストカード');
      expect(result.content).toBe('テスト詳細');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(createCard(mockCard)).rejects.toThrow(CARDS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(createCard(mockCard)).rejects.toThrow(CARDS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.error();
        }),
      );

      await expect(createCard(mockCard)).rejects.toThrow(CARDS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(createCard(mockCard)).rejects.toThrow();
    });
  });
});
