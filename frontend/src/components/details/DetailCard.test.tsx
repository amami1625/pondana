import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailCard from './DetailCard';

describe('DetailCard', () => {
  it('children が正しく表示されている', () => {
    render(<DetailCard>テスト</DetailCard>);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });
});
