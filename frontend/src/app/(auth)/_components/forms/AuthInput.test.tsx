import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AuthInput from './AuthInput';

describe('AuthInput', () => {
  const mockRegister = vi.fn((name) => ({
    onChange: vi.fn(),
    onBlur: vi.fn(),
    name,
    ref: vi.fn(),
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('デフォルト設定', () => {
    it('指定した属性値が設定されている', () => {
      render(
        <AuthInput
          name="input-test"
          label="test"
          placeholder="placeholder"
          register={mockRegister}
        />,
      );

      const input = screen.getByLabelText('test');
      expect(input).toHaveAttribute('id', 'input-test');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'placeholder');
      expect(input).toHaveAttribute('name', 'input-test');
    });

    it('register 関数が正しく呼び出される', () => {
      render(
        <AuthInput
          name="input-test"
          label="test"
          placeholder="placeholder"
          register={mockRegister}
        />,
      );

      expect(mockRegister).toHaveBeenCalledWith('input-test');
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });
  });

  describe('type 属性のカスタマイズ', () => {
    it('email 属性を設定できる', () => {
      render(
        <AuthInput
          name="email-input"
          label="Email"
          type="email"
          placeholder="placeholder"
          register={mockRegister}
        />,
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('password 属性を設定できる', () => {
      render(
        <AuthInput
          name="password-input"
          label="Password"
          type="password"
          placeholder="placeholder"
          register={mockRegister}
        />,
      );

      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  describe('エラー時', () => {
    it('エラーメッセージが表示される', () => {
      render(
        <AuthInput
          name="input-test"
          label="test"
          placeholder="placeholder"
          register={mockRegister}
          error="エラーです"
        />,
      );

      expect(screen.getByText('エラーです')).toBeInTheDocument();
    });

    it('エラーがない場合はエラーメッセージが表示されない', () => {
      render(
        <AuthInput
          name="input-test"
          label="test"
          placeholder="placeholder"
          register={mockRegister}
        />,
      );

      expect(screen.queryByText('エラーです')).not.toBeInTheDocument();
    });
  });
});
