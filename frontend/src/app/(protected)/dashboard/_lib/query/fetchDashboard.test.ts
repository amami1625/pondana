import { describe, it, expect } from 'vitest';
import { fetchDashboard } from './fetchDashboard';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createMockDashboard } from '@/test/factories/dashboard';
import { DASHBOARD_ERROR_MESSAGES } from '@/constants/errorMessages';
import { ZodError } from 'zod';

describe('fetchDashboard', () => {
  describe('成功時', () => {
    it('ダッシュボード用のデータを正しく取得できる', async () => {
      const result = await fetchDashboard();

      expect(result).toHaveProperty('overview');
      expect(result).toHaveProperty('monthly');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('tags');
      expect(result).toHaveProperty('recent_books');
    });

    it('categories の値が存在しない場合、空配列を返す', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.json(createMockDashboard({ categories: [] }));
        }),
      );

      const result = await fetchDashboard();

      expect(result.categories).toEqual([]);
    });

    it('tags の値が存在しない場合、空配列を返す', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.json(createMockDashboard({ tags: [] }));
        }),
      );

      const result = await fetchDashboard();

      expect(result.tags).toEqual([]);
    });

    it('recent_books の値が存在しない場合、空配列を返す', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.json(createMockDashboard({ recent_books: [] }));
        }),
      );

      const result = await fetchDashboard();

      expect(result.recent_books).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(fetchDashboard()).rejects.toThrow(DASHBOARD_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchDashboard()).rejects.toThrow(DASHBOARD_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchDashboard()).rejects.toThrow(DASHBOARD_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/dashboard', () => {
          return HttpResponse.json({
            invalid: 'invalid-data',
          });
        }),
      );

      await expect(fetchDashboard()).rejects.toThrow(ZodError);
    });
  });
});
