'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/supabase/clients/browser';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    // Supabaseの認証状態の変化を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // ログアウトが検知された場合
      if (event === 'SIGNED_OUT') {
        // React Queryのキャッシュをクリア
        queryClient.clear();

        // トップページにリダイレクト
        router.push('/');
      }
    });

    // クリーンアップ（コンポーネントがアンマウントされた時）
    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient, router]);

  return <>{children}</>;
}
