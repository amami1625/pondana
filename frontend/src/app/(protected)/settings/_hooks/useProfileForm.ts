import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserFormData, userFormSchema } from '@/schemas/user';
import { useProfileMutations } from '@/app/(protected)/settings/_hooks/useProfileMutations';

interface UseProfileFormStateProps {
  user: User;
  cancel: () => void;
}

export function useProfileForm({ user, cancel }: UseProfileFormStateProps) {
  const { updateUser, isUpdating } = useProfileMutations();

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
    updateUser(data, {
      onSuccess: () => cancel(),
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isSubmitting: isUpdating,
  };
}
