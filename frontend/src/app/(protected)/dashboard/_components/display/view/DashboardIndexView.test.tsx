import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockDashboard } from '@/test/factories/dashboard';
import DashboardIndexView from './DashboardIndexView';

describe('DashboardIndexView', () => {
  it('ダッシュボードのタイトルが表示される', () => {
    render(<DashboardIndexView dashboard={createMockDashboard()} />);

    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
  });
});
