import apiClient from './client';
import type { DashboardResponse } from '@/types';

export const dashboardApi = {
  getDashboard: async (): Promise<DashboardResponse> => {
    const res = await apiClient.get('/dashboard');
    return res.data.data;
  },
};
