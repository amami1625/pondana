import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserFormData, userFormSchema } from '@/schemas/user';
import { useProfileMutations } from '@/app/(protected)/settings/_hooks/useProfileMutations';

interface UseProfileFormStateProps {
  user: User;
  cancel: () => void;
}

export function useProfileForm({ user, cancel }: UseProfileFormStateProps) {
  const [error, setError] = useState('');
  const { updateUser, updateError, isUpdating } = useProfileMutations();

  const defaultValues: UserFormData = {
    name: user.name,
    avatar_url: user.avatar_url ?? undefined,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  const onSubmit = (data: UserFormData) => {
    try {
      setError(''); // 前回のエラーをクリア

      updateUser(data, {
        onSuccess: () => cancel(),
        onError: (error) => setError(error.message),
      });
    } catch (_err) {
      setError('予期しないエラーが発生しました');
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    error: error || updateError?.message,
    onSubmit,
    isSubmitting: isUpdating,
  };
}
