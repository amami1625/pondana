import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { updateTag } from './updateTag';

describe('updateTag', () => {
  const mockUpdateData = {
    id: 1,
    name: '更新されたタグ',
  };

  describe('成功時', () => {
    it('タグを更新できる', async () => {
      const result = await updateTag(mockUpdateData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('更新されたタグ');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'タグの更新に失敗しました';
      server.use(
        http.put('/api/tags/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 404 });
        }),
      );

      await expect(updateTag(mockUpdateData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.put('/api/tags/:id', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(updateTag(mockUpdateData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.put('/api/tags/:id', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(updateTag(mockUpdateData)).rejects.toThrow();
    });
  });
});
