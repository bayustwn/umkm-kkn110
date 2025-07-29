import { useEffect, useState } from 'react';
import RouterNavigation from '../../../utils/navigation';
import Api from '../../../components/Api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Skeleton Components
const CategorySkeleton = () => (
  <div className="w-[15%] hidden md:block md:sticky md:top-5 h-fit">
    <div className="h-6 bg-gray-200 rounded-md w-32 mb-5 animate-pulse"></div>
    <div className="flex flex-col gap-3">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse mt-4"></div>
    </div>
  </div>
);

const UmkmCardSkeleton = () => (
  <div className="mt-5 flex w-full flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md p-4">
    <div className="relative">
      <div className="w-full h-60 bg-gray-200 rounded-md animate-pulse"></div>
      <div className="absolute top-3 left-3 bg-gray-300 w-20 h-6 rounded-full animate-pulse"></div>
    </div>
    <div className="w-16 h-5 bg-gray-200 rounded-full animate-pulse mb-2"></div>
    <div className="flex items-center gap-2 mb-2">
      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
      <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
    </div>
    <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-4"></div>
    <div className="my-4">
      <div className="flex flex-row gap-2 items-center mb-3">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>
    </div>
    <div className="mt-5 flex flex-row items-center justify-between">
      <div className="flex flex-col items-start">
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse mb-1"></div>
        <div className="h-5 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
      <div className="flex gap-2 mt-2">
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const UmkmGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
      <UmkmCardSkeleton key={index} />
    ))}
  </div>
);

export default function UmkmAdmin() {
    const [showModal, setShowModal] = useState(false);
    const [category, setCategory] = useState<any>([]);
    const { goToUMKMDetail } = RouterNavigation();
    const navigate = useNavigate();
    const [umkm, setUmkm] = useState<any>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [search, setSearch] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [umkmToDelete, setUmkmToDelete] = useState<any>(null);
    const [umkmToApprove, setUmkmToApprove] = useState<any>(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
    const [isDeletingCategory, setIsDeletingCategory] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleCategoryChange = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const filteredUMKM = umkm.filter((item: any) => {
        const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
        const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
        const matchSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.id.toLowerCase().includes(search.toLowerCase());
        return matchCategory && matchStatus && matchSearch;
    });

    const handleApply = () => {
        setShowModal(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getAllUMKM = async () => {
        try {
            await Api.get("/umkm/admin").then(res => {
                setUmkm(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data umkm")
        }
    }

    const getAllCategory = async () => {
        try {
            await Api.get("/umkm/category").then(res => {
                setCategory(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data kategori")
        }
    }

    const loadData = async () => {
        try {
            setIsLoading(true);
            await Promise.all([getAllUMKM(), getAllCategory()]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleEdit = (id: string) => {
        navigate(`/admin/umkm/edit/${id}`);
    };

    const handleDeleteClick = (umkmItem: any) => {
        setUmkmToDelete(umkmItem);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!umkmToDelete) return;
        
        setShowDeleteModal(false);
        setIsDeleting(true);
        
        try {
            await Api.delete(`/umkm/${umkmToDelete.id}`);
            toast.success('UMKM berhasil dihapus');
            getAllUMKM(); 
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Gagal menghapus UMKM');
        } finally {
            setIsDeleting(false);
            setUmkmToDelete(null);
        }
    };

    const handleApproveClick = (umkmItem: any) => {
        setUmkmToApprove(umkmItem);
        setShowApproveModal(true);
    };

    const handleApprove = async () => {
        if (!umkmToApprove) return;
        
        setShowApproveModal(false);
        setIsApproving(true);
        
        try {
            await Api.patch(`/umkm/approve/${umkmToApprove.id}`);
            toast.success('UMKM berhasil disetujui');
            getAllUMKM(); 
        } catch (error) {
            toast.error('Gagal menyetujui UMKM');
        } finally {
            setIsApproving(false);
            setUmkmToApprove(null);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error('Nama kategori tidak boleh kosong');
            return;
        }
        
        setIsAddingCategory(true);
        
        try {
            await Api.post('/umkm/category', { name: newCategoryName.trim() });
            toast.success('Kategori berhasil ditambahkan');
            setNewCategoryName('');
            setShowAddCategoryModal(false);
            getAllCategory();
        } catch (error) {
            toast.error('Gagal menambahkan kategori');
        } finally {
            setIsAddingCategory(false);
        }
    };

    const handleDeleteCategoryClick = (category: any) => {
        setCategoryToDelete(category);
        setShowDeleteCategoryModal(true);
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        
        setShowDeleteCategoryModal(false);
        setIsDeletingCategory(true);
        
        try {
            await Api.delete(`/umkm/category/${categoryToDelete.id}`);
            toast.success('Kategori berhasil dihapus');
            getAllCategory();
            // Reset selected categories if the deleted category was selected
            setSelectedCategories(prev => prev.filter(cat => cat !== categoryToDelete.name));
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Gagal menghapus kategori');
        } finally {
            setIsDeletingCategory(false);
            setCategoryToDelete(null);
        }
    };

    useEffect(() => {
        loadData();
    }, [])

    return (
        <div className="py-10 md:px-0 md:py-[2%] md:px-5">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Kelola UMKM</h1>
                <div className="flex flex-col md:flex-row items-center mt-5 md:mt-0 gap-2">
                    <div>
                        <div className="flex items-center border rounded-full px-1 py-1 w-full max-w-lg bg-white shadow-sm">
                            <input
                                type="text"
                                placeholder="Cari nama atau ID UMKM..."
                                className="outline-none pl-4 border-none bg-transparent w-full"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
                        </div>
                    </div>
                    <div className='flex-row flex gap-2 items-center'>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors outline-none"
                    >
                        <option value="all">Semua Status</option>
                        <option value="active">Aktif</option>
                        <option value="pending">Pending</option>
                    </select>
                    <button
                        onClick={() => navigate('/admin/umkm/tambah')}
                        className="bg-primary hover:bg-primary/80 text-white p-2 rounded-full transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 mt-10">
                {/* Category Sidebar */}
                {isLoading ? (
                    <CategorySkeleton />
                ) : (
                    <div className="w-[15%] hidden md:block md:sticky md:top-5 h-fit">
                        <h1 className="font-semibold text-lg mb-5">Pilih Kategori</h1>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row gap-2 items-center">
                                <input
                                    className="w-4 h-4 accent-primary"
                                    type="checkbox"
                                    checked={selectedCategories.length === 0}
                                    onChange={() => setSelectedCategories([])}
                                />
                                <p>Semua</p>
                            </div>
                            {category.map((cat: any, index: any) => (
                                <div key={index} className="flex flex-row gap-2 items-center justify-between">
                                    <div className="flex flex-row gap-2 items-center">
                                        <input
                                            className="w-4 h-4 accent-primary"
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.name)}
                                            onChange={() => handleCategoryChange(cat.name)}
                                        />
                                        <p>{cat.name}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteCategoryClick(cat)}
                                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-sm"
                                        title="Hapus kategori"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={() => setShowAddCategoryModal(true)}
                                className="mt-4 w-fit bg-primary text-white py-1 px-3 rounded-full hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                                + Tambah
                            </button>
                        </div>
                    </div>
                )}

                {/* Mobile Filter Button */}
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed z-50 bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg md:hidden flex items-center gap-2"
                    aria-label="Filter Kategori"
                >
                    <img src="/icons/category.svg" className="w-6 h-6" alt="filter" />
                </button>

                {/* Mobile Filter Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-end md:hidden">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
                        <div className="relative bg-white w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto transition-transform duration-300 ease-out translate-y-0 animate-slideup">
                            <h2 className="font-bold text-lg mb-4">Pilih Kategori</h2>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-row gap-2 items-center">
                                    <input
                                        className="w-4 h-4 accent-primary"
                                        type="checkbox"
                                        checked={selectedCategories.length === 0}
                                        onChange={() => setSelectedCategories([])}
                                    />
                                    <p>Semua</p>
                                </div>
                                {category.map((cat: any, index: any) => (
                                    <div key={index} className="flex flex-row gap-2 items-center justify-between">
                                        <div className="flex flex-row gap-2 items-center">
                                            <input
                                                className="w-4 h-4 accent-primary"
                                                type="checkbox"
                                                checked={selectedCategories.includes(cat.name)}
                                                onChange={() => handleCategoryChange(cat.name)}
                                            />
                                            <p>{cat.name}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategoryClick(cat)}
                                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer text-sm"
                                            title="Hapus kategori"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setShowAddCategoryModal(true);
                                    }}
                                    className="mt-4 w-fit bg-primary text-white py-1 px-3 rounded-full hover:bg-primary/90 transition-colors text-sm font-medium"
                                >
                                    + Tambah
                                </button>
                            </div>
                            <button onClick={handleApply} className="mt-6 w-full bg-primary text-white py-2 rounded-full font-semibold">Terapkan</button>
                        </div>
                    </div>
                )}

                {/* UMKM Grid */}
                <div className="w-full md:w-[80%]">
                    <h1 className="font-bold text-3xl mb-6">UMKM Manukan Wetan</h1>
                    {isLoading ? (
                        <UmkmGridSkeleton />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {filteredUMKM.length === 0 ? (
                                <p className="col-span-4 text-center text-gray-500 py-10">UMKM tidak ditemukan</p>
                            ) : (
                                filteredUMKM?.map((umkm: any, index: any) => {
                                    return (
                                        <div key={index} className="mt-5 flex w-full flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md">
                                            <div className="relative">
                                                <img src={umkm.image} alt="manukan" className="w-full h-60 object-cover rounded-md" />
                                                <div className="absolute top-3 left-3 justify-center bg-primary w-fit px-4 text-white border border-primary text-sm py-1 rounded-full">
                                                    <p>{umkm.category}</p>
                                                </div>
                                            </div>
                                            <div className={`w-fit px-3 text-white border text-xs py-1 rounded-full mb-2 ${
                                                umkm.status === 'active' 
                                                    ? 'bg-green-500 border-green-500' 
                                                    : 'bg-yellow-500 border-yellow-500'
                                            }`}>
                                                <p>{umkm.status === 'active' ? 'Aktif' : 'Pending'}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-gray-500 font-mono">ID: {umkm.id}</p>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(umkm.id);
                                                        toast.success('ID berhasil disalin!');
                                                    }}
                                                    className="text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                                    title="Salin ID"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                            <h1 className="font-bold text-lg line-clamp-1">{umkm.name}</h1>
                                            <p className="line-clamp-2 text-sm">{umkm.description}</p>
                                            <div>
                                                <div className="my-4">
                                                    <div className="flex flex-row gap-2 items-center">
                                                        <img src="/icons/location.svg" alt="location" className="w-4 h-4" />
                                                        <p className="text-sm line-clamp-1">{umkm.address}</p>
                                                    </div>
                                                    <div className="flex flex-row gap-2 mt-3 items-center">
                                                        <img src="/icons/product.svg" alt="product" className="w-4 h-4" />
                                                        <p className="text-sm">{umkm.jumlahProduk} Produk</p>
                                                    </div>
                                                </div>
                                                <div className="mt-5 flex flex-row items-center justify-between">
                                                    <div className="flex flex-col items-start">
                                                        <p className="text-sm">Mulai dari</p>
                                                        <p className="text-lg font-bold">Rp {umkm.hargaTermurah}</p>
                                                    </div>
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleDeleteClick(umkm)}
                                                            className="text-sm font-medium text-red-600 transition-colors cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                        <button
                                                            onClick={() => handleEdit(umkm.id)}
                                                            className="text-sm font-medium text-primary transition-colors cursor-pointer"
                                                        >
                                                            Edit
                                                        </button>
                                                        {umkm.status === 'pending' && (
                                                            <button
                                                                onClick={() => handleApproveClick(umkm)}
                                                                className="text-sm font-medium text-green-600 transition-colors cursor-pointer"
                                                            >
                                                                Setujui
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => goToUMKMDetail(umkm.id)}
                                                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                                                        >
                                                            Lihat →
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-black/50" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus UMKM</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus UMKM <span className="font-semibold">"{umkmToDelete?.name}"</span>?
                                <br />
                                <span className="text-red-600 text-xs">Semua produk, foto UMKM, dan foto produk yang terkait juga akan dihapus.</span>
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showApproveModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-black/50" onClick={() => setShowApproveModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Setujui UMKM</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Apakah Anda yakin ingin menyetujui UMKM <span className="font-semibold">"{umkmToApprove?.name}"</span>?
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setShowApproveModal(false)}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isApproving}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isApproving ? 'Menyetujui...' : 'Setujui'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showAddCategoryModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-black/50" onClick={() => setShowAddCategoryModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tambah Kategori Baru</h3>
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Nama kategori"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-primary outline-none"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                                />
                            </div>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setShowAddCategoryModal(false)}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleAddCategory}
                                    disabled={isAddingCategory || !newCategoryName.trim()}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-primary rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAddingCategory ? 'Menambahkan...' : 'Tambah Kategori'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Category Modal */}
            {showDeleteCategoryModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black bg-black/50" onClick={() => setShowDeleteCategoryModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Hapus Kategori</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Apakah Anda yakin ingin menghapus kategori <span className="font-semibold">"{categoryToDelete?.name}"</span>?
                                <br />
                                <span className="text-red-600 text-xs">Kategori yang masih digunakan oleh UMKM tidak dapat dihapus.</span>
                            </p>
                            <div className="flex gap-2 justify-center">
                                <button
                                    onClick={() => setShowDeleteCategoryModal(false)}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-primary bg-primary/10 border border-primary rounded-full hover:bg-gray-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleDeleteCategory}
                                    disabled={isDeletingCategory}
                                    className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeletingCategory ? 'Menghapus...' : 'Hapus'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}