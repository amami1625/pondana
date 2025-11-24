import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { emailChangeSchema, EmailChangeFormData } from '@/schemas/auth';
import { sendEmailChangeConfirmation } from '@/app/(auth)/_lib/auth';
import { logoutAction } from '@/app/(auth)/_lib/session';
import toast from 'react-hot-toast';

export function useEmailChange() {
  const [isSent, setIsSent] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailChangeFormData>({
    resolver: zodResolver(emailChangeSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: EmailChangeFormData) => {
    try {
      const result = await sendEmailChangeConfirmation(data.email);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setNewEmail(data.email);
      setIsSent(true);
      toast.success('確認メールを送信しました');

      // 5秒後にログアウト
      setTimeout(() => {
        logoutAction();
      }, 5000);
    } catch {
      toast.error('エラーが発生しました');
    }
  };

  return {
    isSent,
    newEmail,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
