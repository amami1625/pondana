import { describe, it, expect } from 'vitest';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createTag } from './createTag';

describe('createTag', () => {
  const mockTagData = {
    name: 'テストタグ',
  };

  describe('成功時', () => {
    it('タグを作成できる', async () => {
      const result = await createTag(mockTagData);

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストタグ');
    });
  });

  describe('エラー時', () => {
    it('APIからのエラーメッセージをそのままスローする', async () => {
      const errorMessage = 'タグの作成に失敗しました';
      server.use(
        http.post('/api/tags', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 400 });
        }),
      );

      await expect(createTag(mockTagData)).rejects.toThrow(errorMessage);
    });

    it('サーバーエラー時もAPIからのエラーメッセージをスローする', async () => {
      const errorMessage = 'エラーが発生しました。もう一度お試しください';
      server.use(
        http.post('/api/tags', () => {
          return HttpResponse.json({ error: errorMessage }, { status: 500 });
        }),
      );

      await expect(createTag(mockTagData)).rejects.toThrow(errorMessage);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.post('/api/tags', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(createTag(mockTagData)).rejects.toThrow();
    });
  });
});
