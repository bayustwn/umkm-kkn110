import { useState, useRef } from 'react';
import Footer from '@/components/layout/Footer';
import useNavigation from '@/hooks/useNavigation';
import { useNews } from '@/hooks/useNews';
import NewsCard from '@/components/ui/NewsCard';
import { FeaturedNewsSkeleton, NewsCardSkeleton } from '@/components/skeletons';
import { formatDate } from '@/utils/formatDate';

export default function Berita() {
  const { goToNewsDetail } = useNavigation();
  const { data: news = [], isLoading } = useNews();

  const [page, setPage] = useState(1);
  const perPage = 6;
  const [search, setSearch] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const dateStartRef = useRef<HTMLInputElement>(null);
  const dateEndRef = useRef<HTMLInputElement>(null);
  const [filterActive, setFilterActive] = useState(false);

  const filteredByDate = news.filter((item) => {
    if (!dateStart || !dateEnd) return false;
    const date = new Date(item.created_at).toISOString().slice(0, 10);
    return date >= dateStart && date <= dateEnd;
  });

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const NewsGridSkeleton = () => (
    <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
    </div>
  );

  const renderNewsList = (items: typeof news) => (
    <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
      {items.length === 0 ? (
        <p className="text-center col-span-2 text-gray-500">Berita tidak ditemukan</p>
      ) : (
        items.map((item) => (
          <NewsCard key={item.id} id={item.id} title={item.title} content={item.content} image={item.image} createdAt={item.created_at} onNavigate={goToNewsDetail} />
        ))
      )}
    </div>
  );

  const currentSection = filterActive
    ? { title: 'Hasil Filter Tanggal', items: filteredByDate }
    : search
    ? { title: 'Hasil Pencarian', items: filteredNews }
    : null;

  return (
    <div className="py-10 px-5 md:px-0 md:py-[3%] md:px-[6%]">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <img src="/icons/logo-black.svg" alt="logo" />
        <div className="flex flex-row items-center mt-5 md:mt-0 gap-2">
          <div>
            <div className="flex items-center border rounded-full px-1 py-1 w-full max-w-lg bg-white shadow-sm">
              <input type="text" placeholder="Cari berita..." className="outline-none pl-4 border-none bg-transparent w-full" value={search} onChange={(e) => setSearch(e.target.value)} />
              <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
            </div>
          </div>
          <div onClick={() => setShowDateModal(true)} className="p-3 md:hidden rounded-full bg-primary">
            <img src="/icons/date.svg" className="w-4" alt="date" />
          </div>
          <div className="bg-primary hidden md:flex px-5 cursor-pointer flex flex-row gap-2 hover:bg-primary/80 py-2 rounded-full text-white font-semibold" onClick={() => setShowDateModal(true)}>
            <img src="/icons/date.svg" className="w-5" alt="date" />
            <p>Filter Tanggal</p>
          </div>
        </div>
      </div>

      {!search && !filterActive && (
        isLoading ? <FeaturedNewsSkeleton /> : (
          <>
            <h1 className="font-bold text-3xl mt-10 md:mt-20">Berita Terkini</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              {[0, 1].map((i) => news[i] && (
                <div key={news[i].id} onClick={() => goToNewsDetail(news[i].id)} className="relative cursor-pointer h-90 md:h-full">
                  <img className="rounded-lg w-full h-full object-cover" src={news[i].image} alt={news[i].title} />
                  <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 text-white p-4 md:p-5 flex flex-col">
                    <p className="text-white/70 text-sm md:text-md">{formatDate(news[i].created_at)}</p>
                    <h1 className="text-xl md:text-3xl font-bold line-clamp-2 mb-2">{news[i].title}</h1>
                    <p className="line-clamp-2 md:text-md text-sm">{news[i].content}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )
      )}

      <div className="mt-10">
        {filterActive && (
          <div className="mb-6 flex gap-5 items-center">
            <span className="text-md text-gray-600">{formatDate(dateStart)} - {formatDate(dateEnd)}</span>
            <button className="px-4 py-2 rounded-4xl bg-primary text-white hover:bg-primary/80" onClick={() => { setFilterActive(false); setDateStart(''); setDateEnd(''); }}>Reset Filter</button>
          </div>
        )}
        {currentSection ? (
          <>
            <h1 className="font-bold text-3xl mb-6">{currentSection.title}</h1>
            {isLoading ? <NewsGridSkeleton /> : renderNewsList(currentSection.items)}
          </>
        ) : (
          <div>
            <h1 className="font-bold text-3xl mt-10 md:mt-15">Berita Seputar UMKM</h1>
            {isLoading ? <NewsGridSkeleton /> : renderNewsList(news.filter((_, i) => i > 1).slice(0, page * perPage))}
          </div>
        )}
      </div>

      {!currentSection && news.length > 2 + page * perPage && (
        <div className="w-fit flex flex-row w-full mt-10 justify-center">
          <div className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full" onClick={() => setPage(page + 1)}>
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
                <button type="button" className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer" onClick={() => dateStartRef.current?.showPicker()}>
                  <img src="/icons/date-blue.svg" alt="date" className="w-4 h-4" />
                  <span className={dateStart ? '' : 'text-normal text-primary/80'}>{dateStart ? formatDate(dateStart) : 'Pilih tanggal awal'}</span>
                </button>
                <input type="date" ref={dateStartRef} className="absolute opacity-0 pointer-events-none w-0 h-0" value={dateStart} onChange={(e) => setDateStart(e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-medium">Tanggal Akhir</label>
                <button type="button" className="flex items-center gap-2 border-1 border-primary text-primary bg-secondary rounded-4xl pl-4 pr-4 py-2 w-full outline-none cursor-pointer" onClick={() => dateEndRef.current?.showPicker()}>
                  <img src="/icons/date-blue.svg" alt="date" className="w-4 h-4" />
                  <span className={dateEnd ? '' : 'text-primary/80'}>{dateEnd ? formatDate(dateEnd) : 'Pilih tanggal akhir'}</span>
                </button>
                <input type="date" ref={dateEndRef} className="absolute opacity-0 pointer-events-none w-0 h-0" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} />
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
  );
}