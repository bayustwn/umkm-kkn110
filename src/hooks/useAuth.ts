import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/userApi';
import type { UpdateProfileInput } from '@/types';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

export function useLogin() {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      userApi.login(username, password),
    onSuccess: (data) => {
      Cookies.set('token', data.token);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Login gagal');
    },
  });
}

export function useUserInfo() {
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: userApi.getInfo,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => userApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success(data.message || 'Profil berhasil diperbarui!');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui profil');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    userApi.logout();
    queryClient.clear();
    window.location.href = '/admin/login';
  };
}
