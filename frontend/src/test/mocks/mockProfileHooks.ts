import { vi } from 'vitest';
import { useProfileMutations } from '@/app/(protected)/settings/_hooks/useProfileMutations';

export const mockUseProfileMutations = (overrides = {}) => {
  vi.mocked(useProfileMutations).mockReturnValue({
    updateUser: vi.fn(),
    isUpdating: false,
    updateError: null,
    ...overrides
  });
};
