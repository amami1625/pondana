import Link from 'next/link';
import { BreadcrumbItem } from '@/constants/breadcrumbs';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="text-slate-500 hover:text-primary text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 text-sm font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-slate-400">/</span>}
        </div>
      ))}
    </nav>
  );
}
