import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DetailMetadata from './DetailMetadata';

describe('DetailMetadata', () => {
  it('登録日が表示される', () => {
    render(<DetailMetadata createdAt="2025/01/01" updatedAt="2025/01/02" />);

    expect(screen.getByText('登録日: 2025/01/01')).toBeInTheDocument();
  });

  it('更新日が表示される', () => {
    render(<DetailMetadata createdAt="2025/01/01" updatedAt="2025/01/02" />);

    expect(screen.getByText('更新日: 2025/01/02')).toBeInTheDocument();
  });
});
