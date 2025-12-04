import { vi } from 'vitest';
import { useTagMutations } from '@/app/(protected)/tags/_hooks/useTagMutations';

/**
 * useTagMutations のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseTagMutations = (overrides = {}) => {
  vi.mocked(useTagMutations).mockReturnValue({
    createTag: vi.fn(),
    updateTag: vi.fn(),
    deleteTag: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: null,
    updateError: null,
    deleteError: null,
    ...overrides,
  });
};
