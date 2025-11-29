import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseLink from './BaseLink';
import { BookOpen } from 'lucide-react';

describe('BaseLink', () => {
  it('ラベルに指定した文言が表示されている', () => {
    render(<BaseLink href="testLink">テスト</BaseLink>);

    expect(screen.getByRole('link')).toHaveTextContent('テスト');
  });

  it('指定したリンクが正しく設定されている', () => {
    render(<BaseLink href="testLink">テスト</BaseLink>);

    expect(screen.getByRole('link')).toHaveAttribute('href', 'testLink');
  });

  it('指定したアイコンが正しく表示されている', () => {
    const { container } = render(
      <BaseLink href="testLink" icon={<BookOpen />}>
        テスト
      </BaseLink>,
    );

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('デフォルトで primary のスタイルが適用される', () => {
    render(<BaseLink href="testLink">テスト</BaseLink>);

    expect(screen.getByRole('link')).toHaveClass('text-blue-600 hover:bg-blue-50');
  });

  it('secondary のスタイルを適用できる', () => {
    render(
      <BaseLink href="testLink" variant="secondary">
        テスト
      </BaseLink>,
    );

    expect(screen.getByRole('link')).toHaveClass('text-gray-600 hover:bg-gray-50');
  });
});
