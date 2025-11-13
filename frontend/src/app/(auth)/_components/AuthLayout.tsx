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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            または{' '}
            <Link href={alternativeHref} className="font-medium text-blue-600 hover:text-blue-500">
              {alternativeText}
            </Link>
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
