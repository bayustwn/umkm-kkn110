import { useEffect, useState } from 'react';
import RouterNavigation from '../../utils/navigation';
import Api from '../../components/Api';
import toast from 'react-hot-toast';

export default function UMKM() {
    const [showModal, setShowModal] = useState(false);
    const [category,setCategory] = useState<any>([])
    const {goToUMKMDetail} = RouterNavigation()
    const [umkm,setUmkm] = useState<any>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [search, setSearch] = useState('');
    const handleCategoryChange = (cat: string) => {
      setSelectedCategories(prev =>
        prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
      );
    };
    const filteredUMKM = umkm.filter((item: any) => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });

    const handleApply = () => {
      setShowModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getAllUMKM = async () => {
        try {
            await Api.get("/umkm").then(res=>{
                setUmkm(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data umkm")
        }
    }

    const getAllCategory = async()=>{
        try {
            await Api.get("/umkm/category").then(res=>{
                setCategory(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data kategori")
        }
    }

    useEffect(()=>{
        getAllUMKM()
        getAllCategory()
    },[])

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
                                onChange={e => setSearch(e.target.value)}
                            />
                            <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-5 mt-10 md:mt-20">
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
                        {category.map((cat: any, index:any) => (
                            <div key={index} className="flex flex-row gap-2 items-center">
                                <input
                                  className="w-4 h-4 accent-primary"
                                  type="checkbox"
                                  checked={selectedCategories.includes(cat.name)}
                                  onChange={() => handleCategoryChange(cat.name)}
                                />
                                <p>{cat.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="fixed z-50 bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg md:hidden flex items-center gap-2"
                    aria-label="Filter Kategori"
                >
                    <img src="/icons/category.svg" className="w-6 h-6" alt="filter" />
                </button>
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
                                {category.map((cat: any, index:any) => (
                                    <div key={index} className="flex flex-row gap-2 items-center">
                                        <input
                                          className="w-4 h-4 accent-primary"
                                          type="checkbox"
                                          checked={selectedCategories.includes(cat.name)}
                                          onChange={() => handleCategoryChange(cat.name)}
                                        />
                                        <p>{cat.name}</p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleApply} className="mt-6 w-full bg-primary text-white py-2 rounded-full font-semibold">Terapkan</button>
                        </div>
                    </div>
                )}
                <div className="w-full md:w-[80%] ">
                    <h1 className="font-bold text-3xl">UMKM Manukan Wetan</h1>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                        {filteredUMKM.length === 0 ? (
                            <p className="col-span-4 text-center text-gray-500 py-10">UMKM tidak ditemukan</p>
                        ) : (
                            filteredUMKM?.map((umkm:any, index:any) => {
                                return (
                                    <div key={index} className="mt-5 flex w-full flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md">
                                        <div className="relative">
                                            <img src={umkm.image} alt="manukan" className="w-full h-60 object-cover rounded-md" />
                                            <div className="absolute top-3 left-3 justify-center bg-primary w-fit px-4 text-white border border-primary text-sm py-1 rounded-full">
                                                <p>{umkm.category}</p>
                                            </div>
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
                                                <div onClick={()=>goToUMKMDetail(umkm.id)} className="cursor-pointer hover:bg-primary/80 transition-all flex px-5 py-1 font-normal text-white rounded-full justify-center bg-primary items-center w-fit">
                                                    <p>Lihat</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}