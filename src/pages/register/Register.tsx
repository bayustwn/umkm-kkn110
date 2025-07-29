import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import RouterNavigation from '../../utils/navigation';
import Api from '../../components/Api';
import toast from 'react-hot-toast';
import MapPicker from '../../components/MapPicker';

export default function Register() {
    const { goToUMKMDetail, goToUMKM } = RouterNavigation();
    const [step, setStep] = useState(1);
    const [umkmData, setUmkmData] = useState({
        foto: null as File | null,
        nama: '',
        telp: '',
        deskripsi: '',
        kategori: '',
        alamat: '',
        latitude: -7.2591052,
        longitude: 112.6764528,
        produk: [{ nama: '', deskripsi: '', harga: '', foto: null as File | null }],
    });
    const fotoUmkmInputRef = useRef<HTMLInputElement>(null);
    const produkInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [kategori, setKategori] = useState<any[]>([]);
    const [umkmPreview, setUmkmPreview] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [umkmName, setUmkmName] = useState('');
    const fetchKategori = async () => {
        try {
            const res = await Api.get("/umkm/category");
            setKategori(res.data.data);
        } catch {
            setKategori([]);
            toast.error("Gagal mengambil data kategori");
        }
    };
    const fetchUmkmPreview = async () => {
        try {
            const res = await Api.get("/umkm/preview");
            setUmkmPreview(res.data.data);
        } catch {
            setUmkmPreview([]);
        }
    };
    useEffect(() => {
        fetchKategori();
        fetchUmkmPreview();
    }, []);


    const handleProdukChange = (idx: number, field: string, value: string | File | null) => {
        setUmkmData((prev) => {
            const produk = [...prev.produk];
            produk[idx] = { ...produk[idx], [field]: value };
            return { ...prev, produk };
        });
    };
    const addProduk = () => {
        setUmkmData((prev) => ({ ...prev, produk: [...prev.produk, { nama: '', deskripsi: '', harga: '', foto: null }] }));
    };
    const removeProduk = (idx: number) => {
        setUmkmData((prev) => ({ ...prev, produk: prev.produk.filter((_, i) => i !== idx) }));
    };

    const canNext = () => {
        if (step === 1) return umkmData.foto && umkmData.nama && umkmData.telp && umkmData.deskripsi && umkmData.kategori;
        if (step === 2) return umkmData.alamat;
        if (step === 3) return umkmData.produk.every(p => p.nama && p.harga);
        return false;
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setUmkmData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', umkmData.foto!);
        formData.append('name', umkmData.nama);
        formData.append('address', umkmData.alamat);
        formData.append('phone', umkmData.telp);
        formData.append('description', umkmData.deskripsi);
        formData.append('status', 'pending');
        formData.append('categoryId', umkmData.kategori);
        formData.append('latitude', umkmData.latitude.toString());
        formData.append('longitude', umkmData.longitude.toString());
        try {
            const res = await Api.post('/umkm/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const umkm = res.data.data;

            for (const produk of umkmData.produk) {
                const produkForm = new FormData();
                produkForm.append('umkmId', umkm.id);
                produkForm.append('name', produk.nama);
                produkForm.append('price', produk.harga);
                if (produk.deskripsi) produkForm.append('description', produk.deskripsi);
                if (produk.foto) produkForm.append('image', produk.foto);
                try {
                    await Api.post('/umkm/product', produkForm, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                } catch (err: any) {
                    setIsLoading(false);
                    toast.error(err?.response?.data?.message || 'Gagal upload produk');
                    return;
                }
            }
            setIsLoading(false);
            toast.success('Registrasi UMKM berhasil!');
            const nomor = '6285156203867';
            const pesan = `Permisi saya dari umkm ${umkm.name} telah melakukan regisrasi online. id saya ${umkm.id} mohon untuk ditinjau. Saya tunggu kabarnya, terima kasih`;
            const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
            window.open(url, '_blank');
            setUmkmName(umkm.name);
            setShowSuccessModal(true);
        } catch (err: any) {
            setIsLoading(false);
            toast.error(err?.response?.data?.message || 'Gagal mendaftarkan UMKM');
        }
    };

    return (
        <div className='py-10 px-5 md:px-0 md:py-[3%] md:px-[6%]'>
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg flex flex-col items-center px-8 py-10 shadow-lg">
                        <img src="/icons/loading.svg" alt="Loading" className="w-16 h-16 mb-4" />
                        <span className="text-lg font-semibold text-gray-700">Memproses Pendaftaran UMKM...</span>
                    </div>
                </div>
            )}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-lg flex flex-col items-center px-8 py-10 shadow-lg max-w-[90vw]">
                        <img src="/icons/hooray.svg" alt="Success" className="w-16 h-16 mb-4" onError={e => (e.currentTarget.style.display = 'none')} />
                        <span className="text-xl font-bold text-primary mb-2">Hooray!</span>
                        <span className="text-lg font-semibold text-gray-700 text-center mb-6">Sukses mendaftarkan UMKM <span className='text-primary'>{umkmName}</span>, UMKM sedang ditinjau mohon dicek secara berkala.</span>
                        <button
                            className="mt-2 px-8 py-2 rounded-full bg-primary text-white font-semibold text-lg hover:bg-primary/90 transition"
                            onClick={() => goToUMKM()}
                        >
                            Lihat UMKM
                        </button>
                    </div>
                </div>
            )}
            <div className='flex flex-col '>
                <Navbar color='black' />
                <div className='flex flex-row gap-8 mt-15    md:mt-20'>
                    <div className="w-full md:w-[70%]">
                        <h1 className="text-2xl text-center font-bold mb-2">Registrasi UMKM</h1>
                        <p className="mb-6 text-center md:text-md text-sm">Isi form di bawah ini untuk mendaftarkan UMKM anda</p>

                        <div className="flex flex-row md:px-20 justify-center items-center justify-between my-10">
                            {[1, 2, 3].map((s, i, arr) => (
                                <>
                                    <div key={s} className="flex flex-col items-center z-10">
                                        <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${(s === 1 && step > 1) || (s === 2 && step > 2) || (s === 3 && step === 3) || step === s
                                            ? 'bg-primary'
                                            : 'bg-gray-400'
                                            }`}>{s}</div>
                                        <span className={`mt-2 text-xs ${step === s ? 'text-primary' : 'text-gray-400'}`}>{s === 1 ? 'Informasi' : s === 2 ? 'Alamat' : 'Produk'}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className={`flex-1 mb-6 border-t-2 border-dashed ${step > s ? 'border-primary' : 'border-gray-300'} mx-1 md:mx-2`} />
                                    )}
                                </>
                            ))}
                        </div>
                        <form onSubmit={handleSubmit}>

                            {step === 1 && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <span className="font-bold text-xl mb-2">Foto UMKM</span>
                                        <div
                                            className="w-full h-50 md:h-120 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:border-primary transition"
                                            onClick={() => fotoUmkmInputRef.current?.click()}
                                        >
                                            {umkmData.foto ? (
                                                <img
                                                    src={URL.createObjectURL(umkmData.foto)}
                                                    alt="Preview"
                                                    className="object-cover w-full h-full rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-center">Klik untuk upload foto</span>
                                            )}
                                        </div>
                                        <input
                                            ref={fotoUmkmInputRef}
                                            id="foto-umkm-input"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={e => setUmkmData(d => ({ ...d, foto: e.target.files?.[0] || null }))}
                                        />
                                    </div>
                                    <label className="block mt-2 md:mt-5">
                                        <span className="font-semibold text-lg">Nama UMKM</span>
                                        <input type="text" placeholder='Nama UMKM anda' className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" value={umkmData.nama} onChange={e => setUmkmData(d => ({ ...d, nama: e.target.value }))} required />
                                        <p className='mt-2 text-sm'>Contoh. Bakso Urat Mantap</p>
                                    </label>
                                    <label className="block">
                                        <span className="font-semibold text-lg">Nomor Telepon</span>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder='No telepon bisnis UMKM anda'
                                            className="input mt-2 focus:border-primary outline-none border rounded-lg px-4 py-2 w-full mt-1"
                                            value={umkmData.telp}
                                            onChange={e => {
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                setUmkmData(d => ({ ...d, telp: value }));
                                            }}
                                            required
                                        />
                                        <p className='mt-2 text-sm'>Contoh. 085156203867</p>
                                    </label>
                                    <label className="flex flex-col w-full">
                                        <span className="font-semibold text-lg">Deskripsi Singkat</span>
                                        <textarea placeholder='Contoh. Berdiri Sejak 1990, Bakso Urat Mantap tetap konsisten menyediakan rasa yang nikmat.' className="textarea textarea-bordered w-full mt-1 h-40 border outline-none focus:border-primary rounded-md p-4 resize-none" value={umkmData.deskripsi} onChange={e => setUmkmData(d => ({ ...d, deskripsi: e.target.value }))} required />
                                    </label>
                                    <label className="block">
                                        <span className="font-semibold text-lg">Kategori</span>
                                        <select className="select border focus:border-primary p-2 rounded-md w-full mt-1" value={umkmData.kategori} onChange={e => setUmkmData(d => ({ ...d, kategori: e.target.value }))} required>
                                            <option value="">Pilih Kategori</option>
                                            {kategori.map((k: any, i: number) => <option key={i} value={k.id}>{k.name}</option>)}
                                        </select>
                                    </label>
                                </div>
                            )}
                            {step === 2 && (
                                <div className="flex flex-col gap-4">
                                    <label className="block flex flex-col gap-1">
                                        <span className="font-semibold text-lg">Alamat UMKM</span>
                                        <input placeholder='Alamat bisnis anda' className='border px-4 py-2 rounded-md focus:border-primary mt-1' value={umkmData.alamat} onChange={e => setUmkmData(d => ({ ...d, alamat: e.target.value }))} required />
                                        <p>Contoh. Jl Bibis Tama No. 10</p>
                                    </label>
                                    
                                    <MapPicker 
                                        onLocationSelect={handleLocationSelect}
                                        initialLat={umkmData.latitude}
                                        initialLng={umkmData.longitude}
                                    />
                                </div>
                            )}
                            {step === 3 && (
                                <div className="flex flex-col gap-4">
                                    <span className="font-semibold text-lg">Produk UMKM</span>
                                    {umkmData.produk.map((p, idx) => (
                                        <div key={idx} className="relative flex flex-col md:flex-row items-center md:items-center gap-4 border-b pb-6 mb-2 w-full">
                                            <div className="relative w-full md:w-auto">
                                                <div
                                                    className="w-full md:w-60 h-50 md:h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer bg-gray-50 hover:border-primary transition"
                                                    onClick={() => produkInputRefs.current[idx]?.click()}
                                                >
                                                    {p.foto ? (
                                                        <img
                                                            src={URL.createObjectURL(p.foto)}
                                                            alt="Preview"
                                                            className="object-cover w-full h-full rounded-lg"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-xs text-center">Foto Produk</span>
                                                    )}
                                                </div>
                                                <input
                                                    ref={el => { produkInputRefs.current[idx] = el; }}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={e => handleProdukChange(idx, 'foto', e.target.files?.[0] || null)}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 w-full">
                                                <input type="text" placeholder="Nama Produk" className="input outline-none font-semibold text-2xl w-full" value={p.nama} onChange={e => handleProdukChange(idx, 'nama', e.target.value)} required />
                                                <input type="text" placeholder="Deskripsi Produk" className="input outline-none w-full mb-5" value={p.deskripsi} onChange={e => handleProdukChange(idx, 'deskripsi', e.target.value)} />
                                                <div className="flex items-center w-full">
                                                    <span className="mr-2 font-semibold text-gray-600">Rp</span>
                                                    <input type="number" placeholder="Harga" className="input outline-none w-full" value={p.harga} onChange={e => handleProdukChange(idx, 'harga', e.target.value)} required />
                                                </div>
                                            </div>
                                            {umkmData.produk.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeProduk(idx)}
                                                    className="self-end cursor-pointer text-red-500 hover:pr-2 transition-all w-fit text-sm font-medium z-10 py-1 rounded-md"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addProduk} className="text-primary rounded-full hover:pl-2 transition-all w-fit cursor-pointer">Tambah Produk →</button>
                                </div>
                            )}
                            <div className="flex gap-4 mt-8">
                                {step > 1 && (
                                    <button type="button" onClick={() => setStep(s => s - 1)} className="px-5 py-2 rounded-full bg-primary/10 border text-primary cursor-pointer border-primary">Kembali</button>
                                )}
                                {step < 3 && (
                                    <button type="button" onClick={() => canNext() && setStep(s => s + 1)} disabled={!canNext()} className="px-10 py-2 rounded-full cursor-pointer bg-primary text-white disabled:bg-primary/70">Lanjut</button>
                                )}
                                {step === 3 && (
                                    <button type="submit" disabled={!canNext()} className="px-10 py-2 rounded-full bg-primary cursor-pointer text-white disabled:bg-primary/70">Daftar</button>
                                )}
                            </div>
                        </form>
                    </div>
                    <div className='hidden md:block md:w-[30%]'>
                        <h1 className='font-bold text-2xl'>UMKM Terdaftar</h1>
                        <div className="mt-5 grid grid-cols-1 gap-5">
                            {umkmPreview.slice(0, 2).map((umkm, index) => (
                                <div key={index} className="flex flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md">
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
                                            <div onClick={() => goToUMKMDetail(umkm.id)} className="cursor-pointer hover:bg-primary/80 transition-all flex px-5 py-1 font-normal text-white rounded-full justify-center bg-primary items-center w-fit">
                                                <p>Lihat</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className=" w-fit flex flex-row w-full mt-5 justify-center">
                            <div onClick={goToUMKM} className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full">
                                <p>Lihat Selengkapnya...</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}