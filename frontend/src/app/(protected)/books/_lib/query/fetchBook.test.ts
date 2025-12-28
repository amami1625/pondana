import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockBook } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { fetchBook } from './fetchBook';
import { BOOKS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('fetchBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('書籍詳細データを正しく取得できる', async () => {
      const result = await fetchBook('1');

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テスト本');
      expect(result.authors).toHaveLength(1);
    });

    it('異なるIDで正しくリクエストできる', async () => {
      server.use(
        http.get('/api/books/:id', ({ params }) => {
          return HttpResponse.json(
            createMockBook({
              id: createTestUuid(Number(params.id)),
              title: '別の本',
            }),
          );
        }),
      );

      const result = await fetchBook('42');

      expect(result.id).toBe(createTestUuid(42));
      expect(result.title).toBe('別の本');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(fetchBook('1')).rejects.toThrow(BOOKS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchBook('1')).rejects.toThrow(BOOKS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/books/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchBook(createTestUuid(1))).rejects.toThrow(
        BOOKS_ERROR_MESSAGES.NETWORK_ERROR,
      );
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/books/:id', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(fetchBook(createTestUuid(1))).rejects.toThrow();
    });
  });
});
