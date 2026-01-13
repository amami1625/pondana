import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { CATEGORIES_ERROR_MESSAGES } from '@/constants/errorMessages';
import { updateCategory, UpdateCategoryData } from './updateCategory';

describe('updateCategory', () => {
  const mockUpdateData: UpdateCategoryData = {
    id: 1,
    name: '更新されたカテゴリ',
  };

  describe('成功時', () => {
    it('カテゴリを更新できる', async () => {
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({
            id: 1,
            name: '更新されたカテゴリ',
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-02T00:00:00Z',
          });
        }),
      );

      const result = await updateCategory(mockUpdateData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('更新されたカテゴリ');
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(updateCategory(mockUpdateData)).rejects.toThrow(
        CATEGORIES_ERROR_MESSAGES.NOT_FOUND,
      );
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(updateCategory(mockUpdateData)).rejects.toThrow(
        CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR,
      );
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(updateCategory(mockUpdateData)).rejects.toThrow(
        CATEGORIES_ERROR_MESSAGES.NETWORK_ERROR,
      );
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(updateCategory(mockUpdateData)).rejects.toThrow();
    });
  });
});
