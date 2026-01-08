'use client';

import { useEffect, useState } from 'react';
import { LogoutButton } from '@/app/(auth)/logout/LogoutButton';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/supabase/clients/browser';

interface HeaderProps {
  initialAuth?: boolean;
}

export default function Header({ initialAuth }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    // 初期状態を取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="text-lg font-semibold tracking-tight text-gray-900">
          <Link href={isAuthenticated ? '/top' : '/'}>ぽんダナ</Link>
        </div>
        <nav>
          <ul className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <li className="transition-colors hover:text-gray-900">
              <Link href="/about">About</Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="transition-colors hover:text-gray-900">
                  <Link href="/register">新規登録</Link>
                </li>
                <li className="transition-colors hover:text-gray-900">
                  <Link href="/login">ログイン</Link>
                </li>
              </>
            ) : (
              <li className="transition-colors hover:text-gray-900">
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
