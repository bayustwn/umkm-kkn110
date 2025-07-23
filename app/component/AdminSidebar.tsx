import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) => pathname?.startsWith(path);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.classList.add("overflow-hidden");
            document.documentElement.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
            document.documentElement.classList.remove("overflow-hidden");
        };
    }, [open]);

    const sidebarContent = (
        <div className="flex flex-col h-full w-full max-w-[280px] bg-white md:w-[230px] md:px-0 md:py-0 justify-between">
            <div>
                <div className="flex items-center gap-2 mb-10">
                    <img src="/logo/logo.svg" width={100} alt="logo" />
                </div>
                <nav className="flex flex-col gap-3">
                    <Link href="/admin/dashboard" onClick={() => setOpen(false)}>
                        <div className={`flex items-center gap-3 px-5 py-3 rounded-full font-medium cursor-pointer transition-all ${isActive('/admin/dashboard') ? 'bg-primary text-white' : 'px-5 hover:px-7 text-black'}`}>
                            <img src={isActive('/admin/dashboard') ? "/icons/active/home.svg" : "/icons/home.svg"} alt="home" />
                            Dashboard
                        </div>
                    </Link>
                    <Link href="/admin/berita" onClick={() => setOpen(false)}>
                        <div className={`flex items-center gap-3 py-3 rounded-full font-medium cursor-pointer transition-all ${isActive('/admin/berita') ? 'bg-primary text-white px-7' : 'px-5 hover:px-7 text-black'}`}>
                            <img src={isActive('/admin/berita') ? "/icons/active/news.svg" : "/icons/news.svg"} alt="news" />
                            Berita
                        </div>
                    </Link>
                    <Link href="/admin/umkm" onClick={() => setOpen(false)}>
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-full font-medium cursor-pointer transition-all ${isActive('/admin/umkm') ? 'bg-primary text-white' : 'px-5 hover:px-7 text-black'}`}>
                            <img src={isActive('/admin/umkm') ? "/icons/active/umkm.svg" : "/icons/umkm.svg"} alt="umkm" />
                            UMKM
                        </div>
                    </Link>
                </nav>
            </div>
            <button className="flex items-center gap-3 px-4 py-3 rounded-full font-medium bg-primary/10 text-red-500 hover:bg-primary/20 transition-all w-full">
                <div className="w-5 h-5 bg-primary/30 rounded"></div>
                Logout
            </button>
        </div>
    );

    return (
        <>
            <button
                className="md:hidden fixed top-4 left-4 z-50 text-primary p-2 rounded-lg shadow"
                onClick={() => setOpen(true)}
                aria-label="Open sidebar"
            >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <div className="hidden md:flex fixed left-0 top-0 h-screen z-30 w-[280px] px-6 py-8 bg-white border-r flex-col justify-between">
                {sidebarContent}
            </div>

            {open && (
                <>
                    <div
                        className="fixed inset-0 bg-black/40 z-40"
                        style={{ touchAction: "none" }}
                        onClick={() => setOpen(false)}
                    />
                    <div className="fixed inset-0 h-screen w-[80vw] max-w-[280px] bg-white z-50 shadow-lg animate-slideIn px-6 py-8 flex flex-col justify-between overflow-hidden">
                        <button
                            className="absolute top-4 right-4 text-gray-500"
                            onClick={() => setOpen(false)}
                            aria-label="Close sidebar"
                        >
                            ✕
                        </button>
                        {sidebarContent}
                    </div>
                </>
            )}

            <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.2s ease;
        }
      `}</style>
        </>
    );
} 