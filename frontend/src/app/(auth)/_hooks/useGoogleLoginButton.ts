import { useState } from 'react';
import { signInWithGoogle } from '@/app/(auth)/_lib/oauth';
import toast from 'react-hot-toast';

export function useGoogleLoginButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const error = await signInWithGoogle();

    if (error) {
      toast.error('Googleログインに失敗しました');
      setIsLoading(false);
    } else {
      // 成功時はリダイレクトされるため、setIsLoading(false)は不要
      toast.success('ログインしました');
    }
  };

  return {
    isLoading,
    handleGoogleLogin,
  };
}
