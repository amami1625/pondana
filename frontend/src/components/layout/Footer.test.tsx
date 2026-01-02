import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  it('コピーライトテキストが表示される', () => {
    const copyRight = screen.getByTestId('copyRight');
    expect(copyRight).toBeInTheDocument();
  });

  it('利用規約ページへのリンクが設置されている', () => {
    const termsLink = screen.getByRole('link', { name: '利用規約' });
    expect(termsLink).toBeInTheDocument();
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  it('プライバシーポリシーページへのリンクが設置されている', () => {
    const privacyLink = screen.getByRole('link', { name: 'プライバシーポリシー' });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/privacy');
  });
});
