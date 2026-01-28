import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRegisterForm } from '@/app/(auth)/_hooks/useRegisterForm';
import RegisterForm from './RegisterForm';

vi.mock('@/app/(auth)/_hooks/useRegisterForm', () => ({
  useRegisterForm: vi.fn(),
}));

vi.mock('@/app/(auth)/_components/GoogleLoginButton', () => ({
  default: () => <button type="button">Googleでログイン</button>,
}));

describe('RegisterForm', () => {
  // ヘルパー関数: useRegisterForm のモックを設定
  const mockUseRegisterForm = (overrides = {}) => {
    vi.mocked(useRegisterForm).mockReturnValue({
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
    it('ユーザー名入力欄が存在する', () => {
      mockUseRegisterForm();

      render(<RegisterForm />);

      const input = screen.getByLabelText('ユーザー名');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'ユーザー名を入力');
    });

    it('メールアドレス入力欄が存在する', () => {
      mockUseRegisterForm();

      render(<RegisterForm />);

      const input = screen.getByLabelText('メールアドレス');
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'example@email.com');
    });

    it('パスワード入力欄が存在する', () => {
      mockUseRegisterForm();

      render(<RegisterForm />);

      const input = screen.getByLabelText('パスワード');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('placeholder', '8文字以上で入力');
    });

    it('パスワード確認欄が存在する', () => {
      mockUseRegisterForm();

      render(<RegisterForm />);

      const input = screen.getByLabelText('パスワード確認');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('placeholder', 'パスワードを再入力');
    });

    it('登録ボタンが存在する', () => {
      mockUseRegisterForm();

      render(<RegisterForm />);

      const button = screen.getByRole('button', { name: '登録' });
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).not.toBeDisabled();
    });

    it('Googleログインボタンが存在する', () => {
      mockUseRegisterForm();

      render(<RegisterForm />);

      expect(screen.getByRole('button', { name: 'Googleでログイン' })).toBeInTheDocument();
    });
  });

  describe('エラー時', () => {
    it('エラーメッセージが表示される', () => {
      mockUseRegisterForm({
        errors: {
          name: { message: 'ユーザー名が間違っています' },
          email: { message: 'メールアドレスが間違っています' },
          password: { message: 'パスワードが間違っています' },
          passwordConfirmation: { message: 'パスワード確認が間違っています' },
        },
      });

      render(<RegisterForm />);

      expect(screen.getByText('ユーザー名が間違っています')).toBeInTheDocument();
      expect(screen.getByText('メールアドレスが間違っています')).toBeInTheDocument();
      expect(screen.getByText('パスワードが間違っています')).toBeInTheDocument();
      expect(screen.getByText('パスワード確認が間違っています')).toBeInTheDocument();
    });
  });

  describe('送信中の状態', () => {
    it('送信中はボタンのテキストが「登録中...」になる', () => {
      mockUseRegisterForm({ isSubmitting: true });

      render(<RegisterForm />);

      expect(screen.getByText('登録中...')).toBeInTheDocument();
    });

    it('送信中はボタンが無効化される', () => {
      mockUseRegisterForm({ isSubmitting: true });

      render(<RegisterForm />);

      const button = screen.getByRole('button', { name: '登録中...' });
      expect(button).toBeDisabled();
    });

    it('送信中でない場合はボタンのテキストが「登録」になる', () => {
      mockUseRegisterForm({ isSubmitting: false });

      render(<RegisterForm />);

      expect(screen.getByText('登録')).toBeInTheDocument();
    });
  });
});
