import { useState, useRef } from 'react';
import Footer from '@/components/layout/Footer';
import useNavigation from '@/hooks/useNavigation';
import { useNews } from '@/hooks/useNews';
import NewsCard from '@/components/ui/NewsCard';
import DateFilterModal from '@/components/ui/DateFilterModal';
import { FeaturedNewsSkeleton, NewsGridSkeleton } from '@/components/skeletons';
import { formatDate } from '@/utils/formatDate';
import type { News } from '@/types';

export default function NewsPage() {
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
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const renderNewsList = (items: News[]) => (
    <div className="w-full gap-5 mt-10 grid grid-cols-1 md:grid-cols-2">
      {items.length === 0 ? (
        <p className="text-center col-span-2 text-gray-500">Berita tidak ditemukan</p>
      ) : (
        items.map((item) => (
          <NewsCard
            key={item.id}
            id={item.id}
            title={item.title}
            content={item.content}
            image={item.image}
            createdAt={item.created_at}
            onNavigate={goToNewsDetail}
          />
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
              <input
                type="text"
                placeholder="Cari berita..."
                className="outline-none pl-4 border-none bg-transparent w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <img src="/icons/search.svg" alt="search" className="w-8 h-8 ml-2" />
            </div>
          </div>
          <button
            onClick={() => setShowDateModal(true)}
            className="p-3 md:hidden rounded-full bg-primary cursor-pointer"
          >
            <img src="/icons/date.svg" className="w-4" alt="date" />
          </button>
          <button
            className="bg-primary hidden md:flex px-5 cursor-pointer flex-row gap-2 hover:bg-primary/80 py-2 rounded-full text-white font-semibold"
            onClick={() => setShowDateModal(true)}
          >
            <img src="/icons/date.svg" className="w-5" alt="date" />
            <p>Filter Tanggal</p>
          </button>
        </div>
      </div>

      {!search &&
        !filterActive &&
        (isLoading ? (
          <FeaturedNewsSkeleton />
        ) : (
          <>
            <h1 className="font-bold text-3xl mt-10 md:mt-20">Berita Terkini</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
              {[0, 1].map(
                (i) =>
                  news[i] && (
                    <button
                      key={news[i].id}
                      onClick={() => goToNewsDetail(news[i].id)}
                      className="relative cursor-pointer h-90 md:h-full text-left"
                    >
                      <img
                        className="rounded-lg w-full h-full object-cover"
                        src={news[i].image}
                        alt={news[i].title}
                      />
                      <div className="absolute bottom-0 left-0 w-full h-full rounded-lg bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-0 left-0 text-white p-4 md:p-5 flex flex-col">
                        <p className="text-white/70 text-sm md:text-md">
                          {formatDate(news[i].created_at)}
                        </p>
                        <h1 className="text-xl md:text-3xl font-bold line-clamp-2 mb-2">
                          {news[i].title}
                        </h1>
                        <p className="line-clamp-2 md:text-md text-sm">{news[i].content}</p>
                      </div>
                    </button>
                  ),
              )}
            </div>
          </>
        ))}

      <div className="mt-10">
        {filterActive && (
          <div className="mb-6 flex gap-5 items-center">
            <span className="text-md text-gray-600">
              {formatDate(dateStart)} - {formatDate(dateEnd)}
            </span>
            <button
              className="px-4 py-2 rounded-4xl bg-primary text-white hover:bg-primary/80 cursor-pointer"
              onClick={() => {
                setFilterActive(false);
                setDateStart('');
                setDateEnd('');
              }}
            >
              Reset Filter
            </button>
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
            {isLoading ? (
              <NewsGridSkeleton />
            ) : (
              renderNewsList(news.filter((_, i) => i > 1).slice(0, page * perPage))
            )}
          </div>
        )}
      </div>

      {!currentSection && news.length > 2 + page * perPage && (
        <div className="w-fit flex flex-row w-full mt-10 justify-center">
          <button
            className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full"
            onClick={() => setPage(page + 1)}
          >
            <p>Lihat Lebih Banyak</p>
          </button>
        </div>
      )}

      <Footer />

      <DateFilterModal
        isOpen={showDateModal}
        onClose={() => setShowDateModal(false)}
        dateStart={dateStart}
        dateEnd={dateEnd}
        onDateStartChange={setDateStart}
        onDateEndChange={setDateEnd}
        onApply={() => {
          setShowDateModal(false);
          setFilterActive(true);
        }}
        dateStartRef={dateStartRef}
        dateEndRef={dateEndRef}
        formatDate={formatDate}
      />
    </div>
  );
}
