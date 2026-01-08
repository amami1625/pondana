import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createBrowserSupabaseClient } from '@/supabase/clients/browser';
import { loginClientSide, logoutClientSide } from './sessionClient';

vi.mock('@/supabase/clients/browser', () => ({
  createBrowserSupabaseClient: vi.fn(),
}));

vi.mock('@/lib/utils/translateAuthError', () => ({
  translateAuthError: vi.fn((msg) => msg),
}));

describe('loginClientSide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('ログインに成功した場合、null を返す', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createBrowserSupabaseClient).mockReturnValue(mockSupabase as never);

      const result = await loginClientSide({ email: 'test@example.com', password: 'password123' });

      expect(result).toBeNull();
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('異常系', () => {
    it('ログインに失敗した場合、エラーメッセージを返す', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            error: { message: 'メールアドレスまたはパスワードが正しくありません' },
          }),
        },
      };
      vi.mocked(createBrowserSupabaseClient).mockReturnValue(mockSupabase as never);

      const result = await loginClientSide({ email: 'test@example.com', password: 'wrong' });

      expect(result).toBe('メールアドレスまたはパスワードが正しくありません');
    });
  });
});

describe('logoutClientSide', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('ログアウトに成功した場合、null を返す', async () => {
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createBrowserSupabaseClient).mockReturnValue(mockSupabase as never);

      const result = await logoutClientSide();

      expect(result).toBeNull();
    });
  });

  describe('異常系', () => {
    it('ログアウトに失敗した場合、エラーメッセージを返す', async () => {
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: { message: 'エラーが発生しました' } }),
        },
      };
      vi.mocked(createBrowserSupabaseClient).mockReturnValue(mockSupabase as never);

      const result = await logoutClientSide();

      expect(result).toBe('エラーが発生しました');
    });
  });
});
