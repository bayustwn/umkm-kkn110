'use client';

import { useRef, useState } from 'react';
import Footer from '@/app/component/footer';
import Title from '@/app/component/title';
import { Product } from '@/app/model/product';

export default function Registrasi() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [produkList, setProdukList] = useState<Product[]>([
    { name: '', description: '', image: null, price: '' }
  ]);

  const handleProdukChange = (index: number, field: keyof Product, value: any) => {
    const newList = [...produkList];
    newList[index] = { ...newList[index], [field]: value };
    setProdukList(newList);
  };

  const handleProdukImageChange = (index: number, file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newList = [...produkList];
      newList[index].image = reader.result as string;
      setProdukList(newList);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProduk = () => {
    setProdukList([
      ...produkList,
      { name: '', description: '', image: null, price: '' }
    ]);
  };

  const handleRemoveProduk = (index: number) => {
    if (produkList.length === 1) return; // Tidak bisa hapus jika hanya satu produk
    const newList = produkList.filter((_, i) => i !== index);
    setProdukList(newList);
  };

  return (
    <div>
      <section>
        <div className="mt-5">
          <h1 className="font-bold text-3xl">Registrasi UMKM Anda.</h1>
          <p className="font-medium mt-2">
            Isi form registrasi sesuai dengan informasi umkm yang anda miliki.
          </p>
        </div>

        <Title size="text-xl mt-10" title="Informasi Umum" />

        <div className="flex flex-row gap-5 items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <div
            className="border w-[40%] cursor-pointer hover:scale-102 transition-all flex justify-center items-center h-80 rounded-lg mt-5 border-dashed overflow-hidden bg-gray-100"
            onClick={handleUploadClick}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
            ) : (
              <p className="text-center px-4">Klik untuk upload foto</p>
            )}
          </div>
          <div className="font-semibold">
            <p className="text-lg">Upload foto menarik umkm anda.</p>
            <p className="font-normal text-md">
              Foto yang menarik dapat meningkatkan kepercayaan customer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 mt-5">
          <div className="flex flex-col">
            <p className="font-semibold mb-3">Nama UMKM</p>
            <input
              type="text"
              placeholder="Masukkan nama umkm anda"
              className="outline-none border-1 rounded-lg border-black px-5 py-2 "
            />
          </div>
          <div className="flex flex-col">
            <p className="font-semibold mb-3">No. Telp</p>
            <input
              type="text"
              placeholder="Masukkan nomor telepon"
              inputMode="numeric"
              pattern="\d*"
              className="outline-none border-1 rounded-lg border-black px-5 py-2 "
            />
          </div>
          <div className="flex flex-col mt-5">
            <p className="font-semibold mb-3">Deskripsi Singkat UMKM</p>
            <textarea
              className="resize-none p-5 outline-none border rounded"
              rows={5}
              placeholder="Deskripsikan secara singkat tentang umkm anda"
            ></textarea>
          </div>
          <div className="flex flex-col mt-5">
            <p className="font-semibold mb-3">Kategori UMKM</p>
            <select className="outline-none border p-2 rounded-lg">
              <option value="Makanan">Makanan</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          <Title size="text-xl" title="Lokasi UMKM" />
          <div className="flex flex-col">
            <p className="font-semibold mb-3">Alamat Lengkap</p>
            <input
              type="text"
              placeholder="Contoh. Jl. Sikatan II "
              className="outline-none border-1 rounded-lg border-black px-5 py-2 "
            />
          </div>
        </div>

        <div className="flex flex-col gap-5 mt-10">
          <Title size="text-xl" title="Produk" />

          {produkList.map((produk, index) => (
            <div key={index} className="flex flex-row gap-5 items-start mt-5">
              <div
                className="border w-[40%] cursor-pointer hover:scale-102 transition-all flex justify-center items-center h-80 rounded-lg mt-5 border-dashed overflow-hidden bg-gray-100"
                onClick={() =>
                  document.getElementById(`produk-image-${index}`)?.click()
                }
              >
                {produk.image ? (
                  <img
                    src={produk.image}
                    alt="Preview Produk"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <p className="text-center px-4">Klik untuk upload foto produk</p>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`produk-image-${index}`}
                  onChange={(e) =>
                    handleProdukImageChange(index, e.target.files?.[0])
                  }
                />
              </div>

              <div className="flex flex-col gap-4 flex-1 mt-5">
                <div className="flex flex-col">
                  <p className="font-semibold mb-2">Nama Produk</p>
                  <input
                    type="text"
                    value={produk.name}
                    onChange={(e) =>
                      handleProdukChange(index, 'name', e.target.value)
                    }
                    placeholder="Contoh. Keripik Pisang"
                    className="outline-none border rounded-lg border-black px-4 py-2"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="font-semibold mb-2">Deskripsi Produk</p>
                  <textarea
                    rows={3}
                    value={produk.description || ''}
                    onChange={(e) =>
                      handleProdukChange(index, 'description', e.target.value)
                    }
                    placeholder="Tulis deskripsi produk di sini..."
                    className="outline-none border rounded-lg border-black px-4 py-2 resize-none"
                  />
                </div>

                <div className="flex flex-col">
                  <p className="font-semibold mb-2">Harga (Rp)</p>
                  <input
                    type="number"
                    min={0}
                    value={produk.price}
                    onChange={(e) =>
                      handleProdukChange(index, 'price', e.target.value)
                    }
                    placeholder="Contoh. 15000"
                    className="outline-none border rounded-lg border-black px-4 py-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveProduk(index)}
                  className={`bg-red-500 text-white rounded-lg px-4 py-2 font-medium self-end w-fit mt-2 hover:bg-opacity-80 transition ${produkList.length === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={produkList.length === 1}
                >
                  Hapus Produk
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddProduk}
            className="bg-primary text-white rounded-lg px-5 py-3 font-semibold w-fit mt-3 hover:bg-opacity-80 transition"
          >
            + Tambah Produk
          </button>
        </div>

        <Footer />
      </section>
    </div>
  );
}
