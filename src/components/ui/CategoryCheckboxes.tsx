import type { Category } from '@/types';

interface CategoryCheckboxesProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (cat: string) => void;
  onClearAll: () => void;
  onApply?: () => void;
  mobile?: boolean;
  children?: React.ReactNode;
}

export default function CategoryCheckboxes({
  categories,
  selectedCategories,
  onCategoryChange,
  onClearAll,
  onApply,
  mobile = false,
  children,
}: CategoryCheckboxesProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-2 items-center">
        <input
          className="w-4 h-4 accent-primary"
          type="checkbox"
          checked={selectedCategories.length === 0}
          onChange={onClearAll}
        />
        <p>Semua</p>
      </div>
      {categories.map((cat) => (
        <div key={cat.id} className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <input
              className="w-4 h-4 accent-primary"
              type="checkbox"
              checked={selectedCategories.includes(cat.name)}
              onChange={() => onCategoryChange(cat.name)}
            />
            <p>{cat.name}</p>
          </div>
          {children}
        </div>
      ))}
      {mobile && onApply && (
        <button
          onClick={onApply}
          className="mt-6 w-full bg-primary text-white py-2 rounded-full font-semibold"
        >
          Terapkan
        </button>
      )}
    </div>
  );
}
