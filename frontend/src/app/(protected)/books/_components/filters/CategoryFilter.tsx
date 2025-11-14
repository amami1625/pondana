import FilterChip from '@/app/(protected)/books/_components/filters/FilterChip';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 pb-6 border-b border-slate-200 overflow-x-auto">
      {/* すべて */}
      <FilterChip
        label="すべて"
        isSelected={selectedCategory === null}
        onClick={() => onSelectCategory(null)}
      />

      {/* カテゴリチップ */}
      {categories.map((category) => (
        <FilterChip
          key={category}
          label={category}
          isSelected={selectedCategory === category}
          onClick={() => onSelectCategory(category)}
        />
      ))}
    </div>
  );
}
