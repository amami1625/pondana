import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logoutAction } from '@/app/(auth)/_lib';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    setLoading(true);

    const result = await logoutAction();

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    if (result?.success) {
      // ログアウト成功時にすべてのキャッシュをクリア
      queryClient.clear();
      toast.success('ログアウトしました');
      router.push('/');
    }
  };

  return {
    logout,
    loading,
  };
}
