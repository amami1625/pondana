import { describe, it, expect } from 'vitest';
import { toJapaneseLocaleString, createTestUuid } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { fetchCards } from './fetchCards';

describe('fetchCards', () => {
  describe('成功時', () => {
    it('カードリストデータを正しく取得できる', async () => {
      const result = await fetchCards();

      expect(result).toHaveProperty('books');
      expect(result.books).toHaveLength(2);

      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result.books[0]).toEqual({
        book: { id: createTestUuid(1), title: 'テスト本A' },
        cards: [
          {
            id: createTestUuid(1),
            title: 'テストカード',
            content: 'テスト本文',
            book_id: createTestUuid(1),
            created_at: expectedDate,
            updated_at: expectedDate,
          },
        ],
      });

      expect(result.books[1]).toEqual({
        book: { id: createTestUuid(2), title: 'テスト本B' },
        cards: [],
      });
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
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(fetchCards()).rejects.toThrow(CARDS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchCards()).rejects.toThrow(CARDS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/cards', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchCards()).rejects.toThrow(CARDS_ERROR_MESSAGES.NETWORK_ERROR);
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
