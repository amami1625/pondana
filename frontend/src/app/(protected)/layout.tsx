import { verifySession } from '@/supabase/dal';
import SideNav from '@/components/navigation/SideNav';

// このレイアウト配下のページは認証が必要
// (未認証の場合は自動的にサインインページにリダイレクトされる)
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await verifySession();

  return (
    <div className="min-h-screen bg-background-light font-display">
      <SideNav />
      <main className="ml-64 p-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
