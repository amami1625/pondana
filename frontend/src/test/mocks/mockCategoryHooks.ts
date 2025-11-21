import { vi } from 'vitest';
import { useCategoryMutations } from '@/app/(protected)/categories/_hooks/useCategoryMutations';

/**
 * useListMutations のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseCategoryMutations = (overrides = {}) => {
  vi.mocked(useCategoryMutations).mockReturnValue({
    createCategory: vi.fn(),
    updateCategory: vi.fn(),
    deleteCategory: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: null,
    updateError: null,
    deleteError: null,
    ...overrides,
  });
};
