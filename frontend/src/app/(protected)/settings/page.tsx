import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { createServerQueryClient } from '@/lib/queryClient';
import { queryKeys } from '@/constants/queryKeys';
import { authenticatedRequest, verifySession } from '@/supabase/dal';
import SettingsClient from '@/app/(protected)/settings/_components/clients/SettingsClient';
import { userSchema } from '@/schemas/user';

export default async function SettingsPage() {
  const { user: authInfo } = await verifySession();

  const queryClient = createServerQueryClient();

  // データを取得してキャッシュに保存
  const profileData = await queryClient.fetchQuery({
    queryKey: queryKeys.profile.all,
    queryFn: async () => {
      const data = await authenticatedRequest('/profile');
      return userSchema.parse(data);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsClient
        email={authInfo.email ?? 'メールアドレスが設定されていません'}
        initialProfile={profileData}
      />
    </HydrationBoundary>
  );
}
