import { useNavigate } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { useUmkmAdmin } from '@/hooks/useUmkm';
import { formatDate } from '@/utils/formatDate';
import { StatsCardSkeleton, SectionSkeleton } from '@/components/skeletons';

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}

function StatsCard({ icon, label, value, color }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 ${color} rounded-lg`}>{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: newsList, isLoading: newsLoading } = useNews();
  const { data: umkmList, isLoading: umkmLoading } = useUmkmAdmin();

  const isLoading = newsLoading || umkmLoading;
  const totalBerita = newsList?.length ?? 0;
  const totalUmkmAktif = umkmList?.filter((u) => u.status === 'active').length ?? 0;
  const totalUmkmPending = umkmList?.filter((u) => u.status === 'pending').length ?? 0;
  const recentNews = newsList?.slice(0, 3) ?? [];
  const recentUmkm = umkmList?.slice(0, 3) ?? [];

  return (
    <div className="py-15 md:px-[2%] md:py-[2%]">
      <div className="mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Selamat datang di panel admin UMKM</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {isLoading ? (
            <>{[1, 2, 3].map((i) => <StatsCardSkeleton key={i} />)}</>
          ) : (
            <>
              <StatsCard label="Total Berita" value={totalBerita} color="bg-blue-100" icon={<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>} />
              <StatsCard label="UMKM Aktif" value={totalUmkmAktif} color="bg-green-100" icon={<svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
              <StatsCard label="UMKM Pending" value={totalUmkmPending} color="bg-yellow-100" icon={<svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 mt-10 lg:grid-cols-2 gap-15">
          {isLoading ? (
            <>{[1, 2].map((i) => <SectionSkeleton key={i} />)}</>
          ) : (
            <>
              <div className="bg-white rounded-lg">
                <div className="pb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Ringkasan Berita</h2>
                    <button onClick={() => navigate('/admin/berita')} className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer">Lihat Semua →</button>
                  </div>
                </div>
                {recentNews.length > 0 ? (
                  <div className="space-y-4">
                    {recentNews.map((news) => (
                      <div key={news.id} className="flex items-start space-x-4">
                        <img src={news.image} alt={news.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium line-clamp-1 text-gray-900 truncate">{news.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{news.content}</p>
                          <p className="text-xs text-gray-400 mt-2">{news.created_at ? formatDate(news.created_at) : '-'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8"><p className="text-gray-500">Belum ada berita</p></div>
                )}
              </div>

              <div className="bg-white rounded-lg">
                <div className="pb-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Ringkasan UMKM</h2>
                    <button onClick={() => navigate('/admin/umkm')} className="text-primary hover:text-primary/80 text-sm font-medium cursor-pointer">Lihat Semua →</button>
                  </div>
                </div>
                {recentUmkm.length > 0 ? (
                  <div className="space-y-4">
                    {recentUmkm.map((umkm) => (
                      <div key={umkm.id} className="flex items-start space-x-4">
                        <img src={umkm.image} alt={umkm.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900 truncate">{umkm.name}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${umkm.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {umkm.status === 'active' ? 'Aktif' : 'Pending'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1 truncate">{umkm.address}</p>
                          <p className="text-xs text-gray-400 mt-1">{umkm.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8"><p className="text-gray-500">Belum ada UMKM</p></div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}