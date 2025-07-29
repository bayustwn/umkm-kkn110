import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Api from '../../../components/Api';
import { formatDate } from '../../../utils/formatDate';

// Skeleton Components
const StatsCardSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="flex items-center">
      <div className="p-3 bg-gray-200 rounded-lg animate-pulse">
        <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>
      <div className="ml-4">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse mb-2"></div>
        <div className="h-8 bg-gray-200 rounded w-12 animate-pulse"></div>
      </div>
    </div>
  </div>
);

const NewsItemSkeleton = () => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
);

const UmkmItemSkeleton = () => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="w-12 h-5 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
    </div>
  </div>
);

const NewsSummarySkeleton = () => (
  <div className="bg-white rounded-lg">
    <div className="pb-8">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <NewsItemSkeleton key={index} />
      ))}
    </div>
  </div>
);

const UmkmSummarySkeleton = () => (
  <div className="bg-white rounded-lg">
    <div className="pb-8">
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-4">
      {[1, 2, 3].map((index) => (
        <UmkmItemSkeleton key={index} />
      ))}
    </div>
  </div>
);

interface DashboardStats {
    totalBerita: number;
    totalUmkmAktif: number;
    totalUmkmPending: number;
}

interface NewsItem {
    id: string;
    title: string;
    content: string;
    image: string;
    createdAt: string;
}

interface UmkmItem {
    id: string;
    name: string;
    address: string;
    image: string;
    status: string;
    category: string;
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalBerita: 0,
        totalUmkmAktif: 0,
        totalUmkmPending: 0
    });
    const [recentNews, setRecentNews] = useState<NewsItem[]>([]);
    const [recentUmkm, setRecentUmkm] = useState<UmkmItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            
            const newsRes = await Api.get('/news');
            const newsData = newsRes.data.data || [];
            console.log(newsData);
            
            const umkmRes = await Api.get('/umkm/admin');
            const umkmData = umkmRes.data.data || [];
            
            const totalBerita = newsData.length;
            const totalUmkmAktif = umkmData.filter((umkm: any) => umkm.status === 'active').length;
            const totalUmkmPending = umkmData.filter((umkm: any) => umkm.status === 'pending').length;
            
            setStats({
                totalBerita,
                totalUmkmAktif,
                totalUmkmPending
            });
            
            setRecentNews(newsData.slice(0, 3).map((news: any) => ({
                id: news.id,
                title: news.title,
                content: news.content,
                image: news.image,
                createdAt: news.created_at
            })));
            
            setRecentUmkm(umkmData.slice(0, 3).map((umkm: any) => ({
                id: umkm.id,
                name: umkm.name,
                address: umkm.address,
                image: umkm.image,
                status: umkm.status,
                category: umkm.category
            })));
            
        } catch (error) {
            toast.error('Gagal mengambil data dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="py-15 md:px-[2%] md:py-[2%]">
            <div className="mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Selamat datang di panel admin UMKM</p>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {isLoading ? (
                        <>
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                            <StatsCardSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Berita</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalBerita}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">UMKM Aktif</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalUmkmAktif}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <div className="flex items-center">
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">UMKM Pending</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalUmkmPending}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Summary Sections */}
                <div className="grid grid-cols-1 mt-10 lg:grid-cols-2 gap-15">
                    {isLoading ? (
                        <>
                            <NewsSummarySkeleton />
                            <UmkmSummarySkeleton />
                        </>
                    ) : (
                        <>
                            <div className="bg-white rounded-lg">
                                <div className="pb-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-800">Ringkasan Berita</h2>
                                        <a href="/admin/berita" className="text-primary hover:text-primary/80 text-sm font-medium">
                                            Lihat Semua →
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    {recentNews.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentNews.map((news) => (
                                                <div key={news.id} className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={news.image} 
                                                            alt={news.title}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-sm font-medium line-clamp-1 text-gray-900 truncate">
                                                            {news.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                            {news.content}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {news.createdAt ? formatDate(news.createdAt) : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Belum ada berita</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg">
                                <div className="pb-8">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-gray-800">Ringkasan UMKM</h2>
                                        <a href="/admin/umkm" className="text-primary hover:text-primary/80 text-sm font-medium">
                                            Lihat Semua →
                                        </a>
                                    </div>
                                </div>
                                <div>
                                    {recentUmkm.length > 0 ? (
                                        <div className="space-y-4">
                                            {recentUmkm.map((umkm) => (
                                                <div key={umkm.id} className="flex items-start space-x-4">
                                                    <div className="flex-shrink-0">
                                                        <img 
                                                            src={umkm.image} 
                                                            alt={umkm.name}
                                                            className="w-16 h-16 object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center space-x-2">
                                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                                {umkm.name}
                                                            </h3>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                umkm.status === 'active' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {umkm.status === 'active' ? 'Aktif' : 'Pending'}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1 truncate">
                                                            {umkm.address}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {umkm.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500">Belum ada UMKM</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}