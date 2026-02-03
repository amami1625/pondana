import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { useProfileMutations } from './useProfileMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useProfileMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('updateUser', () => {
    const updateData = {
      name: '更新されたユーザー',
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useProfileMutations(), {
        wrapper: createProvider(),
      });

      act(() => result.current.updateUser(updateData));

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('プロフィールを更新しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.put('/api/profiles', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useProfileMutations(), {
        wrapper: createProvider(),
      });

      act(() => result.current.updateUser(updateData));

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });
});
