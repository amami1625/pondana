import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { createProvider, createTestUuid } from '@/test/helpers';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { useBookMutations } from './useBookMutations';
import toast from 'react-hot-toast';

// react-hot-toastをモック
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// next/navigationをモック
const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('useBookMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createBook', () => {
    const createData = {
      title: 'テスト本',
      reading_status: 'completed' as const,
      public: true,
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createBook(createData);
      });

      await waitFor(() => expect(result.current.isCreating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('本を登録しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.post('/api/books', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.createBook(createData);
      });

      await waitFor(() => expect(result.current.createError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('updateBook', () => {
    const updateData = {
      id: createTestUuid(1),
      description: '更新された説明',
      rating: 4,
      reading_status: 'reading' as const,
      public: false,
    };

    it('成功時にトーストが表示される', async () => {
      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateBook(updateData);
      });

      await waitFor(() => expect(result.current.isUpdating).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('本を更新しました');
    });

    it('失敗時にエラートーストが表示される', async () => {
      server.use(
        http.put('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.updateBook(updateData);
      });

      await waitFor(() => expect(result.current.updateError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('deleteBook', () => {
    const bookId = createTestUuid(1);

    it('成功時にトーストが表示されリダイレクトされる', async () => {
      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteBook({ id: bookId });
      });

      await waitFor(() => expect(result.current.isDeleting).toBe(false));

      expect(toast.success).toHaveBeenCalledWith('本を削除しました');
      expect(mockPush).toHaveBeenCalledWith('/books');
    });

    it('失敗時にエラートーストが表示されリダイレクトされない', async () => {
      server.use(
        http.delete('/api/books/:id', () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        }),
      );

      const { result } = renderHook(() => useBookMutations(), {
        wrapper: createProvider(),
      });

      act(() => {
        result.current.deleteBook({ id: bookId });
      });

      await waitFor(() => expect(result.current.deleteError).toBeInstanceOf(Error));

      expect(toast.error).toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
