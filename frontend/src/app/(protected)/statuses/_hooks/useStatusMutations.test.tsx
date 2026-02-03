import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { useStatusMutations } from './useStatusMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useStatusMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createStatus', () => {
    const createData = {
      name: 'ステータス',
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createStatus(createData);
      });

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('ステータスを作成しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.post('/api/statuses', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createStatus(createData);
      });

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('updateStatus', () => {
    const updateData = {
      id: 1,
      name: '更新後ステータス',
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateStatus(updateData);
      });

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('ステータスを更新しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.put('/api/statuses/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateStatus(updateData);
      });

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('deleteStatus', () => {
    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteStatus(1);
      });

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('ステータスを削除しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.delete('/api/statuses/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useStatusMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteStatus(1);
      });

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });
});
