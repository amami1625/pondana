'use client';

import { useProfile } from '@/hooks/useProfile';
import SettingsView from '@/app/(protected)/settings/_components/display/view/SettingsView';
import QueryBoundary from '@/components/data/QueryBoundary';

interface SettingsClientProps {
  email: string;
}

export default function SettingsClient({ email }: SettingsClientProps) {
  const query = useProfile();

  return (
    <QueryBoundary {...query} loadingMessage="プロフィールデータを読み込んでいます...">
      {(user) => <SettingsView email={email} user={user} />}
    </QueryBoundary>
  );
}
