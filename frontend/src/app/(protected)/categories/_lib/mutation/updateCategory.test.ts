import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateCategory, UpdateCategoryData } from './updateCategory';

describe('updateCategory', () => {
  const mockUpdateData: UpdateCategoryData = {
    id: 1,
    name: '更新されたカテゴリ',
  };

  describe('成功時', () => {
    it('カテゴリを更新できる', async () => {
      const result = await updateCategory(mockUpdateData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('更新されたカテゴリ');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カテゴリの更新に失敗しました';
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateCategory(mockUpdateData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateCategory(mockUpdateData)).rejects.toThrow(errorMessage);
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
