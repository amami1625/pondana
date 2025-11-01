import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createServerSupabaseClient } from '@/supabase/clients/server';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'ぽんダナ',
  description: 'エンジニアのための技術書籍管理サービス',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // セッション情報を取得できた場合はユーザー情報を取得してメタデータに反映
  return (
    <html lang="ja">
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header isAuthenticated={!!session} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
