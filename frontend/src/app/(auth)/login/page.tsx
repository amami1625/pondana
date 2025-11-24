import AuthLayout from '@/app/(auth)/_components/AuthLayout';
import LoginForm from '@/app/(auth)/_components/forms/LoginForm';
import { redirectIfAuthenticated } from '@/app/(auth)/_lib/redirectIfAuthenticated';

export default async function LoginPage() {
  await redirectIfAuthenticated();

  return (
    <AuthLayout title="ログイン" alternativeText="新規登録" alternativeHref="/register">
      <LoginForm />
    </AuthLayout>
  );
}
