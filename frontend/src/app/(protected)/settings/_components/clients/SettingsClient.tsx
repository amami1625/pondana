'use client';

import { useProfile } from '@/hooks/useProfile';
import SettingsView from '@/app/(protected)/settings/_components/display/view/SettingsView';
import { ErrorMessage, LoadingState } from '@/components/feedback';
import { User } from '@/schemas/user';

interface Props {
  email: string;
  initialProfile: User;
}

export default function SettingsClient({ email, initialProfile }: Props) {
  const { isFetching, error, data: user } = useProfile();

  // initialProfileをフォールバックとして使用
  const profile = user ?? initialProfile;

  // プリフェッチされたデータがない場合のみローディング表示
  if (isFetching && !profile) {
    return <LoadingState message="プロフィールデータを読み込んでいます..." />;
  }

  if (error) {
    return <ErrorMessage message={error?.message || 'エラーが発生しました'} />;
  }

  if (!profile) {
    return <ErrorMessage message="プロフィールデータの取得に失敗しました" />;
  }

  return <SettingsView email={email} user={profile} />;
}
