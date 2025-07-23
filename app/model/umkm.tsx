import { Category } from "./category";
import { Product } from "./product";

export interface PreviewUmkm {
    id: string;          
    name: string;
    address: string;
    phone: string;
    description: string;
    status?: string | null;
    image?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    category: string;
    jumlahProduk: number;
  }

  export interface DetailUmkm {
    id: string;          
    name: string;
    address: string;
    phone: string;
    description: string;
    status?: string | null;
    image?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    category: Category;
    product: Product[];
    jumlahProduk: number;
  }