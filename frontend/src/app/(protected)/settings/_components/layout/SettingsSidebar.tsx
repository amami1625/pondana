'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/settings', label: 'プロフィール' },
  { href: '/settings/authors', label: '著者' },
  { href: '/settings/categories', label: 'カテゴリー' },
  { href: '/settings/tags', label: 'タグ' },
] as const;

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="rounded-lg border border-gray-200 bg-white">
      <ul className="divide-y divide-gray-100">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
