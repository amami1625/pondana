import { useCallback, useState } from 'react';
import { profileFormSchema, User, UserFormData } from '@/schemas/profile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface UseUpdateUserProps {
  user: User;
  action: (formData: UserFormData) => Promise<{ success: true } | { error: string }>;
  onClose: () => void;
}

export const useUpdateUser = ({ user, action, onClose }: UseUpdateUserProps) => {
  const [error, setError] = useState('');

  const defaultValues: UserFormData = {
    name: user.name,
    avatar_url: user.avatar_url ?? undefined,
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (data: UserFormData) => {
      const res = await action(data);

      if ('error' in res) {
        setError(res.error);
        return;
      }

      onClose();
    },
    [action, onClose],
  );

  return {
    register,
    handleSubmit,
    errors,
    error,
    isSubmitting,
    onSubmit,
  };
};
