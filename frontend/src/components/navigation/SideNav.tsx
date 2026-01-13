'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/constants/navItems';
import { useProfile } from '@/hooks/useProfile';

export default function SideNav() {
  const pathname = usePathname();
  const { data: profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ハンバーガーメニューボタン（タブレット以下で表示） */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-15 right-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
        aria-label="メニューを開く"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* オーバーレイ（タブレット以下でメニューが開いているとき） */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドナビゲーション */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-40 flex w-64 flex-col gap-y-6 border-l border-slate-200 bg-white p-4 overflow-y-auto transition-transform duration-300 ease-in-out
          lg:left-0 lg:right-auto lg:border-r lg:border-l-0 lg:translate-x-0 lg:top-header-height
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col gap-4 pt-16 lg:pt-0">
          {/* ユーザープロフィール */}
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white font-bold">
              {profile?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 text-base font-medium leading-normal">
                <Link href={`/users/${profile?.id}`} onClick={() => setIsOpen(false)}>
                  {profile?.name || 'ロード中...'}
                </Link>
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
                  onClick={() => setIsOpen(false)}
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
    </>
  );
}
