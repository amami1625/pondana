import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { UserFormData } from '@/schemas/user';
import toast from 'react-hot-toast';
import { updateProfile } from '@/app/(protected)/settings/_lib/mutation/updateProfile';

export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => updateProfile(data),
    onSuccess: () => {
      toast.success('プロフィールを更新しました');
      // プロフィール情報のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      // トップページのキャッシュも無効化（プロフィール情報が含まれるため）
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
