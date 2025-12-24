'use client';

import { List } from '@/schemas/list';
import ListCard from '@/app/(protected)/lists/_components/display/ListCard';

interface UserListsViewProps {
  lists: List[];
}

export default function UserListsView({ lists }: UserListsViewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">公開リスト</h2>
      {lists.length === 0 ? (
        <p className="text-slate-500 text-center py-8">公開しているリストはありません</p>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      )}
    </div>
  );
}
