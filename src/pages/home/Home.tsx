import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar";
import RouterNavigation from "../../utils/navigation";
import Api from "../../components/Api";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/formatDate";
import Footer from "../../components/Footer";

export default function Home() {

  const { goToUMKM, goToBerita, goToBeritaDetail, goToRegister, goToUMKMDetail} = RouterNavigation()
  const [data, setData] = useState<any>(null)

  const targetRef = useRef<HTMLDivElement>(null);

  const scrollUMKM = () => {
    targetRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      await Api.get("/dashboard").then(res => {
        setData(res.data.data)
      })
    } catch (error) {
      toast.error("Gagal memuat data")
    }
  }

  useEffect(() => {
    loadData();
  }, [])

  return (
    <div className="relative h-screen">
      <img
        src="/images/manukan.jpg"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
      <div className="relative z-10 px-5 md:px-0 py-10 md:py-[3%] md:px-[6%] text-white h-full">
        <Navbar />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center h-full">
          <div className="flex flex-col gap-4">
            <h1 className="font-bold text-3xl md:text-5xl">
              Temukan UMKM Terbaik di Manukan Wetan.
            </h1>
            <p className="max-w-full md:max-w-[80%] my-1 text-base md:text-lg">
              Dukung ekonomi lokal dengan mengenal dan menggunakan produk serta
              layanan dari para pelaku usaha kecil menengah di sekitar Anda.
            </p>
            <div onClick={scrollUMKM} className="cursor-pointer hover:ml-2 transition-all ml-0 bg-primary gap-4 md:gap-10 text-sm md:text-base text-white w-fit flex pl-4 pr-2 justify-center items-center py-2 rounded-full">
              Lihat UMKM
              <img src="/icons/go.svg" alt="go" className="w-4 md:w-6" />
            </div>
            <div className="grid grid-cols-2 gap-2 h-full mt-6 md:mt-10">
              <div className="flex flex-row items-center gap-2">
                <h1 className="font-bold text-2xl md:text-4xl">{data?.umkm?.total}+</h1>
                <div className="flex flex-col">
                  <h1 className="font-bold text-lg md:text-2xl">UMKM</h1>
                  <p className="text-xs md:text-sm">Terdaftar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-black flex flex-col gap-5 py-20">
          <h1 className="font-bold text-3xl">Berita Terkini</h1>
          <div className="flex flex-col md:flex-row gap-5 mt-2 items-start">
            <div onClick={() => goToBeritaDetail(data?.news.items[0].id)} className="w-full md:w-[55%] relative cursor-pointer mb-5 md:mb-0">
              <img
                src={data?.news.items[0].image}
                className="h-90 md:h-130 rounded-md w-full object-cover"
                alt="manukan"
              />
              <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black/90 to-transparent" />
              <div className="text-white flex flex-col gap-2 absolute bottom-0 left-0 p-5 md:p-8 z-10 w-full overflow-hidden">
                <p className="text-white/80 text-sm">{formatDate(data?.news.items[0].created_at)}</p>
                <h1 className="font-bold text-2xl line-clamp-2 break-words w-full">
                  {data?.news.items[0].title}
                </h1>
                <p className="line-clamp-2 text-sm md:text-medium break-words w-full">
                  {data?.news.items[0].content}
                </p>
              </div>
            </div>
            <div className="w-full md:w-[45%] flex flex-col gap-5">
              {data?.news.items.filter((_: any, index: number) => index > 0).map((news: any, index: number) => {
                return (
                  <div key={index} className="w-full flex flex-row gap-5 items-center min-w-0">
                    <img
                      src={news.image}
                      className="h-40 rounded-md w-32 md:w-60 object-cover flex-shrink-0"
                      alt="manukan"
                    />
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <p className="text-sm">{formatDate(news.created_at)}</p>
                      <h1 className="font-bold text-md md:text-lg line-clamp-1 break-words w-full">
                        {news.title}
                      </h1>
                      <p className="md:text-md text-sm line-clamp-2 break-words w-full">
                        {news.content}
                      </p>
                      <p onClick={() => goToBeritaDetail(news.id)} className="text-sm font-medium mt-1 cursor-pointer w-fit hover:pl-1 pl-0 transition-all text-primary">Lihat →</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className=" w-fit flex flex-row w-full mt-5 justify-center">
            <div onClick={goToBerita} className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full">
              <p>Baca Selengkapnya...</p>
            </div>
          </div>
        </div>
        <div ref={targetRef} className="flex flex-col text-black gap-5 pb-10">
          <h1 className="text-3xl font-bold">UMKM Manukan Wetan</h1>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {data?.umkm?.items?.map((umkm:any, index:any) => {
              return (
                <div key={index} className="flex flex-col gap-2 mb-3 md:mb-0 bg-white rounded-md">
                  <div className="relative">
                    <img src={umkm.image} alt="manukan" className="w-full h-60 object-cover rounded-md" />
                    <div className="absolute top-3 left-3 justify-center bg-primary w-fit px-4 text-white border border-primary text-sm py-1 rounded-full">
                      <p>{umkm.category.name}</p>
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
                        <p className="text-sm">{umkm._count.product} Produk</p>
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
              )
            })}
          </div>
          <div className=" w-fit flex flex-row w-full mt-5 justify-center">
            <div onClick={goToUMKM} className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full">
              <p>Lihat Selengkapnya...</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center mt-20 md:mt-32 px-4">
            <h1 className="text-2xl md:text-4xl font-bold text-center">Registrasi UMKM anda sekarang.</h1>
            <p className="text-center text-base md:text-lg">Tampilkan usaha Anda di website UMKM Manukan Wetan. <br />Gratis dan mudah!</p>
            <div onClick={goToRegister} className="bg-primary w-fit px-5 py-2 rounded-full text-white font-medium mt-2 md:mt-0 cursor-pointer hover:bg-primary/90 transition-all">
              <p>Registrasi Sekarang</p>
            </div>
            <Footer/>
          </div>
        </div>
      </div>
    </div>
  );
}
