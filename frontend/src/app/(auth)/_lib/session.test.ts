import { vi, describe, it, expect, beforeEach } from 'vitest';
import { loginAction, logoutAction, signUpAction } from './session';
import { createServerSupabaseClient } from '@/supabase/clients/server';
import { translateAuthError } from '@/lib/utils/translateAuthError';
import { revalidatePath } from 'next/cache';

vi.mock('@/supabase/clients/server', () => ({
  createServerSupabaseClient: vi.fn(),
}));

vi.mock('@/lib/utils/translateAuthError', () => ({
  translateAuthError: vi.fn((msg) => msg),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

describe('loginAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('ログインに成功した場合、success を返す', async () => {
      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await loginAction({ email: 'test@example.com', password: 'password123' });

      expect(result).toEqual({ success: true });
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });
  });

  describe('異常系', () => {
    it('ログインに失敗した場合、翻訳されたエラーメッセージを返す', async () => {
      const mockError = 'Invalid login credentials';
      const translatedError = 'メールアドレスまたはパスワードが正しくありません';

      const mockSupabase = {
        auth: {
          signInWithPassword: vi.fn().mockResolvedValue({
            error: { message: mockError },
          }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);
      vi.mocked(translateAuthError).mockReturnValue(translatedError);

      const result = await loginAction({ email: 'test@example.com', password: 'wrong' });

      expect(result).toEqual({ error: translatedError });
      expect(translateAuthError).toHaveBeenCalledWith(mockError);
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});

describe('logoutAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('ログアウトに成功した場合、success を返す', async () => {
      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await logoutAction();

      expect(result).toEqual({ success: true });
      expect(mockSupabase.auth.signOut).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });
  });

  describe('異常系', () => {
    it('ログアウトに失敗した場合、翻訳されたエラーメッセージを返す', async () => {
      const mockError = 'Session not found';
      const translatedError = 'セッションが見つかりません。再度ログインしてください';

      const mockSupabase = {
        auth: {
          signOut: vi.fn().mockResolvedValue({
            error: { message: mockError },
          }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);
      vi.mocked(translateAuthError).mockReturnValue(translatedError);

      const result = await logoutAction();

      expect(result).toEqual({ error: translatedError });
      expect(translateAuthError).toHaveBeenCalledWith(mockError);
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});

describe('signUpAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('正常系', () => {
    it('ユーザー登録に成功した場合、success を返す', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await signUpAction('Test User', 'test@example.com', 'password123');

      expect(result).toEqual({ success: true });
      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'Test User',
          },
        },
      });
      expect(revalidatePath).toHaveBeenCalledWith('/', 'layout');
    });

    it('name が空文字列の場合、空文字列で登録する', async () => {
      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      await signUpAction('', 'test@example.com', 'password123');

      expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: '',
          },
        },
      });
    });
  });

  describe('異常系', () => {
    it('登録に失敗した場合、翻訳されたエラーメッセージを返す', async () => {
      const mockError = 'User already registered';
      const translatedError = 'エラーが発生しました。もう一度お試しください';

      const mockSupabase = {
        auth: {
          signUp: vi.fn().mockResolvedValue({
            error: { message: mockError },
          }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);
      vi.mocked(translateAuthError).mockReturnValue(translatedError);

      const result = await signUpAction('Test User', 'existing@example.com', 'password123');

      expect(result).toEqual({ error: translatedError });
      expect(translateAuthError).toHaveBeenCalledWith(mockError);
      expect(revalidatePath).not.toHaveBeenCalled();
    });
  });
});
