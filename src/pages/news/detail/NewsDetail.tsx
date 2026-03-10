import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import useNavigation from '@/hooks/useNavigation';
import { useNewsById, useOtherNews } from '@/hooks/useNews';
import { FullPageLoader } from '@/components/skeletons';
import { formatDate } from '@/utils/formatDate';

export default function BeritaDetail() {
  const { goToNewsDetail, goToNews } = useNavigation();
  const { id } = useParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: news, isLoading: newsLoading } = useNewsById(id);
  const { data: otherNews = [], isLoading: otherLoading } = useOtherNews(id);

  const isLoading = newsLoading || otherLoading;

  useEffect(() => {
    if (news?.content && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [news?.content]);

  if (isLoading) return <FullPageLoader message="Memuat detail berita..." />;

  return (
    <div className="py-10 px-5 md:px-0 md:py-[3%] md:px-[6%]">
      <Navbar color="text-black" />
      <div className="flex flex-col md:flex-row gap-8 mt-12 md:mt-20">
        <div className="w-full md:w-[70%] text-sm md:text-lg flex flex-col gap-3">
          <p className="text-black/80">{formatDate(news?.created_at ?? '')}</p>
          <h1 className="text-3xl md:text-5xl font-semibold">{news?.title}</h1>
          <img
            src={news?.image}
            className="w-full rounded-lg my-5 object-cover h-80 md:h-150"
            alt={news?.title}
          />
          <textarea
            ref={textareaRef}
            value={news?.content}
            readOnly
            className="w-full resize-none border-none outline-none bg-transparent text-justify p-0 overflow-hidden"
          />
        </div>
        <div className="w-full md:w-[30%] md:sticky md:top-8 h-fit">
          <h1 className="font-semibold text-xl">Berita Lainnya</h1>
          <div className="flex flex-col gap-1 md:gap-3 mt-5">
            {otherNews.map((item) => (
              <div key={item.id} className="w-full flex flex-row gap-3 items-center mb-3">
                <img
                  src={item.image}
                  className="h-30 md:h-35 rounded-md w-24 md:w-40 object-cover"
                  alt={item.title}
                />
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-xs md:text-sm">{formatDate(item.created_at)}</p>
                  <h1 className="font-bold line-clamp-1">{item.title}</h1>
                  <p className="line-clamp-2 text-xs md:text-sm">{item.content}</p>
                  <p
                    onClick={() => goToNewsDetail(item.id)}
                    className="text-xs md:text-sm font-medium mt-1 cursor-pointer w-fit hover:pl-1 pl-0 transition-all text-primary"
                  >
                    Lihat →
                  </p>
                </div>
              </div>
            ))}
            <div
              onClick={goToNews}
              className="w-fit flex flex-row w-full mt-3 md:mt-1 justify-center"
            >
              <div className="border md:text-md text-sm cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full">
                <p>Lihat Selengkapnya...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
