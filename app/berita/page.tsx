"use client";

import { useRouter } from "next/navigation";
import Footer from "../component/footer";
import Title from "../component/title";
import { useState,useEffect } from "react";
import { News } from "../model/news";
import api from "../utils/api";
import { formatDate } from "../utils/date";

export default function Berita() {
  const router = useRouter();
  const [previewNews, setPreviewNews] = useState<News[]>();
  const [allNews, setAllNews] = useState<News[]>();

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

  return (
    <div>
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
            />
          </div>
          <div className="cursor-pointer transform hover:scale-105 transition-all bg-primary rounded-4xl text-white flex flex-row h-full gap-3 px-10 py-2 justify-center items-center font-semibold">
            <img src="icons/date-white.svg" className="w-5" alt="date" />
            <p>Tanggal</p>
          </div>
        </div>
        <div className="mt-10">
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
        </div>
        <div className="mt-15">
          <Title size="text-3xl" title="Berita Lainnya" />
          <div className="mt-10 grid grid-cols-2 gap-5">
            {allNews?.map((news,index)=> {
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
            })}
          </div>
          <Footer></Footer>
        </div>
      </section>
      <div className="mt-10 bg-primary py-3 flex justify-center">
        <p className="text-white">@Crafted With Love</p>
      </div>
    </div>
  );
}
