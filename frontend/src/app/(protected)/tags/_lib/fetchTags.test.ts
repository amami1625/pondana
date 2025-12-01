import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockTag } from '@/test/factories/tag';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchTags } from './fetchTags';

describe('fetchTags', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('タグのデータを正しく取得できる', async () => {
      // APIから返ってくる想定のデータ
      const mockApiResponse = [
        createMockTag({ id: 1, name: 'テストタグA' }),
        createMockTag({ id: 2, name: 'テストタグB' }),
      ];

      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

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

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/tags');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('データが存在しない場合、空配列を取得する', async () => {
      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [],
        }),
      );

      const result = await fetchTags();

      expect(result).toEqual([]);

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/tags');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'タグの取得に失敗しました' }),
        }),
      );

      await expect(fetchTags()).rejects.toThrow('タグの取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchTags()).rejects.toThrow('タグの取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchTags()).rejects.toThrow('Network error');
    });
  });

  describe('Zod バリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => [{ invalid: 'data' }],
        }),
      );

      await expect(fetchTags()).rejects.toThrow();
    });
  });
});
