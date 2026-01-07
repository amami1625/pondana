import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMockMonthlyStats } from '@/test/factories/dashboard';
import MonthlyChart from './MonthlyChart';

describe('MonthlyChart', () => {
  it('タイトルとチャートが表示される', () => {
    const data = createMockMonthlyStats();
    render(<MonthlyChart data={data} />);

    expect(screen.getByText('月別読書数（過去12ヶ月）')).toBeInTheDocument();
    expect(screen.getByTestId('monthlyChart')).toBeInTheDocument();
  });
});
