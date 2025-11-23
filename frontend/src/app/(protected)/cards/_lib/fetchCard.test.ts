import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockCard } from '@/test/factories';
import { fetchCard } from './fetchCard';

describe('fetchCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('カード詳細データを正しく取得できる', async () => {
      const mockApiResponse = createMockCard({
        id: 1,
        title: 'テストカード',
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchCard(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('テストカード');

      expect(fetch).toHaveBeenCalledWith('/api/cards/1', { cache: 'default' });
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = createMockCard({ id: 42, title: '別のカード' });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchCard(42);

      expect(result.id).toBe(42);
      expect(result.title).toBe('別のカード');
      expect(fetch).toHaveBeenCalledWith('/api/cards/42', { cache: 'default' });
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: 'カード詳細の取得に失敗しました' }),
        }),
      );

      await expect(fetchCard(1)).rejects.toThrow('カード詳細の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchCard(1)).rejects.toThrow('カード詳細の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchCard(1)).rejects.toThrow('Network error');
    });
  });

  describe('環境による分岐', () => {
    it('クライアント側では相対URLを使用する', async () => {
      vi.stubGlobal('window', {});

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockCard(),
        }),
      );

      await fetchCard(1);

      expect(fetch).toHaveBeenCalledWith('/api/cards/1', { cache: 'default' });
    });

    it('サーバー側では絶対URLを使用する', async () => {
      vi.stubGlobal('window', undefined);
      process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => createMockCard(),
        }),
      );

      await fetchCard(1);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/cards/1', {
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

      await expect(fetchCard(1)).rejects.toThrow();
    });
  });
});
