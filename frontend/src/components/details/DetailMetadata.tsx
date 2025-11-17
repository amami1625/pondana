interface DetailMetadataProps {
  createdAt: string;
  updatedAt: string;
}

export default function DetailMetadata({ createdAt, updatedAt }: DetailMetadataProps) {
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 pt-2 border-t border-slate-200">
      <span>登録日: {createdAt}</span>
      <span>更新日: {updatedAt}</span>
    </div>
  );
}
