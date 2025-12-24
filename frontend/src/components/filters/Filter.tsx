import FilterChip from '@/components/filters/FilterChip';

interface FilterProps {
  items: string[];
  selectedItem: string | null;
  onSelectItem: (item: string | null) => void;
}

export default function Filter({ items, selectedItem, onSelectItem }: FilterProps) {
  return (
    <div className="flex gap-2 pb-6 border-b border-slate-200 overflow-x-auto">
      {/* すべて */}
      <FilterChip
        label="すべて"
        isSelected={selectedItem === null}
        onClick={() => onSelectItem(null)}
      />

      {/* フィルターチップ */}
      {items.map((item) => (
        <FilterChip
          key={item}
          label={item}
          isSelected={selectedItem === item}
          onClick={() => onSelectItem(item)}
        />
      ))}
    </div>
  );
}
