import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailDescription from './DetailDescription';

describe('DetailDescription', () => {
  it('children が正しく表示されている', () => {
    render(<DetailDescription>テスト</DetailDescription>);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });
});
