import { describe, it, expect } from 'vitest';
import { createTestUuid } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { ZodError } from 'zod';
import { fetchBook } from './fetchBook';

describe('fetchBook', () => {
  describe('成功時', () => {
    it('書籍詳細データを正しく取得できる', async () => {
      const result = await fetchBook('1');

      expect(result.id).toBe(createTestUuid(1));
      expect(result.title).toBe('テスト本');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = '本の取得に失敗しました';
      server.use(
        http.get('/api/books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(fetchBook('1')).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.get('/api/books/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(fetchBook('1')).rejects.toThrow(errorMessage);
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

      await expect(fetchBook(createTestUuid(1))).rejects.toThrow(ZodError);
    });
  });
});
