import { useEffect, useState, useRef } from "react"
import Footer from "../../components/Footer"
import RouterNavigation from "../../utils/navigation"
import Api from "../../components/Api"
import toast from "react-hot-toast"
import { formatDate } from "../../utils/formatDate"


export default function Berita() {
    const {goToBeritaDetail} = RouterNavigation()
    const [news,setNews] = useState<any>([])
    const [page, setPage] = useState(1);
    const perPage = 6;
    const [search, setSearch] = useState('');
    const [showDateModal, setShowDateModal] = useState(false);
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const dateStartRef = useRef<HTMLInputElement>(null);
    const dateEndRef = useRef<HTMLInputElement>(null);
    const [filterActive, setFilterActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const filteredByDate = news.filter((item: any) => {
      if (!dateStart || !dateEnd) return false;
      const date = new Date(item.created_at).toISOString().slice(0, 10);
      return date >= dateStart && date <= dateEnd;
    });

    const loadNews = async() =>{
        setIsLoading(true);
        try {
            await Api.get("/news").then(res=>{
                setNews(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal memuat data")
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        loadNews()
    },[])

    const filteredNews = news
      .filter((item: any) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );

    return (
        <div className="py-10 px-5 md:px-0 md:py-[3%] md:px-[6%]">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <img src="/icons/logo-black.svg" alt="logo" />
                <div className="flex flex-row items-center mt-5 md:mt-0 gap-2">
                    <div>
                        <div className="flex items-center border rounded-full px-1 py-1 w-full max-w-lg bg-white shadow-sm">
                            <input
                                type="text"
                                placeholder="Cari berita..."
                                className="outline-none pl-4 border-none bg-transparent w-full"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
                        </div>
                    </div>
                    <div onClick={() => setShowDateModal(true)} className="p-3 md:hidden rounded-full bg-primary">
                        <img src="/icons/date.svg" className="w-4" alt="date" />
                    </div>
                    <div className="bg-primary hidden md:flex px-5 cursor-pointer flex flex-row gap-2 hover:bg-primary/80 py-2 rounded-full text-white font-semibold"
                        onClick={() => setShowDateModal(true)}
                    >
                        <img src="/icons/date.svg" className="w-5" alt="date" />
                        <p>Filter Tanggal</p>
                    </div>
                </div>
            </div>

            {/* Berita Terkini */}
            {!search && !filterActive && (
              <>
                <h1 className="font-bold text-3xl mt-10 md:mt-20">Berita Terkini</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                  <div onClick={()=>goToBeritaDetail(news[0]?.id)} className="relative cursor-pointer h-90 md:h-full">
                    <img className="rounded-lg w-full h-full object-cover" src={news[0]?.image} alt="manukan" />
                    <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 text-white p-4 md:p-5 flex flex-col">
                      <p className="text-white/70 text-sm md:text-md">{formatDate(news[0]?.created_at)}</p>
                      <h1 className="text-xl md:text-3xl font-bold line-clamp-2 mb-2">{news[0]?.title}</h1>
                      <p className="line-clamp-2 md:text-md text-sm">{news[0]?.content}</p>
                    </div>
                  </div>
                  <div onClick={()=>goToBeritaDetail(news[1]?.id)} className="cursor-pointer relative h-90 md:h-full md:inline">
                    <img className="rounded-lg w-full h-full object-cover" src={news[1]?.image} alt="manukan" />
                    <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 text-white p-5 flex flex-col">
                      <p className="text-white/70">{formatDate(news[1]?.created_at)}</p>
                      <h1 className="text-3xl font-bold line-clamp-2 mb-2">{news[1]?.title}</h1>
                      <p className="line-clamp-2">{news[1]?.content}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-10">

              {filterActive && (
                <div className="mb-6 flex gap-5 items-center">
                  <span className="text-md text-gray-600">{formatDate(dateStart)} - {formatDate(dateEnd)}</span>
                  <button className="px-4 py-2 rounded-4xl bg-primary text-white hover:bg-primary/80" onClick={() => { setFilterActive(false); setDateStart(''); setDateEnd(''); }}>Reset Filter</button>
                </div>
              )}

              {filterActive ? (
                <>
                  <h1 className="font-bold text-3xl mb-6">Hasil Filter Tanggal</h1>
                  <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
                    {filteredByDate.length === 0 ? (
                      <p className="text-center col-span-2 text-gray-500">Berita tidak ditemukan</p>
                    ) : (
                      filteredByDate.map((news: any, index: any) => (
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
                      ))
                    )}
                  </div>
                </>
              ) : search ? (
                <>
                  <h1 className="font-bold text-3xl mb-6">Hasil Pencarian</h1>
                  <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
                    {filteredNews.length === 0 ? (
                      <p className="text-center col-span-2 text-gray-500">Berita tidak ditemukan</p>
                    ) : (
                      filteredNews.map((news: any, index: any) => (
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
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div>
                  
                  <h1 className="font-bold text-3xl mt-10 md:mt-15">Berita Seputar UMKM</h1>
                <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
                  {news.filter((_:any,index:number)=>index>1)
                    .slice(0, page * perPage)
                    .map((news:any, index:any) => {
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
                                  <p onClick={()=>goToBeritaDetail(news.id)}  className="text-sm font-medium mt-1 cursor-pointer w-fit hover:pl-1 pl-0 transition-all text-primary">Lihat →</p>
                              </div>
                          </div>
                      )
                  })}
                </div>
                </div>
              )}
            </div>
            {news.length > 2 + page * perPage && (
                <div className="w-fit flex flex-row w-full mt-10 justify-center">
                    <div
                        className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full"
                        onClick={() => setPage(page + 1)}
                    >
                        <p>Lihat Lebih Banyak</p>
                    </div>
                </div>
            )}
            <Footer />

            {showDateModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 px-6 md:px-6 w-full max-w-xs md:max-w-sm shadow-lg mx-2">
                  <h2 className="text-lg font-semibold mb-4">Pilih Rentang Tanggal</h2>
                  <div className="flex flex-col gap-4 mb-6">
                    <div>
                      <label className="block mb-2 font-medium">Tanggal Awal</label>
                      <button
                        type="button"
                        className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer"
                        onClick={() => dateStartRef.current?.showPicker()}
                      >
                        <img src="/icons/date-blue.svg" alt="date" className="w-4 h-4" />
                        <span className={dateStart ? "" : "text-normal text-primary/80"}>
                          {dateStart ? formatDate(dateStart) : "Pilih tanggal awal"}
                        </span>
                      </button>
                      <input
                        type="date"
                        ref={dateStartRef}
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                        value={dateStart}
                        onChange={e => setDateStart(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-medium">Tanggal Akhir</label>
                      <button
                        type="button"
                        className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer"
                        onClick={() => dateEndRef.current?.showPicker()}
                      >
                        <img src="/icons/date-blue.svg" alt="date" className="w-4 h-4" />
                        <span className={dateEnd ? "" : "text-primary/80"}>
                          {dateEnd ? formatDate(dateEnd) : "Pilih tanggal akhir"}
                        </span>
                      </button>
                      <input
                        type="date"
                        ref={dateEndRef}
                        className="absolute opacity-0 pointer-events-none w-0 h-0"
                        value={dateEnd}
                        onChange={e => setDateEnd(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button className="cursor-pointer px-4 py-2 rounded-4xl bg-secondary border-1 border-primary text-primary" onClick={() => setShowDateModal(false)}>Batal</button>
                    <button className="disabled:bg-primary/50 cursor-pointer px-4 py-2 rounded-4xl bg-primary text-white hover:bg-primary/80" onClick={() => { setShowDateModal(false); setFilterActive(true); }} disabled={!dateStart || !dateEnd}>Terapkan</button>
                  </div>
                </div>
              </div>
            )}
        </div>
    )
}