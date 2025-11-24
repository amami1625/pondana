import PasswordResetForm from '@/app/(auth)/_components/PasswordResetForm';
import { requireRecoverySession } from '@/app/(auth)/_lib/recovery';

/**
 * パスワードリセットページ
 * メールのリンクからのみアクセス可能（recoveryセッションが必要）
 */
export default async function PasswordResetPage() {
  await requireRecoverySession();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <PasswordResetForm />
    </div>
  );
}
