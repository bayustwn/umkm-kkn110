import { useState } from 'react';
import useNavigation from '@/hooks/useNavigation';
import { useUmkm, useCategories } from '@/hooks/useUmkm';
import UmkmCard from '@/components/ui/UmkmCard';
import CategoryCheckboxes from '@/components/ui/CategoryCheckboxes';
import { CategorySkeleton, UmkmCardSkeleton } from '@/components/skeletons';

export default function UmkmPage() {
  const [showModal, setShowModal] = useState(false);
  const { goToUmkmDetail } = useNavigation();
  const { data: umkm = [], isLoading: umkmLoading } = useUmkm();
  const { data: category = [], isLoading: catLoading } = useCategories();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const isLoading = umkmLoading || catLoading;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const filteredUMKM = umkm.filter((item) => {
    const matchCategory =
      selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const handleApply = () => {
    setShowModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-10 pb-20 px-5 md:px-0 md:py-[3%] md:px-[6%]">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <img src="/icons/logo-black.svg" alt="logo" />
        <div className="flex flex-row items-center mt-5 md:mt-0 gap-2">
          <div>
            <div className="flex items-center border rounded-full px-1 py-1 w-full bg-white shadow-sm">
              <input
                type="text"
                placeholder="Cari umkm..."
                className="outline-none pl-4 border-none bg-transparent w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 mt-10 md:mt-20">
        {isLoading ? (
          <CategorySkeleton />
        ) : (
          <div className="w-[15%] hidden md:block md:sticky md:top-5 h-fit">
            <h1 className="font-semibold text-lg mb-5">Pilih Kategori</h1>
            <CategoryCheckboxes
              categories={category}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              onClearAll={() => setSelectedCategories([])}
            />
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="fixed z-50 bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg md:hidden flex items-center gap-2 cursor-pointer"
          aria-label="Filter Kategori"
        >
          <img src="/icons/category.svg" className="w-6 h-6" alt="filter" />
        </button>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            <div className="relative bg-white w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto transition-transform duration-300 ease-out translate-y-0 animate-slideup">
              <h2 className="font-bold text-lg mb-4">Pilih Kategori</h2>
              <CategoryCheckboxes
                categories={category}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onClearAll={() => setSelectedCategories([])}
                onApply={handleApply}
                mobile
              />
            </div>
          </div>
        )}

        <div className="w-full md:w-[80%]">
          <h1 className="font-bold text-3xl">UMKM Manukan Wetan</h1>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <UmkmCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {filteredUMKM.length === 0 ? (
                <p className="col-span-4 text-center text-gray-500 py-10">UMKM tidak ditemukan</p>
              ) : (
                filteredUMKM.map((item) => (
                  <UmkmCard
                    key={item.id}
                    id={item.id}
                    name={item.name}
                    description={item.description}
                    image={item.image}
                    address={item.address}
                    category={item.category}
                    lowestPrice={item.lowestPrice}
                    productCount={item.productCount}
                    onNavigate={goToUmkmDetail}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
