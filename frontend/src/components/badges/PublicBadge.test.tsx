import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PublicBadge from './PublicBadge';

describe('PublicBadge', () => {
  describe('公開時', () => {
    it('ラベルに公開と表示されている', () => {
      render(<PublicBadge isPublic={true} />);

      expect(screen.getByText('公開')).toBeInTheDocument();
    });

    it('アイコンが表示されている', () => {
      const { container } = render(<PublicBadge isPublic={true} />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('public のスタイルが適用されている', () => {
      const { container } = render(<PublicBadge isPublic={true} />);
      const div = container.querySelector('div');

      expect(div).toHaveClass('bg-green-500/10 text-green-600');
    });
  });

  describe('非公開時', () => {
    it('ラベルに非公開と表示されている', () => {
      render(<PublicBadge isPublic={false} />);

      expect(screen.getByText('非公開')).toBeInTheDocument();
    });

    it('アイコンが表示されている', () => {
      const { container } = render(<PublicBadge isPublic={false} />);
      const svg = container.querySelector('svg');

      expect(svg).toBeInTheDocument();
    });

    it('private のスタイルが適用されている', () => {
      const { container } = render(<PublicBadge isPublic={false} />);
      const div = container.querySelector('div');

      expect(div).toHaveClass('bg-slate-200 text-slate-700');
    });
  });
});
