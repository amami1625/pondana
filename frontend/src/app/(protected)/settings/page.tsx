import { getProfile } from '@/app/(protected)/settings/_lib/queries';
import SettingsView from '@/app/(protected)/settings/_components/display/SettingsView';
import ErrorMessage from '@/components/ErrorMessage';

export default async function SettingsPage() {
  const user = await getProfile();

  if ('error' in user) {
    return <ErrorMessage message={user.error} />;
  }

  return <SettingsView user={user} />;
}
