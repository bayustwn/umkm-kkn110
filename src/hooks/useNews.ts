import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../api/newsApi';
import toast from 'react-hot-toast';

export function useNews() {
  return useQuery({
    queryKey: ['news'],
    queryFn: newsApi.getAll,
  });
}

export function useNewsById(id: string | undefined) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getById(id!),
    enabled: !!id,
  });
}

export function useOtherNews(id: string | undefined) {
  return useQuery({
    queryKey: ['news', 'other', id],
    queryFn: () => newsApi.getOther(id!),
    enabled: !!id,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => newsApi.create(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Berita berhasil ditambahkan!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan berita');
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      newsApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Berita berhasil diperbarui!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui berita');
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => newsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('Berita berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus berita');
    },
  });
}
