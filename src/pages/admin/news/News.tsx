import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useNavigation from '@/hooks/useNavigation';
import { useNews, useDeleteNews } from '@/hooks/useNews';
import { NewsGridSkeleton } from '@/components/skeletons';
import DateFilterModal from '@/components/ui/DateFilterModal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { formatDate } from '@/utils/formatDate';
import type { News } from '@/types';

export default function AdminNewsPage() {
  const { goToNewsDetail } = useNavigation();
  const navigate = useNavigate();
  const { data: news = [], isLoading } = useNews();
  const deleteNews = useDeleteNews();

  const [page, setPage] = useState(1);
  const perPage = 6;
  const [search, setSearch] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const dateStartRef = useRef<HTMLInputElement>(null);
  const dateEndRef = useRef<HTMLInputElement>(null);
  const [filterActive, setFilterActive] = useState(false);
  const [newsToDelete, setNewsToDelete] = useState<News | null>(null);

  const filteredByDate = news.filter((item) => {
    if (!dateStart || !dateEnd) return false;
    const date = new Date(item.created_at).toISOString().slice(0, 10);
    return date >= dateStart && date <= dateEnd;
  });

  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = () => {
    if (!newsToDelete) return;
    deleteNews.mutate(newsToDelete.id, {
      onSettled: () => setNewsToDelete(null),
    });
  };

  const renderNewsCard = (item: News) => (
    <div key={item.id} className="w-full flex flex-row gap-5 items-center min-w-0">
      <img
        src={item.image}
        className="h-40 rounded-md w-32 md:w-60 object-cover flex-shrink-0"
        alt={item.title}
      />
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <p className="text-sm">{formatDate(item.created_at)}</p>
        <h1 className="font-bold text-md md:text-lg line-clamp-1 break-words w-full">
          {item.title}
        </h1>
        <p className="md:text-md text-sm line-clamp-2 break-words w-full">{item.content}</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setNewsToDelete(item)}
            className="text-sm font-medium text-red-600 transition-colors cursor-pointer"
          >
            Hapus
          </button>
          <button
            onClick={() => navigate(`/admin/berita/edit/${item.id}`)}
            className="text-sm font-medium text-primary transition-colors cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => goToNewsDetail(item.id)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
          >
            Lihat →
          </button>
        </div>
      </div>
    </div>
  );

  const renderNewsGrid = (items: News[]) => (
    <div className="w-full gap-5 mt-8 grid grid-cols-1 md:grid-cols-2">
      {items.length === 0 ? (
        <p className="text-center col-span-2 text-gray-500">Berita tidak ditemukan</p>
      ) : (
        items.map(renderNewsCard)
      )}
    </div>
  );

  const currentItems = filterActive
    ? filteredByDate
    : search
      ? filteredNews
      : news.slice(0, page * perPage);

  return (
    <div className="md:py-[2%] md:px-[2%]">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Kelola Berita</h1>
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
          <button
            onClick={() => navigate('/admin/berita/tambah')}
            className="bg-primary hover:bg-primary/80 text-white p-2 rounded-full transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-8">
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
        {isLoading ? <NewsGridSkeleton /> : renderNewsGrid(currentItems)}
      </div>

      {!filterActive && !search && news.length > page * perPage && (
        <div className="w-fit flex flex-row w-full mt-8 justify-center">
          <button
            className="border cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full"
            onClick={() => setPage(page + 1)}
          >
            <p>Lihat Lebih Banyak</p>
          </button>
        </div>
      )}

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

      <ConfirmModal
        isOpen={!!newsToDelete}
        onClose={() => setNewsToDelete(null)}
        onConfirm={handleDelete}
        title="Konfirmasi Hapus Berita"
        message={`Apakah Anda yakin ingin menghapus berita <span class="font-semibold">"${newsToDelete?.title}"</span>?`}
        confirmText="Hapus"
        isLoading={deleteNews.isPending}
        variant="danger"
      />
    </div>
  );
}
