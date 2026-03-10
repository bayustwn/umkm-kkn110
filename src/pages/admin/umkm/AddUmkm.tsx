import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCategories } from '@/hooks/useUmkm';
import { umkmApi } from '@/api/umkmApi';
import MapPicker from '@/components/MapPicker';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ImageUpload from '@/components/ui/ImageUpload';
import StepIndicator from '@/components/ui/StepIndicator';
import useMultiStep from '@/hooks/useMultiStep';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { UMKM_FORM_STEPS } from '@/constants';



export default function AddUmkm() {
  const navigate = useNavigate();
  const { data: kategori = [] } = useCategories();
  const { step, next, prev } = useMultiStep(3);

  const [isLoading, setIsLoading] = useState(false);
  const [umkmData, setUmkmData] = useState({
    foto: null as File | null, nama: '', telp: '', deskripsi: '', kategori: '', alamat: '',
    latitude: -7.2591052, longitude: 112.6764528,
    produk: [{ nama: '', deskripsi: '', harga: '', foto: null as File | null }],
  });

  const handleProdukChange = (idx: number, field: string, value: string | File | null) => {
    setUmkmData(prev => { const produk = [...prev.produk]; produk[idx] = { ...produk[idx], [field]: value }; return { ...prev, produk }; });
  };
  const addProduk = () => setUmkmData(prev => ({ ...prev, produk: [...prev.produk, { nama: '', deskripsi: '', harga: '', foto: null }] }));
  const removeProduk = (idx: number) => setUmkmData(prev => ({ ...prev, produk: prev.produk.filter((_, i) => i !== idx) }));

  const canNext = () => {
    if (step === 1) return umkmData.foto && umkmData.nama && umkmData.telp && umkmData.deskripsi && umkmData.kategori;
    if (step === 2) return umkmData.alamat;
    if (step === 3) return umkmData.produk.every(p => p.nama && p.harga);
    return false;
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
    formData.append('status', 'active');
    formData.append('categoryId', umkmData.kategori);
    formData.append('latitude', umkmData.latitude.toString());
    formData.append('longitude', umkmData.longitude.toString());

    try {
      const umkm = await umkmApi.register(formData);
      for (const produk of umkmData.produk) {
        const produkForm = new FormData();
        produkForm.append('umkmId', umkm.id);
        produkForm.append('name', produk.nama);
        produkForm.append('price', produk.harga);
        if (produk.deskripsi) produkForm.append('description', produk.deskripsi);
        if (produk.foto) produkForm.append('image', produk.foto);
        await umkmApi.registerProduct(produkForm);
      }
      toast.success('UMKM berhasil ditambahkan!');
      navigate('/admin/umkm');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gagal menambahkan UMKM'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-15 md:px-10 md:py-[2%]">
      <LoadingOverlay isLoading={isLoading} message="Memproses UMKM..." />
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tambah UMKM</h1>
          <p className="text-gray-600">Tambahkan UMKM baru ke dalam sistem</p>
        </div>
        <StepIndicator steps={UMKM_FORM_STEPS} currentStep={step} />
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <ImageUpload value={umkmData.foto} onChange={(file) => setUmkmData(d => ({ ...d, foto: file }))} label="Foto UMKM" />
              <label className="block mt-2 md:mt-5"><span className="font-semibold text-lg">Nama UMKM</span><input type="text" placeholder="Nama UMKM" className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" value={umkmData.nama} onChange={e => setUmkmData(d => ({ ...d, nama: e.target.value }))} required /><p className="mt-2 text-sm">Contoh. Bakso Urat Mantap</p></label>
              <label className="block mt-2 md:mt-5"><span className="font-semibold text-lg">Nomor Telepon</span><input type="text" inputMode="numeric" pattern="[0-9]*" placeholder="Nomor telepon" className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" value={umkmData.telp} onChange={e => { const value = e.target.value.replace(/[^0-9]/g, ''); setUmkmData(d => ({ ...d, telp: value })); }} required /><p className="mt-2 text-sm">Contoh. 081234567890</p></label>
              <label className="block mt-2 md:mt-5"><span className="font-semibold text-lg">Deskripsi UMKM</span><textarea placeholder="Deskripsi UMKM anda" className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1 h-32 resize-none" value={umkmData.deskripsi} onChange={e => setUmkmData(d => ({ ...d, deskripsi: e.target.value }))} required /><p className="mt-2 text-sm">Jelaskan tentang UMKM anda</p></label>
              <label className="block mt-2 md:mt-5"><span className="font-semibold text-lg">Kategori</span>
                <select className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1" value={umkmData.kategori} onChange={e => setUmkmData(d => ({ ...d, kategori: e.target.value }))} required>
                  <option value="">Pilih kategori</option>
                  {kategori.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              </label>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={() => navigate('/admin/umkm')} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">Batal</button>
                <button type="button" onClick={next} disabled={!canNext()} className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <label className="block mt-2 md:mt-5"><span className="font-semibold text-lg">Alamat UMKM</span><textarea placeholder="Alamat lengkap UMKM" className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1 h-32 resize-none" value={umkmData.alamat} onChange={e => setUmkmData(d => ({ ...d, alamat: e.target.value }))} required /><p className="mt-2 text-sm">Masukkan alamat lengkap UMKM</p></label>
              <MapPicker onLocationSelect={(lat, lng) => setUmkmData(prev => ({ ...prev, latitude: lat, longitude: lng }))} initialLat={umkmData.latitude} initialLng={umkmData.longitude} />
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={prev} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">Sebelumnya</button>
                <button type="button" onClick={next} disabled={!canNext()} className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <span className="font-semibold text-lg">Produk UMKM</span>
              {umkmData.produk.map((p, idx) => (
                <div key={idx} className="relative flex flex-col md:flex-row items-center md:items-center gap-4 border-b pb-6 mb-2 w-full">
                  <div className="relative w-full md:w-auto">
                    <ImageUpload value={p.foto} onChange={(file) => handleProdukChange(idx, 'foto', file)} placeholder="Foto Produk" className="w-full md:w-60 h-50 md:h-40" />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <input type="text" placeholder="Nama Produk" className="input outline-none font-semibold text-2xl w-full" value={p.nama} onChange={e => handleProdukChange(idx, 'nama', e.target.value)} required />
                    <input type="text" placeholder="Deskripsi Produk" className="input outline-none w-full mb-5" value={p.deskripsi} onChange={e => handleProdukChange(idx, 'deskripsi', e.target.value)} />
                    <div className="flex items-center w-full"><span className="mr-2 font-semibold text-gray-600">Rp</span><input type="number" placeholder="Harga" className="input outline-none w-full" value={p.harga} onChange={e => handleProdukChange(idx, 'harga', e.target.value)} required /></div>
                  </div>
                  {umkmData.produk.length > 1 && <button type="button" onClick={() => removeProduk(idx)} className="self-end cursor-pointer text-red-500 hover:pr-2 transition-all w-fit text-sm font-medium z-10 py-1 rounded-md">Hapus</button>}
                </div>
              ))}
              <button type="button" onClick={addProduk} className="text-primary rounded-full hover:pl-2 transition-all w-fit cursor-pointer">Tambah Produk →</button>
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={prev} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">Sebelumnya</button>
                <button type="submit" disabled={!canNext() || isLoading} className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Menambahkan...' : 'Tambah UMKM'}</button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}