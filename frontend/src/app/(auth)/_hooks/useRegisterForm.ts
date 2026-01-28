import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerSchema, type RegisterFormData } from '@/schemas/auth';
import { signUpAction, loginClientSide } from '@/app/(auth)/_lib';

export function useRegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const error = await signUpAction(data.name, data.email, data.password);

    if (error) {
      toast.error(error);
      return;
    }

    // クライアント側でログインしてonAuthStateChangeを発火させる
    const clientError = await loginClientSide({ email: data.email, password: data.password });

    if (clientError) {
      toast.error(clientError);
      return;
    }

    toast.success('ユーザー登録が完了しました');
    router.push('/top');
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
