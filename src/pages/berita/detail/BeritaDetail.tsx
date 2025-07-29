import { useParams } from "react-router-dom";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import RouterNavigation from "../../../utils/navigation";
import toast from "react-hot-toast";
import Api from "../../../components/Api";
import { useEffect, useState, useRef } from "react";
import { formatDate } from "../../../utils/formatDate";


export default function BeritaDetail() {
    const {goToBeritaDetail,goToBerita} = RouterNavigation()
    const {id} = useParams()
    const [news,setNews] = useState<any>(null)
    const [otherNews,setOtherNews] = useState<any>([])
    const [isLoading, setIsLoading] = useState(true);
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const getNewsById = async () => {
        try {
            await Api.get("/news/" + id).then(res=>{
                setNews(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data berita")
        }
    }

    const getOther = async () => {
        try {
            await Api.get("/news/other/" + id).then(res=>{
                setOtherNews(res.data.data)
            })
        } catch (error) {
            toast.error("Gagal mengambil data berita")
        }
    }

    const loadData = async () => {
        try {
            setIsLoading(true);
            await Promise.all([getNewsById(), getOther()]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        if (news?.content && textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [news?.content]);

    // Full screen loading
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <img src="/icons/loading.svg" alt="Loading" className="w-16 h-16 animate-spin" />
                    <p className="text-gray-600 text-lg">Memuat detail berita...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="py-10 px-5 md:px-0 md:py-[3%] md:px-[6%]" >
            <Navbar color="text-black" />
            <div className="flex flex-col md:flex-row gap-8 mt-12 md:mt-20">
                <div className="w-full md:w-[70%] text-sm md:text-lg flex flex-col gap-3">
                    <p className="text-black/80">{formatDate(news?.created_at)}</p>
                    <h1 className="text-3xl md:text-5xl font-semibold">{news?.title}</h1>
                    <img src={news?.image} className="w-full rounded-lg my-5 object-cover h-80 md:h-150" alt="umkm" />
                    <textarea 
                        ref={textareaRef}
                        value={news?.content} 
                        readOnly 
                        className="w-full resize-none border-none outline-none bg-transparent text-justify p-0 overflow-hidden"
                    />
                </div>
                <div className="w-full md:w-[30%] md:sticky md:top-8 h-fit">
                    <h1 className="font-semibold text-xl">Berita Lainnya</h1>
                    <div className="flex flex-col gap-1 md:gap-3 mt-5" >
                        {otherNews?.map((news:any, index:any) => {
                            return (
                                <div key={index} className="w-full flex flex-row gap-3 items-center mb-3">
                                    <img
                                        src={news?.image}
                                        className="h-30 md:h-35 rounded-md w-24 md:w-40 object-cover"
                                        alt="manukan"
                                    />
                                    <div className="flex flex-col gap-2 w-full">
                                        <p className="text-xs md:text-sm">{formatDate(news?.created_at)}</p>
                                        <h1 className="font-bold line-clamp-1">
                                            {news?.title}
                                        </h1>
                                        <p className="line-clamp-2 text-xs md:text-sm">
                                            {news?.content}
                                        </p>
                                        <p onClick={()=>goToBeritaDetail(news?.id)} className="text-xs md:text-sm font-medium mt-1 cursor-pointer w-fit hover:pl-1 pl-0 transition-all text-primary">Lihat →</p>
                                    </div>
                                </div>
                            )
                        })}
                        <div onClick={goToBerita} className="w-fit flex flex-row w-full mt-3 md:mt-1 justify-center">
                            <div className="border md:text-md text-sm cursor-pointer hover:scale-105 transition-all py-2 px-5 rounded-full">
                                <p>Lihat Selengkapnya...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}