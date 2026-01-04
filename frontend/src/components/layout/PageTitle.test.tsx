import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PageTitle from './PageTitle';

describe('PageTitle', () => {
  it('渡されたtitleが表示される', () => {
    render(<PageTitle title="テストページ" />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('テストページ');
  });

  it('異なるtitleでも正しく表示される', () => {
    render(<PageTitle title="別のタイトル" />);

    expect(screen.getByText('別のタイトル')).toBeInTheDocument();
  });
});
