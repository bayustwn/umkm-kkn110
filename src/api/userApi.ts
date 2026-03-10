import apiClient from './client';
import type { UserInfo, UpdateProfileInput } from '@/types';
import Cookies from 'js-cookie';

export const userApi = {
  login: async (
    username: string,
    password: string,
  ): Promise<{ token: string; message?: string }> => {
    const res = await apiClient.post('/user/login', { username, password });
    return res.data;
  },

  getInfo: async (): Promise<UserInfo> => {
    const res = await apiClient.get('/user/info');
    return res.data.data;
  },

  updateProfile: async (data: UpdateProfileInput): Promise<{ message: string }> => {
    const res = await apiClient.put('/user/update', data);
    return res.data;
  },

  logout: (): void => {
    Cookies.remove('token');
  },
};
