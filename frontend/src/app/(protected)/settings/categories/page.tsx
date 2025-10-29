import { getCategories } from '@/app/(protected)/categories/_lib/queries';
import CategoriesView from '@/app/(protected)/settings/categories/_components/display/CategoriesView';
import ErrorMessage from '@/components/ErrorMessage';

export default async function SettingsCategoriesPage() {
  const categories = await getCategories();

  if ('error' in categories) {
    return <ErrorMessage message={categories.error} />;
  }

  return <CategoriesView categories={categories} />;
}
