import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import FormInput from './FormInput';

describe('FormInput', () => {
  // テスト用のラッパーコンポーネント
  function TestWrapper({
    type,
    error,
  }: {
    type?: 'text' | 'email' | 'password' | 'number' | 'hidden';
    error?: string;
  }) {
    const { register } = useForm();
    return (
      <FormInput
        name="test"
        label="テストラベル"
        type={type}
        placeholder="テストプレースホルダー"
        error={error}
        register={register}
      />
    );
  }

  it('ラベルが表示される', () => {
    render(<TestWrapper />);

    expect(screen.getByText('テストラベル')).toBeInTheDocument();
  });

  it('プレースホルダーが表示される', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('テストプレースホルダー')).toBeInTheDocument();
  });

  it('エラーメッセージが表示される', () => {
    render(<TestWrapper error="エラーです" />);

    expect(screen.getByText('エラーです')).toBeInTheDocument();
  });

  it('デフォルトで text 型の input が存在する', () => {
    render(<TestWrapper />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('email 型の input を作成できる', () => {
    render(<TestWrapper type="email" />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
  });

  it('password 型の input を作成できる', () => {
    render(<TestWrapper type="password" />);

    const input = screen.getByPlaceholderText('テストプレースホルダー');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'password');
  });

  it('number 型の input を作成できる', () => {
    render(<TestWrapper type="number" />);

    const input = screen.getByRole('spinbutton');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('hidden 型の input はラベルが表示されない', () => {
    render(<TestWrapper type="hidden" />);

    expect(screen.queryByText('テストラベル')).not.toBeInTheDocument();
  });
});
