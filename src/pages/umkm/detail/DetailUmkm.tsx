import Navbar from "../../../components/Navbar";
import Api from "../../../components/Api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function DetailUmkm() {
    const [umkm,setUmkm] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const {id} = useParams()

    const getUmkmById = async () => {
        try {
            setIsLoading(true);
            await Api.get(`/umkm/${id}`).then(res=>{
                setUmkm(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data umkm")
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        getUmkmById()
    },[id])

    const handleBeli = (productName: string) => {
        const nomor = umkm.phone?.replace(/\D/g, '') || '6285156203867'; // Remove non-digits and use fallback
        const pesan = `Permisi dengan umkm ${umkm.name}, saya ingin membeli ${productName}. Mohon bantuannya terima kasih`;
        const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
        window.open(url, '_blank');
    }

    const handleHubungiUmkm = () => {
        const nomor = umkm.phone?.replace(/\D/g, '') || '6285156203867'; // Remove non-digits and use fallback
        const pesan = `Permisi saya apa benar ini dengan umkm ${umkm.name}?`;
        const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
        window.open(url, '_blank');
    }

    // Full screen loading
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <img src="/icons/loading.svg" alt="Loading" className="w-16 h-16 animate-spin" />
                    <p className="text-gray-600 text-lg">Memuat detail UMKM...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-screen">
            <img
                src={umkm.image}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
            <div className="relative flex flex-col z-10 px-3 md:px-0 py-10 px-6 md:py-[3%] md:px-[6%] text-white h-full">
                <Navbar />
                <div className="flex gap-3 md:gap-5 flex-col h-full justify-center w-full md:w-[50%]">
                    <div className="w-fit md:text-md text-sm bg-primary rounded-full px-5 font-semibold text-white py-1">
                        <p>{umkm.category?.name}</p>
                    </div>
                    <h1 className="font-bold text-2xl md:text-5xl">{umkm.name}</h1>
                    <p className="md:max-w-[80%] md:text-lg text-sm">{umkm.description}</p>
                    <div className="flex flex-col my-2 gap-2 md:gap-4">
                        <div className="flex flex-col md:flex-row gap-2 md:gap-5">
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/icons/location.svg" alt="location" className="w-4 h-4 md:w-5 md:h-5" />
                                <p>{umkm.address}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <img src="/icons/product.svg" alt="product" className="w-4 h-4 md:w-5 md:h-5" />
                                <p>{umkm.product?.length} Produk</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-1 items-center">
                            <img src="/icons/phone.svg" alt="product" className="w-5 h-5 md:w-6 md:h-6" />
                            <p>{umkm.phone}</p>
                        </div>
                    </div>
                    <p className="text-md font-medium mt-1 cursor-pointer w-fit hover:pl-1 pl-0 transition-all text-white md:text-primary" onClick={handleHubungiUmkm}>Hubungi UMKM →</p>
                </div>
            </div>
            <div className="py-10 px-5 md:px-0 md:py-[3%] md:px-[6%]">
                <div className="flex flex-col gap-5">
                    <h1 className="font-bold text-2xl">Lokasi UMKM</h1>
                    <iframe
                        src={`https://maps.google.com/maps?q=${umkm.latitude && umkm.longitude ? `${umkm.latitude},${umkm.longitude}` : umkm.address}&z=20&output=embed`}
                        className="w-full h-80 md:h-100 rounded-lg"
                        loading="lazy">
                    </iframe>
                </div>
                <div className="flex flex-col gap-5 mt-10">
                    <h1 className="font-bold text-2xl">Produk UMKM</h1>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-5">
                        {umkm.product?.map((product:any, index:any) => {
                            return (
                                <div key={index} className="flex flex-col gap-2">
                                    <img src={product.image} alt="umkm" className="w-full object-cover h-40 md:h-50 rounded-lg" />
                                    <h1 className="font-bold md:text-xl">{product.name}</h1>
                                    <p className="md:text-sm text-xs">{product.description}</p>
                                    <div className="flex flex-row items-center mt-5 justify-between">
                                        <div className="flex flex-col gap-1">
                                            <p className="md:text-sm text-xs">Harga</p>
                                            <p className="text-xs md:text-lg font-bold">Rp {product.price}</p>
                                        </div>
                                        <div className="w-fit bg-primary md:text-md text-xs rounded-full md:px-6 px-5 font-semibold text-white py-1 md:py-2 cursor-pointer" onClick={() => handleBeli(product.name)}>
                                            <p>Beli</p>
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