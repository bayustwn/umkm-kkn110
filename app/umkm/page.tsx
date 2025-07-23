"use client";

import Footer from "@/app/component/footer";
import Title from "../component/title";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { PreviewUmkm } from "../model/umkm";
import api from "../utils/api";
import { Category } from "../model/category";

function UmkmSkeletonGrid({ count = 6 }) {
    return (
        <div className="grid grid-cols-2 gap-5 mt-10">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="flex flex-row gap-4 items-center animate-pulse">
                    <div className="bg-gray-200 w-50 h-50 rounded-md" />
                    <div className="flex flex-col gap-2 w-full">
                        <div className="bg-gray-200 h-6 w-2/3 rounded mb-3" />
                        <div className="flex flex-row text-sm gap-2">
                            <div className="bg-gray-200 h-4 w-4 rounded" />
                            <div className="bg-gray-200 h-4 w-1/2 rounded" />
                        </div>
                        <div className="flex text-sm flex-row gap-2">
                            <div className="bg-gray-200 h-4 w-4 rounded" />
                            <div className="bg-gray-200 h-4 w-1/3 rounded" />
                        </div>
                        <div className="bg-gray-200 mt-3 h-5 w-1/3 rounded-4xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function UmkmSkeletonHorizontal({ count = 5 }) {
    return (
        <div className="flex flex-row gap-5 mt-5">
            {Array.from({ length: count }).map((_, idx) => (
                <div key={idx} className="flex flex-col cursor-pointer animate-pulse">
                    <div className="relative">
                        <div className="bg-gray-200 w-100 rounded-md h-50 object-cover" />
                        <div className="absolute top-3 left-3">
                            <div className="bg-gray-200 px-3 text-sm py-1 rounded-4xl w-16 h-6" />
                        </div>
                    </div>
                    <div className="bg-gray-200 h-6 w-24 mt-4 rounded" />
                    <div className="flex flex-row gap-2 mt-4">
                        <div className="bg-gray-200 w-3 h-3 rounded" />
                        <div className="bg-gray-200 h-4 w-20 rounded" />
                    </div>
                    <div className="flex flex-row gap-2 mt-2">
                        <div className="bg-gray-200 w-3 h-3 rounded" />
                        <div className="bg-gray-200 h-4 w-16 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function UMKMPage() {
    const [allUmkm, setAllUmkm] = useState<PreviewUmkm[]>();
    const [category, setCategory] = useState<Category[]>();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const getAllUmkm = async () => {
        try {
            setIsLoading(true);
            await api.get("/umkm").then(res => {
                setAllUmkm(res.data.data);
            });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const getAllCategory = async () => {
        try {
            await api.get("/umkm/category").then(res => {
                setCategory(res.data.data);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const router = useRouter();

    const toDetail = (id:string) => {
        router.push(window.location.pathname + "/" + id);
    };

    useEffect(() => {
        getAllUmkm();
        getAllCategory();
    }, []);

    const filteredUmkm = selectedCategory && selectedCategory !== "SEMUA"
        ? allUmkm?.filter((umkm) => umkm.category === selectedCategory)
        : allUmkm;

    const searchedUmkm = search.trim() !== ""
        ? allUmkm?.filter((umkm) => umkm.name.toLowerCase().includes(search.toLowerCase()))
        : null;

    const showGrid = (search.trim() !== "") || (selectedCategory && selectedCategory !== "SEMUA");
    const umkmToShow = search.trim() !== "" ? searchedUmkm : filteredUmkm;

    return (
        <div>
            <section>
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
                            placeholder="Cari UMKM"
                            className=" py-2 pl-12 pr-4 w-full rounded-4xl border-2 border-primary outline-none"
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setIsSearching(true);
                                if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
                                searchTimeoutRef.current = setTimeout(() => setIsSearching(false), 400);
                            }}
                        />
                    </div>
                </div>
                {search.trim() === "" && (
                    <div className="flex flex-row gap-3 mt-10">
                        {category?.map((cat, index) => {
                            const isSelected = selectedCategory === cat.name;
                            return (
                                <div
                                    key={index}
                                    className={`border-2 ${isSelected ? "bg-primary text-white" : "hover:bg-primary hover:text-white text-primary"} transition-all cursor-pointer font-medium rounded-4xl border-primary px-5 py-1`}
                                    onClick={() => setSelectedCategory(cat.name)}
                                >
                                    <p>{cat.name}</p>
                                </div>
                            );
                        })}
                        {!isLoading && (
                        <div
                            className={`border-2 ${selectedCategory === null || selectedCategory === "SEMUA" ? "bg-primary text-white" : "text-primary"} transition-all cursor-pointer font-medium rounded-4xl border-primary px-5 py-1`}
                            onClick={() => setSelectedCategory("SEMUA")}
                        >
                            <p>Semua</p>
                        </div>) }
                    </div>
                )}

                {isLoading ? (
                    <>
                        <div className="flex flex-col gap-3 mt-10">
                            <div className="h-8 w-60 bg-gray-200 rounded mb-3 animate-pulse" />
                            <UmkmSkeletonHorizontal count={5} />
                        </div>
                        <div className="mt-15 flex-col gap-3">
                            <div className="h-8 w-60 bg-gray-200 rounded mb-3 animate-pulse" />
                            <UmkmSkeletonGrid count={6} />
                        </div>
                    </>
                ) : showGrid ? (
                    (isSearching) ? (
                        <UmkmSkeletonGrid count={6} />
                    ) : (
                        <div className="grid grid-cols-2 gap-5 mt-10">
                            {umkmToShow?.map((umkm, index) => (
                                <div key={index} className="flex hover:scale-103 transition-all flex-row gap-4 items-center">
                                    <img
                                        className="object-cover w-50 h-50 rounded-md"
                                        src={umkm.image || ""}
                                        alt="umkm"
                                    />
                                    <div className="flex flex-col gap-2">
                                        <h1 className="font-bold text-lg mb-3">
                                            {umkm.name}
                                        </h1>
                                        <div className="flex flex-row text-sm gap-2">
                                            <img
                                                src="icons/location.svg"
                                                className="w-3"
                                                alt="location"
                                            />
                                            <p>{umkm.address}</p>
                                        </div>
                                        <div className="flex text-sm flex-row gap-2">
                                            <img
                                                src="icons/product.svg"
                                                className="w-3"
                                                alt="product"
                                            />
                                            <p>{umkm.jumlahProduk} Produk</p>
                                        </div>
                                        <div className="bg-primary mt-3 text-sm px-5 text-white py-1 w-fit rounded-4xl">
                                            <p>{umkm.category}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {umkmToShow && umkmToShow.length === 0 && (
                                <div className="col-span-2 text-center h-50 pt-25">UMKM tidak ditemukan.</div>
                            )}
                        </div>
                    )
                ) : (
                    <>
                        <div className="flex flex-col gap-3 mt-10">
                            <Title size="text-2xl" title="Rekomendasi Untuk Anda" />
                            <div className="flex flex-row gap-5 mt-5">
                                {filteredUmkm?.filter((_, index) => index <= 4).map((umkm, index) => {
                                    return (
                                        <div key={umkm.id} onClick={() => {
                                            toDetail(umkm.id);
                                        }} className="flex flex-col hover:scale-103 transition-all cursor-pointer">
                                            <div className="relative">
                                                <img src={umkm.image || ""} className="w-100 rounded-md h-50 object-cover" alt="umkm" />
                                                <div className="absolute top-3 left-3">
                                                    <div className="bg-primary px-3 text-sm py-1 rounded-4xl">
                                                        <p className="text-white">{umkm.category}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <h1 className="font-bold text-lg mt-4">
                                                {umkm.name}
                                            </h1>
                                            <div>
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
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="mt-15 flex-col gap-3">
                            <Title size="text-2xl" title="UMKM Manukan Wetan" />
                            <div className="grid grid-cols-2 gap-5 mt-10">
                                {filteredUmkm?.filter((_, index) => index > 4).map((umkm, index) => {
                                    return (
                                        <div key={index} onClick={()=>toDetail(umkm.id)} className="flex cursor-pointer hover:scale-103 transition-all flex-row gap-4 items-center">
                                            <img
                                                className="object-cover w-50 h-50 rounded-md"
                                                src={umkm.image || ""}
                                                alt="umkm"
                                            />
                                            <div className="flex flex-col gap-2">
                                                <h1 className="font-bold text-lg mb-3">
                                                    {umkm.name}
                                                </h1>
                                                <div className="flex flex-row text-sm gap-2">
                                                    <img
                                                        src="icons/location.svg"
                                                        className="w-3"
                                                        alt="location"
                                                    />
                                                    <p>{umkm.address}</p>
                                                </div>
                                                <div className="flex text-sm flex-row gap-2">
                                                    <img
                                                        src="icons/product.svg"
                                                        className="w-3"
                                                        alt="product"
                                                    />
                                                    <p>{umkm.jumlahProduk} Produk</p>
                                                </div>
                                                <div className="bg-primary mt-3 text-sm px-5 text-white py-1 w-fit rounded-4xl">
                                                    <p>{umkm.category}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </>
                )}
                <Footer />
            </section>
            <div>
                <div className="mt-10 bg-primary py-3 flex justify-center">
                    <p className="text-white">@Crafted With Love</p>
                </div>
            </div>
        </div>
    );
}
