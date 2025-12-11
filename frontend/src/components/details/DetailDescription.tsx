interface DetailDescriptionProps {
  description: string | null;
}

export default function DetailDescription({ description }: DetailDescriptionProps) {
  return (
    <p className="text-slate-600 text-base font-normal leading-relaxed">
      {description ?? '説明が登録されていません'}
    </p>
  );
}
