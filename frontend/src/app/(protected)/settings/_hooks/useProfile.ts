import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { userSchema } from '@/schemas/user';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: async () => {
      const response = await fetch('/api/profiles');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'プロフィール情報の取得に失敗しました');
      }

      const data = await response.json();
      return userSchema.parse(data);
    },
  });
}
