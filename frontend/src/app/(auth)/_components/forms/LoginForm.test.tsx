import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useLoginForm } from '@/app/(auth)/_hooks/useLoginForm';
import LoginForm from './LoginForm';

vi.mock('@/app/(auth)/_hooks/useLoginForm', () => ({
  useLoginForm: vi.fn(),
}));

describe('LoginForm', () => {
  // ヘルパー関数: useLoginForm のモックを設定
  const mockUseLoginForm = (overrides = {}) => {
    vi.mocked(useLoginForm).mockReturnValue({
      register: vi.fn((name) => ({
        onChange: vi.fn(),
        onBlur: vi.fn(),
        name,
        ref: vi.fn(),
      })),
      handleSubmit: vi.fn(),
      errors: {},
      isSubmitting: false,
      onSubmit: vi.fn(),
      ...overrides,
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('表示', () => {
    it('メールアドレス入力欄が存在する', () => {
      mockUseLoginForm();

      render(<LoginForm />);

      const input = screen.getByLabelText('メールアドレス');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'example@email.com');
    });

    it('パスワード入力欄が存在する', () => {
      mockUseLoginForm();

      render(<LoginForm />);

      const input = screen.getByLabelText('パスワード');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('placeholder', 'パスワードを入力');
    });

    it('ログインボタンが存在する', () => {
      mockUseLoginForm();

      render(<LoginForm />);

      const button = screen.getByRole('button', { name: 'ログイン' });
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).not.toBeDisabled();
    });
  });

  describe('エラー時', () => {
    it('エラーメッセージが表示される', () => {
      mockUseLoginForm({
        errors: {
          email: { message: 'メールアドレスが間違っています' },
          password: { message: 'パスワードが間違っています' },
        },
      });

      render(<LoginForm />);

      expect(screen.getByText('メールアドレスが間違っています')).toBeInTheDocument();
      expect(screen.getByText('パスワードが間違っています')).toBeInTheDocument();
    });
  });

  describe('送信中の状態', () => {
    it('送信中はボタンのテキストが「ログイン中...」になる', () => {
      mockUseLoginForm({ isSubmitting: true });

      render(<LoginForm />);

      expect(screen.getByText('ログイン中...')).toBeInTheDocument();
    });

    it('送信中はボタンが無効化される', () => {
      mockUseLoginForm({ isSubmitting: true });

      render(<LoginForm />);

      const button = screen.getByRole('button', { name: 'ログイン中...' });
      expect(button).toBeDisabled();
    });

    it('送信中でない場合はボタンのテキストが「ログイン」になる', () => {
      mockUseLoginForm({ isSubmitting: false });

      render(<LoginForm />);

      expect(screen.getByText('ログイン')).toBeInTheDocument();
    });
  });
});
