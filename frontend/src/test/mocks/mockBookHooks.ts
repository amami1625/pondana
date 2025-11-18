import { vi } from 'vitest';
import { useBookMutations } from '@/app/(protected)/books/_hooks/useBookMutations';

/**
 * useBookMutations のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseBookMutations = (overrides = {}) => {
  vi.mocked(useBookMutations).mockReturnValue({
    createBook: vi.fn(),
    updateBook: vi.fn(),
    deleteBook: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: null,
    updateError: null,
    deleteError: null,
    ...overrides,
  });
};
