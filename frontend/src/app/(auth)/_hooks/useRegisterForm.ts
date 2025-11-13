import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerSchema, type RegisterFormData } from '@/schemas/auth';
import { signUpAction } from '@/app/(auth)/_lib';

export function useRegisterForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');

    const result = await signUpAction(data.name, data.email, data.password);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success('ユーザー登録が完了しました');
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    error,
    loading,
    onSubmit,
  };
}
