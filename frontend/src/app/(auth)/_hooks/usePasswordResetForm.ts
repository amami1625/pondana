import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordChangeFormData, passwordChangeSchema } from '@/schemas/auth';
import { updatePassword } from '@/app/(auth)/_lib/auth';
import toast from 'react-hot-toast';

export function usePasswordResetForm() {
  const router = useRouter();
  const [isComplete, setIsComplete] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: PasswordChangeFormData) => {
    try {
      const result = await updatePassword(data.password);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setIsComplete(true);
      toast.success('パスワードを変更しました');
    } catch {
      toast.error('エラーが発生しました');
    }
  };

  return {
    router,
    isComplete,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
