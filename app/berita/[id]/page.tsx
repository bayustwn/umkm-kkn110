"use client";

import Footer from "@/app/component/footer";
import Title from "@/app/component/title";
import { News } from "@/app/model/news";
import api from "@/app/utils/api";
import { formatDate } from "@/app/utils/date";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailBerita() {

  const router = useRouter();
  const params = useParams<{id:string}>();
  const [news,setNews] = useState<News>();
  const [otherNews, setOtherNews] = useState<News[]>([]);

  const toDetail = (id:string) =>{
    router.push("/berita/" + id)
  }

  const getNews = async () => {
    try {
      const news = await api.get("/news/" + params.id).then((res) => {
        setNews(res.data.data);
      })
    } catch (error) {
      console.log(error);
    }
  }

  const getOtherNews = async()=>{
    try {
      const otherNews = await api.get("/news/other/" + params.id).then((res) => {
        setOtherNews(res.data.data);
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    getNews();
    getOtherNews();
  },[params])

  return (
    <div>
      <section>
        <div className="flex flex-row items-center justify-between">
          <img src="/logo/logo.svg" alt="logo" />
          <a
            href="#"
            className="text-white hover:bg-secondary hover:text-primary transition-all border border-primary font-semibold text-black flex justify-center bg-primary px-8 py-2 rounded-full"
          >
            Registrasi UMKM
          </a>
        </div>
        <div className="mt-15 flex flex-row gap-8 justify-between items-start w-full">
          <div className="max-w-[75%]">
            <div className="flex flex-col gap-5">
              <h1 className="font-bold text-4xl">
                {news?.title}
              </h1>
              <div className="flex flex-row gap-2 items-center">
                <img src="/icons/date.svg" alt="date" />
                <div className="bg-black h-1 w-1 rounded-4xl"></div>
                <p>{formatDate(news?.created_at!)}</p>
              </div>
              <img className="h-150 object-cover rounded-md" src={news?.thumbnail} alt="berita" />
            </div>
            <div className="mt-5">
              <p className="text-lg text-justify">
                {news?.content}
              </p>
            </div>
          </div>
          <div className="flex w-[25%] flex-col gap-5">
            <Title size="text-2xl" title="Berita Lainnya" />
            <div className="flex flex-col gap-4">
                {otherNews.map((news, index) => {
                  return (
              <div className="flex flex-col gap-2 cursor-pointer" onClick={()=>toDetail(news.id)} key={index}>
                <img
                  src={news.thumbnail}
                  alt="berita"
                  className="object-cover h-35 rounded-md"
                />
                <div>
                  <h1 className="font-bold text-sm line-clamp-2">
                    {news.title}
                  </h1>
                </div>
              </div>)})}
            </div>
          </div>
        </div>
        <Footer/>
      </section>
        <div className="mt-10 bg-primary py-3 flex justify-center">
            <p className="text-white">@Crafted With Love</p>
        </div>
    </div>
  );
}
