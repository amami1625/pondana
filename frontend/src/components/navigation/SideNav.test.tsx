import { useProfile } from '@/hooks/useProfile';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { describe, it, expect, vi } from 'vitest';
import SideNav from './SideNav';

vi.mock('next/navigation');
vi.mock('@/hooks/useProfile');

describe('SideNav', () => {
  describe('データ取得完了後', () => {
    it('ユーザー名が表示される', () => {
      vi.mocked(usePathname).mockReturnValue('/top');
      vi.mocked(useProfile).mockReturnValue({
        data: {
          id: 1,
          supabase_uid: '1',
          name: 'テストユーザー',
          avatar_url: 'testImage',
          created_at: '2025/01/01',
          updated_at: '2025/01/02',
        },
      } as never);

      render(<SideNav />);

      expect(screen.getByText('テストユーザー')).toBeInTheDocument();
    });

    it('ユーザー名の頭文字が表示される', () => {
      vi.mocked(usePathname).mockReturnValue('/top');
      vi.mocked(useProfile).mockReturnValue({
        data: {
          id: 1,
          supabase_uid: '1',
          name: 'testUser',
          avatar_url: 'testImage',
          created_at: '2025/01/01',
          updated_at: '2025/01/02',
        },
      } as never);

      render(<SideNav />);

      expect(screen.getByText('T'));
    });
  });

  describe('データ取得完了前', () => {
    it('ユーザー名がロード中...と表示される', () => {
      vi.mocked(usePathname).mockReturnValue('/top');
      vi.mocked(useProfile).mockReturnValue({
        data: {},
      } as never);

      render(<SideNav />);

      expect(screen.getByText('ロード中...')).toBeInTheDocument();
    });

    it('ユーザー名の頭文字の表示が ? になる', () => {
      vi.mocked(usePathname).mockReturnValue('/top');
      vi.mocked(useProfile).mockReturnValue({
        data: {},
      } as never);

      render(<SideNav />);

      expect(screen.getByText('?')).toBeInTheDocument();
    });
  });

  it('ナビゲーション項目が表示される', () => {
    vi.mocked(usePathname).mockReturnValue('/top');
    vi.mocked(useProfile).mockReturnValue({
      data: {
        id: 1,
        supabase_uid: '1',
        name: 'テストユーザー',
        avatar_url: 'testImage',
        created_at: '2025/01/01',
        updated_at: '2025/01/02',
      },
    } as never);

    render(<SideNav />);

    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('ユーザーを検索')).toBeInTheDocument();
    expect(screen.getByText('本を検索')).toBeInTheDocument();
    expect(screen.getByText('本棚')).toBeInTheDocument();
    expect(screen.getByText('リスト')).toBeInTheDocument();
    expect(screen.getByText('カード')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
  });

  it('今いるページのリンク表示部分のスタイルが変わる', () => {
    vi.mocked(usePathname).mockReturnValue('/top');
    vi.mocked(useProfile).mockReturnValue({
      data: {
        id: 1,
        supabase_uid: '1',
        name: 'テストユーザー',
        avatar_url: 'testImage',
        created_at: '2025/01/01',
        updated_at: '2025/01/02',
      },
    } as never);

    render(<SideNav />);

    const links = screen.getAllByRole('link');

    expect(links[0]).toHaveClass('bg-primary/10 text-primary');
    expect(links[1]).toHaveClass('hover:bg-slate-100 text-slate-800');
  });
});
