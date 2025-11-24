import { describe, it, expect, vi, beforeEach } from 'vitest';
import { redirect } from 'next/navigation';
import { requireRecoverySession } from './recovery';
import { createServerSupabaseClient } from '@/supabase/clients/server';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('@/supabase/clients/server', () => ({
  createServerSupabaseClient: vi.fn(),
}));

describe('requireRecoverySession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('認証されていない場合', () => {
    it('エラーがある場合 /login へリダイレクトする', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: new Error('Not authenticated'),
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn(),
          },
        },
      } as never);

      await expect(requireRecoverySession()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/login');
    });

    it('user が null の場合 /login へリダイレクトする', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn(),
          },
        },
      } as never);

      await expect(requireRecoverySession()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/login');
    });
  });

  describe('認証済みだが recovery セッションでない場合', () => {
    it('currentAuthenticationMethods が空の場合 /settings へリダイレクトする', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-id' } },
            error: null,
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
              data: { currentAuthenticationMethods: [] },
            }),
          },
        },
      } as never);

      await expect(requireRecoverySession()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/settings');
    });

    it('recovery 以外の認証方法の場合 /settings へリダイレクトする', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-id' } },
            error: null,
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
              data: {
                currentAuthenticationMethods: [{ method: 'password' }],
              },
            }),
          },
        },
      } as never);

      await expect(requireRecoverySession()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/settings');
    });

    it('aalData が null の場合 /settings へリダイレクトする', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-id' } },
            error: null,
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
              data: null,
            }),
          },
        },
      } as never);

      await expect(requireRecoverySession()).rejects.toThrow('NEXT_REDIRECT');
      expect(redirect).toHaveBeenCalledWith('/settings');
    });
  });

  describe('recovery セッションの場合', () => {
    it('リダイレクトせずに正常に返る', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-id' } },
            error: null,
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
              data: {
                currentAuthenticationMethods: [{ method: 'recovery' }],
              },
            }),
          },
        },
      } as never);

      await requireRecoverySession();

      expect(redirect).not.toHaveBeenCalled();
    });

    it('複数の認証方法に recovery が含まれる場合、正常に返る', async () => {
      vi.mocked(createServerSupabaseClient).mockResolvedValue({
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: 'user-id' } },
            error: null,
          }),
          mfa: {
            getAuthenticatorAssuranceLevel: vi.fn().mockResolvedValue({
              data: {
                currentAuthenticationMethods: [{ method: 'password' }, { method: 'recovery' }],
              },
            }),
          },
        },
      } as never);

      await requireRecoverySession();

      expect(redirect).not.toHaveBeenCalled();
    });
  });
});
