import apiClient from './client';
import type { Umkm, UmkmListItem, AdminUmkmItem, Category } from '@/types';

export const umkmApi = {
  getAll: async (): Promise<UmkmListItem[]> => {
    const res = await apiClient.get('/umkm');
    return res.data.data;
  },

  getAllAdmin: async (): Promise<AdminUmkmItem[]> => {
    const res = await apiClient.get('/umkm/admin');
    return res.data.data;
  },

  getById: async (id: string): Promise<Umkm> => {
    const res = await apiClient.get(`/umkm/${id}`);
    return res.data.data;
  },

  getCategories: async (): Promise<Category[]> => {
    const res = await apiClient.get('/umkm/category');
    return res.data.data;
  },

  getPreview: async (): Promise<UmkmListItem[]> => {
    const res = await apiClient.get('/umkm/preview');
    return res.data.data;
  },

  register: async (formData: FormData): Promise<Umkm> => {
    const res = await apiClient.post('/umkm/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  update: async (id: string, formData: FormData): Promise<Umkm> => {
    const res = await apiClient.patch(`/umkm/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/umkm/${id}`);
  },

  approve: async (id: string): Promise<void> => {
    await apiClient.patch(`/umkm/approve/${id}`);
  },

  registerProduct: async (formData: FormData): Promise<void> => {
    await apiClient.post('/umkm/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  updateProduct: async (id: string, formData: FormData): Promise<void> => {
    await apiClient.patch(`/umkm/product/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  createCategory: async (name: string): Promise<Category> => {
    const res = await apiClient.post('/umkm/category', { name });
    return res.data.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(`/umkm/category/${id}`);
  },
};
