"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const toBerita = () => {
    router.push("/berita");
  };

  const toUMKM = () => {
    router.push("/umkm");
  }

  const toRegis = () =>{
    router.push("/umkm/registrasi")
  }

  return (
    <nav className="flex justify-between items-center">
      <img src="logo/logo.svg" className="w-25" alt="logo" />
      <div className="font-medium flex flex-row gap-8 items-center">
        {[
          "Tentang",
          "Berita",
          "UMKM"
        ].map((text, index) => (
          <a
            key={index}
            onClick={() => {
              if (text === "Berita") toBerita();
              else if (text === "UMKM") toUMKM();
            }}
            className="relative cursor-pointer after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            {text}
          </a>
        ))}
        <a
          onClick={()=> toRegis()}
          className="text-white cursor-pointer hover:bg-secondary hover:text-primary transition-all border border-primary font-medium text-black flex justify-center bg-primary px-8 py-2 rounded-full"
        >
          Registrasi UMKM
        </a>
      </div>
    </nav>
  );
}
