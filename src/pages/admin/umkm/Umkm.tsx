import { useState } from 'react';
import useNavigation from '@/hooks/useNavigation';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUmkmAdmin, useCategories, useDeleteUmkm, useApproveUmkm, useCreateCategory, useDeleteCategory } from '@/hooks/useUmkm';
import { CategorySkeleton, UmkmCardSkeleton } from '@/components/skeletons';
import ConfirmModal from '@/components/ui/ConfirmModal';
import type { AdminUmkmItem, Category } from '@/types';

export default function UmkmAdmin() {
  const [showModal, setShowModal] = useState(false);
  const { goToUmkmDetail } = useNavigation();
  const navigate = useNavigate();
  const { data: umkm = [], isLoading: umkmLoading } = useUmkmAdmin();
  const { data: category = [], isLoading: catLoading } = useCategories();
  const deleteUmkm = useDeleteUmkm();
  const approveUmkm = useApproveUmkm();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const isLoading = umkmLoading || catLoading;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [umkmToDelete, setUmkmToDelete] = useState<AdminUmkmItem | null>(null);
  const [umkmToApprove, setUmkmToApprove] = useState<AdminUmkmItem | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const filteredUMKM = umkm.filter((item) => {
    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchStatus && matchSearch;
  });

  const handleApply = () => { setShowModal(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) { toast.error('Nama kategori tidak boleh kosong'); return; }
    createCategory.mutate(newCategoryName.trim(), {
      onSuccess: () => { setNewCategoryName(''); setShowAddCategoryModal(false); },
    });
  };

  const CategoryCheckboxes = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-2 items-center">
        <input className="w-4 h-4 accent-primary" type="checkbox" checked={selectedCategories.length === 0} onChange={() => setSelectedCategories([])} />
        <p>Semua</p>
      </div>
      {category.map((cat) => (
        <div key={cat.id} className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <input className="w-4 h-4 accent-primary" type="checkbox" checked={selectedCategories.includes(cat.name)} onChange={() => handleCategoryChange(cat.name)} />
            <p>{cat.name}</p>
          </div>
          <button onClick={() => setCategoryToDelete(cat)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-sm" title="Hapus kategori">✕</button>
        </div>
      ))}
      <button onClick={() => { if (mobile) setShowModal(false); setShowAddCategoryModal(true); }} className="mt-4 w-fit bg-primary text-white py-1 px-3 rounded-full hover:bg-primary/90 transition-colors text-sm font-medium">+ Tambah</button>
      {mobile && <button onClick={handleApply} className="mt-6 w-full bg-primary text-white py-2 rounded-full font-semibold">Terapkan</button>}
    </div>
  );

  const renderUmkmCard = (item: AdminUmkmItem) => (
    <div key={item.id} className="mt-5 flex w-full flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md">
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-60 object-cover rounded-md" />
        <div className="absolute top-3 left-3 justify-center bg-primary w-fit px-4 text-white border border-primary text-sm py-1 rounded-full"><p>{item.category}</p></div>
      </div>
      <div className={`w-fit px-3 text-white border text-xs py-1 rounded-full mb-2 ${item.status === 'active' ? 'bg-green-500 border-green-500' : 'bg-yellow-500 border-yellow-500'}`}>
        <p>{item.status === 'active' ? 'Aktif' : 'Pending'}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-xs text-gray-500 font-mono">ID: {item.id}</p>
        <button onClick={() => { navigator.clipboard.writeText(item.id); toast.success('ID berhasil disalin!'); }} className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer" title="Salin ID">📋</button>
      </div>
      <h1 className="font-bold text-lg line-clamp-1">{item.name}</h1>
      <p className="line-clamp-2 text-sm">{item.description}</p>
      <div>
        <div className="my-4">
          <div className="flex flex-row gap-2 items-center"><img src="/icons/location.svg" alt="location" className="w-4 h-4" /><p className="text-sm line-clamp-1">{item.address}</p></div>
          <div className="flex flex-row gap-2 mt-3 items-center"><img src="/icons/product.svg" alt="product" className="w-4 h-4" /><p className="text-sm">{item.jumlahProduk} Produk</p></div>
        </div>
        <div className="mt-5 flex flex-row items-center justify-between">
          <div className="flex flex-col items-start"><p className="text-sm">Mulai dari</p><p className="text-lg font-bold">Rp {item.hargaTermurah}</p></div>
          <div className="flex gap-2 mt-2">
            <button onClick={() => setUmkmToDelete(item)} className="text-sm font-medium text-red-600 transition-colors cursor-pointer">Hapus</button>
            <button onClick={() => navigate(`/admin/umkm/edit/${item.id}`)} className="text-sm font-medium text-primary transition-colors cursor-pointer">Edit</button>
            {item.status === 'pending' && <button onClick={() => setUmkmToApprove(item)} className="text-sm font-medium text-green-600 transition-colors cursor-pointer">Setujui</button>}
            <button onClick={() => goToUmkmDetail(item.id)} className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer">Lihat →</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-10 md:px-0 md:py-[2%] md:px-5">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola UMKM</h1>
        <div className="flex flex-col md:flex-row items-center mt-5 md:mt-0 gap-2">
          <div>
            <div className="flex items-center border rounded-full px-1 py-1 w-full max-w-lg bg-white shadow-sm">
              <input type="text" placeholder="Cari nama atau ID UMKM..." className="outline-none pl-4 border-none bg-transparent w-full" value={search} onChange={e => setSearch(e.target.value)} />
              <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
            </div>
          </div>
          <div className="flex-row flex gap-2 items-center">
            <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors outline-none">
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="pending">Pending</option>
            </select>
            <button onClick={() => navigate('/admin/umkm/tambah')} className="bg-primary hover:bg-primary/80 text-white p-2 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-5 mt-10">
        {isLoading ? <CategorySkeleton /> : (
          <div className="w-[15%] hidden md:block md:sticky md:top-5 h-fit">
            <h1 className="font-semibold text-lg mb-5">Pilih Kategori</h1>
            <CategoryCheckboxes />
          </div>
        )}

        <button onClick={() => setShowModal(true)} className="fixed z-50 bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg md:hidden flex items-center gap-2" aria-label="Filter Kategori">
          <img src="/icons/category.svg" className="w-6 h-6" alt="filter" />
        </button>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-end md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
            <div className="relative bg-white w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto transition-transform duration-300 ease-out translate-y-0 animate-slideup">
              <h2 className="font-bold text-lg mb-4">Pilih Kategori</h2>
              <CategoryCheckboxes mobile />
            </div>
          </div>
        )}

        <div className="w-full md:w-[80%]">
          <h1 className="font-bold text-3xl mb-6">UMKM Manukan Wetan</h1>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{Array.from({ length: 9 }).map((_, i) => <UmkmCardSkeleton key={i} />)}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredUMKM.length === 0 ? <p className="col-span-4 text-center text-gray-500 py-10">UMKM tidak ditemukan</p> : filteredUMKM.map(renderUmkmCard)}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal isOpen={!!umkmToDelete} onClose={() => setUmkmToDelete(null)} onConfirm={() => { if (!umkmToDelete) return; deleteUmkm.mutate(umkmToDelete.id, { onSettled: () => setUmkmToDelete(null) }); }} title="Konfirmasi Hapus UMKM" message={`Apakah Anda yakin ingin menghapus UMKM <span class="font-semibold">"${umkmToDelete?.name}"</span>?<br/><span class="text-red-600 text-xs">Semua produk, foto UMKM, dan foto produk yang terkait juga akan dihapus.</span>`} confirmText="Hapus" isLoading={deleteUmkm.isPending} variant="danger" />

      <ConfirmModal isOpen={!!umkmToApprove} onClose={() => setUmkmToApprove(null)} onConfirm={() => { if (!umkmToApprove) return; approveUmkm.mutate(umkmToApprove.id, { onSettled: () => setUmkmToApprove(null) }); }} title="Konfirmasi Setujui UMKM" message={`Apakah Anda yakin ingin menyetujui UMKM <span class="font-semibold">"${umkmToApprove?.name}"</span>?`} confirmText="Setujui" isLoading={approveUmkm.isPending} variant="success" />

      <ConfirmModal isOpen={!!categoryToDelete} onClose={() => setCategoryToDelete(null)} onConfirm={() => { if (!categoryToDelete) return; deleteCategory.mutate(categoryToDelete.id, { onSettled: () => setCategoryToDelete(null) }); setSelectedCategories(prev => prev.filter(c => c !== categoryToDelete.name)); }} title="Konfirmasi Hapus Kategori" message={`Apakah Anda yakin ingin menghapus kategori <span class="font-semibold">"${categoryToDelete?.name}"</span>?<br/><span class="text-red-600 text-xs">Kategori yang masih digunakan oleh UMKM tidak dapat dihapus.</span>`} confirmText="Hapus" isLoading={deleteCategory.isPending} variant="danger" />

      {showAddCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-black/50" onClick={() => setShowAddCategoryModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tambah Kategori Baru</h3>
              <div className="mb-6">
                <input type="text" placeholder="Nama kategori" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none" onKeyPress={e => e.key === 'Enter' && handleAddCategory()} />
              </div>
              <div className="flex gap-2 justify-center">
                <button onClick={() => setShowAddCategoryModal(false)} className="cursor-pointer px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-full hover:bg-gray-200 transition-colors">Batal</button>
                <button onClick={handleAddCategory} disabled={createCategory.isPending || !newCategoryName.trim()} className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{createCategory.isPending ? 'Menambahkan...' : 'Tambah Kategori'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}