import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { logoutAction, logoutClientSide } from '@/app/(auth)/_lib';
import toast from 'react-hot-toast';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    setLoading(true);

    // 1. クライアント側でログアウト（重要: タブ間同期のため）
    const clientError = await logoutClientSide();

    if (clientError) {
      toast.error(clientError);
      setLoading(false);
      return;
    }

    // 2. サーバー側のセッションもクリア
    const result = await logoutAction();

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    // 3. React Queryのキャッシュをクリア
    queryClient.clear();
    toast.success('ログアウトしました');
    router.push('/');
  };

  return {
    logout,
    loading,
  };
}
