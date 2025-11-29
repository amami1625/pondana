import { BREADCRUMB_PATHS } from '@/constants/breadcrumbs';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Breadcrumb from './Breadcrumb';

describe('Breadcrumb', () => {
  it('パンくずリストが表示される', () => {
    const items = [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.books, { label: 'テスト' }];
    render(<Breadcrumb items={items} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveTextContent('ホーム');
    expect(links[1]).toHaveTextContent('本一覧');

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('指定したリンクが設定されている', () => {
    const items = [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.books, { label: 'テスト' }];
    render(<Breadcrumb items={items} />);

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/top');
    expect(links[1]).toHaveAttribute('href', '/books');
  });

  it('区切り文字が表示される', () => {
    const items = [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.books, { label: 'テスト' }];
    render(<Breadcrumb items={items} />);

    const separators = screen.getAllByText('/');
    expect(separators).toHaveLength(2);
  });
});
