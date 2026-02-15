import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { CategoryFormData } from '@/app/(protected)/categories/_types';
import { createCategory } from './createCategory';

describe('createCategory', () => {
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
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'カテゴリの作成に失敗しました';
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(createCategory(mockCategory)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(createCategory(mockCategory)).rejects.toThrow(errorMessage);
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
