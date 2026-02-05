import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { deleteCategory } from './deleteCategory';

describe('deleteCategory', () => {
  describe('成功時', () => {
    it('カテゴリを削除できる', async () => {
      await expect(deleteCategory(1)).resolves.toBeUndefined();
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カテゴリの削除に失敗しました';
      server.use(
        http.delete('/api/categories/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(deleteCategory(1)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.delete('/api/categories/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(deleteCategory(1)).rejects.toThrow(errorMessage);
    });
  });
});
