import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BaseModal from './BaseModal';

describe('BaseModal', () => {
  it('タイトルが表示される', () => {
    render(
      <BaseModal title="タイトル" isOpen={true} onClose={() => {}}>
        モーダル
      </BaseModal>,
    );

    expect(screen.getByText('タイトル')).toBeInTheDocument();
  });

  it('children が表示される', () => {
    render(
      <BaseModal title="タイトル" isOpen={true} onClose={() => {}}>
        モーダル
      </BaseModal>,
    );

    expect(screen.getByText('モーダル')).toBeInTheDocument();
  });

  it('isOpen が false の時、モーダルが表示されない', () => {
    render(
      <BaseModal title="タイトル" isOpen={false} onClose={() => {}}>
        モーダル
      </BaseModal>,
    );

    expect(screen.queryByText('タイトル')).not.toBeInTheDocument();
    expect(screen.queryByText('モーダル')).not.toBeInTheDocument();
  });
});
