interface DetailMetadataProps {
  children: React.ReactNode;
}

export default function DetailMetadata({ children }: DetailMetadataProps) {
  return (
    <section className="grid gap-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600 md:grid-cols-2">
      {children}
    </section>
  );
}
