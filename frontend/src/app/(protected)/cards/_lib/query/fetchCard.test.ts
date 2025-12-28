import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockCard } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { fetchCard } from './fetchCard';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { CARDS_ERROR_MESSAGES } from '@/constants/errorMessages';

describe('fetchCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('カード詳細データを正しく取得できる', async () => {
      const result = await fetchCard('1');

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テストカード');
    });

    it('異なるIDで正しくリクエストできる', async () => {
      server.use(
        http.get('/api/cards/:id', ({ params }) => {
          const { id } = params;
          return HttpResponse.json(
            createMockCard({ id: createTestUuid(Number(id)), title: '別のカード' }),
          );
        }),
      );

      const result = await fetchCard('42');

      expect(result.id).toBe(createTestUuid(42));
      expect(result.title).toBe('別のカード');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/cards/:id', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(fetchCard(createTestUuid(1))).rejects.toThrow(CARDS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/cards/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchCard(createTestUuid(1))).rejects.toThrow(
        CARDS_ERROR_MESSAGES.UNKNOWN_ERROR,
      );
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.get('/api/cards/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchCard(createTestUuid(1))).rejects.toThrow(
        CARDS_ERROR_MESSAGES.NETWORK_ERROR,
      );
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/cards/:id', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(fetchCard(createTestUuid(1))).rejects.toThrow();
    });
  });
});
