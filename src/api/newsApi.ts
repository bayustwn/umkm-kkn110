import apiClient from './client';
import type { News } from '@/types';

export const newsApi = {
  getAll: async (): Promise<News[]> => {
    const res = await apiClient.get('/news');
    return res.data.data;
  },

  getById: async (id: string): Promise<News> => {
    const res = await apiClient.get(`/news/${id}`);
    return res.data.data;
  },

  getOther: async (id: string): Promise<News[]> => {
    const res = await apiClient.get(`/news/other/${id}`);
    return res.data.data;
  },

  create: async (formData: FormData): Promise<News> => {
    const res = await apiClient.post('/news/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  update: async (id: string, formData: FormData): Promise<News> => {
    const res = await apiClient.patch(`/news/edit/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/news/${id}`);
  },
};
