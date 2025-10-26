interface DetailSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">{title}</h2>
      {children}
    </section>
  );
}
