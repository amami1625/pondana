import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { CATEGORIES_ERROR_MESSAGES } from '@/constants/errorMessages';
import { deleteCategory } from './deleteCategory';

describe('deleteCategory', () => {
  describe('成功時', () => {
    it('カテゴリを削除できる', async () => {
      server.use(
        http.delete('/api/categories/:id', () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );

      await expect(deleteCategory(1)).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/categories/:id', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(deleteCategory(1)).rejects.toThrow(CATEGORIES_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.delete('/api/categories/:id', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(deleteCategory(1)).rejects.toThrow(CATEGORIES_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.delete('/api/categories/:id', () => {
          return HttpResponse.error();
        }),
      );

      await expect(deleteCategory(1)).rejects.toThrow(CATEGORIES_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });
});
