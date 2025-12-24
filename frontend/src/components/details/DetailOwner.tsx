import Link from 'next/link';

interface DetailOwnerProps {
  userId: number;
  name: string;
}

export default function DetailOwner({ userId, name }: DetailOwnerProps) {
  return (
    <div className="mb-4">
      <Link
        href={`/users/${userId}`}
        className="text-sm text-slate-600 hover:text-primary transition-colors"
      >
        {name}さんのリスト
      </Link>
    </div>
  );
}
