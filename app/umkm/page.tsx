"use client";

import Footer from "@/app/component/footer";
import Title from "../component/title";
import { useRouter } from "next/navigation";

export default function UMKMPage() {

    const router = useRouter();

    const toDetail = () => {
        router.push(window.location.pathname + "/detail");
    }

  return (
    <div>
      <section>
        <div className="flex flex-row gap-3 items-center">
          <img src="logo/logo.svg" alt="logo" />
          <div className="relative w-full">
            <img
              src="icons/search.svg"
              alt="search"
              className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Cari UMKM"
              className=" py-2 pl-12 pr-4 w-full rounded-4xl border-2 border-primary outline-none"
            />
          </div>
        </div>
        <div className="flex flex-row gap-3 mt-10">
          {Array.from({ length: 3 }).map((_, index) => {
            return (
              <div className="border-2 hover:bg-primary hover:text-white transition-all cursor-pointer font-semibold rounded-4xl border-primary px-5 py-1">
                <p>Kategori</p>
              </div>
            );
          })}
          <div className="border-2 bg-primary text-white transition-all cursor-pointer font-semibold rounded-4xl border-primary px-5 py-1">
                <p>Semua</p>
              </div>
        </div>
        <div className="flex flex-col gap-3 mt-10">
          <Title size="text-2xl" title="Rekomendasi Untuk Anda" />
          <div className="flex flex-row gap-5 mt-5">
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <div onClick={()=>{
                    toDetail();
                }} className="flex flex-col">
                  <div className="relative">
                    <img src="image/umkm.jpg" alt="umkm" />
                    <div className="absolute top-3 left-3">
                        <div className="bg-primary px-3 text-sm py-1 rounded-4xl">
                            <p className="text-white">Fashion</p>
                        </div>
                    </div>
                  </div>
                  <h1 className="font-bold text-lg mt-4">
                    Lorem Ipsum Dolor sit Amet.
                  </h1>
                  <div>
                    <div className="flex flex-row gap-2 mt-4">
                      <img
                        src="icons/location.svg"
                        className="w-3"
                        alt="location"
                      />
                      <p>Jl. Bibis Tama No. 49/1</p>
                    </div>
                    <div className="flex flex-row gap-2 mt-2">
                      <img
                        src="icons/product.svg"
                        className="w-3"
                        alt="product"
                      />
                      <p>20 Produk</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-15 flex-col gap-3">
          <Title size="text-2xl" title="UMKM Manukan Wetan" />
          <div className="grid grid-cols-2 gap-5 mt-10">
            {Array.from({ length: 4 }).map((_, index) => {
              return (
                <div className="flex flex-row gap-4 items-center">
                  <img
                    className="object-cover w-[45%] rounded-md"
                    src="image/umkm.jpg"
                    alt="umkm"
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-lg mb-3">
                      Lorem Ipsum Dolor sit Amet.
                    </h1>
                    <div className="flex flex-row text-sm gap-2">
                      <img
                        src="icons/location.svg"
                        className="w-3"
                        alt="location"
                      />
                      <p>Jl. Bibis Tama No. 49/1</p>
                    </div>
                    <div className="flex text-sm flex-row gap-2">
                      <img
                        src="icons/product.svg"
                        className="w-3"
                        alt="product"
                      />
                      <p>20 Produk</p>
                    </div>
                    <div className="bg-primary mt-3 text-sm px-5 text-white py-1 w-fit rounded-4xl">
                        <p>Fashion</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </section>
      <div>
        <div className="mt-10 bg-primary py-3 flex justify-center">
          <p className="text-white">@Crafted With Love</p>
        </div>
      </div>
    </div>
  );
}
