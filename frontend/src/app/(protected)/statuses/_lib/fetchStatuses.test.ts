import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockStatus } from '@/test/factories/status';
import { toJapaneseLocaleString } from '@/test/helpers';
import { fetchStatuses } from './fetchStatuses';

describe('fetchStatuses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('ステータスのデータを正しく取得できる', async () => {
      // APIから返ってくる想定のデータ
      const mockApiResponse = [
        createMockStatus({ id: 1, name: 'テストステータスA' }),
        createMockStatus({ id: 2, name: 'テストステータスB' }),
      ];

      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchStatuses();

      // Zodで変換された後のデータを確認
      expect(result).toHaveLength(2);

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result[0]).toEqual({
        id: 1,
        name: 'テストステータスA',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result[1]).toEqual({
        id: 2,
        name: 'テストステータスB',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/statuses');
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

      const result = await fetchStatuses();

      expect(result).toEqual([]);

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/statuses');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'ステータスの取得に失敗しました' }),
        }),
      );

      await expect(fetchStatuses()).rejects.toThrow('ステータスの取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchStatuses()).rejects.toThrow('ステータスの取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchStatuses()).rejects.toThrow('Network error');
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

      await expect(fetchStatuses()).rejects.toThrow();
    });
  });
});
