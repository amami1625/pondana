import { describe, it, expect } from 'vitest';
import { toJapaneseLocaleString } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { LISTS_ERROR_MESSAGES } from '@/constants/errorMessages';
import { fetchLists } from './fetchLists';

describe('fetchLists', () => {
  describe('成功時', () => {
    it('リスト一覧を正しく取得できる', async () => {
      const result = await fetchLists();

      // Zodで変換された後のデータを確認
      expect(result).toHaveLength(2);

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: expect.any(String),
        name: 'テストリストA',
        description: 'テスト説明',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        public: true,
        books_count: 5,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result[1]).toEqual({
        id: expect.any(String),
        name: 'テストリストB',
        description: 'テスト説明',
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        public: true,
        books_count: 3,
        created_at: expectedDate,
        updated_at: expectedDate,
      });
    });

    it('データが存在しない場合、空配列を取得する', async () => {
      server.use(
        http.get('/api/lists', () => {
          return HttpResponse.json([]);
        }),
      );

      const result = await fetchLists();

      expect(result).toEqual([]);
    });
  });

  describe('エラー時', () => {
    it('404エラー時に適切なエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/lists', () => {
          return HttpResponse.json({ error: 'Not Found' }, { status: 404 });
        }),
      );

      await expect(fetchLists()).rejects.toThrow(LISTS_ERROR_MESSAGES.NOT_FOUND);
    });

    it('500エラー時にデフォルトエラーメッセージをスローする', async () => {
      server.use(
        http.get('/api/lists', () => {
          return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
        }),
      );

      await expect(fetchLists()).rejects.toThrow(LISTS_ERROR_MESSAGES.UNKNOWN_ERROR);
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      server.use(
        http.get('/api/lists', () => {
          return HttpResponse.error();
        }),
      );

      await expect(fetchLists()).rejects.toThrow(LISTS_ERROR_MESSAGES.NETWORK_ERROR);
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      server.use(
        http.get('/api/lists', () => {
          return HttpResponse.json({ invalid: 'invalid-data' });
        }),
      );

      await expect(fetchLists()).rejects.toThrow();
    });
  });
});
