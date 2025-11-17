interface DetailCardProps {
  children: React.ReactNode;
}

export default function DetailCard({ children }: DetailCardProps) {
  return (
    <div className="flex flex-col gap-6 p-6 sm:p-8 bg-white rounded-xl border border-slate-200">
      {children}
    </div>
  );
}
