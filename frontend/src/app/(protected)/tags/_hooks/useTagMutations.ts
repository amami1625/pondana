import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';
import { Tag, TagFormData } from '@/app/(protected)/tags/_types';
import toast from 'react-hot-toast';

export function useTagMutations() {
  const queryClient = useQueryClient();

  // 作成
  const createMutation = useMutation({
    mutationFn: async (data: TagFormData) => {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'タグの作成に失敗しました');
      }

      return response.json() as Promise<Tag>;
    },
    onSuccess: () => {
      toast.success('タグを作成しました');
      // タグ一覧のキャッシュを無効化
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all });
    },
    onError: (error) => toast.error(error.message),
  });

  return {
    createTag: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
}
