'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/settings', label: 'プロフィール' },
  { href: '/settings/categories', label: 'カテゴリー' },
  { href: '/settings/tags', label: 'タグ' },
  { href: '/settings/statuses', label: 'ステータス' },
] as const;

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 rounded-lg border border-gray-200 bg-white">
      <ul className="flex overflow-x-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex-shrink-0">
              <Link
                href={item.href}
                className={`block px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
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
