'use client';

import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

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
    return <ErrorMessage message={error.message} />;
  }

  if (!data) {
    return <ErrorMessage message={errorMessage} />;
  }

  return <>{children(data)}</>;
}
