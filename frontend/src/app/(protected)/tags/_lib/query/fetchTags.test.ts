import { describe, it, expect } from 'vitest';
import { toJapaneseLocaleString } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { TAGS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { fetchTags } from './fetchTags';

describe('fetchTags', () => {
  describe('成功時', () => {
    it('タグのデータを正しく取得できる', async () => {
      const result = await fetchTags();

      // Zodで変換された後のデータを確認
      expect(result).toHaveLength(2);

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: 1,
        name: 'テストタグA',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result[1]).toEqual({
        id: 2,
        name: 'テストタグB',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });
    });

    it('データが存在しない場合、空配列を取得する', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await fetchTags();

      expect(result).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json({ error: 'Not found' }, { status: 404 });
        }),
      );

      await expect(fetchTags()).rejects.toThrow(TAGS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchTags()).rejects.toThrow(TAGS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchTags()).rejects.toThrow(TAGS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/tags', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchTags()).rejects.toThrow();
    });
  });
});
