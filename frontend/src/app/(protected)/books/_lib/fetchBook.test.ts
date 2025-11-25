import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockBook, createMockAuthor } from '@/test/factories';
import { fetchBook } from './fetchBook';

describe('fetchBook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('書籍詳細データを正しく取得できる', async () => {
      const mockApiResponse = createMockBook({
        id: 1,
        title: 'テスト本',
        authors: [createMockAuthor()],
      });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchBook(1);

      expect(result.id).toBe(1);
      expect(result.title).toBe('テスト本');
      expect(result.authors).toHaveLength(1);

      expect(fetch).toHaveBeenCalledWith('/api/books/1');
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('異なるIDで正しくリクエストできる', async () => {
      const mockApiResponse = createMockBook({ id: 42, title: '別の本' });

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      const result = await fetchBook(42);

      expect(result.id).toBe(42);
      expect(result.title).toBe('別の本');
      expect(fetch).toHaveBeenCalledWith('/api/books/42');
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラーをスローする', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: '書籍詳細の取得に失敗しました' }),
        }),
      );

      await expect(fetchBook(1)).rejects.toThrow('書籍詳細の取得に失敗しました');
    });

    it('エラーメッセージがない場合、デフォルトメッセージを使用する', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({}),
        }),
      );

      await expect(fetchBook(1)).rejects.toThrow('書籍詳細の取得に失敗しました');
    });

    it('ネットワークエラー時にエラーをスローする', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      await expect(fetchBook(1)).rejects.toThrow('Network error');
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

      await expect(fetchBook(1)).rejects.toThrow();
    });
  });
});
