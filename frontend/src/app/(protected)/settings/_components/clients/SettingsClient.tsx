'use client';

import { useProfile } from '@/hooks/useProfile';
import SettingsView from '@/app/(protected)/settings/_components/display/view/SettingsView';
import ErrorMessage from '@/components/feedback/ErrorMessage';
import LoadingState from '@/components/feedback/LoadingState';

type Props = {
  email: string;
};

export default function SettingsClient({ email }: Props) {
  const { isLoading, error, data: user } = useProfile();

  if (isLoading) {
    return <LoadingState message="プロフィールデータを読み込んでいます..." />;
  }

  if (error) {
    return <ErrorMessage message={error?.message || 'エラーが発生しました'} />;
  }

  if (!user) {
    return <ErrorMessage message="プロフィールデータの取得に失敗しました" />;
  }

  return <SettingsView email={email} user={user} />;
}
