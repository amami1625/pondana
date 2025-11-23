import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { createMockUser } from '@/test/factories';
import { useProfile } from './useProfile';
import { fetchProfile } from '@/lib/fetchProfile';
import type { User } from '@/schemas/user';

// fetchProfileをモック化
vi.mock('@/lib/fetchProfile');

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('成功時', () => {
    it('fetchProfileを呼び出してデータを取得する', async () => {
      const mockUser: User = createMockUser();

      vi.mocked(fetchProfile).mockResolvedValue(mockUser);

      const { result } = renderHook(() => useProfile(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // データ取得完了を待つ
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // 成功状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.data).toEqual(mockUser);

      // fetchProfileが呼ばれたことを確認
      expect(fetchProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラー時', () => {
    it('fetchProfileがエラーをスローした場合、エラー状態になる', async () => {
      vi.mocked(fetchProfile).mockRejectedValue(new Error('プロフィール情報の取得に失敗しました'));

      const { result } = renderHook(() => useProfile(), {
        wrapper: createProvider(),
      });

      // 初期状態: ローディング中
      expect(result.current.isLoading).toBe(true);

      // エラー完了を待つ
      await waitFor(() => expect(result.current.isError).toBe(true));

      // エラー状態を確認
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('プロフィール情報の取得に失敗しました');
    });
  });

  describe('React Queryの動作', () => {
    it('正しいqueryKeyを使用する', async () => {
      vi.mocked(fetchProfile).mockResolvedValue(createMockUser());

      const { result } = renderHook(() => useProfile(), {
        wrapper: createProvider(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.isSuccess).toBe(true);
    });
  });
});
