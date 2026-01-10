import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FeatureSection from './FeatureSection';
import { BookOpen } from 'lucide-react';

describe('FeatureSection', () => {
  it('セクションタイトルが表示される', () => {
    render(<FeatureSection title="セクションタイトル" description="詳細" icon={<BookOpen />} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('セクションタイトル');
  });

  it('詳細文が表示される', () => {
    render(<FeatureSection title="セクションタイトル" description="詳細" icon={<BookOpen />} />);

    expect(screen.getByText('詳細')).toBeInTheDocument();
  });

  it('異なるタイトルと説明文でも正しく表示される', () => {
    render(<FeatureSection title="別のタイトル" description="別の説明文" icon={<BookOpen />} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('別のタイトル');
    expect(screen.getByText('別の説明文')).toBeInTheDocument();
  });

  it('デフォルトの背景色が適用される', () => {
    const { container } = render(
      <FeatureSection title="タイトル" description="説明" icon={<BookOpen />} />,
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-slate-50/50');
  });

  it('指定した背景色を設定できる', () => {
    const { container } = render(
      <FeatureSection
        title="タイトル"
        description="説明"
        icon={<BookOpen />}
        backgroundColor="bg-blue-100"
      />,
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-blue-100');
  });

  it('アイコンが表示される', () => {
    const { container } = render(
      <FeatureSection title="タイトル" description="説明" icon={<BookOpen />} />,
    );

    // SVG要素が存在することを確認
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
