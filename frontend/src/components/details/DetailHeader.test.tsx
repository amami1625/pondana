import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailHeader from './DetailHeader';

describe('DetailHeader', () => {
  it('タイトルが正しく表示されている', () => {
    render(<DetailHeader title="タイトル" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('タイトル');
  });

  it('サブタイトルが正しく表示されている', () => {
    render(<DetailHeader title="タイトル" subtitle="サブタイトル" />);

    expect(screen.getByText('サブタイトル')).toBeInTheDocument();
  });

  it('バッジが正しく表示されている', () => {
    render(<DetailHeader title="タイトル" badges="バッジ" />);

    expect(screen.getByText('バッジ')).toBeInTheDocument();
  });
});
