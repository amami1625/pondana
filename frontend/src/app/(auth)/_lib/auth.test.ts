import { vi, describe, it, expect } from 'vitest';
import {
  verifyAndSendPasswordResetEmail,
  sendEmailChangeConfirmation,
  updatePassword,
} from './auth';
import { createServerSupabaseClient } from '@/supabase/clients/server';

vi.mock('@/supabase/clients/server', () => ({
  createServerSupabaseClient: vi.fn(),
}));

describe('verifyAndSendPasswordResetEmail', () => {
  describe('正常系', () => {
    it('パスワードが正しい場合、リセットメールを送信して success を返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { email: 'test@example.com' } },
            error: null,
          }),
          signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
          resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await verifyAndSendPasswordResetEmail('correctPassword');

      expect(result).toEqual({ success: true });
      expect(mockSupabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({ redirectTo: expect.any(String) }),
      );
    });
  });

  describe('異常系', () => {
    it('ユーザー取得でエラーが発生した場合、エラーを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'User not found' },
          }),
          signInWithPassword: vi.fn(),
          resetPasswordForEmail: vi.fn(),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await verifyAndSendPasswordResetEmail('password');

      expect(result).toEqual({ error: 'ユーザー情報の取得に失敗しました' });
      expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });

    it('ユーザーのメールアドレスがない場合、エラーを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { email: null } },
            error: null,
          }),
          signInWithPassword: vi.fn(),
          resetPasswordForEmail: vi.fn(),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await verifyAndSendPasswordResetEmail('password');

      expect(result).toEqual({ error: 'ユーザー情報の取得に失敗しました' });
    });

    it('パスワードが間違っている場合、エラーを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { email: 'test@example.com' } },
            error: null,
          }),
          signInWithPassword: vi.fn().mockResolvedValue({
            error: { message: 'Invalid credentials' },
          }),
          resetPasswordForEmail: vi.fn(),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await verifyAndSendPasswordResetEmail('wrongPassword');

      expect(result).toEqual({ error: 'パスワードが正しくありません' });
      expect(mockSupabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
    });

    it('リセットメール送信でエラーが発生した場合、エラーメッセージを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { email: 'test@example.com' } },
            error: null,
          }),
          signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
          resetPasswordForEmail: vi.fn().mockResolvedValue({
            error: { message: 'Rate limit exceeded' },
          }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await verifyAndSendPasswordResetEmail('correctPassword');

      expect(result).toEqual({ error: 'Rate limit exceeded' });
    });
  });
});

describe('sendEmailChangeConfirmation', () => {
  describe('正常系', () => {
    it('ユーザーが存在する場合、確認メールを送信して success を返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'old@example.com' } },
            error: null,
          }),
          updateUser: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await sendEmailChangeConfirmation('new@example.com');

      expect(result).toEqual({ success: true });
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith(
        { email: 'new@example.com' },
        expect.objectContaining({ emailRedirectTo: expect.any(String) }),
      );
    });
  });

  describe('異常系', () => {
    it('ユーザー取得でエラーが発生した場合、エラーを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'User not found' },
          }),
          updateUser: vi.fn(),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await sendEmailChangeConfirmation('new@example.com');

      expect(result).toEqual({ error: 'ユーザー情報の取得に失敗しました' });
      expect(mockSupabase.auth.updateUser).not.toHaveBeenCalled();
    });

    it('ユーザーが存在しない場合、エラーを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: null },
            error: null,
          }),
          updateUser: vi.fn(),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await sendEmailChangeConfirmation('new@example.com');

      expect(result).toEqual({ error: 'ユーザー情報の取得に失敗しました' });
      expect(mockSupabase.auth.updateUser).not.toHaveBeenCalled();
    });

    it('メールアドレス更新でエラーが発生した場合、エラーメッセージを返す', async () => {
      const mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({
            data: { user: { id: '123', email: 'old@example.com' } },
            error: null,
          }),
          updateUser: vi.fn().mockResolvedValue({
            error: { message: 'Email already in use' },
          }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await sendEmailChangeConfirmation('existing@example.com');

      expect(result).toEqual({ error: 'Email already in use' });
    });
  });
});

describe('updatePassword', () => {
  describe('正常系', () => {
    it('パスワード更新に成功した場合、success を返す', async () => {
      const mockSupabase = {
        auth: {
          updateUser: vi.fn().mockResolvedValue({ error: null }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await updatePassword('newPassword123');

      expect(result).toEqual({ success: true });
      expect(mockSupabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123',
      });
    });
  });

  describe('異常系', () => {
    it('パスワード更新でエラーが発生した場合、エラーメッセージを返す', async () => {
      const mockSupabase = {
        auth: {
          updateUser: vi.fn().mockResolvedValue({
            error: { message: 'Password too weak' },
          }),
        },
      };
      vi.mocked(createServerSupabaseClient).mockResolvedValue(mockSupabase as never);

      const result = await updatePassword('weak');

      expect(result).toEqual({ error: 'Password too weak' });
    });
  });
});
