import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockList } from '@/test/factories';
import { createTestUuid } from '@/test/helpers';
import { fetchList } from './fetchList';

describe('fetchList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('リスト詳細データを正しく取得できる', async () => {
      const mockApiResponse = createMockList({
        id: createTestUuid(1),
        name: 'テストリスト',
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchList(createTestUuid(1));

      expect(result.id).toBe(createTestUuid(1));
      expect(result.name).toBe('テストリスト');

      expect(fetch).toHaveBeenCalledWith(`/api/lists/${createTestUuid(1)}`);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = createMockList({ id: createTestUuid(42), name: '別のリスト' });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchList(createTestUuid(42));

      expect(result.id).toBe(createTestUuid(42));
      expect(result.name).toBe('別のリスト');
      expect(fetch).toHaveBeenCalledWith(`/api/lists/${createTestUuid(42)}`);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'リスト詳細の取得に失敗しました' }),
        }),
      );

      await expect(fetchList(createTestUuid(1))).rejects.toThrow('リスト詳細の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchList(createTestUuid(1))).rejects.toThrow('リスト詳細の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchList(createTestUuid(1))).rejects.toThrow('Network error');
    });
  });

  describe('Zodバリデーション', () => {
    it('不正なデータ形式の場合、Zodエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({ invalid: 'data' }),
        }),
      );

      await expect(fetchList(createTestUuid(1))).rejects.toThrow();
    });
  });
});
