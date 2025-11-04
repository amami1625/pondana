import BookDetailView from '@/app/(protected)/books/_components/display/BookDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: PageProps) {
  const { id } = await params;

  return <BookDetailView id={Number(id)} />;
}
