import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TagBadge from './TagBadge';

describe('TagBadge', () => {
  it('指定したラベルが正しく表示されている', () => {
    render(<TagBadge label="テスト" />);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('アイコンが正しく表示されている', () => {
    const { container } = render(<TagBadge label="テスト" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
