import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useDashboard } from '@/app/(protected)/dashboard/_hooks/useDashboard';
import { createMockDashboard } from '@/test/factories/dashboard';
import DashboardClient from './DashboardClient';

vi.mock('@/app/(protected)/dashboard/_hooks/useDashboard');

const dashboard = createMockDashboard();

describe('DashboardClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ローディング状態', () => {
    it('ダッシュボード情報の読み込み中の表示がされる', () => {
      vi.mocked(useDashboard).mockReturnValue({
        data: dashboard,
        error: null,
        isLoading: true,
      } as unknown as ReturnType<typeof useDashboard>);

      render(<DashboardClient />);

      expect(screen.getByText('ダッシュボードを読み込んでいます...')).toBeInTheDocument();
    });
  });

  describe('エラー状態', () => {
    it('エラー時にメッセージが表示される', () => {
      vi.mocked(useDashboard).mockReturnValue({
        data: undefined,
        error: new Error('ダッシュボードデータの取得に失敗しました'),
        isLoading: false,
      } as unknown as ReturnType<typeof useDashboard>);

      render(<DashboardClient />);

      expect(screen.getByText('ダッシュボードデータの取得に失敗しました')).toBeInTheDocument();
    });

    it('データが取得できなかった場合にエラーメッセージが表示される', () => {
      vi.mocked(useDashboard).mockReturnValue({
        data: undefined,
        error: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useDashboard>);

      render(<DashboardClient />);

      expect(screen.getByText('データの取得に失敗しました')).toBeInTheDocument();
    });
  });

  describe('正常表示', () => {
    it('ダッシュボードが表示される', () => {
      vi.mocked(useDashboard).mockReturnValue({
        data: dashboard,
        error: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useDashboard>);

      render(<DashboardClient />);

      expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    });
  });
});
