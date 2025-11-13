import { Home, BookOpen, ListTodo, Lightbulb } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/top', label: 'ホーム', icon: Home },
  { href: '/books', label: 'すべての本', icon: BookOpen },
  { href: '/lists', label: 'マイリスト', icon: ListTodo },
  { href: '/cards', label: 'カード', icon: Lightbulb },
] as const;
