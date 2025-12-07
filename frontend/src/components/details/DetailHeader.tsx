interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  authors?: string[];
  badges?: React.ReactNode;
}

export default function DetailHeader({ title, subtitle, authors, badges }: DetailHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-start gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="text-slate-900 text-3xl sm:text-4xl font-black tracking-tighter">{title}</h1>
        {subtitle && <p className="text-slate-500 text-lg font-medium">{subtitle ?? ''}</p>}
        {authors && (
          <p className="text-slate-500 text-lg font-medium">{`著者: ${authors.map((author) => author).join(', ')}`}</p>
        )}
      </div>
      {badges && <div className="flex items-center gap-3">{badges}</div>}
    </div>
  );
}
