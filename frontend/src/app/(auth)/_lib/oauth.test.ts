import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBrowserSupabaseClient } from '@/supabase/clients/browser';
import { signInWithGoogle } from './oauth';

vi.mock('@/supabase/clients/browser');

describe('signInWithGoogle', () => {
  const mockSignInWithOAuth = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(createBrowserSupabaseClient).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
      },
    } as unknown as ReturnType<typeof createBrowserSupabaseClient>);
  });

  it('Googleプロバイダーと正しいリダイレクトURLで呼ばれる', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    await signInWithGoogle();

    expect(mockSignInWithOAuth).toHaveBeenCalledTimes(1);
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback?next=/top'),
      },
    });
  });

  it('成功時はnullを返す', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null });

    const result = await signInWithGoogle();

    expect(result).toBeNull();
  });

  it('エラー時はエラーメッセージを返す', async () => {
    mockSignInWithOAuth.mockResolvedValue({
      error: { message: 'OAuth error' },
    });

    const result = await signInWithGoogle();

    expect(result).toBe('OAuth error');
  });
});
