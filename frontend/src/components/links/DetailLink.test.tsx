import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailLink from './DetailLink';

describe('DetailLink', () => {
  it('ラベルに詳細と表示される', () => {
    render(<DetailLink href="testLink" />);

    expect(screen.getByText('詳細')).toBeInTheDocument();
  });

  it('アイコンが表示される', () => {
    const { container } = render(<DetailLink href="testLink" />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('指定したリンクが正しく設定されている', () => {
    render(<DetailLink href="testLink" />);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'testLink');
  });
});
