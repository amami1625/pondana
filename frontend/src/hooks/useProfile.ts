import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { fetchProfile } from '@/lib/fetchProfile';

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: fetchProfile,
  });
}
