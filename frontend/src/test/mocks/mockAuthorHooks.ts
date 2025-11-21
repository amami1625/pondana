import { vi } from 'vitest';
import { useAuthorMutations } from '@/app/(protected)/authors/_hooks/useAuthorMutations';

/**
 * useAuthorMutations のモックを作成するヘルパー関数
 * @param overrides - デフォルト値を上書きするプロパティ
 */
export const mockUseAuthorMutations = (overrides = {}) => {
  vi.mocked(useAuthorMutations).mockReturnValue({
    createAuthor: vi.fn(),
    updateAuthor: vi.fn(),
    deleteAuthor: vi.fn(),
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    createError: null,
    updateError: null,
    deleteError: null,
    ...overrides,
  });
};
