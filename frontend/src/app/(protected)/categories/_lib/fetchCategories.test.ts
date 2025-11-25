import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockCategory } from '@/test/factories';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchCategories } from './fetchCategories';

describe('fetchCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('カテゴリのデータを正しく取得できる', async () => {
      // APIから返ってくる想定のデータ
      const mockApiResponse = [
        createMockCategory({ id: 1, name: 'テストカテゴリA' }),
        createMockCategory({ id: 2, name: 'テストカテゴリB' }),
      ];

      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchCategories();

      // Zodで変換された後のデータを確認
      expect(result).toHaveLength(2);

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: 1,
        name: 'テストカテゴリA',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result[1]).toEqual({
        id: 2,
        name: 'テストカテゴリB',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/categories');
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

      const result = await fetchCategories();

      expect(result).toEqual([]);

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/categories');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    describe('エラー時', () => {
      it('APIエラー時にエラーをスローする', async () => {
        vi.stubGlobal(
          'fetch',
          vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'カテゴリの取得に失敗しました' }),
          }),
        );

        await expect(fetchCategories()).rejects.toThrow('カテゴリの取得に失敗しました');
      });

      it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
        vi.stubGlobal(
          'fetch',
          vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({}),
          }),
        );

        await expect(fetchCategories()).rejects.toThrow('カテゴリの取得に失敗しました');
      });

      it('ネットワークエラー時にエラーをスローする', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

        await expect(fetchCategories()).rejects.toThrow('Network error');
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

        await expect(fetchCategories()).rejects.toThrow();
      });
    });
  });
});
