import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm } from 'react-hook-form';
import FormSelect from './FormSelect';

describe('FormSelect', () => {
  const testOptions = [
    { value: 1, label: '選択肢1' },
    { value: 2, label: '選択肢2' },
    { value: 3, label: '選択肢3' },
  ];

  // テスト用のラッパーコンポーネント
  function TestWrapper({
    error,
    defaultLabel,
    defaultValue,
    button,
  }: {
    error?: string;
    defaultLabel?: string;
    defaultValue?: string | number;
    button?: React.ReactNode;
  }) {
    const { register } = useForm();
    return (
      <FormSelect
        name="test"
        label="テストラベル"
        options={testOptions}
        defaultLabel={defaultLabel}
        defaultValue={defaultValue}
        error={error}
        button={button}
        register={register}
      />
    );
  }

  it('ラベルが表示される', () => {
    render(<TestWrapper />);

    expect(screen.getByText('テストラベル')).toBeInTheDocument();
  });

  it('selectが存在する', () => {
    render(<TestWrapper />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('optionsが表示される', () => {
    render(<TestWrapper />);

    expect(screen.getByText('選択肢1')).toBeInTheDocument();
    expect(screen.getByText('選択肢2')).toBeInTheDocument();
    expect(screen.getByText('選択肢3')).toBeInTheDocument();
  });

  it('デフォルト選択肢が表示される', () => {
    render(<TestWrapper defaultLabel="未選択" defaultValue="" />);

    expect(screen.getByText('未選択')).toBeInTheDocument();
  });

  it('エラーメッセージが表示される', () => {
    render(<TestWrapper error="エラーです" />);

    expect(screen.getByText('エラーです')).toBeInTheDocument();
  });

  it('ボタンが表示される', () => {
    render(<TestWrapper button={<button>追加</button>} />);

    expect(screen.getByText('追加')).toBeInTheDocument();
  });
});
