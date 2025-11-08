import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { profileSchema } from '@/schemas/profile';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profiles.all,
    queryFn: async () => {
      const response = await fetch('/api/profiles');

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'プロフィール情報の取得に失敗しました');
      }

      const data = await response.json();
      return profileSchema.parse(data);
    },
  });
}
