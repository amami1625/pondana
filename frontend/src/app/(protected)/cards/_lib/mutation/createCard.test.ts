import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { CardFormData } from '@/app/(protected)/cards/_types';
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
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カードの作成に失敗しました';
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(createCard(mockCard)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/books/:bookId/cards', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(createCard(mockCard)).rejects.toThrow(errorMessage);
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
