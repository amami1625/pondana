interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function FilterChip({ label, isSelected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
      }`}
    >
      <p className="text-sm font-medium leading-normal">{label}</p>
    </button>
  );
}
