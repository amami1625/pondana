import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ModalInfo from './ModalInfo';

describe('ModalInfo', () => {
  it('ラベルが表示される', () => {
    render(<ModalInfo label="ラベル" content="テキスト" />);

    expect(screen.getByText('ラベル')).toBeInTheDocument();
  });

  it('コンテンツが表示される', () => {
    render(<ModalInfo label="ラベル" content="テキスト" />);

    expect(screen.getByText('テキスト')).toBeInTheDocument();
  });
});
