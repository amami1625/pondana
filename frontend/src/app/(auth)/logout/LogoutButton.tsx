'use client';

import { useLogout } from '@/app/(auth)/_hooks/useLogout';

export function LogoutButton() {
  const { logout, loading } = useLogout();

  const handleClick = async () => {
    if (!confirm('ログアウトしますか？')) {
      return;
    }
    await logout();
  };

  return (
    <button type="button" className="cursor-pointer" onClick={handleClick} disabled={loading}>
      {loading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
