'use client';

import { useAuthors } from '@/app/(protected)/authors/_hooks/useAuthors';
import AuthorIndexView from '@/app/(protected)/settings/_components/display/view/AuthorIndexView';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

export default function AuthorsClient() {
  const { data: authors, isLoading, error } = useAuthors();

  // ローディング状態
  if (isLoading) {
    return <LoadingState message="著者情報を読み込んでいます..." />;
  }

  // エラー状態
  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  // データが取得できていない場合
  if (!authors) {
    return <ErrorMessage message="著者情報の取得に失敗しました" />;
  }

  return <AuthorIndexView authors={authors} />;
}
