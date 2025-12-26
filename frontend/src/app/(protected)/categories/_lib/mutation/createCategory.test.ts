import { describe, it, expect, vi, beforeEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { CategoryFormData } from '@/app/(protected)/categories/_types';
import { CATEGORIES_ERROR_MESSAGES } from '../constants/errorMessages';
import { createCategory } from './createCategory';

describe('createCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCategory: CategoryFormData = {
    name: 'テストカテゴリ',
  };

  describe('成功時', () => {
    it('カテゴリを作成できる', async () => {
      const result = await createCategory(mockCategory);

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストカテゴリ');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(createCategory(mockCategory)).rejects.toThrow(
        CATEGORIES_ERROR_MESSAGES.NOT_FOUND,
      );
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(createCategory(mockCategory)).rejects.toThrow(
        CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR,
      );
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.error();
        }),
      );

      await expect(createCategory(mockCategory)).rejects.toThrow(
        CATEGORIES_ERROR_MESSAGES.NETWORK_ERROR,
      );
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(createCategory(mockCategory)).rejects.toThrow();
    });
  });
});
