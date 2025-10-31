import ErrorMessage from '@/components/ErrorMessage';
import { getAuthors } from '@/app/(protected)/authors/_lib/queries';
import AuthorsView from '@/app/(protected)/settings/authors/_components/display/AuthorsView';

export default async function SettingsAuthorsPage() {
  const authors = await getAuthors();

  if ('error' in authors) {
    return <ErrorMessage message={authors.error} />;
  }

  return <AuthorsView authors={authors} />;
}
