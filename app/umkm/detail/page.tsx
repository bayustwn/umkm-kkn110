"use client";

import Footer from "@/app/component/footer";
import Title from "@/app/component/title";

export default function DetailUMKM() {
  return (
    <div>
      <section className="flex flex-col gap-15">
        <div className="flex flex-row items-center justify-between">
          <img src="/logo/logo.svg" alt="logo" />
          <a
            href="#"
            className="text-white hover:bg-secondary hover:text-primary transition-all border border-primary font-semibold text-black flex justify-center bg-primary px-8 py-2 rounded-full"
          >
            Registrasi UMKM
          </a>
        </div>
        <div className="flex mt-10 flex-row gap-5 items-center">
          <img className="w-[40%]" src="/image/umkm.jpg" alt="umkm" />
          <div className="flex max-w-[60%] flex-col gap-5">
            <div className="border-2 border-primary px-5 py-1 rounded-4xl w-fit font-semibold">
              Fashion
            </div>
            <h1 className="font-bold text-3xl">
              Jamu Jamu an yang berkhasiat sekali.
            </h1>
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <img
                    src="/icons/location.svg"
                    className="w-4"
                    alt="location"
                  />
                  <p>Jl. Bibis Tama No. 49/1</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <img src="/icons/product.svg" className="w-4" alt="product" />
                  <p>20 Produk</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <img src="/icons/tel.svg" className="w-4" alt="product" />
                  <p>085156203867</p>
                </div>
                <div className="font-semibold bg-primary mt-2 text-white px-8 py-2 w-fit rounded-4xl">
                  <p>Hubungi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Title size="text-2xl" title="Tentang UMKM"></Title>
          <p className="mt-5">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </p>
        </div>
        <div>
          <Title size="text-2xl" title="Produk UMKM"></Title>
          <div className="grid grid-cols-5 gap-5 mt-10">
            {Array.from({ length: 8 }).map((_, index) => {
              return (
                <div className="flex flex-col gap-2">
                  <img src="/image/produk.jpg" alt="produk" />
                  <h1 className="font-bold text-lg mt-2">
                    Lorem Ipsum Dolor Sit Amet.
                  </h1>
                  <p className="text-sm">Deskripsi Singkat padat dan jelas. menggambarkan produk</p>
                  <p className="font-bold text-sm">Rp 20.000</p>
                  <div className="text-sm cursor-pointer font-bold bg-primary w-full text-center text-white px-5 py-2 rounded-4xl mt-2">
                    <p>Beli</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
            <Title size="text-2xl" title="UMKM Lainnya"></Title>
            <div className="grid grid-cols-4 gap-5 mt-10">
                {Array.from({ length: 8 }).map((_, index) => {
                return (
                    <div className="flex flex-col">
                    <img src="/image/umkm.jpg" alt="umkm" />
                    <h1 className="font-bold text-lg mt-4">
                        Lorem Ipsum Dolor sit Amet.
                    </h1>
                    <div className="flex flex-row gap-2 mt-4">
                        <img
                        src="/icons/location.svg"
                        className="w-3"
                        alt="location"
                        />
                        <p>Jl. Bibis Tama No. 49/1</p>
                    </div>
                    <div className="flex flex-row gap-2 mt-2">
                        <img
                        src="/icons/product.svg"
                        className="w-3"
                        alt="product"
                        />
                        <p>20 Produk</p>
                    </div>
                    <div className="text-sm mt-3 bg-primary mt-2 text-white px-8 py-2 w-fit rounded-4xl">
                        <p>Fashion</p>
                    </div>
                    </div>
                );
                })}
            </div>
        </div>
        <Footer/>
      </section>
      <div className="mt-10 bg-primary py-3 flex justify-center">
        <p className="text-white">@Crafted With Love</p>
      </div>
    </div>
  );
}
