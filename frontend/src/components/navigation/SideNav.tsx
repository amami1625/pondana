'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS } from '@/constants/navItems';
import { useProfile } from '@/hooks/useProfile';

export default function SideNav() {
  const pathname = usePathname();
  const { data: profile } = useProfile();

  return (
    <aside className="fixed left-0 top-header-height bottom-0 z-40 flex w-64 flex-col gap-y-6 border-r border-slate-200 bg-white p-4 overflow-y-auto">
      <div className="flex flex-col gap-4">
        {/* ユーザープロフィール */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white font-bold">
            {profile?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-base font-medium leading-normal">
              {profile?.name || 'ロード中...'}
            </h1>
          </div>
        </div>

        {/* ナビゲーションリンク */}
        <nav className="flex flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <Icon size={20} />
                <p className="text-sm font-medium leading-normal">{item.label}</p>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
