import Link from 'next/link';
import { BreadcrumbItem } from '@/constants/breadcrumbs';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2 min-w-0">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 min-w-0 flex-shrink">
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-500 hover:text-primary text-sm font-medium transition-colors truncate"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 text-sm font-medium truncate">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-slate-400 flex-shrink-0">/</span>}
        </div>
      ))}
    </nav>
  );
}
