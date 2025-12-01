import { BREADCRUMB_PATHS } from '@/constants/breadcrumbs';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailContainer from './DetailContainer';

describe('DetailContainer', () => {
  it('children が正しく表示されている', () => {
    render(<DetailContainer breadcrumbItems={[]}>テスト</DetailContainer>);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('パンくずリストが正しく表示されている', () => {
    const items = [BREADCRUMB_PATHS.home, BREADCRUMB_PATHS.books, { label: '本詳細' }];
    render(<DetailContainer breadcrumbItems={items}>テスト</DetailContainer>);

    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('本一覧')).toBeInTheDocument();
    expect(screen.getByText('本詳細')).toBeInTheDocument();
  });
});
