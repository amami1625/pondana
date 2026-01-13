import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from './Hero';

describe('Hero', () => {
  it('メインタイトルが表示される', () => {
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('学びの記録は');
    expect(heading).toHaveTextContent('ぽんダナ');
    expect(heading).toHaveTextContent('で。');
  });

  it('説明文が表示される', () => {
    render(<Hero />);

    expect(
      screen.getByText('ぽんダナはあなたの学びの記録、知識の整理をサポートします。'),
    ).toBeInTheDocument();
  });

  it('ログインへのリンクが表示される', () => {
    render(<Hero />);

    const link = screen.getByRole('link', { name: /今すぐ始める/ });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});
