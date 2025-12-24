import { Home, BookOpen, ListTodo, Lightbulb, Settings, Search, User } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/top', label: 'ホーム', icon: Home },
  { href: '/users/search', label: 'ユーザーを検索', icon: User },
  { href: '/books/search', label: '本を検索', icon: Search },
  { href: '/books', label: '本棚', icon: BookOpen },
  { href: '/lists', label: 'リスト', icon: ListTodo },
  { href: '/cards', label: 'カード', icon: Lightbulb },
  { href: '/settings', label: '設定', icon: Settings },
] as const;
