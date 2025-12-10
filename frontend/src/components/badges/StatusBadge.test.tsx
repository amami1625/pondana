import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from './StatusBadge';

describe('StatusBadge', () => {
  it('指定したラベルが正しく表示されている', () => {
    render(<StatusBadge label="テスト" />);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('アイコンが正しく表示されている', () => {
    const { container } = render(<StatusBadge label="テスト" />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });
});
