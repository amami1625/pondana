import ListDetailView from '@/app/(protected)/lists/_components/display/ListDetailView';

interface ListPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListPage({ params }: ListPageProps) {
  const { id } = await params;

  return <ListDetailView id={Number(id)} />;
}
