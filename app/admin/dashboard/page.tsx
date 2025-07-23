'use client'

import Title from '@/app/component/title'
import api from '@/app/utils/api'
import { formatDate } from '@/app/utils/date'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState<any>()

  const getDashboard = async () => {
    try {
      await api.get("/dashboard").then(res => {
        setData(res.data.data)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const toDetail = (id: string) => {
    router.push("/berita/" + id)
  }

  const toDetailUMKM = (id: string) => {
    router.push("/umkm/" + id)
  }

  useEffect(() => {
    getDashboard()
  }, [])

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-3xl font-bold'>Dashboard</p>
      <div className='flex flex-row gap-2'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col gap-2 px-4 py-3 rounded-xl border-black border'>
            <div className='flex flex-row gap-2 w-fit items-center'>
              <div className='w-7 h-7 bg-primary flex justify-center rounded-full'>
                <img src="/icons/active/news.svg" width={12} alt="news" />
              </div>
              <p className='font-medium'>Berita Terpublish</p>
            </div>
            <p className='font-bold text-2xl'>{data?.news.total || 0}</p>
            <p className='text-xs'>Total berita yang diupload</p>
          </div>
          <div className='flex flex-col gap-2 px-4 py-3 rounded-xl border-black border'>
            <div className='flex flex-row gap-2 w-fit items-center'>
              <div className='w-7 h-7 bg-primary flex justify-center rounded-full'>
                <img src="/icons/active/news.svg" width={12} alt="news" />
              </div>
              <p className='font-medium'>UMKM Terdaftar</p>
            </div>
            <p className='font-bold text-2xl'>{data?.umkm.total || 0}</p>
            <p className='text-xs'>Total berita yang diupload</p>
          </div>
        </div>
        <div className='rounded-xl bg-secondary border border-primary w-[80%]'>

        </div>
      </div>
      <div className='grid grid-cols-2 gap-10 mt-5'>
        <div>
          <Title size='text-xl' title='Preview Berita' />
          <div className='flex flex-col gap-3 mt-5'>
            {data?.news.items.map((news: any, index: number) => {
              return (
                <div className="flex flex-row hover:scale-103 transition-all gap-4 items-center cursor-pointer" onClick={() => toDetail(news.id)} key={index}>
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
                        src="/icons/date.svg"
                        alt="date"
                      />
                      <div className="w-1 h-1 rounded-full bg-black" />
                      <p className="text-sm font-normal">{formatDate(news.created_at)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div>
          <Title size='text-xl' title='Preview UMKM' />
          <div className='flex flex-col gap-3 mt-5'>
            {data?.umkm.items.map((umkm: any, index: number) => {
              return (
                <div key={index} onClick={() => toDetailUMKM(umkm.id)} className="flex cursor-pointer hover:scale-103 transition-all flex-row gap-4 items-center">
                  <img
                    className="object-cover w-50 h-40 rounded-md"
                    src={umkm.image || ""}
                    alt="umkm"
                  />
                  <div className="flex flex-col gap-2">
                    <h1 className="font-bold text-lg mb-3">
                      {umkm.name}
                    </h1>
                    <div className="flex flex-row text-sm gap-2">
                      <img
                        src="/icons/location.svg"
                        className="w-3"
                        alt="location"
                      />
                      <p>{umkm.address}</p>
                    </div>
                    <div className="flex text-sm flex-row gap-2">
                      <img
                        src="/icons/product.svg"
                        className="w-3"
                        alt="product"
                      />
                      <p>{umkm.jumlahProduk} Produk</p>
                    </div>
                    <div className="bg-primary mt-3 text-sm px-5 text-white py-1 w-fit rounded-4xl">
                      <p>{umkm.category.name}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}