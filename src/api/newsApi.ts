import apiClient from './client';
import type { News } from '../types';

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

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/news/${id}`);
  },
};
