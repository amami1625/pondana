import { BookOpen } from 'lucide-react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseBadge from './BaseBadge';

describe('BaseBadge', () => {
  it('ラベルが正しく表示されている', () => {
    render(<BaseBadge icon={<BookOpen />} label="テスト" variant="category" />);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('アイコンが正しく表示されている', () => {
    const { container } = render(
      <BaseBadge icon={<BookOpen />} label="テスト" variant="category" />,
    );
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('category 用のスタイルが適用できる', () => {
    const { container } = render(
      <BaseBadge icon={<BookOpen />} label="テスト" variant="category" />,
    );
    const div = container.querySelector('div');

    expect(div).toHaveClass('bg-primary/10 text-primary');
  });

  it('public 用のスタイルが適用できる', () => {
    const { container } = render(<BaseBadge icon={<BookOpen />} label="テスト" variant="public" />);
    const div = container.querySelector('div');

    expect(div).toHaveClass('bg-green-500/10 text-green-600');
  });

  it('private 用のスタイルが適用できる', () => {
    const { container } = render(
      <BaseBadge icon={<BookOpen />} label="テスト" variant="private" />,
    );
    const div = container.querySelector('div');

    expect(div).toHaveClass('bg-slate-200 text-slate-700');
  });
});
