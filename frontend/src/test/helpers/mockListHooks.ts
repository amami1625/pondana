import { vi } from 'vitest';
import { useListMutations } from '@/app/(protected)/lists/_hooks/useListMutations';

/**
 * useListMutations のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseListMutations = (overrides = {}) => {
  vi.mocked(useListMutations).mockReturnValue({
    createList: vi.fn(),
    updateList: vi.fn(),
    deleteList: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: null,
    updateError: null,
    deleteError: null,
    ...overrides,
  });
};
