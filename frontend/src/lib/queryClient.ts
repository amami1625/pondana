import { QueryClient } from '@tanstack/react-query';

/**
 * サーバーコンポーネント用のQueryClientを作成
 * クライアント側の設定と同じstaleTimeを使用
 */
export function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5分
      },
    },
  });
}
