import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usePasswordResetForm } from '@/app/(auth)/_hooks/usePasswordResetForm';
import PasswordResetForm from './PasswordResetForm';

vi.mock('@/app/(auth)/_hooks/usePasswordResetForm', () => ({
  usePasswordResetForm: vi.fn(),
}));

describe('PasswordResetForm', () => {
  // ヘルパー関数: usePasswordResetForm のモックを設定
  const mockUsePasswordResetForm = (overrides = {}) => {
    vi.mocked(usePasswordResetForm).mockReturnValue({
      router: {
        push: vi.fn(),
        replace: vi.fn(),
        refresh: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        prefetch: vi.fn(),
      } as never,
      isComplete: false,
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

  describe('フォーム表示', () => {
    it('新しいパスワード入力欄が存在する', () => {
      mockUsePasswordResetForm();

      render(<PasswordResetForm />);

      const input = screen.getByLabelText('新しいパスワード');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('placeholder', '新しいパスワードを入力');
    });

    it('パスワード確認入力欄が存在する', () => {
      mockUsePasswordResetForm();

      render(<PasswordResetForm />);

      const input = screen.getByLabelText('パスワード（確認）');
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toHaveAttribute('placeholder', 'パスワードを再入力');
    });

    it('パスワード変更ボタンが存在する', () => {
      mockUsePasswordResetForm();

      render(<PasswordResetForm />);

      const button = screen.getByRole('button', { name: 'パスワードを変更' });
      expect(button).toHaveAttribute('type', 'submit');
      expect(button).not.toBeDisabled();
    });

    it('パスワードの要件が表示される', () => {
      mockUsePasswordResetForm();

      render(<PasswordResetForm />);

      expect(
        screen.getByText('パスワードは8文字以上で、英字と数字を含める必要があります。'),
      ).toBeInTheDocument();
    });
  });

  describe('エラー時', () => {
    it('エラーメッセージが表示される', () => {
      mockUsePasswordResetForm({
        errors: {
          password: { message: 'パスワードが間違っています' },
          confirmPassword: { message: 'パスワードが一致しません' },
        },
      });

      render(<PasswordResetForm />);

      expect(screen.getByText('パスワードが間違っています')).toBeInTheDocument();
      expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument();
    });

    it('エラーがない場合はエラーメッセージが表示されない', () => {
      mockUsePasswordResetForm();

      render(<PasswordResetForm />);

      expect(screen.queryByText('パスワードが間違っています')).not.toBeInTheDocument();
      expect(screen.queryByText('パスワードが一致しません')).not.toBeInTheDocument();
    });
  });

  describe('送信中の状態', () => {
    it('送信中はボタンのテキストが「変更中...」になる', () => {
      mockUsePasswordResetForm({ isSubmitting: true });

      render(<PasswordResetForm />);

      expect(screen.getByText('変更中...')).toBeInTheDocument();
    });

    it('送信中はボタンが無効化される', () => {
      mockUsePasswordResetForm({ isSubmitting: true });

      render(<PasswordResetForm />);

      const button = screen.getByRole('button', { name: '変更中...' });
      expect(button).toBeDisabled();
    });
  });

  describe('完了画面', () => {
    it('パスワード変更完了時に完了メッセージが表示される', () => {
      mockUsePasswordResetForm({ isComplete: true });

      render(<PasswordResetForm />);

      expect(screen.getByText('パスワードを変更しました')).toBeInTheDocument();
      expect(
        screen.getByText('新しいパスワードでログインできるようになりました。'),
      ).toBeInTheDocument();
    });

    it('パスワード変更完了時に設定画面に戻るボタンが表示される', () => {
      mockUsePasswordResetForm({ isComplete: true });

      render(<PasswordResetForm />);

      const button = screen.getByRole('button', { name: '設定画面に戻る' });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('完了画面ではフォームが表示されない', () => {
      mockUsePasswordResetForm({ isComplete: true });

      render(<PasswordResetForm />);

      expect(screen.queryByLabelText('新しいパスワード')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('パスワード（確認）')).not.toBeInTheDocument();
    });
  });
});
