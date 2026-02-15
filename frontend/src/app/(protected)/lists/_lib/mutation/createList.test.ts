import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { ZodError } from 'zod';
import { ListFormData } from '@/app/(protected)/lists/_types';
import { createList } from './createList';

describe('createList', () => {
  const mockListData: ListFormData = {
    name: 'テストリスト',
    description: 'テスト説明',
    public: true,
  };

  describe('成功時', () => {
    it('リストを作成できる', async () => {
      const result = await createList(mockListData);

      expect(result.name).toBe('テストリスト');
      expect(result.description).toBe('テスト説明');
      expect(result.public).toBe(true);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'リストの作成に失敗しました';
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/lists', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(createList(mockListData)).rejects.toThrow(ZodError);
    });
  });
});
