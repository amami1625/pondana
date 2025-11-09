import SettingsView from '@/app/(protected)/settings/_components/display/SettingsView';
import { verifySession } from '@/supabase/dal';

export default async function SettingsPage() {
  const { user: authInfo } = await verifySession();

  return <SettingsView email={authInfo.email ?? 'メールアドレスが設定されていません'} />;
}
