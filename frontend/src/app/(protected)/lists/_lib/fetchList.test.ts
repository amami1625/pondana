import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockList } from '@/test/factories';
import { fetchList } from './fetchList';

describe('fetchList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('リスト詳細データを正しく取得できる', async () => {
      const mockApiResponse = createMockList({
        id: 1,
        name: 'テストリスト',
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchList(1);

      expect(result.id).toBe(1);
      expect(result.name).toBe('テストリスト');

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', { cache: 'default' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = createMockList({ id: 42, name: '別のリスト' });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchList(42);

      expect(result.id).toBe(42);
      expect(result.name).toBe('別のリスト');
      expect(fetch).toHaveBeenCalledWith('/api/lists/42', { cache: 'default' });
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

      await expect(fetchList(1)).rejects.toThrow('リスト詳細の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchList(1)).rejects.toThrow('リスト詳細の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchList(1)).rejects.toThrow('Network error');
    });
  });

  describe('環境による分岐', () => {
    it('クライアント側では相対URLを使用する', async () => {
      vi.stubGlobal('window', {});

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockList(),
        }),
      );

      await fetchList(1);

      expect(fetch).toHaveBeenCalledWith('/api/lists/1', { cache: 'default' });
    });

    it('サーバー側では絶対URLを使用する', async () => {
      vi.stubGlobal('window', undefined);
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockList(),
        }),
      );

      await fetchList(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/lists/1', {
        cache: 'no-store',
      });

      delete process.env.NEXT_PUBLIC_API_URL;
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

      await expect(fetchList(1)).rejects.toThrow();
    });
  });
});
