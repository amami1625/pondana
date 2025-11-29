import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoryBadge from './CategoryBadge';

describe('CategoryBadge', () => {
  it('指定したラベルが正しく表示されている', () => {
    render(<CategoryBadge label="テスト" />);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('アイコンが正しく表示されている', () => {
    const { container } = render(<CategoryBadge label="テスト" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
