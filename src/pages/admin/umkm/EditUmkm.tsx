import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCategories, useUmkmById } from '@/hooks/useUmkm';
import { umkmApi } from '@/api/umkmApi';
import MapPicker from '@/components/MapPicker';
import { FullPageLoader } from '@/components/skeletons';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import ImageUpload from '@/components/ui/ImageUpload';
import StepIndicator from '@/components/ui/StepIndicator';
import useMultiStep from '@/hooks/useMultiStep';
import type { UmkmProduct } from '@/types';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { UMKM_FORM_STEPS } from '@/constants';

export default function EditUmkm() {
  const { id } = useParams<string>();
  const navigate = useNavigate();
  const { data: kategori = [] } = useCategories();
  const { data: umkmDetail, isLoading: isLoadingData } = useUmkmById(id);
  const { step, next, prev } = useMultiStep(3);

  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [umkmData, setUmkmData] = useState({
    nama: '',
    telp: '',
    deskripsi: '',
    kategori: '',
    alamat: '',
    latitude: -7.2591052,
    longitude: 112.6764528,
    foto: null as File | null,
    produk: [{ nama: '', deskripsi: '', harga: '', foto: null as File | null, currentImage: '' }],
  });

  useEffect(() => {
    if (umkmDetail) {
      setUmkmData({
        nama: umkmDetail.name,
        telp: umkmDetail.phone,
        deskripsi: umkmDetail.description,
        kategori: umkmDetail.category.id,
        alamat: umkmDetail.address,
        latitude: umkmDetail.latitude || -7.2591052,
        longitude: umkmDetail.longitude || 112.6764528,
        foto: null,
        produk: umkmDetail.product.map((p: UmkmProduct) => ({
          nama: p.name,
          deskripsi: p.description || '',
          harga: p.price.toString(),
          foto: null,
          currentImage: p.image || '',
        })),
      });
      setCurrentImage(umkmDetail.image);
    }
  }, [umkmDetail]);

  const handleProdukChange = (idx: number, field: string, value: string | File | null) => {
    setUmkmData((d) => ({
      ...d,
      produk: d.produk.map((p, i) => (i === idx ? { ...p, [field]: value } : p)),
    }));
  };
  const addProduk = () =>
    setUmkmData((d) => ({
      ...d,
      produk: [...d.produk, { nama: '', deskripsi: '', harga: '', foto: null, currentImage: '' }],
    }));
  const removeProduk = (idx: number) =>
    setUmkmData((d) => ({ ...d, produk: d.produk.filter((_, i) => i !== idx) }));

  const canNext = () => {
    if (step === 1)
      return umkmData.nama && umkmData.telp && umkmData.deskripsi && umkmData.kategori;
    if (step === 2) return umkmData.alamat;
    if (step === 3) return umkmData.produk.every((p) => p.nama && p.harga);
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (umkmData.foto) formData.append('image', umkmData.foto);
      formData.append('name', umkmData.nama);
      formData.append('address', umkmData.alamat);
      formData.append('phone', umkmData.telp);
      formData.append('description', umkmData.deskripsi);
      formData.append('categoryId', umkmData.kategori);
      formData.append('latitude', umkmData.latitude.toString());
      formData.append('longitude', umkmData.longitude.toString());
      await umkmApi.update(id!, formData);

      const existingProducts = await umkmApi.getById(id!);
      const currentProducts = existingProducts.product;

      for (let i = 0; i < umkmData.produk.length; i++) {
        const produk = umkmData.produk[i];
        const productFormData = new FormData();
        productFormData.append('name', produk.nama);
        productFormData.append('description', produk.deskripsi);
        productFormData.append('price', (produk.harga || '0').toString());
        if (produk.foto) productFormData.append('image', produk.foto);

        if (i < currentProducts.length) {
          await umkmApi.updateProduct(currentProducts[i].id, productFormData);
        } else {
          productFormData.append('umkmId', id!);
          await umkmApi.registerProduct(productFormData);
        }
      }
      toast.success('UMKM berhasil diperbarui!');
      navigate('/admin/umkm');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Gagal memperbarui UMKM'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) return <FullPageLoader message="Memuat data UMKM..." />;

  return (
    <div className="py-15 md:px-10 md:py-[2%]">
      <LoadingOverlay isLoading={isLoading} message="Memperbarui UMKM..." />
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit UMKM</h1>
          <p className="text-gray-600">Perbarui data UMKM yang sudah ada</p>
        </div>
        <StepIndicator steps={UMKM_FORM_STEPS} currentStep={step} />
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <ImageUpload
                value={umkmData.foto}
                currentImage={currentImage}
                onChange={(file) => setUmkmData((d) => ({ ...d, foto: file }))}
                label="Foto UMKM"
              />
              <label className="block mt-2 md:mt-5">
                <span className="font-semibold text-lg">Nama UMKM</span>
                <input
                  type="text"
                  placeholder="Nama UMKM"
                  className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1"
                  value={umkmData.nama}
                  onChange={(e) => setUmkmData((d) => ({ ...d, nama: e.target.value }))}
                  required
                />
                <p className="mt-2 text-sm">Contoh. Bakso Urat Mantap</p>
              </label>
              <label className="block mt-2 md:mt-5">
                <span className="font-semibold text-lg">Nomor Telepon</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Nomor telepon"
                  className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1"
                  value={umkmData.telp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setUmkmData((d) => ({ ...d, telp: value }));
                  }}
                  required
                />
                <p className="mt-2 text-sm">Contoh. 081234567890</p>
              </label>
              <label className="block mt-2 md:mt-5">
                <span className="font-semibold text-lg">Deskripsi UMKM</span>
                <textarea
                  placeholder="Deskripsi UMKM anda"
                  className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1 h-32 resize-none"
                  value={umkmData.deskripsi}
                  onChange={(e) => setUmkmData((d) => ({ ...d, deskripsi: e.target.value }))}
                  required
                />
                <p className="mt-2 text-sm">Jelaskan tentang UMKM anda</p>
              </label>
              <label className="block mt-2 md:mt-5">
                <span className="font-semibold text-lg">Kategori</span>
                <select
                  className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1"
                  value={umkmData.kategori}
                  onChange={(e) => setUmkmData((d) => ({ ...d, kategori: e.target.value }))}
                  required
                >
                  <option value="">Pilih kategori</option>
                  {kategori.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.name}
                    </option>
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
                  onClick={next}
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
                <textarea
                  placeholder="Alamat UMKM anda"
                  className="focus:border-primary input mt-2 outline-none border rounded-lg px-4 py-2 w-full mt-1 h-32 resize-none"
                  value={umkmData.alamat}
                  onChange={(e) => setUmkmData((d) => ({ ...d, alamat: e.target.value }))}
                  required
                />
                <p className="mt-2 text-sm">Alamat lengkap UMKM anda</p>
              </label>
              <MapPicker
                onLocationSelect={(lat, lng) =>
                  setUmkmData((prev) => ({ ...prev, latitude: lat, longitude: lng }))
                }
                initialLat={umkmData.latitude}
                initialLng={umkmData.longitude}
              />
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={prev}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sebelumnya
                </button>
                <button
                  type="button"
                  onClick={next}
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
                <div
                  key={idx}
                  className="relative flex flex-col md:flex-row items-center md:items-center gap-4 border-b pb-6 mb-2 w-full"
                >
                  <div className="relative w-full md:w-auto">
                    <ImageUpload
                      value={p.foto}
                      currentImage={p.currentImage}
                      onChange={(file) => handleProdukChange(idx, 'foto', file)}
                      placeholder="Foto Produk"
                      className="w-full md:w-60 h-50 md:h-40"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Nama Produk"
                      className="input outline-none font-semibold text-2xl w-full"
                      value={p.nama}
                      onChange={(e) => handleProdukChange(idx, 'nama', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Deskripsi Produk"
                      className="input outline-none w-full mb-5"
                      value={p.deskripsi}
                      onChange={(e) => handleProdukChange(idx, 'deskripsi', e.target.value)}
                    />
                    <div className="flex items-center w-full">
                      <span className="mr-2 font-semibold text-gray-600">Rp</span>
                      <input
                        type="number"
                        placeholder="Harga"
                        className="input outline-none w-full"
                        value={p.harga}
                        onChange={(e) => handleProdukChange(idx, 'harga', e.target.value)}
                        required
                      />
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
              <button
                type="button"
                onClick={addProduk}
                className="text-primary rounded-full hover:pl-2 transition-all w-fit cursor-pointer"
              >
                Tambah Produk →
              </button>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={prev}
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
