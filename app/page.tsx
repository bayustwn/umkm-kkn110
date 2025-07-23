"use client";

import { useRouter } from "next/navigation";
import Navbar from "./component/navbar";
import Title from "./component/title";
import { motion } from "motion/react";
import Footer from "./component/footer";
import api from "./utils/api";
import { useEffect, useState } from "react";
import { News } from "./model/news";
import { formatDate } from "./utils/date";
import { PreviewUmkm } from "./model/umkm";

const container = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.2,
    },
  }),
};

const newsAnimate = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.2,
    },
  }),
};

export default function Home() {
  const router = useRouter();
  const [previewNews, setPreviewNews] = useState<News[]>();
  const [previewUmkm, setPreviewUmkm] = useState<PreviewUmkm[]>();

  const toNews = () => {
    router.push("/berita")
  }

  const toUMKM = () => {
    router.push("/umkm")
  }

  const getUMKM = async () => {
    try {
      await api.get("/umkm/preview").then(res => {
        setPreviewUmkm(res.data.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const getNews = async () => {
    try {
      await api.get("/news/preview").then((res) => {
        setPreviewNews(res.data.data);
      })

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNews();
    getUMKM();
  }, [])

  return (
    <div>
      <section className="">
        <Navbar />
        <div className="flex flex-row mt-25 justify-between">
          <div className="flex flex-col gap-2">
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={container}
              className="flex flex-row gap-2 mt-20 font-normal"
            >
              <img
                src="icons/location.svg"
                className="animate-pulse w-4"
                alt="location"
              />
              <p>Manukan Wetan</p>
            </motion.div>

            <div className="flex flex-col gap-5 mt-2">
              <motion.h1
                initial="hidden"
                animate="visible"
                custom={1}
                variants={container}
                className="font-bold text-5xl max-w-150"
              >
                Lorem Ipsum Dolor Sit Amet
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                custom={2}
                variants={container}
                className="max-w-100"
              >
                Lorem Ipsum is simply dummy text of the printing pesetting
                industry. Lorem Ipsum has been.
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                custom={3}
                variants={container}
                onClick={()=>toUMKM()}
                className="hover:ml-2 cursor-pointer transition-all flex w-fit gap-10 flex-row border-1 border-primary pr-2 pl-5 font-medium py-2 rounded-4xl items-center"
              >
                <p>Lihat UMKM</p>
                <img src="icons/right.svg" className="w-6" alt="right" />
              </motion.div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute bg-white/20 backdrop-blur-xs bottom-5 text-white rounded-md px-5 py-3 right-20 border-[1px] border-white/50 flex flex-row gap-2">
              <h1 className="font-bold text-5xl">20+</h1>
              <div className="flex flex-col">
                <p className="font-bold text-2xl">UMKM</p>
                <p className="font-medium">Terdaftar</p>
              </div>
            </div>
            <img src="image/hero.jpg" alt="hero umkm" className="w-110" />
          </motion.div>
        </div>
        <div className="mt-30">
          <Title size="text-4xl" title="Berita Terkini" />
          <div className="mt-10 flex items-center flex-row gap-6">
            <motion.img
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              src={previewNews?.[0].image}
              alt="berita"
              className="rounded-md w-[40%] object-cover"
            />
            <div className="flex flex-col gap-2">
              <motion.div
                initial="hidden"
                whileInView="visible"
                custom={0}
                variants={newsAnimate}
                className="flex flex-row gap-2 items-center"
              >
                <img src="icons/date.svg" alt="date" />
                <div className="w-1 h-1 rounded-4xl bg-black"></div>
                <p>{formatDate(previewNews?.[0].created_at!)}</p>
              </motion.div>

              <motion.h1
                initial="hidden"
                whileInView="visible"
                custom={1}
                variants={newsAnimate}
                className="font-bold text-4xl mt-3 line-clamp-2"
              >
                {previewNews?.[0].title}
              </motion.h1>

              <motion.p
                initial="hidden"
                whileInView="visible"
                custom={2}
                variants={newsAnimate}
                className="mt-2 text-justify line-clamp-4"
              >
                {previewNews?.[0].content}
              </motion.p>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <Title size="text-lg" title="Berita Lainnya" />
          <div className="mt-5 flex flex-row gap-4">
            {previewNews?.filter((_, index) => index !== 0)?.map((news, index) => {
              return (
                <div key={index}>
                  <img
                    src={news.thumbnail}
                    alt="berita"
                    className="rounded-md w-60 object-cover h-35"
                  />
                  <div className="mt-2 flex max-w-60 flex-col gap-3 font-bold">
                    <h1 className="text-md line-clamp-2">
                      {news.title}
                    </h1>
                    <p className="font-normal line-clamp-2 mt-1 max-w-60">
                      {news.content}
                    </p>
                    <div className="flex mt-1 flex-row gap-2 items-center">
                      <img src="icons/date.svg" className="w-3" alt="date" />
                      <div className="w-1 h-1 rounded-4xl bg-black"></div>
                      <p className="font-normal text-sm">{formatDate(news.created_at)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="w-full mt-15 flex flex justify-center">
            <div onClick={() => toNews()} className="cursor-pointer hover:ml-2 transition-all flex w-fit gap-10 flex-row border-1 border-primary pr-2 pl-5 font-medium py-2 rounded-4xl items-center">
              <p>Lihat Selengkapnya</p>
              <img src="icons/right.svg" className="w-6" alt="right" />
            </div>
          </div>
          <div className="mt-20">
            <Title size="text-3xl" title="UMKM Terdaftar" />
            <div className="grid grid-cols-4 gap-5 mt-10">
              {previewUmkm?.map((umkm, index) => {
                return (
                  <div className="flex flex-col cursor-pointer" key={index}>
                    <img src={umkm.image || ""} className="h-50 object-cover rounded-md" alt="umkm" />
                    <h1 className="font-bold text-lg mt-4">
                      {umkm.name}
                    </h1>
                    <div className="font-medium">
                      <div className="flex flex-row gap-2 mt-4">
                        <img
                          src="icons/location.svg"
                          className="w-3"
                          alt="location"
                        />
                        <p>{umkm.address}</p>
                      </div>
                      <div className="flex flex-row gap-2 mt-2">
                        <img
                          src="icons/product.svg"
                          className="w-3"
                          alt="product"
                        />
                        <p>{umkm.jumlahProduk} Produk</p>
                      </div>
                    </div>
                    <div className="bg-primary px-5 py-1 text-white rounded-4xl w-fit text-medium mt-4">
                      <p>{umkm.category}</p>
                    </div>
                  </div>
                );
              })

              }
            </div>
            <div className="w-full mt-15 flex flex justify-center">
              <div onClick={()=>toUMKM()} className="hover:ml-2 cursor-pointer transition-all flex w-fit gap-10 flex-row border-1 border-primary pr-2 pl-5 font-medium py-2 rounded-4xl items-center">
                <p>Lihat Selengkapnya</p>
                <img src="icons/right.svg" className="w-6" alt="right" />
              </div>
            </div>
            <div className="mt-20 flex flex-row items-center bg-secondary border-2 border-primary py-8 px-20 rounded-lg">
              <div className="flex flex-col gap-5">
                <h1 className="text-5xl font-bold">
                  Registrasi UMKM Anda Sekarang!
                </h1>
                <p className="max-w-100">
                  Lorem Ipsum is simply dummy text of the printing pesetting
                  industry. Lorem Ipsum has been.
                </p>
                <div className="hover:ml-2 transition-all flex w-fit gap-10 flex-row border-1 border-primary pr-2 pl-5 font-medium py-2 rounded-4xl items-center">
                  <p>Registrasi Sekarang</p>
                  <img src="icons/right.svg" className="w-6" alt="right" />
                </div>
              </div>
              <img src="image/ayo.png" alt="ayo" />
            </div>
            <Footer />
          </div>
        </div>
      </section>
      <div className="mt-10 bg-primary py-3 flex justify-center">
        <p className="text-white">@Crafted With Love</p>
      </div>
    </div>
  );
}
