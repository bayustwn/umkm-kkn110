// ============================================
// Entity Types
// ============================================

export interface Category {
  id: string;
  name: string;
}

export interface UmkmProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface Umkm {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'pending';
  category: Category;
  product: UmkmProduct[];
}

/** UMKM list item (from /umkm endpoint — flattened) */
export interface UmkmListItem {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  category: string;
  hargaTermurah: number;
  jumlahProduk: number;
}

/** UMKM list item (from /dashboard endpoint — nested category) */
export interface UmkmDashboardItem {
  id: string;
  name: string;
  description: string;
  image: string;
  address: string;
  category: Category;
  hargaTermurah: number;
  _count: { product: number };
}

export interface News {
  id: string;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

export interface UserInfo {
  telp: string;
  email: string;
  instagram: string;
}

// ============================================
// API Response Types
// ============================================

export interface DashboardResponse {
  news: {
    total: number;
    items: News[];
  };
  umkm: {
    total: number;
    items: UmkmDashboardItem[];
  };
}

export interface DashboardStats {
  totalBerita: number;
  totalUmkmAktif: number;
  totalUmkmPending: number;
}

export interface AdminUmkmItem {
  id: string;
  name: string;
  address: string;
  image: string;
  status: string;
  category: string;
}

// ============================================
// Form / Input Types
// ============================================

export interface RegisterProductInput {
  nama: string;
  deskripsi: string;
  harga: string;
  foto: File | null;
}

export interface RegisterUmkmInput {
  foto: File | null;
  nama: string;
  telp: string;
  deskripsi: string;
  kategori: string;
  alamat: string;
  latitude: number;
  longitude: number;
  produk: RegisterProductInput[];
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface UpdateProfileInput {
  telp?: string;
  email?: string;
  instagram?: string;
  currentPassword?: string;
  newPassword?: string;
}
