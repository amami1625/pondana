import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { loginAction } from '@/app/(auth)/_lib';

export function useLoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await loginAction(data);

    if (result?.error) {
      toast.error(result.error);
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
    isSubmitting,
    onSubmit,
  };
}
