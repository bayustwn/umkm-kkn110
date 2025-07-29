import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Api from '../../../components/Api';
import MapPicker from '../../../components/MapPicker';

export default function EditUmkm() {
    const { id } = useParams<string>();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [kategori, setKategori] = useState<any>([]);
    const fotoUmkmInputRef = useRef<HTMLInputElement>(null);
    const produkInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [umkmData, setUmkmData] = useState({
        nama: '',
        telp: '',
        deskripsi: '',
        kategori: '',
        alamat: '',
        latitude: -7.2591052,
        longitude: 112.6764528,
        foto: null as File | null,
        produk: [{ nama: '', deskripsi: '', harga: '', foto: null as File | null, currentImage: '' }]
    });

    const [currentImage, setCurrentImage] = useState<string>('');

    const fetchKategori = async () => {
        try {
            const res = await Api.get('/umkm/category');
            setKategori(res.data.data);
        } catch (error) {
            toast.error('Gagal mengambil data kategori');
        }
    };

    const fetchUmkmData = async () => {
        try {
            const res = await Api.get(`/umkm/${id}`);
            const umkm = res.data.data;
            
            setUmkmData({
                nama: umkm.name,
                telp: umkm.phone,
                deskripsi: umkm.description,
                kategori: umkm.categoryId,
                alamat: umkm.address,
                latitude: umkm.latitude || -7.2591052,
                longitude: umkm.longitude || 112.6764528,
                foto: null,
                produk: umkm.product.map((p: any) => ({
                    nama: p.name,
                    deskripsi: p.description || '',
                    harga: p.price.toString(),
                    foto: null,
                    currentImage: p.image || ''
                }))
            });
            setCurrentImage(umkm.image);
        } catch (error) {
            toast.error('Gagal mengambil data UMKM');
            navigate('/admin/umkm');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleProdukChange = (idx: number, field: string, value: string | File | null) => {
        setUmkmData(d => ({
            ...d,
            produk: d.produk.map((p, i) => i === idx ? { ...p, [field]: value } : p)
        }));
    };

    const addProduk = () => {
        setUmkmData(d => ({
            ...d,
            produk: [...d.produk, { nama: '', deskripsi: '', harga: '', foto: null, currentImage: '' }]
        }));
    };

    const removeProduk = (idx: number) => {
        setUmkmData(d => ({
            ...d,
            produk: d.produk.filter((_, i) => i !== idx)
        }));
    };

    const canNext = () => {
        if (step === 1) {
            return umkmData.nama && umkmData.telp && umkmData.deskripsi && umkmData.kategori;
        }
        if (step === 2) {
            return umkmData.alamat;
        }
        if (step === 3) {
            return umkmData.produk.every(p => p.nama && p.harga);
        }
        return false;
    };

    const handleLocationSelect = (lat: number, lng: number) => {
        setUmkmData(prev => ({ ...prev, latitude: lat, longitude: lng }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Update UMKM data
            const formData = new FormData();
            if (umkmData.foto) {
                formData.append('image', umkmData.foto);
            }
            formData.append('name', umkmData.nama);
            formData.append('address', umkmData.alamat);
            formData.append('phone', umkmData.telp);
            formData.append('description', umkmData.deskripsi);
            formData.append('categoryId', umkmData.kategori);
            formData.append('latitude', umkmData.latitude.toString());
            formData.append('longitude', umkmData.longitude.toString());

            await Api.patch(`/umkm/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // Update products if any
            const existingProducts = await Api.get(`/umkm/${id}`);
            const currentProducts = existingProducts.data.data.product;
            
            // Update existing products
            for (let i = 0; i < umkmData.produk.length; i++) {
                const produk = umkmData.produk[i];
                if (i < currentProducts.length) {
                    // Update existing product
                    const productId = currentProducts[i].id;
                    const productFormData = new FormData();
                    productFormData.append('name', produk.nama);
                    productFormData.append('description', produk.deskripsi);
                    productFormData.append('price', (produk.harga || '0').toString());
                    if (produk.foto) {
                        productFormData.append('image', produk.foto);
                    }

                    await Api.patch(`/umkm/product/${productId}`, productFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                } else {
                    const productFormData = new FormData();
                    productFormData.append('umkmId', id!);
                    productFormData.append('name', produk.nama);
                    productFormData.append('description', produk.deskripsi);
                    productFormData.append('price', (produk.harga || '0').toString());
                    if (produk.foto) {
                        productFormData.append('image', produk.foto);
                    }

                    await Api.post('/umkm/product', productFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                }
            }
            
            toast.success('UMKM berhasil diperbarui!');
            navigate('/admin/umkm');
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Gagal memperbarui UMKM');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKategori();
        fetchUmkmData();
    }, [id]);

    if (isLoadingData) {
        return (
            <div className="py-15 md:px-10 md:py-[2%]">
                <div className="mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <img src="/icons/loading.svg" alt="Loading" className="w-12 h-12 animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-15 md:px-10 md:py-[2%]">
            <div className="mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit UMKM</h1>
                    <p className="text-gray-600">Perbarui data UMKM yang sudah ada</p>
                </div>

                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg flex flex-col items-center px-8 py-10 shadow-lg">
                            <img src="/icons/loading.svg" alt="Loading" className="w-16 h-16 mb-4" />
                            <span className="text-lg font-semibold text-gray-700">Memperbarui UMKM...</span>
                        </div>
                    </div>
                )}

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
                                    ) : currentImage ? (
                                        <img
                                            src={currentImage}
                                            alt="Current"
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
                                <input type="text" placeholder='Nama UMKM' className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" value={umkmData.nama} onChange={e => setUmkmData(d => ({ ...d, nama: e.target.value }))} required />
                                <p className='mt-2 text-sm'>Contoh. Bakso Urat Mantap</p>
                            </label>
                            <label className="block mt-2 md:mt-5">
                                <span className="font-semibold text-lg">Nomor Telepon</span>
                                <input 
                                    type="text" 
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    placeholder='Nomor telepon' 
                                    className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" 
                                    value={umkmData.telp} 
                                    onChange={e => {
                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                        setUmkmData(d => ({ ...d, telp: value }));
                                    }} 
                                    required 
                                />
                                <p className='mt-2 text-sm'>Contoh. 081234567890</p>
                            </label>
                            <label className="block mt-2 md:mt-5">
                                <span className="font-semibold text-lg">Deskripsi UMKM</span>
                                <textarea placeholder='Deskripsi UMKM anda' className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1 h-32 resize-none" value={umkmData.deskripsi} onChange={e => setUmkmData(d => ({ ...d, deskripsi: e.target.value }))} required />
                                <p className='mt-2 text-sm'>Jelaskan tentang UMKM anda</p>
                            </label>
                            <label className="block mt-2 md:mt-5">
                                <span className="font-semibold text-lg">Kategori</span>
                                <select className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" value={umkmData.kategori} onChange={e => setUmkmData(d => ({ ...d, kategori: e.target.value }))} required>
                                    <option value="">Pilih kategori</option>
                                    {kategori.map((k: any) => (
                                        <option key={k.id} value={k.id}>{k.name}</option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/umkm')}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    disabled={!canNext()}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col gap-4">
                            <label className="block mt-2 md:mt-5">
                                <span className="font-semibold text-lg">Alamat UMKM</span>
                                <textarea placeholder='Alamat UMKM anda' className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1 h-32 resize-none" value={umkmData.alamat} onChange={e => setUmkmData(d => ({ ...d, alamat: e.target.value }))} required />
                                <p className='mt-2 text-sm'>Alamat lengkap UMKM anda</p>
                            </label>
                            
                            <MapPicker 
                                onLocationSelect={handleLocationSelect}
                                initialLat={umkmData.latitude}
                                initialLng={umkmData.longitude}
                            />
                            
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Sebelumnya
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!canNext()}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Selanjutnya
                                </button>
                            </div>
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
                                            ) : p.currentImage ? (
                                                <img
                                                    src={p.currentImage}
                                                    alt="Current"
                                                    className="object-cover w-full h-full rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs text-center">Foto Produk</span>
                                            )}
                                        </div>
                                        <input
                                            ref={(el: any) => produkInputRefs.current[idx] = el}
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
                            <div className="flex gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
                                >
                                    Sebelumnya
                                </button>
                                <button
                                    type="submit"
                                    disabled={!canNext() || isLoading}
                                    className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Memperbarui...' : 'Perbarui UMKM'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
} 