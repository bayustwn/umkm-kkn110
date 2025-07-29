import { useNavigate } from "react-router-dom"

export default function NotFound(){

    const navigate = useNavigate()

    return (
        <div className="flex h-screen w-screen justify-center items-center">
            <div className="flex flex-col gap-2 items-center">
                <h1 className="font-bold text-4xl text-primary">404</h1>
                <p className="font-medium text-lg">Halaman tidak ditemukan</p>
                <button onClick={() => navigate("/",{replace:true})}  className="cursor-pointer hover:bg-primary/90 transition-all bg-primary text-white px-4 py-2 rounded-full mt-2">
                    <p>Kembali ke Beranda</p>
                </button>
            </div>
        </div>
    )
}