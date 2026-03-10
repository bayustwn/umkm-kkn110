import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { umkmApi } from '@/api/umkmApi';
import toast from 'react-hot-toast';

export function useUmkm() {
  return useQuery({
    queryKey: ['umkm'],
    queryFn: umkmApi.getAll,
  });
}

export function useUmkmAdmin() {
  return useQuery({
    queryKey: ['umkm', 'admin'],
    queryFn: umkmApi.getAllAdmin,
  });
}

export function useUmkmById(id: string | undefined) {
  return useQuery({
    queryKey: ['umkm', id],
    queryFn: () => umkmApi.getById(id!),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: umkmApi.getCategories,
  });
}

export function useUmkmPreview() {
  return useQuery({
    queryKey: ['umkm', 'preview'],
    queryFn: umkmApi.getPreview,
  });
}

export function useRegisterUmkm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => umkmApi.register(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menambahkan UMKM');
    },
  });
}

export function useUpdateUmkm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      umkmApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal memperbarui UMKM');
    },
  });
}

export function useDeleteUmkm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => umkmApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
      toast.success('UMKM berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus UMKM');
    },
  });
}

export function useApproveUmkm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => umkmApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['umkm'] });
      toast.success('UMKM berhasil disetujui');
    },
    onError: () => {
      toast.error('Gagal menyetujui UMKM');
    },
  });
}

export function useRegisterProduct() {
  return useMutation({
    mutationFn: (formData: FormData) => umkmApi.registerProduct(formData),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal upload produk');
    },
  });
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      umkmApi.updateProduct(id, formData),
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal update produk');
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => umkmApi.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil ditambahkan');
    },
    onError: () => {
      toast.error('Gagal menambahkan kategori');
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => umkmApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Kategori berhasil dihapus');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Gagal menghapus kategori');
    },
  });
}
