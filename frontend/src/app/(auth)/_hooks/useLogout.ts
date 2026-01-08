import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { logoutAction } from '@/app/(auth)/_lib';
import { createBrowserSupabaseClient } from '@/supabase/clients/browser';
import { translateAuthError } from '@/lib/utils/translateAuthError';

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    setLoading(true);

    try {
      // 1. クライアント側でログアウト（重要: タブ間同期のため）
      const supabase = createBrowserSupabaseClient();
      const { error: clientError } = await supabase.auth.signOut();

      if (clientError) {
        toast.error(translateAuthError(clientError.message));
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
    } catch (error) {
      toast.error('エラーが発生しました。もう一度お試しください');
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
  };
}
