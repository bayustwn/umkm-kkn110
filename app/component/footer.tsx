'use client'

import { useRouter } from "next/navigation";

export default function Footer() {

  const router = useRouter()
  
  const toUMKM = () =>{
    router.push("/umkm")
  }

  const toBerita = () => {
    router.push("/berita")
  }

  return (
    <div className="mt-30 flex gap-40 flex-row items-start">
      <div className="flex flex-col max-w-90 items-start">
        <img src="/logo/logo.svg" alt="logo" />
        <p className="mt-5">
          Lorem Ipsum is simply dummy text of the printing pesetting industry.
          Lorem Ipsum has been.{" "}
        </p>
      </div>
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-primary text-lg font-bold">Informasi</h1>
        <p className="cursor-pointer hover:text-primary">Tentang</p>
        <p onClick={()=>toUMKM()} className="cursor-pointer hover:text-primary">Semua UMKM</p>
        <p onClick={()=> toBerita()} className="cursor-pointer hover:text-primary">Semua Berita</p>
      </div>
      <div className="flex flex-col gap-2 font-medium">
        <h1 className="text-primary text-lg font-bold">Kontak</h1>
        <p className="cursor-pointer hover:text-primary">Email</p>
        <a href="https://wa.me/6285156203867" target="_blank" className="cursor-pointer hover:text-primary">Whatsapp</a>
        <p className="cursor-pointer hover:text-primary">Instagram</p>
      </div>
    </div>
  );
}
