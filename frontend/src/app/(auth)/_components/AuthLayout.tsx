import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  alternativeText: string;
  alternativeHref: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  alternativeText,
  alternativeHref,
  children,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm text-slate-600">
              または{' '}
              <Link href={alternativeHref} className="font-medium text-sky-600 hover:text-sky-500">
                {alternativeText}
              </Link>
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
