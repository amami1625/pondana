import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { useCategoryMutations } from './useCategoryMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useCategoryMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createCategory', () => {
    const createData = {
      name: 'テストカテゴリ',
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createCategory(createData);
      });

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('カテゴリを作成しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.post('/api/categories', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createCategory(createData);
      });

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('updateCategory', () => {
    const updateData = {
      id: 1,
      name: '更新したカテゴリ',
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateCategory(updateData);
      });

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('カテゴリを更新しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.put('/api/categories/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateCategory(updateData);
      });

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteCategory(1);
      });

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('カテゴリを削除しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.delete('/api/categories/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useCategoryMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteCategory(1);
      });

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });
});
