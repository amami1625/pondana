import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { currentPasswordSchema, CurrentPasswordFormData } from '@/schemas/auth';
import { verifyAndSendPasswordResetEmail } from '@/app/(auth)/_lib/auth';
import toast from 'react-hot-toast';

export function usePasswordChange() {
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CurrentPasswordFormData>({
    resolver: zodResolver(currentPasswordSchema),
    defaultValues: { password: '' },
  });

  const onSubmit = async (data: CurrentPasswordFormData) => {
    try {
      const result = await verifyAndSendPasswordResetEmail(data.password);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setIsSent(true);
      toast.success('パスワード変更用のメールを送信しました');
    } catch {
      toast.error('エラーが発生しました');
    }
  };

  return {
    isSent,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
