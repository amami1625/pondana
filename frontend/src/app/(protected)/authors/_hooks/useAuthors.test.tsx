import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider, toJapaneseLocaleString } from '@/test/helpers';
import { useAuthors } from './useAuthors';
import { createMockAuthor } from '@/test/factories';

describe('useAuthors', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('著者データを正しく取得できる', async () => {
      // APIから返ってくる想定のデータ（ISO形式の文字列）
      const mockApiResponse = [
        createMockAuthor({ id: 1, name: '著者1' }),
        createMockAuthor({ id: 2, name: '著者2' }),
      ];

      // fetchをモック
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockApiResponse,
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useAuthors(), {
        wrapper: createProvider(),
      });

      // 初期状態：ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();

      // Zodで変換された後のデータを確認
      expect(result.current.data).toHaveLength(2);

      // 日付変換の期待値を計算（'2025-01-01T00:00:00Z' → 日本時間）
      const expectedDate = toJapaneseLocaleString('2025-01-01T00:00:00Z');

      expect(result.current.data?.[0]).toEqual({
        id: 1,
        name: '著者1',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      expect(result.current.data?.[1]).toEqual({
        id: 2,
        name: '著者2',
        user_id: 1,
        created_at: expectedDate,
        updated_at: expectedDate,
      });

      // fetchが正しく呼ばれたことを確認
      expect(fetch).toHaveBeenCalledWith('/api/authors');
      expect(fetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('APIエラー時にエラー状態になる', async () => {
      // fetchをモック（エラーレスポンス）
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({ error: '著者情報の取得に失敗しました' }),
        }),
      );

      // フックをレンダリング
      const { result } = renderHook(() => useAuthors(), {
        wrapper: createProvider(),
      });

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('著者情報の取得に失敗しました');
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      // fetchをモック（ネットワークエラー）
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

      // フックをレンダリング
      const { result } = renderHook(() => useAuthors(), {
        wrapper: createProvider(),
      });

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Network error');
    });
  });
});
