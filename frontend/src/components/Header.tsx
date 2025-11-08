import { LogoutButton } from '@/app/(auth)/logout/LogoutButton';
import Link from 'next/link';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight text-gray-900">
          <Link href={isAuthenticated ? '/top' : '/'}>ぽんダナ</Link>
        </h1>
        <nav>
          <ul className="flex items-center gap-4 text-sm font-medium text-gray-600">
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
              <>
                <li className="transition-colors hover:text-gray-900">
                  <Link href="/books">Books</Link>
                </li>
                <li className="transition-colors hover:text-gray-900">
                  <Link href="/lists">Lists</Link>
                </li>
                <li className="transition-colors hover:text-gray-900">
                  <Link href="/cards">Cards</Link>
                </li>
                <li className="transition-colors hover:text-gray-900">
                  <Link href="/settings">Settings</Link>
                </li>
                <li className="transition-colors hover:text-gray-900">
                  <LogoutButton />
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
