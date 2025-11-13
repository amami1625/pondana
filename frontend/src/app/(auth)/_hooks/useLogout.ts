import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { logoutAction } from '@/app/(auth)/_lib';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    setLoading(true);

    const result = await logoutAction();

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    }

    if (result?.success) {
      toast.success('ログアウトしました');
      router.push('/');
    }
  };

  return {
    logout,
    loading,
  };
}
