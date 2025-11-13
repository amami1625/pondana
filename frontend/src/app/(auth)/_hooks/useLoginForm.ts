import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { loginAction } from '@/app/(auth)/_lib';

export function useLoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');

    const result = await loginAction(data);

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setLoading(false);
    }

    if (result?.success) {
      toast.success('ログインしました');
      router.push('/top');
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
