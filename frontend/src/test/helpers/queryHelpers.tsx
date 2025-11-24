import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * テスト用のQueryClientを作成するヘルパー関数
 * リトライを無効化してテストを高速化
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // リトライを無効化（テストの高速化）
      },
    },
  });

/**
 * テスト用のQueryClientProviderを作成するヘルパー関数
 * renderHookのwrapperオプションに渡すために使用
 */
export const createProvider = (client?: QueryClient) => {
  const testQueryClient = createTestQueryClient();

  function TestQueryProvider({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client || testQueryClient}>{children}</QueryClientProvider>;
  }

  return TestQueryProvider;
};
