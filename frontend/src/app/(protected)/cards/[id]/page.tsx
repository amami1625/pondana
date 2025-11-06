import CardDetailView from '../_components/display/CardDetailView';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CardPage({ params }: PageProps) {
  const { id } = await params;

  return <CardDetailView id={Number(id)} />;
}
