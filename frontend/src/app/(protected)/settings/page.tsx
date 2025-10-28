import { getProfile } from '@/app/(protected)/settings/_lib/queries';
import SettingsView from '@/app/(protected)/settings/_components/display/SettingsView';
import ErrorMessage from '@/components/ErrorMessage';
import { verifySession } from '@/supabase/dal';

export default async function SettingsPage() {
  const user = await getProfile();
  const { user: authInfo } = await verifySession();

  if ('error' in user) {
    return <ErrorMessage message={user.error} />;
  }

  return (
    <SettingsView user={user} email={authInfo.email ?? 'メールアドレスが設定されていません'} />
  );
}
