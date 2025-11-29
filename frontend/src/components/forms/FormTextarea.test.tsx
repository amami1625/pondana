import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import FormTextarea from './FormTextarea';

describe('FormTextarea', () => {
  // テスト用のラッパーコンポーネントを作る
  function TestWrapper({ error }: { error?: string }) {
    const { register } = useForm();
    return (
      <FormTextarea
        name="test"
        label="テストラベル"
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

  it('textareaが存在する', () => {
    render(<TestWrapper />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
