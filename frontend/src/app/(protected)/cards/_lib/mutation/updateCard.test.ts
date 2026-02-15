import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { updateCard } from './updateCard';

describe('updateCard', () => {
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
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カードの更新に失敗しました';
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateCard(mockCard)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/books/:bookId/cards/:cardId', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateCard(mockCard)).rejects.toThrow(errorMessage);
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
