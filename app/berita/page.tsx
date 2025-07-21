"use client";

import { useRouter } from "next/navigation";
import Footer from "../component/footer";
import Title from "../component/title";
import { useState,useEffect, useMemo } from "react";
import { News } from "../model/news";
import api from "../utils/api";
import { formatDate } from "../utils/date";

export default function Berita() {
  const router = useRouter();
  const [previewNews, setPreviewNews] = useState<News[]>();
  const [allNews, setAllNews] = useState<News[]>();
  const [search,setSearch] = useState<string>("")
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const filteredNews = useMemo(() => {
    if (!debouncedSearch || debouncedSearch.trim() === "") return allNews;
    return allNews?.filter(news =>
      news.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      news.content.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [allNews, debouncedSearch]);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const pagedNews = useMemo(() => {
    if (!filteredNews) return [];
    return filteredNews.slice(0, page * pageSize);
  }, [filteredNews, page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300); 
    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const toDetail = (id:string) => {
    router.push(window.location.pathname + "/" + id);
  }

  const getPreviewNews = async () => {
    try{
        const preview = await api.get("/news/preview").then((res) => {
            setPreviewNews(res.data.data)
        })
    }catch(error) {
        console.log(error);
    }
  }

  const getAllNews = async () => {
    try{
        const news = await api.get("/news").then((res) => {
            setAllNews(res.data.data)
        })
    }catch(error) {
        console.log(error);
    }
  } 

  useEffect(()=>{
    getPreviewNews();
    getAllNews();
  },[])

  function SkeletonCard() {
    return (
      <div className="flex flex-row gap-4 items-center animate-pulse">
        <div className="w-[40%] h-40 bg-gray-200 rounded-md" />
        <div className="flex-1 flex flex-col gap-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex flex-row gap-2 items-center mt-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full" />
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  function SkeletonPreview() {
    return (
      <div className="flex flex-row justify-between items-center mt-8 py-6 rounded-lg animate-pulse">
        <div className="w-[48%] flex flex-col gap-4">
          <div className="flex flex-row gap-2 items-center">
            <div className="w-4 h-4 bg-gray-200 rounded-full" />
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="h-10 bg-gray-200 rounded w-3/4" />
          <div className="h-64 bg-gray-200 rounded-md w-full" />
        </div>
        <div className="w-[48%] flex flex-col gap-4">
          {Array.from({length: 3}).map((_, idx) => (
            <div className="flex flex-row gap-4 items-center" key={idx}>
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="flex flex-row gap-2 items-center mt-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full" />
                  <div className="w-1 h-1 bg-gray-200 rounded-full" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
              <div className="w-[40%] h-24 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between h-screen">
      <section className="px-[10%] pt-10">
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
              placeholder="Cari Berita"
              className=" py-2 pl-12 pr-4 w-full rounded-4xl border-2 border-primary outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="cursor-pointer transform hover:scale-105 transition-all bg-primary rounded-4xl text-white flex flex-row h-full gap-3 px-10 py-2 justify-center items-center font-semibold">
            <img src="icons/date-white.svg" className="w-5" alt="date" />
            <p>Tanggal</p>
          </div>
        </div>
        {(!search || search.trim() === "") && (
          <div className="mt-10">
            {(!previewNews || previewNews.length === 0) ? (
              <SkeletonPreview />
            ) : (
              <div className="flex flex-row justify-between items-center mt-8 py-6 rounded-lg">
                <div onClick={()=>toDetail(previewNews?.[0].id!)} className="w-[48%] flex flex-col gap-4">
                  <div className="flex flex-row gap-2 items-center font-medium">
                    <img src="icons/date.svg" alt="date" className="w-4 h-4" />
                    <div className="w-1 h-1 rounded-full bg-black" />
                    <p>{formatDate(previewNews?.[0].created_at!)}</p>
                  </div>
                  <h1 className="text-4xl font-bold">
                    {previewNews?.[0].title}
                  </h1>
                  <img
                    className="h-100 rounded-md object-cover w-full"
                    src={previewNews?.[0].image}
                    alt="berita"
                  />
                </div>
                <div className="w-[48%] flex flex-col gap-4">
                  {previewNews?.filter((news,index)=> index !== 0 && index < 4).map((news, index) => {
                    return (
                      <div className="flex flex-row gap-4 items-center cursor-pointer" onClick={()=>toDetail(news.id)} key={index}>
                        <div className="flex-1 flex flex-col gap-2">
                          <h1 className="font-bold text-lg line-clamp-1">
                            {news.title}
                          </h1>
                          <p className="text-sm line-clamp-3">
                            {news.content}
                          </p>
                          <div className="flex flex-row gap-2 items-center font-medium">
                            <img
                              className="w-3 h-3"
                              src="icons/date.svg"
                              alt="date"
                            />
                            <div className="w-1 h-1 rounded-full bg-black" />
                            <p className="text-sm font-normal">{formatDate(news.created_at)}</p>
                          </div>
                        </div>
                        <img
                          className="w-[40%] object-cover rounded-md"
                          src={news.thumbnail}
                          alt="umkm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-15">
          {(!search || search.trim() === "") && <Title size="text-3xl" title="Berita Lainnya" />}
          <div className="mt-10 grid grid-cols-2 gap-5">
            {(!allNews || (search && search !== debouncedSearch)) ?
              Array.from({length: 4}).map((_, idx) => <SkeletonCard key={idx} />)
            : (search && search.trim() !== "" && pagedNews.length === 0) ? (
              <div className="col-span-2 text-center py-10 text-lg">Berita tidak ditemukan</div>
            ) : pagedNews?.map((news,index)=> {
                return (
                  <div className="flex flex-row gap-4 items-center cursor-pointer" onClick={()=>toDetail(news.id)} key={index}>
                    <img
                      className="w-[40%] h-40 object-cover rounded-md"
                      src={news.thumbnail}
                      alt="umkm"
                    />
                    <div className="flex-1 flex flex-col gap-3">
                      <h1 className="font-bold text-lg line-clamp-2">
                        {news.title}
                      </h1>
                      <p className="text-sm line-clamp-3">
                        {news.content}
                      </p>
                      <div className="flex flex-row gap-2 items-center font-medium">
                        <img
                          className="w-3 h-3"
                          src="icons/date.svg"
                          alt="date"
                        />
                        <div className="w-1 h-1 rounded-full bg-black" />
                        <p className="text-sm font-normal">{formatDate(news.created_at)}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            }
          </div>
          {/* Tombol Lihat Lebih Banyak */}
          {pagedNews.length < (filteredNews?.length || 0) && (
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-2 bg-primary text-white rounded-4xl font-semibold hover:bg-primary/80 transition"
                onClick={() => setPage(page + 1)}
              >
                Lihat Lebih Banyak
              </button>
            </div>
          )}
          <Footer></Footer>
        </div>
      </section>
      <div className="bg-primary py-3 flex justify-center">
        <p className="text-white">@Crafted With Love</p>
      </div>
    </div>
  );
}
