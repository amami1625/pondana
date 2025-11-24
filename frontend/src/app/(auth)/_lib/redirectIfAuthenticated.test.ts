import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from 'next/navigation';
import { redirectIfAuthenticated } from './redirectIfAuthenticated';
import { createServerSupabaseClient } from '@/supabase/clients/server';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/supabase/clients/server', () => ({
  createServerSupabaseClient: vi.fn(),
}));

describe('redirectIfAuthenticated', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('認証済みの場合', () => {
    it('ユーザーが存在する場合 /top へリダイレクトする', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-id' } },
            error: null,
          }),
        },
      } as never);

      await expect(redirectIfAuthenticated()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/top');
    });
  });

  describe('未認証の場合', () => {
    it('エラーがある場合リダイレクトしない', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('Not authenticated'),
          }),
        },
      } as never);

      await redirectIfAuthenticated();

      expect(redirect).not.toHaveBeenCalled();
    });

    it('user が null の場合リダイレクトしない', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
        },
      } as never);

      await redirectIfAuthenticated();

      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
