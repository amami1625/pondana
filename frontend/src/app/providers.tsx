'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // データが古くなるまでの時間(5分) 古くなったら再取得
            staleTime: 1000 * 60 * 5,
            // キャッシュの保持時間(10分) 規定時間経過で削除
            gcTime: 1000 * 60 * 10,
            // エラー時のリトライ
            retry: 1,
            // リフォーカス時の再取得
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
