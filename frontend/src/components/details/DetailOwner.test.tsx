import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailOwner from './DetailOwner';

describe('DetailOwner', () => {
  it('ユーザー名が表示される', () => {
    render(<DetailOwner userId={1} name="テストユーザー" />);

    expect(screen.getByText('テストユーザーさんのリスト'));
  });

  it('渡された userId を使用したリンクが設定されている', () => {
    render(<DetailOwner userId={1} name="テストユーザー" />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/users/1');
  });
});
