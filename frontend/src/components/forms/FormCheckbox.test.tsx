import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import FormCheckbox from './FormCheckbox';

describe('FormCheckbox', () => {
  // テスト用のラッパーコンポーネント
  function TestWrapper({ error }: { error?: string }) {
    const { register } = useForm();
    return <FormCheckbox name="test" label="テストラベル" error={error} register={register} />;
  }

  it('ラベルが表示される', () => {
    render(<TestWrapper />);

    expect(screen.getByText('テストラベル')).toBeInTheDocument();
  });

  it('チェックボックスが存在する', () => {
    render(<TestWrapper />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('type', 'checkbox');
  });

  it('エラーメッセージが表示される', () => {
    render(<TestWrapper error="エラーです" />);

    expect(screen.getByText('エラーです')).toBeInTheDocument();
  });
});
