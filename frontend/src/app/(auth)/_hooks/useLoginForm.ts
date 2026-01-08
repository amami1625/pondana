import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { loginAction, loginClientSide } from '@/app/(auth)/_lib';

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
    // 1. クライアント側でログイン（重要: タブ間同期のため）
    const clientError = await loginClientSide(data);

    if (clientError) {
      toast.error(clientError);
      return;
    }

    // 2. サーバー側のセッションも設定
    const result = await loginAction(data);

    if (result?.error) {
      toast.error(result.error);
      return;
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
