import AuthLayout from '@/app/(auth)/_components/AuthLayout';
import RegisterForm from '@/app/(auth)/_components/forms/RegisterForm';
import { redirectIfAuthenticated } from '@/app/(auth)/_lib/redirectIfAuthenticated';

export default async function RegisterPage() {
  await redirectIfAuthenticated();

  return (
    <AuthLayout title="新規登録" alternativeText="ログイン" alternativeHref="/login">
      <RegisterForm />
    </AuthLayout>
  );
}
