import { ReactNode } from 'react';
import ErrorMessage from '@/components/ErrorMessage';

interface DetailContainerProps {
  error?: string;
  children: ReactNode;
}

export default function DetailContainer({ error, children }: DetailContainerProps) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      {error && <ErrorMessage message={error} />}
      <article className="flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        {children}
      </article>
    </section>
  );
}
