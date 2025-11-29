import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('getByRoleでalert要素を取得できる', () => {
    render(<ErrorMessage message="エラーが発生しました" />);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('エラーメッセージが表示される', () => {
    render(<ErrorMessage message="エラーが発生しました" />);

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('異なるエラーメッセージも正しく表示される', () => {
    render(<ErrorMessage message="ネットワークエラー" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('ネットワークエラー');
  });

  it('エラー用のスタイルが適用される', () => {
    render(<ErrorMessage message="エラー" />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('bg-red-50');
    expect(alert).toHaveClass('text-red-600');
  });
});
