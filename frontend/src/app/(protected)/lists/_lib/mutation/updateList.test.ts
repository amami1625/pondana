import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTestUuid } from '@/test/helpers';
import { ZodError } from 'zod';
import { updateList, UpdateListData } from './updateList';

describe('updateList', () => {
  const mockUpdateData: UpdateListData = {
    id: createTestUuid(1),
    name: '更新されたリスト',
    description: '更新された説明',
    public: false,
  };

  describe('成功時', () => {
    it('リストを更新できる', async () => {
      const result = await updateList(mockUpdateData);

      expect(result.name).toBe('更新されたリスト');
      expect(result.description).toBe('更新された説明');
      expect(result.public).toBe(false);
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'リストの更新に失敗しました';
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/lists/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(updateList(mockUpdateData)).rejects.toThrow(ZodError);
    });
  });
});
