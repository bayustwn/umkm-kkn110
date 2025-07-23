"use client";

import Footer from "@/app/component/footer";
import Title from "@/app/component/title";
import { DetailUmkm, PreviewUmkm } from "@/app/model/umkm";
import api from "@/app/utils/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailUMKM() {
  const [umkm, setUmkm] = useState<DetailUmkm>();
  const router = useRouter();
  const [allUmkm, setAllUmkm] = useState<PreviewUmkm[]>();
  const params = useParams<{ id: string }>();

  const getDetail = async () => {
    try {
      const umkm = await api.get("/umkm/" + params.id).then((res) => {
        setUmkm(res.data.data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const toDetail = (id: string) => {
    router.push("/umkm/" + id);
  };

  const getUMKM = async () => {
    try {
      const umkm = await api.get("/umkm/other/" + params.id).then((res) => {
        {
          setAllUmkm(res.data.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetail();
    getUMKM();
  }, []);

  if (!umkm || !allUmkm) {
    return (
      <div>
        <section className="flex flex-col gap-15 animate-pulse">
          <div className="flex flex-row items-center justify-between">
            <img src="/logo/logo.svg" alt="logo" />
            <a
              href="#"
              className="text-white hover:bg-secondary hover:text-primary transition-all border border-primary font-medium text-black flex justify-center bg-primary px-8 py-2 rounded-full"
            >
              Registrasi UMKM
            </a>
          </div>
          <div className="flex mt-5 flex-row gap-5 items-center">
            <div className="bg-gray-200 w-150 h-80 rounded-md" />
            <div className="flex max-w-[60%] flex-col gap-5">
              <div className="bg-gray-200 h-8 w-32 rounded-4xl" />
              <div className="bg-gray-200 h-10 w-64 rounded" />
              <div className="flex flex-row gap-5">
                <div className="flex flex-col gap-3">
                  <div className="bg-gray-200 h-6 w-40 rounded" />
                  <div className="bg-gray-200 h-6 w-32 rounded" />
                  <div className="bg-gray-200 h-6 w-24 rounded" />
                  <div className="bg-gray-200 h-8 w-24 rounded-4xl mt-2" />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-200 h-8 w-48 rounded mb-2" />
            <div className="bg-gray-200 h-20 w-full rounded" />
          </div>
          <div>
            <div className="bg-gray-200 h-8 w-48 rounded mb-2" />
            <div className="grid grid-cols-5 gap-5 mt-10">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="bg-gray-200 w-100 h-40 rounded-md" />
                  <div className="bg-gray-200 h-6 w-32 rounded" />
                  <div className="bg-gray-200 h-4 w-24 rounded" />
                  <div className="bg-gray-200 h-4 w-20 rounded" />
                  <div className="bg-gray-200 h-8 w-full rounded-4xl mt-2" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-gray-200 h-8 w-48 rounded mb-2" />
            <div className="grid grid-cols-4 gap-5 mt-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="bg-gray-200 w-100 h-50 rounded-md" />
                  <div className="bg-gray-200 h-6 w-32 rounded mt-4" />
                  <div className="bg-gray-200 h-4 w-24 rounded mt-4" />
                  <div className="bg-gray-200 h-4 w-20 rounded mt-2" />
                  <div className="bg-gray-200 h-8 w-24 rounded-4xl mt-3" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 bg-primary py-3 flex justify-center">
            <div className="bg-gray-200 h-6 w-1/4 rounded" />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="flex flex-col gap-15">
        <div className="flex flex-row items-center justify-between">
          <img src="/logo/logo.svg" alt="logo" />
          <a
            href="#"
            className="text-white hover:bg-secondary hover:text-primary transition-all border border-primary font-medium text-black flex justify-center bg-primary px-8 py-2 rounded-full"
          >
            Registrasi UMKM
          </a>
        </div>
        <div className="flex mt-5 flex-row gap-5 items-center">
          <img
            className="w-150 rounded-md h-80 object-cover"
            src={umkm?.image || ""}
            alt="umkm"
          />
          <div className="flex max-w-[60%] flex-col gap-5">
            <div className="border-2 border-primary px-5 py-1 rounded-4xl w-fit font-medium">
              {umkm?.category.name}
            </div>
            <h1 className="font-bold text-3xl">{umkm?.name}</h1>
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src="/icons/location.svg"
                    className="w-4"
                    alt="location"
                  />
                  <p>{umkm?.address}</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <img src="/icons/product.svg" className="w-4" alt="product" />
                  <p>{umkm?.jumlahProduk} Produk</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <img src="/icons/tel.svg" className="w-4" alt="product" />
                  <p>{umkm?.phone}</p>
                </div>
                <a
                  href="https://wa.me/6285156203867?text=Permisi%2C%20mohon%20maaf%20sebelumnya.%20Saya%20ingin%20menanyakan%20perihal%20nama%20UMKM%20yang%20Bapak%2FIbu%20jalankan"
                  target="_blank"
                  className="font-medium cursor-pointer bg-primary mt-2 text-white px-8 py-2 w-fit rounded-4xl"
                >
                  <p>Hubungi</p>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-2xl">Tentang</h1>
          <p className="mt-5">{umkm?.description}</p>
        </div>
        <div>
          <h1 className="font-bold text-2xl mb-5">Lokasi UMKM</h1>
          <iframe
            src={`https://maps.google.com/maps?q=${umkm.latitude},${umkm.longitude}&z=15&output=embed`}
            width="100%"
            height="400"
            loading="lazy"
            className="rounded-md"
          ></iframe>
        </div>
        <div>
          <Title size="text-2xl" title="Produk UMKM"></Title>
          <div className="grid grid-cols-5 gap-5 mt-10">
            {umkm?.product?.map((product, index) => {
              return (
                <div
                  key={index}
                  className="flex hover:scale-103 transition-all flex-col gap-2"
                >
                  <img
                    src={product.image || ""}
                    className="w-100 h-40 object-cover rounded-md"
                    alt="produk"
                  />
                  <h1 className="font-bold text-lg mt-2">{product.name}</h1>
                  <p className="text-sm">{product.description}</p>
                  <p className="font-semibold text-sm">Rp {product.price}</p>
                  <a
                    target="_blank"
                    href={`https://wa.me/6285156203867?text=Permisi%2C%20saya%20ingin%20membeli%20produk%20${product.name.replace(
                      " ",
                      "%20"
                    )}`}
                    className="text-sm cursor-pointer font-medium bg-primary w-full text-center text-white px-5 py-2 rounded-4xl mt-2"
                  >
                    <p>Beli</p>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <Title size="text-2xl" title="UMKM Lainnya"></Title>
          <div className="grid grid-cols-4 gap-5 mt-10">
            {allUmkm?.map((umkm, index) => {
              return (
                <div
                  key={index}
                  onClick={() => toDetail(umkm.id)}
                  className="flex hover:scale-103 transition-all flex-col cursor-pointer"
                >
                  <img
                    src={umkm.image || ""}
                    className="w-100 h-50 rounded-md object-cover"
                    alt="umkm"
                  />
                  <h1 className="font-bold text-lg mt-4">{umkm.name}</h1>
                  <div className="flex flex-row gap-2 mt-4">
                    <img
                      src="/icons/location.svg"
                      className="w-3"
                      alt="location"
                    />
                    <p>{umkm.address}</p>
                  </div>
                  <div className="flex flex-row gap-2 mt-2">
                    <img
                      src="/icons/product.svg"
                      className="w-3"
                      alt="product"
                    />
                    <p>{umkm.jumlahProduk} Produk</p>
                  </div>
                  <div className="text-sm mt-3 bg-primary mt-2 text-white px-8 py-2 w-fit rounded-4xl">
                    <p>{umkm.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </section>
      <div className="mt-10 bg-primary py-3 flex justify-center">
        <p className="text-white">@Crafted With Love</p>
      </div>
    </div>
  );
}
