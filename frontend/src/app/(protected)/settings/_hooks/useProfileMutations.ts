import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { UserFormData } from '@/schemas/user';
import toast from 'react-hot-toast';

export function useProfileMutations() {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      const response = await fetch('/api/profiles', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'プロフィールの更新に失敗しました');
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('プロフィールを更新しました');
      // プロフィール情報のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.all });
      // トップページのキャッシュも無効化（プロフィール情報が含まれるため）
      queryClient.invalidateQueries({ queryKey: queryKeys.top.all });
    },
  });

  return {
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
  };
}
