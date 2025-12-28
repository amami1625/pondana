import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestQueryClient } from '@/test/helpers';
import { createMockUser, createMockTopPageData } from '@/test/factories';
import toast from 'react-hot-toast';
import { useProfileMutations } from './useProfileMutations';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useProfileMutations', () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  describe('updateUser', () => {
    it('プロフィールの更新に成功する', async () => {
      const mockUser = createMockUser({ name: '更新されたユーザー' });
      const queryClient = createTestQueryClient();

      // 事前にprofile、topページのデータをキャッシュに追加
      queryClient.setQueryData(['profile'], createMockUser());
      queryClient.setQueryData(['top'], createMockTopPageData());

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: true,
          json: async () => mockUser,
        }),
      );

      const { result } = renderHook(() => useProfileMutations(), {
        wrapper: createProvider(queryClient),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() =>
        result.current.updateUser({
          name: '更新されたユーザー',
        }),
      );

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(fetch).toHaveBeenCalledWith('/api/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '更新されたユーザー',
        }),
      });

      // トーストが表示されることを確認
      expect(toast.success).toHaveBeenCalledWith('プロフィールを更新しました');

      // キャッシュが無効化されることを確認
      const profileQueryState = queryClient.getQueryState(['profile']);
      const topQueryState = queryClient.getQueryState(['top']);
      expect(profileQueryState?.isInvalidated).toBe(true);
      expect(topQueryState?.isInvalidated).toBe(true);
    });

    it('プロフィールの更新に失敗する', async () => {
      const errorMessage = 'プロフィールの更新に失敗しました';

      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue({
          ok: false,
          json: async () => ({
            code: 'UPDATE_FAILED',
            error: errorMessage,
          }),
        }),
      );

      const { result } = renderHook(() => useProfileMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() =>
        result.current.updateUser({
          name: '更新されたユーザー',
        }),
      );

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '更新されたユーザー',
        }),
      });

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);
    });

    it('ネットワークエラー時にエラー状態になる', async () => {
      const errorMessage = 'Network error';

      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error(errorMessage)));

      const { result } = renderHook(() => useProfileMutations(), {
        wrapper: createProvider(),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError).toBeNull();

      act(() =>
        result.current.updateUser({
          name: '更新されたユーザー',
        }),
      );

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(fetch).toHaveBeenCalledWith('/api/profiles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '更新されたユーザー',
        }),
      });

      expect(result.current.isUpdating).toBe(false);
      expect(result.current.updateError?.message).toBe(errorMessage);

      // トーストが表示されることを確認
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
