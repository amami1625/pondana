import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailDescription from './DetailDescription';

describe('DetailDescription', () => {
  it('description が存在する場合、正しく表示されている', () => {
    render(<DetailDescription description="テスト" />);

    expect(screen.getByText('テスト')).toBeInTheDocument();
  });

  it('description が null の場合、説明が登録されていません と表示される', () => {
    render(<DetailDescription description={null} />);

    expect(screen.getByText('説明が登録されていません')).toBeInTheDocument();
  });
});
