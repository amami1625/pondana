import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockOverview } from '@/test/factories/dashboard';
import OverviewStats from './OverviewStats';

describe('OverviewStats', () => {
  it('統計情報が正しく表示される', () => {
    const data = createMockOverview();
    render(<OverviewStats data={data} />);

    expect(screen.getByText('総書籍数')).toBeInTheDocument();
    expect(screen.getByText('総カード数')).toBeInTheDocument();
    expect(screen.getByText('カテゴリー数')).toBeInTheDocument();
    expect(screen.getByText('タグ数')).toBeInTheDocument();
  });
});
