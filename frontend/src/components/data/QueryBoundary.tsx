'use client';

import { ErrorMessage, LoadingState } from '@/components/feedback';

interface QueryBoundaryProps<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  loadingMessage?: string;
  errorMessage?: string;
  children: (data: T) => React.ReactNode;
}

export default function QueryBoundary<T>({
  data,
  isLoading,
  error,
  loadingMessage = 'データを読み込んでいます...',
  errorMessage = 'データの取得に失敗しました',
  children,
}: QueryBoundaryProps<T>) {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorMessage message={error.message || errorMessage} />;
  }

  if (!data) {
    return <ErrorMessage message={errorMessage} />;
  }

  return <>{children(data)}</>;
}
