import { getProfileData } from './_lib/queries';

export default async function TopPage() {
  const profileData = await getProfileData();

  if ('error' in profileData) {
    return <p>{profileData.error}</p>;
  }

  return (
    <div>
      <p>{profileData.name}</p>
      <p>{profileData.supabase_uid}</p>
    </div>
  );
}
