import { describe, it, expect } from 'vitest';
import { createTestUuid } from '@/test/helpers';
import { fetchCard } from './fetchCard';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

describe('fetchCard', () => {
  describe('成功時', () => {
    it('カード詳細データを正しく取得できる', async () => {
      const result = await fetchCard('1');

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テストカード');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カードの取得に失敗しました';
      server.use(
        http.get('/api/cards/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchCard(createTestUuid(1))).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/cards/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchCard(createTestUuid(1))).rejects.toThrow(errorMessage);
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
