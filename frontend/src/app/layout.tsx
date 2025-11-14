import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createServerSupabaseClient } from '@/supabase/clients/server';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

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
          <main className="flex-1 pt-header-height">{children}</main>
          <Footer />
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
