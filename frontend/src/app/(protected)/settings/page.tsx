import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { fetchProfile } from '@/lib/fetchProfile';
import { verifySession } from '@/supabase/dal';
import SettingsClient from '@/app/(protected)/settings/_components/clients/SettingsClient';

export default async function SettingsPage() {
  const { user: authInfo } = await verifySession();

  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.profile.all,
    queryFn: fetchProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsClient email={authInfo.email ?? 'メールアドレスが設定されていません'} />
    </HydrationBoundary>
  );
}
